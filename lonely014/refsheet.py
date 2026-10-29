"""Character reference sheet for ep.014 (used for the AI story pictures and to check the new characters).
ref/chars.png = [Zero, Seojun, Schopenhauer, poodle, hedgehog]; ref/chars_crop.png = the same, cropped to the figures."""
import os
from playwright.sync_api import sync_playwright
from PIL import Image
here = os.path.dirname(os.path.abspath(__file__)); errs = []
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
    pg.goto("file://" + os.path.join(here, "anim014.html"))
    pg.evaluate("""() => { const ex = exprAt([[0, '기본']], 0); document.getElementById('v').innerHTML = defs(0) + BG('#F4EFE6') +
      Z({ t: 0, seed: 1, x: 230, y: 900, s: 0.92, pose: '서기', ex, still: true }) +
      SJ({ t: 0, seed: 2, x: 620, y: 900, s: 0.92, pose: '서기', ex, still: true }) +
      SCH({ t: 0, seed: 3, x: 1010, y: 900, s: 0.92, pose: '서기', ex, still: true }) +
      poodle14(1420, 900, 1.25, 0, { still: true }) +
      hog14(1740, 900, 1.05, 0, {}); }""")
    pg.screenshot(path=os.path.join(here, 'ref', 'chars.png'))
    br.close()
im = Image.open(os.path.join(here, 'ref', 'chars.png')).convert('RGB')
im.crop((0, 260, 1920, 960)).save(os.path.join(here, 'ref', 'chars_crop.png'))
print('errors', errs)
