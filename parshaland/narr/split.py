# Map the recording onto the 35 script lines (word-level alignment), cut each line at the quietest point between lines.
import json, re, difflib, numpy as np, soundfile as sf
W = json.load(open('words.json')); w, sr = sf.read('raw.wav')
ep = json.load(open(__import__('os').environ['EPISODE_JSON']))
lines = [(f's{si:02d}_{li:02d}', l) for si, s in enumerate(ep['segments']) for li, l in enumerate(s.get('narration', []))]
norm = lambda t: re.sub(r"[^a-z0-9']", '', t.lower().replace('120', 'onehundredtwenty'))
sw, owner = [], []
for i, (k, l) in enumerate(lines):
    for t in l.split(): sw.append(norm(t)); owner.append(i)
tw = [norm(x[0]) for x in W]
sm = difflib.SequenceMatcher(None, sw, tw, autojunk=False); first, last = {}, {}
for a, b, n in sm.get_matching_blocks():
    for d in range(n):
        i = owner[a + d]; j = b + d; first.setdefault(i, j); last[i] = j
e = np.convolve(np.abs(w), np.ones(int(sr * 0.02)) / int(sr * 0.02), 'same')
def quiet(t0, t1):   # quietest point between two times
    a, b = int(t0 * sr), int(t1 * sr)
    return (a + int(np.argmin(e[a:b]))) / sr if b > a + 10 else (t0 + t1) / 2
spans = []
for i in range(len(lines)):
    s = W[first[i]][1] if i in first else None; t = W[last[i]][2] if i in last else None; spans.append([s, t])
missing = [lines[i][0] for i, (s, t) in enumerate(spans) if s is None]
cuts = [max(0.0, spans[0][0] - 0.25)]
speech = np.percentile(e, 90)
for i in range(len(lines) - 1):
    # cut in the longest stretch of real silence between this line's last recognised word and the end of the next
    # line's first recognised word (word timings stretch over pauses, so we listen to the audio itself)
    t0 = W[last[i]][2] - 0.15; t1 = W[first[i + 1]][2]
    a0, a1 = int(t0 * sr), int(max(t1, t0 + 0.05) * sr); seg = e[a0:a1] < speech * 0.06
    best_len, best_mid, run = 0, None, 0
    for j, q in enumerate(seg):
        run = run + 1 if q else 0
        if run > best_len: best_len, best_mid = run, a0 + j - run // 2
    cuts.append(best_mid / sr if best_mid is not None else quiet(t0, t1))
cuts.append(min(len(w) / sr, spans[-1][1] + 0.6))
out = {}
for i, (k, l) in enumerate(lines):
    a, b = int(cuts[i] * sr), int(cuts[i + 1] * sr); clip = w[a:b]
    ee = np.convolve(np.abs(clip), np.ones(480) / 480, 'same'); on = np.where(ee > 0.03 * ee.max())[0]
    clip = clip[max(0, on[0] - int(sr * 0.06)):min(len(clip), on[-1] + int(sr * 0.18))]
    sf.write(f'line_{k}.wav', clip, sr); out[k] = round(len(clip) / sr, 2)
    heard = ' '.join(x[0] for x in W[first.get(i, 0):last.get(i, 0) + 1])
    print(f'{k} {out[k]:5.2f}s | {heard[:70]}')
print('missing:', missing); json.dump(out, open('line_durs.json', 'w'))
