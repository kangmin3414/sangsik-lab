import json, os, subprocess, numpy as np, soundfile as sf
from scipy.signal import resample_poly
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
TL = json.load(open('timeline_s.json')); SR = 44100; N = int((TL['end'] + 0.3) * SR)
voice = np.zeros(N)
for L in TL['lines']:
    w, sr = sf.read(L['take'], dtype='float32'); w = w.mean(1) if w.ndim > 1 else w
    w = w[int(L['a0'] * sr):int(L['a1'] * sr)].copy(); w[:int(0.01 * sr)] *= np.linspace(0, 1, int(0.01 * sr)); w[-int(0.04 * sr):] *= np.linspace(1, 0, int(0.04 * sr))
    w = resample_poly(w, 441, 240) if sr == 24000 else w
    i = int(L['t0'] * SR); voice[i:i + len(w)] += w
# music bed
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '../../bgm/cand_1_piano_a.mp3', '-t', str(TL['end'] + 0.3), '-ar', str(SR), '-ac', '1', 'bed.wav'], check=True)
b, _ = sf.read('bed.wav', dtype='float32'); b = b[:N] if len(b) >= N else np.pad(b, (0, N - len(b)))
# duck under voice
env = (np.abs(voice) > 0.01).astype(np.float32); sm = np.ones(int(0.25 * SR)) / int(0.25 * SR); env = np.convolve(env, sm, 'same')
gain = 0.30 - 0.14 * np.clip(env * 2.2, 0, 1)      # ~ -10 dB bed, ducked ~ -16 dB under voice
fo = int(1.8 * SR); b = b * gain; b[-fo:] *= np.linspace(1, 0, fo); b[:int(0.4 * SR)] *= np.linspace(0, 1, int(0.4 * SR))
mix = voice * 1.0 + b * 0.55
sf.write('mix_raw.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'mix_raw.wav', '-af', 'loudnorm=I=-14:TP=-1.0:LRA=9,alimiter=limit=0.89', '-ar', str(SR), 'mix_s.wav'], check=True)
print('audio ok')
