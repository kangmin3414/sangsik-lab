"""Contact sheet: one frame per line (or given lines) -> qa/sheet_*.jpg"""
import json, os, sys
from playwright.sync_api import sync_playwright
from PIL import Image
here = os.path.dirname(os.path.abspath(__file__)); os.chdir(here)
tl = json.load(open(os.environ.get('TLF','timeline.json'))); SH = json.load(open('shots.json')); PT = json.load(open('patches.json')) if os.path.exists('patches.json') else {}
sel = [int(x) for x in sys.argv[1].split(',')] if len(sys.argv) > 1 else list(range(len(tl['lines'])))
frac = float(sys.argv[2]) if len(sys.argv) > 2 else 0.6
os.makedirs('qa', exist_ok=True); errs = []; shots = []
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={'width': 1920, 'height': 1080}); pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + os.path.join(here, 'anim_ep02.html'))
    pg.evaluate('([tl, sh, pt]) => { window.TL = tl; window.SHOTS = sh; window.PATCH = pt; window.COUNT_LABEL = "ㅇㅇ 다시 열어 본 횟수"; }', [tl, SH, PT])
    for i in sel:
        l = tl['lines'][i]; nxt = tl['lines'][i + 1]['t0'] if i + 1 < len(tl['lines']) else tl['duration']
        tt = l['t0'] + (nxt - l['t0']) * frac; pg.evaluate(f'render({tt})'); pg.wait_for_timeout(120)
        f = f'qa/l{i:03d}.jpg'; pg.screenshot(path=f, type='jpeg', quality=72); shots.append((i, f))
    br.close()
print('errors', errs[:5])
cols, tw, th = 4, 480, 270
for page in range(0, len(shots), 24):
    part = shots[page:page + 24]; r = (len(part) + cols - 1) // cols; sheet = Image.new('RGB', (cols * tw, r * th))
    for n, (i, f) in enumerate(part): sheet.paste(Image.open(f).resize((tw, th)), ((n % cols) * tw, (n // cols) * th))
    sheet.save(f'qa/sheet_{page // 24}.jpg', quality=82); print(f'qa/sheet_{page // 24}.jpg')
