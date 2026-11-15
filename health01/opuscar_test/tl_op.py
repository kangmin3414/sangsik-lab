"""녹음 세 줄을 한 줄로 이어 타임라인(tl.json)과 목소리 트랙(voice.wav)을 만든다. c12는 '보'가 또렷한 둘째 테이크를 쓴다."""
import json, numpy as np, soundfile as sf
from scipy.signal import resample_poly
from faster_whisper import WhisperModel
d = json.load(open('takes_op.json')); d['c12']['take'] = '/dev/shm/op/takes/c12_2.wav'
asr = WhisperModel('small', device='cpu', compute_type='int8', cpu_threads=2)
w, sr = sf.read(d['c12']['take'], dtype='float32'); seg, _ = asr.transcribe(resample_poly(w, 2, 3).astype(np.float32), language='ko', word_timestamps=True)
d['c12']['words'] = [{'w': x.word.strip(), 't': round(x.start, 2)} for s in seg for x in s.words]; d['c12']['dur'] = round(len(w) / sr, 2)
SR = 24000; GAP = {'n11': 0.8, 'c12': 0.6, 'z12': 0.35}; END = 1.9
t = 0; lines = []; parts = []
for lid in ('n11', 'c12', 'z12'):
    t += GAP[lid]; x, r = sf.read(d[lid]['take'], dtype='float32'); assert r == SR
    lines.append({'id': lid, 't0': round(t, 3), 't1': round(t + len(x) / SR, 3), 'sub': d[lid]['sub'], 'words': d[lid]['words']}); parts.append((t, x)); t += len(x) / SR
dur = round(t + END, 2); v = np.zeros(int(dur * SR), np.float32)
for t0, x in parts: i = int(t0 * SR); v[i:i + len(x)] += x
sf.write('/dev/shm/op/voice.wav', v, SR)
json.dump({'dur': dur, 'lines': lines}, open('/dev/shm/op/web/tl.json', 'w'), ensure_ascii=False, indent=1)
print(dur, [(l['id'], l['t0'], l['t1']) for l in lines], d['c12']['words'])
