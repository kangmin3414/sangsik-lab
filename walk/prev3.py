import sys, os, json
from playwright.sync_api import sync_playwright
here=os.path.dirname(os.path.abspath(__file__)); tl=json.load(open(os.path.join(here,"timeline.json")))
times=[float(x) for x in sys.argv[1].split(",")]; od=os.path.join(here,"prev"); os.makedirs(od,exist_ok=True)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={"width":1920,"height":1080}); errs=[]
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("file://"+os.path.join(here,"anim3.html")); pg.evaluate("tl => { window.TL = tl; }", tl)
    for t in times:
        pg.evaluate(f"render({t})"); pg.screenshot(path=os.path.join(od,f"p_{t:07.2f}.png"))
    b.close(); print("errors:", errs[:3])
