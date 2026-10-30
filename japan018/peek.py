"""QA contact sheet: for each line (or the given line indices) shoot the frame at 65% of the line; JS errors are printed.
python3 peek.py timeline_fake.json out.jpg [i,j,...]"""
import sys, os, json, io
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
here = os.path.dirname(os.path.abspath(__file__)); tl = json.load(open(os.path.join(here, sys.argv[1])))
idx = [int(x) for x in sys.argv[3].split(',')] if len(sys.argv) > 3 else list(range(len(tl['lines'])))
fr = float(os.environ.get('AT', '0.65'))
shots = []
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: m.type == 'error' and errs.append(m.text))
    pg.goto("file://" + os.path.join(here, "anim018.html")); pg.evaluate("tl => { window.TL = tl; }", tl); pg.evaluate("window.AI_READY || 0")
    for i in idx:
        l = tl['lines'][i]; t = l['t0'] + fr * (l['t1'] - l['t0'])
        try: pg.evaluate(f"render({t})")
        except Exception as e: print('ERR line', i, l['scene'], str(e)[:300]); continue
        shots.append((i, l['scene'], Image.open(io.BytesIO(pg.screenshot(type='jpeg', quality=80))).resize((640, 360))))
    br.close()
for e in errs[:10]: print('JS', e[:300])
cols = 4; rows = (len(shots) + cols - 1) // cols
sheet = Image.new('RGB', (cols * 640, rows * 380), 'white'); d = ImageDraw.Draw(sheet)
f = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 16)
for n, (i, sc, im) in enumerate(shots):
    x, y = (n % cols) * 640, (n // cols) * 380; sheet.paste(im, (x, y + 20)); d.text((x + 6, y + 1), f'{i} {sc}', fill='black', font=f)
sheet.save(os.path.join(here, sys.argv[2]), quality=85); print('sheet', len(shots))
