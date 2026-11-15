"""완성 믹스를 줄마다 음성 인식해 대본과 비교(효과음·배경음이 말을 덮는 곳 찾기)."""
import json, re, subprocess, numpy as np, os, sys
from faster_whisper import WhisperModel
os.chdir(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, '.'); from lines_fk import LINES
SRC = sys.argv[1] if len(sys.argv) > 1 else '/dev/shm/fk/mix.wav'
TL = json.load(open('timeline_fk.json')); L = {l['id']: l for l in TL['lines']}
raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', SRC, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], capture_output=True).stdout
a = np.frombuffer(raw, np.float32).copy()
m = WhisperModel('small', device='cpu', compute_type='int8')
def ko(s): return re.sub(r'[^가-힣0-9]', '', s)
def cer(r, h):
    d = list(range(len(h) + 1))
    for i, rc in enumerate(r, 1):
        p, d[0] = d[0], i
        for j, hc in enumerate(h, 1): p, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, p + (rc != hc))
    return d[len(h)] / max(1, len(r))
for ln in LINES:
    lid, read = ln[0], (ln[4] or ln[3])
    if not ln[2] or not read: continue
    if len(sys.argv) > 2 and lid not in sys.argv[2].split(','): continue
    if lid not in L: continue
    l = L[lid]; seg = a[int((l['t0'] - 0.1) * 16000):int((l['t1'] + 0.15) * 16000)]
    hyp = ''.join(s.text for s in m.transcribe(seg, language='ko', beam_size=5)[0])
    c = cer(ko(read), ko(hyp))
    print(f"{lid:3s} {c:.2f} {'!!' if c > 0.15 else '  '} {hyp.strip()}", flush=True)
