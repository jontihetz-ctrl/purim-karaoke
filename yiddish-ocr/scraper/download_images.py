"""
Download FB images by intercepting network responses while loading post pages.
The browser is on facebook.com with cookies, so CDN requests succeed.
Saves to review-app/public/images/ with stable post-based filenames.
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

# Known placeholder checksum — skip these
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


def make_browser(pw):
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
    page = ctx.new_page()
    page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    return browser, ctx, page


def stable_filename(post_id: str) -> str:
    short = hashlib.md5(post_id.encode()).hexdigest()[:12]
    return f"fb_{short}.jpg"


def is_placeholder(data: bytes) -> bool:
    return hashlib.md5(data).hexdigest() == PLACEHOLDER_MD5


def download_via_interception(page, post_url: str, dest: Path) -> bool:
    """Load the post page, intercept the document photo response."""
    captured = {}

    def on_response(response):
        url = response.url
        if "scontent" not in url or "/t39.30808" not in url:
            return
        if "/t39.30808-1/" in url:  # skip profile pics (small format)
            return
        try:
            body = response.body()
            if len(body) > 10000 and not is_placeholder(body):
                # Keep the largest image we capture
                if "best" not in captured or len(body) > len(captured["best"]):
                    captured["best"] = body
        except Exception:
            pass

    page.on("response", on_response)
    try:
        page.goto(post_url, wait_until="domcontentloaded", timeout=25000)
        page.wait_for_timeout(2000)
    except Exception:
        pass
    finally:
        page.remove_listener("response", on_response)

    if "best" in captured:
        dest.write_bytes(captured["best"])
        return True
    return False


def download_all():
    from playwright.sync_api import sync_playwright

    conn = get_conn()
    rows = conn.execute("""
        SELECT i.id, i.filename, p.id as post_id, p.post_url
        FROM images i JOIN posts p ON p.id = i.post_id
        WHERE p.source = 'facebook'
        ORDER BY i.id
    """).fetchall()
    conn.close()

    todo = []
    for img_id, old_fname, post_id, post_url in rows:
        fname = stable_filename(post_id)
        dest = OUT_DIR / fname
        needs_update = old_fname != fname

        if dest.exists() and not is_placeholder(dest.read_bytes()):
            if needs_update:
                conn = get_conn()
                conn.execute("UPDATE images SET filename=? WHERE id=?", (fname, img_id))
                conn.commit()
                conn.close()
            continue  # already have good image

        todo.append((img_id, fname, post_id, post_url))

    print(f"{len(todo)} images need downloading ({len(rows) - len(todo)} already good)")
    if not todo:
        return

    ok = fail = 0

    with sync_playwright() as pw:
        browser, ctx, page = make_browser(pw)

        if "login" in page.goto("https://www.facebook.com/", wait_until="domcontentloaded", timeout=20000).url:
            print("Session expired — re-export cookies")
            browser.close()
            return

        for i, (img_id, fname, post_id, post_url) in enumerate(todo):
            dest = OUT_DIR / fname
            success = download_via_interception(page, post_url, dest)

            if success:
                conn = get_conn()
                conn.execute("UPDATE images SET filename=? WHERE id=?", (fname, img_id))
                conn.commit()
                conn.close()
                ok += 1
                print(f"  [{i+1}/{len(todo)}] {fname} ({dest.stat().st_size//1024}KB) — {post_url[-45:]}")
            else:
                fail += 1
                print(f"  [{i+1}/{len(todo)}] FAIL — {post_url[-45:]}")

            time.sleep(random.uniform(0.5, 1.0))

            if (i + 1) % 20 == 0:
                print("  Refreshing browser...")
                browser.close()
                browser, ctx, page = make_browser(pw)

        browser.close()

    print(f"\nDone. Downloaded: {ok}, Failed: {fail}")
    total = sum(p.stat().st_size for p in OUT_DIR.glob("fb_*.jpg")) // 1024
    print(f"Total size: {total}KB ({total//1024}MB)")


if __name__ == "__main__":
    download_all()
