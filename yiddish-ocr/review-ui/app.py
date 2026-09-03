"""
Review UI — approve/reject image+transcription pairs before training.

Local:   python app.py  →  http://localhost:5050
VPS:     python app.py --host 0.0.0.0 --port 5050

Also exposes a JSON API used by the Vercel review frontend:
  GET  /api/next           → next pending item (with image as base64)
  POST /api/review/<id>    → {"action": "approve"|"reject"|"skip", "transcription": "..."}
  GET  /api/stats          → counts
"""

import argparse
import base64
import sqlite3
from pathlib import Path
from flask import Flask, render_template_string, request, redirect, jsonify
from flask_cors import CORS

DB_PATH = Path(__file__).parent.parent / "data" / "postcards.db"
IMAGES_DIR = Path(__file__).parent.parent / "data" / "images"

app = Flask(__name__)
CORS(app)  # Allow Vercel frontend to call this API

HTML = """
<!DOCTYPE html>
<html>
<head>
<title>Postcard Review</title>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: sans-serif; background: #111; color: #eee; }
.header { background: #1a1208; border-bottom: 1px solid #444; padding: 16px 24px; display: flex; gap: 24px; align-items: center; }
.header h1 { color: #f5c842; font-size: 18px; }
.stats { color: #888; font-size: 13px; }
.container { display: grid; grid-template-columns: 1fr 1fr; gap: 0; height: calc(100vh - 57px); }
.image-panel { border-right: 1px solid #333; overflow: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
.image-panel img { max-width: 100%; border-radius: 8px; border: 1px solid #333; }
.data-panel { overflow: auto; padding: 20px; display: flex; flex-direction: column; gap: 16px; }
.field label { font-size: 11px; text-transform: uppercase; color: #888; letter-spacing: 1px; display: block; margin-bottom: 4px; }
.field textarea { width: 100%; background: #1c1c1c; border: 1px solid #333; color: #eee; padding: 10px; border-radius: 6px; font-size: 13px; resize: vertical; }
.field textarea[dir=rtl] { font-size: 15px; line-height: 1.8; }
.actions { display: flex; gap: 10px; margin-top: 8px; }
.btn { padding: 10px 24px; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; }
.btn-approve { background: #2d6a2d; color: #fff; }
.btn-approve:hover { background: #3a8a3a; }
.btn-reject { background: #6a2d2d; color: #fff; }
.btn-reject:hover { background: #8a3a3a; }
.btn-skip { background: #333; color: #aaa; }
.meta { font-size: 12px; color: #666; }
.lang-badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; margin-right: 6px; }
.yiddish { background: #2a1f00; color: #f5c842; }
.russian { background: #001f2a; color: #42c8f5; }
.unknown { background: #222; color: #888; }
.empty { text-align: center; padding: 60px; color: #666; }
</style>
</head>
<body>
<div class="header">
  <h1>✉️ Postcard Review</h1>
  <span class="stats">{{ stats.pending }} pending · {{ stats.approved }} approved · {{ stats.rejected }} rejected</span>
</div>

{% if item %}
<div class="container">
  <div class="image-panel">
    <img src="/image/{{ item.image_id }}" alt="postcard">
    <div class="meta">
      Source: {{ item.source }} &nbsp;|&nbsp; Post: {{ item.post_date or 'unknown date' }}<br>
      Commenter: <strong>{{ item.commenter_name or 'unknown' }}</strong>
    </div>
    {% if item.post_text %}
    <div class="field">
      <label>Post caption</label>
      <textarea rows="3" readonly>{{ item.post_text }}</textarea>
    </div>
    {% endif %}
  </div>

  <div class="data-panel">
    <div class="field">
      <label>Language detected</label>
      <span class="lang-badge {{ item.language }}">{{ item.language }}</span>
      <span class="lang-badge">{{ item.script }} script</span>
    </div>

    <div class="field">
      <label>Transcription / Comment text</label>
      <textarea dir="{{ 'rtl' if item.script == 'hebrew' else 'ltr' }}" rows="8" id="transcription">{{ item.raw_text }}</textarea>
    </div>

    <div class="field">
      <label>Language tag (edit if wrong)</label>
      <select id="lang" style="background:#1c1c1c;border:1px solid #333;color:#eee;padding:8px;border-radius:6px;width:100%">
        <option value="yiddish" {{ 'selected' if item.language=='yiddish' }}>Yiddish</option>
        <option value="russian" {{ 'selected' if item.language=='russian' }}>Russian</option>
        <option value="mixed" {{ 'selected' if item.language=='mixed' }}>Mixed</option>
        <option value="unknown" {{ 'selected' if item.language=='unknown' }}>Unknown / Not a transcription</option>
      </select>
    </div>

    <div class="field">
      <label>Reviewer note (optional)</label>
      <textarea rows="2" id="note" placeholder="Any notes about quality, confidence, etc."></textarea>
    </div>

    <div class="actions">
      <form method="POST" action="/review/{{ item.queue_id }}" style="display:contents">
        <input type="hidden" name="action" value="approve">
        <input type="hidden" name="transcription" id="hid_trans" value="{{ item.raw_text }}">
        <button type="submit" class="btn btn-approve" onclick="syncFields()">✓ Approve</button>
      </form>
      <form method="POST" action="/review/{{ item.queue_id }}" style="display:contents">
        <input type="hidden" name="action" value="reject">
        <button type="submit" class="btn btn-reject">✗ Reject</button>
      </form>
      <form method="POST" action="/review/{{ item.queue_id }}" style="display:contents">
        <input type="hidden" name="action" value="skip">
        <button type="submit" class="btn btn-skip">→ Skip</button>
      </form>
    </div>
  </div>
</div>
<script>
function syncFields() {
  document.getElementById('hid_trans').value = document.getElementById('transcription').value;
}
</script>
{% else %}
<div class="empty">
  <h2>🎉 Review queue empty</h2>
  <p style="margin-top:12px;color:#555">Run the scraper to collect more postcards, or add images manually.</p>
</div>
{% endif %}
</body>
</html>
"""


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def get_stats():
    conn = get_db()
    stats = {
        "pending": conn.execute("SELECT COUNT(*) FROM review_queue WHERE status='pending'").fetchone()[0],
        "approved": conn.execute("SELECT COUNT(*) FROM review_queue WHERE status='approved'").fetchone()[0],
        "rejected": conn.execute("SELECT COUNT(*) FROM review_queue WHERE status='rejected'").fetchone()[0],
    }
    conn.close()
    return stats


def get_next_item():
    if not DB_PATH.exists():
        return None
    conn = get_db()
    row = conn.execute("""
        SELECT rq.id as queue_id, rq.image_id, rq.transcription_id,
               t.commenter_name, t.language, t.script, t.raw_text, t.source,
               p.post_text, p.post_date, i.filename
        FROM review_queue rq
        JOIN transcriptions t ON t.id = rq.transcription_id
        JOIN images i ON i.id = rq.image_id
        JOIN posts p ON p.id = i.post_id
        WHERE rq.status = 'pending'
        ORDER BY rq.id
        LIMIT 1
    """).fetchone()
    conn.close()
    return dict(row) if row else None


def do_review(queue_id, action, transcription=None):
    conn = get_db()
    conn.execute(
        "UPDATE review_queue SET status=?, reviewed_at=datetime('now') WHERE id=?",
        (action if action != "skip" else "pending", queue_id)
    )
    if action == "approve":
        item = conn.execute(
            "SELECT image_id, transcription_id FROM review_queue WHERE id=?", (queue_id,)
        ).fetchone()
        if item:
            trans = conn.execute(
                "SELECT raw_text, language FROM transcriptions WHERE id=?", (item[1],)
            ).fetchone()
            if trans:
                text = transcription or trans[0]
                conn.execute(
                    "INSERT OR IGNORE INTO training_pairs (image_id, transcription, language) VALUES (?,?,?)",
                    (item[0], text, trans[1])
                )
    conn.commit()
    conn.close()


def image_as_base64(image_id):
    conn = get_db()
    row = conn.execute("SELECT filename FROM images WHERE id=?", (image_id,)).fetchone()
    conn.close()
    if not row:
        return None
    img_path = IMAGES_DIR / Path(row[0]).name
    if not img_path.exists():
        return None
    return base64.b64encode(img_path.read_bytes()).decode()


# ── HTML UI ──────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    item = get_next_item()
    stats = get_stats() if DB_PATH.exists() else {"pending": 0, "approved": 0, "rejected": 0}
    return render_template_string(HTML, item=item, stats=stats)


@app.route("/review/<int:queue_id>", methods=["POST"])
def review(queue_id):
    action = request.form["action"]
    transcription = request.form.get("transcription")
    do_review(queue_id, action, transcription)
    return redirect("/")


@app.route("/image/<int:image_id>")
def serve_image(image_id):
    b64 = image_as_base64(image_id)
    if not b64:
        return "Not found", 404
    return f'<img src="data:image/jpeg;base64,{b64}">', 200


# ── JSON API (used by Vercel frontend) ───────────────────────────────────────

@app.route("/api/stats")
def api_stats():
    return jsonify(get_stats())


@app.route("/api/next")
def api_next():
    item = get_next_item()
    if not item:
        return jsonify(None)
    b64 = image_as_base64(item["image_id"])
    return jsonify({
        "queue_id": item["queue_id"],
        "image_id": item["image_id"],
        "image_b64": b64,
        "transcription": item["raw_text"],
        "language": item["language"],
        "script": item["script"],
        "source": item["source"],
        "commenter": item["commenter_name"],
        "post_text": item["post_text"],
        "post_date": item["post_date"],
    })


@app.route("/api/review/<int:queue_id>", methods=["POST"])
def api_review(queue_id):
    data = request.get_json()
    action = data.get("action")
    transcription = data.get("transcription")
    if action not in ("approve", "reject", "skip"):
        return jsonify({"error": "invalid action"}), 400
    do_review(queue_id, action, transcription)
    return jsonify({"ok": True})


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--host", default="127.0.0.1")
    p.add_argument("--port", type=int, default=5050)
    args = p.parse_args()
    app.run(host=args.host, port=args.port, debug=False)
