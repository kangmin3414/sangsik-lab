"""Placeholder timeline (durations from character counts) so scenes can be built before the voice exists. -> timeline_fake.json"""
import json, re
from script import S
R = 510.9 / 2872; t = 0.8; L = []
for i, (sc, a, sub, sp) in enumerate(S):
    segs = a.get('segs') or [('N', sub)]; tt = t; st = []
    for s in segs:
        d = max(0.8, len(s[1]) * R); st.append({'v': s[0], 'text': s[1], 't0': round(tt, 3), 't1': round(tt + d, 3)}); tt += d + 0.3
    d = tt - 0.3 - t
    L.append({'i': i, 'scene': sc, 'args': a, 'sub': sub, 't0': round(t, 3), 't1': round(t + d, 3), 'segs': st}); t += d + 0.7 + a.get('pause', 0)
t += 2
json.dump({'duration': round(t, 3), 'lines': L, 'env': [0.5 if (k // 5) % 2 else 0.1 for k in range(int(t * 24) + 2)]}, open('timeline_fake.json', 'w'), ensure_ascii=False)
print(round(t, 1))
