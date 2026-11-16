"""화풍 시험 스틸: python3 shoot.py → /dev/shm/st/<화풍>.jpg + 시트. clip 인자를 주면 화풍이 바뀌는 14초 시험 영상 프레임."""
import sys, os
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = '/dev/shm/st'; os.makedirs(OUT + '/fr', exist_ok=True)
STY = [x for x in (sys.argv[1:] or ['vector', 'pixel', 'gameboy', 'cave', 'shadow', 'relief', 'woodblock', 'chalk', 'holo', 'water', 'paper']) if x != 'clip']
with sync_playwright() as p:
    br = p.chromium.launch(args=['--disable-gpu']); pg = br.new_page(viewport={'width': 1920, 'height': 1080}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + os.path.join(HERE, 'style.html'))
    if 'clip' in sys.argv:
        ORDER = ['vector', 'pixel', 'cave', 'relief', 'woodblock', 'shadow', 'chalk', 'holo', 'water', 'paper', 'vector']; SEG = 1.25; N = int(SEG * len(ORDER) * 24)
        for i in range(N):
            t = i / 24; k = min(len(ORDER) - 1, int(t / SEG)); ts = round(t / SEG) * SEG
            mos = 0 if ts <= 0 or ts >= SEG * len(ORDER) else max(0, int(56 * (1 - abs(t - ts) / 0.28) ** 2)) if abs(t - ts) < 0.28 else 0
            pg.evaluate(f"ST({t}, '{ORDER[k]}', {{ mosaic: {mos + 4 if mos else 0} }})"); pg.screenshot(path=f'{OUT}/fr/f{i:05d}.jpg', type='jpeg', quality=88)
    else:
        for s in STY:
            pg.evaluate(f"ST(1.0, '{s}')"); pg.evaluate('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))'); pg.screenshot(path=f'{OUT}/{s}.jpg', type='jpeg', quality=88)
    br.close(); print('errors', errs[:5])
