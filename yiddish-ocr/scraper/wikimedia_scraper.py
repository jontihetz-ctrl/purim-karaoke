"""
Scrape Wikimedia Commons for historical Jewish/Yiddish postcard images.
Fully open — no auth needed. MediaWiki API.

Usage:
    python wikimedia_scraper.py
"""

import requests
import json
import re
import time
from pathlib import Path
from db import get_conn, init_db

IMAGES_DIR = Path(__file__).parent.parent / "data" / "images"
IMAGES_DIR.mkdir(parents=True, exist_ok=True)
HEADERS = {"User-Agent": "YiddishOCR-Research/1.0 (academic; github.com/jontihetz-ctrl/purim-karaoke)"}
API = "https://commons.wikimedia.org/w/api.php"

# Categories with historical handwritten Yiddish/Jewish content
CATEGORIES = [
    "Category:Jewish_postcards",
    "Category:Yiddish_postcards",
    "Category:Jewish_correspondence",
    "Category:Postcards_from_the_Russian_Empire",
    "Category:Historical_Jewish_documents",
    "Category:Postcards_from_Poland",
    "Category:Postcards_from_Ukraine",
    "Category:Postcards_from_Lithuania",
    "Category:Hebrew_manuscripts",
    "Category:Yiddish_manuscripts",
    "Category:Letters_(correspondence)_in_Yiddish",
    "Category:Jewish_letters",
    "Category:Theresienstadt_postcards",
    "Category:Postcards_of_Jewish_life",
]

SEARCH_TERMS = [
    "yiddish postcard handwritten",
    "jewish letter 1900",
    "hebrew postcard vintage",
    "jewish correspondence historical",
    "yiddish manuscript",
]


def search_commons(query: str, continue_param=None) -> dict:
    params = {
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrsearch": f"filetype:bitmap {query}",
        "gsrnamespace": 6,  # File namespace
        "gsrlimit": 50,
        "prop": "imageinfo|categories",
        "iiprop": "url|size|mime|extmetadata",
        "iiurlwidth": 1200,
    }
    if continue_param:
        params.update(continue_param)
    r = requests.get(API, params=params, headers=HEADERS, timeout=20)
    r.raise_for_status()
    return r.json()


def get_category_members(category: str, continue_param=None) -> dict:
    params = {
        "action": "query",
        "format": "json",
        "list": "categorymembers",
        "cmtitle": category,
        "cmtype": "file",
        "cmlimit": 100,
        "prop": "imageinfo",
        "iiprop": "url|size|mime|extmetadata",
    }
    if continue_param:
        params.update(continue_param)
    r = requests.get(API, params=params, headers=HEADERS, timeout=20)
    r.raise_for_status()
    return r.json()


def get_file_info(page_id: int) -> dict | None:
    params = {
        "action": "query",
        "format": "json",
        "pageids": page_id,
        "prop": "imageinfo|categories",
        "iiprop": "url|size|mime|extmetadata",
        "iiurlwidth": 1200,
    }
    r = requests.get(API, params=params, headers=HEADERS, timeout=15)
    r.raise_for_status()
    pages = r.json().get("query", {}).get("pages", {})
    return list(pages.values())[0] if pages else None


def extract_text_from_metadata(extmeta: dict) -> str:
    parts = []
    for field in ["ImageDescription", "Artist", "Credit", "ObjectName"]:
        val = extmeta.get(field, {}).get("value", "")
        if val:
            # Strip HTML tags
            val = re.sub(r'<[^>]+>', ' ', val).strip()
            if len(val) > 5:
                parts.append(val)
    return " | ".join(parts)


def download_image(url: str, filename: str) -> str | None:
    safe = re.sub(r'[^a-zA-Z0-9._-]', '_', filename)[:80]
    fname = f"wiki_{safe}"
    fpath = IMAGES_DIR / fname
    if fpath.exists():
        return fname
    try:
        r = requests.get(url, headers=HEADERS, timeout=30)
        if r.status_code != 200:
            return None
        ct = r.headers.get("content-type", "")
        if "image" not in ct:
            return None
        fpath.write_bytes(r.content)
        return fname
    except Exception as e:
        print(f"    Download failed: {e}")
        return None


def save_page(page: dict, source_category: str):
    page_id = str(page.get("pageid", ""))
    if not page_id:
        return 0

    post_id = f"wiki_{page_id}"
    conn = get_conn()
    try:
        if conn.execute("SELECT id FROM posts WHERE id=?", (post_id,)).fetchone():
            conn.close()
            return 0

        imageinfo = page.get("imageinfo", [{}])[0]
        url = imageinfo.get("thumburl") or imageinfo.get("url", "")
        if not url:
            conn.close()
            return 0

        mime = imageinfo.get("mime", "")
        if not any(t in mime for t in ["jpeg", "png", "jpg"]):
            conn.close()
            return 0

        extmeta = imageinfo.get("extmetadata", {})
        description = extract_text_from_metadata(extmeta)
        title = page.get("title", "").replace("File:", "")

        fname = download_image(url, title)
        if not fname:
            conn.close()
            return 0

        conn.execute(
            "INSERT INTO posts (id, source, group_url, post_url, post_date, post_text, raw_json) VALUES (?,?,?,?,?,?,?)",
            (post_id, "wikimedia",
             f"https://commons.wikimedia.org/wiki/{page.get('title','')}",
             f"https://commons.wikimedia.org/wiki/{page.get('title','')}",
             extmeta.get("DateTimeOriginal", {}).get("value", ""),
             title,
             json.dumps({"pageid": page_id, "title": title})),
        )
        cursor = conn.execute(
            "INSERT INTO images (post_id, filename, url) VALUES (?,?,?)",
            (post_id, fname, url),
        )
        image_id = cursor.lastrowid

        if description and len(description) > 20:
            has_heb = bool(re.search(r'[א-ת]', description))
            has_cyr = bool(re.search(r'[Ѐ-ӿ]', description))
            lang = "yiddish" if has_heb else ("russian" if has_cyr else "unknown")
            script = "hebrew" if has_heb else ("cyrillic" if has_cyr else "latin")
            tid = conn.execute(
                "INSERT INTO transcriptions (image_id, source, commenter_name, language, script, raw_text) VALUES (?,?,?,?,?,?)",
                (image_id, "metadata", "wikimedia", lang, script, description[:2000]),
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


def run():
    init_db()
    total = 0
    seen = set()

    # Category crawl
    for cat in CATEGORIES:
        print(f"\nCategory: {cat}")
        cont = None
        while True:
            try:
                data = get_category_members(cat, cont)
            except Exception as e:
                print(f"  Error: {e}")
                break

            members = data.get("query", {}).get("categorymembers", [])
            if not members:
                print("  (empty)")
                break

            print(f"  {len(members)} files")
            for m in members:
                page_id = str(m.get("pageid", ""))
                if page_id in seen:
                    continue
                seen.add(page_id)

                page = get_file_info(m["pageid"])
                if page:
                    saved = save_page(page, cat)
                    total += saved
                time.sleep(0.3)

            if "continue" not in data:
                break
            cont = data["continue"]
            time.sleep(1)

    # Keyword search
    for term in SEARCH_TERMS:
        print(f"\nSearch: {term}")
        cont = None
        pages_seen = 0
        while pages_seen < 200:
            try:
                data = search_commons(term, cont)
            except Exception as e:
                print(f"  Error: {e}")
                break

            pages = data.get("query", {}).get("pages", {})
            if not pages:
                break
            print(f"  {len(pages)} results")

            for page in pages.values():
                page_id = str(page.get("pageid", ""))
                if page_id in seen:
                    continue
                seen.add(page_id)
                saved = save_page(page, term)
                total += saved
                pages_seen += 1
                time.sleep(0.2)

            if "continue" not in data:
                break
            cont = data["continue"]
            time.sleep(1)

    print(f"\nWikimedia Commons complete. Total: {total} images")


if __name__ == "__main__":
    run()
