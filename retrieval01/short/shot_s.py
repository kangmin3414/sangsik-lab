import json, os, sys
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); TL = json.load(open(os.path.join(HERE, 'timeline_s.json')))
ts = [float(x) for x in sys.argv[1:]] or [0.8, 3.5, 6.0, 9.0, 11.5, 13.5, 16.0, 19.0, 22.0, 24.5]
with sync_playwright() as p:
    b = p.chromium.launch(args=['--disable-gpu']); pg = b.new_page(viewport={'width': 1080, 'height': 1920}); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)[:200])); pg.goto('file://' + os.path.join(HERE, 'anim_s2.html'))
    pg.evaluate('(tl) => { window.TL = tl; }', TL)
    os.makedirs("chk", exist_ok=True)
    for t in ts:
        pg.evaluate(f'render({t})'); pg.screenshot(path=f'chk/s_{t:05.1f}.jpg', type='jpeg', quality=80)
    b.close(); print('errors', errs[:3])
