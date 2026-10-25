# Split a narration recording into script lines, keeping only the LAST complete take of each line.
# Mistakes, false starts and repeated sentences are thrown away.
#  - every attempt at a line is found by matching the script line against the transcript (faster-whisper word timings);
#  - a dynamic program picks one attempt per line, in order, preferring complete takes and, among equally good ones, the later take;
#  - each clip is cut in real silence just before and just after the chosen take (word timings stretch over pauses).
# Usage (in the episode's narration folder, after transcribe.py): EPISODE_JSON=… python split_retakes.py
import json, os, re, difflib, numpy as np, soundfile as sf
W = json.load(open('words.json')); w, sr = sf.read('raw.wav')
ep = json.load(open(os.environ['EPISODE_JSON']))
lines = [(f's{si:02d}_{li:02d}', l) for si, s in enumerate(ep['segments']) for li, l in enumerate(s.get('narration', []))]
norm = lambda t: re.sub(r"[^a-z0-9']", '', t.lower())
tw = [norm(x[0]) for x in W]
def wsim(a, b): return a == b or (len(a) > 2 and len(b) > 2 and difflib.SequenceMatcher(None, a, b).ratio() >= 0.7)
def align(lw, j):   # best end and coverage of script line lw starting at transcript index j
    best = (0.0, j)
    for m in range(max(1, int(len(lw) * 0.6)), int(len(lw) * 1.5) + 3):
        seg = tw[j:j + m]
        if not seg: break
        sm = difflib.SequenceMatcher(None, lw, seg, autojunk=False); blocks = sm.get_matching_blocks()
        matched = sum(b.size for b in blocks)
        # fuzzy credit for near-miss words (Hebrew names the recogniser spells oddly)
        for op, a0, a1, b0, b1 in sm.get_opcodes():
            if op == 'replace': matched += 0.6 * sum(1 for x, y in zip(lw[a0:a1], seg[b0:b1]) if wsim(x, y)) + 0.3 * min(a1 - a0, b1 - b0) * (a1 - a0 == b1 - b0)
        cov = matched / len(lw) - 0.04 * max(0, m - len(lw))            # penalise swallowing extra words
        last = max([b.b + b.size - 1 for b in blocks if b.size] or [0])
        if cov > best[0]: best = (cov, j + max(last, min(m, len(seg)) - 1 if cov > 0.85 else last))
    return best
cands = []
for i, (k, l) in enumerate(lines):
    lw = [norm(x) for x in l.split() if norm(x)]; cs = []
    for j in range(len(tw)):
        if any(wsim(tw[j], lw[q]) for q in range(min(2, len(lw)))) or (j > 0 and i == 0 and False):
            cov, end = align(lw, j)
            if cov >= 0.5: cs.append((j, end, cov))
    cands.append(cs)
# dynamic program over lines: maximise coverage, prefer later takes (small bonus), keep order
INF = -1e9; best = [{} for _ in lines]
for i, cs in enumerate(cands):
    for c in cs:
        bonus = 0.002 * c[0] / max(1, len(tw)) * 100
        if i == 0: best[i][c] = (c[2] + bonus, None)
        else:
            prev = [(v[0], pc) for pc, v in best[i - 1].items() if pc[1] < c[0]]
            if prev: s, pc = max(prev); best[i][c] = (s + c[2] + bonus, pc)
    if not best[i]: raise SystemExit(f'line {lines[i][0]} not found: {lines[i][1]}')
chosen = [None] * len(lines); c = max(best[-1], key=lambda x: best[-1][x][0])
for i in range(len(lines) - 1, -1, -1): chosen[i] = c; c = best[i][c][1]
e = np.convolve(np.abs(w), np.ones(int(sr * 0.02)) / int(sr * 0.02), 'same'); speech = np.percentile(e, 90)
def silence_mid(t0, t1, prefer):   # middle of the longest real silence in [t0, t1]; prefer='end' picks the one nearest t1
    a0, a1 = int(max(0, t0) * sr), int(max(t1, t0 + 0.03) * sr); q = e[a0:a1] < speech * 0.06; runs, run = [], 0
    for j, v in enumerate(q):
        run = run + 1 if v else 0
        if run and (j + 1 == len(q) or not q[j + 1]): runs.append((run, a0 + j - run // 2))
    if not runs: return (t0 + t1) / 2
    runs = [r for r in runs if r[0] > sr * 0.05] or runs
    return (max(runs, key=lambda r: (r[1] if prefer == 'end' else -r[1], r[0]))[1] if prefer in ('end', 'start') else max(runs)[1]) / sr
for i in range(len(lines)):
    j0, j1, cov = chosen[i]; floor_j = chosen[i - 1][1] + 1 if i else 0; back = 0
    while j0 - 1 >= floor_j and back < 3 and W[j0][1] - W[j0 - 1][2] < 0.3: j0 -= 1; back += 1
    chosen[i] = (j0, j1, cov)
# 2) a restart inside a line ("and struck Pharaoh — and struck Pharaoh's house"): cut the first attempt
def restarts(j0, j1):
    # a phrase of 2–4 words spoken, then immediately spoken again (the last word may grow: "Puro" -> "Puro's")
    cuts, i0 = [], j0
    while i0 < j1:
        hit = None
        for n in (4, 3, 2):
            for j in range(i0 + n, min(j1 + 1, i0 + n + 4)):
                if j + n - 1 > j1: break
                same = all(tw[i0 + q] == tw[j + q] or (q == n - 1 and len(tw[i0 + q]) >= 3 and tw[j + q].startswith(tw[i0 + q])) for q in range(n))
                if same and max(len(tw[i0 + q]) for q in range(n)) >= 4: hit = (W[i0][1], W[j][1], ' '.join(x[0] for x in W[i0:j]), j); break
            if hit: break
        if hit: cuts.append(hit[:3]); i0 = hit[3]
        else: i0 += 1
    return cuts
report = {}
for i, (k, l) in enumerate(lines):
    j0, j1, cov = chosen[i]; t_start, t_end = W[j0][1], W[j1][2]
    prev_end = W[chosen[i - 1][1]][2] if i else 0.0; next_start = W[chosen[i + 1][0]][1] if i + 1 < len(lines) else len(w) / sr
    # start: the silence closest before this take (anything before it — e.g. a failed attempt — is dropped)
    a = silence_mid(max(prev_end, t_start - 1.2), t_start + 0.05, 'end')
    b = silence_mid(t_end - 0.05, min(next_start, t_end + 1.2), 'start')
    clip = w[int(a * sr):int(b * sr)]
    rs = restarts(j0, j1); removed = []
    for c0, c1, txt in sorted(rs, reverse=True):
        x0 = silence_mid(c0 - 0.25, c0 + 0.05, 'end') - a; x1 = silence_mid(c1 - 0.3, c1 + 0.02, 'end') - a
        if 0 < x0 < x1 < len(clip) / sr: i0, i1 = int(x0 * sr), int(x1 * sr); f = int(sr * 0.01); clip = np.concatenate([clip[:i0 - f] if i0 > f else clip[:0], clip[i0 - f:i0] * np.linspace(1, 0, f) + clip[i1:i1 + f] * np.linspace(0, 1, f) if i0 > f else clip[:0], clip[i1 + f:]]); removed.append(txt)
    ee = np.convolve(np.abs(clip), np.ones(480) / 480, 'same'); on = np.where(ee > 0.03 * ee.max())[0]
    clip = clip[max(0, on[0] - int(sr * 0.06)):min(len(clip), on[-1] + int(sr * 0.18))]
    sf.write(f'line_{k}.wav', clip, sr)
    skipped = sum(1 for x in W if prev_end < x[1] < t_start - 0.05) if i else sum(1 for x in W if x[1] < t_start - 0.05)
    report[k] = {'take_start': round(t_start, 2), 'coverage': round(cov, 2), 'words_dropped_before': skipped, 'len': round(len(clip) / sr, 2), 'restart_removed': removed}
    print(f"{k} {report[k]['len']:5.2f}s  cov {cov:.2f}  dropped-before {skipped:2d} {'CUT ' + repr(removed) if removed else ''} | {' '.join(x[0] for x in W[j0:j1 + 1])[:70]}")
json.dump(report, open('split_report.json', 'w'), indent=1)
