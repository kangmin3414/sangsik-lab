"""render2.py + waits for the AI illustration layer (ai11.js) to load before shooting frames."""
import sys, os, json
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__)); tl = json.load(open(os.path.join(here, "timeline.json")))
FPS = 24; N = int(tl["duration"] * FPS); a, b = int(sys.argv[1]), int(sys.argv[2]); b = min(b, N)
od = os.path.join(here, sys.argv[3] if len(sys.argv) > 3 else "frames"); os.makedirs(od, exist_ok=True)
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    pg.goto("file://" + os.path.join(here, "anim11.html")); pg.evaluate("tl => { window.TL = tl; }", tl)
    print("ai images", pg.evaluate("window.AI_READY"), flush=True)
    for i in range(a, b):
        pg.evaluate(f"render({i/FPS})"); pg.screenshot(path=os.path.join(od, f"f{i:05d}.jpg"), type="jpeg", quality=90)
    br.close()
print("done", a, b, N)
