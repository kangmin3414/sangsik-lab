import sys, os, json
from playwright.sync_api import sync_playwright
here=os.path.dirname(os.path.abspath(__file__)); tl=json.load(open(os.path.join(here,'timeline_q.json')))
ts=[float(x) for x in sys.argv[2:]]; out=sys.argv[1]; os.makedirs(out,exist_ok=True)
with sync_playwright() as p:
    br=p.chromium.launch(); pg=br.new_page(viewport={'width':1920,'height':1080})
    msgs=[]; pg.on('console',lambda m:msgs.append(m.text)); pg.on('pageerror',lambda e:msgs.append('ERR '+str(e)))
    pg.goto('file://'+os.path.join(here,'anim_q.html')); pg.evaluate('tl=>{window.TL=tl;}',tl)
    for t in ts:
        pg.evaluate(f'render({t})'); pg.screenshot(path=f'{out}/t{t:07.2f}.jpg',type='jpeg',quality=88)
    br.close(); print('\n'.join(msgs[:10]))
