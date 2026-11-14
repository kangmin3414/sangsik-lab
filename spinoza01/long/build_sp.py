"""voice + beds + synthesized SFX -> mix_b.wav (loudnorm -14)"""
import json, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, lfilter
SR = 44100; rng = np.random.default_rng(7)
def mx(*ws):
    n = max(len(w) for w in ws); return sum(np.pad(w, (0, n - len(w))) for w in ws)
TL = json.load(open('timeline_sp.json')); L = {l['id']: l for l in TL['lines']}; DUR = TL['duration']; N = int(DUR * SR)
voice, _ = sf.read('voice_sp.wav', dtype='float32'); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
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
place('bgm/moon.mp3', 0, A('n3') + 2.6, 0.36, fin=1.5, fout=3.0, off=0)        # 새벽 방 ~ 머릿속 극장
place('bgm/lens.mp3', A('n3') - 0.4, A('n9') + 2.2, 0.29, fin=2.5, fout=2.6, off=0)   # 스피노자의 작업대 ~ 2막
place('bgm/rain.mp3', A('n9') - 0.3, A('n14') + 2.0, 0.30, fin=2.5, fout=2.6, off=0)  # 3막: 그날의 날씨
place('bgm/dawn.mp3', A('n14') - 0.3, DUR, 0.32, fin=2.5, fout=3.0, off=0)            # 4막: 영사기를 끄고 ~ 끝
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
for k in range(4): put(A('s1') + 0.3 + k * 0.85, tick_(900, 0.7), 0.35)                       # 시계 초침
tOn = W('n1', '켜집니다', 4.5) - 0.9
put(tOn, soft(392), 0.5); put(tOn + 0.2, proj(E1('s2') - 0.6 - tOn), 0.16)                    # 극장 불, 영사기(필름이 멈출 때까지)
for k in range(5): put(A('t1') + 0.3 + k * 0.17 + 0.05 * (k % 2), tick_(2200, 0.5), 0.3)      # 타자
put(A('z1') + 0.9, beep(), 0.25); put(A('z1') + 1.2, beep(), 0.2)                             # 장애 알림
put(A('s2') + 0.2, whoosh(1.8), 0.14)                                                         # 밤이 지나감
put(A('s2') + 1.8, ding(), 0.3)                                                               # 고쳐짐
put(A('s2') + 2.3, rip(0.35), 0.12)                                                           # 봉투 바스락
put(A('s2') + 3.05, mx(tick_(700, 1.0), thud(0.08, 160) * 0.3), 0.6)                          # 필름이 멈춤
put(A('s3') + 0.4, whoosh(0.9), 0.12)                                                         # 돌아눕는 이불 소리
tT = W('n2', '태호와는', 4.9) - 0.25
put(A('n2') + 0.1, proj(tT - A('n2') - 0.1), 0.15)
for i in range(10): put(A('n2') + 0.4 + i * 0.16, thud(0.07, 220), 0.12)                      # 필름 통
put(tT + 0.75, mx(tone(2093, 0.35, 0.12, (1, 0.3)) * 0.3, tone(2637, 0.3, 0.1, (1,)) * 0.2), 0.5)   # 잔 부딪는 소리
put(W('n3', '스피노자는', 6.4) - 0.3, pop_(700), 0.2)
put(W('n3', '후회하는', 11.0) - 0.35, soft(523), 0.5); put(W('n3', '아프다', 15.3) - 1.05, mx(soft(392), soft(587)), 0.5)
put(A('n4') + 0.35, pop_(620), 0.25); put(A('n4') + 0.85, pop_(900), 0.2)
t2 = W('n4', '또', 2.5) - 0.15; put(t2, pop_(680), 0.25); put(t2 + 0.5, pop_(960), 0.2)
t3 = W('n4', '틀', 13.1) - 1.3
for i in range(8): put(t3 + i * 0.22, pop_(840 + i * 30), 0.14)
put(W('n5', '그래서', 7.9) - 0.2, soft(659, 1.8), 0.4)                                         # 아침
for i, (w, f) in enumerate([('비웃지도', 523), ('한탄하지도', 587), ('저주하지도', 659)]): put(W('n7', w, 1.6 + i * 1.2) - 0.1, soft(f), 0.45)
put(W('n7', '이해할', 7.0) - 0.1, mx(soft(784, 2.2), soft(523, 2.2), chime() * 0.5), 0.5)
tK = W('n8', '쫓겨난', 6.8) + 0.5
k = 0
while tK + k * 0.507 < E1('n8') + 0.3: put(tK + k * 0.507, step(), 0.5 * (1 - 0.06 * k)); k += 1   # 멀어지는 발소리
put(W('n8', '이해였습니다', 10.9) - 0.3, sparkle(), 0.22)
# ---------- 3막 ----------
def rainfx(d, g=1.0):
    n = int(d * SR); x = bp(noise(d), 1500, 6000)[:n] * 0.25 * g; k = int(min(0.8, d / 3) * SR); x[:k] *= np.linspace(0, 1, k); x[-k:] *= np.linspace(1, 0, k); return x
put(W('n9', '폭풍이나', 2.6) - 0.2, whoosh(1.6), 0.12)
put(W('n9', '옵니다', 13.1) - 0.2, rainfx(2.4), 0.5)
put(A('s5') + 0.6, rip(0.4), 0.14)
for i, (w, fb) in enumerate([('오픈', 5.1), ('처음', 7.9), ('친구의', 14.3)]): put(W('n10', w, fb) - 0.25 + 0.5, pop_(560 + i * 90), 0.22)
tR = W('n11', '비가', 2.0) - 0.5 if any('비가' in x['w'] for x in L['n11']['words']) else T0('n11') + 1.6
put(tR, rainfx(6.0), 0.45)
tK = W('n12', '너그러운', 11.1) - 0.3
for i in range(3): put(tK + i * 0.2, pop_(700 + i * 80), 0.2)
tI = W('n12', '나아지고', 17.6) - 0.2
for i in range(3): put(tI + i * 0.18, soft([523, 659, 784][i], 1.0), 0.3)
put(W('n13', '다만', 4.6) - 0.2, mx(soft(392, 2.0), soft(494, 2.0)), 0.35)
put(A('s6') + 0.15, proj(3.6), 0.12)
for k in range(5): put(A('s6') + 0.15 + 1.55 + k * 0.483, step(), 0.4)
put(A('s6') + 0.15 + 4.3, mx(soft(523, 2.4), soft(659, 2.4), soft(784, 2.4)), 0.45)                 # 어깨에 손
# ---------- 4막 ----------
tS = W('n14', '멈춥니다', 1.7) - 0.4
put(A('n14') + 0.1, proj(tS - A('n14') + 0.3), 0.14); put(tS + 0.5, tick_(700, 1.0), 0.4)          # 영사기가 멈춤
for k in range(26): put(A('s7') + 0.15 + 0.6 + k * 0.142 + 0.03 * (k % 3), tick_(1700 + 200 * (k % 2), 0.4), 0.16)   # 글자
put(A('s7') + 0.15 + 4.9, mx(whoosh(0.35) * 0.4, pop_(880)), 0.3)                                   # 보냄
put(A('s8') + 0.15 + 0.5, whoosh(1.4), 0.1); put(A('s8') + 0.15 + 2.3, soft(330, 2.0), 0.35)       # 막이 내림
put(A('s9') + 0.15 + 0.45, mx(tone(1568, 0.5, 0.25, (1, 0.3)) * 0.4, tone(2093, 0.45, 0.2, (1,)) * 0.25), 0.5)   # 알림
put(A('s9') + 0.15 + 1.6, whoosh(0.8), 0.1)
put(A('n17') + 0.3, mx(soft(440, 2.0), soft(554, 2.0)), 0.35)
k = 0
while A('s10') + 0.15 + 1.95 + k * 0.52 < E1('s10') + 0.4: put(A('s10') + 0.15 + 1.95 + k * 0.52, step(), 0.45 * (1 - 0.1 * k)); put(A('s10') + 0.15 + 2.2 + k * 0.52, step(), 0.38 * (1 - 0.1 * k)); k += 1
put(A('s10') + 0.15 + 3.5, thud(0.05, 300), 0.25)                                                   # 어깨 툭
put(W('n18', '벌', 9.9) - 0.2, soft(523), 0.4); put(W('n18', '이해를', 11.2) - 0.2, mx(soft(784, 2.2), soft(523, 2.2), chime() * 0.4), 0.45)
put(A('q1') + 0.4, mx(soft(392, 2.6), soft(587, 2.6)), 0.4)
put(A('q2') + 0.4, soft(523, 2.4), 0.4); put(A('q2') + 1.6, mx(soft(659, 3.0), soft(784, 3.0)), 0.4)
mix = voice * 1.0 + bed + sfx * 0.55
sf.write('mix_raw_sp.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'mix_raw_sp.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), 'mix_sp.wav'], check=True)
print('dur', round(DUR, 2), 'peak raw', round(float(np.abs(mix).max()), 2))
