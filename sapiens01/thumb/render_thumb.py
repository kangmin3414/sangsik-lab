"""thumb_sp.js의 그림 3종을 1920×1080으로 찍는다 → raw/A.png B.png C.png. usage: python3 render_thumb.py [A B C] [--bg ai/street_1.jpg]"""
import os, sys
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); os.makedirs('raw', exist_ok=True)
args = [a for a in sys.argv[1:] if not a.startswith('--')]; kinds = args or ['A', 'B', 'C']
bg = '../thumb/' + (sys.argv[sys.argv.index('--bg') + 1] if '--bg' in sys.argv else 'ai/street_1.jpg')
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1920, 'height': 1080})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + os.path.abspath('../long/anim_sp.html')); pg.evaluate('window.AI_READY')
    pg.add_script_tag(path=os.path.abspath('thumb_sp.js'))
    for k in kinds:
        pg.evaluate("([k, bg]) => { document.body.style.margin = 0; document.body.innerHTML = (k.length > 1 ? spThumb2 : spThumb)(k, bg); }", [k, bg])
        pg.wait_for_timeout(600); pg.screenshot(path=f'raw/{k}.png'); print('shot', k)
    b.close(); print('errors', errs)
