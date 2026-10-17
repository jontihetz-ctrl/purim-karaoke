# For each line keep the clearest conversion (normal / 0.85 / 0.75 source speed), judged against the script.
import json, re, difflib, subprocess, shutil, glob
ep = json.load(open(__import__('os').environ['EPISODE_JSON'])); S = {f's{si:02d}_{li:02d}': l for si, sg in enumerate(ep['segments']) for li, l in enumerate(sg.get('narration', []))}
W = lambda t: re.findall(r"[a-z']+", t.lower())
cands = {k: [f'vc/C_{k}.wav', f'vc2/C_{k}_0.85.wav', f'vc2/C_{k}_0.75.wav'] for k in S}
subprocess.run([__import__('os').environ.get('PY_TOOLS', '/home/user/parshaland_work/ptts/bin/python'), '-I', __import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)), 'align.py'), 'pick.json', *[p for v in cands.values() for p in v]], capture_output=True); d = json.load(open('pick.json'))
for k, ps in cands.items():
    sc = [(difflib.SequenceMatcher(None, W(' '.join(x[0] for x in d.get(p, []))), W(S[k])).ratio(), -i, p) for i, p in enumerate(ps)]
    best = max(sc); shutil.copy(best[2], f'vc/best_C_{k}.wav'); print(k, f'{best[0]:.2f}', best[2].split('/')[-1])
