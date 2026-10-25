# "Lovely & kid-friendly" finishing for converted narration:
#  1) melody: widen the pitch movement (the conversion flattened it) and lift the voice ~1.5 semitones — WORLD vocoder
#  2) soft, warm, sparkly tone with gentle compression and a cosy room
import sys, glob, subprocess, numpy as np, soundfile as sf, pyworld as pw
sys.path.insert(0, '.'); from polish import room
import os as _os; FF = _os.environ.get('FFMPEG', 'ffmpeg')
LIFT, WIDEN = 1.5, 1.55
def set_params(lift, widen):
    global LIFT, WIDEN; LIFT, WIDEN = lift, widen
CHAIN = ','.join(['highpass=f=90:poles=2', 'equalizer=f=160:t=q:w=1.0:g=1.0', 'equalizer=f=300:t=q:w=1.2:g=-2.5', 'equalizer=f=2600:t=q:w=1.0:g=2.0',
                  'highshelf=f=8000:g=3.5', 'deesser=i=0.4:m=0.5:f=0.5', 'acompressor=threshold=-22dB:ratio=2.5:attack=12:release=150:makeup=3dB:knee=8',
                  'acompressor=threshold=-8dB:ratio=6:attack=2:release=60'])
def melody(x, sr):
    x = x.astype(np.float64); f0, t = pw.harvest(x, sr, f0_floor=55, f0_ceil=400, frame_period=5.0); f0 = pw.stonemask(x, f0, t, sr)
    sp = pw.cheaptrick(x, f0, t, sr); ap = pw.d4c(x, f0, t, sr); v = f0 > 0
    if v.sum() > 10:
        lg = np.log(f0[v]); med = np.median(lg)
        lg = np.where(lg - med > 0.55, lg - np.log(2), lg); lg = np.where(med - lg > 0.55, lg + np.log(2), lg)   # fix octave errors
        k = 7; pad = np.pad(lg, (k // 2, k // 2), mode='edge'); lg = np.array([np.median(pad[i:i + k]) for i in range(len(lg))])   # smooth jitter
        lg = med + np.clip(lg - med, -0.5, 0.5) * WIDEN + np.log(2) * LIFT / 12; f0[v] = np.clip(np.exp(lg), 60, 320)
    return pw.synthesize(f0, sp, ap, sr, 5.0)
def process(src, dst):
    x, sr = sf.read(src); y = melody(x, sr); y = y / np.abs(y).max() * 0.9; tmp = dst.replace('.wav', '_m.wav'); sf.write(tmp, y, sr)
    tmp2 = dst.replace('.wav', '_e.wav'); subprocess.run([FF, '-loglevel', 'error', '-y', '-i', tmp, '-af', CHAIN, '-ar', '48000', tmp2], check=True)
    z, sr2 = sf.read(tmp2); z = room(z, sr2, wet=0.08, t60=0.28); e = np.convolve(np.abs(z), np.ones(480) / 480, 'same'); on = np.where(e > 0.02 * e.max())[0]; z = z[:on[-1] + int(sr2 * 0.15)]
    sf.write(tmp2, z, sr2); subprocess.run([FF, '-loglevel', 'error', '-y', '-i', tmp2, '-af', 'loudnorm=I=-18:TP=-2:LRA=8', '-ar', '48000', dst], check=True)
if __name__ == '__main__':
    # adaptive: full melody if the words stay clear, otherwise gentler — checked against the user's own reading
    import os, json, re, difflib; os.makedirs('lovely2', exist_ok=True)
    ep = json.load(open(__import__('os').environ['EPISODE_JSON'])); S = {f's{si:02d}_{li:02d}': l for si, sg in enumerate(ep['segments']) for li, l in enumerate(sg.get('narration', []))}
    W = lambda t: re.findall(r"[a-z']+", t.lower()); keys = sys.argv[1].split(',') if len(sys.argv) > 1 else sorted(S)
    def heard(paths):
        j = 'adapt_tmp.json'; subprocess.run([__import__('os').environ.get('PY_TOOLS', '/home/user/parshaland_work/ptts/bin/python'), '-I', __import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)), 'align.py'), j, *paths], capture_output=True); d = json.load(open(j))
        return {p: ' '.join(x[0] for x in d.get(p, [])) for p in paths}
    ref = heard([f'line_{k}.wav' for k in keys]); report = {}
    for k in keys:
        target = difflib.SequenceMatcher(None, W(ref[f'line_{k}.wav']), W(S[k])).ratio(); chosen = None
        for lift, widen in [(1.5, 1.55), (1.5, 1.35), (1.5, 1.15), (1.5, 1.0)]:
            set_params(lift, widen); out = f'lovely2/C_{k}_{widen}.wav'; process(f'vc/best_C_{k}.wav', out)
            m = difflib.SequenceMatcher(None, W(heard([out])[out]), W(S[k])).ratio()
            if m >= target - 0.06: chosen = (out, widen, m); break
            if chosen is None or m > chosen[2]: chosen = (out, widen, m)
        os.replace(chosen[0], f'lovely2/C_{k}.wav'); report[k] = {'melody': chosen[1], 'clarity': round(chosen[2], 2), 'your_reading': round(target, 2)}
        print(k, report[k], flush=True)
    json.dump(report, open('lovely2/report.json', 'w'), indent=1)
