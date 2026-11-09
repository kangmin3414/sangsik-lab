import json, os, sys, time
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
TL = json.load(open('timeline_gf.json'))
with sync_playwright() as p:
    br = p.chromium.launch(args=['--disable-gpu']); pg = br.new_page(viewport={'width': 1920, 'height': 1080})
    pg.goto('file://' + os.path.join(HERE, 'anim_gf.html')); pg.evaluate('(tl) => { window.TL = tl; }', TL); pg.evaluate('window.AI_READY')
    for tt in [float(x) for x in sys.argv[1:]]:
        t0 = time.time(); pg.evaluate(f'render({tt})'); t1 = time.time(); pg.screenshot(path='/tmp/claude-0/-home-claude/8ea42618-92c7-5880-934a-1a398f438784/scratchpad/tm.jpg', type='jpeg', quality=88); t2 = time.time()
        print(tt, 'render', round(t1 - t0, 2), 'paint+shot', round(t2 - t1, 2), flush=True)
    br.close()
