# estimated timeline (with per-segment timings) for drawing previews before the narration exists
import json, re
from tts3 import segments, gap_after, S
CPS = {"N": 6.2, "So": 5.4, "L": 5.8, "Y": 5.0, "K": 5.6, "P": 4.5}
t = 0.8; L = []
for i, (scene, args, sub, spk) in enumerate(S):
    sg = segments(i); st = []; tt = t
    for j, (v, txt, sp) in enumerate(sg):
        d = len(re.sub(r"[\s,.?!…']", "", sp)) / CPS.get(v, 6.0) + 0.25
        st.append({"v": v, "text": txt, "t0": round(tt, 3), "t1": round(tt + d, 3)}); tt += d
        if j + 1 < len(sg): tt += gap_after(txt, sg[j + 1][0], v)
    L.append({"i": i, "scene": scene, "args": args, "sub": sub, "t0": round(t, 3), "t1": round(tt, 3), "segs": st}); t = tt
    gap = 0.95 if scene == "chapter" or (i + 1 < len(S) and S[i + 1][0] == "chapter") else 0.5
    if i + 1 < len(S) and S[i + 1][0] != scene: gap += 0.2
    t += gap + args.get("pause", 0)
t += 2.0
json.dump({"duration": round(t, 3), "lines": L, "env": []}, open("fake_tl.json", "w"), ensure_ascii=False, indent=1)
print("est %.1fs" % t)
