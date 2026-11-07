"""voice + beds + synthesized SFX -> mix_b.wav (loudnorm -14)"""
import json, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, lfilter
SR = 44100; rng = np.random.default_rng(7)
def mx(*ws):
    n = max(len(w) for w in ws); return sum(np.pad(w, (0, n - len(w))) for w in ws)
TL = json.load(open('timeline_su.json')); L = {l['id']: l for l in TL['lines']}; DUR = TL['duration']; N = int(DUR * SR)
voice, _ = sf.read('voice_su.wav', dtype='float32'); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
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
place('bgm/eve.mp3', 0, T0('y1') + 0.2, 0.34, fin=0.8, fout=0.5, off=0)                 # 잠 못 드는 밤
place('bgm/oracle.mp3', T0('y1') - 0.1, T0('n1') + 0.6, 0.30, fin=0.2, fout=0.8, off=0)   # 예언이 등장
place('bgm/eve.mp3', T0('n1') + 0.2, T0('t0') - 0.1, 0.32, fin=1.2, fout=0.6, off=14)     # 단지 풍경 → 현관
place('bgm/bench.mp3', T0('s2') - 0.2, T0('y2') - 0.1, 0.26, fin=1.0, fout=0.4, off=0)    # 편의점 앞
place('bgm/oracle.mp3', T0('y2') - 0.15, E1('y2') + 0.5, 0.28, fin=0.1, fout=0.5, off=20) # 예언이의 비극 예언
place('bgm/bench.mp3', E1('y2') + 0.2, T0('n4') - 0.1, 0.21, fin=1.0, fout=0.6, off=40)   # 옆에 앉는다
place('bgm/oracle.mp3', T0('n4') - 0.2, T0('s6') + 0.3, 0.24, fin=0.8, fout=1.0, off=34)   # 구슬 클로즈업
place('bgm/bench.mp3', T0('s6') - 0.1, T0('s8') - 0.1, 0.22, fin=1.2, fout=0.5, off=60)      # 2막: 컵라면·두유·영수증
place('bgm/morning.mp3', T0('s8') - 0.2, E1('n6') + 0.4, 0.26, fin=0.6, fout=1.0, off=4)     # 영수증에 적기, 구슬이 넓어진다
place('bgm/bench.mp3', E1('n6') + 0.2, T0('m1') + 0.2, 0.22, fin=1.0, fout=0.8, off=82)      # 3막: 삼촌의 수능
place('bgm/memory.mp3', T0('m1') - 0.2, E1('m1') + 0.6, 0.36, fin=0.8, fout=1.0, off=0)      # 몽타주
place('bgm/bench.mp3', E1('m1') + 0.3, T0('s12') - 0.1, 0.2, fin=1.0, fout=0.6, off=20)      # "이렇게 됐지"
place('bgm/memory.mp3', T0('s12') - 0.3, E1('s13') + 0.3, 0.28, fin=1.0, fout=1.2, off=26)   # 어른들의 예언이
place('bgm/morning.mp3', T0('s14') - 0.2, T0('s18') - 0.1, 0.27, fin=0.8, fout=0.8, off=20)  # 수능 날
place('bgm/eve.mp3', T0('s18') - 0.1, T0('s19') - 0.2, 0.16, fin=0.6, fout=0.8, off=30)      # 고요한 1시 10분
place('bgm/dusk.mp3', T0('s19') - 0.3, DUR, 0.32, fin=1.2, fout=2.5, off=0)                  # 해 질 녘 → 질문
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
# 인트로: 째깍, 뿅, 이불 바스락
for k in range(int(E1('y1') / 1.0)): put(0.6 + k * 1.0, tick_(1300 if k % 2 else 1000, 0.55))
put(A('y1') + 0.3, mx(pop_(1500), whoosh(0.3)), 0.7); put(A('y1') + 0.75, sparkle(), 0.35)
put(W('y1', '끝', 3.1), bp(noise(0.4), 500, 4000) * env(int(0.4 * SR), 0.02, 0.15), 0.35)
# n1: 창에서 단지 전체로 빠지는 카메라, 예언이 구슬들 반짝
put(A('n1') + 0.4, whoosh(1.2), 0.35)
tM = W('n1', '망하면', 10.0); put(tM, sparkle(), 0.35); put(W('n1', '끝이다', 11.8), tone(110, 1.4, 0.9, (1, 0.5, 0.25)) * 0.35)
# s1: 까치발, 딸깍
for k in range(5): put(A('s1') + 0.3 + k * 0.38, step(), 0.12)
put(A('s1') + 2.75, click(), 0.6)
# 타이틀
put(T0('t0') + 0.2, crackle(0.8), 0.5); put(T0('t0') + 0.2, hum(1.6), 1.0)
# s2: 슬리퍼 걸음 → 멈칫
for k in range(7): put(A('s2') + 0.15 + k * 0.27, flap(), 0.35)
put(A('s2') + 1.85, pop_(700), 0.3)
# z2: "3번!" 띵 → "?" 
put(W('z2', '3번', 1.3) + 0.05, ding(), 0.35); put(W('z2', '요즘', 3.3), bwoop(), 0.5)
# s3: 번쩍(구슬 번개)
put(A('s3') + 0.1, zap(), 0.55)
# y2: 예언 — 비, 달력 넘어가는 소리
put(A('y2') + 0.2, mx(whoosh(0.4), sparkle()), 0.4)
put(W('y2', '비', 2.3), lp(noise(2.6), 3000) * np.sin(np.linspace(0, np.pi, int(2.6 * SR))) * 0.12, 1.0)
for k in range(5): put(W('y2', '내내', 1.8) + k * 0.16, rip(0.12), 0.18)
# s4: 말풍선 뿅 → 쏙, 걸음, 앉기
put(A('s4') + 0.25, pop_(1000), 0.35); put(A('s4') + 1.1, suck(), 0.7)
for k in range(3): put(A('s4') + 1.45 + k * 0.24, flap(), 0.3)
put(A('s4') + 2.62, thud(0.25, 110), 0.5)
# n3 → 구슬
put(W('n3', '버릇', 4.0), pop_(900), 0.3)
# suball: 구슬 클로즈업, 줌, 라벨
put(A('n4'), mx(whoosh(0.6), sparkle()), 0.45); put(W('n4', '크게', 1.2), whoosh(0.8), 0.4)
put(W('n5', '영향력', 1.8) - 0.1, mx(pop_(700), thud(0.25, 120)), 0.5)
put(W('n5', '크고', 9.4) - 0.05, mx(pop_(800), thud(0.2, 150)), 0.45)
tL = W('n5', '길게', 10.3)
for k in range(12): put(tL + k * 0.08, rip(0.06), 0.12)
put(tL + 0.1, pop_(1100), 0.35)
put(A('s5') + 0.3, sparkle(), 0.3)

# ================= 2막 =================
def chime2(): return mx(tone(988, 0.5, 0.3, (1, 0.3)) * 0.4, np.pad(tone(784, 0.6, 0.35, (1, 0.3)) * 0.4, (int(0.22 * SR), 0)))  # 딩동
def clink(): return mx(tone(2400, 0.25, 0.08, (1, 0.5)) * 0.35, tone(3100, 0.2, 0.06, (1,)) * 0.2)
def scribble(d=0.6): n = noise(d); t = np.arange(len(n)) / SR; return bp(n, 1800, 6000) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 9 * t))) * 0.35
def rattle(d=0.9): t = np.arange(int(d * SR)) / SR; return bp(noise(d), 800, 4000) * (np.sin(2 * np.pi * 18 * t) > 0) * 0.4
def slurp(): t = np.arange(int(0.45 * SR)) / SR; return bp(noise(0.45), 300, 2500) * (0.5 + 0.5 * np.sin(2 * np.pi * 14 * t)) * env(len(t), 0.02, 0.25) * 0.5
def rumble(d=1.2): return lp(noise(d), 120) * np.sin(np.linspace(0, np.pi, int(d * SR))) * 1.2
put(A('s6') + 0.2, creak(0.4), 0.5)
for k in range(4): put(A('s6') + 0.5 + k * 0.24, flap(), 0.3)
put(A('s6') + 1.5, chime2(), 0.5); put(A('s6') + 2.1, chime2(), 0.35)
for k in range(5): put(A('s6') + 2.2 + k * 0.26, flap(), 0.3)
put(W('z3', '이거', 0.5) + 0.3, clink(), 0.6)
put(A('s7') + 0.6, thud(0.2, 120), 0.45); put(A('s7') + 1.15, thud(0.12, 260), 0.35); put(A('s7') + 1.45, rip(0.5), 0.25); put(A('s7') + 2.25, whoosh(0.2), 0.3)
put(A('w3') + 0.6, rip(0.3), 0.3)
for i in range(6): put(A('s8') + 0.4 + i * 0.85, scribble(0.55), 0.35); put(A('s8') + 0.95 + i * 0.85, whoosh(0.25), 0.18)
put(A('s8') + 2.6, rattle(0.9), 0.4)
put(A('w4') + 0.3, scribble(0.5), 0.3)
put(W('n6', '아무리', 7.0), mx(pop_(800), chime()), 0.35)
# ================= 3막 =================
put(A('s9') + 0.2, rip(0.35), 0.3); put(A('s9') + 1.1, slurp(), 0.45)
put(W('z5', '근데', 3.6) + 0.3, bp(noise(0.25), 1500, 5000) * env(int(0.25 * SR), 0.01, 0.08), 0.25)
put(A('w6') + 0.2, pop_(1100), 0.25)
for i in range(5):
    t0 = A('m1') + 0.15 + i * 2.7
    put(t0, whoosh(0.5), 0.3)
    if i == 0: put(t0 + 0.3, rumble(1.6), 0.6)
    else: put(t0 + 0.75, mx(pop_(900 + 80 * i), tone(1568, 0.3, 0.15, (1,)) * 0.3), 0.4)
for k, tt in enumerate([0, 0.65, 1.3, 1.95]): put(A('s10') + tt, mx(whoosh(0.18), pop_(900 + 120 * k)), 0.4)
put(A('s11') + 0.75, mx(pop_(1200), chime()), 0.4)
for k in range(8): put(A('s12') + k * 0.42, step(), 0.12)
put(W('n7', '어른', 1.2), chime(), 0.25)
put(A('s13') + 0.3, bwoop(), 0.4); put(A('s13') + 1.3, rip(0.4), 0.3)
# ================= 결말 =================
put(A('s14'), lp(noise(5.0), 220) * 0.25, 0.6)
for k in range(5): put(A('s14') + 0.4 + k * 0.5, tick_(900, 0.25))
put(A('s14') + 2.6, pop_(900), 0.3)
put(A('s15') + 0.6, ding(), 0.45)
for k in range(12): put(A('s16') + 0.2 + k * 0.3, snap(), 0.15)
put(A('s16') + 2.7, mx(pop_(1000), chime()), 0.35)
for k in range(7): put(A('s16') + 2.5 + k * 0.3, step(), 0.15)
put(A('n8') + 0.3, zap() * 0.6, 0.45)
put(A('s17') + 0.35, pop_(600), 0.35); put(A('s17') + 2.5, rip(0.35), 0.3); put(A('s17') + 4.0, clink(), 0.35)
put(A('s18'), lp(noise(5.4), 400) * np.sin(np.linspace(0, np.pi, int(5.4 * SR))) * 0.25, 0.6)
for k in range(9): put(A('s19') + 0.2 + k * 0.33, step(), 0.12)
put(W('n10', '다만', 3.2) - 0.1, rip(0.4), 0.3); put(A('s20') + 0.3, rip(0.3), 0.25)
put(A('n11') + 0.2, chime(), 0.3)
mix = voice * 1.0 + bed + sfx * 0.55
sf.write('mix_raw_su.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'mix_raw_su.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), 'mix_su.wav'], check=True)
print('dur', round(DUR, 2), 'peak raw', round(float(np.abs(mix).max()), 2))
