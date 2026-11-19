"""thumb_gy.js의 그림 3종을 1920×1080으로 찍는다 → raw/A.png B.png C.png. usage: python3 render_thumb.py [A B C]"""
import os, sys
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); os.makedirs('raw', exist_ok=True)
kinds = sys.argv[1:] or ['A', 'B', 'C']
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1920, 'height': 1080})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + os.path.abspath('../long/anim_gy.html')); pg.wait_for_timeout(800)
    pg.add_script_tag(path=os.path.abspath('thumb_gy.js'))
    for k in kinds:
        pg.evaluate("k => { document.body.style.margin = 0; document.body.innerHTML = gyThumb(k); }", k)
        pg.wait_for_timeout(500); pg.screenshot(path=f'raw/{k}.png'); print('shot', k)
    b.close(); print('errors', errs)
