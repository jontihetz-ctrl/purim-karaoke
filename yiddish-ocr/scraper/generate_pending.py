"""
Generate pending.json for the review app from the DB review_queue.
Writes to review-app/public/pending.json.
"""

import json
from pathlib import Path
from db import get_conn

OUT = Path(__file__).parent.parent / "review-app" / "public" / "pending.json"
MIN_TEXT_LEN = 40


def generate():
    conn = get_conn()
    rows = conn.execute("""
        SELECT
            rq.id          AS queue_id,
            i.id           AS image_id,
            i.url          AS image_url,
            t.raw_text     AS text,
            t.language,
            t.script,
            t.commenter_name AS author,
            p.post_url,
            p.post_date
        FROM review_queue rq
        JOIN transcriptions t ON t.id = rq.transcription_id
        JOIN images i ON i.id = t.image_id
        JOIN posts p ON p.id = i.post_id
        WHERE rq.status = 'pending'
          AND length(trim(t.raw_text)) >= ?
          AND i.url LIKE '%scontent%'
        ORDER BY rq.id
    """, (MIN_TEXT_LEN,)).fetchall()
    conn.close()

    items = []
    seen_urls = set()
    for row in rows:
        queue_id, image_id, image_url, text, language, script, author, post_url, post_date = row
        # Deduplicate by image_url to avoid showing same image repeatedly
        if image_url in seen_urls:
            # Still include but with different transcription
            pass
        seen_urls.add(image_url)
        items.append({
            "queue_id": queue_id,
            "image_id": image_id,
            "image_url": image_url,
            "text": text,
            "language": language,
            "script": script,
            "author": author,
            "post_url": post_url,
            "post_date": post_date,
        })

    OUT.write_text(json.dumps(items, indent=2, ensure_ascii=False))
    print(f"Written {len(items)} items → {OUT}")

    # Report breakdown
    langs = {}
    for item in items:
        lang = item["language"] or "unknown"
        langs[lang] = langs.get(lang, 0) + 1
    for lang, count in sorted(langs.items(), key=lambda x: -x[1]):
        print(f"  {lang}: {count}")


if __name__ == "__main__":
    generate()
