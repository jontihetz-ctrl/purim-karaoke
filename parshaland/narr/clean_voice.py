# Silence stray sounds a voice converter can invent in the pauses (e.g. a breath turned into a cough-like noise).
# Anything audible more than 0.25 s after a line's last word (or before its first) is faded out. Line length is unchanged.
# Usage: python clean_voice.py <voice-dir>     (needs align.py; edits the .wav files in place, keeps copies in <voice-dir>/before_clean/)
import json, os, sys, glob, shutil, subprocess, numpy as np, soundfile as sf
D = sys.argv[1]; files = sorted(glob.glob(os.path.join(D, 's*.wav'))); os.makedirs(os.path.join(D, 'before_clean'), exist_ok=True)
for f in files: shutil.copy(f, os.path.join(D, 'before_clean', os.path.basename(f)))
j = os.path.join(D, 'words_clean.json'); subprocess.run([sys.executable, '-I', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'align.py'), j, *files], capture_output=True)
d = json.load(open(j)); report = []
for f in files:
    ws = d.get(f) or []
    if not ws: continue
    w, sr = sf.read(f); e = np.convolve(np.abs(w), np.ones(int(sr * 0.02)) / int(sr * 0.02), 'same')
    end, start = ws[-1][2], ws[0][1]; speech = np.percentile(e[int(start * sr):int(end * sr)], 75)
    tail0 = min(len(w), int((end + 0.25) * sr)); tail = e[tail0:]; lt = (tail > 0.12 * speech).sum() / sr if len(tail) else 0
    head1 = max(0, int((start - 0.15) * sr)); head = e[:head1]; lh = (head > 0.12 * speech).sum() / sr if len(head) else 0
    if lt > 0.03 or lh > 0.03:
        y = w.copy()
        if lt > 0.03: fo = int(sr * 0.06); y[tail0:tail0 + fo] *= np.linspace(1, 0, min(fo, len(y) - tail0)); y[tail0 + fo:] = 0.0
        if lh > 0.03: fi = int(sr * 0.04); y[:max(0, head1 - fi)] = 0.0; y[max(0, head1 - fi):head1] *= np.linspace(0, 1, head1 - max(0, head1 - fi))
        sf.write(f, y, sr); report.append((os.path.basename(f), round(lt, 2), round(lh, 2)))
print('stray sounds silenced (file, seconds after last word, before first):', report)
