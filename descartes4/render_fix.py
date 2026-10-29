"""Re-render only the frames of the fixed lines into frames_fix/ (global frame index, jpeg q92)."""
import sys, os, json, math, time
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__)); tl = json.load(open(os.path.join(here, "timeline.json")))
FPS = 24; N = 11122  # frame count of the v7 mp4
LINES = [int(x) for x in sys.argv[1].split(',')]
fr = set()
for i in LINES:
    l = tl['lines'][i]; a = max(0, math.floor((l['t0'] - 0.3) * FPS)); b = min(N - 1, math.ceil((l['t1'] + 0.3) * FPS))
    fr.update(range(a, b + 1)); print('line', i, a, b, flush=True)
fr = sorted(fr); od = os.path.join(here, 'frames_fix'); os.makedirs(od, exist_ok=True)
errs = []; t0 = time.time()
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto("file://" + os.path.join(here, "anim8b.html")); pg.evaluate("tl => { window.TL = tl; }", tl)
    print("ai images", pg.evaluate("window.AI_READY"), flush=True)
    for k, f in enumerate(fr):
        out = os.path.join(od, f"f{f:05d}.jpg")
        if os.path.exists(out): continue
        pg.evaluate(f"render({f/FPS})"); pg.screenshot(path=out, type="jpeg", quality=92)
        if k % 200 == 0: print(k, len(fr), round(time.time() - t0), flush=True)
    br.close()
print("DONE", len(fr), "errors:", errs[:5], flush=True)
