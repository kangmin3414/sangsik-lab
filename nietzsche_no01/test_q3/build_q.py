"""Q3 test timeline + audio. -> timeline_q.json, mix_q.wav"""
import json, subprocess, numpy as np, soundfile as sf
from scipy.signal import resample_poly
SR = 44100
W = json.load(open('words.json'))
def take(k):
    w, sr = sf.read(f'../long/takes/{k}_0.wav', dtype='float32'); w = w.mean(1) if w.ndim > 1 else w
    a0 = int(W[k]['a0'] * sr); a = np.abs(w); a1 = np.where(a > a.max() * 0.02)[0][-1] + int(0.08 * sr); w = w[a0:a1]
    return resample_poly(w, 441, 240) if sr == 24000 else w
d1, d2 = take('d1'), take('d2')
L = []; t = 0.3
def add(id, scene, dur, sub='', v=None, words=None):
    global t
    l = {'id': id, 'scene': scene, 'args': {}, 'sub': sub, 't0': round(t, 3), 't1': round(t + dur, 3)}
    if sub: l['segs'] = [{'v': v, 'text': sub, 't0': l['t0'], 't1': l['t1']}]
    if words: l['words'] = [{'w': x['w'], 't': x['t']} for x in words]
    L.append(l); t += dur
add('s1', 'qwide', 2.2); t += 0.1
add('s2', 'qots', 1.3); t += 0.15
t_d1 = t; add('s3', 'qcu', len(d1) / SR, '죄송하지만 이번엔 제가 맡기 어렵습니다.', 'Z', W['d1']['words']); t += 0.45
t_d2 = t; add('s4', 'qtj', len(d2) / SR + 0.15, '아, 그래요? 알겠어요.', 'T', W['d2']['words'])
add('s5', 'qleave', 1.7)
add('s6', 'qexhale', 3.2)
DUR = t + 0.6; N = int(DUR * SR)
voice = np.zeros(N)
for st, w in ((t_d1, d1), (t_d2, d2)): i = int(st * SR); voice[i:i + len(w)] += w
FPS = 24; hop = SR // FPS; nfr = int(DUR * FPS) + 1
pad = np.pad(voice, (0, max(0, nfr * hop - len(voice)))); rms = np.sqrt(np.mean(pad[:nfr * hop].reshape(nfr, hop) ** 2, axis=1))
envv = np.clip(rms / (np.percentile(rms[rms > 1e-4], 90) + 1e-9), 0, 1)
json.dump({'duration': round(DUR, 3), 'lines': L, 'env': [round(float(x), 2) for x in envv]}, open('timeline_q.json', 'w'), ensure_ascii=False, indent=1)
# bed: the episode's act-4 warm track, ducked under the voice
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', '20', '-i', '../long/bgm/warm_b.mp3', '-ar', str(SR), '-ac', '1', '-t', str(DUR + 1), '/tmp/claude-0/qbed.wav'], check=True)
bed = sf.read('/tmp/claude-0/qbed.wav', dtype='float32')[0][:N]; bed = np.pad(bed, (0, N - len(bed)))
envA = np.convolve((np.abs(voice) > 0.01).astype(float), np.ones(int(0.3 * SR)) / int(0.3 * SR), 'same')
bed *= (0.22 - 0.12 * np.clip(envA * 2.2, 0, 1)); bed[:SR] *= np.linspace(0, 1, SR); bed[-2 * SR:] *= np.linspace(1, 0, 2 * SR)
rng = np.random.default_rng(3); sfx = np.zeros(N)
def put(t0, w, g):
    i = int(t0 * SR); w = w[:max(0, N - i)]; sfx[i:i + len(w)] += w * g
def step(): tt = np.arange(int(0.07 * SR)) / SR; return rng.standard_normal(len(tt)) * np.exp(-tt * 70) * 0.5
def rustle(d=0.35): n = rng.standard_normal(int(d * SR)); return n * np.sin(np.linspace(0, np.pi, len(n))) ** 2 * 0.25
def breath(d=0.9): n = rng.standard_normal(int(d * SR)); from scipy.signal import butter, lfilter; b, a = butter(2, [300 / (SR / 2), 1800 / (SR / 2)], 'band'); x = lfilter(b, a, n); return x / (np.abs(x).max() + 1e-9) * np.sin(np.linspace(0, np.pi, len(x))) ** 1.5 * 0.35
s1, s2, s5, s6 = L[0]['t0'], L[1]['t0'], L[4]['t0'], L[5]['t0']
for k in range(7): put(s1 + 0.1 + k * 0.23, step(), 0.6)
put(s1 + 1.8, rustle(), 0.8)
put(s2 + 0.25, breath(0.8), 0.9)                        # inhale
put(s5 + 0.05, rustle(0.3), 0.9); [put(s5 + 0.35 + k * 0.22, step(), 0.5) for k in range(6)]
put(s6 + 0.15, breath(1.2), 1.0)                        # the long exhale
mix = voice * 0.95 + bed + sfx * 0.6
sf.write('/tmp/claude-0/qmix_raw.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/tmp/claude-0/qmix_raw.wav', '-af', 'loudnorm=I=-14:TP=-1.0:LRA=9', '-ar', str(SR), 'mix_q.wav'], check=True)
print('dur', round(DUR, 2), [(l['id'], l['t0'], l['t1']) for l in L])
