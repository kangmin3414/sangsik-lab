"""voice + beds + synthesized SFX -> mix_b.wav (loudnorm -14)"""
import json, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, lfilter
SR = 44100; rng = np.random.default_rng(7)
def mx(*ws):
    n = max(len(w) for w in ws); return sum(np.pad(w, (0, n - len(w))) for w in ws)
TL = json.load(open('timeline_b.json')); L = {l['id']: l for l in TL['lines']}; DUR = TL['duration']; N = int(DUR * SR)
voice, _ = sf.read('voice_b.wav', dtype='float32'); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
def W(lid, key, fb=0.0):
    l = L[lid]
    for w in l.get('words', []):
        if key in w['w'].replace(' ', ''): return l['t0'] + w['t']
    return l['t0'] + fb
def load(fn, start, dur):
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', fn, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    a = np.frombuffer(raw, np.float32).copy(); n = int(dur * SR)
    if len(a) < n: a = np.concatenate([a, a[int(8 * SR):]] * 3)[:n] if len(a) > 8 * SR else np.pad(a, (0, n - len(a)))
    return a[:n]
bed = np.zeros(N)
def place(fn, t0, t1, g, fin=1.5, fout=2.5, off=0.0):
    i0, i1 = int(t0 * SR), min(N, int(t1 * SR)); a = load(fn, off, (i1 - i0) / SR) * g
    a[:int(fin * SR)] *= np.linspace(0, 1, int(fin * SR))[:len(a)]; k = int(fout * SR); a[-k:] *= np.linspace(1, 0, k)
    bed[i0:i0 + len(a)] += a
tA, tW = L['t1']['t0'] - 0.6, L['m9']['t0'] - 0.9
place('bgm/noir_b.mp3', 0, tA + 2.0, 0.5, fin=0.8, fout=2.4)
place('bgm/noir_a.mp3', tA + 0.4, tW + 1.5, 0.48, fin=1.6, fout=2.2)
place('bgm/warm_a.mp3', tW, DUR, 0.52, fin=2.2, fout=3.0)
# duck the bed under speech
act = np.convolve((np.abs(voice) > 0.012).astype(float), np.ones(int(0.35 * SR)) / int(0.35 * SR), 'same')
bed *= (1.0 - 0.55 * np.clip(act * 2.0, 0, 1))
sfx = np.zeros(N)
def put(t, w, g=1.0):
    i = int(t * SR); w = w[:max(0, N - i)]; sfx[i:i + len(w)] += w * g
def env(n, a=0.002, d=0.2):
    t = np.arange(n) / SR; return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
def bp(x, lo, hi): b, a = butter(2, [lo / (SR / 2), min(0.99, hi / (SR / 2))], 'band'); return lfilter(b, a, x)
def lp(x, f): b, a = butter(2, f / (SR / 2)); return lfilter(b, a, x)
def noise(d): return rng.standard_normal(int(d * SR))
def thud(d=0.35, f=70): t = np.arange(int(d * SR)) / SR; return np.sin(2 * np.pi * f * t * (1 - t)) * env(len(t), 0.002, 0.09) + lp(noise(d), 900)[:len(t)] * env(len(t), 0.001, 0.03) * 0.6
def tone(f, d, dec=0.4, h=(1, 0.4, 0.2)): t = np.arange(int(d * SR)) / SR; return sum(a * np.sin(2 * np.pi * f * (i + 1) * t) for i, a in enumerate(h)) * env(len(t), 0.004, dec)
def whoosh(d=0.4): n = noise(d); return bp(n, 600, 4000) * np.sin(np.linspace(0, np.pi, len(n))) ** 2 * 0.5
def pop_(f=900): t = np.arange(int(0.08 * SR)) / SR; return np.sin(2 * np.pi * f * t * (1 + 3 * t)) * env(len(t), 0.001, 0.025)
def crackle(d=0.5): n = noise(d) * (rng.random(int(d * SR)) > 0.985); return bp(n, 1500, 8000) * 0.8
def glass():
    s = np.zeros(int(1.2 * SR)); s[:int(0.15 * SR)] += bp(noise(0.15), 2500, 9000) * env(int(0.15 * SR), 0.001, 0.05) * 1.2
    for k in range(9):
        i = int(rng.random() * 0.7 * SR); w = tone(2500 + rng.random() * 3000, 0.4, 0.08, (1,)) * 0.25; s[i:i + len(w)] += w[:len(s) - i]
    return s
def rip(d=0.45): n = noise(d); return bp(n, 1200, 6000) * (0.6 + 0.4 * np.sign(np.sin(np.linspace(0, 90, len(n))))) * np.linspace(1, 0.3, len(n)) * 0.7
def creak(d=1.1): t = np.arange(int(d * SR)) / SR; f = 420 + 160 * np.sin(2 * np.pi * 1.3 * t) + 40 * np.sin(2 * np.pi * 11 * t); return np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.08 * np.sin(np.linspace(0, np.pi, len(t)))
def heartbeat(): return np.concatenate([thud(0.18, 55) * 0.9, np.zeros(int(0.08 * SR)), thud(0.22, 50) * 0.7])
def scratch(): t = np.arange(int(0.5 * SR)) / SR; f = 300 + 1800 * np.abs(np.sin(2 * np.pi * 3 * t)); return bp(np.sin(2 * np.pi * np.cumsum(f) / SR) + noise(0.5) * 0.4, 300, 5000) * env(len(t), 0.002, 0.25) * 0.6
def bell(): return mx(tone(1320, 1.2, 0.5, (1, 0.5, 0.25)) * 0.5, tone(1760, 1.0, 0.3, (1, 0.3)) * 0.3)
def chime():
    s = np.zeros(int(1.3 * SR))
    for i in range(6):
        w = tone(1200 * 2 ** (i / 6), 0.8, 0.3, (1, 0.2)) * 0.22; j = int(i * 0.07 * SR); s[j:j + len(w)] += w
    return s
def beep(): return tone(1000, 0.09, 0.05, (1,)) * 0.25
def snap(): return bp(noise(0.06), 1500, 7000) * env(int(0.06 * SR), 0.0005, 0.01) * 2.0
def clank(): return mx(tone(310, 0.6, 0.15, (1, 0.6, 0.5, 0.3)) * 0.6, thud(0.3, 90) * 0.6)
# rain bed for the alley scenes
for lid in ['s0', 'i1', 'i7', 'i8', 'i9', 'i10']:
    l = L[lid]; d = l['t1'] - l['t0'] + 0.6; r = lp(bp(noise(d), 400, 9000), 6000) * 0.05; r[:int(0.2 * SR)] *= np.linspace(0, 1, int(0.2 * SR)); r[-int(0.3 * SR):] *= np.linspace(1, 0, int(0.3 * SR)); put(l['t0'] - 0.15, r)
s0 = L['s0']['t0']; put(s0 + 0.5, crackle(0.9), 0.5)
for i in range(4): put(L['i1']['t0'] - 0.15 + 0.15 + i * 0.28, crackle(0.25), 0.6); put(L['i1']['t0'] + i * 0.28 + 0.1, tone(120, 0.3, 0.2, (1, 0.5)) * 0.15)
put(W('i2', '유사', 2.0) - 0.02, thud(0.4, 80), 1.0)
put(W('i4', '이리', 0.9), thud(0.3, 110), 0.6); put(W('i4', '저리', 1.7), thud(0.3, 110), 0.6); put(W('i4', '산산', 3.1), glass(), 0.9)
put(W('i8', '질러', 0.5), whoosh(0.5), 0.9); put(W('i8', '찢는', 1.9) + 0.4, rip(), 0.6)
put(W('i9', '쓰러', 1.7) + 0.35, thud(0.4, 60), 1.0)
put(W('i10', '도망', 1.5), whoosh(0.6), 0.6)
put(W('i11', '가면', 1.5), pop_(700), 0.8)
tP = W('i11', '대문호', 5.0)
for i in range(4): put(tP + 0.45 + i * 0.32, whoosh(0.4), 0.25)
put(L['i11']['t1'] + 0.05, chime(), 0.6)
put(W('i12', '뼈', 1.1), mx(thud(0.25, 140), pop_(500)), 0.8); put(W('i12', '처방전', 2.5), whoosh(0.35), 0.5)
t1 = L['t1']['t0']; put(t1 + 0.05, tone(988, 0.6, 0.35, (1, 0.3)) * 0.5); put(t1 + 0.45, tone(784, 0.9, 0.5, (1, 0.3)) * 0.5)
put(L['a0']['t0'] + 0.05, creak(1.0), 1.0)
for k in range(4): put(L['a0']['t0'] + 0.9 + k * 0.5, thud(0.12, 200) * 0.25)
for k in range(6): put(L['a1']['t0'] + 0.1 + k * 0.55, heartbeat(), 0.8)
for k in range(3): put(L['a2']['t0'] - 0.15 + [0.3, 1.8, 3.3][k], pop_(800 + 200 * k), 0.7)
for k in range(5): put(L['a2']['t0'] + 0.5 + k * 0.9, heartbeat(), 0.45)
dt = W('d1', '주말', 2.9); [put(L['d1']['t0'] + 0.05 + 0.32 * k, thud(0.12, 160) * 0.4) for k in range(int((dt - L['d1']['t0']) / 0.32))]
for k, tt in enumerate([-0.2, 0.15, 0.45]): put(L['d2']['t0'] - 0.15 + max(0.05, tt + 0.15), pop_(1200), 0.5)
put(W('d2', '말', 0.8), pop_(1500), 0.6)
put(W('d3', '타인', 1.8) - 0.02, thud(0.45, 75), 1.1)
put(W('m1', '마르', 2.3) - 0.35, whoosh(0.5), 0.6); put(W('m1', '마르', 2.3), chime(), 0.7)
put(L['m2']['t0'] + 0.1, chime(), 0.5)
put(L['m3']['t0'] - 0.15, scratch(), 1.0)
w3 = lp(noise(L['m3']['t1'] - L['m3']['t0']), 500) * 0.08; put(L['m3']['t0'], w3)
for k in range(5): put(W('m3', '야만족', 0.9) + k * 0.4, whoosh(0.3), 0.35)
put(W('m3', '측근', 3.5), tone(2600, 0.6, 0.3, (1,)) * 0.15)
put(W('m3', '뒤집', 6.3), thud(0.6, 50), 1.0)
for i, k in enumerate(['상사', '수군', '비가', '태풍']): tt = W('m7', k, 0.5 + i * 1.6); put(tt, pop_(600), 0.5); put(tt + 0.9, whoosh(0.6), 0.5)
put(W('m7', '영역', 8.5), clank(), 0.9)
tU = W('m8', '내어', 3.3)
tt = L['m8']['t0']
while tt < tU: put(tt, beep(), 0.7); tt += 0.36
put(tU + 0.15, mx(pop_(400), snap()), 1.0); tt = tU + 0.8
while tt < L['m8']['t1'] + 0.6: put(tt, beep(), 0.5); tt += 0.85
put(W('m10', '찔린', 4.3), pop_(1400), 0.5)
put(W('m11', '뚝', 2.5), mx(snap(), thud(0.15, 220) * 0.4), 1.0)
put(W('m11', '연고', 4.5), chime(), 0.5)
put(L['a9']['t0'] + 1.85, bell(), 0.9)
mix = voice * 1.0 + bed + sfx * 0.55
sf.write('mix_raw_b.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'mix_raw_b.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), 'mix_b.wav'], check=True)
print('dur', round(DUR, 2), 'peak raw', round(float(np.abs(mix).max()), 2))
