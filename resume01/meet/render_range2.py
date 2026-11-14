"""render explicit frame ranges: python3 render_range.py a0 b0 [a1 b1 ...]  (b inclusive). skips finished frames."""
import json, os, sys
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
TL = json.load(open('timeline_mt.json')); FPS = 24; os.makedirs('fr2', exist_ok=True)
v = [int(x) for x in sys.argv[1:]]; todo = [i for a, b in zip(v[::2], v[1::2]) for i in range(a, b + 1)]
todo = [i for i in todo if not (os.path.exists(f'fr2/f{i:05d}.jpg') and os.path.getsize(f'fr2/f{i:05d}.jpg') > 8000)]
def run(chunk):
    with sync_playwright() as p:
        br = p.chromium.launch(args=['--disable-gpu']); pg = br.new_page(viewport={'width': 1920, 'height': 1080})
        pg.goto('file://' + os.path.join(HERE, 'anim_mt2.html')); pg.evaluate('(tl) => { window.TL = tl; }', TL); pg.evaluate('window.AI_READY')
        for i in chunk:
            pg.evaluate(f'render({i / FPS})'); pg.evaluate('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))'); pg.screenshot(path=f'fr2/f{i:05d}.jpg', type='jpeg', quality=88)
        br.close()
for k in range(0, len(todo), 250): run(todo[k:k + 250])
print('range done', sys.argv[1:], flush=True)
