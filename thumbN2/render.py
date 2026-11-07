import os, sys
from playwright.sync_api import sync_playwright
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); os.makedirs('out', exist_ok=True)
NAMES = ['005_니체_A','005_니체_B','006_스토아','007_데카르트','008_장자','009_소크라테스','010_붓다','011_시간','012_화','013_행복','몰아보기01']
sel = sys.argv[1:] or NAMES
with sync_playwright() as p:
    br = p.chromium.launch(args=['--disable-gpu']); pg = br.new_page(viewport={'width': 1920, 'height': 1080})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + os.path.abspath('../retrieval01/long/tn_page.html'))
    for n in sel:
        pg.evaluate(f'thumb({n!r})'); pg.evaluate('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
        pg.screenshot(path=f'out/_{n}.png'); Image.open(f'out/_{n}.png').convert('RGB').resize((1280, 720), Image.LANCZOS).save(f'out/{n}.jpg', quality=93); os.remove(f'out/_{n}.png')
    print('errors', errs); br.close()
ims = [Image.open(f'out/{n}.jpg').resize((640, 360)) for n in NAMES if os.path.exists(f'out/{n}.jpg')]
s = Image.new('RGB', (1920, 360 * ((len(ims) + 2) // 3)))
for k, im in enumerate(ims): s.paste(im, ((k % 3) * 640, (k // 3) * 360))
s.save('out/_sheet.jpg', quality=85)
