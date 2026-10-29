import json, glob, numpy as np
from PIL import Image
tl = json.load(open("timeline.json")); L = tl["lines"]; FPS = 24
fs = sorted(glob.glob("frames/f*.jpg"))
small = []
for f in fs:
    im = Image.open(f).convert("L").resize((96, 54)); small.append(np.asarray(im, dtype=np.float32))
S = np.stack(small)
d = np.abs(np.diff(S, axis=0)).mean(axis=(1, 2))
cuts = set()
for l in L:
    c = int(round((l["t0"] - 0.15) * FPS))
    for k in range(c - 3, c + 6): cuts.add(k)
med = np.median(d)
print("frames", len(fs), "median diff", round(float(med), 2))
# spikes away from scene cuts
sp = [(i, float(d[i])) for i in range(len(d)) if d[i] > max(6 * med, 4) and i not in cuts]
print("spikes away from cuts:", len(sp))
for i, v in sp[:40]: print("  frame", i, "t=%.2f" % (i / FPS), "diff", round(v, 1))
# one-frame glitches: frame differs from both neighbours but neighbours are similar
g = []
for i in range(1, len(S) - 1):
    a = np.abs(S[i] - S[i - 1]).mean(); b = np.abs(S[i] - S[i + 1]).mean(); c = np.abs(S[i - 1] - S[i + 1]).mean()
    if a > 5 and b > 5 and c < 0.5 * min(a, b): g.append((i, round(float(a), 1), round(float(c), 1)))
print("one-frame glitches:", len(g))
for x in g[:30]: print("  frame", x[0], "t=%.2f" % (x[0] / FPS), x[1:])
# near-blank frames
m = S.mean(axis=(1, 2)); sd = S.std(axis=(1, 2))
bl = [i for i in range(len(S)) if sd[i] < 4]
print("near-uniform frames:", len(bl), bl[:10], bl[-10:])
