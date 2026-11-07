import json, re
tl = json.load(open('timeline.json'))
def chunks(s):
    parts = re.split(r'(?<=[,.?!])\s+', s); out = []; cur = ''
    for p in parts:
        if len((cur + ' ' + p).strip()) <= 34: cur = (cur + ' ' + p).strip()
        else:
            if cur: out.append(cur)
            cur = p
    if cur: out.append(cur)
    return out
def ts(x):
    ms = int(round(x * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000); return f'{h:02d}:{m:02d}:{s:02d},{ms:03d}'
cues = []
for l in tl['lines']:
    if l['args'].get('silent'): continue
    for sg in (l['segs'] or [{'text': l['sub'], 't0': l['t0'], 't1': l['t1']}]):
        ch = chunks(sg['text']); tot = sum(len(c) for c in ch) or 1; acc = sg['t0']
        for c in ch:
            d = (sg['t1'] - sg['t0']) * len(c) / tot; cues.append((acc, acc + d, c)); acc += d
out = []
for n, (a, b, c) in enumerate(cues, 1):
    nxt = cues[n][0] if n < len(cues) else b + 1
    out.append(f'{n}\n{ts(a)} --> {ts(min(b + 0.25, nxt - 0.02))}\n{c}\n')
open('S1E01_회식2차_자막_v1.srt', 'w', encoding='utf-8').write('\n'.join(out)); print(len(cues), 'cues')
