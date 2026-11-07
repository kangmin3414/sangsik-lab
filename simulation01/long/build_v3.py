"""v3 샘플 믹스(2판: 대사 평준화는 gen_tl_v3.py, p3 아래 음악·소리 추가 감쇠): 목소리 + 배경음(장면별, 덕킹) + 합성 효과음 → mix_v2.wav (loudnorm -14).
연출 기준 v3: 효과음은 1초에 하나까지, 대사와 겹치면 0.3초씩 뒤로(최대 0.9초) 미룬다. 효과음은 모두 직접 합성."""
import json, os, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, lfilter
os.chdir(os.path.dirname(os.path.abspath(__file__)))
SR = 44100; rng = np.random.default_rng(31)
TL = json.load(open('timeline_v3.json')); L = {l['id']: l for l in TL['lines']}; DUR = TL['duration']; N = int(DUR * SR)
voice, _ = sf.read('voice_v3.wav', dtype='float32'); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
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
place('bgm/tiny_a.mp3', 0.0, T0('m1') - 0.1, 0.34, fin=0.6, fout=0.6)
place('bgm/warm_a.mp3', T0('m1') - 0.3, LT('m2', 0.15), 0.30, fin=0.3, fout=0.12, off=6)          # cut dead when he freezes
place('bgm/tense_a.mp3', T0('m3') - 0.3, T1('t0') + 0.4, 0.38, fin=1.0, fout=0.8)
place('bgm/myst_a.mp3', T0('u1') - 0.3, T1('u2') + 0.3, 0.28, fin=0.6, fout=0.6, off=10)
place('bgm/warm_a.mp3', T0('u3') - 0.2, LT('u5', 0.1), 0.32, fin=0.4, fout=0.1, off=40)
place('bgm/cosmic_a.mp3', T0('b1') - 0.5, T1('b2') + 0.8, 0.38, fin=1.2, fout=1.0, off=4)
place('bgm/myst_a.mp3', T0('p1') - 0.3, LT('p8', 0.0), 0.30, fin=0.6, fout=0.15, off=40)            # stops for the second laugh
place('bgm/hollow_a.mp3', T0('p9') - 0.1, DUR, 0.40, fin=1.5, fout=1.5)
bed *= (1.0 - 0.78 * np.clip(act * 2.0, 0, 1))
def dip(buf, t0, t1, g, r=0.25):   # extra dip under one line (p3: the joke must sit on top)
    i0, i1 = int(t0 * SR), int(t1 * SR); e = np.ones(N); e[i0:i1] = g; k_ = int(r * SR); e[max(0, i0 - k_):i0] = np.linspace(1, g, i0 - max(0, i0 - k_)); e[i1:i1 + k_] = np.linspace(g, 1, len(e[i1:i1 + k_])); buf *= e
dip(bed, T0('p3') - 0.1, T1('p3') + 0.1, 0.55)

# ---------------- ambience ----------------
put(0, lp(noise(T0('m1')), 300) * 0.025, 1, amb, dodge=False, free=True)
street(T0('m1') - 0.2, T1('t0'), 1.0)
put(T0('u1') - 0.3, lp(noise(T1('u2') - T0('u1') + 0.6), 300) * 0.025, 1, amb, dodge=False, free=True)
street(T0('u3') - 0.2, T1('u6') + 0.2, 1.1)
put(T0('b1') - 0.3, lp(noise(T1('b2') - T0('b1') + 0.6), 300) * 0.025, 1, amb, dodge=False, free=True)
def chatter(t0, t1):
    n = noise(t1 - t0); put(t0, bp(n, 2500, 9000) * (0.6 + 0.4 * np.abs(np.sin(np.linspace(0, (t1 - t0) * 37, len(n))))) * 0.05, 1, amb, dodge=False, free=True)
chatter(T0('p3') - 0.2, T1('p10') + 0.2)
put(T0('p11') - 0.2, lp(noise(T1('p11') - T0('p11') + 1.0), 300) * 0.025, 1, amb, dodge=False, free=True)

# ---------------- sfx ----------------
for i in range(18): put(LT('c1', 0.05 + i * 0.13), keyclick(), 0.14, free=True, dodge=False)
put(LT('c1', 0.92), buzz(0.65), 0.45, dodge=False)                       # the phone on the desk: 999+
tTap = W('c1', '소라', 3.5) + 0.45; put(tTap, pop_(1100), 0.35, dodge=False, free=True); put(tTap + 0.62, blip(1300, 1800, 0.07), 0.4, dodge=False, free=True)   # opens her room, sends 'ㅇㅋ'
put(LT('c2', 1.6), thud(0.12, 220), 0.45, dodge=False, free=True)        # lays the phone face down
for i in range(22): put(LT('c3', 0.1 + i * 0.075), keyclick(), 0.35, free=True, dodge=False)
put(LT('c3', 1.85), blip(1400, 1900, 0.08), 0.5, dodge=False)
for k in range(6): put(T0('m1') - 0.1 + k * 0.15, step(), 0.45, free=True, dodge=False)
put(LT('m1', 1.0 + 0.9), glitch(0.14), 0.4, dodge=False)
put(LT('m2', 0.1), thud(0.4, 52), 0.6, dodge=False); put(LT('m2', 0.95), mx(tone(900, 0.12, 0.04, (1,)) * 0.3, lp(noise(0.08), 2000) * env(int(0.08 * SR), 0.001, 0.02)), 0.5, dodge=False)   # the coffee drop
put(T0('m3') - 0.55, whoosh(0.35), 0.35, dodge=False); put(LT('m3', 1.95), glitch(0.12), 0.3, dodge=False, free=True)
put(T0('t0') - 0.15, glitch(0.35), 0.9, dodge=False); put(T0('t0') - 0.1, boom(1.6, 44), 0.7, dodge=False)
TXT1 = len('내일 소라는 노란 우산을 쓰고 온다.')
tT = W('u1', '시험', 3.0) - 0.1
for i in range(TXT1): put(tT + i * 2.2 / TXT1, keyclick(), 0.35, free=True)
put(LT('u2', 0.55), pop_(1200), 0.4, dodge=False); put(LT('u2', 1.45), chime(1568), 0.3, dodge=False)
for k in range(9): put(LT('u3', 1.0 + k * 0.27), step() * 0.6, 0.08 + 0.3 * k / 8, free=True, dodge=False)   # far away → closer
put(LT('u5', 0.1 + 4 / 24), boing(), 0.55, dodge=False); put(LT('u5', 0.1 + 13 / 24), plop(), 0.6, dodge=False)
put(LT('u5', 0.1 + 0.95), mx(thud(0.3, 70), clink() * 0.5), 0.7, dodge=False); put(LT('u5', 1.05), glitch(0.18), 0.6, dodge=False)
put(T0('u6') - 0.1, heartbeat(), 0.6, dodge=False)
for i in range(8): put(LT('b1', 0.2 + i * 0.16), keyclick(), 0.3, free=True)
put(LT('b1', 1.7), pop_(1000), 0.35, dodge=False, free=True); put(LT('b1', 3.7) - 0.1, whoosh(0.35), 0.3);
for i in range(3): put(W('b1', '컴퓨터', 8.2) + i * 0.16, pop_(700 + 150 * i), 0.25, dodge=False, free=True)
put(W('b1', '없이', 7.0), sweep(1.6, 1800, 300) * 0.6, 0.4, dodge=False)
per = (D_('p1') - 1.4) / 3
for n_, txt in enumerate(('소라는 지각하지 않는다.', '소라는 내 이모티콘에 답한다.', '소라는 오늘 기분이 좋다.')):
    put(LT('p1', 1.4 + n_ * per), scrape(0.12) * 0.6, 0.35, dodge=False, free=True)   # the date chip flips
    for i in range(len(txt)): put(LT('p1', 1.4 + n_ * per + i * per * 0.75 / len(txt)), keyclick(), 0.3, free=True, dodge=False)
for lid, txt in (('p2', '소라는 제로의 농담에 크게 웃는다.'), ('p5', '소라는 오늘 떡볶이를 산다.')):
    n = len(txt); d = D_(lid) - 0.4
    for i in range(n): put(LT(lid, i * d / n), keyclick(), 0.35, free=True, dodge=False)
put(W('p3', '왕이', 1.0) - 0.1, pop_(800), 0.3, dodge=False, free=True)   # the thought bubble
put(W('p3', '넘어', 1.7) + 0.6, plop() * 0.8, 0.45)                         # the pixel king falls (in the pause)
tK = W('p3', '킹콩', 2.0) + 0.55   # ba-dum-tss after the punchline
put(tK, thud(0.15, 120), 0.5); put(tK + 0.16, thud(0.15, 90), 0.5, free=True); put(tK + 0.34, bp(noise(0.5), 5000, 12000) * env(int(0.5 * SR), 0.002, 0.18) * 0.6, 0.6, free=True)
def tableslap(): return mx(thud(0.1, 140) * 0.8, bp(noise(0.05), 800, 5000) * env(int(0.05 * SR), 0.0005, 0.012) * 0.7)
for lid in ('p4', 'p8'):   # the same four slaps both times
    for s0 in (0.45, 0.8, 1.15, 1.5): put(LT(lid, s0), tableslap(), 0.32, dodge=False, free=True)
rw = sweep(0.14, 2600, 500); put(LT('p8', 0.0), rw * 0.8, 0.45, dodge=False, free=True)   # the 2-frame rewind tear
put(LT('p6', 0.25), mx(thud(0.12, 160), bp(noise(0.06), 1500, 6000) * env(int(0.06 * SR), 0.0005, 0.015)), 0.7, dodge=False)   # card slap
put(T0('p9'), tone(2200, 0.25, 0.08, (1,)) * 0.3, 0.5, dodge=False)
put(LT('p11', 0.5), whoosh(0.25), 0.5, dodge=False); put(LT('p11', 0.55), glitch(0.4), 0.8, dodge=False); put(LT('p11', 1.68), thud(0.3, 90), 0.8, dodge=False)
amb *= (1.0 - 0.7 * np.clip(act * 2.0, 0, 1)); dip(amb, T0('p3') - 0.1, T1('p3') + 0.1, 0.4)
mix = voice * 1.0 + bed + sfx * 0.5 + amb * 0.6
k = int(1.2 * SR); mix[-k:] *= np.linspace(1, 0, k)
sf.write('mix_raw_v3.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'mix_raw_v3.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), 'mix_v3.wav'], check=True)
print('dur', round(DUR, 2))
