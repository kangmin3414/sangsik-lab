"""timeline_gy.json (+ word timings relative to each line's audio start, + mouth envelope for character voices) and voice_b.wav"""
import json, os, numpy as np, soundfile as sf
from scipy.signal import resample_poly
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
from lines_gy import LINES, SAMPLE
takes = json.load(open('takes.json')); SR = 44100
GAP = {"o1": 0.5, "o2": 0.45, "o3": 0.5, "o4": 0.3, "o5": 0.55, "o6": 0.35, "k0": 0.6, "g1": 0.4, "g2": 0.3, "g3": 0.45, "g4": 0.5, "g5": 0.55, "g6": 0.55, "g7": 0.35, "g8": 0.6, "g9": 0.55,
       "c1": 0.6, "c2": 0.7, "c3": 0.7, "c5": 0.45, "c7": 0.6, "c8": 0.5, "r0": 0.6, "d1": 0.3, "d2": 0.45, "d3": 1.3, "d4": 0.6, "d5": 0.7,
       "e1": 1.0, "e2": 0.55, "e3": 0.7, "e4": 0.5, "e5": 0.9}
PITCH = {}
from faster_whisper import WhisperModel
asr = WhisperModel('small', device='cpu', compute_type='int8', cpu_threads=4)
words = json.load(open('words.json')) if os.path.exists('words.json') else {}
t = 0.4; out = []; prev = None; clips = []
import sys
ONLY = SAMPLE if 'sample' in sys.argv else None
for lid, scene, v, txt, sp, args in LINES:
    if ONLY and lid not in ONLY: continue
    t += GAP.get(lid, 0.18 if scene == prev else 0.32)   # 빠른 템포: 줄 사이를 짧게
    if txt is None:
        d = args.get('dur', 2.4); out.append({'id': lid, 'scene': scene, 'v': None, 'args': args, 'sub': '', 't0': round(t, 3), 't1': round(t + d, 3)}); t += d; prev = scene; continue
    src = takes[lid]['take']
    if v in PITCH:
        hi = src.replace('.wav', '_hi.wav')
        if not os.path.exists(hi):
            import subprocess; subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', src, '-af', PITCH[v], hi], check=True)
        src = hi
    w, sr = sf.read(src, dtype='float32'); w = w.mean(1) if w.ndim > 1 else w
    a = np.abs(w); idx = np.where(a > a.max() * 0.02)[0]; a0 = max(0, idx[0] - int(0.03 * sr)); a1 = min(len(w), idx[-1] + int(0.08 * sr)); seg = w[a0:a1]; d = len(seg) / sr
    key = takes[lid]['take']
    if words.get(lid, {}).get('take') != key:
        s16 = resample_poly(seg, 2, 3).astype(np.float32) if sr == 24000 else seg
        sg, _ = asr.transcribe(s16, language='ko', beam_size=5, word_timestamps=True, condition_on_previous_text=False)
        words[lid] = {'take': key, 'words': [{'w': x.word.strip(), 't': round(x.start, 3)} for s in sg for x in s.words]}
    clips.append((t, resample_poly(seg, 441, 240) if sr == 24000 else seg, v))
    out.append({'id': lid, 'scene': scene, 'v': v, 'args': args, 'sub': txt, 't0': round(t, 3), 't1': round(t + d, 3), 'words': words[lid]['words'],
                'segs': [{'v': v, 'text': txt, 't0': round(t, 3), 't1': round(t + d, 3)}]})
    t += d; prev = scene
json.dump(words, open('words.json', 'w'), ensure_ascii=False, indent=1)
DUR = t + 2.6; N = int(DUR * SR); voice = np.zeros(N); chv = np.zeros(N)
for st, w, v in clips:
    i = int(st * SR); voice[i:i + len(w)] += w[:N - i]
    if v != 'N': chv[i:i + len(w)] += w[:N - i]
FPS = 24; hop = SR // FPS; nfr = int(DUR * FPS) + 1
pad = np.pad(chv, (0, max(0, nfr * hop - len(chv)))); rms = np.sqrt(np.mean(pad[:nfr * hop].reshape(nfr, hop) ** 2, axis=1))
envv = np.clip(rms / (np.percentile(rms[rms > 1e-4], 90) + 1e-9), 0, 1) if (rms > 1e-4).any() else rms
json.dump({'duration': round(DUR, 3), 'lines': out, 'env': [round(float(x), 2) for x in envv]}, open('timeline_gy.json', 'w'), ensure_ascii=False, indent=1)
sf.write('/dev/shm/gy/voice_gy.wav', voice, SR)
print('duration', round(DUR, 1), 'lines', len(out))
