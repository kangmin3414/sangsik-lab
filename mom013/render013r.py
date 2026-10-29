"""Resumable frame renderer: renders only missing frames in [a, b), relaunching the browser every 1200 frames or after a crash."""
import sys, os, json
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__)); tl = json.load(open(os.path.join(here, "timeline.json")))
FPS = 24; N = int(tl["duration"] * FPS); a, b = int(sys.argv[1]), min(int(sys.argv[2]), N + 1)
od = os.path.join(here, "frames"); os.makedirs(od, exist_ok=True)
todo = [i for i in range(a, b) if not os.path.exists(os.path.join(od, f"f{i:05d}.jpg"))]
print("todo", len(todo), flush=True)
k = 0
with sync_playwright() as p:
    while k < len(todo):
        br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
        pg.goto("file://" + os.path.join(here, "anim013.html")); pg.evaluate("tl => { window.TL = tl; }", tl)
        pg.evaluate("window.AI_READY"); pg.evaluate("render(TL.duration - 3)"); pg.wait_for_timeout(1500)
        n = 0
        try:
            while k < len(todo) and n < 1200:
                i = todo[k]; fn = os.path.join(od, f"f{i:05d}.jpg")
                pg.evaluate(f"render({i/FPS})"); pg.screenshot(path=fn + '.tmp', type="jpeg", quality=90); os.replace(fn + '.tmp', fn)
                k += 1; n += 1
        except Exception as e:
            print("crash at", todo[k], str(e)[:120], flush=True)
        try: br.close()
        except Exception: pass
        print("progress", k, "/", len(todo), flush=True)
print("done", a, b)
