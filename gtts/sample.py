"""Voice comparison sample: current narrator (Supertonic M2) vs. Google voices, same three lines from ep.004."""
import os, sys, json, numpy as np, soundfile as sf, subprocess
from scipy.signal import resample_poly
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gtts import synth
SP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(SP, 'sugar')); import script
S = script.S
spoken = lambda i: (S[i][3] or S[i][2])
L = [spoken(0), spoken(15), spoken(38)]
SR = 44100
os.makedirs('cache', exist_ok=True)
VOICES = ['ko-KR-Chirp3-HD-Charon', 'ko-KR-Chirp3-HD-Sadaltager', 'ko-KR-Chirp3-HD-Rasalgethi', 'ko-KR-Chirp3-HD-Iapetus',
          'ko-KR-Chirp3-HD-Algieba', 'ko-KR-Chirp3-HD-Schedar', 'ko-KR-Neural2-C']
NUM = ['일', '이', '삼', '사', '오', '육', '칠', '팔', '구']
def load(p):
    w, sr = sf.read(p)
    if w.ndim > 1: w = w.mean(1)
    if sr != SR: w = resample_poly(w, SR // 100 if SR % 100 == 0 else SR, sr // 100 if sr % 100 == 0 else sr)
    return w
def norm(w):
    a = np.abs(w); v = w[a > 0.01 * a.max()]; return w / (np.sqrt(np.mean(v ** 2)) + 1e-9) * 0.08
gap = lambda s: np.zeros(int(s * SR))
segs = []; order = []
# 1) current narrator: the real takes from the episode (lines 0 and 15 from the published narration, the new closing line)
tl0 = json.load(open(os.path.join(SP, 'sugar', 'timeline.json.bak_rename')))['lines']
tl1 = json.load(open(os.path.join(SP, 'sugar', 'timeline.json')))['lines']
v0, _ = sf.read(os.path.join(SP, 'sugar', 'voice.wav.bak_rename')); v1, _ = sf.read(os.path.join(SP, 'sugar', 'voice.wav'))
cut = lambda v, l: v[int(l['t0'] * SR):int(l['t1'] * SR)]
import supertonic as stn
tts = stn.TTS(model='supertonic-3'); st = tts.get_voice_style('M2')
w, _ = tts.synthesize('일 번 목소리.', voice_style=st, lang='ko', total_steps=12, speed=0.96, silence_duration=0.2)
w = np.asarray(w).reshape(-1); idx = np.where(np.abs(w) > 0.01 * np.abs(w).max())[0]; lab = w[idx[0]:idx[-1] + 2000]
segs += [norm(lab), gap(0.5), norm(cut(v0, tl0[0])), gap(0.5), norm(cut(v0, tl0[15])), gap(0.5), norm(cut(v1, tl1[38])), gap(1.3)]
order.append('1번: 지금 목소리 (Supertonic M2)')
for k, v in enumerate(VOICES):
    n = k + 2
    lab = load(synth(f'{NUM[n - 1]} 번 목소리.', v, f'cache/{v}_label{n}.wav'))
    parts = [load(synth(t, v, f'cache/{v}_{j}.wav')) for j, t in enumerate(L)]
    segs += [norm(lab), gap(0.5)]
    for p in parts: segs += [norm(p), gap(0.5)]
    segs[-1] = gap(1.3)
    order.append(f'{n}번: {v.replace("ko-KR-", "")}')
out = np.concatenate(segs); out = out / (np.abs(out).max() + 1e-9) * 0.9
sf.write('voice_compare.wav', out, SR)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'voice_compare.wav', '-c:a', 'libmp3lame', '-b:a', '160k', '나레이션_목소리_비교.mp3'], check=True)
print('\n'.join(order)); print('total %.1fs' % (len(out) / SR))
