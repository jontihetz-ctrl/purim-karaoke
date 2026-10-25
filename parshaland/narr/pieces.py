import sys, numpy as np, soundfile as sf
from faster_whisper import WhisperModel
m = WhisperModel('medium.en', device='cpu', compute_type='int8', cpu_threads=4)
for f in sys.argv[1:]:
    x, sr = sf.read(f); w = int(0.02 * sr); e = np.array([np.sqrt(np.mean(x[i:i + w] ** 2)) for i in range(0, len(x) - w, w)]); db = 20 * np.log10(e + 1e-9)
    thr = np.percentile(db, 90) - 30; quiet = db < thr
    # pieces = runs of sound separated by >= 0.12 s of quiet
    cuts = [0]; run = 0
    for i, q in enumerate(quiet):
        run = run + 1 if q else 0
        if run == 6: cuts.append(i - 3)
    cuts.append(len(quiet)); print('==', f, round(len(x) / sr, 2), 's')
    for a, b in zip(cuts[:-1], cuts[1:]):
        if b - a < 8: continue
        seg = x[a * w: b * w]; tmp = '/tmp/claude-0/-home-user-purim-karaoke/86f33645-2c42-5fea-99c4-49b99849faa9/scratchpad/piece.wav'; sf.write(tmp, np.concatenate([np.zeros(sr // 4), seg, np.zeros(sr // 4)]), sr)
        s, _ = m.transcribe(tmp, beam_size=5, language='en', condition_on_previous_text=False, initial_prompt='Umm, uh, Sodom and- and Amorah. I mean Gomorrah.')
        print(f'  {a * 0.02:6.2f}-{b * 0.02:6.2f}', ' '.join(t.text.strip() for t in s))
