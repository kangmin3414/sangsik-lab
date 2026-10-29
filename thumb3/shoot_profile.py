import os
from playwright.sync_api import sync_playwright
from PIL import Image
here = os.path.dirname(os.path.abspath(__file__))
with sync_playwright() as p:
    b = p.chromium.launch()
    for name, h in [("profile", ""), ("profile_circle", "circle")]:
        pg = b.new_page(viewport={"width": 800, "height": 800}, device_scale_factor=2)
        errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto("file://" + os.path.join(here, "profile.html") + "#" + h); pg.wait_for_timeout(300)
        out2x = os.path.join(here, f"{name}@2x.png"); pg.locator("#wrap").screenshot(path=out2x)
        Image.open(out2x).convert("RGB").resize((800, 800), Image.LANCZOS).save(os.path.join(here, f"{name}.png"))
        pg.close(); print(name, errs)
    b.close()
