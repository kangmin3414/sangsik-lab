import os, json, sys
from playwright.sync_api import sync_playwright
here=os.path.dirname(os.path.abspath(__file__)); tl=json.load(open(os.path.join(here,"timeline.json")))
L=tl["lines"]; ts=[]
def at(i,f): l=L[i]; return l["t0"]+f*(l["t1"]-l["t0"])
ts=[("chap",at(8,0.6)),("box",at(4,0.05)),("coast15s",at(15,0.05)),("coast15e",at(15,0.8)),("liver",at(26,0.8)),("taste29",at(29,0.7)),("taste30",at(30,0.7)),("comfort",at(34,0.9)),("mom0",at(35,0.05)),("mom1",at(35,0.4)),("mom2",at(35,0.7)),("mom3",at(35,0.95)),("tea",at(36,0.6)),("thanks",at(38,0.5)),("lab",at(12,0.6)),("chap2",at(13,0.3))]
os.makedirs(os.path.join(here,"fix"),exist_ok=True)
with sync_playwright() as p:
    br=p.chromium.launch(); pg=br.new_page(viewport={"width":1920,"height":1080})
    errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("file://"+os.path.join(here,"anim5.html")); pg.evaluate("tl => { window.TL = tl; }", tl)
    for n,t in ts:
        pg.evaluate(f"render({t})"); pg.screenshot(path=os.path.join(here,"fix",f"{n}.jpg"), type="jpeg", quality=80)
    br.close()
print("errors", errs[:3])
from PIL import Image, ImageDraw
W,H=480,270; sheet=Image.new('RGB',(W*4,H*4)); dr=ImageDraw.Draw(sheet)
for j,(n,t) in enumerate(ts):
    sheet.paste(Image.open(os.path.join(here,"fix",f"{n}.jpg")).resize((W,H)),((j%4)*W,(j//4)*H)); dr.text(((j%4)*W+4,(j//4)*H+4),n,fill='yellow')
sheet.save(os.path.join(here,"fixsheet.jpg"),quality=85)
