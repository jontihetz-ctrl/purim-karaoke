"""
Facebook public group scraper for postcard images + translations.
Uses Playwright with stealth settings to avoid bot detection.

Usage:
    python facebook_scraper.py --group-url URL --email EMAIL --password PASSWORD
"""

import argparse
import json
import time
import random
import re
import hashlib
from pathlib import Path
from datetime import datetime
import requests
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout
from db import get_conn, init_db

IMAGES_DIR = Path(__file__).parent.parent / "data" / "images"
IMAGES_DIR.mkdir(parents=True, exist_ok=True)


def human_delay(min_s=1.5, max_s=4.0):
    time.sleep(random.uniform(min_s, max_s))


def download_image(url: str, post_id: str, idx: int) -> str | None:
    try:
        resp = requests.get(url, timeout=15, headers={"User-Agent": "Mozilla/5.0"})
        if resp.status_code != 200:
            return None
        ext = "jpg" if "jpeg" in resp.headers.get("content-type", "") else "jpg"
        fname = f"{post_id}_{idx}.{ext}"
        fpath = IMAGES_DIR / fname
        fpath.write_bytes(resp.content)
        return str(fpath.relative_to(IMAGES_DIR.parent.parent))
    except Exception as e:
        print(f"  Image download failed: {e}")
        return None


def scrape_post(page, post_element) -> dict | None:
    try:
        # Get post ID from URL or data attribute
        link = post_element.query_selector("a[href*='/posts/'], a[href*='?story_fbid=']")
        post_url = link.get_attribute("href") if link else None
        post_id = hashlib.md5((post_url or str(time.time())).encode()).hexdigest()[:12]

        # Post text
        text_el = post_element.query_selector("[data-ad-comet-preview='message'], div[dir='auto']")
        post_text = text_el.inner_text() if text_el else ""

        # Post date
        time_el = post_element.query_selector("a[href*='/posts/'] abbr, abbr[data-utime]")
        post_date = time_el.get_attribute("data-utime") if time_el else None
        if post_date:
            post_date = datetime.fromtimestamp(int(post_date)).isoformat()

        # Images in post
        img_elements = post_element.query_selector_all("img[src*='scontent']")
        image_urls = list({
            el.get_attribute("src") for el in img_elements
            if el.get_attribute("src") and "emoji" not in el.get_attribute("src", "")
        })

        # Comments — expand them first
        see_more = post_element.query_selector("div[aria-label='See more comments']")
        if see_more:
            see_more.click()
            human_delay(1, 2)

        comment_els = post_element.query_selector_all("div[aria-label*='Comment by'], div[role='article']")
        comments = []
        for c in comment_els:
            author_el = c.query_selector("a[role='link'] span")
            body_el = c.query_selector("div[dir='auto']")
            if body_el:
                comments.append({
                    "author": author_el.inner_text() if author_el else "unknown",
                    "text": body_el.inner_text()
                })

        return {
            "id": post_id,
            "post_url": post_url,
            "post_date": post_date,
            "post_text": post_text,
            "image_urls": image_urls,
            "comments": comments,
        }
    except Exception as e:
        print(f"  Error scraping post: {e}")
        return None


def save_post(post: dict, group_url: str):
    conn = get_conn()
    try:
        # Skip if already scraped
        existing = conn.execute("SELECT id FROM posts WHERE id=?", (post["id"],)).fetchone()
        if existing:
            return

        conn.execute(
            "INSERT INTO posts (id, source, group_url, post_url, post_date, post_text, raw_json) VALUES (?,?,?,?,?,?,?)",
            (post["id"], "facebook", group_url, post["post_url"],
             post["post_date"], post["post_text"], json.dumps(post))
        )

        for i, url in enumerate(post["image_urls"]):
            filename = download_image(url, post["id"], i)
            if filename:
                cursor = conn.execute(
                    "INSERT INTO images (post_id, filename, url) VALUES (?,?,?)",
                    (post["id"], filename, url)
                )
                image_id = cursor.lastrowid

                # Each comment is a potential transcription
                for comment in post["comments"]:
                    text = comment["text"]
                    if len(text) < 10:
                        continue
                    # Crude language detection
                    has_hebrew = bool(re.search(r'[֐-׿]', text))
                    has_cyrillic = bool(re.search(r'[Ѐ-ӿ]', text))
                    has_english = bool(re.search(r'[a-zA-Z]{3,}', text))

                    # Comments that are translations (in English) or transcriptions (in script)
                    lang = "yiddish" if has_hebrew else ("russian" if has_cyrillic else "unknown")
                    script = "hebrew" if has_hebrew else ("cyrillic" if has_cyrillic else "latin")

                    trans_id = conn.execute(
                        "INSERT INTO transcriptions (image_id, source, commenter_name, language, script, raw_text) VALUES (?,?,?,?,?,?)",
                        (image_id, "comment", comment["author"], lang, script, text)
                    ).lastrowid

                    # Queue for review
                    conn.execute(
                        "INSERT INTO review_queue (image_id, transcription_id) VALUES (?,?)",
                        (image_id, trans_id)
                    )

        conn.commit()
        print(f"  Saved post {post['id']} — {len(post['image_urls'])} images, {len(post['comments'])} comments")
    except Exception as e:
        conn.rollback()
        print(f"  DB save failed: {e}")
    finally:
        conn.close()


def run(group_url: str, email: str, password: str, max_posts: int = 500):
    init_db()

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-blink-features=AutomationControlled"]
        )
        ctx = browser.new_context(
            viewport={"width": 1280, "height": 900},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            locale="en-US",
        )
        page = ctx.new_page()
        page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

        print("Logging in to Facebook...")
        page.goto("https://www.facebook.com/login")
        human_delay()
        page.fill("#email", email)
        human_delay(0.5, 1.5)
        page.fill("#pass", password)
        human_delay(0.5, 1.0)
        page.click("button[name='login']")
        page.wait_for_load_state("networkidle", timeout=15000)
        human_delay(2, 4)

        if "login" in page.url:
            print("Login failed — check credentials")
            browser.close()
            return

        print(f"Navigating to group: {group_url}")
        page.goto(group_url)
        page.wait_for_load_state("networkidle", timeout=15000)
        human_delay(2, 4)

        scraped = 0
        last_height = 0

        while scraped < max_posts:
            posts = page.query_selector_all("div[role='article']")
            print(f"Found {len(posts)} post elements on page")

            for post in posts[scraped:]:
                data = scrape_post(page, post)
                if data and data["image_urls"]:
                    save_post(data, group_url)
                    scraped += 1
                    if scraped >= max_posts:
                        break
                human_delay(0.5, 1.5)

            # Scroll down
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            human_delay(2, 4)
            new_height = page.evaluate("document.body.scrollHeight")
            if new_height == last_height:
                print("Reached end of feed")
                break
            last_height = new_height

        print(f"Done. Scraped {scraped} posts.")
        browser.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--group-url", required=True)
    parser.add_argument("--email", required=True)
    parser.add_argument("--password", required=True)
    parser.add_argument("--max-posts", type=int, default=500)
    args = parser.parse_args()
    run(args.group_url, args.email, args.password, args.max_posts)
