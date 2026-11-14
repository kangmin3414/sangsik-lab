"""voice + beds + synthesized SFX -> mix_b.wav (loudnorm -14)"""
import json, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, lfilter
SR = 44100; rng = np.random.default_rng(7)
def mx(*ws):
    n = max(len(w) for w in ws); return sum(np.pad(w, (0, n - len(w))) for w in ws)
TL = json.load(open('timeline_cmp.json')); L = {l['id']: l for l in TL['lines']}; DUR = TL['duration']; N = int(DUR * SR)
voice, _ = sf.read('voice_cmp.wav', dtype='float32'); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
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
LENS = '../../spinoza01/long/bgm/lens.mp3'
place(LENS, 0, E1('as2') + 0.6, 0.30, fin=1.2, fout=2.0, off=0)
place(LENS, A('cB') - 0.2, DUR, 0.30, fin=1.2, fout=2.5, off=0)
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

def creak_soft(d=0.7): t = np.arange(int(d * SR)) / SR; f = 260 + 90 * t / d; return np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.1 * np.sin(np.linspace(0, np.pi, len(t))) ** 2
def steps(t0, t1, iv=0.5, g=0.35):
    k = 0
    while t0 + k * iv < t1: put(t0 + k * iv, step(), g); k += 1
# ---------- A: 지금 방식(글자가 뜰 때마다 작은 팝) ----------
put(A('cA') + 0.15, pop_(700), 0.25)
put(W('a1', '문이', 2.4), pop_(620), 0.25); put(W('a1', '상투', 6.3), pop_(760), 0.22); put(W('a1', '가슬', 8.3), pop_(820), 0.22)
tA = L['a1']['t0'] + [w['t'] for w in L['a1']['words'] if '어른이' in w['w']][-1]; put(tA, soft(523), 0.45)
put(A('a2') + 0.5, pop_(620), 0.2); put(W('a2', '열일곱', 1.6), soft(440), 0.45); put(W('a2', '너무', 3.1), pop_(760), 0.22)
put(W('a3', '스무', 2.9), pop_(700), 0.22); put(W('a3', '서른', 4.5), pop_(780), 0.22); put(W('a3', '문이', 9.9), soft(392), 0.45)
put(A('a4') + 0.3, pop_(700), 0.22); put(W('a4', '15', 3.0), soft(494), 0.4)
put(A('a5') + 0.3, pop_(620), 0.2); put(W('a5', '문턱', 1.2), pop_(820), 0.22); put(W('a5', '낮아서', 4.2), soft(523), 0.4)
# ---------- B: 새 방식(움직임에 붙는 소리) ----------
put(A('cB') + 0.15, pop_(700), 0.25)
tS, tG = W('b1', '상투', 6.3), W('b1', '가슬', 8.3); tB = L['b1']['t0'] + [w['t'] for w in L['b1']['words'] if '어른이' in w['w']][-1]
steps(A('b1') + 0.4, tS - 0.8, 0.62, 0.3)                                              # 소년의 걸음
put(W('b1', '문이', 2.4), soft(392, 1.8), 0.35)                                         # 문이 빛남
put(tS, sparkle(), 0.2); put(tG - 0.15, whoosh(0.3), 0.12); put(tG + 0.12, mx(thud(0.07, 260) * 0.5, soft(587, 1.0)), 0.4)   # 상투, 갓이 내려앉음
put(tB - 0.5, creak_soft(0.6), 0.5); steps(tB + 0.1, min(tB + 2.2, E1('b1') + 0.4), 0.5, 0.32)   # 문 열림, 지나감
put(tB + 0.85, mx(soft(659, 1.6), soft(784, 1.6)), 0.4)                                 # '어른' 이름표
tE = W('b2', '너무', 3.1)
steps(A('b2') + 0.3, tE - 0.4, 0.6, 0.28); put(tE - 0.5, whoosh(1.5), 0.2); put(tE - 0.1, creak_soft(0.5), 0.6)   # 바람, 문이 먼저 열림
steps(tE + 1.7, E1('b2') + 0.4, 0.6, 0.26)
tNo = W('b3', '문이', 9.9)
steps(A('b3') + 0.3, tNo + 0.7, 0.5, 0.3)                                               # 제로의 걸음
put(W('b3', '스무', 2.9), tick_(900, 0.8), 0.3); put(W('b3', '서른', 4.5), tick_(900, 0.8), 0.3)
put(W('b3', '어디', 8.3) - 0.3, soft(330, 1.8), 0.3); put(tNo, whoosh(0.9), 0.1)         # 점선 문이 나타났다 사라짐
put(A('b4') + 0.2, mx(whoosh(0.3) * 0.4, thud(0.08, 200) * 0.4), 0.35)                  # 판이 선다
put(W('b4', '요즘', 0.25), pop_(760), 0.22); put(W('b4', '예전', 1.9), pop_(640), 0.22)
t15 = W('b4', '15', 3.0); put(t15 - 0.25, slide_down(0.9), 0.3); put(t15 + 0.75, soft(494), 0.4)   # 18이 15 칸으로
put(W('b4', '조사', 4.7), tick_(1200, 0.8), 0.3)
put(A('bs1') + 1.05, soft(523, 2.0), 0.35)                                              # 발밑의 문턱
tT = W('b5', '문턱', 1.2)
for i in range(3): put(tT + i * 0.4, soft([523, 659, 784][i], 1.6), 0.4)                # 문턱 셋
tL = W('b5', '낮아서', 4.2)
for i in range(13): put(tL + i * 0.09, step(), 0.2)                                     # 지나온 발자국
for i in range(3): put(A('bs2') + 0.75 + i * 0.4, pop_(640 + i * 90), 0.22)             # 요약 띠
mix = voice * 1.0 + bed + sfx * 0.55
sf.write('/dev/shm/cmp/mix_raw.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/dev/shm/cmp/mix_raw.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), '/dev/shm/cmp/mix.wav'], check=True)
print('dur', round(DUR, 2), 'peak raw', round(float(np.abs(mix).max()), 2))
