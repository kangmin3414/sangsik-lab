"""마커 샘플 소리: 목소리(/dev/shm/op/ms_voice.wav) + 마커 사각거림(획·글씨, 직접 합성) + 종이 넘김 + 임시 배경음(축의금 편 lab, 목소리 아래로 덕킹) → loudnorm -14.
사건 시각은 페이지가 내놓은 /dev/shm/op/fr_ms/events.json에서 읽는다."""
import json, os, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, lfilter, resample_poly
SR = 48000; R = np.random.default_rng(7)
FR = os.environ.get('FR', '/dev/shm/op/fr_ms')
ev = json.load(open(f'{FR}/events.json')); DUR = ev['dur']; EV = ev['ev']; N = int(DUR * SR)
v, vsr = sf.read('/dev/shm/op/ms_voice.wav', dtype='float32'); v = resample_poly(v, SR, vsr)[:N]; v = np.pad(v, (0, N - len(v)))
fx = np.zeros(N)
def bp(x, lo, hi): b, a = butter(2, [lo / (SR / 2), hi / (SR / 2)], 'band'); return lfilter(b, a, x)
def put(buf, t, x, g):
    i = int(t * SR)
    if i < 0 or i >= N: return
    x = x[:N - i]; buf[i:i + len(x)] += x * g
for e in EV:
    if e['type'] == 'peel':   # 종이를 걷어 내는 '스윽': 높은 띠가 위로 쓸려 올라감
        d = 0.42; n = int(d * SR); t = np.arange(n) / SR; x = R.standard_normal(n)
        x = bp(x, 900, 7000) * np.sin(np.pi * t / d) ** 1.5 * (0.5 + 0.5 * t / d); put(fx, e['t'] - 0.02, x / np.abs(x).max(), 0.16); continue
    if e['type'] == 'pop':    # 인물이 튀어나올 때 '뿅'(위로 미끄러지는 짧은 음)
        n = int(0.14 * SR); t = np.arange(n) / SR; f = 420 + 900 * t / 0.14; x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 18); put(fx, e['t'], x, 0.12); continue
    if e['type'] == 'jump':   # 뛰는 동안 '휙'
        d = max(0.2, e.get('dur', 0.5)); n = int(d * SR); t = np.arange(n) / SR; x = bp(R.standard_normal(n), 600, 3200) * np.sin(np.pi * t / d) ** 2; put(fx, e['t'], x / np.abs(x).max(), 0.13); continue
    if e['type'] == 'land':   # 내려앉을 때 종이 위 '톡'
        n = int(0.25 * SR); t = np.arange(n) / SR; x = np.sin(2 * np.pi * (95 + 80 * np.exp(-t * 30)) * t) * np.exp(-t * 16) + 0.3 * bp(R.standard_normal(n), 1500, 5000) * np.exp(-t * 60); put(fx, e['t'], x / np.abs(x).max(), 0.35); continue
    d = max(0.05, min(e.get('dur', 0.3), 2.5)); n = int(d * SR); t = np.arange(n) / SR
    am = 0.6 + 0.4 * np.abs(np.sin(2 * np.pi * (7 if e['type'] == 'stroke' else 11) * t))
    x = bp(R.standard_normal(n), 2500, 8000) * am * np.minimum(1, t / 0.015) * np.minimum(1, (d - t) / 0.02)
    put(fx, e['t'], x / (np.abs(x).max() + 1e-9), 0.075 if e['type'] == 'stroke' else 0.04)
fx += bp(R.standard_normal(N), 200, 2000) * 0.002   # 종이 공기
# 임시 배경음: 축의금 편 lab(노래 목소리 검사 0구간). 본편에서는 Lyria로 새로 만든다.
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-stream_loop', '-1', '-i', '/home/claude/sangsik-lab/gift01/long/bgm/lab.mp3', '-t', str(DUR), '-ac', '1', '-ar', str(SR), '/dev/shm/op/tmp/ms_bed.wav'], check=True)
bed, _ = sf.read('/dev/shm/op/tmp/ms_bed.wav', dtype='float32'); bed = np.pad(bed, (0, max(0, N - len(bed))))[:N]
bed = bed / (np.sqrt(np.mean(bed ** 2)) + 1e-9) * 0.05
vad = np.convolve((np.abs(v) > 0.01).astype(float), np.ones(int(0.3 * SR)) / int(0.3 * SR), 'same')
duck = 1 - 0.55 * np.clip(vad * 3, 0, 1); d10 = duck[::480]   # 10 ms 단위, 말끝 0.5초 동안 낮춘 채 유지
duck = np.array([d10[max(0, i - 49):i + 1].min() for i in range(len(d10))]).repeat(480)[:N]; duck = np.pad(duck, (0, N - len(duck)), mode='edge')
fade = np.ones(N); fade[:int(0.6 * SR)] = np.linspace(0, 1, int(0.6 * SR)); fade[-int(1.8 * SR):] = np.linspace(1, 0, int(1.8 * SR))
GB, GF = float(os.environ.get('GB', 1)), float(os.environ.get('GF', 1))   # 점검용: 배경음·효과음 배율
mix = v + GF * fx * (1 - 0.6 * np.clip(vad * 3, 0, 1)) + GB * bed * duck * fade   # 말하는 동안은 마커 소리도 낮춘다
sf.write('/dev/shm/op/ms_mix_raw.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/dev/shm/op/ms_mix_raw.wav', '-af', 'alimiter=limit=0.7:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), os.environ.get('OUT', '/dev/shm/op/ms_mix.wav')], check=True)
print('ok', round(float(np.abs(mix).max()), 2))
