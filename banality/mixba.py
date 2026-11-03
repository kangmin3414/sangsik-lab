"""본편 믹스 (모두 합성 + 마지막만 Lyria 피아노 cand_1_piano_b, 목소리 검사 통과).
사무실: 초침 + 도장(초마다, 화면과 같은 시각) + 톱니 딸깍 — 모자를 벗는 순간(48번 줄 55%) 초침이 멈추고 무음.
역사: 영사기 + 먼 기차. 실험실: 낮은 드론 + 레버 철컥 + 전기음. 단계 카드: 낮은 쿵. 질문 카드: 타자기. 끝(지하철): 피아노."""
import json, numpy as np, soundfile as sf, librosa
SR = 48000; tl = json.load(open('timeline.json')); L = tl['lines']; DUR = tl['duration']
v, sr = sf.read('voice.wav'); v = v.mean(1) if v.ndim > 1 else v
v = np.interp(np.arange(int(len(v) * SR / sr)) / SR, np.arange(len(v)) / sr, v); n = int(DUR * SR); v = np.pad(v, (0, max(0, n - len(v))))[:n]
tt = np.arange(n) / SR; rng = np.random.default_rng(5); fx = np.zeros(n)
def add(at, x, g):
    i = int(at * SR); e = min(n, i + len(x))
    if 0 <= i < n: fx[i:e] += x[:e - i] * g
def env(d, dec): s = np.arange(int(d * SR)) / SR; return s, np.exp(-s * dec)
st = lambda l: l['t0'] - 0.15
nx = lambda j: (L[j + 1]['t0'] - 0.15) if j + 1 < len(L) else DUR
HIST = {5, 6, 7, 8, 12, 13, 14, 15, 16, 17, 18, 19, 20}; LAB = set(range(24, 32)) | {34}; STAMP = {0, 1, 2, 9, 10}; OFFICE = STAMP | set(range(36, 40)) | {47, 48, 50, 51, 56, 57}
l48 = [l for l in L if l['i'] == 48][0]; STOP = st(l48) + 0.55 * (l48['t1'] - l48['t0'])
l1 = [l for l in L if l['i'] == 1][0]; bow0, bow1 = st(l1) + 0.5 * (l1['t1'] - l1['t0']), l1['t1'] + 0.6
mask = lambda S: np.clip(sum(np.clip(np.minimum((tt - st(l)) / 0.6, (nx(j) - tt) / 0.6), 0, 1) for j, l in enumerate(L) if l['i'] in S), 0, 1)
for j, l in enumerate(L):
    a, b = st(l), nx(j)
    if l['i'] in OFFICE:
        for k in range(int(np.ceil(a)), int(b)):
            if k > STOP: break
            s, e = env(0.03, 150); add(k, np.sin(2 * np.pi * 2300 * s) * e, 0.06)
            s, e = env(0.05, 80); add(k + 0.04, rng.standard_normal(len(s)) * e, 0.03)
            if l['i'] in STAMP and not (bow0 < k < bow1): s, e = env(0.22, 22); add(k, np.sin(2 * np.pi * (95 - 40 * s) * s) * e + rng.standard_normal(len(s)) * e * 0.15, 0.3)
    if l['scene'] == 'bstep': s, e = env(1.2, 3); add(a + 0.05, np.sin(2 * np.pi * (48 - 10 * s) * s) * e, 0.35)
    if l['scene'] == 'bq' or l['i'] == 49:
        for k in range(int((l['t1'] - a) * 6)):
            if k / 6 > 2.6: break
            s, e = env(0.04, 90); add(a + 0.2 + k / 6 + rng.uniform(0, 0.05), rng.standard_normal(len(s)) * e, 0.08)
    if l['i'] == 39: s, e = env(0.25, 18); add(st(l) + 0.55 * (l['t1'] - l['t0']) + 0.15, np.sin(2 * np.pi * (110 - 40 * s) * s) * e, 0.3)
prev = None
for l in L:
    vv = l['args'].get('volt') if l['i'] in LAB else None
    if l['i'] in (31, 34): vv = 450
    if vv and vv != prev:
        s, e = env(0.12, 40); add(st(l) + 0.05, rng.standard_normal(len(s)) * e, 0.3)
        if vv >= 150: s, e = env(1.0, 2.5); add(l['t0'], np.sign(np.sin(2 * np.pi * 120 * s)) * e * 0.5, 0.06)
    prev = vv or prev
hum = 0.012 * np.convolve(rng.standard_normal(n), np.ones(300) / 300, 'same') * 15
proj = np.convolve((np.sin(2 * np.pi * 24 * tt) > 0.92) * rng.uniform(0.5, 1, n), np.ones(40) / 40, 'same') * 0.05
train = 0.03 * np.sin(2 * np.pi * 48 * tt) + 0.02 * np.convolve(rng.standard_normal(n), np.ones(1200) / 1200, 'same') * 25
drone = 0.04 * np.sin(2 * np.pi * 55 * tt) + 0.025 * np.sin(2 * np.pi * 82.4 * tt)
city = 0.02 * np.convolve(rng.standard_normal(n), np.ones(600) / 600, 'same') * 20
bed = hum * mask(OFFICE) * (tt < STOP) + (proj + train) * mask(HIST) + drone * mask(LAB) + city * mask({40, 44, 45, 22, 23, 32, 33})
# warm piano from the subway to the end
pia, _ = librosa.load('../bgm/cand_1_piano_b.mp3', sr=SR, mono=True); p0 = st([l for l in L if l['i'] == 58][0]) - 1.0
seg = np.zeros(n); m = min(len(pia), n - int(p0 * SR)); seg[int(p0 * SR):int(p0 * SR) + m] = pia[:m]
seg *= np.clip((tt - p0) / 2.5, 0, 1) * np.clip((DUR - tt) / 3.0, 0, 1) * 0.16
mix = v + bed + fx + seg; mix /= max(1, np.abs(mix).max() / 0.97)
sf.write('mix.wav', np.stack([mix, mix], 1).astype(np.float32), SR); print('mix ok', round(DUR, 1), 'stop at', round(STOP, 1))
