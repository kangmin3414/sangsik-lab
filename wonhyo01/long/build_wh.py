"""원효 편 샘플: voice + BGM(office/silla, 덕킹) + 합성 효과음 -> /dev/shm/wh/mix.wav (loudnorm -14)"""
import json, subprocess, numpy as np, soundfile as sf, os
from scipy.signal import butter, lfilter
os.chdir(os.path.dirname(os.path.abspath(__file__)))
SR = 44100; rng = np.random.default_rng(11)
def mx(*ws):
    n = max(len(w) for w in ws); return sum(np.pad(w, (0, n - len(w))) for w in ws)
TL = json.load(open('timeline_wh.json')); L = {l['id']: l for l in TL['lines']}; DUR = TL['duration']; N = int(DUR * SR)
voice, _ = sf.read('/dev/shm/wh/voice_wh.wav', dtype='float32')
if voice.ndim > 1: voice = voice.mean(1)
voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
def W(lid, key, fb=0.0, n=0):
    l = L[lid]; m = [w for w in l.get('words', []) if key in w['w'].replace(' ', '')]
    return l['t0'] + (m[n]['t'] if len(m) > n else fb)
A = lambda k: L[k]['t0'] - 0.15          # 장면 시작(lt=0)
E1 = lambda k: L[k]['t1']
def load(fn, start, dur):
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', fn, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    a = np.frombuffer(raw, np.float32).copy(); a = a[int(start * SR):]; n = int(dur * SR)
    while len(a) < n: a = np.concatenate([a, a[int(8 * SR):]])
    return a[:n]
bed = np.zeros(N)
def place(fn, t0, t1, g, fin=1.5, fout=2.5, off=0.0):
    i0, i1 = int(max(0, t0) * SR), min(N, int(t1 * SR)); a = load(fn, off, (i1 - i0) / SR) * g
    k = int(fin * SR); a[:k] *= np.linspace(0, 1, k)[:len(a)]; k = int(fout * SR); a[-k:] *= np.linspace(1, 0, k)
    bed[i0:i0 + len(a)] += a
B = '/dev/shm/wh/bgm/'
place(B + 'office.mp3', 0, A('k0') + 1.0, 0.30, fin=0.6, fout=1.2)                 # 훅: 회사
place(B + 'silla.mp3', A('k0') + 0.4, E1('w6') + 1.6, 0.34, fin=1.4, fout=2.0)      # 신라 이야기
place(B + 'office.mp3', A('t1') - 0.2, DUR, 0.30, fin=1.2, fout=2.5, off=18)        # 현대로
def trail_sum(x, k): c = np.concatenate([[0.0], np.cumsum(x)]); i = np.arange(len(x)); return c[i + 1] - c[np.maximum(0, i + 1 - k)]
vad = (np.abs(voice) > 0.006).astype(float)
act = (trail_sum(vad, int(0.5 * SR)) > 0) | (trail_sum(vad[::-1], int(0.15 * SR))[::-1] > 0)
k = int(0.12 * SR); act = trail_sum(act.astype(float), k) / k
bed *= (1.0 - 0.72 * act)

sfx = np.zeros(N)
def put(t, w, g=1.0):
    i = int(t * SR)
    if i >= N: return
    w = w[:N - i]; sfx[i:i + len(w)] += w * g
def env(n, a=0.002, d=0.2):
    t = np.arange(n) / SR; return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
def bp(x, lo, hi): b, a = butter(2, [lo / (SR / 2), min(0.99, hi / (SR / 2))], 'band'); return lfilter(b, a, x)
def lp(x, f): b, a = butter(2, f / (SR / 2)); return lfilter(b, a, x)
def noise(d): return rng.standard_normal(int(d * SR))
def tone(f, d, dec=0.4, h=(1, 0.4, 0.2)): t = np.arange(int(d * SR)) / SR; return sum(a * np.sin(2 * np.pi * f * (i + 1) * t) for i, a in enumerate(h)) * env(len(t), 0.004, dec)
def thud(d=0.35, f=70): t = np.arange(int(d * SR)) / SR; return np.sin(2 * np.pi * f * t * (1 - t)) * env(len(t), 0.002, 0.09) + lp(noise(d), 900)[:len(t)] * env(len(t), 0.001, 0.03) * 0.6
def whoosh(d=0.4): n = noise(d); return bp(n, 600, 4000) * np.sin(np.linspace(0, np.pi, len(n))) ** 2 * 0.5
def pop_(f=900): t = np.arange(int(0.08 * SR)) / SR; return np.sin(2 * np.pi * f * t * (1 + 3 * t)) * env(len(t), 0.001, 0.025)
def soft(f, d=1.4): return tone(f, d, 0.55, (1, 0.25)) * 0.3
def ding(): return mx(tone(1568, 0.5, 0.25, (1, 0.3)) * 0.45, tone(2093, 0.4, 0.2, (1,)) * 0.25)
def chime():
    s = np.zeros(int(1.3 * SR))
    for i in range(6):
        w = tone(1200 * 2 ** (i / 6), 0.8, 0.3, (1, 0.2)) * 0.22; j = int(i * 0.07 * SR); s[j:j + len(w)] += w
    return s
def step(): return bp(noise(0.05), 200, 1200) * env(int(0.05 * SR), 0.001, 0.015)
def steps(t0, t1, iv=0.5, g=0.35):
    k = 0
    while t0 + k * iv < t1: put(t0 + k * iv, step(), g); k += 1
def rustle(d=0.25): n = noise(d); return bp(n, 2500, 9000) * (rng.random(len(n)) > 0.6) * np.sin(np.linspace(0, np.pi, len(n))) * 0.6
def scribble(d): n = noise(d); return bp(n, 1800, 6000) * (0.55 + 0.45 * np.sin(np.linspace(0, d * 38, len(n)))) * 0.22
def hum(d): t = np.arange(int(d * SR)) / SR; return (np.sin(2 * np.pi * 120 * t) * 0.5 + np.sin(2 * np.pi * 240 * t) * 0.25) * 0.06 * np.minimum(1, t / 0.2) * np.minimum(1, (d - t) / 0.2)
def rain(d):
    n = int(d * SR); x = bp(noise(d), 1500, 9000)[:n] * 0.10 + lp(noise(d), 400)[:n] * 0.05
    for _ in range(int(d * 22)):
        i = int(rng.random() * n); w = bp(noise(0.012), 2000, 8000) * env(int(0.012 * SR), 0.0005, 0.004) * 0.6; x[i:i + len(w)] += w[:n - i]
    k = int(0.6 * SR); x[:k] *= np.linspace(0, 1, k); x[-k:] *= np.linspace(1, 0, k); return x
def slosh(d=0.35): n = noise(d); return lp(bp(n, 200, 1600), 1200) * np.sin(np.linspace(0, np.pi, len(n))) ** 1.5 * 0.7
def pour(d=1.0):
    t = np.arange(int(d * SR)) / SR; f = 380 + 260 * t / d
    return (bp(noise(d), 400, 2400)[:len(t)] * 0.5 + np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.08) * np.sin(np.pi * t / d) ** 0.8 * 0.6
def whistle(d=0.35): t = np.arange(int(d * SR)) / SR; return np.sin(2 * np.pi * (2600 + 60 * np.sin(2 * np.pi * 28 * t)) * t) * env(len(t), 0.005, 0.25) * 0.35
def strike(d=0.3): n = noise(d); return bp(n, 900, 5000) * np.linspace(1, 0.2, len(n)) * 0.6
def flipw(): return mx(whoosh(0.3) * 0.8, pop_(1100) * 0.5)
def breath_in(d=0.6): n = noise(d); return bp(n, 400, 2500) * np.sin(np.linspace(0, np.pi, len(n))) ** 2 * 0.25

# 1~3 훅: 회의실 문
put(A('h1') + 0.2, breath_in(0.7), 0.6)
put(W('h2', '어떤', 3.9), pop_(620), 0.25); put(W('h2', '어떤', 5.3, 1), pop_(880), 0.25)
put(W('h2', '그럭저럭', 6.2), soft(523, 1.4), 0.35)
# 제목 카드(네온)
put(A('k0') + 0.05, hum(1.7), 1.0); put(A('k0') + 0.1, pop_(1300), 0.2)
# 4 신라
steps(A('w1') + 0.25, A('w1') + 2.5, 0.42, 0.35)
for i, dt in enumerate((1.2, 1.9, 2.6)): put(A('w1') + dt, pop_(700 + 120 * i), 0.22)
put(W('w1', '원효', 5.2) + 0.15, ding(), 0.25)
# 5 해골물 카드
put(A('w2') + 0.1, whoosh(0.35), 0.3)
put(W('w2', '그런데', 2.5) + 0.15, pop_(760), 0.25)
tX = W('w2', '나오지', 5.8) + 0.15; put(tX, strike(), 0.45); put(tX + 0.35, strike(), 0.45)
# 6 토굴 → 무덤
tM = W('w3', '아침', 7.0) + 0.15
put(A('w3'), rain(tM - A('w3') + 0.3), 0.9)
put(tM + 0.1, mx(soft(659, 1.8), soft(784, 1.8)), 0.35)
put(W('w3', '무덤', 10.0) + 0.15, soft(196, 2.0), 0.5)
# 7 귀신(무섭지 않게, 낮은 음 하나)
tG = W('w4', '귀신', 4.6) + 0.15
put(tG - 0.4, mx(soft(233, 2.4), soft(277, 2.4)), 0.4)
# 8 둘이 아니다
put(A('w5') + 0.55, pop_(820), 0.18); put(A('w5') + 1.55, pop_(980), 0.18); put(A('w5') + 2.35, pop_(700), 0.16)
put(W('w5', '둘이', 7.5) + 0.05, chime(), 0.28)
# 9 바닷가
tB = W('w6', '돌아갑니다', 4.2) + 0.15; steps(tB + 0.1, E1('w6') + 0.2, 0.45, 0.3)
put(W('w6', '해골물은', 6.0) + 0.15, pop_(760), 0.22)
# 10 제목
put(A('t1') + 0.15, whoosh(0.4), 0.3); put(A('t1') + 0.7, pop_(900), 0.22)
# 11~12 표주박
put(A('t2') + 0.3, rustle(0.4), 0.6)
tF = W('t2', '가지', 3.2) + 0.15
for i in range(4): put(tF + i * 0.35, pop_(700 + 110 * i), 0.22)
tI = W('t3', '이거', 1.0); put(tI - 0.4, slosh(0.3), 0.4); put(E1('t3') + 0.05, slosh(0.3), 0.3)   # 말 사이에만 출렁
# 13 1일 차
put(A('d1') + 0.05, whoosh(0.5), 0.3); put(A('d1') + 0.5, ding(), 0.18)
# 14 이름 바꾸기
put(W('d2', '말고', 4.0) + 0.15, strike(0.35), 0.55)
put(W('d2', '연습', 5.2) - 0.2, flipw(), 0.4); put(W('d2', '연습', 5.2) + 0.15, ding(), 0.22)
# 15~16 회의
put(A('d3') + 0.3, rustle(0.3), 0.5)
put(E1('d4') + 0.02, whistle(0.28), 0.25)                               # 말 끝난 뒤 호루라기
# 17~18 와인
put(A('d5') + 0.2, pop_(760), 0.2)
put(A('d6') + 0.35, pour(0.9), 0.5)
put(W('d6', '5달러', 1.7) + 0.15, pop_(820), 0.25); put(W('d6', '45달러', 3.1) + 0.15, pop_(980), 0.25)
put(W('d6', '맛있다고', 8.0) + 0.15, chime(), 0.22)
put(W('d6', '즐거움을', 9.7) + 0.15, pop_(1100), 0.2)
# 큰 숫자 카드
put(A('s1') + 0.05, mx(thud(0.3, 80) * 0.6, ding() * 0.5), 0.5)
# 19 뇌
put(W('d7', '그대로', 1.7) + 0.15, pop_(700), 0.22); put(W('d7', '즐거움만', 5.3) + 0.15, pop_(1000), 0.22)
# 20 끝: 종이에 고쳐 적기
put(A('d8') + 0.5, scribble(1.4), 0.7)
put(E1('d8') - 0.6, soft(523, 1.6), 0.3)

mix = voice * 1.0 + bed + sfx * 0.55
sf.write('/dev/shm/wh/mix_raw.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/dev/shm/wh/mix_raw.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), '/dev/shm/wh/mix.wav'], check=True)
print('dur', round(DUR, 2), 'peak raw', round(float(np.abs(mix).max()), 2))
