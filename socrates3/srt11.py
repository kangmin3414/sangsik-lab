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
    cues = []
    for sg in (l.get("segs") or [{"text": l["sub"], "t0": l["t0"], "t1": l["t1"]}]):
        ch = chunks(sg["text"]); tot = sum(len(c) for c in ch) or 1; acc = sg["t0"]
        for c in ch: cues.append([c, acc]); acc += (sg["t1"] - sg["t0"]) * len(c) / tot
    for k, (c, a) in enumerate(cues):
        e = cues[k + 1][1] if k + 1 < len(cues) else l["t1"] + 0.2
        out.append(f"{n}\n{ts(a)} --> {ts(e)}\n{c}\n"); n += 1
open("상식실험실_실험009_자막_v4.srt", "w").write("\n".join(out))
print(n - 1, "cues, duration %.1f" % tl["duration"])
prev = None
for l in L:
    if l["scene"] != prev and l["scene"] not in ("thanks",):
        m = int(max(0, l["t0"] - 0.2) // 60); s = int(max(0, l["t0"] - 0.2) % 60); print(f"{m:02d}:{s:02d}", l["i"], l["scene"], l["sub"][:30])
    prev = l["scene"]
