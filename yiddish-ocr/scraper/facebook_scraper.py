"""
Facebook group scraper — two-phase approach:
  Phase 1: Scroll feed fast, collect post URLs (avoids DOM unloading)
  Phase 2: Open each post individually, expand ALL See More / comments

Usage:
    python facebook_scraper.py --group-url URL --max-posts 500
    python facebook_scraper.py --group-url URL --max-posts 500 --urls-only
    python facebook_scraper.py --group-url URL --max-posts 500 --skip-phase1

Cookies:  yiddish-ocr/scraper/fb_cookies.json  (export from Cookie Editor)
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
URL_CACHE_FILE = Path(__file__).parent / "fb_post_urls.json"

GROUP_URL = "https://www.facebook.com/groups/361690548110384/"


def human_delay(min_s=0.5, max_s=1.5):
    time.sleep(random.uniform(min_s, max_s))


def load_cookies():
    with open(COOKIES_FILE) as f:
        raw = json.load(f)
    out = []
    for c in raw:
        cookie = {"name": c["name"], "value": c["value"],
                  "domain": c.get("domain", ".facebook.com"), "path": c.get("path", "/")}
        if c.get("secure") is not None:
            cookie["secure"] = c["secure"]
        if c.get("sameSite") in ("Strict", "Lax", "None"):
            cookie["sameSite"] = c["sameSite"]
        if c.get("expirationDate"):
            cookie["expires"] = int(c["expirationDate"])
        out.append(cookie)
    return out


def make_browser(pw):
    browser = pw.chromium.launch(
        headless=True,
        args=["--no-sandbox", "--disable-blink-features=AutomationControlled",
              "--ignore-certificate-errors"],
    )
    ctx = browser.new_context(
        viewport={"width": 1280, "height": 1600},
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                   "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        locale="en-US",
        ignore_https_errors=True,
    )
    ctx.add_cookies(load_cookies())
    page = ctx.new_page()
    page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    return browser, ctx, page


# ── Phase 1: collect post URLs ────────────────────────────────────────────────

def collect_post_urls(max_posts: int) -> list[str]:
    """Scroll the group feed as fast as possible, just collecting post URLs."""
    existing = set()
    if URL_CACHE_FILE.exists():
        existing = set(json.loads(URL_CACHE_FILE.read_text()))
        print(f"Loaded {len(existing)} cached URLs")

    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("pip install playwright && playwright install chromium")
        return list(existing)

    urls = list(existing)
    new_found = 0

    with sync_playwright() as pw:
        browser, ctx, page = make_browser(pw)
        print(f"Phase 1: collecting post URLs from {GROUP_URL}")
        page.goto(GROUP_URL, wait_until="domcontentloaded", timeout=30000)
        page.wait_for_selector("[role='feed']", timeout=15000)
        page.wait_for_timeout(3000)

        if "login" in page.url:
            print("Not logged in — re-export cookies")
            browser.close()
            return urls

        seen = set(urls)
        stall = 0
        last_count = len(seen)
        scroll_n = 0

        while len(urls) < max_posts:
            # Collect all post links currently in DOM
            links = page.query_selector_all(
                "a[href*='/groups/'][href*='/posts/'], "
                "a[href*='?story_fbid='], "
                "a[href*='fbid=']"
            )
            for link in links:
                href = link.get_attribute("href") or ""
                # Normalise URL
                href = href.split("?")[0] if "story_fbid" not in href else href
                if href and href not in seen and "/groups/" in href:
                    seen.add(href)
                    urls.append(href)
                    new_found += 1

            scroll_n += 1
            if scroll_n % 10 == 0:
                print(f"  scroll {scroll_n}: {len(urls)} URLs collected")

            # Fast scroll — just collecting links, not processing
            page.mouse.wheel(0, 4000)
            page.wait_for_timeout(1000)

            if len(urls) == last_count:
                stall += 1
                if stall >= 8:
                    print(f"  Feed end — {len(urls)} URLs total")
                    break
            else:
                stall = 0
            last_count = len(urls)

        browser.close()

    # Save cache
    URL_CACHE_FILE.write_text(json.dumps(urls, indent=2))
    print(f"Phase 1 done: {len(urls)} post URLs ({new_found} new)")
    return urls[:max_posts]


# ── Phase 2: scrape each post individually ────────────────────────────────────

def expand_see_more(page):
    """Click all See More buttons on the page."""
    for _ in range(6):
        expanded = False
        for btn in page.query_selector_all("div[role='button'], span[role='button']"):
            try:
                label = btn.inner_text().strip()
                if any(x in label for x in [
                    "See more", "See More", "View more comments",
                    "View previous comments", "Most relevant",
                    "View all comments", "More comments",
                ]):
                    btn.click()
                    page.wait_for_timeout(600)
                    expanded = True
            except Exception:
                pass
        if not expanded:
            break


def download_image(url: str, fname: str) -> bool:
    fpath = IMAGES_DIR / fname
    if fpath.exists():
        return True
    try:
        r = requests.get(url, timeout=20, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        })
        if r.status_code != 200 or "image" not in r.headers.get("content-type", ""):
            return False
        fpath.write_bytes(r.content)
        return True
    except Exception:
        return False


def detect_lang(text: str) -> tuple[str, str]:
    has_heb = bool(re.search(r'[א-ת]', text))
    has_cyr = bool(re.search(r'[Ѐ-ӿ]', text))
    lang = "yiddish" if has_heb else ("russian" if has_cyr else "english")
    script = "hebrew" if has_heb else ("cyrillic" if has_cyr else "latin")
    return lang, script


def save_post(post_id, post_url, post_date, post_text, group_url, images, comments):
    conn = get_conn()
    try:
        if conn.execute("SELECT id FROM posts WHERE id=?", (post_id,)).fetchone():
            conn.close()
            return 0

        conn.execute(
            "INSERT INTO posts (id, source, group_url, post_url, post_date, post_text, raw_json) "
            "VALUES (?,?,?,?,?,?,?)",
            (post_id, "facebook", group_url, post_url, post_date,
             post_text[:2000], json.dumps({"comments": comments[:50]})),
        )

        saved = 0
        for img in images:
            if not download_image(img["url"], img["fname"]):
                continue
            cursor = conn.execute(
                "INSERT INTO images (post_id, filename, url) VALUES (?,?,?)",
                (post_id, img["fname"], img["url"]),
            )
            image_id = cursor.lastrowid
            saved += 1

            for comment in comments:
                text = comment["text"].strip()
                if len(text) < 10:
                    continue
                lang, script = detect_lang(text)
                tid = conn.execute(
                    "INSERT INTO transcriptions "
                    "(image_id, source, commenter_name, language, script, raw_text) "
                    "VALUES (?,?,?,?,?,?)",
                    (image_id, "comment", comment["author"], lang, script, text[:3000]),
                ).lastrowid
                conn.execute(
                    "INSERT INTO review_queue (image_id, transcription_id) VALUES (?,?)",
                    (image_id, tid),
                )

        conn.commit()
        conn.close()
        return saved
    except Exception as e:
        conn.rollback()
        conn.close()
        print(f"  DB error: {e}")
        return 0


def scrape_post_page(page, post_url: str, group_url: str) -> int:
    """Open a single post, expand everything, extract content."""
    try:
        page.goto(post_url, wait_until="domcontentloaded", timeout=25000)
        page.wait_for_timeout(2500)

        # Expand ALL See More buttons on the post page
        expand_see_more(page)
        page.wait_for_timeout(500)

        post_id = "fb_" + hashlib.md5(post_url.encode()).hexdigest()[:12]

        # Check already scraped
        conn = get_conn()
        exists = conn.execute("SELECT id FROM posts WHERE id=?", (post_id,)).fetchone()
        conn.close()
        if exists:
            return 0

        # Post text — grab all text blocks
        text_els = page.query_selector_all("div[dir='auto'], span[dir='auto']")
        post_text = "\n".join(
            el.inner_text().strip() for el in text_els if el.inner_text().strip()
        )[:2000]

        # Date
        time_el = page.query_selector("abbr[data-utime], abbr[title]")
        post_date = ""
        if time_el:
            post_date = time_el.get_attribute("title") or time_el.get_attribute("data-utime") or ""

        # Images
        img_els = page.query_selector_all("img")
        images = []
        seen_srcs = set()
        for img in img_els:
            src = img.get_attribute("src") or ""
            if not src or "scontent" not in src or src in seen_srcs:
                continue
            if "emoji" in src or "static" in src:
                continue
            try:
                w = int(img.get_attribute("width") or 0)
                if 0 < w < 100:
                    continue
            except Exception:
                pass
            seen_srcs.add(src)
            fname = "fb_" + hashlib.md5(src.encode()).hexdigest()[:16] + ".jpg"
            images.append({"url": src, "fname": fname})

        if not images:
            return 0

        # Comments — collect ALL text, deduplicated
        comment_els = page.query_selector_all("div[role='article']")
        comments = []
        seen_texts = set()
        for c in comment_els:
            try:
                author_el = c.query_selector("a[role='link'] span, a span")
                body_els = c.query_selector_all("div[dir='auto'], span[dir='auto']")
                text = " ".join(
                    el.inner_text().strip() for el in body_els if el.inner_text().strip()
                )
                author = author_el.inner_text().strip() if author_el else "unknown"
                key = text[:80]
                if text and len(text) >= 10 and key not in seen_texts:
                    seen_texts.add(key)
                    comments.append({"author": author, "text": text})
            except Exception:
                pass

        n = save_post(post_id, post_url, post_date, post_text, group_url, images, comments)
        return n

    except Exception as e:
        print(f"  Error on {post_url[:60]}: {e}")
        return 0


def scrape_all(group_url: str, max_posts: int, urls_only: bool, skip_phase1: bool):
    init_db()

    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("pip install playwright && playwright install chromium")
        return

    if not COOKIES_FILE.exists():
        print(f"No cookies file at {COOKIES_FILE}")
        print("Export from Cookie Editor Chrome extension → fb_cookies.json")
        return

    # Phase 1: collect URLs
    if not skip_phase1:
        post_urls = collect_post_urls(max_posts)
    else:
        if URL_CACHE_FILE.exists():
            post_urls = json.loads(URL_CACHE_FILE.read_text())
            print(f"Skipping phase 1, using {len(post_urls)} cached URLs")
        else:
            print("No URL cache found, running phase 1")
            post_urls = collect_post_urls(max_posts)

    if urls_only:
        print(f"URLs saved to {URL_CACHE_FILE}")
        return

    print(f"\nPhase 2: scraping {len(post_urls)} posts individually")

    total_images = 0
    processed = 0

    with sync_playwright() as pw:
        browser, ctx, page = make_browser(pw)

        for i, url in enumerate(post_urls):
            n = scrape_post_page(page, url, group_url)
            if n > 0:
                total_images += n
                processed += 1
                print(f"  [{i+1}/{len(post_urls)}] +{n} images — {url[-40:]}")
            elif n == 0:
                print(f"  [{i+1}/{len(post_urls)}] skip (no images or dupe) — {url[-40:]}")

            human_delay(1.5, 3.0)

            # Refresh session every 50 posts to avoid timeouts
            if (i + 1) % 50 == 0:
                print("  Refreshing browser session...")
                browser.close()
                browser, ctx, page = make_browser(pw)

        browser.close()

    print(f"\nDone. Scraped {processed} posts, {total_images} images saved.")
    conn = get_conn()
    q = conn.execute("SELECT COUNT(*) FROM review_queue WHERE status='pending'").fetchone()[0]
    conn.close()
    print(f"Total pending review: {q}")


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--group-url", default=GROUP_URL)
    p.add_argument("--max-posts", type=int, default=500)
    p.add_argument("--urls-only", action="store_true", help="Phase 1 only — just collect URLs")
    p.add_argument("--skip-phase1", action="store_true", help="Skip to phase 2 using cached URLs")
    args = p.parse_args()
    scrape_all(args.group_url, args.max_posts, args.urls_only, args.skip_phase1)
