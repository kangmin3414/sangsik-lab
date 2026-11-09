"""축의금 편 믹스: 목소리 + 배경음(덕킹) + 합성 효과음 -> mix_gf{tag}.wav (loudnorm -14)"""
import os, sys
TAG = os.environ.get('TAG', '_sample'); TLF = f'timeline_gf{TAG}.json'; VF = f'voice_gf{TAG}.wav'
import json, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, lfilter
SR = 44100; rng = np.random.default_rng(7)
def mx(*ws):
    n = max(len(w) for w in ws); return sum(np.pad(w, (0, n - len(w))) for w in ws)
TL = json.load(open('' + TLF + '')); L = {l['id']: l for l in TL['lines']}; DUR = TL['duration']; N = int(DUR * SR)
voice, _ = sf.read('' + VF + '', dtype='float32'); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
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
A = lambda k: L[k]['t0'] - 0.15
E1 = lambda k: L[k]['t1']
# ---------- 배경음 ----------
place('bgm/calc2.mp3', 0.2, T0('sd') - 0.05, 0.30, fin=0.8, fout=0.12, off=0)        # 훅·재미 (어이없음 직전에 뚝)
place('bgm/calc2.mp3', T0('n3') - 0.35, E1('b3') + 0.25, 0.27, fin=0.5, fout=0.6, off=34)  # 정보 → 도장
def trail_sum(x, k): c = np.concatenate([[0.0], np.cumsum(x)]); i = np.arange(len(x)); return c[i + 1] - c[np.maximum(0, i + 1 - k)]
vad = (np.abs(voice) > 0.006).astype(float)
act = (trail_sum(vad, int(0.5 * SR)) > 0) | (trail_sum(vad[::-1], int(0.15 * SR))[::-1] > 0)   # hold 0.5 s after speech, lead 0.15 s
k = int(0.12 * SR); act = trail_sum(act.astype(float), k) / k
bed *= (1.0 - 0.72 * act)
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
def whistle(d=0.35): t = np.arange(int(d * SR)) / SR; return np.sin(2 * np.pi * (2600 + 60 * np.sin(2 * np.pi * 28 * t)) * t) * env(len(t), 0.005, 0.25) * 0.35
def ding(): return mx(tone(1568, 0.5, 0.25, (1, 0.3)) * 0.45, tone(2093, 0.4, 0.2, (1,)) * 0.25)
def slide_down(d=1.0): t = np.arange(int(d * SR)) / SR; f = 520 * (1 - 0.7 * t / d); return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.02, 0.6) * 0.3
def tape_stop(d=0.7): t = np.arange(int(d * SR)) / SR; f = 220 * np.exp(-t * 3); return np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.08 * (1 - t / d)

def bwoop(): t = np.arange(int(0.22 * SR)) / SR; f = 520 * (1 - 0.45 * t / 0.22); return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.004, 0.12) * 0.35
def gurgle(d=1.0):
    t = np.arange(int(d * SR)) / SR; f = 90 + 40 * np.sin(2 * np.pi * 3.1 * t) + 25 * np.sin(2 * np.pi * 7.3 * t)
    w = np.sin(2 * np.pi * np.cumsum(f) / SR) * (0.6 + 0.4 * np.sin(2 * np.pi * 11 * t)) + lp(noise(d), 300)[:len(t)] * 0.5
    return w * np.sin(np.linspace(0, np.pi, len(t))) ** 0.7 * 0.5
def fanfare(): return mx(*[np.pad(tone(f, 0.5, 0.3, (1, 0.5, 0.25)) * 0.35, (int(i * 0.09 * SR), 0)) for i, f in enumerate([784, 988, 1175, 1568])])
def step(): return bp(noise(0.05), 200, 1200) * env(int(0.05 * SR), 0.001, 0.015)
def splash(): return bp(noise(0.4), 600, 5000) * env(int(0.4 * SR), 0.003, 0.12) * 0.6
def snore(d=1.2): t = np.arange(int(d * SR)) / SR; return lp(noise(d), 500)[:len(t)] * np.sin(np.pi * t / d) ** 2 * 0.25

def tick_(f=1500, g=1.0): return tone(f, 0.05, 0.02, (1,)) * 0.3 * g
def flap(): return mx(bp(noise(0.06), 300, 2500) * env(int(0.06 * SR), 0.001, 0.018), thud(0.08, 180) * 0.3)   # 슬리퍼 탁
def zap(): t = np.arange(int(0.5 * SR)) / SR; return bp(noise(0.5), 1500, 9000) * env(len(t), 0.002, 0.12) * 0.9 + np.sign(np.sin(2 * np.pi * 70 * t)) * env(len(t), 0.002, 0.15) * 0.15
def suck(): t = np.arange(int(0.3 * SR)) / SR; f = 300 + 1600 * (t / 0.3) ** 2; return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.01, 0.12) * 0.4
def sparkle(): return mx(chime() * 0.6, tone(2637, 0.6, 0.3, (1,)) * 0.15)
def click(): return mx(snap() * 0.8, thud(0.12, 400) * 0.4)
def hum(d): t = np.arange(int(d * SR)) / SR; return (np.sin(2 * np.pi * 120 * t) * 0.5 + np.sin(2 * np.pi * 240 * t) * 0.25) * 0.06 * np.minimum(1, t / 0.2)
def clink(): return mx(tone(2400, 0.25, 0.08, (1, 0.5)) * 0.35, tone(3100, 0.2, 0.06, (1,)) * 0.2)
def scribble(d=0.6): n = noise(d); t = np.arange(len(n)) / SR; return bp(n, 1800, 6000) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 9 * t))) * 0.35
def rattle(d=0.9): t = np.arange(int(d * SR)) / SR; return bp(noise(d), 800, 4000) * (np.sin(2 * np.pi * 18 * t) > 0) * 0.4
def key_(): return mx(snap() * 0.45, tone(1900, 0.04, 0.012, (1,)) * 0.35, thud(0.05, 260) * 0.2)
def jingle(): return mx(*[np.pad(tone(f, 0.5, 0.18, (1, 0.6, 0.3)) * 0.25, (int(i * 0.045 * SR), 0)) for i, f in enumerate([2637, 3136, 2349, 3520, 2794])])
def crickets(d=1.3):
    t = np.arange(int(d * SR)) / SR; g = (np.sin(2 * np.pi * 26 * t) > 0.2) * (np.sin(2 * np.pi * 1.6 * t) > -0.2)
    return np.sin(2 * np.pi * 4300 * t) * g * 0.12 * np.sin(np.linspace(0, np.pi, len(t)))
def roll(d=1.0):
    s = np.zeros(int(d * SR)); n = int(d / 0.055)
    for k in range(n): w = thud(0.12, 85) * (0.25 + 0.75 * k / n); i = int(k * 0.055 * SR); s[i:i + len(w)] += w[:len(s) - i]
    return s
# ---------- 훅: 스탠드 딸깍, 계산기 ----------
put(A('s0') + 0.15, bp(noise(0.5), 600, 5000) * env(int(0.5 * SR), 0.05, 0.18), 0.3)   # 청첩장 종이 스침
for x in [1.12, 1.27, 1.42, 1.57, 1.69]: put(A('sc') + x, key_(), 0.7)
put(A('z1') - 0.02, key_(), 0.6)
for x in [0.55, 0.7, 0.85, 1.0, 1.12]: put(A('z1') + x, key_(), 0.35)   # 말 위로는 작게
tM = W('z1', '마이너스', 5.08); put(tM - 0.05, key_(), 0.85); put(tM, bwoop(), 0.5)
put(W('z1', '25', 5.94) + 0.25, mx(pop_(1800), bp(noise(0.12), 2000, 7000) * env(int(0.12 * SR), 0.002, 0.04)), 0.35)   # 땀 한 방울
# 청첩장: 형광펜, 빨간 동그라미
put(W('n1', '민재', 0.78) - 0.05, scribble(0.35), 0.3); put(W('n1', '3년', 4.06) - 0.05, scribble(0.5), 0.35)
# ---------- 짤랑! 본전이 ----------
put(A('s1') + 0.2, rattle(0.55), 0.45)
put(A('s1') + 0.74, jingle(), 0.8); put(A('s1') + 0.76, whoosh(0.45), 0.4)
put(A('s1') + 1.22, mx(pop_(700), thud(0.12, 220) * 0.5), 0.5); put(A('s1') + 1.3, pop_(1500), 0.3)
put(A('b1') + 0.05, mx(clank() * 0.6, hum(0.8) * 3), 0.45)
put(W('b1', '5만', 0.6) - 0.1, pop_(1000), 0.4); put(W('b1', '10만', 2.1) - 0.1, pop_(1250), 0.4)
tQ = W('b1', '그것이', 2.94); put(tQ, roll(E1('b1') - tQ), 0.45); put(E1('b1') + 0.02, mx(thud(0.4, 60), clank() * 0.4), 0.5)
# ---------- 지갑 속 ----------
for k in range(6): put(A('n2') + 0.25 + k * 0.17, mx(step(), tone(2600, 0.03, 0.01, (1,)) * 0.2), 0.25)
put(A('n2') + 0.5, pop_(1100), 0.3); put(A('n2') + 1.78, mx(clink(), thud(0.15, 320) * 0.4), 0.5); put(A('n2') + 2.35, clink(), 0.25)
# ---------- 원그래프 ----------
put(W('b2', '하나', 0.42) - 0.12, whoosh(0.2), 0.35)
tP = W('b2', '확률', 2.16)
for x in (0.8, 0.52, 0.24): put(tP - x - 0.05, whoosh(0.15), 0.2); put(tP - x + 0.22, mx(key_(), thud(0.14, 160) * 0.8, beep() * 0.6), 0.8)   # 쿵쿵쿵(키 밟기)
put(tP - 0.1, pop_(900), 0.4)
tPl = W('b2', '계획', 4.58); tt = tP + 0.05; gap = 0.06
while tt < tPl + 0.35: put(tt, tick_(2200, 0.5)); tt += gap; gap *= 1.04
put(tPl + 0.05, slide_down(0.6), 0.5)
# 어이없음: 귀뚜라미
put(A('sd') + 0.15, crickets(1.4), 0.9)
# ---------- 정보 ----------
put(A('n3') + 0.05, whoosh(0.35), 0.35)
tB = W('n3', '밥값', 0.46)
for k in range(14): put(tB + 0.15 + k * 0.055, tick_(1700, 0.35))
put(tB + 0.95, ding(), 0.35)
put(W('n3', '줄고', 3.46), rip(0.3), 0.3); put(W('n3', '늘고', 5.4), mx(rip(0.3), pop_(1200)), 0.3)
# ---------- 도장 ----------
put(W('b3', '결론', 0.0) - 0.05, whoosh(0.25), 0.4)
put(W('b3', '손해', 1.9) - 0.15, whoosh(0.3), 0.3)
tB2 = W('b3', '금지', 2.9); put(tB2 - 0.02, mx(thud(0.45, 55) * 1.3, clank() * 0.5, crackle(0.3)), 0.75)
# ---------- 송금 망설임 → 정지 ----------
for x in (0.15, 0.27, 0.39, 0.51, 0.63): put(A('s2') + x, beep(), 0.8)
put(A('s2') + 1.85, heartbeat(), 0.6); put(A('s2') + 2.55, heartbeat(), 0.7)
put(A('s2') + 3.0, tape_stop(0.6), 0.5)
mix = voice * 1.0 + bed + sfx * 0.55
sf.write(f'mix_raw_gf{TAG}.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f'mix_raw_gf{TAG}.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), f'mix_gf{TAG}.wav'], check=True)
print('dur', round(DUR, 2), 'peak raw', round(float(np.abs(mix).max()), 2))
