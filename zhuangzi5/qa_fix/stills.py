"""usage: stills.py prefix spec...   spec = line:frac[,frac..]  or  t=SECONDS  -> qa_fix/<prefix>_L<line>_<frac>.jpg (half-size unless FULL=1)"""
import sys, os, json, math
from playwright.sync_api import sync_playwright
from PIL import Image
EP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
tl = json.load(open(os.path.join(EP, "timeline.json"))); L = tl["lines"]
pref = sys.argv[1]; jobs = []
for s in sys.argv[2:]:
    if s.startswith("t="):
        t = float(s[2:]); jobs.append((t, f"{pref}_t{t:.2f}"))
    else:
        li, fr = s.split(":"); li = int(li)
        for f in fr.split(","):
            f = float(f); t = L[li]["t0"] + f * (L[li]["t1"] - L[li]["t0"])
            jobs.append((t, f"{pref}_L{li}_{f:.2f}"))
errs = []
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("file://" + os.path.join(EP, "anim9c.html")); pg.evaluate("tl => { window.TL = tl; }", tl)
    pg.evaluate("window.AI_READY")
    for t, name in jobs:
        f = round(t * 24); pg.evaluate(f"render({f/24})")
        out = os.path.join(EP, "qa_fix", name + ".jpg"); pg.screenshot(path=out, type="jpeg", quality=88)
        if not os.environ.get("FULL"):
            im = Image.open(out); im.resize((960, 540)).save(out, quality=88)
        print(name, f"t={f/24:.3f}", "f=", f)
    br.close()
print("ERRORS", errs)
