# Convert the user's narration lines into a target narrator voice (keeps the user's delivery and pronunciation).
import sys, glob, numpy as np, soundfile as sf, torch
from chatterbox.vc import ChatterboxVC
torch.set_num_threads(4); vc = ChatterboxVC.from_pretrained('cpu')
tags = sys.argv[1].split(','); keys = sys.argv[2].split(',') if len(sys.argv) > 2 else [f.split('line_')[1][:-4] for f in sorted(glob.glob('line_s*.wav'))]
for tag in tags:
    for k in keys:
        w, sr = sf.read(f'line_{k}.wav'); pad = np.zeros(int(sr * 0.2)); tmp = f'vc/src_{k}.wav'; sf.write(tmp, np.concatenate([pad, w, pad]), sr)
        y = vc.generate(tmp, target_voice_path=f'targets/{tag}.wav').squeeze(0).numpy()
        e = np.convolve(np.abs(y), np.ones(240) / 240, 'same'); on = np.where(e > 0.02 * e.max())[0]; y = y[max(0, on[0] - 600):on[-1] + 2400]
        sf.write(f'vc/{tag}_{k}.wav', y / np.abs(y).max() * 0.9, vc.sr)
    print(tag, 'done', flush=True)
