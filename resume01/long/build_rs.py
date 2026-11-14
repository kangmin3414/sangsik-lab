"""voice + beds + synthesized SFX -> mix_b.wav (loudnorm -14)"""
import json, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, lfilter
SR = 44100; rng = np.random.default_rng(7)
def mx(*ws):
    n = max(len(w) for w in ws); return sum(np.pad(w, (0, n - len(w))) for w in ws)
TL = json.load(open('timeline_rs.json')); L = {l['id']: l for l in TL['lines']}; DUR = TL['duration']; N = int(DUR * SR)
voice, _ = sf.read('/dev/shm/rs/voice_rs.wav', dtype='float32'); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
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
B = '../../spinoza01/long/bgm/'   # 샘플용 임시 배경음(스피노자 편의 곡을 빌림). 본편에서는 Lyria로 새로 만든다.
place(B + 'moon.mp3', 0, A('s2') + 0.25, 0.32, fin=1.2, fout=0.5, off=0)             # 새벽의 책상. 멈춤에서 음악이 멎는다
place(B + 'lens.mp3', A('n3') + 0.5, A('s3') + 0.4, 0.26, fin=1.5, fout=1.2, off=0)   # 다세계 해석 두 줄
place(B + 'moon.mp3', A('s3') + 0.1, DUR, 0.32, fin=0.8, fout=1.6, off=30)            # 다시 움직인다
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
# ---------- 효과음(모두 작게, 놀라게 하는 소리 없음) ----------
def proj(d):                                                                    # 영사기 도는 소리
    n = int(d * SR); x = np.zeros(n)
    for k in range(int(d * 16)):
        i = int(k / 16 * SR); w = bp(noise(0.02), 800, 3500) * env(int(0.02 * SR), 0.0005, 0.006); x[i:i + len(w)] += w[:n - i]
    x = x * 0.5 + lp(noise(d), 200)[:n] * 0.05; k = int(0.4 * SR); x[:k] *= np.linspace(0, 1, k); x[-k:] *= np.linspace(1, 0, k); return x
def soft(f, d=1.4): return tone(f, d, 0.55, (1, 0.25)) * 0.3                    # 부드러운 건반 한 음

def rustle(d=0.25): n = noise(d); return bp(n, 2500, 9000) * (rng.random(len(n)) > 0.6) * np.sin(np.linspace(0, np.pi, len(n))) * 0.6
def steps(t0, t1, iv=0.5, g=0.35):
    k = 0
    while t0 + k * iv < t1: put(t0 + k * iv, step(), g); k += 1
def buzz(d=0.45): t = np.arange(int(d * SR)) / SR; return np.sin(2 * np.pi * 155 * t) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 28 * t))) * np.sin(np.linspace(0, np.pi, len(t))) * 0.25
def scribble(d): n = noise(d); return bp(n, 1800, 6000) * (0.55 + 0.45 * np.sin(np.linspace(0, d * 38, len(n)))) * 0.22

def keys(t0, t1, iv=0.085, g=0.3):                                              # 저절로 적히는 글자
    k = 0
    while t0 + k * iv < t1: put(t0 + k * iv + rng.random() * 0.02, tick_(1700 + rng.random() * 500, 0.6), g); k += 1
def breath(d=0.55, up=True): n = lp(noise(d), 1800); e = np.linspace(0, 1, len(n)) ** 1.5 if up else np.linspace(1, 0, len(n)) ** 1.2; return bp(n, 400, 2500) * e * 0.5
# 1번: 빈 지원서
for k in range(5): put(A('s1') + 0.35 + k * 0.6, tick_(900, 0.7), 0.28)         # 시계
# 2번
put(W('n1', '마감', 1.8), pop_(760), 0.22)
tA = W('n1', '제로의', 4.42) - 0.3; put(tA - 0.05, whoosh(0.3), 0.1)
put(tA + 0.5, tick_(1900, 0.6), 0.3); put(tA + 0.8, tick_(1750, 0.6), 0.3); put(tA + 1.5, tick_(1300, 0.6), 0.25); put(tA + 1.7, tick_(1300, 0.6), 0.25)
put(W('n1', '빈칸', 6.78), soft(392, 1.4), 0.3)
tP = W('n1', '단톡방', 9.16) - 0.45; put(tP + 0.02, buzz(0.5), 0.55); put(tP + 0.35, pop_(820), 0.3)
for key, fb in (('합격', 10.02), ('인증', 10.6), ('올라오', 11.06)): put(W('n1', key, fb), pop_(880), 0.26)
tR = W('n1', '이력', 12.88) - 0.75; put(tR - 0.05, whoosh(0.3), 0.1)
tS = W('n1', '석', 13.5)
for k in range(3): put(tS + k * 0.42, pop_(640 + k * 60), 0.24)                 # 달력 세 칸
put(W('n1', '하나뿐', 15.62), soft(330, 1.8), 0.32)
# 3번: 친구의 메시지
put(A('f1') + 0.15, pop_(820), 0.28); put(W('f1', 'AI', 2.08), pop_(820), 0.28); put(W('f1', '붙으면', 4.48) - 0.84, pop_(820), 0.28)
# 4번
tIn = W('n2', '넣자', 0.64); put(A('n2') + 0.05, whoosh(0.35), 0.1); keys(tIn + 0.3, tIn + 2.5, 0.07, 0.2)
put(tIn + 2.6, ding(), 0.16)
put(W('n2', '괜찮', 5.0), pop_(700), 0.22)
tPb = W('n2', '문제는', 7.26); put(tPb + 0.2, pop_(600), 0.22); put(tPb + 1.5, click(), 0.3)
tPL = W('n2', '프로젝트', 10.6); tMe = W('n2', '매출', 11.66); tGi = W('n2', '기여', 13.48)
keys(tPL, tPL + 0.8, 0.1, 0.24); keys(tMe, tGi + 0.45, 0.16, 0.24)
put(tGi + 0.55, mx(soft(220, 2.4), soft(277, 2.4)), 0.42)                       # 그 한 줄
tF = W('n2', '석', 14.94) - 0.5; put(tF - 0.05, whoosh(0.3), 0.1); put(tF + 0.35, pop_(700), 0.22)
tWa = W('n2', '창고', 16.16)
for k in range(8): put(tWa + k * 0.34, tick_(1200, 0.7), 0.22)                  # 상자를 센다
tNo = W('n2', '해본', 18.68); put(tNo, whoosh(0.5), 0.12); put(tNo + 0.45, soft(294, 2.0), 0.32)
tEnd = W('n2', '일이었', 20.34) + 1.0; put(tEnd, breath(0.55, True), 0.5)       # 숨을 들이쉼
# 6번: 멈춤 — 소리가 멎는다
put(A('s2') + 0.1, tape_stop(0.6), 0.5); put(A('s2') + 0.7, soft(1760, 1.6), 0.1)
# 7번: 선 하나가 두 갈래로
put(A('n3') + 0.5, whoosh(0.8), 0.1); put(A('n3') + 0.75, pop_(700), 0.22)
tC = W('n3', '가능한', 7.16); put(tC, pop_(560), 0.2)
tSp = W('n3', '갈라진', 8.36); put(tSp, whoosh(1.0), 0.14)
put(W('n3', '세계에서', 9.54), pop_(740), 0.26); put(W('n3', '저마다', 10.18), pop_(660), 0.26)
put(W('n3', '일어난', 11.4), sparkle(), 0.14)
put(W('n3', '지금도', 13.78), pop_(700), 0.24)
tIm = W('n3', '상상입니다', 18.6); put(tIm - 0.1, scribble(0.8), 0.5); put(tIm, pop_(700), 0.2)
tT = W('n3', '오늘은', 21.08); put(tT + 0.4, whoosh(2.0), 0.16)
# 8번: 다시 움직인다 → 제출
put(A('s3') + 0.75, breath(0.55, False), 0.45)
tC8 = A('s3') + 1.35; put(tC8 + 0.35, click(), 0.4); put(tC8 + 0.8, ding(), 0.3); put(tC8 + 1.25, whoosh(0.4), 0.14)
put(A('k0') + 0.05, zap(), 0.12)
mix = voice * 1.0 + bed + sfx * 0.55
sf.write('/dev/shm/rs/mix_raw.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/dev/shm/rs/mix_raw.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), '/dev/shm/rs/mix.wav'], check=True)
print('dur', round(DUR, 2), 'peak raw', round(float(np.abs(mix).max()), 2))
