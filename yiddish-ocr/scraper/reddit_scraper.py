"""
Scrape r/TranslateMe, r/OldHandwriting, r/Yiddish for postcard/letter images + translations.
Uses Reddit's public JSON API — no auth needed.

Usage:
    python reddit_scraper.py
"""

import requests
import time
import json
import re
from pathlib import Path
from db import get_conn, init_db

IMAGES_DIR = Path(__file__).parent.parent / "data" / "images"
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

HEADERS = {"User-Agent": "YiddishOCR-Research/1.0 (academic research; contact via github)"}

SUBREDDITS = [
    "TranslateMe",
    "OldHandwriting",
    "Yiddish",
    "translator",
    "AskHistorians",
]

KEYWORDS = ["yiddish", "hebrew", "russian", "postcard", "letter", "old letter",
            "translate", "handwritten", "cursive", "1900", "1910", "1920", "1930"]


def is_relevant(title: str, text: str) -> bool:
    combined = (title + " " + text).lower()
    return any(kw in combined for kw in KEYWORDS)


def has_image(post: dict) -> bool:
    url = post.get("url", "")
    return (
        any(url.endswith(ext) for ext in [".jpg", ".jpeg", ".png", ".gif", ".webp"])
        or "i.redd.it" in url
        or "i.imgur.com" in url
        or post.get("post_hint") == "image"
    )


def get_image_url(post: dict) -> str | None:
    url = post.get("url", "")
    if any(url.endswith(ext) for ext in [".jpg", ".jpeg", ".png", ".gif", ".webp"]):
        return url
    if "i.redd.it" in url or "i.imgur.com" in url:
        return url
    # Try gallery
    if "gallery_data" in post:
        items = post["gallery_data"].get("items", [])
        if items:
            media_id = items[0].get("media_id")
            meta = post.get("media_metadata", {}).get(media_id, {})
            if meta.get("s", {}).get("u"):
                return meta["s"]["u"].replace("&amp;", "&")
    return None


def download_image(url: str, post_id: str) -> str | None:
    try:
        r = requests.get(url, headers=HEADERS, timeout=15)
        if r.status_code != 200:
            return None
        ext = "jpg"
        ct = r.headers.get("content-type", "")
        if "png" in ct:
            ext = "png"
        fname = f"reddit_{post_id}.{ext}"
        fpath = IMAGES_DIR / fname
        fpath.write_bytes(r.content)
        return fname
    except Exception as e:
        print(f"    Image download failed: {e}")
        return None


def fetch_comments(subreddit: str, post_id: str) -> list[dict]:
    url = f"https://www.reddit.com/r/{subreddit}/comments/{post_id}.json"
    try:
        r = requests.get(url, headers=HEADERS, timeout=15)
        if r.status_code != 200:
            return []
        data = r.json()
        comments = []
        if len(data) < 2:
            return []
        for item in data[1]["data"]["children"]:
            c = item.get("data", {})
            body = c.get("body", "")
            if body and body != "[deleted]" and body != "[removed]" and len(body) > 15:
                comments.append({
                    "author": c.get("author", "unknown"),
                    "text": body,
                    "score": c.get("score", 0),
                })
        # Sort by score — higher scored comments are more likely correct translations
        comments.sort(key=lambda x: x["score"], reverse=True)
        return comments
    except Exception:
        return []


def save_post(post_data: dict, image_filename: str, comments: list, subreddit: str):
    post_id = f"reddit_{post_data['id']}"
    conn = get_conn()
    try:
        existing = conn.execute("SELECT id FROM posts WHERE id=?", (post_id,)).fetchone()
        if existing:
            conn.close()
            return

        conn.execute(
            "INSERT INTO posts (id, source, group_url, post_url, post_date, post_text, raw_json) VALUES (?,?,?,?,?,?,?)",
            (
                post_id,
                "reddit",
                f"https://reddit.com/r/{subreddit}",
                f"https://reddit.com{post_data.get('permalink', '')}",
                str(post_data.get("created_utc", "")),
                post_data.get("title", "") + "\n" + post_data.get("selftext", ""),
                json.dumps({"title": post_data.get("title"), "subreddit": subreddit}),
            ),
        )

        cursor = conn.execute(
            "INSERT INTO images (post_id, filename, url) VALUES (?,?,?)",
            (post_id, image_filename, post_data.get("url", "")),
        )
        image_id = cursor.lastrowid

        for comment in comments:
            text = comment["text"]
            has_hebrew = bool(re.search(r'[֐-׿יִ-ﭏ]', text))
            has_cyrillic = bool(re.search(r'[Ѐ-ӿ]', text))
            lang = "yiddish" if has_hebrew else ("russian" if has_cyrillic else "unknown")
            script = "hebrew" if has_hebrew else ("cyrillic" if has_cyrillic else "latin")

            trans_id = conn.execute(
                "INSERT INTO transcriptions (image_id, source, commenter_name, language, script, raw_text) VALUES (?,?,?,?,?,?)",
                (image_id, "comment", comment["author"], lang, script, text),
            ).lastrowid

            conn.execute(
                "INSERT INTO review_queue (image_id, transcription_id) VALUES (?,?)",
                (image_id, trans_id),
            )

        conn.commit()
        print(f"    Saved: {post_data.get('title', '')[:60]} ({len(comments)} comments)")
    except Exception as e:
        conn.rollback()
        print(f"    DB error: {e}")
    finally:
        conn.close()


def scrape_subreddit(subreddit: str, max_posts: int = 100):
    print(f"\n=== r/{subreddit} ===")
    after = None
    scraped = 0

    while scraped < max_posts:
        url = f"https://www.reddit.com/r/{subreddit}/new.json?limit=100"
        if after:
            url += f"&after={after}"

        try:
            r = requests.get(url, headers=HEADERS, timeout=15)
            if r.status_code == 429:
                print("  Rate limited — waiting 60s")
                time.sleep(60)
                continue
            if r.status_code != 200:
                print(f"  HTTP {r.status_code}")
                break
            data = r.json()
        except Exception as e:
            print(f"  Fetch error: {e}")
            break

        posts = data["data"]["children"]
        if not posts:
            break

        for item in posts:
            post = item["data"]
            if not is_relevant(post.get("title", ""), post.get("selftext", "")):
                continue
            if not has_image(post):
                continue

            img_url = get_image_url(post)
            if not img_url:
                continue

            print(f"  Processing: {post.get('title', '')[:50]}")
            img_file = download_image(img_url, post["id"])
            if not img_file:
                continue

            time.sleep(1)
            comments = fetch_comments(subreddit, post["id"])
            if not comments:
                print("    No comments — skipping")
                continue

            save_post(post, img_file, comments, subreddit)
            scraped += 1
            time.sleep(1.5)

        after = data["data"].get("after")
        if not after:
            break
        time.sleep(2)

    print(f"  Done: {scraped} posts saved")


def run():
    init_db()
    for sub in SUBREDDITS:
        scrape_subreddit(sub, max_posts=200)
    print("\nReddit scrape complete.")


if __name__ == "__main__":
    run()
