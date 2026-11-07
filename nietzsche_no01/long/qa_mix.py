import json, re, subprocess, numpy as np, soundfile as sf
from faster_whisper import WhisperModel
subprocess.run(['ffmpeg','-y','-loglevel','error','-i','nietzsche_no_v1.mp4','-ar','16000','-ac','1','/tmp/claude-0/final16.wav'],check=True)
w,_ = sf.read('/tmp/claude-0/final16.wav', dtype='float32')
m = WhisperModel('small', device='cpu', compute_type='int8', cpu_threads=4)
H = lambda s: re.sub(r'[^가-힣]', '', s)
def cer(a, b):
    a, b = H(a), H(b); d = list(range(len(b) + 1))
    for x in a:
        p, d[0] = d[0], d[0] + 1
        for j, y in enumerate(b, 1): p, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, p + (x != y))
    return d[len(b)] / max(1, len(b))
TL = json.load(open('timeline_n.json')); bad = []
for l in TL['lines']:
    if not l.get('sub'): continue
    seg = w[int((l['t0'] - 0.1) * 16000):int((l['t1'] + 0.2) * 16000)]
    s, _ = m.transcribe(seg, language='ko', beam_size=5, condition_on_previous_text=False)
    hyp = ''.join(x.text for x in s); c = cer(hyp, l['sub'])
    if c > 0.08: bad.append((l['id'], round(c, 3), hyp[:60]))
print('lines over 8% CER:', bad)
