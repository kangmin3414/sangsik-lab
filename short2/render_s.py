import sys, os, json
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__))
tl = json.load(open(os.path.join(here, "../walk/timeline.json")))
cfg = {c["name"]: c for c in json.load(open(os.path.join(here, "shorts.json")))}[sys.argv[1]]
SEG = [{"t0": a, "d": d} for a, d in cfg["seg"]] + [{"t0": 248.4, "d": 5.44, "outro": True}]
FPS = 24; N = int(sum(s["d"] for s in SEG) * FPS)
mode = sys.argv[2]
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1080, "height": 1920})
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("file://" + os.path.join(here, "anim3v.html"))
    pg.evaluate("([tl, seg]) => { window.TL = tl; window.SEG = seg; }", [tl, SEG])
    pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(500)
    pg.evaluate("([a,b]) => setTitle(a,b)", cfg["title"])
    od = os.path.join(here, "fr_" + cfg["name"]); os.makedirs(od, exist_ok=True)
    if mode == "prev":
        tot = N / FPS
        for k, tau in enumerate([1.0, tot * 0.35, tot * 0.7, tot - 2.0]):
            pg.evaluate(f"renderV({tau})"); pg.screenshot(path=os.path.join(here, "prev", f"{cfg['name']}_{k}.jpg"), type="jpeg", quality=85)
    else:
        a, b = int(sys.argv[3]), min(int(sys.argv[4]), N)
        for i in range(a, b):
            pg.evaluate(f"renderV({i / FPS})"); pg.screenshot(path=os.path.join(od, f"f{i:05d}.jpg"), type="jpeg", quality=90)
    br.close()
print(cfg["name"], "frames", N, "errors", errs[:3])
