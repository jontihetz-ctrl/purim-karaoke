"""
Generate pending.json for the review app from the DB review_queue.
Writes to review-app/public/pending.json.
"""

import json
import re
from pathlib import Path
from db import get_conn

OUT = Path(__file__).parent.parent / "review-app" / "public" / "pending.json"
MIN_TEXT_LEN = 40


def downsize_url(url: str) -> str:
    """Replace Facebook CDN size param with 480px for faster loading."""
    return re.sub(r'stp=dst-jpg_s\d+x\d+', 'stp=dst-jpg_s480x480', url)


def generate():
    conn = get_conn()
    rows = conn.execute("""
        SELECT
            rq.id              AS queue_id,
            i.id               AS image_id,
            i.url              AS image_url,
            t.raw_text         AS transcription,
            t.language,
            t.script,
            t.commenter_name   AS commenter,
            p.source,
            p.post_text,
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
    for row in rows:
        queue_id, image_id, image_url, transcription, language, script, commenter, source, post_text, post_url, post_date = row
        items.append({
            "queue_id": queue_id,
            "image_id": image_id,
            "image_url": downsize_url(image_url),
            "transcription": transcription,
            "language": language,
            "script": script,
            "commenter": commenter,
            "source": source,
            "post_text": (post_text or "")[:400],
            "post_url": post_url,
            "post_date": post_date,
        })

    OUT.write_text(json.dumps(items, indent=2, ensure_ascii=False))
    print(f"Written {len(items)} items → {OUT}")

    langs = {}
    for item in items:
        lang = item["language"] or "unknown"
        langs[lang] = langs.get(lang, 0) + 1
    for lang, count in sorted(langs.items(), key=lambda x: -x[1]):
        print(f"  {lang}: {count}")


if __name__ == "__main__":
    generate()
