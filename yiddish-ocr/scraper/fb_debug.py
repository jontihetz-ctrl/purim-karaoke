"""Debug script — takes a screenshot and dumps page HTML to see what Facebook shows."""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

COOKIES_FILE = Path(__file__).parent / "fb_cookies.json"
GROUP_URL = "https://www.facebook.com/groups/361690548110384/"

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

with sync_playwright() as pw:
    browser = pw.chromium.launch(
        headless=True,
        args=["--no-sandbox", "--disable-blink-features=AutomationControlled",
              "--ignore-certificate-errors"],
    )
    ctx = browser.new_context(
        viewport={"width": 1280, "height": 900},
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        locale="en-US",
        ignore_https_errors=True,
    )
    ctx.add_cookies(load_cookies())
    page = ctx.new_page()
    page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

    print(f"Loading {GROUP_URL}...")
    page.goto(GROUP_URL, wait_until="domcontentloaded", timeout=30000)
    page.wait_for_timeout(5000)

    print(f"URL after load: {page.url}")
    print(f"Page title: {page.title()}")

    # Screenshot
    page.screenshot(path="/tmp/fb_debug.png", full_page=False)
    print("Screenshot saved: /tmp/fb_debug.png")

    # Count key elements
    articles = page.query_selector_all("div[role='article']")
    print(f"div[role='article'] count: {len(articles)}")

    feed = page.query_selector("[role='feed']")
    print(f"[role='feed'] exists: {feed is not None}")

    # Dump a chunk of the HTML
    html = page.content()
    Path("/tmp/fb_debug.html").write_text(html[:50000])
    print(f"HTML snippet saved (first 50k chars): /tmp/fb_debug.html")
    print(f"Total HTML length: {len(html)}")

    browser.close()
