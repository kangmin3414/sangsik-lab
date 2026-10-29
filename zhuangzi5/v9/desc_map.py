"""Map the description chapter timestamps to the v9 timeline (by the line whose t0-0.2 the chapter was cut from)."""
import json, re, sys
key, old_f, new_f, out = sys.argv[1:5]
OVR = dict((a.split('=')[0], int(a.split('=')[1])) for a in sys.argv[5:])   # chapter title=line id (where the premise moved)
desc = json.load(open('../replace/lf_meta4.json'))[key]['desc']
Lo = json.load(open(old_f))['lines']; Ln = {l['i']: l for l in json.load(open(new_f))['lines']}
fmt = lambda x: f"{int(x // 60):02d}:{int(x % 60):02d}"
head, rest = desc.split('📌 타임라인\n', 1); block, tail = rest.split('\n\n', 1)
rows = []; mp = []
for ln in block.splitlines():
    m = re.match(r'(\d\d):(\d\d) (.*)', ln); s = int(m[1]) * 60 + int(m[2])
    if s == 0: rows.append((0.0, m[3])); mp.append((ln[:5], '00:00', m[3], 'start')); continue
    # chapter line = the line whose (t0 - 0.2) floors to this second
    cand = [l for l in Lo if int(max(0, l['t0'] - 0.2)) == s] or [min(Lo, key=lambda l: abs(l['t0'] - 0.2 - s))]
    l = cand[0]
    if m[3] in OVR: l = {'i': OVR[m[3]]}   # may be a new (teaser) line id
    nt = max(0, Ln[l['i']]['t0'] - 0.2)
    rows.append((nt, m[3])); mp.append((ln[:5], fmt(nt), m[3], f"L{l['i']}"))
rows.sort(key=lambda r: r[0])
nb = '\n'.join(f"{fmt(t)} {txt}" for t, txt in rows)
open(out, 'w').write(head + '📌 타임라인\n' + nb + '\n\n' + tail)
for a, b, c, d in mp: print(f"{a} -> {b}  {c}  ({d})")
lens = [b[0] - a[0] for a, b in zip(rows, rows[1:])]; print('shortest chapter %.1f s' % min(lens), '(YouTube needs >= 10 s)')
