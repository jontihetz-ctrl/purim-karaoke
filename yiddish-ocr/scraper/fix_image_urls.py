"""
Fix image URLs for all posts in the DB.
Re-visits each post page with corrected photo-link detection and updates images.url.
"""

import json
import hashlib
import time
import random
from pathlib import Path
from db import get_conn

COOKIES_FILE = Path(__file__).parent / "fb_cookies.json"


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


def get_post_image(page, post_url: str) -> str | None:
    """Visit a post and return the correct document image CDN URL, or None."""
    try:
        page.goto(post_url, wait_until="domcontentloaded", timeout=25000)
        page.wait_for_timeout(2000)

        if "login" in page.url:
            print("  Session expired — cookies need refresh")
            return None

        images = []
        seen_srcs = set()

        photo_links = page.query_selector_all("a[href*='/photo/?fbid='], a[href*='/photo/']")
        for link in photo_links:
            href = link.get_attribute("href") or ""
            if "/stories/" in href:
                continue
            img = link.query_selector("img")
            if not img:
                continue
            src = img.get_attribute("src") or ""
            if "scontent" in src and src not in seen_srcs:
                seen_srcs.add(src)
                images.append(src)

        return images[0] if images else None

    except Exception as e:
        print(f"  Error: {e}")
        return None


def fix_all_images(max_posts: int = 60, start_from: int = 0):
    from playwright.sync_api import sync_playwright

    conn = get_conn()
    posts = conn.execute(
        "SELECT p.id, p.post_url, i.id as img_id, i.url "
        "FROM posts p JOIN images i ON i.post_id = p.id "
        "WHERE p.source='facebook' "
        "ORDER BY p.id"
    ).fetchall()
    conn.close()

    posts = posts[start_from:start_from + max_posts]
    print(f"Fixing image URLs for {len(posts)} posts (starting from #{start_from})")

    updated = 0
    skipped = 0
    no_image = 0
    session_expired = False

    with sync_playwright() as pw:
        browser, ctx, page = make_browser(pw)

        for i, (post_id, post_url, img_id, old_url) in enumerate(posts):
            new_url = get_post_image(page, post_url)

            if new_url is None:
                # Check if session expired (login redirect)
                if "login" in page.url:
                    print(f"  [{i+1}/{len(posts)}] Session expired at post {post_id}")
                    session_expired = True
                    break
                no_image += 1
                print(f"  [{i+1}/{len(posts)}] No image found — {post_url[-50:]}")
            elif new_url == old_url:
                skipped += 1
                print(f"  [{i+1}/{len(posts)}] Already correct — {post_url[-50:]}")
            else:
                # Update URL and filename in DB
                new_fname = "fb_" + hashlib.md5(new_url.encode()).hexdigest()[:16] + ".jpg"
                conn = get_conn()
                conn.execute(
                    "UPDATE images SET url=?, filename=? WHERE id=?",
                    (new_url, new_fname, img_id),
                )
                conn.commit()
                conn.close()
                updated += 1
                print(f"  [{i+1}/{len(posts)}] Updated — {post_url[-50:]}")

            time.sleep(random.uniform(0.8, 1.5))

            if (i + 1) % 25 == 0:
                print(f"  Refreshing browser session...")
                browser.close()
                browser, ctx, page = make_browser(pw)

        browser.close()

    print(f"\nDone. Updated: {updated}, Skipped (already ok): {skipped}, No image: {no_image}")
    if session_expired:
        print("WARNING: Session expired — re-export cookies and re-run with --start-from", start_from + i)


if __name__ == "__main__":
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument("--max-posts", type=int, default=60)
    p.add_argument("--start-from", type=int, default=0)
    args = p.parse_args()
    fix_all_images(args.max_posts, args.start_from)
