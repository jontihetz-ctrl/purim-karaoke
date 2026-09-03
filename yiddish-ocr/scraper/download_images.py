"""
Download FB post images by navigating directly to the CDN URLs stored in DB.
Uses Playwright with cookies so the browser session provides auth.
The CDN URLs in images.url were collected via fix_image_urls.py (correct photo-link selector).
"""

import hashlib
import json
import time
import random
from pathlib import Path
from db import get_conn

OUT_DIR = Path(__file__).parent.parent / "review-app" / "public" / "images"
OUT_DIR.mkdir(parents=True, exist_ok=True)
COOKIES_FILE = Path(__file__).parent / "fb_cookies.json"

PLACEHOLDER_MD5 = "5a1f51fea0d264a17f750c899402162f"


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


def make_context(pw):
    browser = pw.chromium.launch(
        headless=True,
        args=["--no-sandbox", "--disable-blink-features=AutomationControlled"],
    )
    ctx = browser.new_context(
        viewport={"width": 1280, "height": 900},
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                   "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        locale="en-US",
        ignore_https_errors=True,
    )
    ctx.add_cookies(load_cookies())
    return browser, ctx


def stable_filename(post_id: str) -> str:
    short = hashlib.md5(post_id.encode()).hexdigest()[:12]
    return f"fb_{short}.jpg"


def is_bad(data: bytes | None) -> bool:
    if not data or len(data) < 10000:
        return True
    return hashlib.md5(data).hexdigest() == PLACEHOLDER_MD5


def download_url(ctx, url: str) -> bytes | None:
    """Navigate directly to a CDN image URL and capture response bytes."""
    page = ctx.new_page()
    try:
        response = page.goto(url, wait_until="load", timeout=20000)
        if response and response.ok:
            ct = response.headers.get("content-type", "")
            if "image" in ct:
                return response.body()
        return None
    except Exception as e:
        print(f"    Error: {e}")
        return None
    finally:
        page.close()


def download_all(force: bool = False):
    from playwright.sync_api import sync_playwright

    conn = get_conn()
    rows = conn.execute("""
        SELECT i.id, i.filename, i.url, p.id AS post_id, p.post_url
        FROM images i JOIN posts p ON p.id = i.post_id
        WHERE p.source = 'facebook'
        ORDER BY i.id
    """).fetchall()
    conn.close()

    todo = []
    for img_id, old_fname, cdn_url, post_id, post_url in rows:
        fname = stable_filename(post_id)
        dest = OUT_DIR / fname
        if not force and dest.exists() and not is_bad(dest.read_bytes()):
            # Update DB filename if it changed
            if old_fname != fname:
                conn = get_conn()
                conn.execute("UPDATE images SET filename=? WHERE id=?", (fname, img_id))
                conn.commit()
                conn.close()
            continue
        todo.append((img_id, fname, cdn_url, post_id, post_url))

    print(f"{len(todo)} images to download ({len(rows) - len(todo)} already good)")
    if not todo:
        return

    ok = fail = 0

    with sync_playwright() as pw:
        browser, ctx = make_context(pw)

        for i, (img_id, fname, cdn_url, post_id, post_url) in enumerate(todo):
            dest = OUT_DIR / fname
            data = download_url(ctx, cdn_url)

            if not is_bad(data):
                dest.write_bytes(data)
                conn = get_conn()
                conn.execute("UPDATE images SET filename=? WHERE id=?", (fname, img_id))
                conn.commit()
                conn.close()
                ok += 1
                print(f"  [{i+1}/{len(todo)}] {fname} ({len(data)//1024}KB)")
            else:
                fail += 1
                sz = len(data) if data else 0
                print(f"  [{i+1}/{len(todo)}] FAIL ({sz}B) — CDN URL expired, need re-scrape")

            time.sleep(random.uniform(0.3, 0.6))

            if (i + 1) % 25 == 0:
                browser.close()
                browser, ctx = make_context(pw)

        browser.close()

    print(f"\nDone. Downloaded: {ok}, Failed: {fail}")
    good = [p for p in OUT_DIR.glob("fb_*.jpg") if not is_bad(p.read_bytes())]
    total = sum(p.stat().st_size for p in good) // 1024
    print(f"Good images: {len(good)}, total {total}KB")

    if fail > 0:
        print("\nSome CDN URLs have expired. Run fix_image_urls.py first to refresh them, then re-run this script.")


if __name__ == "__main__":
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument("--force", action="store_true", help="Re-download even if file exists")
    args = p.parse_args()
    download_all(force=args.force)
