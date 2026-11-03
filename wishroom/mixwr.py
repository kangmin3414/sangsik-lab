"""소원이 다 이루어지는 방 — mix. Music follows the colour of the picture:
real world (lines 0~15) piano_b → room, wonder (16~30) celesta_b → room, emptying (31~52) ambient_b, getting quieter →
1,000 years in white (53~64) the ambient almost gone → shrink/blackout (65) silence → same morning (66~71) no music, alarm + room tone →
colour comes back (72~) strings_b, warm. All four tracks passed tools/bgm_voice_check.py (2026-11-03).
SFX (synthesized): alarm beeps, baduk stone clicks, subway rumble, door shimmer + whoosh, star sparkles, paper, wind, knocks."""
import sys, json, numpy as np, soundfile as sf, librosa
sys.path.insert(0, '../bgm')
from mixer import mix, SR
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
TR = {'piano': '../bgm/cand_1_piano_b.mp3', 'celesta': '../bgm/cand_4_celesta_b.mp3', 'ambient': '../bgm/cand_5_ambient_b.mp3', 'strings': '../bgm/cand_2_strings_b.mp3'}
SEC = [('piano', 0, 16, 1.0), ('celesta', 16, 31, 1.0), ('ambient', 31, 53, 0.9), ('ambient2', 53, 65, 0.35), (None, 65, 72, 0), ('strings', 72, None, 1.0)]
music = np.zeros((N, 2)); ref = None; XF = 2.4
for name, a, b, g in SEC:
    if name is None: continue
    t0 = 0 if a == 0 else st(a) - XF / 2; t1 = DUR if b is None else st(b) + XF / 2
    i0, i1 = int(t0 * SR), min(N, int(t1 * SR))
    src = load(TR[name.rstrip('2')])
    if name == 'ambient2': src = src[int(60 * SR):]   # a later, sparser part of the same track
    seg = loop(src, i1 - i0)
    if ref is None: ref = rms(seg)
    seg *= ref / (rms(seg) + 1e-9) * g
    x = int(XF * SR)
    if a: seg[:x] *= np.linspace(0, 1, x)[:, None]
    if b is not None: seg[-x:] *= np.linspace(1, 0, x)[:, None]
    if name == 'ambient': seg *= np.linspace(1.0, 0.6, len(seg))[:, None]   # the room keeps emptying
    music[i0:i1] += seg
m = mix(voice, music, fade_in=0.6, fade_out=3.0)
rng = np.random.default_rng(23)
def add(at, x, g):
    i = int(at * SR)
    if 0 <= i < N - len(x): m[i:i + len(x)] += (x * g)[:, None]
tone = lambda f, d, dec: (lambda tt: np.sin(2 * np.pi * f * tt) * np.exp(-tt * dec))(np.arange(int(d * SR)) / SR)
def alarm(at, n=3, g=0.06):
    for k in range(n):
        for j in range(2): add(at + k * 0.9 + j * 0.16, tone(1760, 0.11, 6) * (np.arange(int(0.11 * SR)) < int(0.1 * SR)), g)
def stone(at, g=0.16):
    n = int(0.12 * SR); tt = np.arange(n) / SR
    add(at, (np.sin(2 * np.pi * 2300 * tt) * 0.6 + rng.standard_normal(n) * 0.5) * np.exp(-tt * 70), g)
def whoosh(at, d=1.4, g=0.05):
    n = int(d * SR); x = np.convolve(rng.standard_normal(n), np.ones(60) / 60, 'same'); add(at, x * np.sin(np.linspace(0, np.pi, n)) * 6, g)
def shimmer(at, d=3.0, g=0.035):
    for k, f in enumerate([1318.5, 1568, 1975.5, 2637, 2093, 1760]): add(at + k * d / 7, tone(f, 1.2, 4), g)
def sparkle(at, g=0.04):
    for k, f in enumerate([2093, 2637, 3136]): add(at + k * 0.06, tone(f, 0.6, 9), g)
def paper(at, d=0.5, g=0.05):
    n = int(d * SR); x = rng.standard_normal(n) * (rng.uniform(0, 1, n) > 0.7); add(at, np.convolve(x, np.ones(8) / 8, 'same') * np.sin(np.linspace(0, np.pi, n)), g)
def wind(at, d, g=0.05):
    n = int(d * SR); x = np.convolve(rng.standard_normal(n), np.ones(900) / 900, 'same') * 12; add(at, x * np.sin(np.linspace(0, np.pi, n)), g)
def rumble(at, d, g=0.05):
    n = int(d * SR); tt = np.arange(n) / SR; x = np.convolve(rng.standard_normal(n), np.ones(400) / 400, 'same') * 8 + 0.3 * np.sin(2 * np.pi * 55 * tt)
    add(at, x * np.minimum(1, np.minimum(tt / 0.6, (d - tt) / 0.6)), g)
def knock(at, g=0.2):
    for k in range(3): n = int(0.09 * SR); tt = np.arange(n) / SR; add(at + k * 0.22, np.sin(2 * np.pi * 180 * tt) * np.exp(-tt * 45), g)
fr = lambda i, p: st(i) + 0.15 + D(i) * p
alarm(0.5); alarm(st(66) + 0.2)
stone(fr(6, 0.5), 0.1)
rumble(st(11), D(11) * 0.55, 0.06)
shimmer(fr(15, 0.2)); whoosh(st(16), 1.6, 0.04); whoosh(fr(18, 0.7), 1.8, 0.06)
sparkle(fr(24, 0.1)); sparkle(fr(24, 0.55)); sparkle(fr(25, 0.1))
paper(st(53) + 0.3); [paper(st(i) + 0.2, 0.35, 0.04) for i in (54, 55, 56, 57)]; paper(st(61) + 0.3, 0.4); paper(fr(63, 0.4), 0.5)
wind(st(65), D(65) + 0.5, 0.06)
paper(fr(69, 0.5), 0.4, 0.06); sparkle(st(71) + 0.2, 0.03)
knock(st(78) + 0.6)
[stone(st(80) + 0.2 + k * 0.55, 0.14) for k in (0, 1)]; [stone(st(80) + 1.6 + k * 0.7 + rng.uniform(0, 0.2), 0.09) for k in range(4)]
m /= max(1.0, np.abs(m).max() / 0.97)
sf.write('mix.wav', m.astype(np.float32), SR); print('mix ok', round(DUR, 1))
