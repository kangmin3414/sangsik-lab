"""Render frames [a, b) straight into an mp4 segment (no frame files on disk)."""
import sys, os, json, subprocess
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__)); tl = json.load(open(os.path.join(here, "timeline.json")))
FPS = 24; N = int(tl["duration"] * FPS); a, b = int(sys.argv[1]), min(int(sys.argv[2]), N); out = sys.argv[3]
ff = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'image2pipe', '-framerate', str(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast',
                       '-crf', '18', '-pix_fmt', 'yuv420p', out], stdin=subprocess.PIPE)
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    pg.goto("file://" + os.path.join(here, "anim_ep01.html")); pg.evaluate("tl => { window.TL = tl; }", tl)
    pg.evaluate("render(TL.duration - 3)"); pg.wait_for_timeout(800)
    for i in range(a, b):
        pg.evaluate(f"render({i/FPS})"); ff.stdin.write(pg.screenshot(type="jpeg", quality=92))
        if (i - a) % 500 == 0: print('frame', i, flush=True)
    br.close()
ff.stdin.close(); ff.wait(); print("done", a, b, N, flush=True)
