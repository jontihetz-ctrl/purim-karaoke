"""
Scrape Internet Archive for Yiddish postcard and letter collections.
Fully open — no auth needed.

Notable collections:
  - 'americana' with Yiddish subjects
  - YIVO-donated digitized collections
  - NYC Municipal Archives
  - Various donated family collections

Usage:
    python internet_archive_scraper.py
"""

import requests
import json
import time
from pathlib import Path
from db import get_conn, init_db

IMAGES_DIR = Path(__file__).parent.parent / "data" / "images"
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

HEADERS = {"User-Agent": "YiddishOCR-Research/1.0"}

SEARCHES = [
    'subject:"Yiddish" AND mediatype:image AND subject:"postcard"',
    'subject:"Yiddish" AND mediatype:image AND subject:"letters"',
    'subject:"Jewish" AND mediatype:image AND subject:"postcard" AND date:[1880 TO 1940]',
    'title:"Yiddish postcard" AND mediatype:texts',
    'subject:"Yiddish correspondence"',
    'contributor:"YIVO" AND mediatype:image',
    'subject:"Russian" AND mediatype:image AND subject:"postcard" AND date:[1880 TO 1920]',
]


def search_archive(query: str, rows: int = 50) -> list[dict]:
    url = "https://archive.org/advancedsearch.php"
    params = {
        "q": query,
        "fl": "identifier,title,description,subject,date,creator",
        "rows": rows,
        "output": "json",
        "sort": "downloads desc",
    }
    try:
        r = requests.get(url, params=params, headers=HEADERS, timeout=20)
        r.raise_for_status()
        return r.json().get("response", {}).get("docs", [])
    except Exception as e:
        print(f"  Search failed: {e}")
        return []


def get_item_files(identifier: str) -> list[dict]:
    url = f"https://archive.org/metadata/{identifier}/files"
    try:
        r = requests.get(url, headers=HEADERS, timeout=15)
        r.raise_for_status()
        return r.json().get("result", [])
    except Exception:
        return []


def get_item_metadata(identifier: str) -> dict:
    url = f"https://archive.org/metadata/{identifier}"
    try:
        r = requests.get(url, headers=HEADERS, timeout=15)
        r.raise_for_status()
        return r.json().get("metadata", {})
    except Exception:
        return {}


def download_image(identifier: str, filename: str, local_name: str) -> str | None:
    url = f"https://archive.org/download/{identifier}/{filename}"
    fpath = IMAGES_DIR / local_name
    if fpath.exists():
        return local_name
    try:
        r = requests.get(url, headers=HEADERS, timeout=30, stream=True)
        if r.status_code != 200:
            return None
        with open(fpath, "wb") as f:
            for chunk in r.iter_content(8192):
                f.write(chunk)
        return local_name
    except Exception as e:
        print(f"    Download failed {filename}: {e}")
        return None


def save_item(identifier: str, metadata: dict, image_files: list[dict], description: str):
    post_id = f"ia_{identifier}"
    conn = get_conn()
    try:
        existing = conn.execute("SELECT id FROM posts WHERE id=?", (post_id,)).fetchone()
        if existing:
            conn.close()
            return 0

        title = metadata.get("title", identifier)
        if isinstance(title, list):
            title = title[0]

        conn.execute(
            "INSERT INTO posts (id, source, group_url, post_url, post_date, post_text, raw_json) VALUES (?,?,?,?,?,?,?)",
            (
                post_id,
                "internet_archive",
                f"https://archive.org/details/{identifier}",
                f"https://archive.org/details/{identifier}",
                str(metadata.get("date", "")),
                str(title),
                json.dumps({"identifier": identifier, "metadata": metadata}),
            ),
        )

        saved = 0
        for img in image_files[:10]:  # max 10 images per item
            fname = img.get("name", "")
            if not any(fname.lower().endswith(ext) for ext in [".jpg", ".jpeg", ".png"]):
                continue

            local_name = f"ia_{identifier}_{fname.replace('/', '_')}"
            dl = download_image(identifier, fname, local_name)
            if not dl:
                continue

            cursor = conn.execute(
                "INSERT INTO images (post_id, filename, url) VALUES (?,?,?)",
                (post_id, local_name, f"https://archive.org/download/{identifier}/{fname}"),
            )
            image_id = cursor.lastrowid

            if description:
                trans_id = conn.execute(
                    "INSERT INTO transcriptions (image_id, source, commenter_name, language, script, raw_text) VALUES (?,?,?,?,?,?)",
                    (image_id, "metadata", "internet_archive", "unknown", "latin", description),
                ).lastrowid
                conn.execute(
                    "INSERT INTO review_queue (image_id, transcription_id) VALUES (?,?)",
                    (image_id, trans_id),
                )
            saved += 1
            time.sleep(0.5)

        conn.commit()
        conn.close()
        return saved
    except Exception as e:
        conn.rollback()
        conn.close()
        print(f"    DB error: {e}")
        return 0


def run():
    init_db()
    total = 0

    for query in SEARCHES:
        print(f"\nSearching: {query[:70]}")
        results = search_archive(query, rows=50)
        print(f"  Found {len(results)} items")

        for item in results:
            identifier = item.get("identifier", "")
            if not identifier:
                continue

            title = item.get("title", identifier)
            desc = item.get("description", "")
            if isinstance(desc, list):
                desc = " ".join(desc)

            print(f"  → {identifier}: {str(title)[:50]}")

            metadata = get_item_metadata(identifier)
            files = get_item_files(identifier)

            image_files = [
                f for f in files
                if any(f.get("name", "").lower().endswith(ext) for ext in [".jpg", ".jpeg", ".png"])
            ]

            if not image_files:
                print(f"    No images found")
                continue

            saved = save_item(identifier, metadata, image_files, str(desc))
            total += saved
            print(f"    Saved {saved} images")
            time.sleep(2)

    print(f"\nInternet Archive scrape complete. Total images: {total}")


if __name__ == "__main__":
    run()
