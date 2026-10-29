import os, json, math
from playwright.sync_api import sync_playwright
EP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
tl = json.load(open(os.path.join(EP, "timeline.json"))); L = tl["lines"]; N = 13843
LINES = [0, 8, 13, 18, 19, 20, 24, 33, 34, 36, 40, 49, 51, 55, 56, 60]
R = [(0 if i == 0 else math.floor((L[i]["t0"] - 0.3) * 24), min(N - 1, math.ceil((max(L[i]["t1"] + 0.3, (L[i + 1]["t0"] - 0.15) if i + 1 < len(L) else 0)) * 24) + 1)) for i in LINES]
for i in (21, 57): R.append((math.floor((L[i]["t0"] - 0.3) * 24), math.ceil((L[i]["t0"] + 0.6) * 24)))
F = sorted(set(f for a, b in R for f in range(a, b + 1)))
od = os.path.join(EP, "frames_fix"); os.makedirs(od, exist_ok=True)
json.dump({"lines": LINES, "ranges": R, "n": len(F)}, open(os.path.join(EP, "qa_fix", "ranges.json"), "w"))
print("frames", len(F), flush=True)
errs = []
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("file://" + os.path.join(EP, "anim9c.html")); pg.evaluate("tl => { window.TL = tl; }", tl)
    print("ai", pg.evaluate("window.AI_READY"), flush=True)
    for k, f in enumerate(F):
        out = os.path.join(od, f"f{f:05d}.jpg")
        if os.path.exists(out): continue
        pg.evaluate(f"render({f/24})"); pg.screenshot(path=out + ".tmp.jpg", type="jpeg", quality=92); os.replace(out + ".tmp.jpg", out)
        if k % 200 == 0: print(k, f, flush=True)
    br.close()
print("ERRORS", errs); print("DONE", len(F))
