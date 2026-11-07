"""목소리 + 배경음(목소리 아래로 덕킹) + 합성 효과음 → mix_v.wav (loudnorm -14). 효과음은 모두 직접 합성(남의 음원 없음)."""
import json, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, lfilter
SR = 44100; rng = np.random.default_rng(11)
TL = json.load(open('timeline_v.json')); L = {l['id']: l for l in TL['lines']}; DUR = TL['duration']; N = int(DUR * SR)
voice, _ = sf.read('voice_v.wav', dtype='float32'); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
def W(lid, key, fb=0.0):
    l = L[lid]
    for w in l.get('words', []):
        if key in w['w'].replace(' ', ''): return l['t0'] + w['t']
    return l['t0'] + fb
T0 = lambda k: L[k]['t0']
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
cut = T0('n1') - 0.3 if 'n1' in L else DUR
place('bgm/tense_b.mp3', 0, cut + 1.0, 0.36, fin=1.0, fout=1.4)
if 'n4' in L: place('bgm/tense_a.mp3', cut - 0.4, T0('n4') + 0.6, 0.38, fin=0.8, fout=1.2, off=8); place('bgm/tense_a.mp3', T0('n4') - 0.2, DUR, 0.3, fin=1.6, fout=2.5, off=40)
act = np.convolve((np.abs(voice) > 0.012).astype(float), np.ones(int(0.35 * SR)) / int(0.35 * SR), 'same')
bed *= (1.0 - 0.7 * np.clip(act * 2.0, 0, 1))
sfx = np.zeros(N)
def put(t, w, g=1.0):
    i = int(t * SR)
    if i < 0 or i >= N: return
    w = w[:N - i]; sfx[i:i + len(w)] += w * g
def env(n, a=0.002, d=0.2): t = np.arange(n) / SR; return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
def bp(x, lo, hi): b, a = butter(2, [lo / (SR / 2), min(0.99, hi / (SR / 2))], 'band'); return lfilter(b, a, x)
def lp(x, f): b, a = butter(2, f / (SR / 2)); return lfilter(b, a, x)
def noise(d): return rng.standard_normal(int(d * SR))
def thud(d=0.35, f=70): t = np.arange(int(d * SR)) / SR; return np.sin(2 * np.pi * f * t * (1 - t)) * env(len(t), 0.002, 0.09) + lp(noise(d), 900)[:len(t)] * env(len(t), 0.001, 0.03) * 0.6
def tone(f, d, dec=0.4, h=(1, 0.4, 0.2)): t = np.arange(int(d * SR)) / SR; return sum(a * np.sin(2 * np.pi * f * (i + 1) * t) for i, a in enumerate(h)) * env(len(t), 0.004, dec)
def whoosh(d=0.4): n = noise(d); return bp(n, 600, 4000) * np.sin(np.linspace(0, np.pi, len(n))) ** 2 * 0.5
def pop_(f=900): t = np.arange(int(0.08 * SR)) / SR; return np.sin(2 * np.pi * f * t * (1 + 3 * t)) * env(len(t), 0.001, 0.025)
def step(): return bp(noise(0.07), 150, 1500) * env(int(0.07 * SR), 0.001, 0.02) * 1.4
def water(d): n = noise(d); return bp(n, 1500, 7000) * (0.5 + 0.5 * np.abs(np.sin(np.linspace(0, 40, len(n))))) * 0.25
def crinkle(d=0.5): n = noise(d) * (rng.random(int(d * SR)) > 0.9); return bp(n, 2000, 9000) * 0.6
def shing(): t = np.arange(int(0.9 * SR)) / SR; return (bp(noise(0.9), 3000, 9000) * env(len(t), 0.003, 0.25) * 0.5 + np.sin(2 * np.pi * 3200 * t) * env(len(t), 0.002, 0.35) * 0.3)
def heartbeat(): return np.concatenate([thud(0.18, 55) * 0.9, np.zeros(int(0.08 * SR)), thud(0.22, 50) * 0.7])
def whisper(d): n = noise(d); return bp(n, 1800, 6000) * (0.4 + 0.6 * np.abs(np.sin(np.linspace(0, 23, len(n))))) * 0.18
# p0 water at the sink
put(T0('p0') - 0.2, water(L['p0']['t1'] - T0('p0') + 0.4), 0.8)
# p1 the senior's footsteps, the box crinkles as he holds it out
for k in range(4): put(T0('p1') + 0.1 + k * 0.27, step(), 0.7)
put(W('p1', '이거', 1.4), crinkle(0.4), 0.7)
put(T0('p2') + 0.2, whoosh(0.25), 0.3); put(T0('p2') + 0.7, whoosh(0.25), 0.3)
# p5 squeezing the box; p6 the pat
put(T0('p5') + 0.3, crinkle(L['p5']['t1'] - T0('p5')), 0.35)
put(W('p6', '둥글', 1.5) + 0.2, thud(0.12, 160), 0.5)
# freeze: heartbeat
for k in range(3): put(T0('p7') + 0.1 + k * 0.62, heartbeat(), 0.8)
# the dagger
put(W('n2', '비수', 7.0) - 0.15, shing(), 0.9); put(W('n2', '비수', 7.0) + 0.1, thud(0.4, 60), 0.8)
# ghosts whisper
put(W('n3', '제', 2.0), whisper(L['n3']['t1'] - W('n3', '제', 2.0)), 1.0)
# street footsteps
for lid in ('n4', 'n5', 'z1', 'n6'):
    tt = T0(lid)
    while tt < L[lid]['t1']: put(tt, step(), 0.45); tt += 0.5
put(W('n6', '축하', 0.2), pop_(1200), 0.6); put(W('n6', '심리', 3.0) - 0.1, thud(0.6, 50), 1.0)
mix = voice * 1.0 + bed + sfx * 0.55
sf.write('mix_raw_v.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'mix_raw_v.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), 'mix_v.wav'], check=True)
print('dur', round(DUR, 2))
