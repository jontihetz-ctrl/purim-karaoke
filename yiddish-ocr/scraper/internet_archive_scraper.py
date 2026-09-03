"""
Scrape Internet Archive for Yiddish/Jewish postcard and letter images.
Fully open — no auth needed.

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

# Broad searches more likely to return results
SEARCHES = [
    'language:Yiddish AND mediatype:image',
    'subject:"Jewish postcards"',
    'subject:"Yiddish" AND mediatype:image',
    'collection:nationalyiddishbookcenter AND mediatype:image',
    'subject:"Postcard" AND language:Hebrew',
    'subject:"Jewish" AND subject:"correspondence" AND mediatype:image',
    'title:postcard AND subject:Jewish',
    'subject:"Russian postcard" AND date:[1880 TO 1920]',
    'subject:"immigration" AND subject:"letter" AND language:Yiddish',
    'contributor:"YIVO Institute"',
    'subject:"Shoah" AND mediatype:image AND subject:"letter"',
]

# Specific known collections worth pulling entirely
COLLECTIONS = [
    "nationalyiddishbookcenter",
    "yivoencyclopedia",
]


def search_archive(query: str, rows: int = 100, page: int = 1) -> list[dict]:
    params = {
        "q": query,
        "fl": "identifier,title,description,subject,date,creator,language",
        "rows": rows,
        "page": page,
        "output": "json",
        "sort": "downloads desc",
    }
    try:
        r = requests.get("https://archive.org/advancedsearch.php",
                         params=params, headers=HEADERS, timeout=20)
        r.raise_for_status()
        return r.json().get("response", {}).get("docs", [])
    except Exception as e:
        print(f"  Search error: {e}")
        return []


def get_item_metadata(identifier: str) -> dict:
    try:
        r = requests.get(f"https://archive.org/metadata/{identifier}",
                         headers=HEADERS, timeout=15)
        r.raise_for_status()
        return r.json()
    except Exception:
        return {}


def download_image(identifier: str, filename: str) -> str | None:
    local = f"ia_{identifier}_{filename.replace('/', '_')}"
    fpath = IMAGES_DIR / local
    if fpath.exists():
        return local
    url = f"https://archive.org/download/{identifier}/{filename}"
    try:
        r = requests.get(url, headers=HEADERS, timeout=30, stream=True)
        if r.status_code != 200:
            return None
        with open(fpath, "wb") as f:
            for chunk in r.iter_content(8192):
                f.write(chunk)
        return local
    except Exception as e:
        print(f"    Download failed {filename}: {e}")
        return None


def process_item(identifier: str):
    post_id = f"ia_{identifier}"
    conn = get_conn()
    if conn.execute("SELECT id FROM posts WHERE id=?", (post_id,)).fetchone():
        conn.close()
        return 0
    conn.close()

    meta_data = get_item_metadata(identifier)
    if not meta_data:
        return 0

    metadata = meta_data.get("metadata", {})
    files = meta_data.get("files", [])

    title = metadata.get("title", identifier)
    if isinstance(title, list):
        title = title[0]
    desc = metadata.get("description", "")
    if isinstance(desc, list):
        desc = " ".join(str(d) for d in desc)

    image_files = [
        f for f in files
        if any(f.get("name", "").lower().endswith(ext)
               for ext in [".jpg", ".jpeg", ".png"])
        and not f.get("name", "").startswith("__")
    ]

    if not image_files:
        return 0

    conn = get_conn()
    saved = 0
    try:
        conn.execute(
            "INSERT INTO posts (id, source, group_url, post_url, post_date, post_text, raw_json) VALUES (?,?,?,?,?,?,?)",
            (post_id, "internet_archive",
             f"https://archive.org/details/{identifier}",
             f"https://archive.org/details/{identifier}",
             str(metadata.get("date", "")),
             str(title),
             json.dumps({"identifier": identifier, "title": title})),
        )

        for img in image_files[:15]:
            fname = img.get("name", "")
            local = download_image(identifier, fname)
            if not local:
                continue

            cursor = conn.execute(
                "INSERT INTO images (post_id, filename, url) VALUES (?,?,?)",
                (post_id, local,
                 f"https://archive.org/download/{identifier}/{fname}"),
            )
            image_id = cursor.lastrowid

            if desc and len(str(desc)) > 20:
                tid = conn.execute(
                    "INSERT INTO transcriptions (image_id, source, commenter_name, language, script, raw_text) VALUES (?,?,?,?,?,?)",
                    (image_id, "metadata", "internet_archive",
                     "unknown", "latin", str(desc)[:2000]),
                ).lastrowid
                conn.execute(
                    "INSERT INTO review_queue (image_id, transcription_id) VALUES (?,?)",
                    (image_id, tid),
                )
            saved += 1
            time.sleep(0.3)

        conn.commit()
    except Exception as e:
        conn.rollback()
        print(f"    DB error: {e}")
    finally:
        conn.close()

    return saved


def run():
    init_db()
    total = 0
    seen = set()

    # Broad keyword searches
    for query in SEARCHES:
        print(f"\nSearching: {query[:70]}")
        for page in range(1, 4):
            results = search_archive(query, rows=50, page=page)
            if not results:
                break
            print(f"  Page {page}: {len(results)} items")

            for item in results:
                identifier = item.get("identifier", "")
                if not identifier or identifier in seen:
                    continue
                seen.add(identifier)

                title = item.get("title", identifier)
                print(f"  → {identifier}: {str(title)[:50]}")
                saved = process_item(identifier)
                total += saved
                if saved:
                    print(f"    ✓ {saved} images")
                time.sleep(1.5)

    # Pull specific collections
    for collection in COLLECTIONS:
        print(f"\nCollection: {collection}")
        results = search_archive(
            f"collection:{collection}",
            rows=100,
        )
        print(f"  {len(results)} items")
        for item in results:
            identifier = item.get("identifier", "")
            if not identifier or identifier in seen:
                continue
            seen.add(identifier)
            saved = process_item(identifier)
            total += saved
            time.sleep(1.5)

    print(f"\nInternet Archive complete. Total images: {total}")


if __name__ == "__main__":
    run()
