import json,sys,io,urllib.request
from concurrent.futures import ThreadPoolExecutor
from PIL import Image,ImageDraw,ImageFont
from chk import chk
ids=json.load(open(sys.argv[1])); out=sys.argv[2]
R=json.load(open('chk.json'))
need=[i for i in ids if i not in R or not R[i].get('vids')]
if need:
    with ThreadPoolExecutor(6) as ex:
        for cid,v in ex.map(chk,need): R[cid]=v
    json.dump(R,open('chk.json','w'),ensure_ascii=False)
def thumb(vid):
    try:
        b=urllib.request.urlopen('https://i.ytimg.com/vi/%s/mqdefault.jpg'%vid,timeout=20).read()
        return Image.open(io.BytesIO(b)).convert('RGB').resize((224,126))
    except Exception: return Image.new('RGB',(256,144),'gray')
font=ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc',22)
rows=[]
for cid in ids:
    v=R[cid]; vids=[x[0] for x in v.get('vids',[])][:3]
    with ThreadPoolExecutor(4) as ex: ims=list(ex.map(thumb,vids))
    rows.append((f"{v.get('title','')[:16]}  {v.get('subs',0)//1000}K",ims))
W=224*3+10*4; H=len(rows)*(126+36)+10
img=Image.new('RGB',(W,H),'white'); d=ImageDraw.Draw(img)
y=10
for lab,ims in rows:
    d.text((10,y),lab,fill="black",font=font); y+=26
    for i,im in enumerate(ims): img.paste(im,(10+i*234,y))
    y+=132
img.save(out,quality=80); print(out,img.size)
