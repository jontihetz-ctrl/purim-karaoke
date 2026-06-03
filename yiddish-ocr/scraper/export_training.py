"""
Export approved training pairs from the DB to a flat directory for Runpod upload.

Output layout:
    data/training/
        labels.json          ← list of {filename, transcription}
        <image files>        ← copied/renamed from data/images/

Usage:
    python export_training.py [--out-dir ../data/training]
"""

import argparse
import json
import shutil
from pathlib import Path
from db import get_conn

IMAGES_DIR = Path(__file__).parent.parent / "data" / "images"


def export(out_dir: str):
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)

    conn = get_conn()
    rows = conn.execute("""
        SELECT tp.transcription, i.filename
        FROM training_pairs tp
        JOIN images i ON i.id = tp.image_id
        WHERE tp.transcription IS NOT NULL AND length(trim(tp.transcription)) >= 2
        ORDER BY tp.id
    """).fetchall()
    conn.close()

    if not rows:
        print("No approved training pairs in DB yet.")
        print("Run the review UI first:  cd ../review-ui && python app.py")
        return

    pairs = []
    skipped = 0
    for transcription, filename in rows:
        src = IMAGES_DIR / filename
        if not src.exists():
            skipped += 1
            continue
        dst = out / filename
        if not dst.exists():
            shutil.copy2(src, dst)
        pairs.append({"filename": filename, "transcription": transcription.strip()})

    labels_path = out / "labels.json"
    with open(labels_path, "w", encoding="utf-8") as f:
        json.dump(pairs, f, ensure_ascii=False, indent=2)

    print(f"Exported {len(pairs)} pairs → {out}")
    if skipped:
        print(f"  ({skipped} skipped — image file missing)")
    print(f"\nNext steps:")
    print(f"  1. scp -r {out} user@RUNPOD_IP:/workspace/training/")
    print(f"  2. On Runpod: python train.py --data-dir /workspace/training --output-dir /workspace/checkpoints")


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--out-dir", default="../data/training", help="Output directory for Runpod upload")
    args = p.parse_args()
    export(args.out_dir)
