"""timeline_ml.json: 줄별 시각 + 낱말 시각(줄 시작부터의 초) + 입 모양용 음량(24fps, 인물 목소리만) + 줄별 테이크 자른 위치(스테레오 믹스용). 목소리 모노 합본은 /dev/shm/ml/voice_ml.wav(점검용).
python3 gen_tl.py sample"""
import json, os, sys, numpy as np, soundfile as sf
from scipy.signal import resample_poly
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
from lines_ml import LINES, SAMPLE
takes = json.load(open('takes.json')); SR = 44100
# 줄 앞의 쉼(초): 화면에서 일이 벌어질 자리(스티커가 붙고, 부품이 뜨고, 전환이 지나갈 시간)
GAP = {'n1': 0.5, 'n2': 0.6, 'n3': 0.55, 'n4': 0.45, 'n5': 0.5, 'n6': 0.75, 'k0': 0.95, 'o7': 0.5, 'o8': 0.55, 'o9': 0.5, 'o10': 0.45, 'o11': 0.6, 'o12': 0.75, 'o13': 0.55,
       's14': 1.15, 's15': 0.5, 's16': 0.45, 's17': 0.75, 's18': 0.45, 's19': 0.4, 's20': 0.5, 's21': 0.4, 's22': 0.5, 's23': 0.55, 's24': 0.6, 's25': 0.35, 's26': 0.75, 's27': 0.95, 's28': 1.55, 's29': 0.85, 's30': 0.6, 's31': 0.85, 's32': 0.7}
# GAP = 그 줄 앞의 쉼. s28 앞 1.55초는 '어색한 침묵'(바람 한 줄기 + 굴러가는 잎 + 말줄임표)을 위한 자리다: 0.65초일 때는 바람 소리가 제로의 말 첫머리를 덮었다
ANCHOR = {}      # 렌더 도중 앞줄을 다시 녹음할 때만 쓴다: {'줄 id': 시작 시각}으로 뒤 줄의 시각을 묶어 두면 그 뒤를 다시 그리지 않아도 된다. 전체를 다시 그릴 때는 비운다(2026-11-22 13시: 비움. 그 전 값은 s17 72.711 · s27 114.979 · s31 134.333)
from faster_whisper import WhisperModel
asr = WhisperModel('small', device='cpu', compute_type='int8', cpu_threads=2)
words = json.load(open('words.json')) if os.path.exists('words.json') else {}
t = 0.4; out = []; clips = []
ONLY = SAMPLE if 'sample' in sys.argv else None
for lid, scene, v, txt, sp, args in LINES:
    if ONLY and lid not in ONLY: continue
    t += GAP.get(lid, 0.4)
    if lid in ANCHOR and ANCHOR[lid] >= t - 0.45: t = ANCHOR[lid]          # 앞줄을 다시 녹음해 길이가 달라져도 이 줄의 시작은 그대로(쉼이 0.3초 밑으로 줄지 않는 한)
    if txt is None:
        d = args.get('dur', 2.4); out.append({'id': lid, 'scene': scene, 'v': None, 'args': args, 'sub': '', 't0': round(t, 3), 't1': round(t + d, 3)}); t += d; continue
    src = takes[lid]['take']; w, sr = sf.read(src, dtype='float32'); w = w.mean(1) if w.ndim > 1 else w
    a = np.abs(w); idx = np.where(a > a.max() * 0.02)[0]; a0 = max(0, idx[0] - int(0.03 * sr)); a1 = min(len(w), idx[-1] + int(0.08 * sr)); seg = w[a0:a1]; d = len(seg) / sr
    if words.get(lid, {}).get('take') != src:
        s16 = resample_poly(seg, 2, 3).astype(np.float32) if sr == 24000 else seg
        sg, _ = asr.transcribe(s16, language='ko', beam_size=5, word_timestamps=True, condition_on_previous_text=False)
        words[lid] = {'take': src, 'words': [{'w': x.word.strip(), 't': round(x.start, 3)} for s in sg for x in s.words]}
    clips.append((t, resample_poly(seg, 441, 240) if sr == 24000 else seg, v))
    out.append({'id': lid, 'scene': scene, 'v': v, 'args': args, 'sub': txt, 't0': round(t, 3), 't1': round(t + d, 3), 'words': words[lid]['words'], 'clip': {'take': src, 'a0': int(a0), 'a1': int(a1), 'sr': int(sr)},
                'segs': [{'v': v, 'text': txt, 't0': round(t, 3), 't1': round(t + d, 3)}]})
    t += d
json.dump(words, open('words.json', 'w'), ensure_ascii=False, indent=1)
DUR = t + 3.2; N = int(DUR * SR); voice = np.zeros(N); chv = np.zeros(N)
for st, w, v in clips:
    i = int(st * SR); voice[i:i + len(w)] += w[:N - i]
    if v != 'N': chv[i:i + len(w)] += w[:N - i]
FPS = 24; hop = SR // FPS; nfr = int(DUR * FPS) + 1
pad = np.pad(chv, (0, max(0, nfr * hop - len(chv)))); rms = np.sqrt(np.mean(pad[:nfr * hop].reshape(nfr, hop) ** 2, axis=1))
envv = np.clip(rms / (np.percentile(rms[rms > 1e-4], 90) + 1e-9), 0, 1) if (rms > 1e-4).any() else rms
json.dump({'duration': round(DUR, 3), 'lines': out, 'env': [round(float(x), 2) for x in envv]}, open('timeline_ml.json', 'w'), ensure_ascii=False, indent=1)
os.makedirs('/dev/shm/ml', exist_ok=True); sf.write('/dev/shm/ml/voice_ml.wav', voice, SR)
import backup_takes; backup_takes.sync(quiet=True)      # takes.json을 손으로 바꾼 뒤에도 백업이 따라오게
print('duration', round(DUR, 1), 'lines', len(out))
for l in out: print(l['id'], l['t0'], l['t1'], ' '.join(f"{w['w']}@{w['t']}" for w in l.get('words', []))[:150])
