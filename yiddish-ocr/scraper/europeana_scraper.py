"""
Scrape Europeana for historical Jewish postcards and letters.
Free API key: https://pro.europeana.eu/page/get-api — instant, no approval needed.

Usage:
    python europeana_scraper.py --api-key YOUR_KEY
"""

import argparse
import requests
import json
import re
import time
from pathlib import Path
from db import get_conn, init_db

IMAGES_DIR = Path(__file__).parent.parent / "data" / "images"
IMAGES_DIR.mkdir(parents=True, exist_ok=True)
HEADERS = {"User-Agent": "YiddishOCR-Research/1.0"}

QUERIES = [
    "postcard Jewish",
    "carte postale juif",
    "correspondence Hebrew",
    "Hebrew handwriting",
    "Yiddish script",
    "judaica handwritten",
    "Jewish letter 19th century",
    "postcard russia 1900",
    "Jewish immigration document",
    "synagogue postcard",
    "Israel postcard vintage",
    "Palestine postcard 1900",
]


def search(api_key: str, query: str, start: int = 1) -> dict:
    params = {
        "wskey": api_key,
        "query": query,
        "qf": "TYPE:IMAGE",
        "rows": 100,
        "start": start,
        "profile": "rich",
        "reusability": "open",
    }
    r = requests.get("https://api.europeana.eu/record/v2/search.json",
                     params=params, headers=HEADERS, timeout=20)
    r.raise_for_status()
    return r.json()


def download_image(url: str, item_id: str) -> str | None:
    safe_id = re.sub(r'[^a-zA-Z0-9_-]', '_', item_id)
    fname = f"europeana_{safe_id}.jpg"
    fpath = IMAGES_DIR / fname
    if fpath.exists():
        return fname
    try:
        r = requests.get(url, headers=HEADERS, timeout=20)
        if r.status_code != 200:
            return None
        fpath.write_bytes(r.content)
        return fname
    except Exception:
        return None


def save_item(item: dict):
    item_id = item.get("id", "").replace("/", "_")
    post_id = f"europeana_{item_id}"
    conn = get_conn()
    try:
        if conn.execute("SELECT id FROM posts WHERE id=?", (post_id,)).fetchone():
            conn.close()
            return 0

        title = item.get("title", [""])[0] if item.get("title") else ""
        desc = ""
        if item.get("dcDescription"):
            desc = item["dcDescription"][0] if isinstance(item["dcDescription"], list) else item["dcDescription"]
        if item.get("dcDescriptionLangAware"):
            for lang, texts in item["dcDescriptionLangAware"].items():
                desc += " " + " ".join(texts)

        img_url = item.get("edmIsShownBy") or (item.get("edmPreview", [""])[0] if item.get("edmPreview") else "")
        if not img_url:
            conn.close()
            return 0

        fname = download_image(img_url, item_id)
        if not fname:
            conn.close()
            return 0

        conn.execute(
            "INSERT INTO posts (id, source, group_url, post_url, post_date, post_text, raw_json) VALUES (?,?,?,?,?,?,?)",
            (post_id, "europeana",
             "https://europeana.eu",
             item.get("guid", ""),
             str(item.get("year", [""])[0] if item.get("year") else ""),
             title,
             json.dumps({"id": item.get("id"), "title": title})),
        )
        cursor = conn.execute(
            "INSERT INTO images (post_id, filename, url) VALUES (?,?,?)",
            (post_id, fname, img_url),
        )
        image_id = cursor.lastrowid

        # Transcription candidates: title, description, dcSubject
        subjects = item.get("dcSubject", [])
        if isinstance(subjects, str):
            subjects = [subjects]
        full_text = f"{title} {desc} {' '.join(subjects)}".strip()

        if full_text and len(full_text) > 20:
            has_heb = bool(re.search(r'[א-תיִ-פֿ]', full_text))
            has_cyr = bool(re.search(r'[Ѐ-ӿ]', full_text))
            lang = "yiddish" if has_heb else ("russian" if has_cyr else "unknown")
            script = "hebrew" if has_heb else ("cyrillic" if has_cyr else "latin")
            tid = conn.execute(
                "INSERT INTO transcriptions (image_id, source, commenter_name, language, script, raw_text) VALUES (?,?,?,?,?,?)",
                (image_id, "metadata", "europeana", lang, script, full_text[:2000]),
            ).lastrowid
            conn.execute(
                "INSERT INTO review_queue (image_id, transcription_id) VALUES (?,?)",
                (image_id, tid),
            )

        conn.commit()
        conn.close()
        return 1
    except Exception as e:
        conn.rollback()
        conn.close()
        print(f"    DB error: {e}")
        return 0


def run(api_key: str):
    init_db()
    total = 0
    seen = set()

    for query in QUERIES:
        print(f"\nSearching: {query}")
        for start in range(1, 501, 100):  # up to 500 results per query
            try:
                data = search(api_key, query, start)
            except Exception as e:
                print(f"  Error: {e}")
                break

            items = data.get("items", [])
            if not items:
                break
            print(f"  offset {start}: {len(items)} items (total hits: {data.get('totalResults', '?')})")

            for item in items:
                item_id = item.get("id", "")
                if item_id in seen:
                    continue
                seen.add(item_id)
                saved = save_item(item)
                total += saved
                time.sleep(0.3)

            time.sleep(1)

    print(f"\nEuropeana complete. Total: {total} images")


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--api-key", required=True,
                   help="Free key from https://pro.europeana.eu/page/get-api")
    args = p.parse_args()
    run(args.api_key)
