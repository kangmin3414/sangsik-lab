"""완성본 소리를 줄마다 받아써서 깨끗한 녹음 테이크와 비교(효과음·음악이 대사를 가리는 곳 찾기)."""
import json, re, subprocess, sys, numpy as np
from faster_whisper import WhisperModel
from lines_v2s import LINES, SAME
T = json.load(open('timeline_v2.json')); tk = json.load(open('takes_v2.json'))
for a_, b_ in SAME.items():
    if b_ in tk: tk[a_] = tk[b_]
m = WhisperModel('small', device='cpu', compute_type='int8', cpu_threads=4)
a = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', sys.argv[1], '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], capture_output=True).stdout, np.float32)
H = lambda s: re.sub(r'[^가-힣]', '', s)
def cer(x, y):
    x, y = H(x), H(y); d = list(range(len(y) + 1))
    for c in x:
        p, d[0] = d[0], d[0] + 1
        for j, z in enumerate(y, 1): p, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, p + (c != z))
    return d[len(y)] / max(1, len(y))
sp = {l[0]: (l[4] or l[3]) for l in LINES}; bad = 0
for l in T['lines']:
    if not l['v']: continue
    seg = a[int((l['t0'] - 0.1) * 16000):int((l['t1'] + 0.15) * 16000)]
    s, _ = m.transcribe(seg, language='ko', beam_size=5, condition_on_previous_text=False)
    hyp = ''.join(x.text for x in s).strip(); c = cer(hyp, sp[l['id']]); worse = c > tk[l['id']]['cer'] + 0.03
    bad += worse; print(l['id'], round(c, 3), '(clean', tk[l['id']]['cer'], ')', hyp[:50], '<-- WORSE' if worse else '')
print('worse lines:', bad)
