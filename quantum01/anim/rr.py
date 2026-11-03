import sys, os, json
from playwright.sync_api import sync_playwright
here=os.path.dirname(os.path.abspath(__file__)); tl=json.load(open(os.path.join(here,'timeline_q6.json')))
FPS=24; od=os.path.join(here,'fr6'); os.makedirs(od,exist_ok=True)
rngs=[tuple(float(x) for x in r.split('-')) for r in sys.argv[1].split(',')]
todo=[i for a,b in rngs for i in range(int(round(a*FPS)), min(int(round(b*FPS)), int(tl['duration']*FPS))) if not os.path.exists(f'{od}/f{i:05d}.jpg')]
with sync_playwright() as p:
    for c in range(0, len(todo), 500):   # fresh browser every 500 frames (the GPU process dies of memory otherwise)
        br=p.chromium.launch(args=['--disable-gpu']); pg=br.new_page(viewport={'width':1920,'height':1080})
        pg.goto('file://'+os.path.join(here,'anim_q6.html')); pg.evaluate('tl=>{window.TL=tl;}',tl); pg.wait_for_timeout(2500)
        for i in todo[c:c+500]:
            pg.evaluate(f'render({i/FPS})'); pg.screenshot(path=f'{od}/f{i:05d}.jpg',type='jpeg',quality=90)
        br.close()
print('done',sys.argv[1])
