"""Ep.013 mix: the channel's BGM #2 (piano + strings) under the story until the 1998 notebook is found, then it fades out and
2 s of silence while the cover opens; the felt-piano track (BGM #1) enters with the first handwritten page and runs to the end,
its natural ending landing on the last frame. Soft SFX: a small bell whenever a star lights, page turns, phone buzz + chime."""
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
t_out1 = by[48]['t0'] - 0.15 + 0.1        # music gone as the cover starts to open
t_out0 = t_out1 - 2.2
t_in = by[49]['t0'] - 0.15                # piano enters with the first handwritten page
music = np.zeros((N, 2))
a = loop(A, int(t_out1 * SR)); f0, f1 = int(t_out0 * SR), int(t_out1 * SR)
a[f0:f1] *= np.linspace(1, 0, f1 - f0)[:, None] ** 1.5; music[:f1] += a[:f1]
need = N - int(t_in * SR); off = max(0, len(B) - need - int(0.3 * SR)); p = B[off:off + need].copy()
fi = int(3.0 * SR); p[:fi] *= np.linspace(0, 1, fi)[:, None] ** 2
p *= rms(a[:f0]) / (rms(p) + 1e-9) * 0.95
music[int(t_in * SR):int(t_in * SR) + len(p)] += p
m = mix(voice, music, fade_in=1.5, fade_out=0.3)

rng = np.random.default_rng(13)
def add(at, x, g):
    i = int(at * SR)
    if 0 <= i < N - len(x): m[i:i + len(x)] += (x * g)[:, None]
def bell(at, g=0.05, f=1568.0):  # small glassy bell for a star
    n = int(1.4 * SR); tt = np.arange(n) / SR
    x = (np.sin(2 * np.pi * f * tt) + 0.45 * np.sin(2 * np.pi * f * 2.76 * tt) * np.exp(-tt * 3) + 0.25 * np.sin(2 * np.pi * f * 5.4 * tt) * np.exp(-tt * 6)) * np.exp(-tt * 3.2)
    x[:200] *= np.linspace(0, 1, 200); add(at, x, g)
def page(at, g=0.05):            # paper page turn
    n = int(0.45 * SR); x = rng.standard_normal(n); x = np.convolve(x, np.ones(18) / 18, 'same') * np.sin(np.linspace(0, np.pi, n)) ** 1.5
    x *= 1 + 0.6 * np.sin(np.linspace(0, 9 * np.pi, n)); add(at, x, g * 3)
def chime(at, g=0.1):
    n = int(0.55 * SR); tt = np.arange(n) / SR
    x = np.sin(2 * np.pi * 1318.5 * tt) * np.exp(-tt * 9) + 0.8 * np.sin(2 * np.pi * 1760 * tt) * np.exp(-np.clip(tt - 0.12, 0, None) * 9) * (tt > 0.12)
    add(at, x, g)
def buzz(at, dur=0.9, g=0.05):
    n = int(dur * SR); tt = np.arange(n) / SR; x = np.sign(np.sin(2 * np.pi * 150 * tt)) * (np.sin(2 * np.pi * 9 * tt) > 0) * np.exp(-tt * 0.5)
    x = np.convolve(x, np.ones(30) / 30, 'same'); add(at, x, g)
st = lambda i: by[i]['t0'] - 0.15
D = lambda i: by[i]['t1'] - by[i]['t0']
def phrase_t(i, ph):
    s = by[i]['sub']; k = s.find(ph); return st(i) + (k / max(1, len(s))) * D(i)
notes = [1568.0, 1760.0, 2093.0, 2349.3, 2637.0]
n = 0
def star(at, g=0.05):
    global n; bell(at, g, notes[n % len(notes)]); n += 1
# the three stars of the rule card, Mon, Tue, Wed, Thu, Fri, Sun
for j in range(3): star(st(10) + phrase_t(10, '매일 밤') - st(10) + 0.3 + j * 0.25 + 0.15, 0.035)
for i, cues in [(18, ['캔커피', '밥은 먹었니', '막차']), (20, ['간호사', '훈수', '노을']), (30, ['수술이 잘', '잠든 엄마', '첫마디'])]:
    for c in cues: star(phrase_t(i, c) + 0.5, 0.06 if i == 30 else 0.045)
l38 = by[38]; star(l38['segs'][1]['t0'] + 0.1, 0.05)
star(phrase_t(39, '죽 한 그릇') + 0.1, 0.05)
star(st(45) + 0.3, 0.06)
for j in range(1, 4): star(by[58]['segs'][j]['t0'] + 0.3, 0.05)
# the constellation joins up
for j in range(5): bell(st(59) + 0.5 + j * (D(59) - 0.8) / 5, 0.03, notes[j])
# notebook: found, cover opens, pages turn
page(st(47) + 0.3 * D(47), 0.04); page(st(48) + 0.5, 0.06); page(st(51) + 0.05, 0.05)
per = max(1.1, (D(52) + 0.4) / 4)
for j in range(1, 4): page(st(52) + j * per, 0.045)
# phone on the morning after
buzz(st(60) + 0.4 * D(60)); chime(st(61) + 0.4, 0.1)
m = m / (np.abs(m).max() + 1e-9) * 0.92
sf.write('mix.wav', m, SR); print('mix ok %.1fs  bgm-out %.1f-%.1f  piano-in %.1f  bells %d' % (DUR, t_out0, t_out1, t_in, n))
