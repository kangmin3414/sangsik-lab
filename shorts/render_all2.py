import os
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(here, "frames2"); os.makedirs(out, exist_ok=True)
FPS, DUR = 30, 60
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width":1080,"height":1920})
    errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("file://" + os.path.join(here, "anim2.html"))
    for i in range(FPS*DUR):
        pg.evaluate(f"render({i/FPS})")
        pg.screenshot(path=os.path.join(out, f"f{i:05d}.jpg"), type="jpeg", quality=92)
    b.close()
print("done", len(os.listdir(out)), "errors", errs[:3])
