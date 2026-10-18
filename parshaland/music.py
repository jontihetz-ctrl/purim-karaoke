# Step 4 of the parsha template: original music.
# Builds build/<id>/music.wav from the timeline: each scene gets a bed in its mood (wonder, dark, build, storm, hope, joy),
# crossfaded into the next; the intro, title card and outro carry the Parshaland theme on bells and harp.
# Instruments are synthesised here (pads, plucked harp, bells, soft frame drum) — no samples, nothing to license.
# Usage: python music.py <episode-id>
import json, sys, pathlib, numpy as np, soundfile as sf
EP = sys.argv[1]; here = pathlib.Path(__file__).parent
TL = json.load(open(here / 'build' / EP / 'timeline.json'))
SR = 44100; N = int(SR * TL['duration']); rng = np.random.default_rng(11)
mix = np.zeros((N, 2), np.float32)
def midi(m): return 440.0 * 2 ** ((m - 69) / 12)
def lp_fast(x, fc):                # FFT low-pass with a soft edge
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); return np.fft.irfft(X / (1 + (f / fc) ** 4), n=len(x))
def env(n, a, r):
    t = np.arange(n) / SR; e = np.minimum(1.0, t / max(a, 1e-3)); rel = int(r * SR)
    if rel > 0 and rel < n: e[-rel:] *= np.linspace(1, 0, rel)
    return e
def pad(notes, dur, bright=1200.0, amp=0.08):
    n = int(dur * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for m in notes:
        for det in (-0.08, 0.0, 0.07):
            f = midi(m + det); x += (2 * ((t * f) % 1.0) - 1) * 0.33 + np.sin(2 * np.pi * f * t) * 0.5
    x = lp_fast(x, bright) * env(n, min(1.2, dur / 3), min(1.5, dur / 3)) * amp / max(1, len(notes))
    return x
def pluck(m, dur, amp=0.25, bright=0.5):   # harp-like plucked string: harmonics that fade faster the higher they are
    n = int(dur * SR); t = np.arange(n) / SR; f = midi(m); x = np.zeros(n)
    for h in range(1, 7): x += (bright ** (h - 1)) / h * np.sin(2 * np.pi * f * h * t + h) * np.exp(-t * (2.2 + 1.6 * h))
    return x * amp * 1.6 * env(n, 0.002, 0.15)
def bell(m, dur, amp=0.18):
    n = int(dur * SR); t = np.arange(n) / SR; f = midi(m); x = np.zeros(n)
    for k, (r, g, d) in enumerate([(1, 1.0, 2.2), (2.0, 0.5, 1.4), (3.0, 0.25, 0.9), (4.2, 0.15, 0.6), (5.4, 0.08, 0.4)]): x += g * np.sin(2 * np.pi * f * r * t) * np.exp(-t / d)
    return x * amp * env(n, 0.003, 0.05)
def drum(dur, amp=0.35):
    n = int(dur * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * (70 + 60 * np.exp(-t * 30)) * t) * np.exp(-t * 9) + lp_fast(rng.standard_normal(n), 900) * np.exp(-t * 30) * 0.3) * amp
def put(x, t0, gain=1.0, pan=0.0):
    i0 = int(t0 * SR); n = min(len(x), N - i0)
    if n > 0 and i0 >= 0: mix[i0:i0 + n, 0] += x[:n] * gain * (1 - max(pan, 0)); mix[i0:i0 + n, 1] += x[:n] * gain * (1 + min(pan, 0))
# moods: chord progressions (MIDI root-position triads/7ths), tempo, arpeggio pattern, percussion
MOODS = {
  'wonder': dict(chords=[[62, 66, 69, 73], [59, 62, 66, 69], [55, 59, 62, 66], [57, 61, 64, 69]], bar=3.2, arp=True, drum=False, bright=1400, bells=True),
  'dark':   dict(chords=[[50, 53, 57], [46, 50, 53], [48, 52, 55], [45, 49, 52]], bar=4.0, arp=False, drum=False, bright=700, bells=False),
  'build':  dict(chords=[[60, 64, 67], [65, 69, 72], [67, 71, 74], [60, 64, 67]], bar=2.4, arp=True, drum=True, bright=1600, bells=False),
  'storm':  dict(chords=[[50, 53, 57], [48, 51, 55], [46, 50, 53], [45, 49, 52]], bar=2.0, arp=False, drum=True, bright=900, bells=False),
  'hope':   dict(chords=[[55, 59, 62], [52, 55, 59], [48, 52, 55], [50, 54, 57]], bar=3.2, arp=True, drum=False, bright=1500, bells=True),
  'joy':    dict(chords=[[65, 69, 72], [58, 62, 65], [60, 64, 67], [65, 69, 72]], bar=2.2, arp=True, drum=True, bright=1900, bells=True)}
THEME = [(74, 0.5), (76, 0.5), (78, 1.0), (81, 0.75), (78, 0.25), (76, 0.5), (74, 1.5)]    # the Parshaland motif (D major)
def theme(t0, gain=1.0, octave=0):
    t = t0
    for m, d in THEME: put(bell(m + 12 * octave, 2.0), t, 0.55 * gain, 0.15); put(pluck(m - 12 + 12 * octave, 1.2, 0.2, 0.6), t, 0.35 * gain, -0.2); t += d * 0.42
for g in TL['segments']:
    a, b, name = g['start'], g['end'], g['name']; L = b - a; xf = 1.2
    if name == 'intro':
        n = int(L * SR); t = np.arange(n) / SR
        shimmer = sum(np.sin(2 * np.pi * midi(m) * t + 3 * np.sin(2 * np.pi * 0.2 * t)) for m in (74, 78, 81, 86)) * 0.03 * np.minimum(1, t / 3.0)
        put(shimmer * env(n, 0.5, 1.5), a, 1.0); put(pad([50, 57, 62, 66], L, 1000, 0.12), a)
        theme(a + 3.0, 1.0); continue
    if name == 'title': put(pad([50, 57, 62, 66, 69], L + xf, 1500, 0.1), a); theme(a + 0.3, 0.8); continue
    if name == 'outro':
        put(pad([55, 59, 62, 67], 3.0, 1400, 0.11), a); put(pad([50, 57, 62, 66], L - 2.6, 1400, 0.11), a + 2.8)
        theme(a + 0.6, 0.9); put(bell(86, 4.0), a + 4.0, 0.5); continue
    M = MOODS.get(g.get('mood', 'wonder'), MOODS['wonder']); bar = M['bar']; t = a; k = 0
    while t < b + xf:
        ch = M['chords'][k % len(M['chords'])]; d = min(bar, b + xf - t) + 0.6
        put(pad(ch, d, M['bright'], 0.1 if g.get('mood') != 'dark' else 0.12), t, 1.0)
        put(pad([ch[0] - 12], d, 400, 0.12), t, 0.8)                                                  # bass
        if M['arp']:
            steps = 8 if M['drum'] else 6
            for s in range(steps):
                tt = t + s * bar / steps
                if tt < b: put(pluck(ch[s % len(ch)] + 12 * (s // len(ch) % 2), 1.0, 0.16, 0.55), tt, 0.5, 0.3 * np.sin(s))
        if M['drum']:
            for s in range(4 if g.get('mood') != 'storm' else 8):
                tt = t + s * bar / (4 if g.get('mood') != 'storm' else 8)
                if tt < b: put(drum(0.6, 0.3 if s % 2 == 0 else 0.18), tt, 0.6)
        if M['bells'] and k % 2 == 1: put(bell(ch[-1] + 12, 2.5), t + bar * 0.5, 0.25, -0.3)
        t += bar; k += 1
# gentle master: soft clip, normalise
mix = np.tanh(mix * 1.6) / np.tanh(1.6); mix *= 0.89 / (np.abs(mix).max() + 1e-9)
fade = np.clip((N - np.arange(N)) / (SR * 2.5), 0, 1); mix *= fade[:, None]
sf.write(here / 'build' / EP / 'music.wav', mix, SR); print('music.wav written,', round(N / SR, 1), 's')
