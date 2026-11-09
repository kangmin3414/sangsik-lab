"""AI 위로 편 믹스: 목소리 + 배경음(덕킹) + 합성 효과음 -> mix_ai{tag}.wav (loudnorm -14)"""
import os, sys
TAG = os.environ.get('TAG', '_sample'); TLF = f'timeline_ai{TAG}.json'; VF = f'voice_ai{TAG}.wav'
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
place('bgm/night.mp3', 0.2, A('s2') + 0.3, 0.34, fin=1.0, fout=0.8, off=0)            # 훅: 새벽 앰비언트
place('bgm/pizz.mp3', A('s2') + 0.1, T0('sd') - 0.05, 0.27, fin=0.4, fout=0.1, off=0)   # 재미: 피치카토 (어이없음 직전에 뚝)
place('bgm/night.mp3', A('n3') - 0.1, (A('s6') + 0.3) if 's6' in L else DUR, 0.26, fin=0.8, fout=1.0, off=20)   # 요즘 사람들
if 's6' in L:   # 전체판: 깨달음(전자 피아노) → 감동·여운(기타)
    place('bgm/epiano.mp3', A('s6') + 0.1, A('s8') + 0.2, 0.27, fin=1.2, fout=1.2, off=0)
    place('bgm/guitar.mp3', A('s8'), DUR, 0.31, fin=1.5, fout=3.0, off=0)
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

def chirp(f0=3200): t = np.arange(int(0.12 * SR)) / SR; return np.sin(2 * np.pi * np.cumsum(f0 + 1800 * np.sin(np.pi * t / 0.12)) / SR) * env(len(t), 0.005, 0.05) * 0.25
def scrape(d=0.5): return lp(noise(d), 700) * np.sin(np.linspace(0, np.pi, int(d * SR))) * 0.6
def murmur(d): t = np.arange(int(d * SR)) / SR; return bp(noise(d), 250, 1200) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.7 * t) * np.sin(2 * np.pi * 1.9 * t)) * 0.18
def ptap(): return mx(bp(noise(0.03), 2000, 8000) * env(int(0.03 * SR), 0.0005, 0.006) * 1.2, tone(1800, 0.03, 0.008, (1,)) * 0.2)   # 화면 톡
def sent_(): return mx(whoosh(0.22) * 0.6, np.pad(pop_(1500), (int(0.12 * SR), 0)))
def recv(): return mx(tone(988, 0.35, 0.12, (1, 0.3)) * 0.4, np.pad(tone(1319, 0.4, 0.15, (1, 0.3)) * 0.4, (int(0.09 * SR), 0)))
def buzz(d=0.45): t = np.arange(int(d * SR)) / SR; return lp(noise(d), 220)[:len(t)] * (np.sin(2 * np.pi * 9 * t) > -0.3) * 1.6
def boing(): t = np.arange(int(0.3 * SR)) / SR; f = 300 + 500 * np.sin(np.pi * t / 0.3); return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.005, 0.15) * 0.3
def rumble(d): t = np.arange(int(d * SR)) / SR; return lp(noise(d), 160)[:len(t)] * (0.8 + 0.2 * np.sin(2 * np.pi * 0.9 * t)) * 0.9 + bp(noise(d), 2500, 6000)[:len(t)] * 0.02
Z1 = '오늘 진짜 억울해… 다 그만두고 싶다.'
# ---------- 훅 ----------
put(A('s0'), hum(T0('s2') - A('s0')), 0.6)                                   # 방 안 웅웅
for x in [0.35, 0.52, 0.66, 0.9, 1.05, 1.2]: put(A('s0') + x, ptap(), 0.2)     # 이불 속 톡톡
Dz = L['z1']['t1'] - L['z1']['t0'] + 0.15
for i, ch in enumerate(Z1):
    if ch != ' ': put(A('z1') + 0.05 + (Dz - 0.3) * i / len(Z1), ptap(), 0.32)
put(T0('s1') + 0.18, ptap(), 0.5); put(T0('s1') + 0.2, sent_(), 0.45)
for x in (0.42, 0.52, 0.62): put(T0('s1') + x, tick_(2600, 0.25))
put(T0('s1') + 0.72, recv(), 0.6)
# 1초 · ✕ ✕ ✕
t1s = W('n1', '1초', 0.66); put(t1s - 0.05, pop_(1100), 0.35); put(t1s + 0.05, tick_(1400, 1.0)); put(t1s + 0.3, tick_(1400, 0.8))
for key, fb in (('화내', 1.2), ('졸', 2.88), ('좋을', 2.88), ('귀찮', 3.7)):
    if key == '좋을' and any('졸' in w['w'] for w in L['n1']['words']): continue
    if key == '졸' and not any('졸' in w['w'] for w in L['n1']['words']): continue
    tw = W('n1', key, fb); put(tw - 0.12, pop_(900), 0.3); put(tw + 0.15, mx(snap(), scribble(0.25)), 0.4)
# ---------- 재미: 태호에게 → 세 시간 ----------
put(A('s2') + 0.02, whoosh(0.25), 0.25); put(A('s2') + 0.78, ptap(), 0.6); put(A('s2') + 0.98, whoosh(0.25), 0.25)
put(A('s2') + 1.5, whoosh(0.3), 0.15)   # 자판 올라옴
put(A('n2') + 0.35, ptap(), 0.55); put(A('n2') + 0.38, pop_(1000), 0.25)
tS = W('n2', '보냈', 3.52); put(tS - 0.02, ptap(), 0.5); put(tS, sent_(), 0.45)
st = W('n2', '답은', 4.56) - 0.15; U = E1('s3') - st
put(st - 0.05, mx(whoosh(0.35), tape_stop(0.3) * 0.5), 0.35)
tt = st + 0.1
while tt < E1('s3') - 0.1: put(tt, tick_(1300 if int((tt - st) / 0.16) % 2 else 1100, 0.45)); tt += 0.16
for i in range(4):
    x = st + U * 0.42 + i * 0.55 + 0.25
    if x < st + U * 0.66: put(x, boing(), 0.5)
put(st + U * 0.66 + 0.4, snore(1.0), 0.8); put(st + U * 0.66 + 1.5, snore(0.9), 0.8)
put(A('s4') + 0.06, buzz(0.5), 0.5); put(A('s4') + 0.08, ding(), 0.75); put(A('s4') + 0.14, mx(whoosh(0.25), pop_(700)), 0.4)
put(A('s4') + 0.84, recv(), 0.4)
# 장문 vs 한 줄
put(A('s5') + 0.2, rattle(1.2), 0.35); put(A('s5') + 0.6, pop_(1200), 0.45)
put(A('sd') + 0.15, crickets(1.4), 0.9)
# ---------- 요즘 사람들 ----------
c2 = W('n3', '친구보다', 2.8) - 0.05; c3 = W('n3', '마음을', 5.22) - 0.3
put(A('n3'), rumble(c2 - A('n3')), 0.35); put(c2 - 0.12, whoosh(0.3), 0.3); put(c2, murmur(c3 - c2), 0.5)
put(c3 - 0.12, whoosh(0.3), 0.3); put(c3, murmur(E1('n3') + 0.6 - c3), 0.45); put(c3 + 0.5, clink(), 0.25)
mix = voice * 1.0 + bed + sfx * 0.55
sf.write(f'mix_raw_ai{TAG}.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f'mix_raw_ai{TAG}.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), f'mix_ai{TAG}.wav'], check=True)
print('dur', round(DUR, 2), 'peak raw', round(float(np.abs(mix).max()), 2))
