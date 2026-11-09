import json, os, time, sys
from playwright.sync_api import sync_playwright
HERE=os.getcwd(); TL=json.load(open('timeline_gf.json')); a, b = int(sys.argv[1]), int(sys.argv[2])
with sync_playwright() as p:
    br=p.chromium.launch(args=['--disable-gpu']); pg=br.new_page(viewport={'width':1920,'height':1080}); pg.set_default_timeout(15000)
    pg.goto('file://'+os.path.join(HERE,'anim_gf.html')); pg.evaluate('(tl)=>{window.TL=tl;}',TL); print('loaded', flush=True); pg.evaluate('window.AI_READY'); print('ready', flush=True)
    for i in range(a, b):
        t0=time.time(); print(i,'render', end=' ', flush=True); pg.evaluate(f'render({i/24})'); print(round(time.time()-t0,2),'raf', end=' ', flush=True)
        pg.evaluate('new Promise(r=>{requestAnimationFrame(()=>requestAnimationFrame(r)); setTimeout(r, 250);})'); print(round(time.time()-t0,2),'shot', end=' ', flush=True)
        try: pg.screenshot(path='/tmp/claude-0/-home-claude/8ea42618-92c7-5880-934a-1a398f438784/scratchpad/tm.jpg', type='jpeg', quality=88); print(round(time.time()-t0,2), flush=True)
        except Exception as e: print('ERR', str(e)[:60], flush=True); break
