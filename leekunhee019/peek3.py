"""Audit sheet: one row per line, frames at 10% / 50% / 92% of the line, with the line text. python3 peek3.py timeline.json out.jpg a b"""
import sys, os, json, io
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
here = os.path.dirname(os.path.abspath(__file__)); tl = json.load(open(os.path.join(here, sys.argv[1])))
a, b = int(sys.argv[3]), int(sys.argv[4]); FR = [0.1, 0.5, 0.92]; W, H = 560, 315
rows = []
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("file://" + os.path.join(here, "anim019.html")); pg.evaluate("tl => { window.TL = tl; }", tl); pg.evaluate("window.AI_READY || 0")
    for i in range(a, b):
        l = tl['lines'][i]; ims = []
        for f in FR:
            pg.evaluate(f"render({l['t0'] + f * (l['t1'] - l['t0'])})")
            ims.append(Image.open(io.BytesIO(pg.screenshot(type='jpeg', quality=75))).resize((W, H)))
        rows.append((i, l, ims))
    br.close()
for e in errs[:5]: print('JS', e[:200])
font = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 18)
sheet = Image.new('RGB', (W * 3, len(rows) * (H + 30)), 'white'); d = ImageDraw.Draw(sheet)
for r, (i, l, ims) in enumerate(rows):
    y = r * (H + 30); d.text((6, y + 4), f"{i} {l['scene']} k{l['args'].get('k', 0)} | {l['sub'][:80]}", fill='black', font=font)
    for c, im in enumerate(ims): sheet.paste(im, (c * W, y + 30))
sheet.save(os.path.join(here, sys.argv[2]), quality=82); print('ok', len(rows))
