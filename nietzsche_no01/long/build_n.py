import json, os, subprocess, numpy as np, soundfile as sf
from scipy.signal import resample_poly, butter, lfilter
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
TL = json.load(open('timeline_n.json')); SR = 44100; DUR = TL['duration']; N = int(DUR * SR)
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
parts = [load('bgm/dark_b.mp3')]  # Lyria 3 Pro, ASR-checked: no vocals
bed = np.zeros(0); xf = int(4 * SR); k = 0
while len(bed) < N + xf:
    p = parts[k % len(parts)].copy(); k += 1
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
put(2.35, thud(0.35, 70), 1.0); put(2.33, noisehit(0.12), 0.5)              # 툭: pile lands on the desk
put(T['o2']['t0'] - 0.35, whoosh(0.5, 300, 2400), 0.55)                    # cut to split screen
for k in range(6): put(T['o2']['t0'] + 0.2 + k * 0.55, noisehit(0.25), 0.12)  # flame crackle
L1 = T['n1']; D1 = L1['t1'] - L1['t0'] + 0.15
put(L1['t0'] - 0.15 + 0.68 * D1, thud(0.25, 110), 0.6)                    # 싫어요 swallowed
put(L1['t0'] - 0.15 + 0.72 * D1, tone(880, 0.25, 0.5), 0.35)              # bubble pops
put(T['n2']['t0'] - 0.5, tick(), 1.0); put(T['n2']['t0'] - 0.45, thud(0.15, 160), 0.4)   # light switch off
L4 = T['n4']; D4 = L4['t1'] - L4['t0'] + 0.15
for k in range(int(D4 / 0.5)): put(L4['t0'] - 0.15 + k * 0.5, tick(), 0.28)  # clock ticking
put(L4['t0'] - 0.15 + 0.8 * D4, whoosh(0.45, 1200, 9000), 0.9)            # blade glint
L5 = T['n5']; D5 = L5['t1'] - L5['t0'] + 0.15
put(L5['t0'] - 0.4, thud(0.6, 45), 0.8)                                    # spotlight on
put(L5['t0'] - 0.15 + 0.74 * D5, thud(0.4, 60), 1.0); put(L5['t0'] - 0.15 + 0.74 * D5, noisehit(0.15), 0.5)
put(T['n6']['t0'] - 0.6, thud(0.9, 38), 1.0); put(T['n6']['t0'] - 0.6, whoosh(0.8, 200, 900), 0.6)  # into the night field
sf.write('sfx_n.wav', sfx, SR)
mix = voice + bed * 0.55 + sfx * 0.5
sf.write('mix_raw_n.wav', mix, SR); sf.write('bed_only.wav', bed * 0.55, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'mix_raw_n.wav', '-af', 'loudnorm=I=-14:TP=-1.0:LRA=9,alimiter=limit=0.89', '-ar', str(SR), 'mix_n.wav'], check=True)
print('audio ok', round(DUR, 1))
