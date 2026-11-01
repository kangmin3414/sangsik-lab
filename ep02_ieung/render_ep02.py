"""Render frames [a, b) of ep02 straight into an mp4 segment."""
import sys, os, json, subprocess
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__)); tl = json.load(open(os.path.join(here, 'timeline.json')))
SH = json.load(open(os.path.join(here, 'shots.json'))); PT = json.load(open(os.path.join(here, 'patches.json'))) if os.path.exists(os.path.join(here, 'patches.json')) else {}
FPS = 24; N = int(tl['duration'] * FPS); a, b = int(sys.argv[1]), min(int(sys.argv[2]), N); out = sys.argv[3]
ff = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'image2pipe', '-framerate', str(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast',
                       '-crf', '18', '-pix_fmt', 'yuv420p', out], stdin=subprocess.PIPE)
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={'width': 1920, 'height': 1080})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + os.path.join(here, 'anim_ep02.html'))
    pg.evaluate('([tl, sh, pt]) => { window.TL = tl; window.SHOTS = sh; window.PATCH = pt; window.COUNT_LABEL = "ㅇㅇ 다시 열어 본 횟수"; }', [tl, SH, PT])
    pg.evaluate('render(5)'); pg.wait_for_timeout(1500)
    for i in range(a, b):
        pg.evaluate(f'render({i / FPS})')
        if i % 240 == 0: pg.wait_for_timeout(60)
        ff.stdin.write(pg.screenshot(type='jpeg', quality=92))
        if (i - a) % 600 == 0: print('frame', i, errs[:2], flush=True)
    br.close()
ff.stdin.close(); ff.wait(); print('done', a, b, N, errs[:3], flush=True)
