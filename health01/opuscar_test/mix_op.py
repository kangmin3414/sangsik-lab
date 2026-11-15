"""세 화풍 시험 영상의 소리. 목소리(/dev/shm/op/voice.wav) + 화풍마다 직접 합성한 효과음(남의 원본 없음) → loudnorm -14.
사용: mix_op.py <pg|riso|marker>. 사건 시각은 페이지가 내놓은 events.json에서 읽는다."""
import sys, json, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, lfilter, resample_poly
S = sys.argv[1]; SR = 48000; R = np.random.default_rng(5)
ev = json.load(open(f'/dev/shm/op/fr_{S}/events.json')); DUR = ev['dur']; EV = ev['ev']; N = int(DUR * SR)
v, vsr = sf.read('/dev/shm/op/voice.wav', dtype='float32'); v = resample_poly(v, SR, vsr)[:N]; v = np.pad(v, (0, N - len(v)))
fx = np.zeros(N); bed = np.zeros(N)
def bp(x, lo, hi): b, a = butter(2, [lo / (SR / 2), hi / (SR / 2)], 'band'); return lfilter(b, a, x)
def lp(x, f): b, a = butter(2, f / (SR / 2)); return lfilter(b, a, x)
def put(buf, t, x, g):
    i = int(t * SR);
    if i < 0 or i >= N: return
    x = x[:N - i]; buf[i:i + len(x)] += x * g
env = lambda d, a=0.004, k=8: (lambda n: np.minimum(1, np.arange(n) / max(1, a * SR)) * np.exp(-k * np.arange(n) / SR))(int(d * SR))
noise = lambda d: R.standard_normal(int(d * SR))
def thump(f=70, d=0.35, k=11): n = int(d * SR); t = np.arange(n) / SR; return np.sin(2 * np.pi * (f + 60 * np.exp(-t * 30)) * t) * np.exp(-k * t)
def clap(): x = bp(noise(0.18), 900, 3500) * env(0.18, 0.002, 26); return x / np.abs(x).max()
def click(f=2200): n = int(0.03 * SR); t = np.arange(n) / SR; return np.sin(2 * np.pi * f * t) * np.exp(-t * 180)
if S == 'pg':   # 박자의 뼈대: 프레임 드럼 + 셰이커(목소리 아래로 아주 작게), 컷마다 북과 짝
    beat = 0.6
    for k in range(int(DUR / beat) + 1):
        t = k * beat; put(bed, t, thump(62, 0.4, 9), 0.5 if k % 4 == 0 else 0.28)
        put(bed, t + beat / 2, bp(noise(0.06), 4000, 9000) * env(0.06, 0.002, 60), 0.05)
    for e in EV:
        if e['type'] == 'cut': put(fx, e['t'], thump(55, 0.5, 7), 0.9); put(fx, e['t'], bp(noise(0.5), 3000, 9000) * env(0.5, 0.002, 6), 0.12)
        else: put(fx, e['t'], clap(), 0.35); put(fx, e['t'], click(1800), 0.25)
elif S == 'riso':  # 인쇄기: 낮은 모터 소리, 판이 들어올 때 '스윽', 컷마다 '철컥'
    t = np.arange(N) / SR; bed += (0.5 * np.sin(2 * np.pi * 58 * t) + 0.25 * np.sin(2 * np.pi * 116 * t) + 0.12 * np.sin(2 * np.pi * 174 * t)) * 0.03 * (1 + 0.15 * np.sin(2 * np.pi * 0.7 * t))
    bed += lp(noise(DUR)[:N], 500) * 0.006
    for e in EV:
        if e['type'] == 'cut': put(fx, e['t'], thump(90, 0.25, 18), 0.7); put(fx, e['t'] + 0.06, click(900), 0.4)
        else: x = bp(noise(0.32), 1200, 6000) * np.sin(np.linspace(0, np.pi, int(0.32 * SR))) ** 2; put(fx, e['t'] - 0.05, x / np.abs(x).max(), 0.22)
else:  # 마커: 획마다 사각거리는 소리(글자는 더 작게), 종이 공기
    bed += bp(noise(DUR)[:N], 200, 2000) * 0.0025
    for e in EV:
        d = max(0.06, min(e.get('dur', 0.3), 3.5)); n = int(d * SR); t = np.arange(n) / SR
        am = 0.6 + 0.4 * np.abs(np.sin(2 * np.pi * (7 if e['type'] == 'stroke' else 11) * t)); x = bp(noise(d)[:n], 2500, 8000) * am * np.minimum(1, t / 0.02) * np.minimum(1, (d - t) / 0.03)
        put(fx, e['t'], x / (np.abs(x).max() + 1e-9), 0.09 if e['type'] == 'stroke' else 0.05)
vad = np.convolve((np.abs(v) > 0.01).astype(float), np.ones(int(0.25 * SR)) / int(0.25 * SR), 'same'); bed *= 1 - 0.6 * np.clip(vad * 3, 0, 1)
mix = v + bed + fx; sf.write(f'/dev/shm/op/mix_{S}_raw.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f'/dev/shm/op/mix_{S}_raw.wav', '-af', 'alimiter=limit=0.7:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), f'/dev/shm/op/mix_{S}.wav'], check=True)
print(S, 'ok', round(float(np.abs(mix).max()), 2))
