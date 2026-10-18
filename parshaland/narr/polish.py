# "Professional narrator" chain for the user's own voice:
#   clean (rumble cut, gentle noise reduction, de-click) → tone (warmth, de-mud, presence, air) → de-ess →
#   two-stage compression (smooth, then peaks) → a touch of short room ambience → consistent loudness per line.
import sys, glob, subprocess, json, numpy as np, soundfile as sf
import os as _os; FF = _os.environ.get('FFMPEG', 'ffmpeg')
CHAIN = ','.join([
    'highpass=f=75:poles=2',                                  # rumble / handling noise
    'afftdn=nr=10:nf=-60:tn=1',                               # gentle noise reduction (tracks the noise floor)
    'adeclick',                                               # mouth clicks
    'equalizer=f=120:t=q:w=0.9:g=2.0',                        # chest warmth
    'equalizer=f=320:t=q:w=1.2:g=-3.0',                       # "boxy" phone/room mud
    'equalizer=f=3200:t=q:w=1.0:g=2.5',                       # presence / clarity
    'highshelf=f=9000:g=2.5',                                 # air
    'deesser=i=0.45:m=0.5:f=0.5',                             # tame harsh "s"
    'acompressor=threshold=-22dB:ratio=3:attack=8:release=120:makeup=4dB:knee=6',   # smooth, even narrator level
    'acompressor=threshold=-8dB:ratio=8:attack=1:release=50',                       # catch peaks
])
def room(x, sr, wet=0.07, t60=0.32):   # short, soft "booth" ambience (not an echo): decaying noise impulse response
    n = int(sr * t60); rng = np.random.default_rng(7); ir = rng.standard_normal(n) * np.exp(-6.9 * np.arange(n) / n)
    ir = np.convolve(ir, np.ones(24) / 24, 'same'); ir /= np.sqrt((ir ** 2).sum())
    y = np.pad(np.convolve(x, ir), (0, 1))[:len(x) + n]; dry = np.concatenate([x, np.zeros(n)]); return dry * (1 - wet) + y * wet * 0.6
def process(src, dst):
    tmp = dst.replace('.wav', '_c.wav')
    subprocess.run([FF, '-loglevel', 'error', '-y', '-i', src, '-af', CHAIN, '-ar', '48000', tmp], check=True)
    x, sr = sf.read(tmp); y = room(x, sr)
    e = np.convolve(np.abs(y), np.ones(480) / 480, 'same'); on = np.where(e > 0.02 * e.max())[0]; y = y[:on[-1] + int(sr * 0.15)]
    sf.write(tmp, y, sr)
    subprocess.run([FF, '-loglevel', 'error', '-y', '-i', tmp, '-af', 'loudnorm=I=-18:TP=-2:LRA=7', '-ar', '48000', dst], check=True)
if __name__ == '__main__':
    for f in sorted(glob.glob('line_s*.wav')): process(f, 'pro/' + f.replace('line_', ''))
    print('polished', len(glob.glob('pro/s*.wav')), 'lines')
