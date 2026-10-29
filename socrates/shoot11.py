import os, sys, urllib.parse
from playwright.sync_api import sync_playwright
from PIL import Image
here = os.path.dirname(os.path.abspath(__file__))
# args: name|variant|text|fontsize
jobs = [a.split('|') for a in sys.argv[1:]]
with sync_playwright() as p:
    b = p.chromium.launch()
    for name, v, text, fs in jobs:
        pg = b.new_page(viewport={"width": 1280, "height": 720}, device_scale_factor=2)
        errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto("file://" + os.path.join(here, "thumb11.html") + "#v=" + v + "&fs=" + fs + "&text=" + urllib.parse.quote(text))
        pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(500)
        out2x = os.path.join(here, f"{name}@2x.png")
        pg.locator("#wrap").screenshot(path=out2x)
        Image.open(out2x).convert("RGB").resize((1280, 720), Image.LANCZOS).save(os.path.join(here, f"{name}.png"))
        os.remove(out2x); pg.close(); print(name, errs)
    b.close()
