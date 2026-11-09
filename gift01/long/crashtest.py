import json, os, sys
from playwright.sync_api import sync_playwright
HERE=os.getcwd(); TL=json.load(open('timeline_gf.json')); i=int(sys.argv[1]); pre=sys.argv[2] if len(sys.argv)>2 else ''
with sync_playwright() as p:
    br=p.chromium.launch(args=['--disable-gpu']); pg=br.new_page(viewport={'width':1920,'height':1080}); pg.set_default_timeout(15000)
    pg.goto('file://'+os.path.join(HERE,'anim_gf.html')); pg.evaluate('(tl)=>{window.TL=tl;}',TL); pg.evaluate('window.AI_READY')
    if pre: pg.evaluate(pre)
    pg.evaluate(f'render({i/24})')
    try: pg.screenshot(path='/tmp/claude-0/-home-claude/8ea42618-92c7-5880-934a-1a398f438784/scratchpad/ct.jpg', type='jpeg', quality=80); print('OK', i, pre[:40])
    except Exception as e: print('CRASH', i, pre[:40], str(e)[:50])
    br.close()
