import json, sys
from faster_whisper import WhisperModel
m = WhisperModel('small.en', device='cpu', compute_type='int8', cpu_threads=4)
segs, _ = m.transcribe('raw.wav', word_timestamps=True, beam_size=5, language='en', condition_on_previous_text=False, vad_filter=False)
words = [[w.word.strip(), round(w.start, 3), round(w.end, 3)] for s in segs for w in (s.words or [])]
json.dump(words, open('words.json', 'w')); print(len(words), 'words'); print(' '.join(w[0] for w in words))
