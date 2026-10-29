"""Preview frames of the AI lines (before the full render): python3 prev_ai.py out.jpg idx,idx,... [frac ...]"""
import sys, os, json
from PIL import Image
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__)); tl = json.load(open(os.path.join(here, "timeline.json")))
L = tl["lines"]
IDX = [int(x) for x in sys.argv[2].split(',')]
fr = [float(x) for x in sys.argv[3:]] or [0.85]
shots = [(i, L[i]["t0"] + f * (L[i]["t1"] - L[i]["t0"])) for i in IDX for f in fr]
os.makedirs(os.path.join(here, "prev_ai"), exist_ok=True)
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto("file://" + os.path.join(here, "anim10.html")); pg.evaluate("tl => { window.TL = tl; }", tl)
    print("ai images", pg.evaluate("window.AI_READY"))
    ims = []
    for k, (i, t) in enumerate(shots):
        fp = os.path.join(here, "prev_ai", f"p{k:02d}_{i:02d}.jpg")
        pg.evaluate(f"render({t})"); pg.screenshot(path=fp, type="jpeg", quality=88); ims.append(fp)
    br.close(); print('errors', errs[:3])
cols = 4; rows = (len(ims) + cols - 1) // cols
S = Image.new("RGB", (cols * 490, rows * 280), "white")
for k, fp in enumerate(ims): S.paste(Image.open(fp).resize((480, 270)), ((k % cols) * 490, (k // cols) * 280))
S.save(os.path.join(here, sys.argv[1]), quality=85)
print(len(ims), "frames")
