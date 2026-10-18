"""
Add post_author column to posts table and populate it by visiting each FB post page.
The post author is the person who posted the image (asker), whose own comments we filter out.
"""

import json
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


def ensure_column():
    conn = get_conn()
    cols = [r[1] for r in conn.execute("PRAGMA table_info(posts)").fetchall()]
    if "post_author" not in cols:
        conn.execute("ALTER TABLE posts ADD COLUMN post_author TEXT")
        conn.commit()
        print("Added post_author column")
    conn.close()


def get_post_author(page, post_url: str) -> str | None:
    """Visit a post and extract the author's display name."""
    try:
        page.goto(post_url, wait_until="domcontentloaded", timeout=25000)
        page.wait_for_timeout(2000)

        if "login" in page.url:
            return None

        # The post author is in the first [role='article'] — find the header link
        # Try several selectors for the author name
        for sel in [
            "h2 a span[dir='auto']",
            "h2 strong a span",
            "div[data-testid='post_chevron_button'] ~ div a span",
            "strong a span",
            "a[role='link'] span[dir='auto']",
        ]:
            try:
                els = page.query_selector_all(sel)
                for el in els:
                    name = el.inner_text().strip()
                    if name and len(name) > 2 and len(name) < 60:
                        return name
            except Exception:
                pass

        return None

    except Exception as e:
        print(f"  Error: {e}")
        return None


def run(max_posts: int = 60):
    ensure_column()

    from playwright.sync_api import sync_playwright

    conn = get_conn()
    posts = conn.execute(
        "SELECT id, post_url, post_author FROM posts WHERE source='facebook' ORDER BY id"
    ).fetchall()
    conn.close()

    todo = [(pid, url) for pid, url, author in posts if not author]
    print(f"{len(todo)} posts need post_author ({len(posts) - len(todo)} already set)")

    if not todo:
        print("All done!")
        return

    todo = todo[:max_posts]

    with sync_playwright() as pw:
        browser, ctx, page = make_browser(pw)

        for i, (post_id, post_url) in enumerate(todo):
            author = get_post_author(page, post_url)
            if author:
                conn = get_conn()
                conn.execute("UPDATE posts SET post_author=? WHERE id=?", (author, post_id))
                conn.commit()
                conn.close()
                print(f"  [{i+1}/{len(todo)}] {author!r} — {post_url[-50:]}")
            else:
                print(f"  [{i+1}/{len(todo)}] NOT FOUND — {post_url[-50:]}")

            time.sleep(random.uniform(0.8, 1.5))

            if (i + 1) % 25 == 0:
                browser.close()
                browser, ctx, page = make_browser(pw)

        browser.close()

    conn = get_conn()
    filled = conn.execute("SELECT COUNT(*) FROM posts WHERE post_author IS NOT NULL AND source='facebook'").fetchone()[0]
    conn.close()
    print(f"\nDone. {filled}/{len(posts)} posts now have post_author.")


if __name__ == "__main__":
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument("--max-posts", type=int, default=60)
    args = p.parse_args()
    run(args.max_posts)
