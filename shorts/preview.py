import sys, os
from playwright.sync_api import sync_playwright

here = os.path.dirname(os.path.abspath(__file__))
times = [float(x) for x in sys.argv[1].split(",")]
outdir = os.path.join(here, "prev")
os.makedirs(outdir, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1080, "height": 1920})
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("file://" + os.path.join(here, os.environ.get("ANIM","anim.html")))
    for t in times:
        pg.evaluate(f"render({t})")
        pg.screenshot(path=os.path.join(outdir, f"p_{t:06.2f}.png"))
    b.close()
    print("errors:", errs)
