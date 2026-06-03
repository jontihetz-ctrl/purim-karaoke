"""
Local review UI — approve/reject image+transcription pairs before training.
Run: python app.py  →  http://localhost:5050
"""

from flask import Flask, render_template_string, request, redirect, jsonify
import sqlite3
from pathlib import Path
import base64

DB_PATH = Path(__file__).parent.parent / "data" / "postcards.db"
IMAGES_DIR = Path(__file__).parent.parent / "data" / "images"

app = Flask(__name__)

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
        <input type="hidden" name="transcription_id" id="hid_trans" value="{{ item.transcription_id }}">
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
  // Update transcription before submit
  document.querySelector('input[name="transcription_id"]').value = document.getElementById('transcription').value;
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


def get_stats():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
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
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
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


@app.route("/")
def index():
    item = get_next_item()
    stats = get_stats() if DB_PATH.exists() else {"pending": 0, "approved": 0, "rejected": 0}
    return render_template_string(HTML, item=item, stats=stats)


@app.route("/review/<int:queue_id>", methods=["POST"])
def review(queue_id):
    action = request.form["action"]
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        "UPDATE review_queue SET status=?, reviewed_at=datetime('now') WHERE id=?",
        (action if action != "skip" else "pending", queue_id)
    )
    if action == "approve":
        # Promote to training pairs
        item = conn.execute(
            "SELECT image_id, transcription_id FROM review_queue WHERE id=?", (queue_id,)
        ).fetchone()
        if item:
            trans = conn.execute(
                "SELECT raw_text, language FROM transcriptions WHERE id=?", (item[1],)
            ).fetchone()
            if trans:
                conn.execute(
                    "INSERT INTO training_pairs (image_id, transcription, language) VALUES (?,?,?)",
                    (item[0], trans[0], trans[1])
                )
    conn.commit()
    conn.close()
    return redirect("/")


@app.route("/image/<int:image_id>")
def serve_image(image_id):
    conn = sqlite3.connect(DB_PATH)
    row = conn.execute("SELECT filename FROM images WHERE id=?", (image_id,)).fetchone()
    conn.close()
    if not row:
        return "Not found", 404
    img_path = IMAGES_DIR / Path(row[0]).name
    if not img_path.exists():
        return "File not found", 404
    data = img_path.read_bytes()
    b64 = base64.b64encode(data).decode()
    return f'<img src="data:image/jpeg;base64,{b64}">', 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050, debug=True)
