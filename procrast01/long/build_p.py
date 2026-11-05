import json, os, subprocess, numpy as np, soundfile as sf
from scipy.signal import resample_poly, butter, lfilter
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
TL = json.load(open('timeline_p.json')); SR = 44100; DUR = TL['duration']; N = int(DUR * SR)
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
def loop(p, n):
    xf = int(4 * SR); out = p.copy()
    while len(out) < n + xf:
        fo = np.linspace(1, 0, xf); fi = np.linspace(0, 1, xf); out = np.concatenate([out[:-xf], out[-xf:] * fo + p[:xf] * fi, p[xf:]])
    return out[:n]
bed = loop(load('bgm/comic_a.mp3'), N)
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
def metal():
    o = np.zeros(int(0.5 * SR))
    for w in (tone(2400, 0.5, 0.35), tone(3150, 0.45, 0.25), noisehit(0.08) * 0.6): o[:len(w)] += w[:len(o)]
    return o
def rumble(d=1.5): n = rng.standard_normal(int(d * SR)); bb, aa = butter(2, 120 / (SR / 2)); x = lfilter(bb, aa, n); return x / (np.abs(x).max() + 1e-9) * np.sin(np.linspace(0, np.pi, len(x))) * 0.9
def roar(d=1.4): n = rng.standard_normal(int(d * SR)); bb, aa = butter(2, [90 / (SR / 2), 700 / (SR / 2)], 'band'); x = lfilter(bb, aa, n); x = x / (np.abs(x).max() + 1e-9); tt = np.arange(len(x)) / SR; return x * (1 + 0.5 * np.sin(2 * np.pi * 28 * tt)) * np.minimum(tt / 0.08, 1) * np.exp(-tt * 1.6) * 0.9
def chirp():
    o = np.zeros(int(0.2 * SR)); a = tone(2600, 0.08, 0.4); b = tone(3100, 0.08, 0.4); o[:len(a)] += a; o[int(0.1 * SR):int(0.1 * SR) + len(b)] += b; return o

def boing():
    tt = t_(0.45); f = 300 + 500 * np.exp(-tt * 6) * np.cos(2 * np.pi * 7 * tt); ph = 2 * np.pi * np.cumsum(f) / SR; return np.sin(ph) * np.exp(-tt * 5) * 0.8
def pop_(): return tone(1200, 0.12, 0.5) + np.pad(tone(1800, 0.08, 0.3), (0, int(0.04 * SR)))[:int(0.12 * SR)]
def cash(): o = np.zeros(int(0.5 * SR)); a = tone(2093, 0.4, 0.4); b = tone(2637, 0.35, 0.35); o[:len(a)] += a; o[int(0.08 * SR):int(0.08 * SR) + len(b)] += b; return o
def fanfare():
    o = np.zeros(int(1.4 * SR))
    for k, (f, d0) in enumerate([(523, 0), (659, 0.15), (784, 0.3), (1047, 0.5)]):
        w = tone(f, 0.8 if k == 3 else 0.3, 0.5); i = int(d0 * SR); o[i:i + len(w)] += w[:len(o) - i]
    return o
def drumroll(d=1.5): n = rng.standard_normal(int(d * SR)); tt = t_(d); return n * (0.3 + 0.7 * (np.sin(2 * np.pi * 18 * tt) > 0)) * np.linspace(0.2, 1, len(n)) * 0.35
def swipe(): return whoosh(0.22, 800, 5000)
for l in TL['lines']:
    s_, a_ = l['scene'], l['args']; t0 = l['t0'] - 0.15; D = l['t1'] - l['t0'] + 0.15
    if s_ == 'pdrop' and not a_.get('after'): put(t0 + 0.22, thud(0.35, 90), 1.0); put(t0 + 0.22, noisehit(0.1), 0.5)
    if s_ == 'pchin': put(t0 + 0.62 * D, pop_(), 0.8); put(t0 + 0.66 * D, boing(), 0.6)
    if s_ == 'pcal': [put(t0 + d * D, pop_(), 0.7) for d in (0.02, 0.3, 0.62)]
    if s_ == 'ppump': [put(t0 + 0.1 + k * 0.45, noisehit(0.12), 0.25) for k in range(int(0.45 * D / 0.45))]; put(t0 + 0.6 * D, ding(1568), 0.6)
    if s_ == 'pvow': put(t0 + 0.55 * D, thud(0.4, 70), 0.9)
    if s_ == 'pflex':
        k = a_.get('k', 0)
        if k == 0: put(t0 + 0.2, swipe(), 0.7); put(t0 + 0.9, cash(), 0.7)
        if k == 1: put(t0 + 0.25 * D, whoosh(0.3, 2000, 600), 0.6); put(t0 + 0.25 * D + 0.35, thud(0.2, 120), 0.6); put(t0 + 0.5 * D, cash(), 0.7)
        if k == 3: [put(t0 + (0.1 + i * 0.08) * D, pop_(), 0.45) for i in range(6)]
    if s_ == 'pceremony': put(t0, fanfare(), 0.7)
    if s_ == 'pdays':
        d = a_.get('d', 0)
        if d in (1, 2): put(t0, pop_(), 0.7)
        if d == 3: put(t0, drumroll(min(1.8, D)), 0.8); put(t0 + min(1.8, D), thud(0.5, 50), 0.9)
    if s_ == 'pclock': put(t0 + 0.62 * D, thud(0.6, 45), 1.0); put(t0 + 0.62 * D, whoosh(0.3, 3000, 600), 0.5)
    if s_ == 'pbrain' and not a_.get('k'): [put(t0 + (0.15 + i * 0.08) * D, tone(880 + 110 * i, 0.15, 0.4), 0.4) for i in range(6)]
    if s_ == 'pshorts': [put(t0 + (0.15 + 0.55 * k / 3) * D + 0.18, swipe(), 0.6) for k in range(1, 4)]; put(t0 + 0.85 * D, boing(), 0.6)
    if s_ == 'pyasik': put(t0 + 0.45 * D, ding(1318), 0.5); put(t0 + 0.45 * D + 0.25, ding(1047), 0.5)
    if s_ == 'pstickers': [put(t0 + d * D, thud(0.15, 160), 0.6) for d in (0.2, 0.42, 0.62, 0.82)]
    if s_ == 'pstop': [put(t0 + (0.05 + i * 0.1) * D + 0.33, noisehit(0.1), 0.6) for i in range(6)]; put(t0 + 0.72 * D, thud(0.5, 60), 1.0)
    if s_ == 'phook':
        k = a_.get('k', 0)
        if k == 0: put(t0 + 0.55 * D, whoosh(0.3, 800, 4000), 0.7); put(t0 + 0.75 * D, ding(1568), 0.5)
        if k == 2: put(t0 + 0.45 * D, whoosh(0.6, 300, 2500), 0.7); put(t0 + 0.6 * D, boing(), 0.7)
sf.write('sfx_p.wav', sfx, SR)
mix = voice + bed * 0.55 + sfx * 0.5
sf.write('mix_raw_p.wav', mix, SR); sf.write('bed_only.wav', bed * 0.55, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'mix_raw_p.wav', '-af', 'loudnorm=I=-14:TP=-1.0:LRA=9,alimiter=limit=0.89', '-ar', str(SR), 'mix_p.wav'], check=True)
print('audio ok', round(DUR, 1))
