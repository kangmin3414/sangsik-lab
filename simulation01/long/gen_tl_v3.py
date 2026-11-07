"""timeline_v3.json (+ word timings relative to each line's audio start, + mouth envelope for character voices) and voice_v3.wav"""
import json, os, numpy as np, soundfile as sf
from scipy.signal import resample_poly
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
from lines_v3 import LINES, SAMPLE, SAME
takes = json.load(open('takes_v3.json'))
for a_, b_ in SAME.items():
    if b_ in takes: takes[a_] = takes[b_]; SR = 44100
GAP = {'c1': 0.4, 'c2': 0.15, 'c3': 0.1, 'm1': 0.45, 'm2': 0.05, 't0': 0.3, 'u1': 0.5, 'u2': 0.2, 'u3': 0.3, 'u5': 0.05, 'b1': 0.7, 'p1': 0.6, 'p2': 0.1, 'p4': 0.15, 'p5': 0.3, 'p8': 0.3, 'p9': 0.05, 'p11': 0.2}
from faster_whisper import WhisperModel
asr = WhisperModel('small', device='cpu', compute_type='int8', cpu_threads=4)
words = json.load(open('words_v3.json')) if os.path.exists('words_v3.json') else {}
t = 0.4; out = []; prev = None; clips = []
for lid, scene, v, txt, sp, args in [l for l in LINES if not os.environ.get('SAMPLE') or l[0] in SAMPLE]:
    args = dict(args, _id=lid, _v=v)
    t += GAP.get(lid, 0.25 if scene == prev else 0.42)
    if txt is None:
        d = args.get('dur', 2.4); out.append({'id': lid, 'scene': scene, 'v': None, 'args': args, 'sub': '', 't0': round(t, 3), 't1': round(t + d, 3)}); t += d; prev = scene; continue
    w, sr = sf.read(takes[lid]['take'], dtype='float32'); w = w.mean(1) if w.ndim > 1 else w
    a = np.abs(w); idx = np.where(a > a.max() * 0.02)[0]; a0 = max(0, idx[0] - int(0.03 * sr)); a1 = min(len(w), idx[-1] + int(0.08 * sr)); seg = w[a0:a1]; d = len(seg) / sr
    key = takes[lid]['take']
    if words.get(lid, {}).get('take') != key:
        s16 = resample_poly(seg, 2, 3).astype(np.float32) if sr == 24000 else seg
        sg, _ = asr.transcribe(s16, language='ko', beam_size=5, word_timestamps=True, condition_on_previous_text=False)
        words[lid] = {'take': key, 'words': [{'w': x.word.strip(), 't': round(x.start, 3)} for s in sg for x in s.words]}
    fr = int(0.02 * sr); nfr_ = max(1, len(seg) // fr); rmsf = np.sqrt(np.mean(seg[:nfr_ * fr].reshape(nfr_, fr) ** 2, axis=1)); p90 = np.percentile(rmsf[rmsf > rmsf.max() * 0.05], 90) if (rmsf > 0).any() else 1
    gain = float(np.clip((0.138 if v == 'S' else 0.11) / (p90 + 1e-9), 0.3, 2.0)); seg = seg * gain   # dialogue leveling: lines sit within ~2 dB (Sora's shouts +2 dB)
    if v == 'S' and gain < 0.8: seg = np.tanh(seg * 2.0) / 2.0                      # soften the shouted lines' peaks a little
    clips.append((t, resample_poly(seg, 441, 240) if sr == 24000 else seg, v))
    out.append({'id': lid, 'scene': scene, 'v': v, 'args': args, 'sub': txt, 't0': round(t, 3), 't1': round(t + d, 3), 'words': words[lid]['words'],
                'segs': [{'v': v, 'text': txt, 't0': round(t, 3), 't1': round(t + d, 3)}]})
    t += d; prev = scene
json.dump(words, open('words_v3.json', 'w'), ensure_ascii=False, indent=1)
DUR = t + 1.2; N = int(DUR * SR); voice = np.zeros(N); chv = np.zeros(N)
for st, w, v in clips:
    i = int(st * SR); voice[i:i + len(w)] += w[:N - i]
    if v != 'N': chv[i:i + len(w)] += w[:N - i]
FPS = 24; hop = SR // FPS; nfr = int(DUR * FPS) + 1
pad = np.pad(chv, (0, max(0, nfr * hop - len(chv)))); rms = np.sqrt(np.mean(pad[:nfr * hop].reshape(nfr, hop) ** 2, axis=1))
envv = np.clip(rms / (np.percentile(rms[rms > 1e-4], 90) + 1e-9), 0, 1) if (rms > 1e-4).any() else rms
json.dump({'duration': round(DUR, 3), 'lines': out, 'env': [round(float(x), 2) for x in envv]}, open('timeline_v3.json', 'w'), ensure_ascii=False, indent=1)
sf.write('voice_v3.wav', voice, SR)
print('duration', round(DUR, 1), 'lines', len(out))
