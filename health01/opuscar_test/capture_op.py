"""페이지의 window.render(t)를 시각마다 불러 화면을 찍는다. 사용: capture_op.py <페이지> <출력폴더> [fps] [a b] [--png] [--stills t1,t2,...]"""
import sys, os, json
from playwright.sync_api import sync_playwright
page_name, out = sys.argv[1], sys.argv[2]; args = sys.argv[3:]
png = '--png' in args; stills = None
if '--stills' in args: stills = [float(x) for x in args[args.index('--stills') + 1].split(',')]
nums = [a for a in args if a.replace('.', '').isdigit()]
fps = int(nums[0]) if nums else 24
os.makedirs(out, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(args=['--disable-gpu-vsync', '--force-color-profile=srgb'])
    pg = b.new_page(viewport={'width': 1920, 'height': 1080}, device_scale_factor=1)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: m.type == 'error' and errs.append(m.text))
    pg.goto(f'http://127.0.0.1:8765/{page_name}'); pg.wait_for_function('window.READY === true', timeout=60000)
    dur = pg.evaluate('window.DUR'); pg.evaluate(f'window.render({dur} - 0.01)')   # 획 소리용 사건 목록을 다 채운다
    json.dump({'dur': dur, 'ev': pg.evaluate('window.EV || []')}, open(os.path.join(out, 'events.json'), 'w'))
    if stills: ts = stills
    else:
        n = int(round(dur * fps)); a, z = (int(nums[1]), int(nums[2])) if len(nums) >= 3 else (0, n - 1); ts = [i / fps for i in range(a, z + 1)]
    for k, t in enumerate(ts):
        pg.evaluate(f'window.render({t})')
        name = f's{k:02d}' if stills else f'f{int(round(t * fps)):05d}'
        pg.screenshot(path=os.path.join(out, name + ('.png' if png else '.jpg')), type='png' if png else 'jpeg', **({} if png else {'quality': 97 if 'riso' in page_name else 92}))
    if errs: print('ERRORS', errs[:5])
    b.close()
print('done', page_name, len(ts))
