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
def loop(p, n):
    xf = int(4 * SR); out = p.copy()
    while len(out) < n + xf:
        fo = np.linspace(1, 0, xf); fi = np.linspace(0, 1, xf); out = np.concatenate([out[:-xf], out[-xf:] * fo + p[:xf] * fi, p[xf:]])
    return out[:n]
TT = {l['id']: l for l in TL['lines']}
B = [(0.0, 'bgm/dark_b.mp3'), (TT['c7a']['t0'] - 1.2, 'bgm/epic_a.mp3'), (TT['c3']['t0'] - 0.4, 'bgm/warm_a.mp3')]  # Lyria 3 Pro, ASR-checked
bed = np.zeros(N); XF = int(2.5 * SR)
for k, (b0, f) in enumerate(B):
    i0 = int(b0 * SR); i1 = int(B[k + 1][0] * SR) + XF if k + 1 < len(B) else N; i1 = min(i1, N)
    seg = loop(load(f), i1 - i0)
    if k: seg[:XF] *= np.linspace(0, 1, XF)
    if k + 1 < len(B): seg[-XF:] *= np.linspace(1, 0, XF)
    bed[i0:i1] += seg
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

def metal():
    o = np.zeros(int(0.5 * SR))
    for w in (tone(2400, 0.5, 0.35), tone(3150, 0.45, 0.25), noisehit(0.08) * 0.6): o[:len(w)] += w[:len(o)]
    return o
def rumble(d=1.5): n = rng.standard_normal(int(d * SR)); bb, aa = butter(2, 120 / (SR / 2)); x = lfilter(bb, aa, n); return x / (np.abs(x).max() + 1e-9) * np.sin(np.linspace(0, np.pi, len(x))) * 0.9
def roar(d=1.4): n = rng.standard_normal(int(d * SR)); bb, aa = butter(2, [90 / (SR / 2), 700 / (SR / 2)], 'band'); x = lfilter(bb, aa, n); x = x / (np.abs(x).max() + 1e-9); tt = np.arange(len(x)) / SR; return x * (1 + 0.5 * np.sin(2 * np.pi * 28 * tt)) * np.minimum(tt / 0.08, 1) * np.exp(-tt * 1.6) * 0.9
def chirp():
    o = np.zeros(int(0.2 * SR)); a = tone(2600, 0.08, 0.4); b = tone(3100, 0.08, 0.4); o[:len(a)] += a; o[int(0.1 * SR):int(0.1 * SR) + len(b)] += b; return o
for l in TL['lines']:
    s_, a_ = l['scene'], l['args']; t0 = l['t0'] - 0.15; D = l['t1'] - l['t0'] + 0.15
    if s_ == 'nchapter': put(t0, whoosh(0.5, 300, 2400), 0.5); put(t0 + 0.3, ding(1175), 0.45)
    if s_ == 'nmoral': [put(t0 + (0.4 + 0.07 * k) * D, noisehit(0.1), 0.5) for k in range(5)]; put(t0 + 0.78 * D, thud(0.6, 50), 1.0); put(t0 + 0.78 * D, noisehit(0.4), 0.6)
    if s_ == 'nlamb': put(t0 + 0.42 * D, ding(1568), 0.4)
    if s_ == 'nhalo': put(t0 + 0.42 * D, metal(), 0.9); put(t0 + 0.42 * D, noisehit(0.3), 0.6); put(t0 + 0.76 * D, thud(0.4, 70), 1.0)
    if s_ == 'nwrap': [put(t0 + (0.05 + 0.17 * k) * D + 0.5, tick(), 0.8) for k in range(3)]; put(t0 + 0.64 * D, whoosh(0.5, 400, 2000), 0.6); put(t0 + 0.84 * D, ding(1568), 0.45)
    if s_ == 'nreason':
        if a_.get('fear'): [put(t0 + (0.05 + 0.1 * k) * D, thud(0.3, 60), 0.6) for k in range(5)]
        else: put(t0 + 0.6 * D, whoosh(0.3, 800, 4000), 0.7)
    if s_ == 'ndog': put(t0 + 0.6 * D, thud(0.4, 60), 0.9)
    if s_ == 'nstages': [put(t0 + d * D, tone(660 + 220 * k, 0.2, 0.5), 0.45) for k, d in enumerate([0.15, 0.4, 0.65])]
    if s_ == 'nload' and not a_.get('many'): [put(t0 + k * D / 5 + 0.05, thud(0.3, 75), 0.7) for k in range(1, 5)]
    if s_ == 'ndry': put(t0 + 0.5 * D, thud(0.4, 55), 0.7)
    if s_ == 'nlion': put(t0, whoosh(0.8, 200, 3000), 0.8); put(t0 + 0.4, thud(0.8, 45), 1.0); put(t0 + 0.5, roar(1.6), 0.7)
    if s_ == 'ndragon': put(t0, rumble(2.5), 0.7)
    if s_ == 'nroar': put(t0, roar(1.6), 1.0); put(t0 + 0.05, thud(0.6, 50), 1.0); [put(t0 + 0.4 + 0.12 * k, noisehit(0.1), 0.4) for k in range(6)]
    if s_ == 'ngate': put(t0 + 0.7 * D, thud(0.6, 50), 0.9)
    if s_ == 'nclaw': put(t0 + 0.08 * D, whoosh(0.3, 2000, 9000), 0.8); put(t0 + 0.55 * D, whoosh(0.3, 6000, 1500), 0.6); put(t0 + 0.78 * D, ding(1568), 0.5)
    if s_ == 'nchain': [put(t0 + tb, metal(), 0.9) for tb in (1.6, 2.1, 2.6, 3.0)]
    if s_ == 'nrefuse' and a_.get('ok'): put(t0 + D + 1.4, ding(1318), 0.45)
    if s_ == 'nlist': [put(t0 + (0.05 + 0.07 * k) * D, tick(), 0.6) for k in range(6)]
    if s_ == 'nslice' and a_.get('cut'): [put(t0 + (0.15 + 0.7 * k / 6) * D, whoosh(0.25, 1500, 5000), 0.5) for k in range(6)]
    if s_ == 'nworld': put(t0 + 0.15 * D, thud(0.4, 70), 0.9); put(t0 + 0.35 * D, rumble(0.25 * D), 0.6); [put(t0 + 0.9 * D + k * 0.25, chirp(), 0.5) for k in range(2)]
    if s_ == 'ntwo': put(t0 + 0.8 * D, thud(0.4, 60), 0.8)
    if s_ == 'nmirror': put(t0 + 0.55 * D, ding(1047), 0.4)
    if s_ == 'nend': put(l['t1'] + 0.8, ding(1175), 0.4); put(l['t1'] + 0.8, ding(1760), 0.25)
sf.write('sfx_n.wav', sfx, SR)
mix = voice + bed * 0.55 + sfx * 0.5
sf.write('mix_raw_n.wav', mix, SR); sf.write('bed_only.wav', bed * 0.55, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'mix_raw_n.wav', '-af', 'loudnorm=I=-14:TP=-1.0:LRA=9,alimiter=limit=0.89', '-ar', str(SR), 'mix_n.wav'], check=True)
print('audio ok', round(DUR, 1))
