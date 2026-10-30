"""Zoomed QA: python3 peekz.py timeline.json out.jpg i[:frac],j[:frac],...  (960x540 frames, 2 per row)"""
import sys, os, json, io
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
here = os.path.dirname(os.path.abspath(__file__)); tl = json.load(open(os.path.join(here, sys.argv[1])))
specs = []
for s in sys.argv[3].split(','):
    i, _, f = s.partition(':'); specs.append((int(i), float(f or 0.5)))
shots = []
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("file://" + os.path.join(here, "anim018.html")); pg.evaluate("tl => { window.TL = tl; }", tl); pg.evaluate("window.AI_READY || 0")
    for i, fr in specs:
        l = tl['lines'][i]; t = l['t0'] + fr * (l['t1'] - l['t0']); pg.evaluate(f"render({t})")
        shots.append((f"{i}@{fr} {l['scene']}", Image.open(io.BytesIO(pg.screenshot(type='jpeg', quality=80))).resize((960, 540))))
    br.close()
for e in errs[:10]: print('JS', e[:300])
C = int(os.environ.get('COLS', '2')); W = 1920 // C; H = W * 9 // 16
rows = (len(shots) + C - 1) // C; sheet = Image.new('RGB', (1920, rows * (H + 26)), 'white'); d = ImageDraw.Draw(sheet)
f = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 20)
for n, (lab, im) in enumerate(shots):
    x, y = (n % C) * W, (n // C) * (H + 26); sheet.paste(im.resize((W, H)), (x, y + 26)); d.text((x + 6, y + 1), lab, fill='black', font=f)
sheet.save(os.path.join(here, sys.argv[2]), quality=85); print('ok', len(shots))
