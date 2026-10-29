import os, json, sys
from playwright.sync_api import sync_playwright
from PIL import Image
here = os.path.dirname(os.path.abspath(__file__)); tl = json.load(open(os.path.join(here, 'timeline.json')))
L = tl['lines']; frac = float(sys.argv[1]) if len(sys.argv) > 1 else 0.7
idx = [int(x) for x in sys.argv[2].split(',')] if len(sys.argv) > 2 else list(range(len(L)))
os.makedirs(os.path.join(here, 'qa25'), exist_ok=True)
errs = []
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
    pg.goto("file://" + os.path.join(here, "anim012.html")); pg.evaluate("tl => { window.TL = tl; }", tl)
    pg.evaluate("window.AI_READY || 0")
    shots = []
    for i in idx:
        l = L[i]; t = l['t0'] + frac * (l['t1'] - l['t0'])
        try: pg.evaluate(f"render({t})")
        except Exception as e: errs.append(f'{i}: {str(e)[:200]}')
        fn = os.path.join(here, 'qa25', f'l{i:02d}.jpg'); pg.screenshot(path=fn, type='jpeg', quality=70); shots.append((i, fn))
    br.close()
cols = 5; w, h = 384, 216
rows = (len(shots) + cols - 1) // cols
for part in range(0, rows, 4):
    sub = shots[part * cols:(part + 4) * cols]
    sheet = Image.new('RGB', (cols * w, ((len(sub) + cols - 1) // cols) * h), 'white')
    for n, (i, fn) in enumerate(sub): sheet.paste(Image.open(fn).resize((w, h)), ((n % cols) * w, (n // cols) * h))
    sheet.save(os.path.join(here, 'qa25', f'sheet_{part // 4}.jpg'), quality=80)
print('errors', errs[:10]); print('sheets', (rows + 3) // 4)
