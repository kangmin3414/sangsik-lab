"""샘플 믹스: 사무실 = 초침 + 도장(초마다, 화면과 같은 시각) + 톱니 딸깍, 재판정 = 영사기 소리 + 먼 기차, 실험실 = 낮은 드론 + 레버 철컥 + 전기음. 모두 합성(저작권 없음)."""
import json, numpy as np, soundfile as sf
SR = 48000; tl = json.load(open('timeline.json')); L = tl['lines']; DUR = tl['duration']
v, sr = sf.read('voice.wav'); v = v.mean(1) if v.ndim > 1 else v
v = np.interp(np.arange(int(len(v) * SR / sr)) / SR, np.arange(len(v)) / sr, v); n = int(DUR * SR); v = np.pad(v, (0, max(0, n - len(v))))[:n]
tt = np.arange(n) / SR; rng = np.random.default_rng(3); fx = np.zeros(n)
def add(at, x, g):
    i = int(at * SR); e = min(n, i + len(x))
    if 0 <= i < n: fx[i:e] += x[:e - i] * g
def env(d, dec): s = np.arange(int(d * SR)) / SR; return s, np.exp(-s * dec)
sec = lambda name: [(l['t0'] - 0.15, (L[j + 1]['t0'] - 0.15) if j + 1 < len(L) else DUR) for j, l in enumerate(L) if l['scene'] == name]
span = lambda name: (min(a for a, b in sec(name)), max(b for a, b in sec(name)))
d0, d1 = span('bdesk'); c0, c1 = span('bcourt'); m0, m1 = span('bmilgram')
bow = [l for l in L if l['scene'] == 'bdesk' and l['args'].get('k') == 1][0]
for k in range(int(np.ceil(d0)), int(d1)):
    s, e = env(0.03, 150); add(k, np.sin(2 * np.pi * 2300 * s) * e, 0.06)                       # tick
    if not (bow['t0'] - 0.15 + 0.5 * (bow['t1'] - bow['t0']) < k < bow['t1'] + 0.6):
        s, e = env(0.22, 22); add(k, np.sin(2 * np.pi * (95 - 40 * s) * s) * e + rng.standard_normal(len(s)) * e * 0.15, 0.32)   # stamp thud
    s, e = env(0.05, 80); add(k + 0.04, rng.standard_normal(len(s)) * e, 0.03)                    # gear click
office_hum = 0.012 * np.convolve(rng.standard_normal(n), np.ones(300) / 300, 'same') * 15
proj = ((np.sin(2 * np.pi * 24 * tt) > 0.92) * rng.uniform(0.5, 1, n)); proj = np.convolve(proj, np.ones(40) / 40, 'same') * 0.05
train = (0.03 * np.sin(2 * np.pi * 48 * tt) + 0.02 * np.convolve(rng.standard_normal(n), np.ones(1200) / 1200, 'same') * 25)
drone = 0.04 * np.sin(2 * np.pi * 55 * tt) + 0.025 * np.sin(2 * np.pi * 82.4 * tt)
def win(a, b, f=0.8): return np.clip(np.minimum((tt - a) / f, (b - tt) / f), 0, 1)
bed = office_hum * win(d0, d1) + (proj + train) * win(c0, c1) + drone * win(m0, m1)
prev = None
for l in L:
    vv = l['args'].get('volt')
    if vv and vv != prev:
        s, e = env(0.12, 40); add(l['t0'] - 0.1, rng.standard_normal(len(s)) * e, 0.3)
        if vv >= 150: s, e = env(1.0, 2.5); add(l['t0'], np.sign(np.sin(2 * np.pi * 120 * s)) * e * 0.5, 0.06)
    prev = vv or prev
m = v + bed + fx; m = m / max(1, np.abs(m).max() / 0.97)
sf.write('mix.wav', np.stack([m, m], 1).astype(np.float32), SR); print('mix ok', round(DUR, 1))
