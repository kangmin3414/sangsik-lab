import json, os, subprocess, numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
TL = json.load(open('timeline_s.json')); SR = 44100
exec(open('build_s.py').read().split('# music bed')[0].split("voice = np.zeros(N)")[0].split('\n',2)[0]) if False else None
N = int((TL['end'] + 0.3) * SR)
rng = np.random.default_rng(3)
def t_(d): return np.arange(int(d * SR)) / SR
def env(x, a=0.005, r=None):
    n = len(x); r = r or n / SR
    e = np.minimum(np.arange(n) / (a * SR), 1) * np.exp(-np.arange(n) / SR / (r / 4)); return x * e
def whoosh(d=0.35, f0=400, f1=2500):
    n = rng.standard_normal(int(d * SR)); from scipy.signal import butter, lfilter
    out = np.zeros_like(n); seg = 6
    for k in range(seg):
        a, b = int(k * len(n) / seg), int((k + 1) * len(n) / seg)
        fc = f0 + (f1 - f0) * (k / seg); bb, aa = butter(2, [fc * 0.7 / (SR / 2), min(fc * 1.4, 20000) / (SR / 2)], 'band'); out[a:b] = lfilter(bb, aa, n[a:b])
    e = np.sin(np.linspace(0, np.pi, len(out))) ** 1.5; return out * e * 0.9
def thud(d=0.3, f=70):
    t = t_(d); return np.sin(2 * np.pi * (f + 90 * np.exp(-t * 25)) * t) * np.exp(-t * 14) * 1.2
def tone(f, d=0.3, g=0.5): t = t_(d); return env(np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t), 0.004, d) * g
def tick(): t = t_(0.05); return rng.standard_normal(len(t)) * np.exp(-t * 90) * 0.6
def ding(f=1318): return tone(f, 0.6, 0.45) + np.pad(tone(f * 1.5, 0.5, 0.2), (0, int(0.1 * SR)))
def noisehit(d=0.12): t = t_(d); return rng.standard_normal(len(t)) * np.exp(-t * 35) * 0.7
sfx = np.zeros(N)
def put(t0, w, g=0.6):
    i = int(t0 * SR); w = w[:max(0, N - i)]; sfx[i:i + len(w)] += w * g
L = {l['id']: l['t0'] for l in TL['lines']}
# l1
put(L['l1'] + 0.0, thud(0.4, 60), 0.9); put(L['l1'] + 0.0, whoosh(0.3, 800, 3500), 0.5); put(L['l1'] + 0.5, ding(1568), 0.4); put(L['l1'] + 0.9, tone(180, 0.2, 0.5), 0.5)
# l2
put(L['l2'] + 0.1, whoosh(0.25), 0.4); put(L['l2'] + 1.1, whoosh(0.25), 0.4); put(L['l2'] + 1.5, tone(660, 0.25, 0.5), 0.6)
# l3 page flips and pen
for k in range(1, 4): put(L['l3'] + k * 0.8 - 0.2, noisehit(0.16), 0.5)
put(L['l3'] + 3.4, tone(300, 0.3, 0.5), 0.5); put(L['l3'] + 4.9, thud(0.25, 90), 0.8); put(L['l3'] + 4.9, noisehit(0.2), 0.6)
for k in range(5): put(L['l3'] + 5.6 + k * 0.28, tick(), 0.5)
# l4 bars
put(L['l4'] + 0.0, whoosh(0.25), 0.4)
for k, f in enumerate([392, 494, 587, 784]): put(L['l4'] + 0.25 + k * 0.28, tone(f, 0.3, 0.5), 0.45)
put(L['l4'] + 1.3, ding(1175), 0.6); put(L['l4'] + 1.3, thud(0.2, 80), 0.5)
# l5 ticks
put(L['l5'] + 0.0, whoosh(0.5, 300, 3000), 0.5)
for k in range(7): put(L['l5'] + k * 0.2, tick(), 0.6 + 0.06 * k)
put(L['l5'] + 1.4, thud(0.5, 45), 1.0)
# l6 flip
t = t_(1.1); put(L['l6'] + 0.3, np.sin(2 * np.pi * (50 + 30 * np.sin(t * 40)) * t) * np.linspace(0.2, 1, len(t)) * 0.6, 0.8)
put(L['l6'] + 1.45, thud(0.35, 55), 1.0); put(L['l6'] + 1.45, whoosh(0.3, 600, 4000), 0.5)
for k, f in enumerate([440, 392, 330, 262]): put(L['l6'] + 1.6 + k * 0.3, tone(f, 0.35, 0.5), 0.35)
put(L['l6'] + 2.0, ding(1568), 0.4)
# l7 stamps
for i in range(4): put(L['l7'] + 0.35 + i * 0.75, thud(0.25, 85), 0.9); put(L['l7'] + 0.35 + i * 0.75, noisehit(0.1), 0.4)
# l8
put(L['l8'] + 0.0, whoosh(0.4, 300, 2000), 0.4); put(L['l8'] + 5.6, thud(0.45, 55), 1.0); put(L['l8'] + 5.6, whoosh(0.3, 800, 4000), 0.6); put(L['l8'] + 5.85, ding(1568), 0.5)
sf.write('sfx.wav', sfx, SR)
# reuse v1 mix pieces: build voice+bed through build_s logic then add sfx
src = open('build_s.py').read().replace("mix = voice * 1.0 + b * 0.55", "S = sf.read('sfx.wav', dtype='float32')[0]; mix = voice * 1.0 + b * 0.5 + S[:N] * 0.55").replace("'mix_s.wav'", "'mix_s2.wav'")
exec(compile(src, 'build_s', 'exec'))
