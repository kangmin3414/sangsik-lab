import sys, os, json
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); os.makedirs('chk', exist_ok=True)
TL = json.load(open('timeline_ad.json')); ts = [float(x) for x in sys.argv[1:]]
with sync_playwright() as p:
    br = p.chromium.launch(args=['--disable-gpu']); pg = br.new_page(viewport={'width': 1920, 'height': 1080})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + os.path.join(HERE, 'anim_ad.html')); pg.evaluate('(tl) => { window.TL = tl; }', TL); pg.evaluate('window.AI_READY')
    if not ts:
        for L in TL['lines']: ts += [L['t0'] + (L['t1'] - L['t0']) * f for f in (0.2, 0.75)]
    for tt in ts:
        pg.evaluate(f'render({tt})'); pg.evaluate('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))'); pg.screenshot(path=f"chk/t{tt:07.2f}.jpg", type='jpeg', quality=70)
    br.close(); print('errors', errs[:5])
