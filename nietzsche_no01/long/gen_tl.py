import json, os, numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
from lines_n import LINES
takes = json.load(open('takes.json')) if os.path.exists('takes.json') else {}
GAP = {'o2': 0.35, 'n1': 0.7, 'n2': 0.9, 'n3': 0.5, 'n4': 1.0, 'n5': 1.0, 'n6': 1.2}   # pause before each line
t = 1.7; out = []
for lid, scene, v, txt, sp, args in LINES:
    t += GAP.get(lid, 0)
    if lid in takes:
        w, sr = sf.read(takes[lid]['take'], dtype='float32'); w = w.mean(1) if w.ndim > 1 else w
        a = np.abs(w); idx = np.where(a > a.max() * 0.02)[0]; a0 = max(0, idx[0] - int(0.03 * sr)); a1 = min(len(w), idx[-1] + int(0.08 * sr)); d = (a1 - a0) / sr
        rec = {'a0': a0 / sr, 'a1': a1 / sr, 'take': takes[lid]['take']}
    else: d = len(txt) * 0.16; rec = {}
    out.append(dict({'id': lid, 'scene': scene, 'v': v, 'args': args, 'sub': txt, 't0': round(t, 3), 't1': round(t + d, 3), 'segs': [{'v': v, 'text': txt, 't0': round(t, 3), 't1': round(t + d, 3)}]}, **rec)); t += d
dur = t + 3.2
json.dump({'duration': round(dur, 3), 'lines': out}, open('timeline_n.json', 'w'), ensure_ascii=False, indent=1)
print('duration', round(dur, 1), 'lines', len(out))
