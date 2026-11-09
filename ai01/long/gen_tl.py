"""timeline_ai.json (+ 단어 시각, 인물 목소리 입 모양 env) + voice_ai.wav. SAMPLE_END까지 자른 timeline_ai_sample.json / voice_ai_sample.wav도 만든다."""
import json, os, re, subprocess, numpy as np, soundfile as sf
from scipy.signal import resample_poly
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
from lines_ai import LINES, SAMPLE_END
takes = json.load(open('takes.json')); SR = 44100
GAP = {'s0': 0.0, 'z1': 0.1, 's1': 0.15, 'a1': 0.0, 'n1': 0.45, 's2': 0.35, 'n2': 0.0, 's3': 0.1, 's4': 0.0, 't1': 0.05, 's5': 0.1, 'sd': 0.15, 'z2': 0.0, 'n3': 0.5,
       's6': 0.5, 'n4': 0.0, 'n5': 0.45, 'n6': 0.45, 'z3': 0.35, 'n7': 0.5, 'n8': 0.4, 's7': 0.4, 'n9': 0.2, 's8': 0.6, 'n10': 0.1, 't2': 0.35, 's9': 0.5, 'n11': 0.0, 'z4': 0.6, 't3': 0.45,
       's10': 0.8, 'n12': 0.1, 'n13': 0.6, 's11': 0.2}
PITCH = {'A': 'aecho=0.85:0.6:28|55:0.16|0.08'}  # AI: 살짝 비현실적인 울림
from faster_whisper import WhisperModel
asr = WhisperModel('small', device='cpu', compute_type='int8', cpu_threads=4)
words = json.load(open('words.json')) if os.path.exists('words.json') else {}
t = 0.4; out = []; prev = None; clips = []
for lid, scene, v, txt, sp, args in LINES:
    t += GAP.get(lid, 0.25 if scene == prev else 0.42)
    if txt is None:
        d = args.get('dur', 2.4); out.append({'id': lid, 'scene': scene, 'v': None, 'args': args, 'sub': '', 't0': round(t, 3), 't1': round(t + d, 3)}); t += d; prev = scene; continue
    src = takes[lid]['take']
    if v in PITCH:
        hi = src.replace('.wav', '_hi.wav')
        if not os.path.exists(hi): subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', src, '-af', PITCH[v], hi], check=True)
        src = hi
    w, sr = sf.read(src, dtype='float32'); w = w.mean(1) if w.ndim > 1 else w
    a = np.abs(w); idx = np.where(a > a.max() * 0.02)[0]; a0 = max(0, idx[0] - int(0.03 * sr)); a1 = min(len(w), idx[-1] + int(0.08 * sr)); seg = w[a0:a1]; d = len(seg) / sr
    key = src
    if words.get(lid, {}).get('take') != key:
        s16 = resample_poly(seg, 2, 3).astype(np.float32) if sr == 24000 else seg
        sg, _ = asr.transcribe(s16, language='ko', beam_size=5, word_timestamps=True, condition_on_previous_text=False)
        words[lid] = {'take': key, 'words': [{'w': x.word.strip(), 't': round(x.start, 3)} for s in sg for x in s.words]}
    clips.append((t, resample_poly(seg, 441, 240) if sr == 24000 else seg, v))
    txt = re.sub(r'(\d[만천]?) (원|5천)', lambda m: m.group(1) + '\u00a0' + m.group(2), txt)
    out.append({'id': lid, 'scene': scene, 'v': v, 'args': args, 'sub': txt, 'say': sp or txt, 't0': round(t, 3), 't1': round(t + d, 3), 'words': words[lid]['words'],
                'segs': [{'v': v, 'text': txt, 't0': round(t, 3), 't1': round(t + d, 3)}]})
    t += d; prev = scene
json.dump(words, open('words.json', 'w'), ensure_ascii=False, indent=1)
def write(lines, dur, tag):
    N = int(dur * SR); voice = np.zeros(N); chv = np.zeros(N)
    for st, w, v in clips:
        i = int(st * SR)
        if i >= N: continue
        voice[i:i + len(w)] += w[:N - i]
        if v != 'N': chv[i:i + len(w)] += w[:N - i]
    FPS = 24; hop = SR // FPS; nfr = int(dur * FPS) + 1
    pad = np.pad(chv, (0, max(0, nfr * hop - len(chv)))); rms = np.sqrt(np.mean(pad[:nfr * hop].reshape(nfr, hop) ** 2, axis=1))
    envv = np.clip(rms / (np.percentile(rms[rms > 1e-4], 90) + 1e-9), 0, 1) if (rms > 1e-4).any() else rms
    json.dump({'duration': round(dur, 3), 'lines': lines, 'env': [round(float(x), 2) for x in envv]}, open(f'timeline_ai{tag}.json', 'w'), ensure_ascii=False, indent=1)
    sf.write(f'voice_ai{tag}.wav', voice, SR)
    print(tag or 'full', 'duration', round(dur, 1), 'lines', len(lines))
write(out, t + 1.2, '')
k = [l['id'] for l in out].index(SAMPLE_END); write(out[:k + 1], out[k]['t1'] + 0.6, '_sample')
