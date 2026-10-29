# usage: python3 qshot.py out.jpg 14:0.5 15:0.8 ...  (2 columns, 960x540 cells)
import os, json, sys
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw
here = os.path.dirname(os.path.abspath(__file__)); tl = json.load(open(os.path.join(here, 'timeline.json')))
L = tl['lines']; out = sys.argv[1]; specs = sys.argv[2:]
errs = []; shots = []
os.makedirs(os.path.join(here, 'qa'), exist_ok=True)
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
    pg.goto("file://" + os.path.join(here, "anim013.html")); pg.evaluate("tl => { window.TL = tl; }", tl)
    pg.evaluate("window.AI_READY || 0")
    for n, sp in enumerate(specs):
        i, fr = sp.split(':'); i = int(i); fr = float(fr)
        l = L[i]; t = l['t0'] + fr * (l['t1'] - l['t0'])
        try: pg.evaluate(f"render({t})")
        except Exception as e: errs.append(f'{i}: {str(e)[:300]}')
        fn = os.path.join(here, 'qa', f'q{n:02d}.png'); pg.screenshot(path=fn); shots.append((sp, fn))
    br.close()
cols = 2 if len(shots) > 1 else 1; w, h = 960, 540
rows = (len(shots) + cols - 1) // cols
sheet = Image.new('RGB', (cols * w, rows * h), 'white'); d = ImageDraw.Draw(sheet)
for n, (sp, fn) in enumerate(shots):
    x, y = (n % cols) * w, (n // cols) * h
    sheet.paste(Image.open(fn).convert('RGB').resize((w, h)), (x, y)); d.rectangle([x, y, x + 90, y + 24], fill='black'); d.text((x + 4, y + 4), sp, fill='yellow')
sheet.save(out, quality=82)
print('errors', errs[:10])
