"""Ep.018 mix: one Lyria track per season, switched on the chapter cards — spring (prologue + year 1) → summer (year 5) → autumn (year 10)
→ winter (year 30) → the spring track comes back for the epilogue (the circle closes). Music drops out for a moment before Mom's line (34).
SFX: bubbles + a soft low 'whoom' on each chapter card (deeper each time), a small ding when the "몰랐던 것" counter goes up
(one step higher for "몰랐던 한국"), a few dish clinks under the opening restaurant line.
Tracks are chosen in PICK after tools/bgm_voice_check.py (no voices)."""
import sys, json, numpy as np, soundfile as sf, librosa
sys.path.insert(0, '../bgm')
from mixer import mix, SR
PICK = json.load(open('bgm/pick.json'))       # {"spring": "bgm/spring_a.mp3", ...}
tl = json.load(open('timeline.json')); L = tl['lines']; DUR = tl['duration']
voice, sr = sf.read('voice.wav'); assert sr == SR
if voice.ndim > 1: voice = voice.mean(1)
N = int(DUR * SR); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]; voice = voice / (np.abs(voice).max() + 1e-9) * 0.9
load = lambda f: librosa.load(f, sr=SR, mono=False)[0].T
by = {l['i']: l for l in L}
st = lambda i: by[i]['t0'] - 0.15
D = lambda i: by[i]['t1'] - by[i]['t0']

def loop(song, n, xf=4.0):
    out = np.zeros((n, 2)); x = int(xf * SR); s = 0; k = 0
    body = song[:len(song) - int(3 * SR)]
    while s < n:
        seg = body.copy()
        if k > 0: seg[:x] *= np.linspace(0, 1, x)[:, None] ** 0.5
        seg[-x:] *= np.linspace(1, 0, x)[:, None] ** 0.5
        e = min(n, s + len(seg)); out[s:e] += seg[:e - s]; s += len(seg) - x; k += 1
    return out
rms = lambda m: np.sqrt(np.mean(m[np.abs(m).max(1) > 1e-4] ** 2))
# sections: (track, start line, end line or None)
SEC = [('spring', 0, 14), ('summer', 14, 26), ('autumn', 26, 38), ('winter', 38, 55), ('spring', 55, None)]
music = np.zeros((N, 2)); ref = None; XF = 2.0
for name, a, b in SEC:
    t0 = 0 if a == 0 else st(a) - XF / 2; t1 = DUR if b is None else st(b) + XF / 2
    i0, i1 = int(t0 * SR), min(N, int(t1 * SR))
    seg = loop(load(PICK[name]), i1 - i0)
    if ref is None: ref = rms(seg)
    seg *= ref / (rms(seg) + 1e-9)
    x = int(XF * SR)
    if a: seg[:x] *= np.linspace(0, 1, x)[:, None]
    if b is not None: seg[-x:] *= np.linspace(1, 0, x)[:, None]
    music[i0:i1] += seg
# a breath of silence before Mom's line (line 34, segment 2)
m0 = by[34]['t0'] + 0.55 * D(34)
g = np.ones(N); a0, a1 = int((m0 - 1.6) * SR), int((m0 - 0.6) * SR); b0, b1 = int((m0 + 2.2) * SR), int((m0 + 3.6) * SR)
g[a0:a1] = np.linspace(1, 0.05, a1 - a0); g[a1:b0] = 0.05; g[b0:b1] = np.linspace(0.05, 1, b1 - b0)
music *= g[:, None]
m = mix(voice, music, fade_in=1.0, fade_out=3.0)

rng = np.random.default_rng(18)
def add(at, x, gain):
    i = int(at * SR)
    if 0 <= i < N - len(x): m[i:i + len(x)] += (x * gain)[:, None]
def ding(at, f=1318.5, g=0.07):
    n = int(0.5 * SR); tt = np.arange(n) / SR; add(at, np.sin(2 * np.pi * f * tt) * np.exp(-tt * 9) + 0.5 * np.sin(2 * np.pi * 2 * f * tt) * np.exp(-tt * 14), g)
def bubbles(at, depth, g=0.05):
    n = int(1.6 * SR); x = np.zeros(n)
    for k in range(9):
        p = int(rng.uniform(0, 1.3) * SR); f = rng.uniform(500, 1200); ln = int(0.08 * SR); tt = np.arange(ln) / SR
        x[p:p + ln] += np.sin(2 * np.pi * (f + 3000 * tt) * tt) * np.exp(-tt * 40)
    tt = np.arange(n) / SR; x += 0.6 * np.sin(2 * np.pi * (70 - 8 * depth) * tt) * np.sin(np.pi * tt / 1.6) ** 2
    add(at, x, g)
def clink(at, g=0.04):
    n = int(0.25 * SR); tt = np.arange(n) / SR; add(at, (np.sin(2 * np.pi * 2637 * tt) + 0.6 * np.sin(2 * np.pi * 3520 * tt)) * np.exp(-tt * 25), g)
for d, i in enumerate((3, 14, 26, 38)): bubbles(st(i) + 0.1, d)
for i in (6, 7, 8, 11, 17, 20, 21, 27, 30): ding(st(i) + 0.15 + 0.9)
for i in (42, 44, 45, 48, 49): ding(st(i) + 0.15 + 0.9, 1568.0)
for k in range(5): clink(st(0) + 0.2 + k * 0.45 + rng.uniform(0, 0.2))
m = m / (np.abs(m).max() + 1e-9) * 0.92
sf.write('mix.wav', m, SR); print('mix ok %.1fs' % DUR, {k: v for k, v in PICK.items()})
