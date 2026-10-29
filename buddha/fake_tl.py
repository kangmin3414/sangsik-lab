# estimated timeline for drawing previews before the narration exists
import json, re
from script import S
t = 0.8; L = []
for i, (scene, args, sub, spk) in enumerate(S):
    n = len(re.sub(r"\s", "", spk or sub)); d = n / 5.4
    L.append({"i": i, "scene": scene, "args": args, "sub": sub, "t0": round(t, 3), "t1": round(t + d, 3), "take": 0}); t += d
    gap = 0.95 if scene == "chapter" or (i + 1 < len(S) and S[i + 1][0] == "chapter") else 0.45
    if i + 1 < len(S) and S[i + 1][0] != scene: gap += 0.15
    t += gap + args.get("pause", 0)
t += 2.0
json.dump({"duration": round(t, 3), "lines": L, "env": []}, open("fake_tl.json", "w"), ensure_ascii=False, indent=1)
print("est %.1fs" % t)
