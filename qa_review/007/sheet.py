import json, glob, os
from PIL import Image, ImageDraw, ImageFont
picks=json.load(open('picks.json'))
fn=None
for p in ['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf']:
    if os.path.exists(p): fn=ImageFont.truetype(p,20)
fn=fn or ImageFont.load_default()
items=[]
for i,t in picks:
    f=f'frames/L{i:02d}_{t:07.2f}.jpg'
    if os.path.exists(f): items.append((i,t,f))
cols=4; per=24; TW,TH=480,270
for s in range(0,len(items),per):
    chunk=items[s:s+per]; rows=(len(chunk)+cols-1)//cols
    S=Image.new('RGB',(cols*(TW+6),rows*(TH+6)),'white'); d=ImageDraw.Draw(S)
    for k,(i,t,f) in enumerate(chunk):
        im=Image.open(f).resize((TW,TH)); x=(k%cols)*(TW+6); y=(k//cols)*(TH+6); S.paste(im,(x,y))
        lab=f'L{i} {int(t//60):02d}:{t%60:05.2f}'
        d.rectangle([x,y,x+190,y+26],fill='black'); d.text((x+4,y+3),lab,fill='yellow',font=fn)
    S.save(f'sheet_{s//per:02d}.jpg',quality=85)
print(len(items))
