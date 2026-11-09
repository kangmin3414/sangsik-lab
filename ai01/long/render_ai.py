import json, os, sys
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
TLF = os.environ.get('TLF', 'timeline_ai.json'); TL = json.load(open(TLF)); FPS = 24; N = int(TL['duration'] * FPS) + 1
part, parts = int(sys.argv[1]), int(sys.argv[2]); os.makedirs('fr', exist_ok=True)
lo, hi = N * part // parts, N * (part + 1) // parts
todo = [i for i in range(lo, hi) if not (os.path.exists(f'fr/f{i:05d}.jpg') and os.path.getsize(f'fr/f{i:05d}.jpg') > 8000)]
def open_page(p):
    br = p.chromium.launch(args=['--disable-gpu']); pg = br.new_page(viewport={'width': 1920, 'height': 1080}); pg.set_default_timeout(20000)
    pg.goto('file://' + os.path.join(HERE, 'anim_ai.html')); pg.evaluate('(tl) => { window.TL = tl; }', TL); pg.evaluate('window.AI_READY'); return br, pg
with sync_playwright() as p:
    br, pg = open_page(p); used = 0
    for i in todo:
        for attempt in range(4):
            try:
                if used >= 60: br.close(); br, pg = open_page(p); used = 0
                pg.evaluate(f'render({i / FPS})'); pg.evaluate('new Promise(r=>{requestAnimationFrame(()=>requestAnimationFrame(r)); setTimeout(r, 250);})')
                pg.screenshot(path=f'fr/f{i:05d}.jpg', type='jpeg', quality=88); used += 1; break
            except Exception as e:
                print('retry', i, attempt, str(e)[:80], flush=True)
                try: br.close()
                except Exception: pass
                br, pg = open_page(p); used = 0
    br.close()
print('part done', part, lo, hi, len(todo), flush=True)
