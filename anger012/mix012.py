"""Ep.012 mix: the channel's BGM #2 (piano + strings) under the story until the phone rings, then silence while Doyun's
message is read, then the felt-piano track (BGM #1) from "그건 무시가 아니었습니다" to the end, its natural ending landing on the
last frame. Soft SFX: phone chime, message pops, send whoosh."""
import sys, os, json, numpy as np, soundfile as sf, librosa
sys.path.insert(0, '../bgm')
from mixer import mix, SR
tl = json.load(open('timeline.json')); L = tl['lines']; DUR = tl['duration']
voice, sr = sf.read('voice.wav'); assert sr == SR
if voice.ndim > 1: voice = voice.mean(1)
N = int(DUR * SR); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]; voice = voice / (np.abs(voice).max() + 1e-9) * 0.9
load = lambda f: librosa.load(f, sr=SR, mono=False)[0].T
A = load('../bgm/cand_2_strings_b.mp3'); B = load('../bgm/cand_1_piano_a.mp3')

def loop(song, n, body_end=171.0, xf=6.0):
    out = np.zeros((n, 2)); step = int((body_end - xf) * SR); x = int(xf * SR); s = 0; k = 0
    while s < n:
        seg = song[:int(body_end * SR)].copy()
        if k > 0: seg[:x] *= np.linspace(0, 1, x)[:, None] ** 0.5
        seg[-x:] *= np.linspace(1, 0, x)[:, None] ** 0.5
        e = min(n, s + len(seg)); out[s:e] += seg[:e - s]; s += step; k += 1
    return out

rms = lambda m: np.sqrt(np.mean(m[np.abs(m).max(1) > 1e-4] ** 2))
by = {l['i']: l for l in L}
t_out0 = by[51]['t0'] + 1.0; t_out1 = t_out0 + 2.0          # main BGM fades out while the phone rings
t_in = by[53]['t0'] - 0.4                                    # the piano enters with "그건 무시가 아니었습니다"
music = np.zeros((N, 2))
a = loop(A, int(t_out1 * SR)); f0, f1 = int(t_out0 * SR), int(t_out1 * SR)
a[f0:f1] *= np.linspace(1, 0, f1 - f0)[:, None] ** 1.5; music[:f1] += a[:f1]
need = N - int(t_in * SR); off = max(0, len(B) - need - int(0.3 * SR)); p = B[off:off + need].copy()
fi = int(4.0 * SR); p[:fi] *= np.linspace(0, 1, fi)[:, None] ** 2
p *= rms(a[:f0]) / (rms(p) + 1e-9) * 0.95
music[int(t_in * SR):int(t_in * SR) + len(p)] += p
m = mix(voice, music, fade_in=1.5, fade_out=0.3)

rng = np.random.default_rng(12)
def add(at, x, g):
    i = int(at * SR)
    if 0 <= i < N - len(x): m[i:i + len(x)] += (x * g)[:, None]
def chime(at, g=0.12):          # soft two-note message chime
    n = int(0.55 * SR); tt = np.arange(n) / SR
    x = np.sin(2 * np.pi * 1318.5 * tt) * np.exp(-tt * 9) + 0.8 * np.sin(2 * np.pi * 1760 * tt) * np.exp(-np.clip(tt - 0.12, 0, None) * 9) * (tt > 0.12)
    add(at, x, g)
def popsnd(at, g=0.07):         # bubble pop
    n = int(0.09 * SR); tt = np.arange(n) / SR; x = np.sin(2 * np.pi * (900 - 3000 * tt) * tt) * np.exp(-tt * 45); add(at, x, g)
def whoosh(at, g=0.06):
    n = int(0.35 * SR); x = rng.standard_normal(n) * np.sin(np.linspace(0, np.pi, n)) ** 2
    x = np.convolve(x, np.ones(40) / 40, 'same'); add(at, x, g * 3)
def buzz(at, dur=0.9, g=0.05):  # phone vibrating on the desk
    n = int(dur * SR); tt = np.arange(n) / SR; x = np.sign(np.sin(2 * np.pi * 150 * tt)) * (np.sin(2 * np.pi * 9 * tt) > 0) * np.exp(-tt * 0.5)
    x = np.convolve(x, np.ones(30) / 30, 'same'); add(at, x, g)
l51 = by[51]; D = l51['t1'] - l51['t0']; s0 = l51['t0'] - 0.15
buzz(s0 + 0.3 * D); chime(s0 + 0.3 * D + 0.1)
l52 = by[52]; s0 = l52['t0'] - 0.15
for j in range(3): popsnd(s0 + 0.3 + j * 2.6)
l55 = by[55]; s1 = l55['segs'][1]['t0'] - (l55['t0'] - 0.15); whoosh(l55['t0'] - 0.15 + s1 + 2.6)
m = m / (np.abs(m).max() + 1e-9) * 0.92
sf.write('mix.wav', m, SR); print('mix ok %.1fs  bgm-out %.1f-%.1f  piano-in %.1f' % (DUR, t_out0, t_out1, t_in))
