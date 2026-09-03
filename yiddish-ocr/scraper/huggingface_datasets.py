"""
Download existing Yiddish/Hebrew OCR datasets from HuggingFace and other sources.
These are pre-labeled — no review needed, go straight to training pairs.

Usage:
    python huggingface_datasets.py
"""

import requests
import json
import time
from pathlib import Path
from db import get_conn, init_db

IMAGES_DIR = Path(__file__).parent.parent / "data" / "images"
IMAGES_DIR.mkdir(parents=True, exist_ok=True)
HEADERS = {"User-Agent": "YiddishOCR-Research/1.0"}

# Known datasets on HuggingFace with Hebrew/Yiddish handwriting
HF_DATASETS = [
    "aharoni/hebrew-handwriting",
    "HaifaCL/hebrew-ocr",
    "imvladikon/yiddish_ocr",
    "historical-hebrew-ocr/hebrew-manuscripts",
]

# Direct download sources for labeled OCR data
DIRECT_SOURCES = [
    {
        "name": "IAM-like Yiddish handwriting (CJHDC)",
        "url": "https://raw.githubusercontent.com/yaelabs/yiddish-ocr-dataset/main/dataset.json",
        "type": "json_manifest",
    },
]


def check_hf_dataset(dataset_id: str) -> bool:
    """Check if a HuggingFace dataset exists and has image data."""
    url = f"https://huggingface.co/api/datasets/{dataset_id}"
    try:
        r = requests.get(url, headers=HEADERS, timeout=10)
        if r.status_code == 200:
            data = r.json()
            print(f"  ✓ Found: {dataset_id} — {data.get('description','')[:80]}")
            return True
        else:
            print(f"  ✗ Not found: {dataset_id}")
            return False
    except Exception:
        print(f"  ✗ Error checking: {dataset_id}")
        return False


def search_hf_for_yiddish() -> list[dict]:
    """Search HuggingFace for relevant datasets."""
    results = []
    for query in ["yiddish OCR", "hebrew handwriting", "historical hebrew", "yiddish handwriting"]:
        url = "https://huggingface.co/api/datasets"
        params = {"search": query, "limit": 20}
        try:
            r = requests.get(url, params=params, headers=HEADERS, timeout=15)
            if r.status_code == 200:
                datasets = r.json()
                for d in datasets:
                    did = d.get("id", "")
                    desc = d.get("description", "")
                    print(f"  Found: {did} — {str(desc)[:60]}")
                    results.append(d)
            time.sleep(0.5)
        except Exception as e:
            print(f"  Search error: {e}")
    return results


def save_prelabeled_pair(image_path: str, text: str, source: str, language: str = "yiddish"):
    """Save a pre-labeled pair directly to training_pairs (skip review queue)."""
    conn = get_conn()
    try:
        # Check if image file exists
        if not (IMAGES_DIR / image_path).exists():
            conn.close()
            return

        post_id = f"hf_{source}_{Path(image_path).stem}"
        if conn.execute("SELECT id FROM posts WHERE id=?", (post_id,)).fetchone():
            conn.close()
            return

        conn.execute(
            "INSERT INTO posts (id, source, group_url, post_url, post_text, raw_json) VALUES (?,?,?,?,?,?)",
            (post_id, "huggingface", f"https://huggingface.co/datasets/{source}",
             "", source, json.dumps({"source": source})),
        )
        cursor = conn.execute(
            "INSERT INTO images (post_id, filename) VALUES (?,?)",
            (post_id, image_path),
        )
        image_id = cursor.lastrowid

        # Pre-labeled — go straight to training pairs
        conn.execute(
            "INSERT INTO training_pairs (image_id, transcription, language) VALUES (?,?,?)",
            (image_id, text, language),
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        print(f"  DB error: {e}")
    finally:
        conn.close()


def run():
    init_db()

    print("=== Checking known HuggingFace datasets ===")
    for ds in HF_DATASETS:
        check_hf_dataset(ds)
        time.sleep(0.5)

    print("\n=== Searching HuggingFace for Yiddish/Hebrew datasets ===")
    found = search_hf_for_yiddish()
    if found:
        print(f"\nFound {len(found)} potentially relevant datasets.")
        print("To download a dataset, install: pip install datasets")
        print("Then run: python download_hf_dataset.py --dataset DATASET_ID")
    else:
        print("No pre-built datasets found — we're building the first one.")

    # Summary
    conn = get_conn()
    training = conn.execute("SELECT COUNT(*) FROM training_pairs").fetchone()[0]
    conn.close()
    print(f"\nPre-labeled training pairs in DB: {training}")
    print("(Most data goes through review queue first — that's fine)")


if __name__ == "__main__":
    run()
