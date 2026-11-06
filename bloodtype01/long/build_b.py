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
    a = np.frombuffer(raw, np.float32).copy(); a = np.concatenate([a[int(start * SR):], a]); n = int(dur * SR)
    if len(a) < n: a = np.concatenate([a, a[int(8 * SR):]] * 3)[:n] if len(a) > 8 * SR else np.pad(a, (0, n - len(a)))
    return a[:n]
bed = np.zeros(N)
def place(fn, t0, t1, g, fin=1.5, fout=2.5, off=0.0):
    i0, i1 = int(t0 * SR), min(N, int(t1 * SR)); a = load(fn, off, (i1 - i0) / SR) * g
    a[:int(fin * SR)] *= np.linspace(0, 1, int(fin * SR))[:len(a)]; k = int(fout * SR); a[-k:] *= np.linspace(1, 0, k)
    bed[i0:i0 + len(a)] += a
T0 = lambda k: L[k]['t0']
segs = [('bgm/noir_b.mp3', 0, T0('tA'), 0), ('bgm/noir_a.mp3', T0('tA') - 0.4, T0('m9') - 0.6, 0), ('bgm/warm_a.mp3', T0('m9') - 0.8, T0('tB') - 0.2, 0),
        ('bgm/noir_b.mp3', T0('tB') - 0.4, T0('n6') - 0.4, 55), ('bgm/warm_a.mp3', T0('n6') - 0.6, T0('tO') - 0.2, 35),
        ('bgm/noir_a.mp3', T0('tO') - 0.4, T0('z6') - 0.6, 48), ('bgm/warm_a.mp3', T0('z6') - 0.8, T0('tX') - 0.2, 70),
        ('bgm/noir_b.mp3', T0('tX') - 0.4, T0('h6') - 0.6, 20), ('bgm/warm_a.mp3', T0('h6') - 0.8, DUR, 0)]
for fn, a0, a1, off in segs: place(fn, max(0, a0), a1 + 1.2, 0.5 if 'warm' not in fn else 0.52, fin=1.0, fout=1.6, off=off)
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
for lid in ['s0', 'i1', 'i4', 'i5', 'i6', 'i7']:
    l = L[lid]; d = l['t1'] - l['t0'] + 0.6; r = lp(bp(noise(d), 400, 9000), 6000) * 0.05; r[:int(0.2 * SR)] *= np.linspace(0, 1, int(0.2 * SR)); r[-int(0.3 * SR):] *= np.linspace(1, 0, int(0.3 * SR)); put(l['t0'] - 0.15, r)
put(T0('s0') + 0.5, crackle(0.9), 0.5)
for i in range(4): put(T0('i1') + 0.15 + i * 0.28, crackle(0.25), 0.6)
put(W('i2', '유사', 1.6) - 0.02, thud(0.4, 80), 1.0)
put(W('i3', '그런데', 0.2), thud(0.3, 110), 0.5); put(W('i3', '멘탈', 0.6), thud(0.3, 110), 0.5); put(W('i3', '박살', 1.2), glass(), 0.8)
put(W('i5', '질러', 0.5), whoosh(0.5), 0.8); put(W('i5', '찢는', 1.6) + 0.4, rip(), 0.6)
put(W('i6', '쓰러', 1.4) + 0.35, thud(0.4, 60), 1.0); put(W('i7', '도망', 1.4), whoosh(0.6), 0.6)
tP = W('i8', '철학자', 2.5)
for i in range(4): put(tP + 0.45 + i * 0.32, whoosh(0.4), 0.25)
put(L['i8']['t1'] + 0.05, chime(), 0.5)
for k in range(int((L['i9']['t1'] - T0('i9')) / 0.5) + 1): put(T0('i9') + k * 0.5, tone(1800, 0.05, 0.02, (1,)) * 0.2)
put(W('i9', '한', 1.2), whoosh(0.4), 0.5)
put(W('i10', '뼈', 1.0), mx(thud(0.25, 140), pop_(500)), 0.8)
for tk in ['tA', 'tB', 'tO', 'tX']:
    t1 = T0(tk); put(t1 + 0.05, tone(988, 0.6, 0.35, (1, 0.3)) * 0.5); put(t1 + 0.45, tone(784, 0.9, 0.5, (1, 0.3)) * 0.5); put(t1 + 0.6, whoosh(0.4), 0.4)
put(T0('a0') + 0.05, creak(1.0), 1.0)
for k in range(5): put(T0('a1') + 0.1 + k * 0.55, heartbeat(), 0.8)
for k in range(3): put(T0('a2') - 0.15 + [0.3, 1.6, 2.9][k], pop_(800 + 200 * k), 0.7)
put(W('d2', '말', 0.8), pop_(1500), 0.6); put(W('d3', '타인', 1.0) - 0.02, thud(0.45, 75), 1.1)
put(W('m1', '마르', 2.0) - 0.35, whoosh(0.5), 0.6); put(W('m1', '마르', 2.0), chime(), 0.6); put(T0('m2') + 0.1, chime(), 0.4)
put(T0('m3') - 0.15, scratch(), 0.9); put(T0('m3'), lp(noise(L['m3']['t1'] - T0('m3')), 500) * 0.08)
put(W('m3', '측근', 1.3), tone(2600, 0.6, 0.3, (1,)) * 0.15); put(W('m3', '덮친', 2.6), thud(0.6, 50), 0.9)
for i, k in enumerate(['팀장', '무슨', '날씨', '당신']): tt = W('m7', k, 0.4 + i * 1.0); put(tt, pop_(600), 0.4); put(tt + 0.9, whoosh(0.5), 0.4)
put(W('m7', '몫', 3.6), clank(), 0.8)
tU = W('m8', '맡깁', 2.0); tt = T0('m8')
while tt < tU: put(tt, beep(), 0.7); tt += 0.36
put(tU + 0.15, mx(pop_(400), snap()), 1.0)
put(W('m10', '떼서', 2.0), mx(snap(), thud(0.15, 220) * 0.4), 1.0); put(W('m10', '연고', 3.4), chime(), 0.5)
for g in ['a9', 'b9', 'o9', 'x9']: put(T0(g) + 1.45, bell(), 0.8)
# B
put(T0('b0') + 0.05, thud(0.5, 70), 1.0); put(T0('b0') + 1.7, thud(0.3, 90), 0.6)
for k in range(3): put(T0('b1') - 0.15 + k * 1.4, whoosh(0.35), 0.5)
put(T0('b1') - 0.15 + 1.4 + 0.5, tone(1568, 0.5, 0.25, (1, 0.3)) * 0.4)
put(W('d4', '지르', 1.4), whoosh(0.5), 0.7)
for k in range(4): put(W('d5', '뒹구', 2.0) + k * 0.35, thud(0.15, 120) * 0.4)
put(W('d6', '감정', 1.0) - 0.02, thud(0.45, 75), 1.1)
put(W('n1', '프리드', 2.0) - 0.35, whoosh(0.5), 0.6); put(W('n1', '프리드', 2.0), chime(), 0.5)
put(W('n3', '아모르', 1.0), chime(), 0.6)
put(W('n4', '마세요', 3.0), rip(0.25), 0.5)
for k in range(4): put(W('n5', '넵넵', 1.4) - 0.3 + k * 0.12, pop_(900 + 150 * k), 0.4)
put(W('n5', '불꽃', 3.0), lp(noise(1.2), 1500) * env(int(1.2 * SR), 0.05, 0.6) * 0.5, 0.7)
put(T0('n6') + 0.4, thud(0.4, 70), 0.8); put(W('n6', '털고', 1.0), bp(noise(0.3), 800, 3000) * 0.3)
# O
for k in range(5): put(T0('o0') + 0.3 + k * 0.5, thud(0.25, 60) * 0.6)
put(T0('o1') + 0.25, whoosh(0.7), 0.7); put(T0('o1') + 1.25, thud(0.5, 55), 1.1)
put(W('d7', '총대', 2.8), whoosh(0.3), 0.5); put(W('d9', '만성', 1.0) - 0.02, thud(0.45, 75), 1.1)
put(W('z1', '장자', 2.0) - 0.35, whoosh(0.8), 0.6); put(W('z1', '장자', 2.0), chime(), 0.5)
put(W('z2', '무용', 0.6), chime(), 0.4)
for k in range(3): put(T0('z3') + 0.2 + k * 0.33, thud(0.12, 300) * 0.5)
put(W('z3', '잘려', 1.8) + 0.65, thud(0.6, 50), 1.0)
put(W('z5', '가라앉', 2.4), lp(noise(1.0), 700) * 0.2)
put(W('z6', '방전', 2.4) - 0.3, pop_(1300), 0.6); put(W('z7', '내려', 2.4) + 0.2, thud(0.5, 60), 0.9)
# AB
put(T0('x0') + 0.1, creak(0.8), 0.6)
for k in range(3): put(T0('x0') + 1.2 + k * 0.25, bp(noise(0.18), 2000, 9000) * env(int(0.18 * SR), 0.005, 0.08) * 0.8)
put(W('X1', '벽', 2.8), thud(0.4, 80), 0.6); put(W('d10', '선을', 3.6), bp(noise(0.5), 1500, 6000) * 0.15)
put(W('d12', '자발', 1.0) - 0.02, thud(0.45, 75), 1.1)
put(W('h1', '쇼펜', 2.0) - 0.35, whoosh(0.5), 0.6); put(W('h1', '쇼펜', 2.0), chime(), 0.5); put(W('h2', '고슴', 0.6), chime(), 0.4)
put(W('h4', '찔리', 0.9), mx(pop_(1600), snap()), 0.8)
put(W('h5', '온기', 3.4), chime(), 0.4)
# outro
put(T0('e0') + 1.0, crackle(0.6), 0.4); put(W('e3', '여기', 4.2), chime(), 0.5); put(W('e5', '구독', 3.6) - 0.3, pop_(1000), 0.5)
mix = voice * 1.0 + bed + sfx * 0.55
sf.write('mix_raw_b.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'mix_raw_b.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), 'mix_b.wav'], check=True)
print('dur', round(DUR, 2), 'peak raw', round(float(np.abs(mix).max()), 2))
