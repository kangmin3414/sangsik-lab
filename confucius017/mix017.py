"""Ep.017 mix: playful celesta (BGM #4, take b) through the week of experiments; it fades on the night Zero counts 47 questions
(line 38) and the piano (BGM #1, take b) comes in with the old photo of grandma's platform (line 39), carrying to the end.
SFX: a falling tone on the rejection text (1), on 하린's face cooling (33) and on "얼굴은 한 번도 안 봤네요" (38); a chime on each
experiment card; soft ticks when the ball is thrown back (22, 57, 69, 71); a whoosh when the ball flies in first (67) and toward the camera (77)."""
import sys, os, json, numpy as np, soundfile as sf, librosa
sys.path.insert(0, '../bgm')
from mixer import mix, SR
tl = json.load(open('timeline.json')); L = tl['lines']; DUR = tl['duration']
voice, sr = sf.read('voice.wav'); assert sr == SR
if voice.ndim > 1: voice = voice.mean(1)
N = int(DUR * SR); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]; voice = voice / (np.abs(voice).max() + 1e-9) * 0.9
load = lambda f: librosa.load(f, sr=SR, mono=False)[0].T
A = load('../bgm/cand_4_celesta_b.mp3'); B = load('../bgm/cand_1_piano_b.mp3')  # take a of both carries faint English whispering (found 2026-10-30)

def loop(song, n, body_end=None, xf=6.0):
    body_end = body_end or (len(song) / SR - 6.0)
    out = np.zeros((n, 2)); step = int((body_end - xf) * SR); x = int(xf * SR); s = 0; k = 0
    while s < n:
        seg = song[:int(body_end * SR)].copy()
        if k > 0: seg[:x] *= np.linspace(0, 1, x)[:, None] ** 0.5
        seg[-x:] *= np.linspace(1, 0, x)[:, None] ** 0.5
        e = min(n, s + len(seg)); out[s:e] += seg[:e - s]; s += step; k += 1
    return out

rms = lambda m: np.sqrt(np.mean(m[np.abs(m).max(1) > 1e-4] ** 2))
by = {l['i']: l for l in L}
st = lambda i: by[i]['t0'] - 0.15
D = lambda i: by[i]['t1'] - by[i]['t0']
t_in = st(39); t_out0, t_out1 = st(38), st(39) + 0.6
music = np.zeros((N, 2))
a = loop(A, int(t_out1 * SR)); f0, f1 = int(t_out0 * SR), int(t_out1 * SR)
a[f0:f1] *= np.linspace(1, 0.25, f1 - f0)[:, None] ** 1.2; a[f1 - int(0.6 * SR):f1] *= np.linspace(1, 0, int(0.6 * SR))[:, None]
music[:f1] += a[:f1]
need = N - int(t_in * SR); p = loop(B, need)
fi = int(3.0 * SR); p[:fi] *= np.linspace(0, 1, fi)[:, None] ** 2
p *= rms(a[:f0]) / (rms(p) + 1e-9) * 1.0
music[int(t_in * SR):int(t_in * SR) + len(p)] += p[:N - int(t_in * SR)]
m = mix(voice, music, fade_in=1.5, fade_out=2.5)

rng = np.random.default_rng(17)
def add(at, x, g):
    i = int(at * SR)
    if 0 <= i < N - len(x): m[i:i + len(x)] += (x * g)[:, None]
def chime(at, g=0.08):
    n = int(0.6 * SR); tt = np.arange(n) / SR
    x = np.sin(2 * np.pi * 1046.5 * tt) * np.exp(-tt * 8) + 0.7 * np.sin(2 * np.pi * 1568 * tt) * np.exp(-np.clip(tt - 0.1, 0, None) * 8) * (tt > 0.1); add(at, x, g)
def whoosh(at, dur=0.8, g=0.06):
    n = int(dur * SR); x = rng.standard_normal(n); x = np.convolve(x, np.ones(18) / 18, 'same') * np.sin(np.linspace(0, np.pi, n)) ** 2; add(at, x, g * 3)
def fall(at, dur=1.2, g=0.05):
    n = int(dur * SR); tt = np.arange(n) / SR; f = 880 * np.exp(-tt * 1.6); x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 1.5); add(at, x, g)
def tick(at, g=0.04, f=1800.0):
    n = int(0.12 * SR); tt = np.arange(n) / SR; x = np.sin(2 * np.pi * f * tt) * np.exp(-tt * 40); add(at, x, g)
fall(st(1) + 0.3, 1.2, 0.05); fall(st(33) + 0.2, 1.0, 0.04); fall(st(38) + 0.6 * D(38), 1.0, 0.04)
for i in (10, 19, 29, 45, 54): chime(st(i) + 0.2)
for i, f in ((22, 0.35), (57, 0.1), (69, 0.3), (71, 0.15)): tick(st(i) + f * D(i), 0.04, 1300)
whoosh(st(67) + 0.2, 1.2, 0.05); whoosh(st(77), 1.4, 0.06)
m = m / (np.abs(m).max() + 1e-9) * 0.92
sf.write('mix.wav', m, SR); print('mix ok %.1fs  guitar-out %.1f-%.1f  strings-in %.1f' % (DUR, t_out0, t_out1, t_in))
