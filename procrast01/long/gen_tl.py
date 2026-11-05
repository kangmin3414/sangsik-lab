import json, os, numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
from lines_p import LINES
takes = json.load(open('takes.json')) if os.path.exists('takes.json') else {}
# pause BEFORE each line (intro values kept from the approved sample)
GAP = {'a0': 0, 'z0': 0.15, 'n1': 0.35, 'n11': 0.6, 'n14': 0.5, 'n15': 0.5, 'n21': 0.3, 'n22': 0.5}
t = 0.4; out = []; prev = None
for lid, scene, v, txt, sp, args in LINES:
    t += GAP.get(lid, 0.22 if scene == prev else 0.4)
    if txt is None:
        d = args.get('dur', 2.4)
        out.append({'id': lid, 'scene': scene, 'v': None, 'args': args, 'sub': '', 't0': round(t, 3), 't1': round(t + d, 3)})
        t += d; prev = scene; continue
    if lid in takes:
        w, sr = sf.read(takes[lid]['take'], dtype='float32'); w = w.mean(1) if w.ndim > 1 else w
        a = np.abs(w); idx = np.where(a > a.max() * 0.02)[0]; a0 = max(0, idx[0] - int(0.03 * sr)); a1 = min(len(w), idx[-1] + int(0.08 * sr)); d = (a1 - a0) / sr
        rec = {'a0': a0 / sr, 'a1': a1 / sr, 'take': takes[lid]['take']}
    else: d = len(txt) * 0.16; rec = {}
    out.append(dict({'id': lid, 'scene': scene, 'v': v, 'args': args, 'sub': txt, 't0': round(t, 3), 't1': round(t + d, 3), 'segs': [{'v': v, 'text': txt, 't0': round(t, 3), 't1': round(t + d, 3)}]}, **rec))
    t += d; prev = scene
dur = t + 2.4
json.dump({'duration': round(dur, 3), 'lines': out}, open('timeline_p.json', 'w'), ensure_ascii=False, indent=1)
print('duration', round(dur, 1), round(dur / 60, 2), 'min, lines', len(out))
