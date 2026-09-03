"""
Fine-tune microsoft/trocr-large-handwritten on Yiddish/Russian postcard data.
Runs on a Runpod GPU instance.

Setup on Runpod pod:
    pip install transformers datasets pillow torch torchvision evaluate jiwer

Upload your data first:
    scp -r data/training/ user@RUNPOD_IP:/workspace/training/

Usage:
    python train.py --data-dir /workspace/training --output-dir /workspace/checkpoints
"""

import argparse
import json
import os
from pathlib import Path
from PIL import Image
import torch
from torch.utils.data import Dataset, random_split
from transformers import (
    TrOCRProcessor,
    VisionEncoderDecoderModel,
    Seq2SeqTrainer,
    Seq2SeqTrainingArguments,
    default_data_collator,
)
import evaluate

MODEL_ID = "microsoft/trocr-large-handwritten"


class PostcardDataset(Dataset):
    def __init__(self, pairs: list[dict], processor, max_target_length: int = 128):
        self.pairs = pairs
        self.processor = processor
        self.max_target_length = max_target_length

    def __len__(self):
        return len(self.pairs)

    def __getitem__(self, idx):
        pair = self.pairs[idx]
        image = Image.open(pair["image_path"]).convert("RGB")

        # TrOCR expects pixel_values from the processor
        pixel_values = self.processor(image, return_tensors="pt").pixel_values.squeeze()

        # Tokenise the transcription
        labels = self.processor.tokenizer(
            pair["text"],
            padding="max_length",
            max_length=self.max_target_length,
            truncation=True,
        ).input_ids

        # Replace padding token id with -100 so it's ignored in loss
        labels = [l if l != self.processor.tokenizer.pad_token_id else -100 for l in labels]

        return {"pixel_values": pixel_values, "labels": torch.tensor(labels)}


def load_training_pairs(data_dir: str) -> list[dict]:
    """Load image+text pairs from the exported training directory."""
    data_dir = Path(data_dir)
    manifest = data_dir / "labels.json"

    if not manifest.exists():
        raise FileNotFoundError(f"labels.json not found in {data_dir}. Run export_training.py first.")

    with open(manifest) as f:
        pairs = json.load(f)

    # Verify images exist and filter bad pairs
    valid = []
    skipped = 0
    for p in pairs:
        img_path = data_dir / p["filename"]
        if not img_path.exists():
            skipped += 1
            continue
        text = p["transcription"].strip()
        if len(text) < 2:
            skipped += 1
            continue
        valid.append({"image_path": str(img_path), "text": text})

    print(f"Loaded {len(valid)} valid pairs ({skipped} skipped)")
    return valid


def compute_cer(pred, processor):
    """Compute Character Error Rate — our primary metric."""
    cer_metric = evaluate.load("cer")
    pred_ids = pred.predictions
    label_ids = pred.label_ids
    label_ids[label_ids == -100] = processor.tokenizer.pad_token_id

    pred_str = processor.batch_decode(pred_ids, skip_special_tokens=True)
    label_str = processor.batch_decode(label_ids, skip_special_tokens=True)

    cer = cer_metric.compute(predictions=pred_str, references=label_str)
    return {"cer": cer}


def train(data_dir: str, output_dir: str, epochs: int = 10, batch_size: int = 8):
    print(f"Loading model: {MODEL_ID}")
    processor = TrOCRProcessor.from_pretrained(MODEL_ID)
    model = VisionEncoderDecoderModel.from_pretrained(MODEL_ID)

    # Configure decoder
    model.config.decoder_start_token_id = processor.tokenizer.cls_token_id
    model.config.pad_token_id = processor.tokenizer.pad_token_id
    model.config.vocab_size = model.config.decoder.vocab_size

    # Generation config
    model.config.eos_token_id = processor.tokenizer.sep_token_id
    model.config.max_length = 128
    model.config.early_stopping = True
    model.config.no_repeat_ngram_size = 3
    model.config.length_penalty = 2.0
    model.config.num_beams = 4

    # Load data
    pairs = load_training_pairs(data_dir)
    if len(pairs) < 10:
        print("ERROR: Need at least 10 training pairs. Go review more in the UI!")
        return

    # 90/10 train/eval split
    dataset = PostcardDataset(pairs, processor)
    n_eval = max(1, int(len(pairs) * 0.1))
    n_train = len(pairs) - n_eval
    train_ds, eval_ds = random_split(dataset, [n_train, n_eval])
    print(f"Train: {n_train} | Eval: {n_eval}")

    training_args = Seq2SeqTrainingArguments(
        output_dir=output_dir,
        num_train_epochs=epochs,
        per_device_train_batch_size=batch_size,
        per_device_eval_batch_size=batch_size,
        predict_with_generate=True,
        eval_strategy="epoch",
        save_strategy="epoch",
        logging_steps=10,
        load_best_model_at_end=True,
        metric_for_best_model="cer",
        greater_is_better=False,  # lower CER = better
        fp16=torch.cuda.is_available(),
        dataloader_num_workers=2,
        report_to="none",
    )

    trainer = Seq2SeqTrainer(
        model=model,
        args=training_args,
        train_dataset=train_ds,
        eval_dataset=eval_ds,
        data_collator=default_data_collator,
        compute_metrics=lambda pred: compute_cer(pred, processor),
        tokenizer=processor.feature_extractor,
    )

    print(f"\nStarting training — {epochs} epochs, batch size {batch_size}")
    print(f"Checkpoints → {output_dir}")
    trainer.train()

    # Save final model
    final_dir = Path(output_dir) / "final"
    trainer.save_model(str(final_dir))
    processor.save_pretrained(str(final_dir))
    print(f"\n✓ Training complete. Model saved to {final_dir}")
    print("\nTo use the model:")
    print(f"  processor = TrOCRProcessor.from_pretrained('{final_dir}')")
    print(f"  model = VisionEncoderDecoderModel.from_pretrained('{final_dir}')")


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--data-dir", default="/workspace/training", help="Path to exported training pairs")
    p.add_argument("--output-dir", default="/workspace/checkpoints")
    p.add_argument("--epochs", type=int, default=10)
    p.add_argument("--batch-size", type=int, default=8)
    args = p.parse_args()
    train(args.data_dir, args.output_dir, args.epochs, args.batch_size)
