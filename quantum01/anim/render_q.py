import sys, os, json
from playwright.sync_api import sync_playwright
here=os.path.dirname(os.path.abspath(__file__)); tl=json.load(open(os.path.join(here,'timeline_q.json')))
FPS=24; t0=float(sys.argv[1]); t1=float(sys.argv[2]); od=os.path.join(here,sys.argv[3]); os.makedirs(od,exist_ok=True)
a=int(round(t0*FPS)); b=int(round(t1*FPS))
with sync_playwright() as p:
    br=p.chromium.launch(); pg=br.new_page(viewport={'width':1920,'height':1080})
    pg.goto('file://'+os.path.join(here,'anim_q.html')); pg.evaluate('tl=>{window.TL=tl;}',tl)
    for i in range(a,b):
        pg.evaluate(f'render({i/FPS})'); pg.screenshot(path=f'{od}/f{i-a:05d}.jpg',type='jpeg',quality=90)
    br.close()
print('done',sys.argv[3],b-a)
