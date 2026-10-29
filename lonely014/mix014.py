"""Ep.014 mix: BGM #5 (ambient pads, distant piano) under the lonely Friday night, the research, the fable and the three methods;
it fades out as the message is sent, so the no-reply night (lines 58-60) is almost silent; the felt-piano track (BGM #1) enters
with "고독의 철학자에게도, 이런 밤이" (line 61) and runs to the end, its natural ending on the last frame.
SFX: send swoosh + chime, the morning buzz, two message chimes, a soft tick for each porcupine 'ouch'."""
import sys, os, json, numpy as np, soundfile as sf, librosa
sys.path.insert(0, '../bgm')
from mixer import mix, SR
tl = json.load(open('timeline.json')); L = tl['lines']; DUR = tl['duration']
voice, sr = sf.read('voice.wav'); assert sr == SR
if voice.ndim > 1: voice = voice.mean(1)
N = int(DUR * SR); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]; voice = voice / (np.abs(voice).max() + 1e-9) * 0.9
load = lambda f: librosa.load(f, sr=SR, mono=False)[0].T
A = load('../bgm/cand_5_ambient_a.mp3'); B = load('../bgm/cand_1_piano_a.mp3')

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
def phrase_t(i, ph):
    s = by[i]['sub']; k = s.find(ph); return st(i) + (max(0, k) / max(1, len(s))) * D(i)
t_out1 = st(58) + 1.2                    # gone just after "전송."
t_out0 = st(57) + 1.4                    # starts to fade as he presses send
t_in = st(61)                            # piano enters with the philosopher's night
music = np.zeros((N, 2))
a = loop(A, int(t_out1 * SR)); f0, f1 = int(t_out0 * SR), int(t_out1 * SR)
a[f0:f1] *= np.linspace(1, 0, f1 - f0)[:, None] ** 1.5; music[:f1] += a[:f1]
need = N - int(t_in * SR); off = max(0, len(B) - need - int(0.3 * SR)); p = B[off:off + need].copy()
fi = int(4.0 * SR); p[:fi] *= np.linspace(0, 1, fi)[:, None] ** 2
p *= rms(a[:f0]) / (rms(p) + 1e-9) * 0.95
music[int(t_in * SR):int(t_in * SR) + len(p)] += p
m = mix(voice, music, fade_in=1.5, fade_out=0.3)

rng = np.random.default_rng(14)
def add(at, x, g):
    i = int(at * SR)
    if 0 <= i < N - len(x): m[i:i + len(x)] += (x * g)[:, None]
def chime(at, g=0.1):
    n = int(0.55 * SR); tt = np.arange(n) / SR
    x = np.sin(2 * np.pi * 1318.5 * tt) * np.exp(-tt * 9) + 0.8 * np.sin(2 * np.pi * 1760 * tt) * np.exp(-np.clip(tt - 0.12, 0, None) * 9) * (tt > 0.12)
    add(at, x, g)
def swoosh(at, g=0.05):
    n = int(0.35 * SR); x = rng.standard_normal(n); x = np.convolve(x, np.ones(12) / 12, 'same') * np.sin(np.linspace(0, np.pi, n)) ** 2; add(at, x, g * 3)
def buzz(at, dur=0.9, g=0.05):
    n = int(dur * SR); tt = np.arange(n) / SR; x = np.sign(np.sin(2 * np.pi * 150 * tt)) * (np.sin(2 * np.pi * 9 * tt) > 0) * np.exp(-tt * 0.5)
    x = np.convolve(x, np.ones(30) / 30, 'same'); add(at, x, g)
def tick(at, g=0.05, f=2400.0):
    n = int(0.12 * SR); tt = np.arange(n) / SR; x = np.sin(2 * np.pi * f * tt) * np.exp(-tt * 40); add(at, x, g)
# porcupines: ouch ticks (line 25 at 0.15/0.3 s; line 26 two bumps)
tick(st(25) + 0.2, 0.05); tick(st(25) + 0.38, 0.04, 2700)
sc = max(1, D(26) - 1.2) / 6.3
tick(st(26) + 1.35 * sc, 0.045); tick(st(26) + 4.05 * sc, 0.03, 2700)
# the message goes out (line 57: typed 0.1-1.3 s, sent at 1.6 s)
swoosh(st(57) + 1.55, 0.05); chime(st(57) + 1.65, 0.07)
# next morning: buzz, then the two replies
buzz(st(65) + 0.3, 1.2, 0.05); chime(st(66) + 0.3, 0.1); chime(st(67) + 0.2, 0.09)
# the guard's tangerine: a soft tick when it lands
tick(st(47) + 1.5, 0.03, 1800)
m = m / (np.abs(m).max() + 1e-9) * 0.92
sf.write('mix.wav', m, SR); print('mix ok %.1fs  bgm-out %.1f-%.1f  piano-in %.1f' % (DUR, t_out0, t_out1, t_in))
