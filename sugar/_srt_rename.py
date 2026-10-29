import json, re
tl = json.load(open("timeline.json")); L = tl["lines"]
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
    h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60
    return f"{h:02d}:{m:02d}:{int(s):02d},{int(round((s - int(s)) * 1000)) % 1000:03d}"
n = 1; out = []
for l in L:
    ch = chunks(l["sub"]); tot = sum(len(c) for c in ch); acc = l["t0"]
    for c in ch:
        d = (l["t1"] - l["t0"]) * len(c) / tot
        out.append(f"{n}\n{ts(acc)} --> {ts(acc + d)}\n{c}\n"); n += 1; acc += d
open("상식실험실_실험004_자막_v4.srt", "w").write("\n".join(out))
print(n - 1, "cues")
for l in L:
    if l["scene"] in ("chapter", "recap", "meta", "title", "hook") or l["i"] in (1,):
        m = int((l["t0"] - 0.2) // 60); s = int(max(0, l["t0"] - 0.2) % 60); print(f"{m:02d}:{s:02d}", l["i"], l["scene"], l["sub"][:30])
