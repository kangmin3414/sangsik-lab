import json, os, sys
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
TL = json.load(open('timeline_r.json')); a, b = int(sys.argv[1]), int(sys.argv[2])
with sync_playwright() as p:
    br = p.chromium.launch(args=['--disable-gpu']); pg = br.new_page(viewport={'width': 1920, 'height': 1080})
    pg.goto('file://' + os.path.join(HERE, 'anim_r.html')); pg.evaluate('(tl) => { window.TL = tl; }', TL)
    for i in range(a, b):
        pg.evaluate(f'render({i / 24})'); pg.evaluate('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))'); pg.screenshot(path=f'fr/f{i:05d}.jpg', type='jpeg', quality=88)
    br.close()
print('ok')
