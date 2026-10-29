import json,sys,os
from PIL import Image,ImageDraw,ImageFont
os.chdir(sys.argv[1]); lo,hi=int(sys.argv[2]),int(sys.argv[3]); out=sys.argv[4]
jobs=json.load(open('jobs.json'))
sel=[j for j in jobs if lo<=j[2]<=hi] if lo>=0 else [j for j in jobs if j[2]<0]
try: font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',18)
except: font=ImageFont.load_default()
C=3 if lo>=0 else 5; TW,TH=640,360
rows=(len(sel)+C-1)//C
S=Image.new('RGB',(C*(TW+6),rows*(TH+6)),'white'); dr=ImageDraw.Draw(S)
for k,(n,t,i) in enumerate(sel):
    if not os.path.exists(f'f/{n}.jpg'): continue
    im=Image.open(f'f/{n}.jpg').resize((TW,TH)); x,y=(k%C)*(TW+6),(k//C)*(TH+6); S.paste(im,(x,y))
    lab=f'{n} {int(t//60):02d}:{t%60:05.2f}'; dr.rectangle([x,y,x+260,y+24],fill='black'); dr.text((x+4,y+2),lab,fill='yellow',font=font)
S.save(out,quality=85)
