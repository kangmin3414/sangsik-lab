import sys, os, json
from playwright.sync_api import sync_playwright
here=os.path.dirname(os.path.abspath(__file__)); tl=json.load(open(os.path.join(here,"timeline.json")))
sel=json.load(open(os.path.join(here,"rerender.json"))); k,n=int(sys.argv[1]),int(sys.argv[2]); sel=sel[k::n]
FPS=24
with sync_playwright() as p:
    br=p.chromium.launch(); pg=br.new_page(viewport={"width":1920,"height":1080})
    pg.goto("file://"+os.path.join(here,"anim8b.html")); pg.evaluate("tl => { window.TL = tl; }", tl)
    for i in sel:
        pg.evaluate(f"render({i/FPS})"); pg.screenshot(path=os.path.join(here,"frames",f"f{i:05d}.jpg"), type="jpeg", quality=90)
    br.close()
print("done", len(sel))
