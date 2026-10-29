"""Render stills at given times: python3 fix_stills.py OUTDIR [scale] t1 t2 ...  (t may be 'L53@0.5' = line 53 at 50%, or 'L53@-0.1' = t0-0.1, or seconds)
Output: OUTDIR/<tag>.jpg; prints page errors."""
import sys, os, json
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__)); tl = json.load(open(os.path.join(here, "timeline.json")))
L = tl["lines"]; od = sys.argv[1]; os.makedirs(od, exist_ok=True)
args = sys.argv[2:]
scale = 1.0
if args and args[0].startswith('x'): scale = float(args[0][1:]); args = args[1:]
def tof(s):
    if s.startswith('L'):
        i, f = s[1:].split('@'); l = L[int(i)]; f = float(f)
        return (l['t0'] + f * (l['t1'] - l['t0'])) if 0 <= f <= 1 else (l['t0'] + f if f < 0 else l['t1'] + f - 1)
    if s.startswith('f'): return int(s[1:]) / 24
    return float(s)
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto("file://" + os.path.join(here, "anim11.html")); pg.evaluate("tl => { window.TL = tl; }", tl)
    pg.evaluate("window.AI_READY")
    for s in args:
        t = tof(s); pg.evaluate(f"render({t})")
        fn = os.path.join(od, f"{s.replace('@', '_')}.jpg"); pg.screenshot(path=fn, type="jpeg", quality=88)
        if scale != 1.0:
            from PIL import Image
            im = Image.open(fn); im.resize((int(1920 * scale), int(1080 * scale))).save(fn, quality=88)
        print(s, round(t, 3), fn, flush=True)
    br.close()
print("ERRORS:", errs)
