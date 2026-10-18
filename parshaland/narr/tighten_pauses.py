# Shorten unnaturally long silences inside a narration line (left behind by a pause or a removed mistake) to a natural length.
# Usage: python tighten_pauses.py line_*.wav   (edits in place; keeps a .orig copy)
import sys, shutil, numpy as np, soundfile as sf
MAXP, KEEP = 0.75, 0.45                       # pauses longer than MAXP seconds become KEEP seconds
for f in sys.argv[1:]:
    w, sr = sf.read(f); e = np.convolve(np.abs(w), np.ones(int(sr * 0.03)) / int(sr * 0.03), 'same'); thr = np.percentile(e, 90) * 0.06
    q = e < thr; runs, i = [], 0
    while i < len(q):
        if q[i]:
            j = i
            while j < len(q) and q[j]: j += 1
            if i > sr * 0.2 and j < len(q) - sr * 0.2 and (j - i) > MAXP * sr: runs.append((i, j))
            i = j
        else: i += 1
    if not runs: continue
    shutil.copy(f, f + '.orig'); out = w.copy(); fd = int(sr * 0.01)
    for a, b in reversed(runs):
        keep = int(KEEP * sr); m = (a + b) // 2; c0, c1 = m - keep // 2, m + keep // 2
        out = np.concatenate([out[:c0], out[c0:c0 + fd] * np.linspace(1, 0, fd) + out[c1:c1 + fd] * np.linspace(0, 1, fd), out[c1 + fd:]])
    sf.write(f, out, sr); print(f, 'pauses shortened:', [round((b - a) / sr, 2) for a, b in runs], f'{len(w)/sr:.2f}s -> {len(out)/sr:.2f}s')
