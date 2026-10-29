"""Re-render only the frames of the lines touched by the v6 fixes into frames_fix/f%05d.jpg (global index, q92)."""
import os, json, math, sys, time
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__)); tl = json.load(open(os.path.join(here, "timeline.json")))
FPS = 24; N = int(tl["duration"] * FPS); L = tl["lines"]
LINES = [0, 1, 2, 4, 7, 12, 25, 30, 31, 34, 37, 43, 51, 52, 53, 54, 55, 58, 59, 60]
fr = set()
for i in LINES:
    a = max(0, math.floor((L[i]["t0"] - 0.3) * FPS)); b = min(N - 1, math.ceil((L[i]["t1"] + 0.3) * FPS))
    fr.update(range(a, b + 1))
fr = sorted(fr)
# merged ranges for the report
rg = []; 
for f in fr:
    if rg and f == rg[-1][1] + 1: rg[-1][1] = f
    else: rg.append([f, f])
json.dump({"lines": LINES, "ranges": rg, "n": len(fr)}, open(os.path.join(here, "frames_fix_ranges.json"), "w"))
od = os.path.join(here, "frames_fix"); os.makedirs(od, exist_ok=True)
todo = [f for f in fr if not os.path.exists(os.path.join(od, f"f{f:05d}.jpg"))]
print("frames", len(fr), "todo", len(todo), "ranges", rg, flush=True)
t0 = time.time()
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto("file://" + os.path.join(here, "anim11.html")); pg.evaluate("tl => { window.TL = tl; }", tl)
    print("ai images", pg.evaluate("window.AI_READY"), flush=True)
    for k, f in enumerate(todo):
        pg.evaluate(f"render({f / FPS})"); pg.screenshot(path=os.path.join(od, f"f{f:05d}.jpg"), type="jpeg", quality=92)
        if k % 200 == 0: print(k, f, round(time.time() - t0), "s", flush=True)
    br.close()
print("done", len(todo), "errors", errs[:5], round(time.time() - t0), "s", flush=True)
