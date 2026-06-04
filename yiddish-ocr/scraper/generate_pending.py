"""
Generate pending.json for the review app from the DB review_queue.
Writes to review-app/public/pending.json.
- Uses local /images/{filename} paths (no expiring CDN URLs)
- Excludes comments by the original poster (they're thank-yous, not translations)
"""

import json
from pathlib import Path
from db import get_conn

OUT = Path(__file__).parent.parent / "review-app" / "public" / "pending.json"
IMAGES_DIR = Path(__file__).parent.parent / "review-app" / "public" / "images"
MIN_TEXT_LEN = 40

import re

# Patterns that indicate a thank-you / follow-up, not a translation
THANKYOU_RE = re.compile(
    r'^.{0,80}('
    r'thank\s+you|thanks\s+so\s+much|thank\s+u\b|thanks\s+a\s+(million|lot|bunch)'
    r'|merci\b|danke\b|gracias\b'
    r'|marking\s+as\s+solved|marked\s+as\s+solved|\bSOLVED\b'
    r'|bumping\b'
    r"|you['']?\s*r?e?\s+welcome|you\s+are\s+(very\s+)?welcome"
    r'|my\s+pleasure'
    r'|glad\s+to\s+help|h?lad\s+to\s+help|happy\s+to\s+help'
    r'|\bprego\b'
    r'|no\s+worries'
    r'|nie\s+ma\s+za\s+co'
    r')',
    re.IGNORECASE,
)

# Patterns that clearly indicate discussion/meta, not translations
NON_TRANSLATION_RE = re.compile(
    r'(?:'
    r'working\s+on\s+it'
    r'|i\s+will\s+(start|translate)\b'
    r'|clearer\s+image'
    r'|\bdownload\s+of\s+.{0,25}image'
    r"|here.{0,3}s\s+(a\s+)?crop\b"
    r'|\bhere\s+is\s+the\s+(full\s+register|index|second\s+page)'
    r'|indexed\s+information\s+(available|next\s+to)'
    r'|did\s+you\s+see\s+my\s+(comment|post|reply|message|question)'
    r'|did\s+you\s+try\s+these'
    r'|please.{0,20}edit.{0,20}your\s+post'
    r'|please\s+change\s+your\s+heading'
    r'|will\s+post\s+tomorrow\s+for\s+a\s+translation'
    r'|chatgpt'
    r"|\bi\s+feel\s+like\s+i.{0,5}ve\s+seen\s+this"
    r')',
    re.IGNORECASE,
)


def photo_url_from_cdn(cdn_url: str) -> str | None:
    """Extract photo fbid from CDN URL and build a FB photo page link."""
    m = re.search(r'/t39\.30808-\d+/(\d+)_', cdn_url)
    if m:
        return f"https://www.facebook.com/photo/?fbid={m.group(1)}"
    return None


def generate():
    conn = get_conn()
    rows = conn.execute("""
        SELECT
            rq.id              AS queue_id,
            i.id               AS image_id,
            i.filename         AS image_file,
            i.url              AS cdn_url,
            t.raw_text         AS transcription,
            t.language,
            t.script,
            t.commenter_name   AS commenter,
            p.source,
            p.post_url,
            p.post_date,
            p.post_author
        FROM review_queue rq
        JOIN transcriptions t ON t.id = rq.transcription_id
        JOIN images i ON i.id = t.image_id
        JOIN posts p ON p.id = i.post_id
        WHERE rq.status = 'pending'
          AND length(trim(t.raw_text)) >= ?
          AND i.filename IS NOT NULL
        ORDER BY rq.id
    """, (MIN_TEXT_LEN,)).fetchall()
    conn.close()

    items = []
    filtered_thankyou = 0
    filtered_nontranslation = 0
    for row in rows:
        queue_id, image_id, image_file, cdn_url, transcription, language, script, commenter, source, post_url, post_date, post_author = row
        # Skip thank-you / acknowledgement messages
        if THANKYOU_RE.search(transcription):
            filtered_thankyou += 1
            continue
        # Skip clear non-translation discussion / meta comments
        if NON_TRANSLATION_RE.search(transcription):
            filtered_nontranslation += 1
            continue
        # Use local image if available, otherwise null (review app shows FB link)
        local_path = IMAGES_DIR / image_file if image_file else None
        has_local = bool(local_path and local_path.exists())
        items.append({
            "queue_id": queue_id,
            "image_id": image_id,
            "image_url": f"/images/{image_file}" if has_local else None,
            "fb_photo_url": photo_url_from_cdn(cdn_url) if cdn_url else None,
            "post_url": post_url,
            "transcription": transcription,
            "language": language,
            "script": script,
            "commenter": commenter,
            "source": source,
            "post_date": post_date,
        })

    OUT.write_text(json.dumps(items, indent=2, ensure_ascii=False))
    print(f"Written {len(items)} items → {OUT} (filtered {filtered_thankyou} thank-yous, {filtered_nontranslation} non-translations)")

    langs = {}
    for item in items:
        lang = item["language"] or "unknown"
        langs[lang] = langs.get(lang, 0) + 1
    for lang, count in sorted(langs.items(), key=lambda x: -x[1]):
        print(f"  {lang}: {count}")


if __name__ == "__main__":
    generate()
