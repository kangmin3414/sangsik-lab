"""Preview frames of chosen lines straight from the animation page (no full render).
usage: python3 prev_ai.py <anim.html> <out.jpg> i[:frac] ...   (frac of the line, default 0.8)"""
import json, os, sys
from playwright.sync_api import sync_playwright
from PIL import Image
here = os.getcwd(); anim, out = sys.argv[1], sys.argv[2]
tl = json.load(open('timeline.json')); L = tl['lines']
picks = []
for a in sys.argv[3:]:
    i, f = (a.split(':') + ['0.8'])[:2]; i = int(i); f = float(f)
    picks.append((i, f, L[i]['t0'] + f * (L[i]['t1'] - L[i]['t0'])))
os.makedirs('prev_ai', exist_ok=True)
ims = []
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={'width': 1920, 'height': 1080})
    pg.goto('file://' + os.path.join(here, anim)); pg.evaluate('tl => { window.TL = tl; }', tl)
    pg.evaluate('window.AI_READY')
    for i, f, t in picks:
        pg.evaluate(f'render({t})'); fp = f'prev_ai/l{i:02d}_{int(f * 100):02d}.jpg'
        pg.screenshot(path=fp, type='jpeg', quality=85); ims.append(Image.open(fp).resize((640, 360)))
    br.close()
cols = 3; rows = (len(ims) + cols - 1) // cols
S = Image.new('RGB', (cols * 650, rows * 370), 'white')
for k, im in enumerate(ims): S.paste(im, ((k % cols) * 650, (k // cols) * 370))
S.save(out, quality=85); print(out, len(ims))
