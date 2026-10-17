# Word timings for narration takes (faster-whisper). Usage: align.py out.json a.wav b.wav ...  → {file: [[word, start, end], ...]}
import sys, json
from faster_whisper import WhisperModel
m = WhisperModel('small.en', device='cpu', compute_type='int8', cpu_threads=4)
out = {}
for f in sys.argv[2:]:
    segs, _ = m.transcribe(f, word_timestamps=True, beam_size=5, language='en', condition_on_previous_text=False)
    out[f] = [[w.word.strip(), round(w.start, 3), round(w.end, 3)] for s in segs for w in (s.words or [])]
json.dump(out, open(sys.argv[1], 'w'))
