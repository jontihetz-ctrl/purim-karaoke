"""
Scrape Flickr for historical Yiddish/Jewish postcard images + descriptions/comments.
Requires a free Flickr API key: https://www.flickr.com/services/apps/create/

Usage:
    python flickr_scraper.py --api-key YOUR_KEY
"""

import argparse
import requests
import json
import time
from pathlib import Path
from db import get_conn, init_db

IMAGES_DIR = Path(__file__).parent.parent / "data" / "images"
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

BASE = "https://api.flickr.com/services/rest/"

SEARCH_TAGS = [
    "yiddish,postcard",
    "jewish,postcard,vintage",
    "hebrew,letter,old",
    "jewish,letter,1920s",
    "yiddish,letter",
    "jewish,genealogy,postcard",
    "russian,postcard,vintage,1900s",
]


def api_call(api_key: str, method: str, **params) -> dict:
    p = {
        "method": method,
        "api_key": api_key,
        "format": "json",
        "nojsoncallback": 1,
        **params,
    }
    r = requests.get(BASE, params=p, timeout=15)
    r.raise_for_status()
    return r.json()


def search_photos(api_key: str, tags: str, page: int = 1) -> list[dict]:
    data = api_call(
        api_key,
        "flickr.photos.search",
        tags=tags,
        tag_mode="all",
        extras="url_l,url_o,url_c,description,date_taken,owner_name",
        per_page=100,
        page=page,
        sort="relevance",
        content_type=1,  # photos only
    )
    return data.get("photos", {}).get("photo", [])


def get_comments(api_key: str, photo_id: str) -> list[dict]:
    data = api_call(api_key, "flickr.photos.comments.getList", photo_id=photo_id)
    comments = data.get("comments", {}).get("comment", [])
    if isinstance(comments, dict):
        comments = [comments]
    return [
        {"author": c.get("authorname", ""), "text": c.get("_content", "")}
        for c in comments
        if len(c.get("_content", "")) > 15
    ]


def download_image(url: str, photo_id: str) -> str | None:
    try:
        r = requests.get(url, timeout=20)
        if r.status_code != 200:
            return None
        ext = "jpg"
        if "png" in r.headers.get("content-type", ""):
            ext = "png"
        fname = f"flickr_{photo_id}.{ext}"
        fpath = IMAGES_DIR / fname
        fpath.write_bytes(r.content)
        return fname
    except Exception as e:
        print(f"    Download failed: {e}")
        return None


def save_photo(photo: dict, image_file: str, comments: list):
    post_id = f"flickr_{photo['id']}"
    conn = get_conn()
    try:
        if conn.execute("SELECT id FROM posts WHERE id=?", (post_id,)).fetchone():
            conn.close()
            return

        desc = photo.get("description", {})
        if isinstance(desc, dict):
            desc = desc.get("_content", "")

        title = photo.get("title", "")
        post_text = f"{title}\n{desc}".strip()

        conn.execute(
            "INSERT INTO posts (id, source, group_url, post_url, post_date, post_text, raw_json) VALUES (?,?,?,?,?,?,?)",
            (
                post_id,
                "flickr",
                "https://flickr.com",
                f"https://flickr.com/photos/{photo.get('owner','')}/{photo['id']}",
                photo.get("datetaken", ""),
                post_text,
                json.dumps({"id": photo["id"], "title": title}),
            ),
        )

        cursor = conn.execute(
            "INSERT INTO images (post_id, filename, url) VALUES (?,?,?)",
            (post_id, image_file, photo.get("url_l") or photo.get("url_c") or ""),
        )
        image_id = cursor.lastrowid

        # Description itself might be a transcription
        if desc and len(desc) > 30:
            import re
            has_hebrew = bool(re.search(r'[֐-׿]', desc))
            has_cyrillic = bool(re.search(r'[Ѐ-ӿ]', desc))
            lang = "yiddish" if has_hebrew else ("russian" if has_cyrillic else "unknown")
            script = "hebrew" if has_hebrew else ("cyrillic" if has_cyrillic else "latin")
            tid = conn.execute(
                "INSERT INTO transcriptions (image_id, source, commenter_name, language, script, raw_text) VALUES (?,?,?,?,?,?)",
                (image_id, "description", photo.get("ownername", ""), lang, script, desc),
            ).lastrowid
            conn.execute("INSERT INTO review_queue (image_id, transcription_id) VALUES (?,?)", (image_id, tid))

        for c in comments:
            import re
            text = c["text"]
            has_hebrew = bool(re.search(r'[֐-׿]', text))
            has_cyrillic = bool(re.search(r'[Ѐ-ӿ]', text))
            lang = "yiddish" if has_hebrew else ("russian" if has_cyrillic else "unknown")
            script = "hebrew" if has_hebrew else ("cyrillic" if has_cyrillic else "latin")
            tid = conn.execute(
                "INSERT INTO transcriptions (image_id, source, commenter_name, language, script, raw_text) VALUES (?,?,?,?,?,?)",
                (image_id, "comment", c["author"], lang, script, text),
            ).lastrowid
            conn.execute("INSERT INTO review_queue (image_id, transcription_id) VALUES (?,?)", (image_id, tid))

        conn.commit()
        print(f"    Saved: {title[:50]} ({len(comments)} comments)")
    except Exception as e:
        conn.rollback()
        print(f"    DB error: {e}")
    finally:
        conn.close()


def run(api_key: str):
    init_db()
    total = 0

    for tags in SEARCH_TAGS:
        print(f"\nSearching: {tags}")
        for page in range(1, 4):  # 3 pages = 300 results per tag set
            photos = search_photos(api_key, tags, page)
            if not photos:
                break
            print(f"  Page {page}: {len(photos)} photos")

            for photo in photos:
                img_url = photo.get("url_l") or photo.get("url_c")
                if not img_url:
                    continue

                img_file = download_image(img_url, photo["id"])
                if not img_file:
                    continue

                time.sleep(0.5)
                comments = get_comments(api_key, photo["id"])
                save_photo(photo, img_file, comments)
                total += 1
                time.sleep(1)

            time.sleep(2)

    print(f"\nFlickr scrape complete. Total: {total} photos")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--api-key", required=True, help="Flickr API key (free at flickr.com/services/apps/create)")
    args = parser.parse_args()
    run(args.api_key)
