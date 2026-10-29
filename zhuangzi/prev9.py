import os, json
from playwright.sync_api import sync_playwright
here=os.path.dirname(os.path.abspath(__file__)); import sys; tl=json.load(open(os.path.join(here,sys.argv[1] if len(sys.argv)>1 else "timeline.json")))
only=[int(x) for x in sys.argv[2].split(",")] if len(sys.argv)>2 else None
od=os.path.join(here,"prev"); os.makedirs(od,exist_ok=True)
with sync_playwright() as p:
    br=p.chromium.launch(); pg=br.new_page(viewport={"width":1920,"height":1080})
    errs=[]; pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: errs.append(m.text) if m.type=="error" else None)
    pg.goto("file://"+os.path.join(here,"anim9.html")); pg.evaluate("tl => { window.TL = tl; }", tl)
    for l in tl["lines"]:
        if only and l["i"] not in only: continue
        tt=l["t0"]+0.7*(l["t1"]-l["t0"])
        pg.evaluate(f"render({tt})"); pg.screenshot(path=os.path.join(od,f"p{l['i']:02d}.jpg"), type="jpeg", quality=80)
    br.close()
print("errors:", errs[:5])
