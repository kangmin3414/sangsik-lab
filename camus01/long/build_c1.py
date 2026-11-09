"""카뮈 편 믹스: 목소리 + 배경음(덕킹) + 합성 효과음 -> mix_c1{tag}.wav (loudnorm -14)"""
import os, sys
TAG = os.environ.get('TAG', '_sample'); TLF = f'timeline_c1{TAG}.json'; VF = f'voice_c1{TAG}.wav'
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
place('bgm/office.mp3', 0.2, A('s1') + 0.12, 0.30, fin=0.6, fout=0.1, off=0)                 # 훅(가방·출근) → '띠링'에서 뚝
place('bgm/office.mp3', T0('L3') - 0.2, E1('L9') + 0.5, 0.28, fin=0.4, fout=0.9, off=18)       # 전화 → 몽타주 → 왜요 → 회의실
place('bgm/myth.mp3', A('L10') - 0.2, DUR, 0.30, fin=1.2, fout=1.6, off=0)                      # 퇴근길 → 카뮈 → 신화 → 계단
def trail_sum(x, k): c = np.concatenate([[0.0], np.cumsum(x)]); i = np.arange(len(x)); return c[i + 1] - c[np.maximum(0, i + 1 - k)]
vad = (np.abs(voice) > 0.006).astype(float)
act = (trail_sum(vad, int(0.5 * SR)) > 0) | (trail_sum(vad[::-1], int(0.15 * SR))[::-1] > 0)   # hold 0.5 s after speech, lead 0.15 s
k = int(0.12 * SR); act = trail_sum(act.astype(float), k) / k
bed *= (1.0 - 0.75 * act)
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
def zipper(d=0.75):
    s = np.zeros(int(d * SR)); k = 0.0
    while k < d - 0.02:
        w = bp(noise(0.012), 2500, 9000) * env(int(0.012 * SR), 0.0005, 0.004); i = int(k * SR); s[i:i + len(w)] += w[:len(s) - i]; k += 0.011 + 0.006 * rng.random()
    return s * 0.9
def buzz(d=0.5): t = np.arange(int(d * SR)) / SR; return np.sign(np.sin(2 * np.pi * 160 * t)) * (np.sin(2 * np.pi * 7 * t) > -0.3) * 0.07
def rub(d=1.2): n = noise(d); t = np.arange(len(n)) / SR; return bp(n, 400, 2500) * (0.5 + 0.5 * np.sin(2 * np.pi * 1.3 * t)) * 0.25
def rumble(d): t = np.arange(int(d * SR)) / SR; return lp(noise(d), 160)[:len(t)] * (0.7 + 0.3 * np.sin(2 * np.pi * 0.7 * t)) * 0.8
def grind(d): t = np.arange(int(d * SR)) / SR; return lp(noise(d), 260)[:len(t)] * (0.6 + 0.4 * np.abs(np.sin(2 * np.pi * 1.6 * t))) * 0.9
# ---------- 훅: 지퍼, 봉투 ----------
put(A('s0') + 0.05, zipper(0.75), 0.45)
put(A('L1') + 0.95, rub(1.6), 0.5); put(A('L1') + 1.05, sparkle(), 0.12)
put(W('L1', '3년', 1.9) + 0.05, pop_(1000), 0.3)
# ---------- 출근 지하철 ----------
put(A('L2') - 0.3, rumble(E1('L4') - A('L2') + 0.6), 0.12)
put(A('L2') + 0.25, pop_(800), 0.3)
tTak = E1('L2') - 0.3; put(tTak - 0.9, whoosh(0.8), 0.12); put(E1('L2') + 0.05, jingle(), 0.22)   # '탁'은 목소리로 — 효과음이 말을 가리지 않게
put(A('s1') + 0.1, ding(), 0.6)
put(A('s1') + 1.12, glass(), 0.5)
put(A('s1') + 1.45, buzz(E1('s1') - A('s1') - 1.4), 0.9)
put(A('L3') + 0.2, whoosh(0.25), 0.35)
put(W('L4', '네', 0.0) - 0.05, whoosh(0.3), 0.25); put(W('L4', '빛', 0.9) - 0.05, whoosh(0.3), 0.25); put(W('L4', '빛', 0.9) + 0.1, sparkle(), 0.25)
# ---------- 몽타주: 요일 도장 쾅, 타자 ----------
L5w = [w['t'] for w in L['L5']['words'] if '같은' in w['w']]
st = [A('L5') + 0.08] + [T0('L5') + x for x in L5w[1:3]]
for x in st: put(x, mx(thud(0.35, 58) * 1.1, snap() * 0.7), 0.6)
if len(st) > 1:
    for k in range(7): put(st[1] + 0.1 + k * 0.12, key_(), 0.4)
# ---------- 왜요 등장 ----------
put(A('s2') + 0.1, rattle(0.3), 0.15)
put(A('s2') + 0.42, mx(pop_(650), whoosh(0.22)), 0.55); put(A('s2') + 0.74, mx(pop_(1300), thud(0.1, 320) * 0.4), 0.4)
put(W('L7', '왜요', 5.5) - 0.1, pop_(1100), 0.35)
# ---------- 회의실 ----------
L8w = [w['t'] for w in L['L8']['words'] if '왜' in w['w']]
for x in L8w[:2]: put(T0('L8') + x + 0.05, pop_(1500), 0.25)
tR = W('L8', '보고서', 1.66) + 0.15; put(tR - 0.35, whoosh(0.35), 0.35); put(tR + 0.15, thud(0.15, 260), 0.4)
tRd = W('L8', '읽잖', 2.72) + 0.15; put(tRd, thud(0.12, 300), 0.35); put(tRd + 0.3, thud(0.12, 300), 0.35)
put(A('L9') + 0.36, mx(thud(0.12, 200) * 0.6, snap() * 0.2), 0.35)
# ---------- 퇴근 지하철: 넘기는 소리 ----------
put(A('L10') - 0.2, rumble(E1('L10') - A('L10') + 0.5), 0.1)
for k in range(8): put(A('L10') + 0.55 + k * 0.62, whoosh(0.14), 0.1)
# ---------- 카뮈·신화 ----------
put(A('L11') + 0.02, rip(0.35), 0.18)
tRoll = W('L12', '굴러', 7.62) + 0.15 - 0.15
put(A('L12') + 0.3, grind(max(0.5, tRoll - A('L12') - 0.3)), 0.12)
put(tRoll, roll(1.6), 0.4); put(W('L12', '영원히', 9.2), chime(), 0.15)
# ---------- 계단: 굴러떨어짐, 달력, 털썩 ----------
put(A('L13') + 0.05, whoosh(0.5), 0.2)
tW = W('L13', '오늘의', 1.54) - 0.1; put(tW, roll(1.0), 0.5); put(tW + 1.0, thud(0.35, 60), 0.55)
put(W('L13', '날마다', 4.08) - 0.05, rip(0.4), 0.3)
put(A('L14') + 0.05, pop_(1400), 0.3)
for k in range(6): put(A('L14') + 0.62 + k * 0.33, step(), 0.4)
put(A('s3') + 0.45, mx(thud(0.4, 58) * 1.2, bp(noise(0.2), 300, 1500) * env(int(0.2 * SR), 0.001, 0.05) * 0.5), 0.6)
mix = voice * 1.0 + bed + sfx * 0.55
sf.write(f'mix_raw_c1{TAG}.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f'mix_raw_c1{TAG}.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), f'mix_c1{TAG}.wav'], check=True)
print('dur', round(DUR, 2), 'peak raw', round(float(np.abs(mix).max()), 2))
