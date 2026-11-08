"""기게스의 반지 편 샘플 믹스: 목소리 + 배경음(덕킹) + 직접 합성한 효과음·환경음 → mix_g1.wav (loudnorm -14). 효과음은 대사와 겹치면 0.3초씩 미룬다."""
import json, os, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, lfilter
os.chdir(os.path.dirname(os.path.abspath(__file__)))
SR = 44100; rng = np.random.default_rng(31)
TL = json.load(open('timeline_g1.json')); L = {l['id']: l for l in TL['lines']}; DUR = TL['duration']; N = int(DUR * SR)
voice, _ = sf.read('voice_g1.wav', dtype='float32'); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
act = np.convolve((np.abs(voice) > 0.012).astype(float), np.ones(int(0.3 * SR)) / int(0.3 * SR), 'same')
def W(lid, key, fb=0.0):
    l = L[lid]
    for w in l.get('words', []):
        if key in w['w'].replace(' ', ''): return l['t0'] - 0.15 + w['t'] + 0.12
    return l['t0'] - 0.15 + fb
T0 = lambda k: L[k]['t0']; T1 = lambda k: L[k]['t1']; LT = lambda k, x: L[k]['t0'] - 0.15 + x
D_ = lambda k: L[k]['t1'] - L[k]['t0'] + 0.15
def load(fn, start, dur):
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', fn, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    a = np.frombuffer(raw, np.float32).copy()[int(start * SR):]; n = int(dur * SR)
    while len(a) < n: a = np.concatenate([a, a])
    return a[:n]
bed = np.zeros(N); sfx = np.zeros(N); amb = np.zeros(N)
def place(fn, t0, t1, g, fin=1.0, fout=1.5, off=0.0):
    i0, i1 = int(max(0, t0) * SR), min(N, int(t1 * SR)); a = load(fn, off, (i1 - i0) / SR) * g
    a[:int(fin * SR)] *= np.linspace(0, 1, int(fin * SR))[:len(a)]; k = min(len(a), int(fout * SR)); a[-k:] *= np.linspace(1, 0, k)
    bed[i0:i0 + len(a)] += a
placed = []
def put(t, w, g=1.0, buf=None, dodge=True, free=False):
    """free=True: ambience-like, skips the one-per-second rule."""
    if dodge:   # don't land on a spoken word: push 0.3 s at a time (max 0.9 s)
        for _ in range(3):
            i = int(t * SR)
            if 0 <= i < N and act[i] > 0.5 and np.abs(w[:int(0.15 * SR)]).max() > 0.3: t += 0.3
            else: break
    if not free:
        placed.append(t)
    b = sfx if buf is None else buf; i = int(t * SR)
    if i < 0 or i >= N: return
    w = w[:N - i]; b[i:i + len(w)] += w * g
def env(n, a=0.002, d=0.2): t = np.arange(n) / SR; return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
def bp(x, lo, hi): b, a = butter(2, [lo / (SR / 2), min(0.99, hi / (SR / 2))], 'band'); return lfilter(b, a, x)
def lp(x, f): b, a = butter(2, f / (SR / 2)); return lfilter(b, a, x)
def noise(d): return rng.standard_normal(int(d * SR))
def mx(*xs):
    n = max(len(x) for x in xs); o = np.zeros(n)
    for x in xs: o[:len(x)] += x
    return o
def tone(f, d, dec=0.4, h=(1, 0.4, 0.2)): t = np.arange(int(d * SR)) / SR; return sum(a * np.sin(2 * np.pi * f * (i + 1) * t) for i, a in enumerate(h)) * env(len(t), 0.004, dec)
def thud(d=0.35, f=70): t = np.arange(int(d * SR)) / SR; return mx(np.sin(2 * np.pi * f * t * (1 - t)) * env(len(t), 0.002, 0.09), lp(noise(d), 900)[:len(t)] * env(len(t), 0.001, 0.03) * 0.6)
def boom(d=1.6, f=48): t = np.arange(int(d * SR)) / SR; return mx(np.sin(2 * np.pi * f * t * (1 - 0.25 * t)) * env(len(t), 0.004, 0.45), lp(noise(d), 300)[:len(t)] * env(len(t), 0.002, 0.25) * 0.5)
def whoosh(d=0.35): n = noise(d); return bp(n, 600, 5000) * np.sin(np.linspace(0, np.pi, len(n))) ** 2 * 0.6
def blip(f0=1200, f1=1700, d=0.07): t = np.arange(int(d * SR)) / SR; return np.sin(2 * np.pi * (f0 + (f1 - f0) * t / d) * t) * env(len(t), 0.001, 0.03)
def pop_(f=900): t = np.arange(int(0.08 * SR)) / SR; return np.sin(2 * np.pi * f * t * (1 + 3 * t)) * env(len(t), 0.001, 0.025)
def ding(f=1320): return tone(f, 0.9, 0.3, (1, 0.5, 0.25, 0.1))
def chime(f=1046): return mx(ding(f) * 0.6, ding(f * 1.25) * 0.4, ding(f * 1.5) * 0.3)
def keyclick(): return mx(bp(noise(0.03), 1500, 6000) * env(int(0.03 * SR), 0.0003, 0.006) * 1.2, tone(rng.uniform(380, 520), 0.03, 0.01, (1,)) * 0.15)
def step(): return bp(noise(0.07), 150, 1500) * env(int(0.07 * SR), 0.001, 0.02) * 1.4
def glitch(d=0.35):
    n = int(d * SR); out = np.zeros(n); i = 0
    while i < n:
        seg = int(SR * rng.uniform(0.012, 0.04)); hold = int(rng.integers(8, 90)); src = rng.standard_normal(seg // hold + 2)
        x = np.repeat(src, hold)[:seg] * (rng.random() > 0.25) * rng.uniform(0.4, 1.0); out[i:i + seg] = x[:max(0, min(seg, n - i))]; i += seg
    out = bp(out, 200, 9000) * 0.55
    for _ in range(3):
        f = rng.uniform(1800, 4200); s = int(rng.uniform(0, d * 0.7) * SR); b = tone(f, 0.05, 0.02, (1,)) * 0.25; out[s:s + len(b)] += b[:max(0, n - s)]
    return out * np.minimum(1, np.linspace(0, 1, n) * 40)
def sweep(d=1.3, f0=300, f1=2600):
    t = np.arange(int(d * SR)) / SR; f = f0 * (f1 / f0) ** (t / d); ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) * 0.35 + bp(noise(d), 2000, 8000)[:len(t)] * 0.15) * np.sin(np.pi * t / d) ** 1.5
def chirp():
    d = rng.uniform(0.06, 0.12); t = np.arange(int(d * SR)) / SR; f0 = rng.uniform(3000, 4500); f = f0 + rng.uniform(-1500, 1500) * t / d + 300 * np.sin(2 * np.pi * 40 * t)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) * 0.15
def buzz(d=0.5): t = np.arange(int(d * SR)) / SR; return np.sin(2 * np.pi * 160 * t) * (np.sin(2 * np.pi * 9 * t) > 0) * 0.35 * np.minimum(1, t * 40)
def boing(): t = np.arange(int(0.35 * SR)) / SR; return np.sin(2 * np.pi * (300 + 500 * t) * t + 3 * np.sin(2 * np.pi * 12 * t)) * env(len(t), 0.003, 0.12) * 0.5
def plop(): t = np.arange(int(0.12 * SR)) / SR; return np.sin(2 * np.pi * (220 - 500 * t) * t) * env(len(t), 0.002, 0.04)   # 퐁 (landing)
def heartbeat(): return np.concatenate([thud(0.18, 55) * 0.9, np.zeros(int(0.08 * SR)), thud(0.22, 50) * 0.7])
def clink(): return mx(tone(2400, 0.5, 0.12, (1, 0.6, 0.3)), tone(3300, 0.4, 0.08, (1,)) * 0.5) * 0.6
def bell(): return mx(tone(1760, 1.2, 0.35, (1, 0.5)), tone(2217, 1.0, 0.3, (1,)) * 0.6, tone(1760, 1.0, 0.3, (1,)) * 0.0)
def scrape(d=0.35): n = noise(d); return bp(n, 300, 1800) * np.sin(np.linspace(0, np.pi, len(n))) * 0.5
def scribble(d): n = noise(d); g = (0.5 + 0.5 * np.sin(np.linspace(0, d * 2 * np.pi * 7, len(n)))) ** 2; return bp(n, 2500, 8000) * g * 0.22
def street(t0, t1, g=1.0):
    put(t0, lp(noise(max(0.1, t1 - t0)), 500) * 0.05 * g, 1, amb, dodge=False, free=True)
    tt = t0 + 0.3
    while tt < t1 - 0.2: put(tt, chirp(), g, amb, dodge=False, free=True); tt += rng.uniform(0.4, 2.2)

# ---------------- music (Lyria tracks reused from the simulation episode) ----------------
B = '../../simulation01/long/bgm/'
place(B + 'tiny_a.mp3', 0.0, T0('o3') + 0.1, 0.26, fin=0.4, fout=0.25, off=20)                  # the presentation, applause
place(B + 'hollow_a.mp3', T0('o4') - 0.2, T0('a1') + 0.3, 0.30, fin=0.6, fout=0.5)              # nobody sees him
place(B + 'myst_a.mp3', T0('a1') - 0.2, T0('t0') + 0.1, 0.34, fin=0.8, fout=0.15, off=30)       # the rain, the ring
place(B + 'tiny_a.mp3', T0('s1') - 0.3, T1('s5') + 0.4, 0.28, fin=0.4, fout=0.6, off=50)        # testing it (playful)
place(B + 'cosmic_a.mp3', T0('n1') - 0.4, T1('n2') + 0.1, 0.32, fin=1.0, fout=0.5, off=8)       # Glaucon's story
place(B + 'tense_a.mp3', T1('n3') + 0.05, T1('p3') + 0.4, 0.30, fin=0.5, fout=0.6, off=12)        # the temptation (the ring, the evaluation, the deleted file)
place(B + 'tense_b.mp3', T0('p4') - 0.3, T1('p6') + 0.2, 0.28, fin=0.4, fout=0.3)                # the missing file
place(B + 'warm_a.mp3', T0('p7') - 0.1, T1('p8') + 0.5, 0.30, fin=0.3, fout=0.8, off=20)         # applause: being seen (the wrong way)
place(B + 'hollow_a.mp3', T0('c1') - 0.3, T1('c4') + 0.4, 0.30, fin=0.8, fout=0.8, off=30)       # the blame
place(B + 'warm_a.mp3', T0('f1') - 0.4, T1('f6') + 0.3, 0.24, fin=1.0, fout=0.8, off=50)         # the bunsik, Sora
place(B + 'cosmic_a.mp3', T0('r1') - 0.3, T1('r2') + 0.5, 0.28, fin=0.8, fout=0.8, off=40)       # the mirror, the answer
place(B + 'tense_a.mp3', T0('h1') - 0.3, LT('h2', 2.0), 0.26, fin=0.6, fout=0.15, off=60)       # the box; the ring — music stops as the hand goes up
place(B + 'warm_a.mp3', T0('h5') + 0.2, T1('h8') + 0.6, 0.26, fin=1.5, fout=1.0, off=70)         # after the confession
place(B + 'hollow_a.mp3', T0('e1') - 0.4, T0('e2') + 0.2, 0.26, fin=0.8, fout=0.5, off=60)       # alone in the rain
place(B + 'warm_a.mp3', T0('e2') - 0.1, T1('e5') + 0.3, 0.32, fin=0.8, fout=0.8, off=0)          # the yellow umbrella
place(B + 'myst_a.mp3', T0('e6') - 0.2, T1('e6') + 0.1, 0.30, fin=0.5, fout=0.1, off=60)         # someone else's shoe
bed *= (1.0 - 0.78 * np.clip(act * 2.0, 0, 1))
def dip(buf, t0, t1, g, r=0.25):   # extra dip under one line (where the mix check found words masked)
    i0, i1 = int(t0 * SR), int(t1 * SR); e = np.ones(N); e[i0:i1] = g; k_ = int(r * SR); e[max(0, i0 - k_):i0] = np.linspace(1, g, i0 - max(0, i0 - k_)); e[i1:i1 + k_] = np.linspace(g, 1, len(e[i1:i1 + k_])); buf *= e
MASKED = ['n3', 'f2', 'f3', 'f4', 's5', 'e2', 'e3', 'e4']   # + lines whose background sat within ~3 dB of the voice (rain, bunsik chatter)
for lid_ in MASKED: dip(bed, T0(lid_) - 0.15, T1(lid_) + 0.1, 0.5)

# ---------------- ambience ----------------
put(0, bp(noise(T0('a1')), 80, 400) * 0.02, 1, amb, dodge=False, free=True)                      # office room tone
def rain(t0, t1, g=1.0):
    n = noise(t1 - t0); put(t0, (bp(n, 1200, 9000) * 0.05 + lp(n, 400) * 0.03) * g, 1, amb, dodge=False, free=True)
    tt = t0 + 0.2
    while tt < t1 - 0.1: put(tt, tone(rng.uniform(1800, 3200), 0.05, 0.015, (1,)) * 0.12 * g, 1, amb, dodge=False, free=True); tt += rng.uniform(0.15, 0.5)
rain(T0('a1') - 0.3, T1('t0') + 0.2)
put(T0('s1') - 0.2, (lp(noise(D_('s1') + 0.4), 160) * 0.12), 1, amb, dodge=False, free=True)      # subway rumble
for k in range(4): put(T0('s1') + 0.3 + k * 0.8, thud(0.08, 140) * 0.3, 1, amb, dodge=False, free=True)   # rail clacks
def chatter(t0, t1):
    n = noise(t1 - t0); put(t0, bp(n, 2500, 9000) * (0.6 + 0.4 * np.abs(np.sin(np.linspace(0, (t1 - t0) * 37, len(n))))) * 0.05, 1, amb, dodge=False, free=True)
chatter(T0('s2') - 0.2, T1('s5') + 0.2)
put(T0('n1') - 0.3, lp(noise(T1('n4') - T0('n1') + 0.6), 300) * 0.022, 1, amb, dodge=False, free=True)  # night room
put(T0('p1') - 0.2, bp(noise(D_('p1') + 0.3), 80, 500) * 0.03, 1, amb, dodge=False, free=True)       # office hum
put(T0('p2') - 0.2, lp(noise(T1('p3') - T0('p2') + 0.5), 200) * 0.02, 1, amb, dodge=False, free=True)  # the empty office at night
put(T0('p4') - 0.3, bp(noise(T1('h8') - T0('p4') + 0.6), 80, 400) * 0.016, 1, amb, dodge=False, free=True)  # meeting room tone
chatter(T0('f1') - 0.2, T1('f4') + 0.2); chatter(T0('f6') - 0.1, T1('f6') + 0.2)
rain(T0('f5') - 0.1, T1('f5') + 0.1, 0.8)
put(T0('r1') - 0.2, lp(noise(T1('r2') - T0('r1') + 0.5), 250) * 0.018, 1, amb, dodge=False, free=True)
for i in range(6): put(T0('r1') + 0.5 + i * 1.9, plop() * 0.25, 0.25, amb, dodge=False, free=True)   # a dripping tap
rain(T0('e1') - 0.4, T1('e6') + 0.1)

# ---------------- sfx ----------------
put(LT('o1', 0.35), pop_(900), 0.4, dodge=False, free=True)                                      # the credit line lights up
def clap(): return bp(noise(0.05), 800, 6000) * env(int(0.05 * SR), 0.0005, 0.012) * 1.2
t = T0('o2') - 0.15
while t < LT('o3', 1.4): put(t + 0.17 * np.pi / 9 * 2, clap(), 0.3, dodge=False, free=True); t += np.pi / 9
put(LT('o3', 0.05), scrape(0.25) * 0.5, 0.25, dodge=False, free=True)                            # his sleeve, the hand going up
put(LT('a1', 0.95), scribble(0.45), 0.6, dodge=False, free=True)                                  # the plastic bag
put(LT('a2', 0.35), ding(2600) * 0.5, 0.35, dodge=False)                                          # the glint in the puddle
put(LT('a2', 0.9 + 0.55), mx(tone(3200, 0.04, 0.01, (1,)), bp(noise(0.03), 3000, 9000) * 0.4), 0.45, dodge=False)   # the stone clicks round
put(LT('a2', 2.2 + 0.1), sweep(0.7, 2400, 600) * 0.7, 0.4, dodge=False)                          # he fades from the glass
put(T0('a3') - 0.32, whoosh(0.22), 0.35, dodge=False)   # (no boing/plop: they sat on '내 몸' and read as a word)
for x in (0.25, 0.95, 1.6): put(LT('a4', x), mx(tone(3200, 0.04, 0.01, (1,)), bp(noise(0.03), 3000, 9000) * 0.4), 0.45, dodge=False, free=True)
put(T0('t0') - 0.12, whoosh(0.35), 0.5, dodge=False); put(T0('t0') - 0.05, boom(1.6, 46), 0.6, dodge=False)
for k in range(5): put(T0('s1') + 0.1 + k * 0.26, step() * 0.6, 0.3, free=True, dodge=False)     # the man's steps
put(LT('s1', 1.3), mx(thud(0.25, 90), bp(noise(0.08), 300, 3000) * env(int(0.08 * SR), 0.001, 0.03)), 0.7, dodge=False)   # 퍽
for x in (1.1 * 0.62, 1.1 + 1.1 * 0.62): put(LT('s2', x), pop_(600), 0.45, dodge=False, free=True)   # a tteok vanishes
put(LT('s4', 0.05), mx(sweep(0.25, 800, 2600) * 0.6, pop_(1200)), 0.4, dodge=False)               # he blinks into the seat
put(W('s5', '먹었', 2.0) - 0.05, tone(1800, 0.2, 0.06, (1,)) * 0.3, 0.4)
put(LT('n1', 0.6), ding(2200) * 0.4, 0.3, dodge=False, free=True)                                 # the ring in the lamp light
put(W('n1', '몸을', 7.5) + 0.45, sweep(0.6, 2200, 500) * 0.6, 0.35)                              # the shepherd vanishes
put(W('n1', '죽여', 11.0) + 0.3, thud(0.35, 60), 0.5)                                            # the king falls
put(W('n1', '되었', 13.0) + 0.1, chime(1046) * 0.6, 0.3)                                         # the crown
put(W('n2', '보지', 2.3) + 0.1, sweep(0.6, 2200, 500) * 0.5, 0.3)
for i in range(6): put(LT('n4', 0.2 + i * 0.3), tone(3000, 0.03, 0.01, (1,)) * 0.25, 0.4, dodge=False, free=True)   # tick… tick…
click_ = lambda: mx(tone(3200, 0.04, 0.01, (1,)), bp(noise(0.03), 3000, 9000) * 0.4)
put(LT('p1', 1.35), blip(900, 700, 0.08), 0.3, dodge=False, free=True)                             # the evaluation sheet
for x in (0.1, 0.55, 0.75): put(LT('p2', 1.3 + x * (D_('p2') - 1.3)), click_() * 0.6, 0.35, dodge=False, free=True)   # mouse clicks
put(LT('p2', 1.3 + 0.82 * (D_('p2') - 1.3)), scribble(0.35) * 1.2, 0.5, dodge=False, free=True)   # the bin empties (paper crumple)
for i in range(7): put(T0('p4') + 0.05 + i * 0.16, keyclick(), 0.35, free=True, dodge=False)     # frantic typing
put(LT('p6', 0.35), click_() * 0.5, 0.3, dodge=False, free=True)                                 # the USB stick
t = T0('p7') - 0.1
while t < LT('p7', 2.0): put(t, clap(), 0.3, dodge=False, free=True); t += np.pi / 9
put(LT('c4', 1.6), ding(2600) * 0.3, 0.25, dodge=False, free=True)                                # the ring in his pocket
put(T0('f5') - 0.15, sweep(0.5, 600, 2400) * 0.5, 0.3, dodge=False)                              # into the memory
for x in (0.7, 1.9): put(LT('r1', x), mx(click_(), sweep(0.4, 2200, 600) * 0.5), 0.4, dodge=False, free=True)   # the ring turns: gone / back
put(LT('h2', 0.45), click_() * 0.4, 0.3, dodge=False, free=True)                                 # the thumb stops
put(LT('h2', 1.1 + 0.5), clink() * 0.5, 0.4, dodge=False, free=True)                             # the ring set down on the table
put(LT('h2', 2.05), whoosh(0.3) * 0.6, 0.3, dodge=False, free=True)                              # the hand goes up
for k in range(3): put(T0('h4') + 0.05 + k * 0.12, scrape(0.18) * 0.4, 0.25, dodge=False, free=True)   # chairs turn
put(LT('h8', 0.75), thud(0.2, 120), 0.4, dodge=False, free=True)                                 # the box set down
put(LT('e1', 1.6 + 0.45 * (D_('e1') - 1.6)), plop() * 0.6, 0.4, dodge=False, free=True)          # the ring into the water
for k in range(6): put(T0('e2') + 0.05 + k * 0.09, tone(rng.uniform(500, 800), 0.04, 0.01, (1,)) * 0.25, 0.3, dodge=False, free=True)   # rain drumming on the umbrella
for k in range(8): put(LT('e5', 1.9 + k * 0.22), step() * 0.5, 0.25, dodge=False, free=True)
put(LT('e6', 1.85), mx(step() * 0.8, bp(noise(0.12), 400, 3000) * env(int(0.12 * SR), 0.002, 0.05)), 0.5, dodge=False, free=True)   # a stranger's step in the wet
amb *= (1.0 - 0.7 * np.clip(act * 2.0, 0, 1))
for lid_ in MASKED: dip(amb, T0(lid_) - 0.15, T1(lid_) + 0.1, 0.35)
mix = voice * 1.0 + bed + sfx * 0.5 + amb * 0.6
k = int(1.2 * SR); mix[-k:] *= np.linspace(1, 0, k)
sf.write('mix_raw_g1.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'mix_raw_g1.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), 'mix_g1.wav'], check=True)
print('dur', round(DUR, 2))
