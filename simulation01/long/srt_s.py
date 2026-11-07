"""timeline_s.json → 자막 srt (화면 자막과 같은 줄 나눔)."""
import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
T = json.load(open('timeline_s.json'))
def ts(x): h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60; return f'{h:02d}:{m:02d}:{int(s):02d},{int(round((s - int(s)) * 1000)) % 1000:03d}'
def split(t):
    if len(t) <= 22: return t
    m = len(t) // 2; sp = t.find(' ', m)
    if sp < 0 or sp - m > 8: sp = t.rfind(' ', 0, m)
    return t[:sp] + '\n' + t[sp + 1:] if sp > 0 else t
out = []; n = 0; L = [l for l in T['lines'] if l['sub']]
for i, l in enumerate(L):
    end = min(l['t1'] + 0.25, L[i + 1]['t0'] - 0.05) if i + 1 < len(L) else l['t1'] + 0.6
    n += 1; out.append(f"{n}\n{ts(l['t0'])} --> {ts(end)}\n{split(l['sub'])}\n")
open('../우주가시뮬레이션이라면_자막_v1.srt', 'w', encoding='utf-8').write('\n'.join(out))
print(n, 'cues')
