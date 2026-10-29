import sys, os, json
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__))
tl = json.load(open(os.path.join(here, "../walk/timeline.json")))
SEG = [{"t0": 10.23, "d": 19.62}, {"t0": 171.02, "d": 31.58}, {"t0": 248.4, "d": 5.44, "outro": True}]
FPS = 24; N = int(sum(s["d"] for s in SEG) * FPS)
mode = sys.argv[1]
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1080, "height": 1920})
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("file://" + os.path.join(here, "anim3v.html"))
    pg.evaluate("([tl, seg]) => { window.TL = tl; window.SEG = seg; }", [tl, SEG])
    pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(500)
    if mode == "prev":
        os.makedirs(os.path.join(here, "prev"), exist_ok=True)
        for tau in [1.0, 6.0, 15.0, 22.0, 30.0, 40.0, 49.0, 54.0]:
            pg.evaluate(f"renderV({tau})"); pg.wait_for_timeout(50)
            pg.screenshot(path=os.path.join(here, "prev", f"v{tau:05.1f}.jpg"), type="jpeg", quality=85)
    else:
        a, b = int(sys.argv[2]), min(int(sys.argv[3]), N)
        od = os.path.join(here, "frames"); os.makedirs(od, exist_ok=True)
        for i in range(a, b):
            pg.evaluate(f"renderV({i / FPS})"); pg.screenshot(path=os.path.join(od, f"f{i:05d}.jpg"), type="jpeg", quality=90)
    br.close()
print("frames", N, "errors", errs[:3])
