from flask import Flask, request, render_template_string
import json, uuid, datetime
from pathlib import Path

app = Flask(__name__)
UPLOAD_DIR = Path("/root/yiddish-training/images")
PAIRS_FILE = Path("/root/yiddish-training/pairs.jsonl")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
PASSWORD = "yiddish2024"

HTML = """<!DOCTYPE html>
<html>
<head>
<title>Yiddish Upload</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body{font-family:sans-serif;max-width:700px;margin:40px auto;padding:0 20px;background:#111;color:#eee}
h1{color:#f5c842}
input,textarea{width:100%;padding:10px;margin:8px 0 16px;background:#222;border:1px solid #444;color:#eee;border-radius:6px;box-sizing:border-box}
button{background:#2d6a2d;color:white;padding:12px 24px;border:none;border-radius:6px;font-size:16px;cursor:pointer}
button:hover{background:#3a8a3a}
.count{color:#aaa;font-size:14px;margin-top:20px}
.success{color:#4caf50;padding:10px;background:#1a2e1a;border-radius:6px;margin:10px 0}
label{color:#aaa;font-size:13px;text-transform:uppercase;letter-spacing:1px;display:block}
</style>
</head>
<body>
<h1>Yiddish Training Upload</h1>
<p style="color:#aaa">Upload a handwritten Yiddish document image and paste the English translation.</p>
{% if msg %}<div class="success">{{ msg }}</div>{% endif %}
<form method="POST" enctype="multipart/form-data" action="/upload?pw={{ pw }}">
  <label>Image file (JPG/PNG)</label>
  <input type="file" name="image" accept="image/*" required>
  <label>English translation</label>
  <textarea name="translation" rows="6" placeholder="Paste the English translation here..." required></textarea>
  <label>Notes (optional)</label>
  <input type="text" name="notes" placeholder="e.g. 1940 Shanghai, from Helena">
  <button type="submit">Upload pair</button>
</form>
<p class="count">Total pairs: {{ count }}</p>
</body>
</html>"""


def pair_count():
    if not PAIRS_FILE.exists():
        return 0
    return sum(1 for _ in open(PAIRS_FILE))


@app.route("/", methods=["GET"])
def index():
    pw = request.args.get("pw", "")
    if pw != PASSWORD:
        return """<html><body style="background:#111;color:#eee;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0">
        <form method=GET style="display:flex;gap:10px">
        <input name=pw type=password placeholder="Password" style="padding:10px;background:#222;border:1px solid #444;color:#eee;border-radius:6px">
        <button style="background:#2d6a2d;color:white;padding:10px 20px;border:none;border-radius:6px;cursor:pointer">Enter</button>
        </form></body></html>"""
    return render_template_string(HTML, msg=None, count=pair_count(), pw=pw)


@app.route("/upload", methods=["POST"])
def upload():
    pw = request.args.get("pw", "")
    if pw != PASSWORD:
        return "Unauthorized", 401
    img = request.files.get("image")
    translation = request.form.get("translation", "").strip()
    notes = request.form.get("notes", "").strip()
    if not img or not translation:
        return "Missing image or translation", 400
    ext = img.filename.rsplit(".", 1)[-1].lower() if "." in img.filename else "jpg"
    uid = str(uuid.uuid4())[:8]
    fname = f"{uid}.{ext}"
    img.save(UPLOAD_DIR / fname)
    pair = {
        "id": uid,
        "image": fname,
        "translation": translation,
        "notes": notes,
        "uploaded": datetime.datetime.utcnow().isoformat(),
    }
    with open(PAIRS_FILE, "a") as f:
        f.write(json.dumps(pair, ensure_ascii=False) + "\n")
    return render_template_string(HTML, msg=f"Saved! {fname} — {pair_count()} total pairs", count=pair_count(), pw=pw)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050, debug=False)
