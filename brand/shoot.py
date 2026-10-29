import os, sys
from playwright.sync_api import sync_playwright
here=os.path.dirname(os.path.abspath(__file__))
jobs=[("thumb",1280,720),("banner",2560,1440),("profile",800,800)]
with sync_playwright() as p:
    b=p.chromium.launch()
    for name,w,h in jobs:
        pg=b.new_page(viewport={"width":w,"height":h}); errs=[]
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto("file://"+os.path.join(here,"art.html")+"#"+name); pg.wait_for_timeout(300)
        pg.screenshot(path=os.path.join(here,f"art_{name}.png")); pg.close(); print(name, errs)
    b.close()
