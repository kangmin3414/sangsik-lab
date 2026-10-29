"""Render stills: python3 stills_fix.py OUTPREFIX t1 t2 ... (times in seconds, or L<i>@<frac>)"""
import sys, os, json
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__)); tl = json.load(open(os.path.join(here, "timeline.json")))
pre = sys.argv[1]; specs = sys.argv[2:]
def tt(s):
    if s.startswith('L'):
        i, f = s[1:].split('@'); l = tl['lines'][int(i)]; return l['t0'] + float(f) * (l['t1'] - l['t0'])
    return float(s)
errs = []
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto("file://" + os.path.join(here, "anim8b.html")); pg.evaluate("tl => { window.TL = tl; }", tl)
    pg.evaluate("window.AI_READY")
    for s in specs:
        t = tt(s); f = int(t * 24)
        pg.evaluate(f"render({f/24})")
        out = os.path.join(here, 'qa_fix', f"{pre}_{s.replace('@','_')}_f{f:05d}.jpg")
        pg.screenshot(path=out, type="jpeg", quality=80); print(out)
    br.close()
print("ERRORS:", errs)
