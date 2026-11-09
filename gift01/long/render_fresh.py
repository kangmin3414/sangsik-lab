"""한 프레임마다 새 페이지로 렌더(같은 페이지에서 연속 렌더하면 멈추는 구간용)."""
import json, os, sys, time
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
TL = json.load(open('timeline_gf.json')); FPS = 24; N = int(TL['duration'] * FPS) + 1
part, parts = int(sys.argv[1]), int(sys.argv[2])
todo = [i for i in range(N) if not (os.path.exists(f'fr/f{i:05d}.jpg') and os.path.getsize(f'fr/f{i:05d}.jpg') > 8000)][part::parts]
with sync_playwright() as p:
    br = p.chromium.launch(args=['--disable-gpu']); n = 0
    for i in todo:
        for att in range(4):
            try:
                pg = br.new_page(viewport={'width': 1920, 'height': 1080}); pg.set_default_timeout(20000)
                pg.goto('file://' + os.path.join(HERE, 'anim_gf.html')); pg.evaluate('(tl) => { window.TL = tl; }', TL); pg.evaluate('window.AI_READY')
                pg.evaluate(f'render({i / FPS})'); pg.screenshot(path=f'fr/f{i:05d}.jpg', type='jpeg', quality=88); pg.close(); break
            except Exception as e:
                print('fail', i, att, str(e)[:60], flush=True)
                try: br.close()
                except Exception: pass
                br = p.chromium.launch(args=['--disable-gpu'])
        n += 1
        if n % 40 == 0: br.close(); br = p.chromium.launch(args=['--disable-gpu'])
    br.close()
print('fresh done', part, len(todo), flush=True)
