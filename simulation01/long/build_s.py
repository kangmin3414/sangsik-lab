"""목소리 + 배경음(목소리 아래로 덕킹) + 합성 효과음 → mix_s.wav (loudnorm -14). 효과음은 모두 직접 합성(남의 음원 없음)."""
import json, os, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, lfilter
os.chdir(os.path.dirname(os.path.abspath(__file__)))
SR = 44100; rng = np.random.default_rng(23)
TL = json.load(open('timeline_s.json')); L = {l['id']: l for l in TL['lines']}; DUR = TL['duration']; N = int(DUR * SR)
voice, _ = sf.read('voice_s.wav', dtype='float32'); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
def W(lid, key, fb=0.0):
    l = L[lid]
    for w in l.get('words', []):
        if key in w['w'].replace(' ', ''): return l['t0'] - 0.15 + w['t'] + 0.12   # same timing as smAt (lt = t - (t0 - .15))
    return l['t0'] - 0.15 + fb
T0 = lambda k: L[k]['t0']; T1 = lambda k: L[k]['t1']; LT = lambda k, x: L[k]['t0'] - 0.15 + x   # scene-local time → absolute
def load(fn, start, dur):
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', fn, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    a = np.frombuffer(raw, np.float32).copy()[int(start * SR):]; n = int(dur * SR)
    while len(a) < n: a = np.concatenate([a, a])
    return a[:n]
bed = np.zeros(N)
def place(fn, t0, t1, g, fin=1.5, fout=2.0, off=0.0):
    i0, i1 = int(t0 * SR), min(N, int(t1 * SR)); a = load(fn, off, (i1 - i0) / SR) * g
    a[:int(fin * SR)] *= np.linspace(0, 1, int(fin * SR))[:len(a)]; k = int(fout * SR); a[-k:] *= np.linspace(1, 0, k)
    bed[i0:i0 + len(a)] += a
sfx = np.zeros(N); amb = np.zeros(N)
def put(t, w, g=1.0, buf=None):
    buf = sfx if buf is None else buf; i = int(t * SR)
    if i < 0 or i >= N: return
    w = w[:N - i]; buf[i:i + len(w)] += w * g
def env(n, a=0.002, d=0.2): t = np.arange(n) / SR; return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
def bp(x, lo, hi): b, a = butter(2, [lo / (SR / 2), min(0.99, hi / (SR / 2))], 'band'); return lfilter(b, a, x)
def lp(x, f): b, a = butter(2, f / (SR / 2)); return lfilter(b, a, x)
def noise(d): return rng.standard_normal(int(d * SR))
def thud(d=0.35, f=70): t = np.arange(int(d * SR)) / SR; return np.sin(2 * np.pi * f * t * (1 - t)) * env(len(t), 0.002, 0.09) + lp(noise(d), 900)[:len(t)] * env(len(t), 0.001, 0.03) * 0.6
def boom(d=1.6, f=48): t = np.arange(int(d * SR)) / SR; return np.sin(2 * np.pi * f * t * (1 - 0.25 * t)) * env(len(t), 0.004, 0.45) + lp(noise(d), 300)[:len(t)] * env(len(t), 0.002, 0.25) * 0.5
def tone(f, d, dec=0.4, h=(1, 0.4, 0.2)): t = np.arange(int(d * SR)) / SR; return sum(a * np.sin(2 * np.pi * f * (i + 1) * t) for i, a in enumerate(h)) * env(len(t), 0.004, dec)
def whoosh(d=0.35): n = noise(d); return bp(n, 600, 5000) * np.sin(np.linspace(0, np.pi, len(n))) ** 2 * 0.6
def step(): return bp(noise(0.07), 150, 1500) * env(int(0.07 * SR), 0.001, 0.02) * 1.4
def soft_step(): return bp(noise(0.06), 200, 900) * env(int(0.06 * SR), 0.001, 0.015) * 0.8
def blip(f0=1200, f1=1700, d=0.07): t = np.arange(int(d * SR)) / SR; return np.sin(2 * np.pi * (f0 + (f1 - f0) * t / d) * t) * env(len(t), 0.001, 0.03)
def glitch(d=0.35):   # sample-and-hold crunch, gated, with a few high beeps
    n = int(d * SR); out = np.zeros(n); i = 0
    while i < n:
        seg = int(SR * rng.uniform(0.012, 0.04)); hold = int(rng.integers(8, 90)); src = rng.standard_normal(seg // hold + 2)
        x = np.repeat(src, hold)[:seg] * (rng.random() > 0.25) * rng.uniform(0.4, 1.0); out[i:i + seg] = x[:max(0, min(seg, n - i))]; i += seg
    out = bp(out, 200, 9000) * 0.55
    for _ in range(3):
        f = rng.uniform(1800, 4200); s = int(rng.uniform(0, d * 0.7) * SR); b = tone(f, 0.05, 0.02, (1,)) * 0.25; out[s:s + len(b)] += b[:max(0, n - s)]
    return out * np.minimum(1, np.linspace(0, 1, n) * 40)
def mx(*xs):
    n = max(len(x) for x in xs); o = np.zeros(n)
    for x in xs: o[:len(x)] += x
    return o
def sweep(d=1.3, f0=300, f1=2600):
    t = np.arange(int(d * SR)) / SR; f = f0 * (f1 / f0) ** (t / d); ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) * 0.35 + bp(noise(d), 2000, 8000)[:len(t)] * 0.15) * np.sin(np.pi * t / d) ** 1.5
def clap(): return mx(bp(noise(0.06), 1200, 7000) * env(int(0.06 * SR), 0.0005, 0.012) * 2.0, tone(1100, 0.05, 0.01, (1,)) * 0.3)
def stamp(): return mx(thud(0.25, 110) * 0.9, bp(noise(0.05), 800, 4000) * env(int(0.05 * SR), 0.0005, 0.012))
def pop_(f=900): t = np.arange(int(0.08 * SR)) / SR; return np.sin(2 * np.pi * f * t * (1 + 3 * t)) * env(len(t), 0.001, 0.025)
def ding(f=1320): return tone(f, 0.9, 0.3, (1, 0.5, 0.25, 0.1))
def scribble(d): n = noise(d); g = (0.5 + 0.5 * np.sin(np.linspace(0, d * 2 * np.pi * 7, len(n)))) ** 2; return bp(n, 2500, 8000) * g * 0.22
def paper(d=0.5): n = noise(d) * (0.5 + 0.5 * np.abs(np.sin(np.linspace(0, 30, int(d * SR))))); return bp(n, 1500, 7000) * np.sin(np.linspace(0, np.pi, len(n))) * 0.5
def hum(d): t = np.arange(int(d * SR)) / SR; return (np.sin(2 * np.pi * 58 * t) * 0.5 + np.sin(2 * np.pi * 116 * t) * 0.25 + np.sin(2 * np.pi * 174 * t) * 0.1) * 0.12
def seal(): return mx(lp(noise(0.12), 600) * env(int(0.12 * SR), 0.002, 0.04) * 1.2, thud(0.15, 140) * 0.4)
def chirp():
    d = rng.uniform(0.06, 0.12); t = np.arange(int(d * SR)) / SR; f0 = rng.uniform(3000, 4500); f = f0 + rng.uniform(-1500, 1500) * t / d + 300 * np.sin(2 * np.pi * 40 * t)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) * 0.15
def peck(): return bp(noise(0.02), 1500, 6000) * env(int(0.02 * SR), 0.0003, 0.004) * 0.8
def shimmer(d): t = np.arange(int(d * SR)) / SR; return sum(np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) * (0.5 + 0.5 * np.sin(2 * np.pi * rng.uniform(3, 7) * t)) for f in (1760, 2217, 2637, 3520)) * 0.04 * np.sin(np.pi * t / d)

# ---------- music ----------
tB = T0('b1') - 0.4; tBut = W('b6', '그런데', 3.0)
place('bgm/myst_a.mp3', LT('h0', 1.55 + 0.4), tB + 0.8, 0.34, fin=0.6, fout=1.4)
place('bgm/cosmic_a.mp3', tB - 0.6, tBut - 0.05, 0.42, fin=1.6, fout=0.25, off=4)
if 'd1' in L:
    place('bgm/myst_a.mp3', T0('d1') - 0.3, T1('d3') + 0.5, 0.30, fin=0.4, fout=0.8, off=30)
    place('bgm/hollow_a.mp3', T0('d4') - 0.6, T1('d8') + 1.2, 0.40, fin=1.5, fout=1.2)
    place('bgm/tiny_a.mp3', T0('g1') - 0.4, T1('g7') + 0.6, 0.38, fin=1.5, fout=1.0)
    place('bgm/cosmic_a.mp3', T0('c1') - 0.5, T1('c3') + 0.6, 0.36, fin=1.0, fout=1.0, off=62)
    place('bgm/warm_a.mp3', T0('m1') - 0.7, DUR, 0.40, fin=1.0, fout=2.5)
act = np.convolve((np.abs(voice) > 0.012).astype(float), np.ones(int(0.35 * SR)) / int(0.35 * SR), 'same')
bed *= (1.0 - 0.78 * np.clip(act * 2.0, 0, 1))

# ---------- ambience: morning street (h*, e1, e2, b6 tail), park, kitchen hum ----------
def street(t0, t1, g=1.0):
    put(t0, lp(noise(t1 - t0), 500) * 0.05 * g, 1, amb)
    tt = t0 + 0.3
    while tt < t1 - 0.2: put(tt, chirp(), g, amb); tt += rng.uniform(0.4, 2.2)
street(0, T1('e2') + 0.3, 1.0)
street(T1('e2') + 0.3, T1('e4') + 0.3, 1.3)
put(T0('e5') - 0.2, hum(T1('e6') - T0('e5') + 0.6), 0.6, amb)
street(tBut - 0.05, T0('d1') - 0.3 if 'd1' in L else DUR, 1.0)
def sizzle(d): n = noise(d); return bp(n, 2500, 9000) * (0.6 + 0.4 * np.abs(np.sin(np.linspace(0, d * 37, len(n))))) * 0.12
def buzz(d=0.5): t = np.arange(int(d * SR)) / SR; return np.sin(2 * np.pi * 160 * t) * (np.sin(2 * np.pi * 9 * t) > 0) * 0.35 * np.minimum(1, t * 40)
def keyclick(): return mx(bp(noise(0.03), 1500, 6000) * env(int(0.03 * SR), 0.0003, 0.006) * 1.2, tone(rng.uniform(380, 520), 0.03, 0.01, (1,)) * 0.15)
def scratch(): n = noise(0.14); return bp(n, 800, 3500) * np.sin(np.linspace(0, np.pi, len(n))) * 0.5
def chime(f=1046): return mx(ding(f) * 0.6, ding(f * 1.25) * 0.4, ding(f * 1.5) * 0.3)
def water(d): n = noise(d); return bp(n, 1500, 7000) * (0.5 + 0.5 * np.abs(np.sin(np.linspace(0, 40, len(n))))) * 0.25
if 'd1' in L:
    put(T0('d1') - 0.3, sizzle(T1('d3') - T0('d1') + 0.8), 1.0, amb)
    put(T0('d4') - 0.3, lp(noise(T1('g7') - T0('d4') + 0.6), 300) * 0.03, 1, amb)     # quiet room tone
    street(T0('m1') - 0.6, DUR - 0.5, 0.7)

# ---------- h0: steps, whip, glitch ----------
for k in range(4): put(LT('h0', 0.08 + k * 0.32), step(), 0.55)
put(LT('h0', 1.42), whoosh(0.3), 0.8)
put(LT('h0', 1.48), glitch(0.36), 1.0); put(LT('h0', 1.48), thud(0.4, 55), 0.8)
# h1: the clock pops in; two after-image flickers on the over-the-shoulder shot
put(T0('h1') + 0.05, blip(1500, 1500, 0.05), 0.5); put(T0('h1') + 0.14, blip(1900, 1900, 0.05), 0.4)
tEv = W('h1', '증거', 4.0)
put(tEv - 0.2 + 1.1, glitch(0.12), 0.5); put(tEv - 0.2 + 2.6, glitch(0.08), 0.4)
# h3: the scan line drops over the sky
put(W('h3', '시뮬', 3.5), sweep(1.3, 400, 2400), 0.6)
# h4: letterbox + clapper on "오늘"
put(T0('h4') - 0.1, whoosh(0.45), 0.5); put(W('h4', '오늘', 2.0) - 0.05, clap(), 0.9); put(W('h4', '오늘', 2.0) + 0.02, clap(), 0.5)
# e1: card + scribbling
put(W('e1', '첫째', 2.0), stamp(), 0.8); put(T0('e1') + 0.1, scribble(T1('e1') - T0('e1') - 0.3), 1.0)
# e2: whip ×3, glitch on the third
for x in (0.12, 0.72, 1.32): put(LT('e2', x), whoosh(0.28), 0.8)
put(LT('e2', 1.37), glitch(0.4), 1.0); put(LT('e2', 1.37), thud(0.35, 60), 0.7)
# e3: card, pecking, the unison tilt (one ding) + selection blip
put(W('e3', '둘째', 0.3), stamp(), 0.8)
tt = T0('e3')
while tt < W('e3', '같은', 3.0): put(tt, peck(), 0.6); tt += rng.uniform(0.15, 0.45)
tTilt = W('e3', '갸웃', 5.5); put(tTilt, ding(1568), 0.45); put(tTilt, ding(1568 * 1.5), 0.15); put(tTilt + 0.35, blip(900, 1400, 0.09), 0.6)
# e5: card, tiptoe, door seal, rendering sweep + spinner ticks
put(W('e5', '셋째', 0.3), stamp(), 0.8)
tOpen = W('e5', '열고', 3.0)
tt = T0('e5') + 0.2
while tt < tOpen - 0.4: put(tt, soft_step(), 0.6); tt += 0.3
put(tOpen - 0.05, seal(), 0.9)
tDraw = W('e5', '그려지', 5.0); put(tDraw, sweep(1.6, 900, 3000) * 0.6, 0.6)
tt = tOpen + 0.3
while tt < T1('e5') + 0.2: put(tt, blip(2400, 2400, 0.02), 0.15); tt += 0.25
# e6: fist pop + three cards
put(W('e6', '됐다', 0.2) + 0.15, pop_(700), 0.6)
for i in range(3): put(W('e6', '증거', 0.9) + i * 0.12, stamp(), 0.55)
# b1: paper drops onto the desk; name label
put(W('b1', '2003', 5.5) - 0.2, paper(0.5), 0.8); put(W('b1', '보스트롬', 8.0), pop_(1000), 0.4)
# b2: monitors blip on in waves
t1_, t2_, t3_ = W('b2', '컴퓨터', 1.0), W('b2', '없이', 3.0), W('b2', '수십', 8.0)
for i in range(8): put(t1_ + i * 0.07, blip(1100 + i * 60, 1500 + i * 60, 0.06), 0.35)
for i in range(16): put(t2_ + i * 0.05, blip(1500 + i * 40, 1900 + i * 40, 0.04), 0.22)
put(t3_, shimmer(2.2), 1.0)
# b3: the search hops, then "?"
for k in range(3, 10): put(LT('b3', k * 0.42), blip(2000, 2000, 0.03), 0.3)
put(W('b3', '확률', 2.5), pop_(800), 0.6)
# b4: header + three cards + focus
put(W('b4', '셋', 1.5), pop_(900), 0.4)
for key, fb in (('사라지', 5), ('만들지', 8), ('아니면', 10)): put(W('b4', key, fb), stamp(), 0.6)
put(W('b4', '안에', 12.5) - 0.2, whoosh(0.6), 0.5)
# b5: the lattice shimmers in; particles streak
put(W('b5', '격자', 4.5), shimmer(2.0), 1.2); put(W('b5', '격자', 4.5), sweep(1.0, 600, 1800) * 0.5, 0.4)
tP = W('b5', '입자', 10.0) - 0.3
for k in range(6): put(tP + k * 0.33, whoosh(0.3), 0.35)
# b6: "not found" stamp; hard cut to the street; the whip and the big glitch + boom
put(W('b6', '없습니다', 2.0) - 0.3, stamp(), 0.9)
tF = W('b6', '찾아', 4.5)
put(tF, whoosh(0.3), 0.9); put(tF + 0.05, glitch(0.5), 1.1); put(tF + 0.05, boom(1.8, 46), 1.0)

# ================= part 2 =================
if 'd1' in L:
    put(T0('d1') - 0.05, shimmer(1.2), 1.2)
    put(W('d1', '세상', 2.5), scribble(2.5), 0.8)
    put(W('d2', '떡볶이', 1.3) - 0.2, whoosh(0.25), 0.5); put(W('d2', '너도', 2.4) - 0.2, whoosh(0.25), 0.5)
    put(W('d2', '숫자', 3.6) - 0.05, glitch(0.25), 0.8)
    for k in range(3): put(T0('d3') + 0.05 + k * 0.35, lp(noise(0.08), 700) * env(int(0.08 * SR), 0.003, 0.03), 0.6)
    tt = T0('d4')                                       # days pass: the clock ticks, faster and faster
    k = 0
    while tt < T1('d4') - 0.3: put(tt, tone(2600 if k % 2 else 2200, 0.03, 0.01, (1,)), 0.25); tt += max(0.12, 0.45 - k * 0.025); k += 1
    put(W('d4', '질문', 2.8), pop_(600), 0.5)
    put(T0('d5') - 0.1, lp(noise(0.9), 1200) * np.sin(np.linspace(0, np.pi, int(0.9 * SR))) * 0.25, 1.0)   # a sigh
    tt = T0('d6') - 0.75
    for i in range(5): put(tt + i * 0.11, keyclick(), 0.35)
    put(W('d6', '화분', 4.0) + 0.5, tone(330, 1.2, 0.5, (1, 0.3)) * np.linspace(1, 0.3, int(1.2 * SR)), 0.25)
    tF = W('d6', '친구', 8.0)
    put(tF, buzz(0.45), 0.7); put(tF + 0.8, buzz(0.45), 0.6)
    put(T0('d8') - 0.1, sweep(3.0, 900, 120) * 0.5, 0.5); put(T0('d8'), boom(2.5, 40), 0.35)
    # g1: the laptop opens, a soft start-up chord; the push into the screen
    put(T0('g1') - 0.15 + 0.75, pop_(500), 0.4); put(T0('g1') - 0.15 + 0.95, chime(784), 0.25)
    put(W('g1', '손바닥', 4.5) - 0.2, whoosh(0.5), 0.4)
    for x in [w['t'] + 0.12 for w in L['g2']['words'] if any(k_ in w['w'] for k_ in ('홱', '획', '휙'))] or [2.6, 3.4]:
        put(T0('g2') - 0.15 + x, whoosh(0.2), 0.3); put(T0('g2') - 0.15 + x + 0.06, glitch(0.18), 0.25)
    for i in range(7): put(T0('g3') - 0.15 + 0.2 + i * 1.7 / 7, scratch(), 0.6)
    put(T0('g3') - 0.15 + 2.0, blip(700, 1100, 0.08), 0.4)
    for k in range(3): put(T0('g4') + k * 0.9, mx(thud(0.18, 55) * 0.9, np.zeros(1)), 0.45)
    # g5: typing / deleting
    tT = W('g5', '너는', 3.0); tDel = W('g5', '글자', 7.0)
    for i in range(6): put(tT + i * 0.11, keyclick(), 0.7)
    for i in range(6): put(tDel + i * 0.16, keyclick() * 0.8, 0.6)
    # g6: typing in time with his voice, send, colour comes back
    D6 = L['g6']['t1'] - L['g6']['t0'] + 0.15; n6 = len('네가 아픈 것도, 네 친구도, 진짜야.')
    for i in range(n6): put(T0('g6') - 0.15 + 0.1 + i / n6 * (D6 - 0.5), keyclick(), 0.45)
    tS = T0('g6') - 0.15 + D6 - 0.15
    put(tS, sweep(0.7, 600, 2400) * 0.6, 0.6); put(tS + 0.35, chime(1046), 0.5); put(tS + 0.5, shimmer(1.8), 1.2)
    put(W('g7', '대답', 4.0) - 0.3, sweep(2.6, 200, 900) * 0.4, 0.5)
    # c: book, labels, stamps, chalk, balance
    put(T0('c1') - 0.1, thud(0.3, 90), 0.6); put(W('c1', '차머스', 2.5) + 0.5, pop_(1000), 0.2); put(W('c1', '가상', 6.5), pop_(800), 0.5)
    put(W('c2', '떡볶이', 4.0) - 0.15, sizzle(2.0), 1.6)
    put(W('c2', '떡볶이', 4.0) - 0.15 + 0.5, stamp(), 0.8); put(W('c2', '친구', 6.0) - 0.15 + 0.9, stamp(), 0.8)
    put(W('c2', '친구', 6.0) - 0.15, buzz(0.35), 0.4)
    tM = W('c3', '수학', 2.0)
    for i in range(3):
        for j in range(5): put(tM + i * 0.6 + j * 0.14, bp(noise(0.06), 2500, 8000) * env(int(0.06 * SR), 0.002, 0.03), 0.15)
    put(W('c3', '논쟁', 6.5), pop_(900), 0.5)
    # m: the morning whip, watering, the reply
    xs = [w['t'] + 0.12 for w in L['m1']['words'] if any(k_ in w['w'] for k_ in ('홱', '획', '휙'))]
    tW = T0('m1') - 0.15 + (xs[0] if xs else 2.7)
    put(tW, whoosh(0.3), 0.7); put(tW + 0.05, glitch(0.3), 0.6)
    tWa = W('m2', '물', 1.8); put(tWa + 0.35, water(1.4), 0.4); put(tWa + 0.8, chime(1318), 0.2)
    put(T0('m4') - 0.1, chime(1568), 0.5); put(T0('m4'), buzz(0.4), 0.5)
    for k in range(4): put(T0('o1') + 0.1 + k * 0.32, step(), 0.5)
    put(T0('o1') - 0.15 + 0.35 * (L['o1']['t1'] - L['o1']['t0'] + 0.15), sweep(3.5, 1800, 200) * 0.5, 0.45)
    put(T0('o1') - 0.15 + 0.5 * (L['o1']['t1'] - L['o1']['t0'] + 0.15), shimmer(3.0), 1.3)
    put(T0('o2'), chime(1046), 0.35)

mix = voice * 1.0 + bed + sfx * 0.5 + amb * 0.6
sf.write('mix_raw_s.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'mix_raw_s.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), 'mix_s.wav'], check=True)
print('dur', round(DUR, 2))
