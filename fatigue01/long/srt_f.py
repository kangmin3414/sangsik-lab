"""피로사회 편 자막. usage: python3 srt_f.py → ../피로사회편_자막.srt"""
import json, os, re
os.chdir(os.path.dirname(os.path.abspath(__file__)))
L = json.load(open('timeline_f.json'))['lines']; MAX = 26
def split_long(p):  # 긴 구절을 비슷한 길이로 나눔
    k = -(-len(p) // MAX); tgt = len(p) / k; out, cur = [], ''
    for w in p.split(' '):
        if cur and len(cur) >= tgt * 0.85 and len(out) < k - 1: out.append(cur); cur = w
        else: cur = (cur + ' ' + w).strip()
    return out + ([cur] if cur else [])
def chunks(s):
    out, cur = [], ''
    for p in re.split(r'(?<=[,.?!])\s+', s.strip()):
        if len((cur + ' ' + p).strip()) <= MAX: cur = (cur + ' ' + p).strip(); continue
        if cur: out.append(cur)
        if len(p) > MAX: *head, cur = split_long(p); out += head
        else: cur = p
    out += [cur] if cur else []
    m = []
    for c in out:  # 너무 짧은 꼬리는 앞 줄에 붙임
        if m and len(c) < 7 and len(m[-1]) + len(c) < 32: m[-1] += ' ' + c
        else: m.append(c)
    return m
def ts(x):
    ms = int(round(x * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f'{h:02d}:{m:02d}:{s:02d},{ms:03d}'
n, out = 1, []
for i, l in enumerate(L):
    nxt = next((x['t0'] for x in L[i + 1:] if (x.get('sub') or '').strip()), 1e9)
    sub = (l.get('sub') or '').strip()
    if not sub: continue
    ch = chunks(sub); tot = sum(len(c) for c in ch); acc = l['t0']
    for k, c in enumerate(ch):
        e = acc + (l['t1'] - l['t0']) * len(c) / tot
        end = e if k + 1 < len(ch) else min(l['t1'] + 0.2, nxt - 0.05)
        out.append(f'{n}\n{ts(acc)} --> {ts(end)}\n{c}\n'); n += 1; acc = e
open('../피로사회편_자막.srt', 'w').write('\n'.join(out))
print(n - 1, 'cues, longest', max(len(x.split('\n')[2]) for x in out))
