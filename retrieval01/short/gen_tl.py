"""timeline from takes: line start/end, plus trimmed audio paths -> timeline_s.json"""
import json, os, numpy as np, soundfile as sf
takes = json.load(open('takes.json')); order = ['l1','l2','l3','l4','l5','l6','l7','l8']
SR = 24000; t = 0.12; lines = []
GAPS = {'l1': 0.45, 'l2': 0.3, 'l3': 0.35, 'l4': 0.2, 'l5': 0.55, 'l6': 0.5, 'l7': 0.4, 'l8': 0.0}
for k in order:
    w, sr = sf.read(takes[k]['take'], dtype='float32'); w = w.mean(1) if w.ndim > 1 else w
    a = np.abs(w); idx = np.where(a > a.max() * 0.02)[0]; a0 = max(0, idx[0] - int(0.03 * sr)); a1 = min(len(w), idx[-1] + int(0.08 * sr))
    d = (a1 - a0) / sr; lines.append({'id': k, 'text': takes[k]['text'], 't0': round(t, 3), 't1': round(t + d, 3), 'a0': a0 / sr, 'a1': a1 / sr, 'take': takes[k]['take']})
    t += d + GAPS[k]
end = lines[-1]['t1'] + 1.6
json.dump({'lines': lines, 'end': round(end, 3)}, open('timeline_s.json', 'w'), ensure_ascii=False, indent=1)
print('end', end)
