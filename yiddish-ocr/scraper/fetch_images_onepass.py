"""
One-pass image fetch: for each post, load the page ONCE, find the correct
photo-link image URL via DOM selector, AND capture those exact bytes from
the network responses. Updates images.url and saves the file.
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
    return "fb_" + hashlib.md5(post_id.encode()).hexdigest()[:12] + ".jpg"


def is_bad(data: bytes | None) -> bool:
    if not data or len(data) < 15000:
        return True
    return hashlib.md5(data).hexdigest() == PLACEHOLDER_MD5


def fetch_post_image(page, post_url: str) -> tuple[str | None, bytes | None]:
    """
    Load post page, find the photo-link img src, capture its response bytes.
    Returns (cdn_url, image_bytes) or (None, None).
    """
    captured = {}  # url -> bytes

    def on_response(resp):
        url = resp.url
        if "scontent" not in url or "t39.30808" not in url:
            return
        if "/t39.30808-1/" in url:  # profile pics
            return
        try:
            body = resp.body()
            if len(body) > 15000 and hashlib.md5(body).hexdigest() != PLACEHOLDER_MD5:
                captured[url] = body
        except Exception:
            pass

    page.on("response", on_response)
    try:
        page.goto(post_url, wait_until="domcontentloaded", timeout=25000)
        page.wait_for_timeout(2500)

        if "login" in page.url:
            return None, None

        # Find the exact photo-link image URL
        target_url = None
        for link in page.query_selector_all("a[href*='/photo/?fbid='], a[href*='/photo/']"):
            href = link.get_attribute("href") or ""
            if "/stories/" in href:
                continue
            img = link.query_selector("img")
            if not img:
                continue
            src = img.get_attribute("src") or ""
            if "scontent" in src and "/t39.30808-6/" in src:
                target_url = src.split("?")[0]  # base URL without params
                break

        if not target_url:
            return None, None

        # Find matching captured response
        for url, data in captured.items():
            if target_url in url or url.split("?")[0] == target_url:
                return url, data

        # If not captured yet, wait a bit more
        page.wait_for_timeout(1500)
        for url, data in captured.items():
            if target_url in url or url.split("?")[0] == target_url:
                return url, data

        # Last resort: return cdn_url even if we didn't capture bytes
        return target_url, None

    finally:
        page.remove_listener("response", on_response)


def run(force: bool = False):
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
    for img_id, fname, cdn_url, post_id, post_url in rows:
        stable = stable_filename(post_id)
        dest = OUT_DIR / stable
        if not force and dest.exists() and not is_bad(dest.read_bytes()):
            continue
        todo.append((img_id, fname, cdn_url, post_id, post_url))

    already_good = len(rows) - len(todo)
    print(f"{len(todo)} images to fetch ({already_good} already good)")
    if not todo:
        print("All done!")
        return

    ok = url_only = fail = session_expired = 0

    with sync_playwright() as pw:
        browser, ctx, page = make_browser(pw)

        for i, (img_id, old_fname, old_cdn, post_id, post_url) in enumerate(todo):
            stable = stable_filename(post_id)
            dest = OUT_DIR / stable

            cdn_url, data = fetch_post_image(page, post_url)

            if cdn_url is None:
                # Check if session expired
                if "login" in page.url:
                    session_expired += 1
                    print(f"  [{i+1}/{len(todo)}] SESSION EXPIRED at post {post_id}")
                    break
                fail += 1
                print(f"  [{i+1}/{len(todo)}] NO IMAGE — {post_url[-50:]}")
            elif data and not is_bad(data):
                dest.write_bytes(data)
                conn = get_conn()
                conn.execute("UPDATE images SET url=?, filename=? WHERE id=?",
                             (cdn_url, stable, img_id))
                conn.commit()
                conn.close()
                ok += 1
                print(f"  [{i+1}/{len(todo)}] {stable} ({len(data)//1024}KB) — {post_url[-45:]}")
            else:
                # Got the URL but not the bytes — update URL in DB at least
                conn = get_conn()
                conn.execute("UPDATE images SET url=?, filename=? WHERE id=?",
                             (cdn_url, stable, img_id))
                conn.commit()
                conn.close()
                url_only += 1
                print(f"  [{i+1}/{len(todo)}] URL only, no bytes — {post_url[-45:]}")

            time.sleep(random.uniform(0.8, 1.3))

            if (i + 1) % 20 == 0 and not session_expired:
                print("  Refreshing browser...")
                browser.close()
                browser, ctx, page = make_browser(pw)

        browser.close()

    print(f"\nDone. Saved: {ok}, URL-only: {url_only}, No image: {fail}, Session expired: {session_expired}")
    good = [p for p in OUT_DIR.glob("fb_*.jpg") if not is_bad(p.read_bytes())]
    print(f"Total good images in dir: {len(good)}")


if __name__ == "__main__":
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument("--force", action="store_true")
    args = p.parse_args()
    run(force=args.force)
