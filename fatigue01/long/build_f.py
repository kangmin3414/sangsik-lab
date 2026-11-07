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
place('bgm/mystery.mp3', T0('n7') - 0.1, DUR, 0.36, fin=0.5, fout=1.5, off=20)
# duck the bed under speech
act = np.convolve((np.abs(voice) > 0.012).astype(float), np.ones(int(0.35 * SR)) / int(0.35 * SR), 'same')
bed *= (1.0 - 0.7 * np.clip(act * 2.0, 0, 1))
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
# who
put(W('n5', '상사', 0.2), pop_(800), 0.5); put(W('n5', '상사', 0.2) + 0.7, thud(0.2, 160), 0.5)
put(W('n5', '부모님', 1.6), pop_(900), 0.5); put(W('n5', '부모님', 1.6) + 0.7, thud(0.2, 160), 0.5)
tW = W('n5', '누가', 3.4); put(tW - 0.1, whoosh(0.35), 0.6)
for k in range(3): put(tW + 0.3 + k * 0.28, tone(1760 + (k % 2) * 220, 0.25, 0.15, (1,)) * 0.18)
# culprit stinger
put(T0('n6') - 0.1, mx(thud(0.6, 55), tone(110, 1.2, 0.7, (1, 0.5, 0.3)) * 0.3), 0.9)
put(W('n6', '가까이', 1.3) - 0.3, mx(pop_(500), tone(880, 0.3, 0.2, (1,)) * 0.3), 0.6)
# title + book
put(T0('t0') + 0.2, crackle(0.8), 0.5); put(T0('t0') + 0.4, tone(140, 1.2, 0.8, (1, 0.4)) * 0.2)
put(T0('n7') + 0.05, whoosh(0.4), 0.4)
put(W('n7', '피로사회', L['n7']['t1'] - L['n7']['t0'] - 1.0) + 0.6, mx(thud(0.35, 100), chime()), 0.5)
mix = voice * 1.0 + bed + sfx * 0.55
sf.write('mix_raw_f.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'mix_raw_f.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), 'mix_f.wav'], check=True)
print('dur', round(DUR, 2), 'peak raw', round(float(np.abs(mix).max()), 2))
