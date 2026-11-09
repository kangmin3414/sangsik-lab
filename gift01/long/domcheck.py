import json, os, sys, re
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
TL = json.load(open('timeline_gf.json'))
with sync_playwright() as p:
    br = p.chromium.launch(args=['--disable-gpu']); pg = br.new_page(viewport={'width': 1920, 'height': 1080})
    pg.goto('file://' + os.path.join(HERE, 'anim_gf.html')); pg.evaluate('(tl) => { window.TL = tl; }', TL); pg.evaluate('window.AI_READY')
    for tt in [float(x) for x in sys.argv[1:]]:
        pg.evaluate(f'render({tt})'); html = pg.evaluate("document.getElementById('v').innerHTML")
        bad = re.findall(r'[^\s"]*(?:NaN|Infinity|undefined)[^\s"]*', html)
        nums = [float(x) for x in re.findall(r'-?\d+\.?\d*e\+?\d+', html)]
        print(tt, len(html), 'bad', bad[:5], 'huge', nums[:3], flush=True)
    br.close()
