import json, os, numpy as np, soundfile as sf
from lines_r import LINES
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
takes = json.load(open('takes.json')) if os.path.exists('takes.json') else {}
t = 0.6; out = []; prev_scene = None
for lid, scene, txt, sp, args in LINES:
    if txt is None:  # silent chapter card
        d = args.get('dur', 2.4); out.append({'id': lid, 'scene': scene, 'args': args, 'sub': '', 't0': round(t, 3), 't1': round(t + d, 3)}); t += d + 0.1; prev_scene = scene; continue
    if lid in takes:
        w, sr = sf.read(takes[lid]['take'], dtype='float32'); w = w.mean(1) if w.ndim > 1 else w
        a = np.abs(w); idx = np.where(a > a.max() * 0.02)[0]; a0 = max(0, idx[0] - int(0.03 * sr)); a1 = min(len(w), idx[-1] + int(0.08 * sr)); d = (a1 - a0) / sr
        rec = {'a0': a0 / sr, 'a1': a1 / sr, 'take': takes[lid]['take']}
    else:
        d = len(txt) * 0.155; rec = {}
    out.append(dict({'id': lid, 'scene': scene, 'args': args, 'sub': txt, 't0': round(t, 3), 't1': round(t + d, 3)}, **rec))
    t += d + (0.28 if scene == prev_scene else 0.5); prev_scene = scene
out.append({'id': 'end', 'scene': 'rend', 'args': {}, 'sub': '', 't0': round(t, 3), 't1': round(t + 3.4, 3)})
dur = t + 3.4 + 0.6
json.dump({'duration': round(dur, 3), 'lines': out}, open('timeline_r.json', 'w'), ensure_ascii=False, indent=1)
print('duration', round(dur, 1), 'min', round(dur / 60, 2), 'lines', len(out))
