"""기게스의 반지 편 자막(.srt): timeline의 각 줄을 26자 안팎으로 끊고, 글자 수 비율로 시간을 나눈다. 말 없는 줄은 건너뛴다."""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
TL = json.load(open('long/timeline_g1.json'))
def chunks(s, n=26):
    if len(s) <= n: return [s]
    parts = re.split(r'(?<=[.?!,…])\s+', s); out, cur = [], ''
    for p in parts:
        if cur and len(cur) + 1 + len(p) > n: out.append(cur); cur = p
        else: cur = (cur + ' ' + p).strip()
    if cur: out.append(cur)
    res = []
    for c in out:
        while len(c) > n + 8:
            k = c.rfind(' ', 0, n + 2); k = k if k > 6 else n; res.append(c[:k].strip()); c = c[k:].strip()
        res.append(c)
    return res
ts = lambda x: f"{int(x // 3600):02d}:{int(x % 3600 // 60):02d}:{int(x % 60):02d},{int(round((x % 1) * 1000)) % 1000:03d}"
out, n = [], 0
for L in TL['lines']:
    if not L.get('sub'): continue
    cs = chunks(L['sub']); tot = sum(len(c) for c in cs); t = L['t0']
    for c in cs:
        d = (L['t1'] - L['t0']) * len(c) / tot; n += 1; out.append(f"{n}\n{ts(t)} --> {ts(t + d)}\n{c}\n"); t += d
open('기게스의반지_자막.srt', 'w', encoding='utf-8').write('\n'.join(out)); print(n, 'cues')
