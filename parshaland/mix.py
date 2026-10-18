# Step 5 of the parsha template: the final soundtrack = narration + music (ducked under the voice) + a few touches
# (a soft whoosh into the intro burst, a chime on the title card). Writes build/<id>/soundtrack.wav (44.1 kHz stereo).
# Usage: python mix.py <episode-id>
import json, sys, pathlib, numpy as np, soundfile as sf
EP = sys.argv[1]; here = pathlib.Path(__file__).parent; B = here / 'build' / EP
TL = json.load(open(B / 'timeline.json')); SR = 44100; N = int(SR * TL['duration']); rng = np.random.default_rng(5)
def load(f):
    x, sr = sf.read(f); x = x.mean(1) if x.ndim > 1 else x
    if sr != SR: x = np.interp(np.linspace(0, len(x) - 1, int(len(x) * SR / sr)), np.arange(len(x)), x)
    return x.astype(np.float32)
narr = np.zeros(N, np.float32); vox = np.zeros(N, np.float32)
for g in TL['segments']:
    for ln in g['lines']:
        v = load(B / 'voice' / f"{ln['key']}.wav"); i0 = int(ln['start'] * SR); n = min(len(v), N - i0)
        narr[i0:i0 + n] += v[:n]; vox[max(0, i0 - int(0.2 * SR)):i0 + n + int(0.35 * SR)] = 1.0
k = int(0.25 * SR); vox = np.convolve(vox, np.ones(k) / k, mode='same')                     # smooth ducking envelope
music = load(B / 'music.wav') if (B / 'music.wav').exists() else np.zeros(N, np.float32)
ms, _ = sf.read(B / 'music.wav'); ms = ms.astype(np.float32)[:N]; ms = np.pad(ms, ((0, N - len(ms)), (0, 0)))
duck = 1.0 - 0.72 * vox                                                                      # about −11 dB under the voice
out = ms * 0.55 * duck[:, None] + np.stack([narr, narr], 1) * 0.95
# touches: whoosh rising into the intro burst, a chime as the title card opens
intro = TL['segments'][0]; n = int(3.0 * SR); t = np.arange(n) / SR
wh = np.fft.irfft(np.fft.rfft(rng.standard_normal(n)) * (1 / (1 + (np.fft.rfftfreq(n, 1 / SR) / 2500) ** 2)), n=n) * (t / 3.0) ** 2 * 0.25
i0 = int((intro['start'] + 0.3) * SR); out[i0:i0 + n] += np.stack([wh, wh], 1)[:max(0, min(n, N - i0))]
out = np.tanh(out * 1.1) / np.tanh(1.1); out *= 0.95 / (np.abs(out).max() + 1e-9)
sf.write(B / 'soundtrack.wav', out, SR); print('soundtrack.wav written')
