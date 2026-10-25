# Yiddish/Russian Postcard OCR — Training Data Pipeline

## Phase 1: Data Collection & Review

### Setup
```bash
cd scraper
pip install -r requirements.txt
playwright install chromium
```

### Run scraper
```bash
python facebook_scraper.py \
  --group-url "https://www.facebook.com/groups/YOUR_GROUP_ID" \
  --email "your@email.com" \
  --password "yourpassword" \
  --max-posts 500
```

### Review UI
```bash
cd review-ui
python app.py
# Open http://localhost:5050
```
Approve/reject each image+transcription pair. Approved pairs go into `training_pairs` table.

### Export approved training pairs
```bash
cd scraper
python export_training.py   # creates data/training/ with image files + labels.json
```

---

## Phase 2: Model Fine-tuning (coming after data collection)
- Base model: microsoft/trocr-large-handwritten
- Training: Runpod/Vast.ai cloud GPU
- Eval metric: CER (Character Error Rate)
