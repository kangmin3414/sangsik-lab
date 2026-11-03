import json, os, sys, subprocess
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
TL = json.load(open('timeline_s.json')); FPS = 30; N = int(TL['end'] * FPS) + 1
os.makedirs('fr2', exist_ok=True)
def run(a, b):
    with sync_playwright() as p:
        br = p.chromium.launch(args=['--disable-gpu']); pg = br.new_page(viewport={'width': 1080, 'height': 1920})
        pg.goto('file://' + os.path.join(HERE, 'anim_s2.html')); pg.evaluate('(tl) => { window.TL = tl; }', TL)
        for i in range(a, b):
            f = f'fr2/f{i:05d}.jpg'
            if os.path.exists(f) and os.path.getsize(f) > 5000: continue
            pg.evaluate(f'render({i / FPS})'); pg.evaluate('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))'); pg.screenshot(path=f, type='jpeg', quality=90)
        br.close()
for a in range(0, N, 400): run(a, min(N, a + 400))
print('frames', N)
