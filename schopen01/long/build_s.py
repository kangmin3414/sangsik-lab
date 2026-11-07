"""voice + beds + synthesized SFX -> mix_b.wav (loudnorm -14)"""
import json, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, lfilter
SR = 44100; rng = np.random.default_rng(7)
def mx(*ws):
    n = max(len(w) for w in ws); return sum(np.pad(w, (0, n - len(w))) for w in ws)
TL = json.load(open('timeline_s.json')); L = {l['id']: l for l in TL['lines']}; DUR = TL['duration']; N = int(DUR * SR)
voice, _ = sf.read('voice_s.wav', dtype='float32'); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
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
place('bgm/quirky.mp3', 0, T0('s1') - 0.1, 0.30, fin=0.3, fout=0.5, off=3.5)
place('bgm/mystery.mp3', T0('s1') - 0.2, T0('t0') + 0.1, 0.34, fin=0.4, fout=0.4, off=0)
place('bgm/flute.mp3', T0('n7') - 0.3, T0('a1') - 0.2, 0.34, fin=0.6, fout=0.6, off=3.5)
place('bgm/tick.mp3', T0('a1') - 0.4, T0('b1') - 0.2, 0.34, fin=0.8, fout=0.6, off=3.5)          # 1막: 시계추
place('bgm/quirky.mp3', T0('b1') - 0.3, T0('b4') - 0.1, 0.28, fin=0.4, fout=0.5, off=30)        # 2막: 장바구니·바닷물
place('bgm/tick.mp3', T0('b4') - 0.2, T0('d1') - 0.3, 0.26, fin=0.8, fout=0.8, off=48)          # 권태·쳇바퀴·시계추
place('bgm/flute.mp3', T0('d1') - 0.4, T0('h1') - 0.3, 0.32, fin=0.6, fout=1.0, off=20)         # 쇼펜하우어의 일상
place('bgm/sunset.mp3', T0('h1') - 0.4, T0('f1') - 0.3, 0.32, fin=2.0, fout=1.2, off=3.5)       # 힌트
place('bgm/musicbox.mp3', T0('f1') - 0.3, T0('f3') + 1.2, 0.24, fin=1.5, fout=1.0, off=3.5)    # 결말: 밤, 알림
place('bgm/sunset.mp3', T0('f3') + 0.6, DUR, 0.28, fin=1.8, fout=2.5, off=40)                    # 헤드셋을 쓰면 노래가 흐른다
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
# n1: 탈락 알림 23번 → 당첨
tW = W('n1', '당첨', 5.5)
for k in range(23): put(A('n1') + 0.25 + k * (tW - A('n1') - 0.55) / 23, bwoop(), 0.16 + 0.005 * k)
put(tW, fanfare(), 0.35); put(L['n1']['t1'] + 0.05, chime(), 0.6); put(tW + 0.05, whoosh(0.3), 0.3); put(L['n1']['t1'] + 0.1, thud(0.25, 110), 0.5)
# n2: 빙글 → 침대(휙) → 코골이
put(A('n2') + 0.1, whoosh(0.5), 0.4); put(A('n2') + min(1.2, (L['n2']['t1'] - L['n2']['t0']) * 0.45), whoosh(0.25), 0.5); put(A('n2') + 1.3, snore(min(1.0, L['n2']['t1'] - L['n2']['t0'] - 1.0)), 0.3)
# n3: 발소리, 까치발 점프, 휴
D3 = L['n3']['t1'] - L['n3']['t0'] + 0.15; hop = min(0.75, D3 * 0.32)
for k in range(2, int(D3 / 0.28)):
    tt = A('n3') + k * 0.28
    if not (hop - 0.05 < k * 0.28 < hop + 0.6): put(tt, step(), 0.18)
put(A('n3') + hop + 0.1, pop_(900), 0.2); put(A('n3') + hop + 0.6, step(), 0.25); put(L['n3']['t1'] + 0.05, splash() * 0.3, 0.4)
# n4: 먼지, 카메라 빠짐
put(A('n4') + 0.2, tape_stop(0.5), 0.35); put(W('n4', '그냥', 1.6), pop_(700), 0.4)
# n5: 질문
put(W('n5', '짧을', 3.4), pop_(1200), 0.4)
# s1: 꼬르륵 → 뿅 → 착지
put(A('s1') + 0.25, gurgle(0.75), 1.0); put(A('s1') + 1.0, mx(pop_(1500), whoosh(0.4)), 0.8); put(A('s1') + 1.55, thud(0.2, 160), 0.6)
# k1: 꼬르륵 (대사 아래 살짝)
put(A('k1') - 0.5, gurgle(0.45), 0.5)
# n6: 캐릭터 카드, 세피아
put(W('n6', '범인', 0.1), mx(pop_(600), thud(0.25, 120)), 0.6); put(W('n6', '200', 2.8), tone(196, 1.6, 0.9, (1, 0.5, 0.3)) * 0.25)
# 타이틀
put(T0('t0') + 0.2, crackle(0.8), 0.5); put(T0('t0') + 0.4, tone(140, 1.2, 0.8, (1, 0.4)) * 0.2)
# n7: 이름 카드, 시계추
put(W('n7', '아르투어', 0.9) - 0.3, mx(pop_(700), thud(0.25, 110)), 0.5)
tP = W('n7', '시계추', 5.2)
for k in range(4): put(tP + 0.1 + k * 0.56, tone(1800 if k % 2 else 1500, 0.06, 0.03, (1,)) * 0.35)

# ================= 1막: 시계추 =================
def tick_(f=1500, g=1.0): return tone(f, 0.05, 0.02, (1,)) * 0.3 * g
for lid in ['a1', 'a2', 'a3', 'a4', 'a5']:
    for k in range(int((L[lid]['t1'] - A(lid)) / 0.53)): put(A(lid) + k * 0.53, tick_(1500 if k % 2 else 1200, 0.5))
for k in range(int((L['a5']['t1'] - A('a1')) / 1.6)):
    tt = A('a1') + k * 1.6
    if not (A('a2') - 0.2 < tt < L['a3']['t1']): put(tt, whoosh(0.7) * 0.5, 0.35)
put(W('a1', '고통', 2.6) - 0.3, pop_(700), 0.4); put(W('a1', '권태', 3.4) - 0.3, pop_(600), 0.4)
put(A('a2') + 0.3, gurgle(0.9), 0.7); put(A('a2') + 1.2, tone(2200, 0.15, 0.08, (1,)) * 0.3)
put(A('a3') + 0.05, whoosh(0.7), 0.6); put(A('a3') + 2.0, slide_down(0.8), 0.4)
for k in range(int((L['a4']['t1'] - A('a4')) / 1.6)): put(A('a4') + 0.8 + k * 1.6, tone(2093, 0.4, 0.2, (1, 0.3)) * 0.18)
put(W('a4', '멈춘', 4.8) - 0.2, mx(pop_(700), chime()), 0.4)
put(A('a5') + 0.2, tape_stop(0.9)[::-1] * 0.6, 0.5); put(A('a5') + 1.4, whoosh(0.5), 0.8)
tW_ = W('a6', '평일', 2.4)
for i in range(6): put(tW_ + i * 0.22, thud(0.18, 150), 0.45)
put(W('a6', '일요일', 4.6), thud(0.25, 110), 0.6)
for k in range(int((L['a7']['t1'] - A('a7')) / 0.25)): put(A('a7') + k * 0.25, tick_(1700, 0.35))
# ================= 2막 =================
D1 = L['b1']['t1'] - L['b1']['t0'] + 0.15
for i in range(9): put(A('b1') + (i + 1) * D1 / 10, thud(0.2, 130), 0.5)
for k in range(int(D1 / 0.14)):
    if k % 2: put(A('b1') + k * 0.14, bp(noise(0.02), 2500, 7000) * env(int(0.02 * SR), 0.001, 0.005), 0.25)
def slurp(): t = np.arange(int(0.45 * SR)) / SR; return bp(noise(0.45), 300, 2500) * (0.5 + 0.5 * np.sin(2 * np.pi * 14 * t)) * env(len(t), 0.02, 0.25) * 0.5
for s0 in [0.6, 2.6, 5.0]:
    if A('b2') + s0 < L['b2']['t1']: put(A('b2') + s0, slurp(), 0.5); put(A('b2') + s0 + 0.7, gurgle(0.4), 0.35)
put(W('b2', '부는', 3.2), pop_(700), 0.4)
for i in range(4): put(A('b3') + 0.2 + i * 0.3, pop_(1000 + 150 * i), 0.3)
put(A('b4'), tone(130, 2.0, 1.2, (1, 0.5, 0.2)) * 0.2); put(W('b4', '권태', 2.8), tone(880, 0.6, 0.4, (1, 0.3)) * 0.25)
tN_ = W('b5', '새로운', 1.6)
for k in range(int((L['b5']['t1'] - A('b5')) / 0.4)): put(A('b5') + k * 0.4, whoosh(0.15) * 0.4, 0.3)
put(tN_ - 0.2, mx(pop_(1400), snap()), 0.5); put(tN_, gurgle(0.6), 0.5)
put(A('b6'), creak(L['b6']['t1'] - A('b6')) * 0.8, 0.5)
for k in range(int((L['b6']['t1'] - A('b6')) / 0.16)): put(A('b6') + k * 0.16, bp(noise(0.04), 300, 1500) * env(int(0.04 * SR), 0.001, 0.01), 0.18)
put(W('b6', '쳇바퀴', 1.6), pop_(800), 0.4)
for k in range(int((L['b7']['t1'] - A('b7')) / 1.0)): put(A('b7') + k * 1.0, tick_(900, 0.5))
# ================= 3막 앞: 쇼펜하우어의 일상 =================
for k in range(int((L['d0']['t1'] - A('d0')) / 1.4)): put(A('d0') + k * 1.4, tick_(900, 0.4))
put(W('d0', '쇼펜', 1.4) - 0.3, mx(whoosh(0.4), thud(0.2, 140)), 0.4); put(W('d0', '일상', 3.2), chime(), 0.35)
put(A('d1'), lp(noise(L['d2']['t1'] - A('d1')), 400) * 0.1)
put(W('d1', '꼬르륵', 1.0), gurgle(0.6), 0.5); put(W('d1', '꼬르륵', 1.0) + 0.3, pop_(1200), 0.4)
put(W('d1', '같은', 5.6), mx(tick_(1500, 1.2), pop_(900)), 0.5); put(W('d1', '같은', 5.6) + 0.15, pop_(900), 0.4)
put(W('d2', '꽉', 1.6), mx(*[np.pad(pop_(900 + 120 * i), (int(i * 0.06 * SR), 0)) for i in range(5)]), 0.35)
put(W('d2', '첫', 3.0), mx(thud(0.35, 90), snap()), 0.7)
put(W('d2', '시계추', 5.6) - 0.2, whoosh(0.5), 0.4); put(W('d2', '기운', 6.6), tone(165, 1.0, 0.5, (1, 0.5)) * 0.3)
D3 = L['d3']['t1'] - L['d3']['t0'] + 0.15; tJ3 = W('d3', '일과', L['d3']['t0'] + D3 - 2.0) - A('d3')
for k in range(int(max(0, tJ3 - 0.4) / 0.45)): put(A('d3') + k * 0.45, bp(noise(0.05), 200, 1200) * env(int(0.05 * SR), 0.001, 0.015), 0.25)
put(A('d3') + tJ3, mx(pop_(800), tone(1320, 0.5, 0.3, (1, 0.4)) * 0.4), 0.45)
put(W('d4', '플루트', 1.6), chime(), 0.2); put(W('d4', '잠들', 5.0), mx(slide_down(0.8), pop_(600)), 0.3)
# ================= 3막: 힌트 =================
put(W('h1', '힌트', 0.6), mx(pop_(700), chime()), 0.4)
put(A('h2'), crackle(L['h2']['t1'] - A('h2') - 1.0), 0.12)
for k in range(8): put(A('h2') + k * 0.5 * (1 + k * 0.15), whoosh(0.3) * 0.5, 0.12)
put(W('h2', '멈춰', (L['h2']['t1'] - L['h2']['t0']) - 1.6), thud(0.4, 70), 0.5)
put(A('h3') + 0.3, mx(pop_(700), chime()), 0.4)
for key, fb in [('어떤', 3.4), ('가진', 5.0), ('보이는', 7.2)]: put(W('h4', key, fb) - 0.2, pop_(900), 0.4)
put(L['h4']['t1'] - 1.2, chime(), 0.5)
D5 = L['h5']['t1'] - L['h5']['t0'] + 0.15
for k in range(int(D5 / 0.33)): put(A('h5') + k * 0.33, bp(noise(0.05), 200, 1200) * env(int(0.05 * SR), 0.001, 0.015), 0.22)
for i in range(3): put(A('h5') + 0.6 + i * (D5 - 1.4) / 3 + 0.5, pop_(1200 + 200 * i), 0.35)
# ================= 결말 =================
put(W('f1', '알림', 1.0) - 0.1, mx(lp(noise(0.3), 120) * 0.8, ding()), 0.45)
put(A('k2') - 0.6, gurgle(0.5), 0.6); put(A('k2') - 0.05, pop_(1500), 0.4); put(L['k2']['t1'] + 0.05, thud(0.2, 160), 0.35)
put(W('f2', '쇼펜', 2.4) - 0.2, mx(whoosh(0.3), thud(0.15, 200)), 0.35)
tA2 = W('f2', '알아차', 5.4); put(tA2 - 0.1, mx(pop_(1100), chime()), 0.45)
for k in range(int((L['f2']['t1'] - tA2) / 0.6)): put(tA2 + 0.6 + k * 0.6, tick_(1300 if k % 2 else 1000, 0.6))
put(W('f3', '버튼', 0.6) + 0.3, thud(0.15, 220), 0.4)
put(W('f3', '헤드셋', 1.9) + 0.2, mx(whoosh(0.3), pop_(700)), 0.45)
for k in range(int((L['f4']['t1'] - A('f4')) / 1.2)): put(A('f4') + 0.6 + k * 1.2, tick_(800, 0.25))
put(A('f4') + 0.4, mx(pop_(900), thud(0.15, 180)), 0.35)
mix = voice * 1.0 + bed + sfx * 0.55
sf.write('mix_raw_s.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'mix_raw_s.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), 'mix_s.wav'], check=True)
print('dur', round(DUR, 2), 'peak raw', round(float(np.abs(mix).max()), 2))
