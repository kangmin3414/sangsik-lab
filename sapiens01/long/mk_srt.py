"""timeline_sp.json → .srt (업로드 패키지 규칙: 26자 안팎으로 끊고 글자 수 비율로 시간 나눔, 말 없는 줄 건너뜀).
사용: python3 mk_srt.py [출력 경로]
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, '..', '사피엔스편_자막.srt')
MAXC = 26


def chunks(text):
    """띄어쓰기 단위로, 덩이 길이가 고르게(26자 안팎) 끊는다.
    쉼표·마침표 뒤는 끊기 좋은 자리, 여는 따옴표 바로 앞·뒤에서 덩이가 끝나면 벌점."""
    if len(text) <= MAXC + 2:
        return [text]
    words = text.split()
    n = len(words)
    k = -(-len(text) // MAXC)            # 필요한 덩이 수
    target = len(text) / k

    def cost(i, j):                       # words[i:j]가 한 덩이
        s = ' '.join(words[i:j])
        c = (len(s) - target) ** 2
        if len(s) > MAXC + 3:
            c += 400 * (len(s) - MAXC - 3)
        last = words[j - 1]
        if j < n:
            if last[-1] in ',.?!':
                c -= 25
            elif last[-1] in "'\"』" :
                c -= 10
            if last.count("'") % 2 == 1 and last.startswith("'"):
                c += 200                  # 여는 따옴표로 끝나면 안 됨
        return c

    INF = float('inf')
    best = [INF] * (n + 1)
    prev = [0] * (n + 1)
    best[0] = 0
    for j in range(1, n + 1):
        for i in range(max(0, j - 12), j):
            c = best[i] + cost(i, j)
            if c < best[j]:
                best[j], prev[j] = c, i
    out, j = [], n
    while j > 0:
        i = prev[j]
        out.append(' '.join(words[i:j]))
        j = i
    return out[::-1]


def ts(t):
    ms = int(round(t * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f'{h:02d}:{m:02d}:{s:02d},{ms:03d}'


d = json.load(open(os.path.join(HERE, 'timeline_sp.json')))
cues = []
for l in d['lines']:
    sub = (l.get('sub') or '').strip()
    if not sub or not l.get('v'):
        continue
    t0, t1 = l['t0'], l['t1']
    parts = chunks(sub)
    tot = sum(len(p) for p in parts)
    t = t0
    for p in parts:
        dt = (t1 - t0) * len(p) / tot
        cues.append((t, t + dt, p))
        t += dt

with open(OUT, 'w', encoding='utf-8') as f:
    for i, (a, b, p) in enumerate(cues, 1):
        f.write(f'{i}\n{ts(a)} --> {ts(b)}\n{p}\n\n')
print(len(cues), 'cues →', OUT)
