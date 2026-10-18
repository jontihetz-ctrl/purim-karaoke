# Re-convert lines that came out garbled: slow the source down before conversion (clearer for the converter), then restore the pace.
import sys, subprocess, numpy as np, soundfile as sf, torch
from chatterbox.vc import ChatterboxVC
import os as _os; FF = _os.environ.get('FFMPEG', 'ffmpeg'); torch.set_num_threads(4); vc = ChatterboxVC.from_pretrained('cpu')
keys = sys.argv[1].split(','); rates = [float(r) for r in sys.argv[2].split(',')]
for k in keys:
    for r in rates:
        src = f'vc2/src_{k}_{r}.wav'; subprocess.run([FF, '-loglevel', 'error', '-y', '-i', f'line_{k}.wav', '-filter:a', f'atempo={r}', src], check=True)
        w, sr = sf.read(src); pad = np.zeros(int(sr * 0.2)); sf.write(src, np.concatenate([pad, w, pad]), sr)
        y = vc.generate(src, target_voice_path='targets/C.wav').squeeze(0).numpy()
        e = np.convolve(np.abs(y), np.ones(240) / 240, 'same'); on = np.where(e > 0.02 * e.max())[0]; y = y[max(0, on[0] - 600):on[-1] + 2400]
        tmp = f'vc2/tmp_{k}_{r}.wav'; sf.write(tmp, y / np.abs(y).max() * 0.9, vc.sr)
        subprocess.run([FF, '-loglevel', 'error', '-y', '-i', tmp, '-filter:a', f'atempo={1 / r:.5f}', f'vc2/C_{k}_{r}.wav'], check=True)
    print(k, 'done', flush=True)
