"""
Scrape Reddit for postcard/letter images + translations using PRAW (official API).

Setup (free, 2 minutes):
  1. Go to https://www.reddit.com/prefs/apps
  2. Click "create another app" → choose "script"
  3. Name: YiddishOCR, redirect: http://localhost:8080
  4. Copy client_id (under app name) and client_secret

Usage:
    python reddit_scraper.py --client-id ID --client-secret SECRET --username USER --password PASS
"""

import argparse
import json
import re
import time
from pathlib import Path
import requests
from db import get_conn, init_db

IMAGES_DIR = Path(__file__).parent.parent / "data" / "images"
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

SUBREDDITS = ["TranslateMe", "OldHandwriting", "Yiddish", "translator"]
KEYWORDS = ["yiddish", "hebrew", "russian", "postcard", "letter", "old letter",
            "handwritten", "cursive", "translate", "1900", "1910", "1920", "1930",
            "jewish", "genealogy", "bubbe", "zayde"]


def is_relevant(title: str, body: str) -> bool:
    combined = (title + " " + body).lower()
    return any(kw in combined for kw in KEYWORDS)


def get_token(client_id: str, client_secret: str, username: str, password: str) -> str:
    r = requests.post(
        "https://www.reddit.com/api/v1/access_token",
        auth=(client_id, client_secret),
        data={"grant_type": "password", "username": username, "password": password},
        headers={"User-Agent": "YiddishOCR/1.0"},
    )
    r.raise_for_status()
    return r.json()["access_token"]


class RedditAPI:
    def __init__(self, client_id, client_secret, username, password):
        self.token = get_token(client_id, client_secret, username, password)
        self.headers = {
            "Authorization": f"bearer {self.token}",
            "User-Agent": "YiddishOCR/1.0",
        }

    def get(self, url, **params):
        r = requests.get(url, headers=self.headers, params=params, timeout=15)
        if r.status_code == 429:
            time.sleep(60)
            r = requests.get(url, headers=self.headers, params=params, timeout=15)
        r.raise_for_status()
        return r.json()

    def get_posts(self, subreddit: str, after=None):
        url = f"https://oauth.reddit.com/r/{subreddit}/new"
        params = {"limit": 100}
        if after:
            params["after"] = after
        return self.get(url, **params)

    def get_comments(self, subreddit: str, post_id: str):
        url = f"https://oauth.reddit.com/r/{subreddit}/comments/{post_id}"
        data = self.get(url, limit=100)
        comments = []
        if len(data) < 2:
            return []
        for item in data[1]["data"]["children"]:
            c = item.get("data", {})
            body = c.get("body", "")
            if body and body not in ("[deleted]", "[removed]") and len(body) > 15:
                comments.append({
                    "author": c.get("author", ""),
                    "text": body,
                    "score": c.get("score", 0),
                })
        return sorted(comments, key=lambda x: x["score"], reverse=True)


def get_image_url(post: dict) -> str | None:
    url = post.get("url", "")
    if any(url.lower().endswith(ext) for ext in [".jpg", ".jpeg", ".png", ".gif"]):
        return url
    if "i.redd.it" in url or "i.imgur.com" in url:
        return url
    if post.get("post_hint") == "image":
        return url
    # Gallery
    items = post.get("gallery_data", {}).get("items", [])
    if items:
        media_id = items[0].get("media_id")
        meta = post.get("media_metadata", {}).get(media_id, {})
        u = meta.get("s", {}).get("u", "")
        if u:
            return u.replace("&amp;", "&")
    return None


def download_image(url: str, post_id: str) -> str | None:
    try:
        r = requests.get(url, headers={"User-Agent": "YiddishOCR/1.0"}, timeout=20)
        if r.status_code != 200:
            return None
        ext = "png" if "png" in r.headers.get("content-type", "") else "jpg"
        fname = f"reddit_{post_id}.{ext}"
        (IMAGES_DIR / fname).write_bytes(r.content)
        return fname
    except Exception as e:
        print(f"    Download failed: {e}")
        return None


def save_post(post: dict, filename: str, comments: list, subreddit: str):
    post_id = f"reddit_{post['id']}"
    conn = get_conn()
    try:
        if conn.execute("SELECT id FROM posts WHERE id=?", (post_id,)).fetchone():
            return
        conn.execute(
            "INSERT INTO posts (id, source, group_url, post_url, post_date, post_text, raw_json) VALUES (?,?,?,?,?,?,?)",
            (post_id, "reddit", f"https://reddit.com/r/{subreddit}",
             f"https://reddit.com{post.get('permalink', '')}",
             str(post.get("created_utc", "")),
             post.get("title", "") + "\n" + (post.get("selftext") or ""),
             json.dumps({"title": post.get("title"), "subreddit": subreddit})),
        )
        cursor = conn.execute(
            "INSERT INTO images (post_id, filename, url) VALUES (?,?,?)",
            (post_id, filename, post.get("url", "")),
        )
        image_id = cursor.lastrowid

        for c in comments:
            text = c["text"]
            has_heb = bool(re.search(r'[א-תיִ-פֿ]', text))
            has_cyr = bool(re.search(r'[Ѐ-ӿ]', text))
            lang = "yiddish" if has_heb else ("russian" if has_cyr else "unknown")
            script = "hebrew" if has_heb else ("cyrillic" if has_cyr else "latin")
            tid = conn.execute(
                "INSERT INTO transcriptions (image_id, source, commenter_name, language, script, raw_text) VALUES (?,?,?,?,?,?)",
                (image_id, "comment", c["author"], lang, script, text),
            ).lastrowid
            conn.execute("INSERT INTO review_queue (image_id, transcription_id) VALUES (?,?)", (image_id, tid))

        conn.commit()
        print(f"    Saved: {post.get('title','')[:55]} ({len(comments)} comments)")
    except Exception as e:
        conn.rollback()
        print(f"    DB error: {e}")
    finally:
        conn.close()


def run(client_id, client_secret, username, password, max_posts=300):
    init_db()
    api = RedditAPI(client_id, client_secret, username, password)
    total = 0

    for sub in SUBREDDITS:
        print(f"\n=== r/{sub} ===")
        after = None
        count = 0

        while count < max_posts:
            data = api.get_posts(sub, after)
            posts = data["data"]["children"]
            if not posts:
                break

            for item in posts:
                post = item["data"]
                if not is_relevant(post.get("title", ""), post.get("selftext") or ""):
                    continue
                img_url = get_image_url(post)
                if not img_url:
                    continue

                print(f"  {post.get('title','')[:50]}")
                fname = download_image(img_url, post["id"])
                if not fname:
                    continue

                time.sleep(0.5)
                comments = api.get_comments(sub, post["id"])
                if not comments:
                    continue

                save_post(post, fname, comments, sub)
                count += 1
                total += 1
                time.sleep(1)

            after = data["data"].get("after")
            if not after:
                break
            time.sleep(2)

        print(f"  {count} posts saved from r/{sub}")

    print(f"\nReddit complete. Total: {total}")


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--client-id", required=True)
    p.add_argument("--client-secret", required=True)
    p.add_argument("--username", required=True)
    p.add_argument("--password", required=True)
    p.add_argument("--max-posts", type=int, default=300)
    args = p.parse_args()
    run(args.client_id, args.client_secret, args.username, args.password, args.max_posts)
