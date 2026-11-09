import json, os, sys
from playwright.sync_api import sync_playwright
HERE=os.getcwd(); TL=json.load(open('timeline_gf.json')); i=int(sys.argv[1]); post=sys.argv[2] if len(sys.argv)>2 else ''
with sync_playwright() as p:
    br=p.chromium.launch(args=['--disable-gpu']); pg=br.new_page(viewport={'width':1920,'height':1080}); pg.set_default_timeout(15000)
    pg.goto('file://'+os.path.join(HERE,'anim_gf.html')); pg.evaluate('(tl)=>{window.TL=tl;}',TL); pg.evaluate('window.AI_READY')
    pg.evaluate(f'render({i/24})')
    if post: pg.evaluate(post)
    try: pg.screenshot(path='/tmp/ct.png', type='png'); print('OK', post[:70])
    except Exception as e: print('CRASH', post[:70])
    br.close()
