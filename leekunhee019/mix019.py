"""Ep.019 mix: four Lyria tracks following the emotional curve — 'boy' (hook + step 1, solo piano) → 'rise' (steps 2–3, driven)
→ 'fire' (step 4 climax) → near-silence with a clock tick for the shadow (lines 50–52) → 'legacy' (steps 5 + ending).
SFX: crackling fire under the bonfire pictures (0–1, 43–44), a projector rattle in the theater (2, 7–10), a soft 'step' thud + chime on each stair card,
a card-flip on each decision card. Tracks are chosen in bgm/pick.json after tools/bgm_voice_check.py."""
import sys, json, numpy as np, soundfile as sf, librosa
sys.path.insert(0, '../bgm')
from mixer import mix, SR
PICK = json.load(open('bgm/pick.json'))
tl = json.load(open('timeline.json')); L = tl['lines']; DUR = tl['duration']
voice, sr = sf.read('voice.wav'); assert sr == SR
if voice.ndim > 1: voice = voice.mean(1)
N = int(DUR * SR); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]; voice = voice / (np.abs(voice).max() + 1e-9) * 0.9
load = lambda f: librosa.load(f, sr=SR, mono=False)[0].T
by = {l['i']: l for l in L}
st = lambda i: by[i]['t0'] - 0.15
D = lambda i: by[i]['t1'] - by[i]['t0']
def loop(song, n, xf=4.0):
    out = np.zeros((n, 2)); x = int(xf * SR); s = 0; k = 0; body = song[:len(song) - int(3 * SR)]
    while s < n:
        seg = body.copy()
        if k > 0: seg[:x] *= np.linspace(0, 1, x)[:, None] ** 0.5
        seg[-x:] *= np.linspace(1, 0, x)[:, None] ** 0.5
        e = min(n, s + len(seg)); out[s:e] += seg[:e - s]; s += len(seg) - x; k += 1
    return out
rms = lambda m: np.sqrt(np.mean(m[np.abs(m).max(1) > 1e-4] ** 2))
SEC = [('boy', 0, 12), ('rise', 12, 46), ('fire', 46, 54), (None, 54, 57), ('legacy', 57, None)]
music = np.zeros((N, 2)); ref = None; XF = 1.6
for name, a, b in SEC:
    t0 = 0 if a == 0 else st(a) - XF / 2; t1 = DUR if b is None else st(b) + XF / 2
    i0, i1 = int(t0 * SR), min(N, int(t1 * SR))
    if name is None:
        n = i1 - i0; tt = np.arange(n) / SR; tick = np.zeros(n)
        for k in range(int(n / SR)): p = int(k * SR); ln = int(0.03 * SR); tick[p:p + ln] += np.sin(2 * np.pi * 2200 * tt[:ln]) * np.exp(-tt[:ln] * 120)
        music[i0:i1] += (tick * 0.05)[:, None]; continue
    seg = loop(load(PICK[name]), i1 - i0)
    if ref is None: ref = rms(seg)
    seg *= ref / (rms(seg) + 1e-9) * (1.15 if name == 'fire' else 1.0)
    x = int(XF * SR)
    if a: seg[:x] *= np.linspace(0, 1, x)[:, None]
    if b is not None: seg[-x:] *= np.linspace(1, 0, x)[:, None]
    music[i0:i1] += seg
m = mix(voice, music, fade_in=0.6, fade_out=3.0)
rng = np.random.default_rng(19)
def add(at, x, g):
    i = int(at * SR)
    if 0 <= i < N - len(x): m[i:i + len(x)] += (x * g)[:, None]
def crackle(t0, t1, g=0.05):
    n = int((t1 - t0) * SR); x = np.zeros(n)
    for _ in range(int((t1 - t0) * 22)):
        p = int(rng.uniform(0, n - 400)); ln = int(rng.uniform(0.003, 0.012) * SR); x[p:p + ln] += rng.standard_normal(ln) * np.exp(-np.arange(ln) / (ln / 3))
    rumble = np.convolve(rng.standard_normal(n), np.ones(400) / 400, 'same') * 3
    add(t0, x + rumble, g)
def projector(t0, t1, g=0.025):
    n = int((t1 - t0) * SR); tt = np.arange(n) / SR; x = (np.sin(2 * np.pi * 24 * tt) > 0.9).astype(float) * rng.uniform(0.6, 1, n)
    add(t0, np.convolve(x, np.ones(30) / 30, 'same'), g)
def thud(at, g=0.12):
    n = int(0.35 * SR); tt = np.arange(n) / SR; add(at, np.sin(2 * np.pi * (90 - 40 * tt) * tt) * np.exp(-tt * 14), g)
def chime(at, f=1046.5, g=0.06):
    n = int(0.6 * SR); tt = np.arange(n) / SR; add(at, np.sin(2 * np.pi * f * tt) * np.exp(-tt * 8) + 0.6 * np.sin(2 * np.pi * 1.5 * f * tt) * np.exp(-tt * 10), g)
def flip(at, g=0.05):
    n = int(0.18 * SR); x = rng.standard_normal(n) * np.exp(-np.arange(n) / (0.04 * SR)); add(at, np.convolve(x, np.ones(6) / 6, 'same'), g)
crackle(st(0), st(2)); crackle(st(47), st(49))
projector(st(2), st(3)); projector(st(8), st(12))
for k, i in enumerate((4, 12, 28, 46, 57)): thud(st(i) + 0.1); chime(st(i) + 0.25, 523.25 * 2 ** (k / 6))
for i in (16, 19, 22, 38, 44, 50): flip(st(i) + 0.3)
m = m / (np.abs(m).max() + 1e-9) * 0.92
sf.write('mix.wav', m, SR); print('mix ok %.1fs' % DUR, PICK)
