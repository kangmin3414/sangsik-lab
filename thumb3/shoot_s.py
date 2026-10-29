import os, sys
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__))
vs = sys.argv[1:] or ["hippo", "idea", "stress", "dementia", "bdnf"]
with sync_playwright() as p:
    b = p.chromium.launch()
    for v in vs:
        pg = b.new_page(viewport={"width": 1080, "height": 1920})
        errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto("file://" + os.path.join(here, "sthumb.html") + "#" + v); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(400)
        pg.evaluate("location.reload()"); pg.wait_for_timeout(600); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(300)
        pg.locator("#wrap").screenshot(path=os.path.join(here, f"st_{v}.png")); pg.close(); print(v, errs)
    b.close()
