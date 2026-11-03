import json, os, subprocess, numpy as np, soundfile as sf
from scipy.signal import resample_poly, butter, lfilter
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
TL = json.load(open('timeline_r.json')); SR = 44100; DUR = TL['duration']; N = int(DUR * SR)
rng = np.random.default_rng(7)
voice = np.zeros(N)
for L in TL['lines']:
    if 'take' not in L: continue
    w, sr = sf.read(L['take'], dtype='float32'); w = w.mean(1) if w.ndim > 1 else w
    w = w[int(L['a0'] * sr):int(L['a1'] * sr)].copy(); w[:int(0.01 * sr)] *= np.linspace(0, 1, int(0.01 * sr)); w[-int(0.04 * sr):] *= np.linspace(1, 0, int(0.04 * sr))
    w = resample_poly(w, 441, 240) if sr == 24000 else w
    i = int(L['t0'] * SR); voice[i:i + len(w)] += w[:max(0, N - i)]
# bed: piano a + b + a ... with crossfades
def load(p):
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', p, '-ar', str(SR), '-ac', '1', 'tmp_bed.wav'], check=True); return sf.read('tmp_bed.wav', dtype='float32')[0]
parts = [load('../../bgm/cand_1_piano_a.mp3'), load('../../bgm/cand_1_piano_b.mp3')]
bed = np.zeros(0); xf = int(4 * SR); k = 0
while len(bed) < N + xf:
    p = parts[k % 2].copy(); k += 1
    if len(bed) == 0: bed = p
    else:
        fo = np.linspace(1, 0, xf); fi = np.linspace(0, 1, xf)
        bed = np.concatenate([bed[:-xf], bed[-xf:] * fo + p[:xf] * fi, p[xf:]])
bed = bed[:N]
env = (np.abs(voice) > 0.01).astype(np.float32); sm = np.ones(int(0.3 * SR)) / int(0.3 * SR); env = np.convolve(env, sm, 'same')
gain = 0.30 - 0.15 * np.clip(env * 2.2, 0, 1)
fo = int(3 * SR); bed = bed * gain; bed[-fo:] *= np.linspace(1, 0, fo); bed[:int(1.0 * SR)] *= np.linspace(0, 1, int(1.0 * SR))
# sfx
def t_(d): return np.arange(int(d * SR)) / SR
def tone(f, d=0.3, g=0.5): t = t_(d); x = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t); return x * np.minimum(np.arange(len(t)) / (0.004 * SR), 1) * np.exp(-np.arange(len(t)) / SR / (d / 4)) * g
def ding(f=1318): return tone(f, 0.6, 0.45) + np.pad(tone(f * 1.5, 0.5, 0.2), (0, int(0.1 * SR)))
def thud(d=0.3, f=70): t = t_(d); return np.sin(2 * np.pi * (f + 90 * np.exp(-t * 25)) * t) * np.exp(-t * 14) * 1.2
def tick(): t = t_(0.05); return rng.standard_normal(len(t)) * np.exp(-t * 90) * 0.6
def noisehit(d=0.12): t = t_(d); return rng.standard_normal(len(t)) * np.exp(-t * 35) * 0.7
def whoosh(d=0.35, f0=400, f1=2500):
    n = rng.standard_normal(int(d * SR)); out = np.zeros_like(n); seg = 6
    for k in range(seg):
        a, b = int(k * len(n) / seg), int((k + 1) * len(n) / seg); fc = f0 + (f1 - f0) * (k / seg)
        bb, aa = butter(2, [fc * 0.7 / (SR / 2), min(fc * 1.4, 20000) / (SR / 2)], 'band'); out[a:b] = lfilter(bb, aa, n[a:b])
    return out * np.sin(np.linspace(0, np.pi, len(out))) ** 1.5 * 0.9
sfx = np.zeros(N)
def put(t0, w, g=0.6):
    i = int(t0 * SR)
    if i < 0 or i >= N: return
    w = w[:N - i]; sfx[i:i + len(w)] += w * g
T = {l['id']: l for l in TL['lines']}
for l in TL['lines']:
    t0 = l['t0']; s = l['scene']
    if s == 'rchapter': put(t0, whoosh(0.5, 300, 2400), 0.5); put(t0 + 0.3, ding(1175), 0.45)
    if s == 'rtitle': put(t0 + 1.6, ding(1568), 0.4); put(t0 + 0.2, thud(0.3, 80), 0.5)
    if s == 'rexam': put(t0 + 2.8, whoosh(0.5, 200, 1500), 0.5); put(t0 + 3.1, thud(0.4, 55), 0.7)
    if s == 'rash': [put(t0 + 1.0 + i * 0.48, noisehit(0.18), 0.35) for i in range(6)]
    if s == 'rbrain' and l['args'].get('stamp'): put(t0 + 0.9, thud(0.3, 85), 0.9); put(t0 + 0.9, noisehit(0.1), 0.4)
    if s == 'rbars':
        if l['args']['ph'] == 1: [put(t0 + 0.3 + i * 0.25, tone(f, 0.3, 0.5), 0.35) for i, f in enumerate([392, 494, 587, 784])]; put(t0 + 2.1, ding(1175), 0.5)
        else: put(t0 + 0.6, whoosh(0.6, 200, 1200), 0.5); put(t0 + 2.4, thud(0.35, 55), 0.9); put(t0 + 2.4, whoosh(0.3, 600, 4000), 0.5)
    if s == 'rcal': [put(t0 + 0.15 + i * 0.34, tick(), 0.7) for i in range(7)]; put(t0 + 2.5, thud(0.5, 45), 0.8)
    if s == 'rnobel': put(t0 + 0.2, ding(1568), 0.5)
    if s == 'rsteps': [put(t0 + 0.3 + i * 1.6, tone(660, 0.2, 0.5), 0.4) for i in range(2)]
    if s == 'rthree': [put(t0 + 0.8 + i * 1.5, whoosh(0.25), 0.4) for i in range(3)]
    if s == 'rduck': put(t0 + 3.0, thud(0.35, 70), 0.8)
    if s == 'rgym': [put(t0 + 1.2 + i * 2.4, thud(0.25, 75), 0.6) for i in range(3)]
    if s == 'rno10': put(t0 + 0.8, thud(0.3, 65), 0.9); put(t0 + 0.8, whoosh(0.25, 500, 3000), 0.4)
    if s == 'rcomment': [put(t0 + 1.2 + i * 0.2, tick(), 0.35) for i in range(25)]; put(t0 + 5.6, ding(1568), 0.5)
    if s == 'rend': put(t0 + 0.3, ding(1318), 0.5); put(t0 + 0.3, ding(1976), 0.3)
sf.write('sfx_r.wav', sfx, SR)
mix = voice + bed * 0.55 + sfx * 0.5
sf.write('mix_raw_r.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'mix_raw_r.wav', '-af', 'loudnorm=I=-14:TP=-1.0:LRA=9,alimiter=limit=0.89', '-ar', str(SR), 'mix_r.wav'], check=True)
print('audio ok', round(DUR, 1))
