"""voice + beds + synthesized SFX -> mix_b.wav (loudnorm -14)"""
import json, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, lfilter
SR = 44100; rng = np.random.default_rng(7)
def mx(*ws):
    n = max(len(w) for w in ws); return sum(np.pad(w, (0, n - len(w))) for w in ws)
TL = json.load(open('timeline_dg.json')); L = {l['id']: l for l in TL['lines']}; DUR = TL['duration']; N = int(DUR * SR)
voice, _ = sf.read('voice_dg.wav', dtype='float32'); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
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
place('bgm/rush.mp3', 0, T0('s2') + 0.3, 0.3, fin=0.3, fout=0.8, off=0)        # 알림·배낭·계단
place('bgm/greek.mp3', T0('s2') - 0.2, T0('t0') - 0.1, 0.3, fin=1.0, fout=0.6, off=0)   # 코린토스
place('bgm/greek.mp3', T0('n4') - 0.3, DUR, 0.28, fin=1.0, fout=1.8, off=24)          # 1막
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
def sparkle(): return mx(chime() * 0.6, tone(2637, 0.6, 0.3, (1,)) * 0.15)
def noti(): return mx(tone(1320, 0.12, 0.06, (1,)) * 0.35, np.pad(tone(1760, 0.14, 0.08, (1,)) * 0.3, (int(0.09 * SR), 0)))
def clink(): return mx(tone(2400, 0.25, 0.08, (1, 0.5)) * 0.35, tone(3100, 0.2, 0.06, (1,)) * 0.2)
def slide(d=0.5): t = np.arange(int(d * SR)) / SR; f = 900 - 600 * t / d; return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.02, 0.15) * 0.3
def trumpet(): t = np.arange(int(0.9 * SR)) / SR; f = np.where(t < 0.3, 392, np.where(t < 0.5, 523, 659)); s = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.5 + np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.5; return lp(s, 2500) * env(len(t), 0.03, 0.2) * 0.25
def yawn_dog(): t = np.arange(int(0.7 * SR)) / SR; f = 500 - 250 * t / 0.7; return bp(np.sin(2 * np.pi * np.cumsum(f) / SR) + noise(0.7) * 0.2, 200, 2000) * env(len(t), 0.05, 0.3) * 0.35
def gulp(): return mx(bwoop() * 0.6, tone(180, 0.15, 0.06, (1, 0.3)) * 0.3)
# 인트로: 알림(폰) → 물건이 날아가 → 배낭에 쿵 (dghallScene T, FLY 0.35, LAND 0.85)
for i, v in enumerate([0.3, 1.1, 1.9, 2.7, 3.5]):
    put(T0('s0') + v, noti(), 0.55); put(T0('s0') + v + 0.38, whoosh(0.4), 0.25); put(T0('s0') + v + 0.85, mx(thud(0.25, 90 + 10 * i), pop_(400)), 0.55 + 0.05 * i)
put(T0('n1') + 0.2, sparkle(), 0.25)
for k in range(4): put(T0('n1') + 1.6 + 0.45 * k, step(), 0.22)
# 계단: 세 번 올라섬(hop 착지), 휘청 → 주르륵
for v in [0.25, 0.95, 1.65]: put(T0('s1') + v + 0.45, step(), 0.28)
put(T0('s1') + 1.8, creak(0.6), 0.4)
put(W('n2', '끌고', 2.25) + 0.1, slide(0.6), 0.6)
# 코린토스: 모래빛 전환, 행진, 나팔
put(A('s2'), whoosh(0.8), 0.4); put(A('s2') + 0.7, trumpet(), 0.35)
for k in range(8): put(T0('s2') + 0.6 + k * 0.27, step(), 0.18)
put(T0('s3') + 0.47, pop_(1400), 0.3)
put(W('d1', '비켜', 1.24) + 0.1, whoosh(0.35), 0.3)
for k in range(3): put(T0('s4') + 0.25 + k * 0.27, step(), 0.2)
put(T0('s4') + 0.9, sparkle(), 0.35); put(T0('s4') + 1.25, yawn_dog(), 0.5)
put(W('n3', '디오게', 5.2) - 0.05, pop_(800), 0.2); put(E1('n3') + 0.05, chime(), 0.35)
put(T0('t0') + 0.2, crackle(0.8), 0.5)
# 1막
put(T0('n4') + 0.5, pop_(600), 0.4); put(W('n4', '항아리', 4.3), mx(pop_(1000), thud(0.15, 200)), 0.35)
for k in ['외투', '항이', '자루', '컵']: put(W('n5', k, 1.0) - 0.05, mx(pop_(900), tick_(2000, 0.5)), 0.4)
# 샘터: 물소리, 아이 꿀꺽 두 번, 자루 → 컵 → 던짐 → 땡그랑, X, 엄지
water = lp(noise(E1('s5b') - T0('s5') + 0.6), 2500) * 0.07; water[:int(0.4 * SR)] *= np.linspace(0, 1, int(0.4 * SR)); water[-int(0.6 * SR):] *= np.linspace(1, 0, int(0.6 * SR)); put(T0('s5') - 0.2, water, 1.0)
put(T0('s5') + 1.35, gulp(), 0.5); put(T0('n6') + 0.8 + 1.35, gulp(), 0.4)
put(W('n6', '보고', 2.82) + 0.4, rip(0.3), 0.25)
tR = W('n6', '던져', 4.44) + 0.3; put(tR - 0.05, whoosh(0.35), 0.5); put(tR + 0.75, clink(), 0.6); put(tR + 1.1, clink(), 0.35); put(tR + 1.45, clink(), 0.2)
put(W('d2', '구먼', 2.22) + 0.05, mx(pop_(500), thud(0.15, 160)), 0.3)
put(T0('s5b') + 0.2, sparkle(), 0.3)
put(E1('n7a') + 0.1, bwoop(), 0.3)
for k in range(5): put(W('n7b', '따르는', 2.66) + 0.2 + 0.4 * k, step(), 0.2)
put(W('n7b', '견유', 5.06) + 0.05, mx(pop_(800), chime()), 0.35)
mix = voice * 1.0 + bed + sfx * 0.55
sf.write('mix_raw_dg.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'mix_raw_dg.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-13.4:TP=-1.0:LRA=11', '-ar', str(SR), 'mix_dg.wav'], check=True)
print('dur', round(DUR, 2), 'peak raw', round(float(np.abs(mix).max()), 2))
