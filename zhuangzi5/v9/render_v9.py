"""Shoot frames of the v9 timeline. usage: render_v9.py <timeline json> <outdir> frames|times <a:b | comma list> [quality]
frames a:b -> f%05d.jpg global index (skips existing); times t1,t2 -> s_<t>.jpg stills."""
import sys, os, json, time
from playwright.sync_api import sync_playwright
EP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
tl = json.load(open(sys.argv[1])); od = sys.argv[2]; mode = sys.argv[3]; spec = sys.argv[4]; Q = int(sys.argv[5]) if len(sys.argv) > 5 else 92
os.makedirs(od, exist_ok=True); FPS = 24
if mode == 'frames':
    a, b = map(int, spec.split(':')); jobs = [(f / FPS, os.path.join(od, f'f{f:05d}.jpg')) for f in range(a, b)]
else:
    jobs = [(float(x), os.path.join(od, f's_{float(x):07.2f}.jpg')) for x in spec.split(',')]
errs = []; t0 = time.time()
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto("file://" + os.path.join(EP, "anim9c.html")); pg.evaluate("tl => { window.TL = tl; }", tl)
    print("ai images", pg.evaluate("window.AI_READY"), flush=True)
    for k, (t, out) in enumerate(jobs):
        if mode == 'frames' and os.path.exists(out): continue
        pg.evaluate(f"render({t})"); pg.screenshot(path=out, type="jpeg", quality=Q)
        if k % 200 == 0: print(k, len(jobs), round(time.time() - t0), flush=True)
    br.close()
print("DONE", len(jobs), "errors:", errs[:5], round(time.time() - t0), flush=True)
