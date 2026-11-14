"""voice + beds + synthesized SFX -> mix_b.wav (loudnorm -14)"""
import json, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, lfilter
SR = 44100; rng = np.random.default_rng(7)
def mx(*ws):
    n = max(len(w) for w in ws); return sum(np.pad(w, (0, n - len(w))) for w in ws)
TL = json.load(open('timeline_ad.json')); L = {l['id']: l for l in TL['lines']}; DUR = TL['duration']; N = int(DUR * SR)
voice, _ = sf.read('/dev/shm/ad/voice_ad.wav', dtype='float32'); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
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
B = '../../spinoza01/long/bgm/'   # 샘플용 임시 배경음(스피노자 편의 곡을 빌림). 본편에서는 새로 만든다.
place(B + 'moon.mp3', 0, A('k0') + 1.2, 0.34, fin=1.2, fout=1.6, off=0)          # 응급실
place(B + 'lens.mp3', A('n1') - 0.5, A('n2') + 1.6, 0.28, fin=1.5, fout=2.4, off=0)  # 40분 전, 편의점
place(B + 'moon.mp3', A('n2') - 0.4, DUR, 0.34, fin=2.0, fout=2.5, off=20)         # 다시 응급실
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
# 1~4번: 응급실
put(A('s1') + 0.1, whoosh(0.9), 0.22)                                   # 자동문
steps(A('s1') + 0.45, A('s1') + 1.6, 0.27, 0.42)                         # 뛰어 들어옴
put(A('s1') + 1.75, rustle(0.3), 0.5)                                    # 봉지
for k in range(3): put(A('s2') + 0.7 + k * 0.6, tick_(900, 0.7), 0.3)    # 벽시계
put(A('z1') + 1.05, rustle(0.35), 0.55)                                  # 봉지를 감춤
# 5~6번: 편의점
put(W('n1', '40', 1.6), pop_(760), 0.25)
put(W('n1', '스티커', 6.0), sparkle(), 0.2)
tS = W('n1', '흔들어', 9.7)
for k in range(7): put(tS + 0.05 + k * 0.2, rustle(0.14), 0.5)           # 봉지를 흔듦
put(A('f1') - 0.65, buzz(), 0.6); put(A('f1') + 0.2, pop_(640), 0.2)     # 전화 진동, 작은 창
tG = W('f1', '먼저', 6.0)
steps(tG + 0.4, min(tG + 1.8, DUR), 0.21, 0.4)                           # 계산대로 뜀
# 7번
put(W('n2', '손목', 0.7), mx(soft(523, 1.6), soft(659, 1.6)), 0.4)       # 다행
put(W('n2', '하루', 2.1), pop_(700), 0.22)
tF = W('n2', '서류', 5.8) - 0.4; put(tF, rip(0.3), 0.14)                 # 서류
put(W('n2', '보호자', 8.7), soft(440, 2.2), 0.45)                        # 보호자 칸
tN = W('n2', '이름', 9.6); put(tN + 0.35, scribble(1.9), 0.8)            # 펜
tB = W('n2', '뒤가', 14.0) - 0.7; put(tB + 0.5, whoosh(0.6), 0.1)
for k in range(3): put(tB + 1.2 + k * 0.6, tick_(900, 0.7), 0.26)
put(W('n2', '어른이', 16.6), mx(soft(330, 3.0), soft(494, 3.0)), 0.4)    # 빈 문
mix = voice * 1.0 + bed + sfx * 0.55
sf.write('/dev/shm/ad/mix_raw.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/dev/shm/ad/mix_raw.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), '/dev/shm/ad/mix.wav'], check=True)
print('dur', round(DUR, 2), 'peak raw', round(float(np.abs(mix).max()), 2))
