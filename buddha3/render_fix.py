"""v6: re-render only the frames of the fixed lines into frames_fix/f%05d.jpg (global frame index, q92)."""
import sys, os, json, math, time
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__)); tl = json.load(open(os.path.join(here, "timeline.json"))); L = tl["lines"]
FPS = 24; N = int(tl["duration"] * FPS)
LINES = [int(x) for x in sys.argv[1].split(',')]
fr = set()
for i in LINES:
    a = max(0, math.floor((L[i]['t0'] - 0.3) * FPS)); b = min(N - 1, math.ceil((L[i]['t1'] + 0.3) * FPS))
    fr.update(range(a, b + 1))
fr = sorted(fr)
od = os.path.join(here, "frames_fix"); os.makedirs(od, exist_ok=True)
print("frames", len(fr), fr[0], fr[-1], flush=True)
errs = []
t0 = time.time()
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto("file://" + os.path.join(here, "anim10.html")); pg.evaluate("tl => { window.TL = tl; }", tl)
    print("ai images", pg.evaluate("window.AI_READY"), flush=True)
    for n, f in enumerate(fr):
        out = os.path.join(od, f"f{f:05d}.jpg")
        if os.path.exists(out): continue
        pg.evaluate(f"render({f / FPS})"); pg.screenshot(path=out + ".tmp.jpg", type="jpeg", quality=92); os.replace(out + ".tmp.jpg", out)
        if n % 200 == 0: print(n, f, f"{time.time() - t0:.0f}s", flush=True)
    br.close()
print("done", len(fr), "errors", errs, flush=True)
