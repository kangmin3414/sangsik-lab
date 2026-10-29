"""Three narration samples in voice 7 (Chirp3-HD-Schedar): narrator-only passages from the unreleased philosophy episodes."""
import os, sys, json, re, subprocess, numpy as np, soundfile as sf
from scipy.signal import resample_poly
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gtts import synth
SP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOICE = 'ko-KR-Chirp3-HD-Schedar'; SR = 44100
JOBS = [('1_데카르트', 'descartes3', range(0, 5)), ('2_장자', 'zhuangzi4', range(27, 30)), ('3_붓다', 'buddha2', range(0, 9))]
os.makedirs('cache7', exist_ok=True)
def load(p):
    w, sr = sf.read(p); return resample_poly(w, 441, 240) if sr == 24000 else w
def trim(w):
    a = np.abs(w); idx = np.where(a > 0.01 * a.max())[0]; return w[max(0, idx[0] - 1300):idx[-1] + 2600]
out_files = []
for name, d, rng in JOBS:
    L = json.load(open(os.path.join(SP, d, 'timeline.json')))['lines']
    parts = []
    for i in rng:
        texts = [s['text'] for s in (L[i].get('segs') or [{'v': 'N', 'text': L[i]['sub']}]) if s.get('v', 'N') == 'N']
        if not texts: continue
        text = ' '.join(texts)
        w = trim(load(synth(text, VOICE, f'cache7/{d}_{i}.wav')))
        parts += [w, np.zeros(int(0.55 * SR))]
    sig = np.concatenate([np.zeros(int(0.4 * SR))] + parts[:-1] + [np.zeros(int(0.8 * SR))])
    sig = sig / (np.abs(sig).max() + 1e-9) * 0.89
    wav = f'sample7_{name}.wav'; sf.write(wav, sig, SR)
    mp3 = f'나레이션샘플_7번_{name}.mp3'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', wav, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '44100', '-c:a', 'libmp3lame', '-b:a', '160k', mp3], check=True)
    out_files.append(mp3); print(mp3, '%.1fs' % (len(sig) / SR))
