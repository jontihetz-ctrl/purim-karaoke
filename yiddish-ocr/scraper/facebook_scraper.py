"""
Facebook group scraper for postcard images + translation comments.
Uses saved browser cookies — much more reliable than email/password login.

Setup (one-time):
    1. Install "Cookie Editor" Chrome extension
       https://chrome.google.com/webstore/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm
    2. Log in to Facebook in Chrome
    3. Click Cookie Editor → Export → Export as JSON
    4. Save the file as: yiddish-ocr/scraper/fb_cookies.json

Usage:
    python facebook_scraper.py --group-url https://www.facebook.com/groups/361690548110384/
    python facebook_scraper.py --group-url URL --max-posts 1000
"""

import argparse
import json
import time
import random
import re
import hashlib
import requests
from pathlib import Path
from db import get_conn, init_db

IMAGES_DIR = Path(__file__).parent.parent / "data" / "images"
IMAGES_DIR.mkdir(parents=True, exist_ok=True)
COOKIES_FILE = Path(__file__).parent / "fb_cookies.json"


def human_delay(min_s=1.0, max_s=3.0):
    time.sleep(random.uniform(min_s, max_s))


def load_cookies(path: Path) -> list[dict]:
    with open(path) as f:
        raw = json.load(f)
    # Cookie Editor exports as a list; Playwright wants specific fields
    out = []
    for c in raw:
        cookie = {
            "name": c["name"],
            "value": c["value"],
            "domain": c.get("domain", ".facebook.com"),
            "path": c.get("path", "/"),
        }
        if c.get("secure") is not None:
            cookie["secure"] = c["secure"]
        if c.get("sameSite") in ("Strict", "Lax", "None"):
            cookie["sameSite"] = c["sameSite"]
        if c.get("expirationDate"):
            cookie["expires"] = int(c["expirationDate"])
        out.append(cookie)
    return out


def download_image(url: str, fname: str) -> bool:
    fpath = IMAGES_DIR / fname
    if fpath.exists():
        return True
    try:
        r = requests.get(url, timeout=20, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        })
        if r.status_code != 200:
            return False
        ct = r.headers.get("content-type", "")
        if "image" not in ct:
            return False
        fpath.write_bytes(r.content)
        return True
    except Exception:
        return False


def is_useful_comment(text: str) -> bool:
    """Filter to comments that are likely transcriptions or translations."""
    if len(text) < 15:
        return False
    has_hebrew = bool(re.search(r'[א-ת]', text))
    has_cyrillic = bool(re.search(r'[Ѐ-ӿ]', text))
    # Keep if it has original script, or if it's a long English response
    # (likely a translation: "It says: Dear mother...")
    long_latin = len(text) > 60 and bool(re.search(r'[a-zA-Z]{3,}', text))
    return has_hebrew or has_cyrillic or long_latin


def detect_lang(text: str) -> tuple[str, str]:
    has_heb = bool(re.search(r'[א-ת]', text))
    has_cyr = bool(re.search(r'[Ѐ-ӿ]', text))
    lang = "yiddish" if has_heb else ("russian" if has_cyr else "english")
    script = "hebrew" if has_heb else ("cyrillic" if has_cyr else "latin")
    return lang, script


def save_post(post_id: str, post_url: str, post_date: str, post_text: str,
              group_url: str, images: list[dict], comments: list[dict]):
    conn = get_conn()
    try:
        if conn.execute("SELECT id FROM posts WHERE id=?", (post_id,)).fetchone():
            conn.close()
            return 0

        conn.execute(
            "INSERT INTO posts (id, source, group_url, post_url, post_date, post_text, raw_json) "
            "VALUES (?,?,?,?,?,?,?)",
            (post_id, "facebook", group_url, post_url, post_date, post_text,
             json.dumps({"comments": comments})),
        )

        saved_images = 0
        for img in images:
            if not download_image(img["url"], img["fname"]):
                continue
            cursor = conn.execute(
                "INSERT INTO images (post_id, filename, url) VALUES (?,?,?)",
                (post_id, img["fname"], img["url"]),
            )
            image_id = cursor.lastrowid
            saved_images += 1

            for comment in comments:
                if not is_useful_comment(comment["text"]):
                    continue
                lang, script = detect_lang(comment["text"])
                tid = conn.execute(
                    "INSERT INTO transcriptions (image_id, source, commenter_name, language, script, raw_text) "
                    "VALUES (?,?,?,?,?,?)",
                    (image_id, "comment", comment["author"], lang, script, comment["text"]),
                ).lastrowid
                conn.execute(
                    "INSERT INTO review_queue (image_id, transcription_id) VALUES (?,?)",
                    (image_id, tid),
                )

        conn.commit()
        conn.close()
        return saved_images
    except Exception as e:
        conn.rollback()
        conn.close()
        print(f"  DB error: {e}")
        return 0


def scrape_group(group_url: str, max_posts: int = 500):
    try:
        from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout
    except ImportError:
        print("Install playwright first: pip install playwright && playwright install chromium")
        return

    if not COOKIES_FILE.exists():
        print(f"Cookie file not found: {COOKIES_FILE}")
        print("\nSetup steps:")
        print("  1. Install 'Cookie Editor' Chrome extension")
        print("  2. Log in to Facebook in Chrome")
        print("  3. Click Cookie Editor → Export → Export as JSON")
        print(f"  4. Save to: {COOKIES_FILE}")
        return

    cookies = load_cookies(COOKIES_FILE)
    print(f"Loaded {len(cookies)} cookies")

    init_db()
    total_images = 0
    seen_posts = set()

    with sync_playwright() as pw:
        browser = pw.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-blink-features=AutomationControlled",
                  "--ignore-certificate-errors"],
        )
        ctx = browser.new_context(
            viewport={"width": 1280, "height": 900},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                       "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            locale="en-US",
            ignore_https_errors=True,
        )
        ctx.add_cookies(cookies)
        page = ctx.new_page()
        page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

        print(f"Opening group: {group_url}")
        page.goto(group_url, wait_until="domcontentloaded", timeout=30000)
        # Wait for the feed to actually render
        try:
            page.wait_for_selector("[role='feed']", timeout=15000)
        except Exception:
            pass
        human_delay(4, 6)

        # Check we're logged in
        if "login" in page.url or page.query_selector("[data-testid='royal_login_form']"):
            print("Not logged in — cookies may have expired. Re-export from browser.")
            browser.close()
            return

        print(f"Logged in. Page: {page.title()}")
        print("Scrolling feed...")

        posts_processed = 0
        last_height = 0
        stall_count = 0

        while posts_processed < max_posts:
            # Find all post articles
            articles = page.query_selector_all("div[role='article']")

            for article in articles:
                # Get a stable ID for this article
                try:
                    link = article.query_selector("a[href*='/posts/'], a[href*='story_fbid']")
                    post_url = link.get_attribute("href") if link else None
                    if not post_url:
                        post_url = article.get_attribute("aria-label") or str(articles.index(article))
                    post_id = "fb_" + hashlib.md5(post_url.encode()).hexdigest()[:12]
                except Exception:
                    continue

                if post_id in seen_posts:
                    continue
                seen_posts.add(post_id)
                print(f"  Processing post {post_id[:16]}...")

                try:
                    # Post text
                    text_el = article.query_selector("div[data-ad-comet-preview='message']") or \
                              article.query_selector("div[dir='auto']")
                    post_text = text_el.inner_text().strip() if text_el else ""

                    # Date
                    time_el = article.query_selector("abbr")
                    post_date = time_el.get_attribute("title") or time_el.get_attribute("data-utime") or "" \
                        if time_el else ""

                    # Images — only scontent CDN images (actual photos, not UI icons)
                    img_els = article.query_selector_all("img[src*='scontent']")
                    images = []
                    for i, img in enumerate(img_els):
                        src = img.get_attribute("src") or ""
                        if not src or "emoji" in src or "static" in src:
                            continue
                        # Skip tiny images (avatars etc.)
                        try:
                            w = int(img.get_attribute("width") or 0)
                            h = int(img.get_attribute("height") or 0)
                            if w > 0 and w < 100:
                                continue
                        except Exception:
                            pass
                        fname = "fb_" + hashlib.md5(src.encode()).hexdigest()[:16] + ".jpg"
                        images.append({"url": src, "fname": fname})

                    if not images:
                        continue

                    # Expand comments
                    for btn_text in ["View more comments", "Most relevant", "View all"]:
                        btn = article.query_selector(f"div[role='button']:has-text('{btn_text}')")
                        if btn:
                            try:
                                btn.click()
                                human_delay(0.5, 1.5)
                            except Exception:
                                pass

                    # Collect comments
                    comment_els = article.query_selector_all("div[role='article']")
                    comments = []
                    for c in comment_els:
                        try:
                            author_el = c.query_selector("a span")
                            body_el = c.query_selector("div[dir='auto']")
                            if not body_el:
                                continue
                            text = body_el.inner_text().strip()
                            author = author_el.inner_text().strip() if author_el else "unknown"
                            if text:
                                comments.append({"author": author, "text": text})
                        except Exception:
                            pass

                    n = save_post(post_id, post_url, post_date, post_text,
                                  group_url, images, comments)
                    if n > 0:
                        total_images += n
                        print(f"  [{posts_processed+1}] {n} image(s), {len(comments)} comments — {post_text[:60]}")

                    posts_processed += 1
                    if posts_processed >= max_posts:
                        break

                    human_delay(0.5, 2.0)

                except Exception as e:
                    print(f"  Post parse error: {e}")
                    continue

            # Scroll down for more posts
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            human_delay(2, 4)
            new_height = page.evaluate("document.body.scrollHeight")

            if new_height == last_height:
                stall_count += 1
                if stall_count >= 3:
                    print("Feed end reached.")
                    break
            else:
                stall_count = 0
            last_height = new_height

        browser.close()

    print(f"\nDone. Posts processed: {posts_processed}, images saved: {total_images}")
    conn = get_conn()
    q = conn.execute("SELECT COUNT(*) FROM review_queue WHERE status='pending'").fetchone()[0]
    conn.close()
    print(f"Total pending review: {q}")


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--group-url", default="https://www.facebook.com/groups/361690548110384/")
    p.add_argument("--max-posts", type=int, default=500)
    args = p.parse_args()
    scrape_group(args.group_url, args.max_posts)
