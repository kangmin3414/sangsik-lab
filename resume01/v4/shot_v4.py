"""장면 점검용 스크린샷. python3 shot_rs.py 이름 t1 t2 ... → /dev/shm/v4/chk/이름.jpg (3열 시트). TMPDIR은 /dev/shm/v4/tmp로."""
import sys, os, json
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); OUT = '/dev/shm/v4/chk'; os.makedirs(OUT, exist_ok=True)
TL = json.load(open('timeline_v4.json')); name = sys.argv[1]; ts = [float(x) for x in sys.argv[2:]]
big = name.startswith('big')
with sync_playwright() as p:
    br = p.chromium.launch(args=['--disable-gpu']); pg = br.new_page(viewport={'width': 1920, 'height': 1080})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.goto('file://' + os.path.join(HERE, 'anim_v4.html')); pg.evaluate('(tl) => { window.TL = tl; }', TL); pg.evaluate('window.AI_READY')
    ims = []
    for tt in ts:
        pg.evaluate(f'render({tt})'); pg.evaluate('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))'); f = f'{OUT}/_t.png'; pg.screenshot(path=f)
        im = Image.open(f).convert('RGB'); im = im.resize((1280, 720) if big else (640, 360), Image.LANCZOS); ImageDraw.Draw(im).text((8, 6), f'{tt:.2f}', fill=(255, 0, 0)); ims.append(im)
    br.close()
cols = 1 if big else 3; w, h = ims[0].size; rows = (len(ims) + cols - 1) // cols
sh = Image.new('RGB', (w * cols, h * rows), 'white')
for i, im in enumerate(ims): sh.paste(im, ((i % cols) * w, (i // cols) * h))
sh.save(f'{OUT}/{name}.jpg', quality=80); print('errors', errs[:6])
