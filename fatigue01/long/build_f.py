"""voice + beds + synthesized SFX -> mix_b.wav (loudnorm -14)"""
import json, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, lfilter
SR = 44100; rng = np.random.default_rng(7)
def mx(*ws):
    n = max(len(w) for w in ws); return sum(np.pad(w, (0, n - len(w))) for w in ws)
TL = json.load(open('timeline_f.json')); L = {l['id']: l for l in TL['lines']}; DUR = TL['duration']; N = int(DUR * SR)
voice, _ = sf.read('voice_f.wav', dtype='float32'); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
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
place('bgm/hustle.mp3', 0, T0('n4') + 0.2, 0.42, fin=0.3, fout=0.5, off=0)
place('bgm/mystery.mp3', T0('c1') - 0.2, T0('t0') + 0.2, 0.40, fin=0.4, fout=0.4, off=0)
place('bgm/mystery.mp3', T0('n7') - 0.1, T0('a1') - 0.2, 0.36, fin=0.5, fout=0.6, off=20)
place('bgm/ragtime.mp3', T0('a1') - 0.3, T0('a4') + 1.6, 0.34, fin=0.4, fout=1.2, off=0)      # 1막: 규율사회 (옛날 공장)
place('bgm/hustle.mp3', T0('a4') + 1.2, T0('a10') - 0.2, 0.32, fin=1.0, fout=0.8, off=26)    # 성과사회: 할 수 있다
place('bgm/uneasy.mp3', T0('a10') - 0.3, T0('Z1') - 0.05, 0.38, fin=1.0, fout=0.2, off=0)    # 2막: 안에 있는 감시자
place('bgm/warm.mp3', T0('s3') + 0.4, T0('e0') - 0.3, 0.30, fin=2.5, fout=1.5, off=0)        # 3막: 힌트들
place('bgm/warm.mp3', T0('e2') - 0.2, L['e3']['t1'] - 0.2, 0.22, fin=1.5, fout=1.8, off=62)  # 열린 결말: 아주 작게, 암전 직전에 꺼진다
# duck the bed under speech
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
# 0: alarm
for k in range(6): put(T0('s0') + 0.1 + k * 0.14, tone(2200 if k % 2 else 1800, 0.1, 0.05, (1,)) * 0.35)
put(T0('s0') + 0.9, whoosh(0.4), 0.6); put(T0('s0') + 1.4, thud(0.3, 90), 0.6)
# montage: whoosh on every cut, ding on every check, cut-specific foley
for lid in ['n1', 'n2']:
    l = L[lid]; cuts = l['args']['cuts']; D = l['t1'] - l['t0'] + 0.15
    st = [0] + [max(0.2, (next((w['t'] + 0.15 for w in l.get('words', []) if c[1] in w['w'].replace(' ', '')), i * D / 3)) - 0.25) for i, c in enumerate(cuts) if i > 0]
    for i, c in enumerate(cuts):
        a0 = l['t0'] - 0.15 + st[i]; end = l['t0'] - 0.15 + (st[i + 1] if i + 1 < len(st) else D)
        put(a0, whoosh(0.25), 0.5); put(end - 0.35, ding(), 0.8)
        if c[0] == 'shower': put(a0, lp(bp(noise(end - a0), 800, 7000), 5000) * 0.12)
        if c[0] == 'lunch':
            for k in range(int((end - a0) * 10)): put(a0 + k * 0.1, bp(noise(0.03), 2000, 6000) * env(int(0.03 * SR), 0.001, 0.008) * 0.6)
        if c[0] == 'gym': put(a0 + 0.3, clank(), 0.4)
        if c[0] == 'subway': put(a0, lp(noise(end - a0), 200) * 0.25)
put(T0('n3') + 0.1, mx(*[np.pad(pop_(700 + 120 * i), (int(i * 0.12 * SR), 0)) for i in range(6)]), 0.5)
put(W('n3', '열심히', 2.6), thud(0.3, 120), 0.7); put(W('n3', '열심히', 2.6) + 0.05, chime(), 0.5)
# melt: music tape-stop, slide down
put(T0('n4') + 0.1, tape_stop(0.7), 0.8)
put(W('n4', '이상', 0.9), pop_(1300), 0.4)
put(W('n4', '피곤', 3.6) + 0.2, slide_down(1.2), 0.8)
# coach
put(T0('c1') - 0.1, pop_(1600), 0.9); put(T0('c1') + 0.0, whistle(0.3), 0.8)
# double take
put(T0('c2') + 0.9, pop_(900), 0.4); put(T0('c2') + 1.25, whoosh(0.4), 0.7); put(T0('c2') + 1.35, thud(0.25, 140), 0.6); put(T0('c2') + 1.55, mx(snap(), tone(1200, 0.4, 0.2, (1, 0.5)) * 0.4), 0.8)
# who: 회사 일 ✔, 영어 ?, 헬스 ? ?
tB = W('n5', '회사', 0.2); put(tB, pop_(800), 0.5); put(tB + 0.7, ding(), 0.5)
for k, tt in enumerate([W('n5', '영어', 2.2), W('n5', '헬스', 3.0), W('n5', '헬스', 3.0) + 0.5]): put(tt, tone(660 + 110 * k, 0.25, 0.12, (1, 0.3)) * 0.4)
tW = W('n5', '누가', 4.4); put(tW - 0.1, whoosh(0.35), 0.6)
for k in range(3): put(tW + 0.3 + k * 0.28, tone(1760 + (k % 2) * 220, 0.25, 0.15, (1,)) * 0.18)
# culprit stinger
put(T0('n6') - 0.1, mx(thud(0.6, 55), tone(110, 1.2, 0.7, (1, 0.5, 0.3)) * 0.3), 0.9)
put(W('n6', '가까이', 1.3) - 0.3, mx(pop_(500), tone(880, 0.3, 0.2, (1,)) * 0.3), 0.6)
# title + book
put(T0('t0') + 0.2, crackle(0.8), 0.5); put(T0('t0') + 0.4, tone(140, 1.2, 0.8, (1, 0.4)) * 0.2)
put(T0('n7') + 0.05, whoosh(0.4), 0.4)
put(W('n7', '피로사회', L['n7']['t1'] - L['n7']['t0'] - 1.0) + 0.6, mx(thud(0.35, 100), chime()), 0.5)

# ================= 1막 =================
A = lambda k: L[k]['t0'] - 0.15   # scene-local time origin (lt = 0)
def hum(t0, t1, g=0.12): put(t0, lp(noise(t1 - t0), 160) * np.minimum(1, np.linspace(0, 6, int((t1 - t0) * SR))) * g)
hum(T0('a1') - 0.2, T0('a4') + 2.0, 0.5)                                   # factory machine hum
for k in range(int((T0('a4') + 2 - T0('a1')) / 1.2)): put(T0('a1') + k * 1.2, clank(), 0.12)
put(W('a1', '하지', 1.2) - 0.1, whistle(0.45), 1.0); put(W('a1', '하지', 1.2), thud(0.3, 110), 0.6)
for key, fb in [('떠들', 0.5), ('늦지', 1.3), ('쉬지', 2.1)]: put(W('a2', key, fb), whistle(0.25), 0.8); put(W('a2', key, fb) + 0.02, pop_(700), 0.5)
put(W('a3', '규율', 1.0), mx(thud(0.35, 90), tone(220, 0.8, 0.4, (1, 0.5))) , 0.6)
tC = W('a4', '사라지', 1.6); put(tC - 0.05, whoosh(0.3), 0.6); put(tC, mx(thud(0.4, 70), bp(noise(0.5), 300, 3000) * env(int(0.5 * SR), 0.002, 0.15)), 0.8)
for key, fb in [('할', 3.4), ('한계', 4.6)]: tt = W('a4', key, fb); put(tt, whoosh(0.3), 0.5); put(tt + 0.35, thud(0.3, 120), 0.7); put(tt + 0.4, chime(), 0.35)
for i in range(4): put(W('a4', '할', 3.4) + 0.2 + i * 0.07, pop_(900 + 150 * i), 0.35)
for i in range(10): put(A('a5') + 0.3 + i * 0.75, pop_(1100 + (i % 4) * 160), 0.08)
tF = W('a5', '있다고', 4.6) - 0.5; put(tF + 0.2, whoosh(0.3), 0.5); put(tF + 0.45, chime(), 0.4)
put(W('a6', '성과', 0.8), mx(thud(0.3, 110), chime()), 0.5)
put(A('a7') + 0.3, pop_(700), 0.5)
for n in range(5): put(A('a7') + (n + 0.4) / 1.1, tone(523 * 2 ** (n / 12 * 2), 0.18, 0.08, (1, 0.3)) * 0.4)   # happy hops
for n in range(4, 11):
    tt = A('a8') + (n + 0.4 - 4) / 1.25
    if tt < L['a8']['t1']: put(tt, tone(523 * 2 ** ((n % 5) / 6), 0.18, 0.08, (1, 0.3)) * 0.35); put(tt + 0.05, pop_(1400), 0.25)
for k in range(int((L['a9']['t1'] - A('a9')) / 0.22)): put(A('a9') + k * 0.22, bp(noise(0.04), 300, 1500) * env(int(0.04 * SR), 0.001, 0.01), 0.35)
put(W('a10', '감옥', 1.0) - 0.4, mx(pop_(500), thud(0.3, 80)), 0.5); put(W('a10', '번아웃', 2.8) - 0.4, mx(pop_(500), thud(0.3, 80)), 0.5); put(L['a10']['t1'] + 0.05, tone(110, 1.4, 0.8, (1, 0.5)) * 0.3)
# ================= 2막 =================
D1 = L['b1']['t1'] - L['b1']['t0'] + 0.15
put(A('b1'), mx(tape_stop(0.5)[::-1], scratch()), 0.7)
for i in range(4): put(A('b1') + i * D1 / 4, whoosh(0.25), 0.5); put(A('b1') + i * D1 / 4 + 0.15, whistle(0.2), 0.45)
put(A('b2') + 0.2, pop_(800), 0.4); put(A('b2') + 1.0, pop_(1000), 0.4)
tS = W('b2', '동시에', 2.6); put(tS, mx(thud(0.4, 80), tone(988, 0.5, 0.25, (1, 0.5)) * 0.5), 0.8); put(W('b2', '피착취자', 3.6) - 0.3, mx(thud(0.3, 110), pop_(600)), 0.5)
put(A('b3') + 0.2, pop_(900), 0.4)
for i in range(3): put(A('s1') + 0.25 + i * 0.9, mx(ding(), lp(noise(0.25), 120) * 0.6), 0.6)          # notifications + buzz
put(A('s1') + 2.3, tone(220, 1.2, 0.6, (1, 0.5)) * 0.25)
put(A('C3'), pop_(1600), 0.5); put(A('C3'), tone(147, 2.0, 1.0, (1, 0.6, 0.3)) * 0.2)
put(A('b4'), whoosh(0.3), 0.6); put(A('b4') + 0.55, thud(0.3, 100), 0.6); put(W('b4', '안에', 4.2), mx(thud(0.35, 70), tone(196, 1.0, 0.5, (1, 0.5)) * 0.4), 0.6)
put(W('b5', '남이', 0.2), pop_(700), 0.4); tM = W('b5', '나라면', 3.0); put(tM, glass(), 0.25); put(tM + 0.4, pop_(1200), 0.4)
tA_ = W('b6', '화살', 0.8); tB_ = W('b6', '돌아', 2.0); put(tA_, whoosh(tB_ + 0.35 - tA_), 0.7); put(tB_ + 0.35, mx(thud(0.3, 140), snap()), 0.9)
put(W('b6', '부족', 3.6), pop_(500), 0.4); put(W('b6', '게을러', 6.4), pop_(450), 0.4)
put(A('b7'), lp(bp(noise(L['b7']['t1'] - A('b7')), 1500, 8000), 6000) * 0.07); put(W('b7', '고유한', 2.8), mx(thud(0.3, 90), tone(165, 1.2, 0.6, (1, 0.5)) * 0.3), 0.6)
for lid in ['b8', 'b9']:
    for k in range(int((L[lid]['t1'] - A(lid)) * 10)): put(A(lid) + k * 0.1, bp(noise(0.03), 2000, 6000) * env(int(0.03 * SR), 0.001, 0.008) * 0.14)
put(W('b8', '메일', 2.6), pop_(900), 0.5); put(W('b8', '강의', 3.6), pop_(1000), 0.5)
put(A('b9') + 0.3, mx(pop_(600), thud(0.25, 120)), 0.5); put(W('b9', '퇴보', 2.6), slide_down(0.8), 0.7)
def chirp(): t = np.arange(int(0.12 * SR)) / SR; return np.sin(2 * np.pi * (3200 + 1400 * np.sin(2 * np.pi * 9 * t)) * t) * env(len(t), 0.003, 0.04) * 0.2
for k in range(14): put(A('b10') + 0.3 + k * 0.53 + (k % 3) * 0.11, chirp(), 0.5)
tWb = W('b10', '경계', 2.4); dB = L['b10']['t1'] - A('b10')
for k in range(12):
    tt = tWb + k / 1.5 if k else tWb
    if tt - A('b10') < dB and (k == 0 or (tt - A('b10') > tWb - A('b10') + 1.6 and int((tt - A('b10')) * 1.5) % 2 == 0)): put(tt, mx(snap(), pop_(1500)), 0.6)
# ================= 3막 =================
put(A('Z1') - 0.05, tape_stop(0.4), 0.6); put(A('Z1') + 0.2, mx(thud(0.45, 60), snap()), 1.0)
put(A('s2') + 0.1, whoosh(1.2) * 0.4, 0.5); put(A('s2') + 1.2, tone(98, 2.0, 1.2, (1, 0.5)) * 0.25)
put(A('C4') + 0.2, crackle(0.4), 0.5)
for k in range(8): put(A('s3') + 1.0 + k * 0.1, bp(noise(0.02), 1500, 4000) * env(int(0.02 * SR), 0.001, 0.006), 0.4)    # tiny footsteps
put(A('s3') + 1.95, pop_(700), 0.4)
put(A('Z2') + 0.4, slide_down(0.7), 0.4); put(A('Z2') + 1.2, whoosh(0.4), 0.3)
put(A('h1') + 0.2, mx(pop_(700), chime()), 0.45); put(W('h2', '보는', 2.6), pop_(800), 0.5)
for i in range(3): put(W('h3', '하지', 2.0) + i * 0.35, mx(whoosh(0.2), pop_(1200 + i * 200)), 0.45)
put(A('h4'), whoosh(0.5), 0.5); put(A('h4') + 0.8, thud(0.25, 150), 0.6); put(A('h4') + 0.9, mx(pop_(700), chime()), 0.4)
for k in range(16): put(A('h5') + k * 0.1, bp(noise(0.02), 800, 3000) * env(int(0.02 * SR), 0.001, 0.006), 0.35)
tL = W('h5', '꿈의', 3.0) - 0.8
for k in range(6): put(tL + k * 0.13, bp(noise(0.08), 400, 2000) * np.sin(np.linspace(0, np.pi, int(0.08 * SR))), 0.4)
put(tL + 0.85, chirp(), 0.8); put(tL + 1.0, chirp(), 0.6)
put(W('h6', '깊어', 2.6), mx(pop_(1000), chime()), 0.5)
put(A('h7') + 0.2, mx(pop_(700), chime()), 0.4)
put(A('h8') + 0.1, pop_(1300), 0.3); put(A('h8') + 1.0, mx(pop_(900), pop_(1100)), 0.4); put(A('h8') + 1.6, mx(thud(0.15, 200), thud(0.15, 220)), 0.35)
put(A('h8') + 1.8, slide_down(0.6) * 0.5, 0.3)
put(W('h9', '탈진', 1.6), pop_(600), 0.45); put(W('h9', '이어', 3.4), mx(pop_(900), chime()), 0.45)
put(W('h10', '나눔', 2.85), mx(tone(2600, 0.25, 0.06, (1, 0.5)), snap()), 0.7)
# ================= 열린 결말 =================
tCe = W('e1', '성과', 4.4); put(tCe - 0.25, crackle(0.35) * 1.5, 0.8); put(tCe + 0.1, whoosh(0.6), 0.5); put(tCe + 0.8, thud(0.25, 180), 0.5)
for k in range(6): put(A('e0') + 0.2 + k * 0.14, tone(2200 if k % 2 else 1800, 0.1, 0.05, (1,)) * 0.3)
for k in range(6): put(A('e0') + 1.4 + k * 0.14, tone(2200 if k % 2 else 1800, 0.1, 0.05, (1,)) * 0.25)
for k in range(int((L['e3']['t1'] - A('e2')) / 1.0)): put(A('e2') + k * 1.0, tone(1500, 0.05, 0.02, (1,)) * 0.06)    # clock ticks
put(L['e3']['t1'] + 0.05, thud(0.3, 50), 0.35)
mix = voice * 1.0 + bed + sfx * 0.55
sf.write('mix_raw_f.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'mix_raw_f.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), 'mix_f.wav'], check=True)
print('dur', round(DUR, 2), 'peak raw', round(float(np.abs(mix).max()), 2))
