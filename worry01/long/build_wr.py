"""voice + beds + synthesized SFX -> mix_b.wav (loudnorm -14)"""
import json, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, lfilter
SR = 44100; rng = np.random.default_rng(7)
def mx(*ws):
    n = max(len(w) for w in ws); return sum(np.pad(w, (0, n - len(w))) for w in ws)
TL = json.load(open('timeline_wr.json')); L = {l['id']: l for l in TL['lines']}; DUR = TL['duration']; N = int(DUR * SR)
voice, _ = sf.read('voice_wr.wav', dtype='float32'); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
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
place('bgm/night.mp3', 0, A('s2') + 0.6, 0.30, fin=1.0, fout=0.8, off=0)                    # 일요일 밤 책상
place('bgm/vessel.mp3', A('s2') + 1.0, A('k0') + 0.1, 0.22, fin=0.3, fout=0.5, off=0)        # 걱정이 소동
place('bgm/mystic.mp3', A('n2') - 0.2, A('s7') + 0.8, 0.32, fin=1.2, fout=1.6, off=0)       # 책 속 세계 ~ 그릇의 방
place('bgm/mystic2.mp3', A('s7') - 0.2, A('z6') + 0.6, 0.30, fin=1.2, fout=2.0, off=0)       # 다리의 방 ~ 거울의 방
place('bgm/tender.mp3', A('z6') + 3.6, A('n11') + 0.4, 0.34, fin=2.5, fout=2.4, off=0)       # 3막: 걱정이를 보듬다 ~ 경비 일지
place('bgm/morning.mp3', A('n11') - 0.4, DUR, 0.34, fin=1.2, fout=2.6, off=0)                # 월요일 아침
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
# ---------- 효과음 ----------
def bell(f=1568, d=0.45):
    n = int(d * SR); tt = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * tt) + 0.5 * np.sin(2 * np.pi * f * 2.01 * tt) + 0.25 * np.sin(2 * np.pi * f * 3.02 * tt)) * np.exp(-tt * 9) * 0.25
def bells(t0, t1, gap, g):
    k = 0
    while t0 + k * gap < t1: put(t0 + k * gap, bell(1568 if k % 2 else 1480), g); k += 1
for k in range(4): put(A('s1') + 0.2 + k * 0.28, rip(0.12), 0.1)                              # 펜 사각
bells(A('s2') + 0.05, A('s2') + 1.0, 0.3, 0.5)
put(A('s2') + 1.0, pop_(600), 0.4); put(A('s2') + 1.2, whoosh(0.7), 0.3); put(A('s2') + 1.95, thud(0.2, 180), 0.4)
tA = W('w1', '아니', 2.4)
bells(A('w1') + 0.05, tA - 0.15, 0.22, 0.22); bells(tA + 0.75, E1('w1'), 0.16, 0.26)
bells(A('n1') + 0.1, E1('n1'), 0.26, 0.09)
bells(A('z2') + 0.05, E1('z2') + 0.3, 0.9, 0.2); put(A('z2') + 0.55, thud(0.25, 110), 0.4)
put(A('k0') + 0.15, hum(1.5), 1.0); put(A('k0') + 0.2, crackle(0.6), 0.4)
put(A('n2') + 0.5, sparkle(), 0.3)
put(A('s3') + 0.2, chime(), 0.3); put(A('s3') + 1.3, whoosh(1.2), 0.4); put(A('s3') + 1.9, suck(), 0.3)
for k in range(6): put(A('n3') + 0.3 + k * 1.5, whoosh(0.9), 0.14)
for k, key in enumerate(['그릇이자', '다리이자', '거울이라고']): put((W('n3', '그물은', 8.0) + 0.8 if k == 0 else W('n3', key, 10.6 + k)) - 0.15, pop_(800 + k * 160), 0.35)
put(W('n3', '느낌이', 14.0) + 1.2, sparkle(), 0.3)
put(A('n4') + 0.8, thud(0.3, 100), 0.4); put(W('n4', '걸어가', 6.0), chime(), 0.3)
bells(A('s4') + 0.5, A('s4') + 2.7, 0.14, 0.45)
put(A('s5') + 0.8, pop_(520), 0.4); put(A('s5') + 0.85, tone(330, 1.6, 0.8, (1, 0.5, 0.25)) * 0.25)
put(W('z3', '걸으니까', 2.0) + 0.5, pop_(520), 0.4)
for k in range(3): put(A('s6') + 0.5 + k * 0.7, pop_(520 + k * 40), 0.35)
# ---------- 다리의 방 ----------
for k in range(7): put(A('s7') + 0.5 + k * 0.2, snap(), 0.07 + 0.03 * (k % 2))                # 멀리서 박수
put(A('s7') + 2.15, thud(0.25, 120), 0.35)                                                    # 털썩
tQ = W('n6', '상상하느냐고', 9.9) - 0.75
put(tQ, pop_(700), 0.3); put(tQ + 0.25, pop_(900), 0.25); put(W('n6', '뒤', 12.4) - 0.3, ding(), 0.3)
put(W('n6', '지원서를', 15.3) + 0.15, rip(0.3), 0.25); put(W('n6', '연봉도', 17.0) + 0.15, tick_(2200), 0.6); put(W('n6', '연봉도', 17.0) + 0.3, tick_(2500), 0.6)
put(W('n7', '멈추는', 4.2) + 0.2, slide_down(0.8), 0.35)
bells(A('w4') + 0.05, E1('w4'), 0.2, 0.2)
for k in range(4): put(A('s8') + 0.15 + 0.5 + k * 0.6 + 0.2, mx(flap(), tone(660 + k * 80, 0.25, 0.1, (1, 0.3)) * 0.25), 0.6)   # 판자 탁
put(A('z4') + 0.3, pop_(520), 0.25)
# ---------- 거울의 방 ----------
put(A('s9') + 0.65, thud(0.6, 48), 0.9); put(A('s9') + 0.65, tone(98, 1.6, 0.7, (1, 0.6, 0.4)) * 0.5, 0.6)   # 쿠구궁
put(A('s9') + 1.6, clank(), 0.35); put(A('s9') + 1.62, bell(1480, 0.5), 0.5)                  # 종 쨍그랑
tU = W('n8', '미국에서', 3.0)
for k in range(10): put(tU + 0.15 + k * 0.55, rip(0.1), 0.1)                                   # 쪽지 사각
put(W('n8', '91', 12.9) - 0.2, ding(), 0.35); put(W('n8', '않았습니다', 15.0) - 0.4, whoosh(1.3), 0.45)
put(W('n8', '셋은', 18.2), sparkle(), 0.3)
put(A('s10') + 0.15 + 0.7, suck(), 0.25); put(A('s10') + 0.15 + 1.3, slide_down(1.5), 0.5); put(A('s10') + 0.15 + 3.0, sparkle(), 0.3); put(A('s10') + 0.15 + 2.3, tick_(1800), 0.7)
put(A('s11') + 0.45, slide_down(1.0), 0.3)
# ---------- 3막 ----------
put(W('w6', '그날부터', 3.5), tone(880, 1.4, 0.7, (1, 0.3)) * 0.4, 0.5); put(W('w6', '그날부터', 3.5) + 0.7, sparkle(), 0.2)
for k in range(3): put(A('n9') + 0.35 + k * (E1('n9') - T0('n9')) * 0.2, pop_(620 + k * 60), 0.25)
put(A('n10') + 0.15 + 0.35, pop_(700), 0.3); put(A('n10') + 0.15 + 1.0, thud(0.12, 240), 0.2)
put(W('n10', '적어', 4.2) - 0.2, rip(0.5), 0.25); put(E1('n10') - 0.7, whoosh(0.8), 0.25)
for k in range(9): put(A('s12') + 0.45 + k * 0.28, rip(0.12), 0.12)                            # 펜 사각
put(A('s12') + 0.15 + 2.6, ding(), 0.3); put(A('s12') + 0.15 + 3.6, mx(thud(0.12, 300) * 0.5, bell(1320, 0.35) * 0.5), 0.5)   # 종 내려놓기
# ---------- 열린 결말 ----------
put(A('s13') + 0.15 + 0.25, bell(1568, 0.5), 0.4)                                              # 아주 작게 땡
put(A('s13') + 0.15 + 1.0, step(), 0.6); put(A('s13') + 0.15 + 1.22, step(), 0.6)              # 톡톡
put(A('s13') + 0.15 + 2.55, click(), 0.4)
put(A('n12') + 0.15 + 0.5, creak(1.2), 0.5); put(A('n12') + 0.15 + 1.0, whoosh(1.6), 0.25)
put(A('q1') + 0.3, chime(), 0.25)
mix = voice * 1.0 + bed + sfx * 0.55
sf.write('mix_raw_wr.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'mix_raw_wr.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), 'mix_wr.wav'], check=True)
print('dur', round(DUR, 2), 'peak raw', round(float(np.abs(mix).max()), 2))
