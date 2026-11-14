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
B = 'bgm/'   # Lyria 3 Pro로 만든 네 곡(gen_bgm.py, 노래 목소리 검사 통과: VAD 구간 0)
place(B + 'night.mp3', 0, A('s2') + 0.25, 0.32, fin=1.2, fout=0.5, off=0)              # 1막: 새벽의 책상. 멈춤에서 음악이 멎는다
place(B + 'night.mp3', A('n3') + 0.5, A('s3') + 0.4, 0.22, fin=1.5, fout=1.2, off=44)   # 다세계 해석 두 줄
place(B + 'night.mp3', A('s3') + 0.1, A('k0') + 2.2, 0.32, fin=0.8, fout=1.2, off=18)   # 다시 움직인다 → 타이틀
place(B + 'first.mp3', A('n4') - 0.3, A('s5') + 0.3, 0.3, fin=1.5, fout=0.6, off=0)     # 2막: 첫 번째 세계. 16번에서 음악이 멎는다
place(B + 'first.mp3', A('n8') - 0.2, A('s7') + 0.6, 0.28, fin=2.0, fout=2.0, off=56)   # 인사팀 메일 → 반납 → 면접
place(B + 'night.mp3', A('s7') - 0.2, A('s8') + 0.5, 0.3, fin=1.5, fout=0.8, off=8)     # 그해 겨울, 같은 새벽
place(B + 'second.mp3', A('n11') - 0.2, A('s10') + 0.8, 0.3, fin=1.5, fout=2.2, off=0)  # 3막: 두 번째 세계
place(B + 'seven.mp3', A('s10') - 0.2, A('s12') + 0.3, 0.3, fin=1.5, fout=0.7, off=0)   # 4막: 7년 뒤. 38번에서 음악이 멎는다
place(B + 'seven.mp3', A('n18') - 0.3, DUR, 0.3, fin=2.0, fout=2.2, off=46)             # 그 밤을 아는 사람
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

def stepsg(t0, t1, iv=0.5, g=0.3):
    k = 0
    while t0 + k * iv < t1: put(t0 + k * iv, step(), g); k += 1
def rewind(d=1.3):
    n = int(d * SR); t = np.arange(n) / SR; f = 500 + 1900 * (t / d); w = np.sin(2 * np.pi * np.cumsum(f) / SR) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 22 * t))) * 0.12
    return w * np.sin(np.linspace(0, np.pi, n)) ** 0.6 + bp(noise(d), 1500, 6000)[:n] * 0.06
line_motif = lambda: mx(soft(220, 2.4), soft(277, 2.4))                          # 그 한 줄의 소리
# ---- 2막: 첫 번째 세계 ----
tM = W('n4', '달', 5.04) - 0.75; put(tM - 0.05, rustle(0.3), 0.4); tH = W('n4', '최종', 6.9); put(tH, pop_(820), 0.28); put(tH + 0.05, ding(), 0.22); put(W('n4', '합격', 8.24) + 0.15, sparkle(), 0.14)
put(W('n5', '사원증', 0.72), rustle(0.25), 0.4); tG = W('n5', '걸었', 1.98); put(tG, click(), 0.3); put(tG + 0.05, sparkle(), 0.14)
tW = W('n5', '세상', 3.4); put(tW, mx(soft(523, 1.8), soft(659, 1.8)), 0.3); put(tW + 1.05, whoosh(0.7), 0.1)
stepsg(A('b1') + 0.1, A('b1') + 0.6, 0.25, 0.32); put(W('b1', '시연', 4.28) + 0.75, pop_(700), 0.26)
put(A('s4') + 0.35, whoosh(0.4), 0.1); put(A('s4') + 0.8, soft(196, 2.2), 0.4)
for k in range(4): keys(A('n6') + 0.25 + k * 1.1, A('n6') + 0.82 + k * 1.1, 0.07, 0.18)
tC = W('n6', '동료', 5.22) - 0.4; put(tC - 0.05, whoosh(0.3), 0.1); stepsg(tC + 0.1, tC + 0.7, 0.26, 0.28)
tHb = W('n6', '가슴', 6.84)
for k in range(3): put(tHb + k * 0.74, heartbeat(), 0.5)
for k in range(3): put(A('n7') + 0.2 + k * 0.22, pop_(700 + 60 * k), 0.2)
put(W('n7', '가짜', 2.18), pop_(600), 0.22); put(W('n7', '가면', 3.64), pop_(760), 0.24)
tZ = W('n7', '제로는', 7.14) - 0.35; put(tZ, whoosh(0.4), 0.1); put(tZ + 0.05, pop_(640), 0.22); put(tZ + 0.95, line_motif(), 0.3)
put(W('n7', '아니었', 9.32), scribble(0.5), 0.5); put(W('n7', '지어낸', 11.48), pop_(600), 0.24)
put(W('c1', '맞죠', 2.46) + 0.75, pop_(700), 0.26)
i = int((A('s5') + 0.2) * SR); h = hum(3.6) * 0.9 + lp(noise(3.6), 700)[:int(3.6 * SR)] * 0.012; k = int(0.5 * SR); h[-k:] *= np.linspace(1, 0, k); sfx[i:i + len(h)] += h[:N - i]   # 에어컨 소리만
put(A('s5') + 2.35, flap(), 0.45); put(A('s5') + 0.3, soft(147, 3.2), 0.4)
tI = W('n8', '인사팀', 0.58); put(tI, pop_(820), 0.26); put(tI + 0.05, ding(), 0.18); put(W('n8', '지원서', 4.67) - 0.45, click(), 0.25); put(W('n8', '경력', 5.56), pop_(640), 0.22); put(W('n8', '낼', 10.13) - 0.45, soft(196, 2.6), 0.36)
put(A('h1') + 0.25, rustle(0.3), 0.4); put(W('h1', '확인이', 2.32), scribble(0.9), 0.6)
put(A('s6') + 1.3, rip(0.22), 0.1); put(A('s6') + 1.97, clank(), 0.42); put(A('s6') + 1.9, whoosh(1.1), 0.1); put(A('s6') + 3.05, pop_(560), 0.26); put(A('s6') + 3.1, line_motif(), 0.3)
tB = W('n9', '그런데', 3.34); stepsg(A('n9') + 0.2, tB + 0.6, 0.56, 0.26); put(tB - 0.1, whoosh(1.2), 0.08); put(tB + 0.2, line_motif(), 0.34)
put(A('i1') + 0.3, rustle(0.3), 0.35); tS = W('i1', '석', 2.1); put(tS, whoosh(0.6), 0.1); put(tS + 0.6, soft(196, 2.2), 0.38); put(tS + 1.3, pop_(700), 0.26)
for k in range(6): put(A('s7') + 0.35 + k * 0.6, tick_(900, 0.7), 0.28)
keys(A('s7') + 1.2, A('s7') + 2.0, 0.16, 0.24); keys(A('s7') + 2.5, A('s7') + 2.95, 0.09, 0.16)
put(W('n10', '지어낸', 0.86), pop_(640), 0.22); put(W('n10', '값으로', 1.48), whoosh(0.4), 0.08); put(W('n10', '지울', 1.96), thud(0.25, 90), 0.4); put(W('n10', '세계는', 7.14) - 0.45, tape_stop(0.6), 0.45)
put(A('s8') + 0.7, rewind(1.3), 0.9); put(A('s8') + 2.1, whoosh(0.8), 0.1); put(A('s8') + 2.9, pop_(760), 0.26); put(A('s8') + 2.95, sparkle(), 0.12)
# ---- 3막: 두 번째 세계 ----
put(W('n11', '지운', 2.1) - 0.5, whoosh(2.0), 0.14)
put(A('s9') + 0.7, breath(0.5, False), 0.4); keys(A('s9') + 1.05, A('s9') + 1.75, 0.045, 0.14); keys(A('s9') + 1.85, A('s9') + 2.8, 0.07, 0.2); put(A('s9') + 2.95, click(), 0.38); put(A('s9') + 3.35, ding(), 0.28); put(A('s9') + 3.7, whoosh(0.4), 0.12)
tB = W('n12', '불합격', 2.8); tS2 = W('n12', '세', 5.1)
for tt in (tB, min(tS2 - 0.75, tB + 1.2), tS2 + 0.1): put(tt, pop_(520), 0.26)
put(W('n12', '통', 5.58) + 0.4, soft(294, 2.2), 0.26)
put(W('n13', '네', 0.72), pop_(760), 0.24); tJ = W('n13', '재고', 4.06); keys(tJ, W('n13', '그대로', 10.34) - 0.5, 0.12, 0.15)
tB = W('n13', '밤새', 5.7); put(tB, pop_(700), 0.22)
for k in range(8): put(tB + 0.4 + k * 0.3, tick_(1200, 0.7), 0.2)
put(A('i2') + 0.3, rustle(0.3), 0.35); put(W('i2', '맞았', 4.84) + 0.9, pop_(700), 0.26)
put(A('z3') + 0.25, pop_(640), 0.22); tB = W('z3', '뒤로는', 4.48) - 0.3; put(tB, whoosh(0.8), 0.1); put(tB + 0.55, pop_(760), 0.22); put(tB + 0.7, pop_(860), 0.22)
tQ = W('n14', '질문이', 1.96)
for k in range(3): put(tQ + k * 0.25, pop_(700), 0.22)
put(W('n14', '숨을', 5.2), slide_down(0.7), 0.3); put(W('n14', '할', 8.26) + 0.5, ding(), 0.22)
put(W('n15', '모르는', 8.88) + 0.15, pop_(700), 0.24); put(W('n15', '말할', 11.44) + 0.2, pop_(820), 0.24)
# ---- 4막: 7년 뒤 ----
put(A('s10') + 0.1, whoosh(0.4), 0.12); put(A('s10') + 0.5, pop_(700), 0.24); stepsg(A('s10') + 0.35, A('s10') + 1.5, 0.28, 0.3); put(A('s10') + 1.45, pop_(820), 0.24); put(A('s10') + 1.7, whoosh(0.5), 0.14); put(A('s10') + 2.8, thud(0.18, 110), 0.25); put(A('s10') + 3.2, thud(0.22, 130), 0.4)
for k, tt in enumerate((0.7, 1.7, 2.7)): put(A('n16') + tt, click(), 0.26); put(A('n16') + tt + 0.3, rustle(0.25), 0.3)
put(A('s11') + 0.05, rustle(0.5), 0.25); put(A('s11') + 0.9, whoosh(0.6), 0.08); put(A('s11') + 1.75, pop_(600), 0.24); put(A('s11') + 1.8, line_motif(), 0.42)
put(A('n17') + 0.3, pop_(640), 0.2); put(W('n17', '아는', 5.51), soft(392, 2.2), 0.2); put(W('n17', '모르는', 7.62), soft(440, 2.2), 0.2); put(W('n17', '그것이', 10.5), mx(soft(523, 3.0), soft(659, 3.0)), 0.2)
for k in range(5): put(A('s12') + 0.3 + k * 0.62, tick_(900, 0.7), 0.3)          # 음악이 멎고 시계 소리만
put(W('n18', '줄이', 1.54), whoosh(0.5), 0.08); tN = W('n18', '밤이', 5.48) - 0.6; put(tN, pop_(640), 0.22); put(tN + 0.05, soft(330, 2.6), 0.24)
for k in range(4): put(A('n19') + 0.5 + k * 1.0, tick_(900, 0.7), 0.2)
mix = voice * 1.0 + bed + sfx * 0.55
sf.write('/dev/shm/rs/mix_raw.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/dev/shm/rs/mix_raw.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), '/dev/shm/rs/mix.wav'], check=True)
print('dur', round(DUR, 2), 'peak raw', round(float(np.abs(mix).max()), 2))
