import json, os, sys
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
TL = json.load(open('timeline_r.json')); FPS = 24; N = int(TL['duration'] * FPS) + 1
part, parts = int(sys.argv[1]), int(sys.argv[2]); os.makedirs('fr', exist_ok=True)
lo, hi = N * part // parts, N * (part + 1) // parts
def run(a, b):
    with sync_playwright() as p:
        br = p.chromium.launch(args=['--disable-gpu']); pg = br.new_page(viewport={'width': 1920, 'height': 1080})
        pg.goto('file://' + os.path.join(HERE, 'anim_r.html')); pg.evaluate('(tl) => { window.TL = tl; }', TL)
        for i in range(a, b):
            f = f'fr/f{i:05d}.jpg'
            if os.path.exists(f) and os.path.getsize(f) > 8000: continue
            pg.evaluate(f'render({i / FPS})'); pg.evaluate('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))'); pg.screenshot(path=f, type='jpeg', quality=88)
        br.close()
for a in range(lo, hi, 300): run(a, min(hi, a + 300))
print('part done', part, lo, hi, flush=True)
