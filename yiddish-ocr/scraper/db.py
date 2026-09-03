import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "data" / "postcards.db"


def get_conn():
    DB_PATH.parent.mkdir(exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_conn()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS posts (
            id          TEXT PRIMARY KEY,
            source      TEXT NOT NULL,        -- 'facebook', 'yivo', 'nybookcentre'
            group_url   TEXT,
            post_url    TEXT,
            post_date   TEXT,
            post_text   TEXT,
            raw_json    TEXT,
            created_at  TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS images (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id     TEXT REFERENCES posts(id),
            filename    TEXT NOT NULL,        -- local path under data/images/
            url         TEXT,
            width       INTEGER,
            height      INTEGER
        );

        CREATE TABLE IF NOT EXISTS transcriptions (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            image_id        INTEGER REFERENCES images(id),
            source          TEXT,             -- 'comment', 'manual', 'model'
            commenter_name  TEXT,
            language        TEXT,             -- 'yiddish', 'russian', 'mixed'
            script          TEXT,             -- 'hebrew', 'cyrillic'
            raw_text        TEXT,             -- original script
            translation     TEXT,             -- English translation if provided
            created_at      TEXT DEFAULT (datetime('now'))
        );

        -- Review queue: human approves pairs before they enter training
        CREATE TABLE IF NOT EXISTS review_queue (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            image_id        INTEGER REFERENCES images(id),
            transcription_id INTEGER REFERENCES transcriptions(id),
            status          TEXT DEFAULT 'pending',  -- pending, approved, rejected
            reviewer_note   TEXT,
            reviewed_at     TEXT
        );

        -- Final approved training pairs
        CREATE TABLE IF NOT EXISTS training_pairs (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            image_id        INTEGER REFERENCES images(id),
            transcription   TEXT NOT NULL,
            language        TEXT,
            approved_at     TEXT DEFAULT (datetime('now'))
        );
    """)
    conn.commit()
    conn.close()
    print(f"DB initialised at {DB_PATH}")


if __name__ == "__main__":
    init_db()
