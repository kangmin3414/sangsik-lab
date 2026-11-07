import sys, os, json
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); os.makedirs('chk', exist_ok=True)
TL = json.load(open('timeline_r.json')); ids = sys.argv[1:]
with sync_playwright() as p:
    br = p.chromium.launch(args=['--disable-gpu']); pg = br.new_page(viewport={'width': 1920, 'height': 1080})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + os.path.join(HERE, 'anim_r.html')); pg.evaluate('(tl) => { window.TL = tl; }', TL)
    for L in TL['lines']:
        if ids and L['id'] not in ids: continue
        for k, fr in enumerate([0.3, 0.85]):
            tt = L['t0'] + (L['t1'] - L['t0']) * fr
            pg.evaluate(f'render({tt})'); pg.screenshot(path=f"chk/{L['id']}_{k}.jpg", type='jpeg', quality=70)
    br.close(); print('errors', errs[:5])
