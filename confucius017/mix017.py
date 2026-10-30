# TEMPLATE copied from 016 — 곡 선택, 전환 줄 번호(st(44) 등), 효과음 위치를 이 편에 맞게 바꿀 것
"""Ep.016 mix: nylon guitar + cello (BGM #3) for Monday-Wednesday while Zero keeps shrinking; it fades as the wrong number
is confessed, and the strings (BGM #2) swell in with "그날 저녁, 망토가 처음으로 바람을 탑니다" (line 44) and carry to the summit and the end.
SFX: a falling tone when Zero shrinks (lines 0, 21, 32), a chime on each experiment card, a whoosh when the cape lifts (21, 44, 66),
soft ticks for the sprouts being pulled (line 49)."""
import sys, os, json, numpy as np, soundfile as sf, librosa
sys.path.insert(0, '../bgm')
from mixer import mix, SR
tl = json.load(open('timeline.json')); L = tl['lines']; DUR = tl['duration']
voice, sr = sf.read('voice.wav'); assert sr == SR
if voice.ndim > 1: voice = voice.mean(1)
N = int(DUR * SR); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]; voice = voice / (np.abs(voice).max() + 1e-9) * 0.9
load = lambda f: librosa.load(f, sr=SR, mono=False)[0].T
A = load('../bgm/cand_3_guitar_a.mp3'); B = load('../bgm/cand_2_strings_a.mp3')

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
t_in = st(44); t_out0, t_out1 = st(42), st(44) + 0.6
music = np.zeros((N, 2))
a = loop(A, int(t_out1 * SR)); f0, f1 = int(t_out0 * SR), int(t_out1 * SR)
a[f0:f1] *= np.linspace(1, 0.25, f1 - f0)[:, None] ** 1.2; a[f1 - int(0.6 * SR):f1] *= np.linspace(1, 0, int(0.6 * SR))[:, None]
music[:f1] += a[:f1]
need = N - int(t_in * SR); p = loop(B, need)
fi = int(3.0 * SR); p[:fi] *= np.linspace(0, 1, fi)[:, None] ** 2
p *= rms(a[:f0]) / (rms(p) + 1e-9) * 1.0
music[int(t_in * SR):int(t_in * SR) + len(p)] += p[:N - int(t_in * SR)]
m = mix(voice, music, fade_in=1.5, fade_out=2.5)

rng = np.random.default_rng(16)
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
fall(st(0) + 0.45 * D(0)); fall(st(21) + 0.75 * D(21), 1.0, 0.04); fall(st(32) + 0.5 * D(32), 1.0, 0.04)
for i in (13, 22, 35, 45, 57): chime(st(i) + 0.2)
whoosh(st(21) + 0.4, 0.7, 0.04); whoosh(st(44) + 0.4, 1.4, 0.06); whoosh(st(66) + 0.2, 1.6, 0.06)
for k in range(9): tick(st(49) + 0.55 * D(49) + k * 0.45 * D(49) / 9, 0.03, 1500 + 60 * k)
m = m / (np.abs(m).max() + 1e-9) * 0.92
sf.write('mix.wav', m, SR); print('mix ok %.1fs  guitar-out %.1f-%.1f  strings-in %.1f' % (DUR, t_out0, t_out1, t_in))
