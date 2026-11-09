import json, re, numpy as np, soundfile as sf
from scipy.signal import resample_poly
from faster_whisper import WhisperModel
TL = json.load(open('timeline_ai_sample.json')); from lines_ai import LINES; SP = {l[0]: (l[4] or l[3]) for l in LINES}
m, sr = sf.read('mix_ai_sample.wav', dtype='float32'); m = m.mean(1) if m.ndim > 1 else m; m16 = resample_poly(m, 160, 441).astype(np.float32)
asr = WhisperModel('small', device='cpu', compute_type='int8', cpu_threads=2)
H = lambda s: re.sub(r'[^가-힣]', '', s)
def cer(a, b):
    a, b = H(a), H(b); d = list(range(len(b) + 1))
    for x in a:
        p, d[0] = d[0], d[0] + 1
        for j, y in enumerate(b, 1): p, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, p + (x != y))
    return d[len(b)] / max(1, len(b))
tk = json.load(open('takes.json'))
import sys
ONLY = sys.argv[1:]
for l in TL['lines']:
    if not l.get('v') or (ONLY and l['id'] not in ONLY): continue
    seg, _ = asr.transcribe(m16[int((l['t0'] - 0.1) * 16000):int((l['t1'] + 0.2) * 16000)], language='ko', beam_size=5, condition_on_previous_text=False)
    hyp = ''.join(s.text for s in seg).strip(); c = cer(hyp, SP[l['id']]); flag = ' <<' if c > tk[l['id']]['cer'] + 0.06 else ''
    print(l['id'], round(c, 3), 'dry', tk[l['id']]['cer'], hyp[:60] + flag, flush=True)
