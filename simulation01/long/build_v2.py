"""v2 샘플 믹스: 목소리 + 배경음(장면별, 덕킹) + 합성 효과음 → mix_v2.wav (loudnorm -14).
연출 기준 v3: 효과음은 1초에 하나까지, 대사와 겹치면 0.3초씩 뒤로(최대 0.9초) 미룬다. 효과음은 모두 직접 합성."""
import json, os, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, lfilter
os.chdir(os.path.dirname(os.path.abspath(__file__)))
SR = 44100; rng = np.random.default_rng(31)
TL = json.load(open('timeline_v2.json')); L = {l['id']: l for l in TL['lines']}; DUR = TL['duration']; N = int(DUR * SR)
voice, _ = sf.read('voice_v2.wav', dtype='float32'); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
act = np.convolve((np.abs(voice) > 0.012).astype(float), np.ones(int(0.3 * SR)) / int(0.3 * SR), 'same')
def W(lid, key, fb=0.0):
    l = L[lid]
    for w in l.get('words', []):
        if key in w['w'].replace(' ', ''): return l['t0'] - 0.15 + w['t'] + 0.12
    return l['t0'] - 0.15 + fb
T0 = lambda k: L[k]['t0']; T1 = lambda k: L[k]['t1']; LT = lambda k, x: L[k]['t0'] - 0.15 + x
D_ = lambda k: L[k]['t1'] - L[k]['t0'] + 0.15
def load(fn, start, dur):
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', fn, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    a = np.frombuffer(raw, np.float32).copy()[int(start * SR):]; n = int(dur * SR)
    while len(a) < n: a = np.concatenate([a, a])
    return a[:n]
bed = np.zeros(N); sfx = np.zeros(N); amb = np.zeros(N)
def place(fn, t0, t1, g, fin=1.0, fout=1.5, off=0.0):
    i0, i1 = int(max(0, t0) * SR), min(N, int(t1 * SR)); a = load(fn, off, (i1 - i0) / SR) * g
    a[:int(fin * SR)] *= np.linspace(0, 1, int(fin * SR))[:len(a)]; k = min(len(a), int(fout * SR)); a[-k:] *= np.linspace(1, 0, k)
    bed[i0:i0 + len(a)] += a
placed = []
def put(t, w, g=1.0, buf=None, dodge=True, free=False):
    """free=True: ambience-like, skips the one-per-second rule."""
    if dodge:   # don't land on a spoken word: push 0.3 s at a time (max 0.9 s)
        for _ in range(3):
            i = int(t * SR)
            if 0 <= i < N and act[i] > 0.5 and np.abs(w[:int(0.15 * SR)]).max() > 0.3: t += 0.3
            else: break
    if not free:
        placed.append(t)
    b = sfx if buf is None else buf; i = int(t * SR)
    if i < 0 or i >= N: return
    w = w[:N - i]; b[i:i + len(w)] += w * g
def env(n, a=0.002, d=0.2): t = np.arange(n) / SR; return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
def bp(x, lo, hi): b, a = butter(2, [lo / (SR / 2), min(0.99, hi / (SR / 2))], 'band'); return lfilter(b, a, x)
def lp(x, f): b, a = butter(2, f / (SR / 2)); return lfilter(b, a, x)
def noise(d): return rng.standard_normal(int(d * SR))
def mx(*xs):
    n = max(len(x) for x in xs); o = np.zeros(n)
    for x in xs: o[:len(x)] += x
    return o
def tone(f, d, dec=0.4, h=(1, 0.4, 0.2)): t = np.arange(int(d * SR)) / SR; return sum(a * np.sin(2 * np.pi * f * (i + 1) * t) for i, a in enumerate(h)) * env(len(t), 0.004, dec)
def thud(d=0.35, f=70): t = np.arange(int(d * SR)) / SR; return mx(np.sin(2 * np.pi * f * t * (1 - t)) * env(len(t), 0.002, 0.09), lp(noise(d), 900)[:len(t)] * env(len(t), 0.001, 0.03) * 0.6)
def boom(d=1.6, f=48): t = np.arange(int(d * SR)) / SR; return mx(np.sin(2 * np.pi * f * t * (1 - 0.25 * t)) * env(len(t), 0.004, 0.45), lp(noise(d), 300)[:len(t)] * env(len(t), 0.002, 0.25) * 0.5)
def whoosh(d=0.35): n = noise(d); return bp(n, 600, 5000) * np.sin(np.linspace(0, np.pi, len(n))) ** 2 * 0.6
def blip(f0=1200, f1=1700, d=0.07): t = np.arange(int(d * SR)) / SR; return np.sin(2 * np.pi * (f0 + (f1 - f0) * t / d) * t) * env(len(t), 0.001, 0.03)
def pop_(f=900): t = np.arange(int(0.08 * SR)) / SR; return np.sin(2 * np.pi * f * t * (1 + 3 * t)) * env(len(t), 0.001, 0.025)
def ding(f=1320): return tone(f, 0.9, 0.3, (1, 0.5, 0.25, 0.1))
def chime(f=1046): return mx(ding(f) * 0.6, ding(f * 1.25) * 0.4, ding(f * 1.5) * 0.3)
def keyclick(): return mx(bp(noise(0.03), 1500, 6000) * env(int(0.03 * SR), 0.0003, 0.006) * 1.2, tone(rng.uniform(380, 520), 0.03, 0.01, (1,)) * 0.15)
def step(): return bp(noise(0.07), 150, 1500) * env(int(0.07 * SR), 0.001, 0.02) * 1.4
def glitch(d=0.35):
    n = int(d * SR); out = np.zeros(n); i = 0
    while i < n:
        seg = int(SR * rng.uniform(0.012, 0.04)); hold = int(rng.integers(8, 90)); src = rng.standard_normal(seg // hold + 2)
        x = np.repeat(src, hold)[:seg] * (rng.random() > 0.25) * rng.uniform(0.4, 1.0); out[i:i + seg] = x[:max(0, min(seg, n - i))]; i += seg
    out = bp(out, 200, 9000) * 0.55
    for _ in range(3):
        f = rng.uniform(1800, 4200); s = int(rng.uniform(0, d * 0.7) * SR); b = tone(f, 0.05, 0.02, (1,)) * 0.25; out[s:s + len(b)] += b[:max(0, n - s)]
    return out * np.minimum(1, np.linspace(0, 1, n) * 40)
def sweep(d=1.3, f0=300, f1=2600):
    t = np.arange(int(d * SR)) / SR; f = f0 * (f1 / f0) ** (t / d); ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) * 0.35 + bp(noise(d), 2000, 8000)[:len(t)] * 0.15) * np.sin(np.pi * t / d) ** 1.5
def chirp():
    d = rng.uniform(0.06, 0.12); t = np.arange(int(d * SR)) / SR; f0 = rng.uniform(3000, 4500); f = f0 + rng.uniform(-1500, 1500) * t / d + 300 * np.sin(2 * np.pi * 40 * t)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) * 0.15
def buzz(d=0.5): t = np.arange(int(d * SR)) / SR; return np.sin(2 * np.pi * 160 * t) * (np.sin(2 * np.pi * 9 * t) > 0) * 0.35 * np.minimum(1, t * 40)
def boing(): t = np.arange(int(0.35 * SR)) / SR; return np.sin(2 * np.pi * (300 + 500 * t) * t + 3 * np.sin(2 * np.pi * 12 * t)) * env(len(t), 0.003, 0.12) * 0.5
def plop(): t = np.arange(int(0.12 * SR)) / SR; return np.sin(2 * np.pi * (220 - 500 * t) * t) * env(len(t), 0.002, 0.04)   # 퐁 (landing)
def heartbeat(): return np.concatenate([thud(0.18, 55) * 0.9, np.zeros(int(0.08 * SR)), thud(0.22, 50) * 0.7])
def clink(): return mx(tone(2400, 0.5, 0.12, (1, 0.6, 0.3)), tone(3300, 0.4, 0.08, (1,)) * 0.5) * 0.6
def bell(): return mx(tone(1760, 1.2, 0.35, (1, 0.5)), tone(2217, 1.0, 0.3, (1,)) * 0.6, tone(1760, 1.0, 0.3, (1,)) * 0.0)
def scrape(d=0.35): n = noise(d); return bp(n, 300, 1800) * np.sin(np.linspace(0, np.pi, len(n))) * 0.5
def scribble(d): n = noise(d); g = (0.5 + 0.5 * np.sin(np.linspace(0, d * 2 * np.pi * 7, len(n)))) ** 2; return bp(n, 2500, 8000) * g * 0.22
def street(t0, t1, g=1.0):
    put(t0, lp(noise(max(0.1, t1 - t0)), 500) * 0.05 * g, 1, amb, dodge=False, free=True)
    tt = t0 + 0.3
    while tt < t1 - 0.2: put(tt, chirp(), g, amb, dodge=False, free=True); tt += rng.uniform(0.4, 2.2)

# ---------------- music ----------------
place('bgm/tiny_a.mp3', 0.0, T0('s1') - 0.1, 0.34, fin=0.8, fout=0.6)
place('bgm/warm_a.mp3', T0('s1') - 0.3, LT('f0', 0.3), 0.30, fin=0.4, fout=0.12, off=6)        # cut dead at the whip
place('bgm/tense_a.mp3', LT('f0', 1.6), T1('t0') + 0.4, 0.40, fin=1.2, fout=0.8)
place('bgm/myst_a.mp3', T0('n3') - 0.3, T1('z2') + 0.8, 0.30, fin=0.6, fout=1.0, off=20)
place('bgm/cosmic_a.mp3', T0('n5') - 0.6, T1('z3') + 1.0, 0.40, fin=1.5, fout=1.2, off=4)
place('bgm/tense_b.mp3', T0('n8') - 0.6, LT('z5', 0.0), 0.36, fin=1.0, fout=0.3)               # drops out right before "넌 진짜야?"
place('bgm/hollow_a.mp3', T0('s4') - 0.3, DUR, 0.40, fin=1.8, fout=2.0)
bed *= (1.0 - 0.78 * np.clip(act * 2.0, 0, 1))

# ---------------- ambience ----------------
put(0, lp(noise(T0('s1')), 300) * 0.025, 1, amb, dodge=False, free=True)                 # quiet room at night
street(T0('s1') - 0.2, T1('t0'), 1.0)
street(T0('n3') - 0.2, T1('z2') + 0.3, 1.2)
put(T0('n5') - 0.3, lp(noise(T1('z3') - T0('n5') + 1.0), 300) * 0.025, 1, amb, dodge=False, free=True)
def chatter(t0, t1):   # bunsik: pans sizzling, the odd dish clink (no voices)
    n = noise(t1 - t0); put(t0, bp(n, 2500, 9000) * (0.6 + 0.4 * np.abs(np.sin(np.linspace(0, (t1 - t0) * 37, len(n))))) * 0.05, 1, amb, dodge=False, free=True)
    tt = t0 + 0.8
    while tt < t1 - 0.5: put(tt, tone(rng.uniform(2600, 3600), 0.2, 0.05, (1, 0.4)) * 0.15, 1, amb, dodge=False, free=True); tt += rng.uniform(1.5, 3.5)
chatter(T0('n8') - 0.4, DUR)

# ---------------- sfx ----------------
for i in range(14): put(LT('o0', 0.05 + i * 0.085), keyclick(), 0.45, free=True)
put(LT('o0', 1.25), whoosh(0.3), 0.4)
tT = W('o1', '이렇게', 1.0)
for i in range(10): put(tT + i * 0.09, keyclick(), 0.35, free=True, dodge=False)
put(T0('o2') - 0.15 + 0.2, blip(1400, 1900, 0.08), 0.5)
for k in range(5): put(T0('s1') + k * 0.15, step(), 0.45, free=True, dodge=False)
put(LT('s2', D_('s2') * 0.72 + 0.2), thud(0.3, 60), 0.5)                                     # the smile drains
put(LT('f0', 0.25), whoosh(0.3), 0.8); put(LT('f0', 0.31), glitch(0.42), 1.1)                 # 치직
put(LT('f0', 0.66 + 4 / 24), boing(), 0.5, dodge=False); put(LT('f0', 0.66 + 13 / 24), plop(), 0.6, dodge=False)
put(LT('f0', 0.76), ding(1760), 0.35, dodge=False)                                           # !!
put(W('n1', '가짜', 2.0), glitch(0.12), 0.45)
put(W('n2', '정해진', 1.5), blip(900, 1200, 0.08), 0.5)
put(T0('t0') - 0.15, glitch(0.35), 0.9); put(T0('t0') - 0.1, boom(1.6, 44), 0.7)
put(W('n3', '의심', 1.5), tone(700, 0.3, 0.1, (1, 0.5)) * np.linspace(1, 0.3, int(0.3 * SR)), 0.4)   # 띠용-ish
tt = T0('p1')
while tt < LT('p1', 0.45): put(tt, bp(noise(0.02), 1500, 6000) * env(int(0.02 * SR), 0.0003, 0.004) * 0.8, 0.6, free=True, dodge=False); tt += rng.uniform(0.12, 0.3)
put(LT('p1', 0.85), ding(1568), 0.45, dodge=False); put(LT('p1', 1.2), blip(900, 1400, 0.09), 0.5)
put(W('z1', '붙여', 1.0) + 0.3, thud(0.4, 52), 0.4)
xs = [w['t'] + 0.12 for w in L['n4']['words'] if any(k in w['w'] for k in ('홱', '획', '휙', '왜'))] or [0.6]
for x in [T0('n4') - 0.15 + xs[0], W('n4', '그려졌', 3.0) - 0.2]: put(x, whoosh(0.25), 0.6, dodge=False); put(x + 0.06, glitch(0.3), 0.55, dodge=False)
put(T0('p2'), buzz(0.45), 0.7); put(T0('p2') + 0.6, buzz(0.45), 0.6, free=True)
put(LT('z2', 0.45), thud(0.12, 200), 0.4, dodge=False)                                       # phone face-down
for i in range(9): put(LT('n5', 0.3 + i * 0.18), keyclick(), 0.3, free=True)
put(W('n5', '2003', 4.5) - 0.2, whoosh(0.4), 0.4); put(W('n5', '보스트롬', 6.0) + 0.3, pop_(1000), 0.3)
t1_, t2_, t3_ = W('n6', '컴퓨터', 1.0), W('n6', '없이', 3.0), W('n6', '수십', 7.0)
for i in range(8): put(t1_ + i * 0.07, blip(1100 + i * 60, 1500 + i * 60, 0.06), 0.3, free=True, dodge=False)
for i in range(16): put(t2_ + i * 0.05, blip(1500 + i * 40, 1900 + i * 40, 0.04), 0.18, free=True, dodge=False)
for key, fb in (('사라지', 4), ('만들지', 7), ('아니면', 9)): put(W('n7', key, fb), thud(0.25, 110), 0.5)
put(W('z3', '만들었', 1.2), sweep(1.8, 1600, 300) * 0.6, 0.5, dodge=False)
put(LT('n8', 0.3), mx(scrape(0.35), thud(0.2, 90) * 0.5), 0.6)                               # sits down
put(W('n8', '확인', 1.2) + 0.15, mx(bp(noise(0.4), 300, 3000) * env(int(0.4 * SR), 0.01, 0.15) * 0.6, tone(180, 0.4, 0.15, (1,)) * 0.3), 0.5)   # flame eyes 'fwoomp'
put(W('n8', '정해진', 3.0), scribble(2.6), 0.9, free=True, dodge=False)
put(T0('r1'), heartbeat(), 0.7, dodge=False)
put(W('z5', '진짜', 0.5) + 0.25, thud(0.45, 48), 0.55)                                       # zoom punch
put(LT('r2', 0.8), clink(), 0.7, dodge=False); put(LT('r2', 0.2), heartbeat(), 0.6, free=True, dodge=False)
put(LT('r3', 0.15), scrape(0.4), 0.6, dodge=False)
for k in range(4): put(LT('r3', 0.8 + k * 0.32), step(), 0.4, free=True, dodge=False)
put(LT('r3', 2.2), bell(), 0.35, dodge=False)                                                # the door bell
amb *= (1.0 - 0.7 * np.clip(act * 2.0, 0, 1))   # ambience also steps back under dialogue
mix = voice * 1.0 + bed + sfx * 0.5 + amb * 0.6
k = int(1.2 * SR); mix[-k:] *= np.linspace(1, 0, k)
sf.write('mix_raw_v2.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'mix_raw_v2.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), 'mix_v2.wav'], check=True)
print('dur', round(DUR, 2))
