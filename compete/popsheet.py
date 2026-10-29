import json,sys,io,urllib.request
from concurrent.futures import ThreadPoolExecutor
from PIL import Image,ImageDraw,ImageFont
B=json.load(open('bench_ch.json')); ids=json.load(open(sys.argv[1])); out=sys.argv[2]; key=sys.argv[3] if len(sys.argv)>3 else 'popular'
font=ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc',20)
def thumb(vid):
    try:
        b=urllib.request.urlopen('https://i.ytimg.com/vi/%s/mqdefault.jpg'%vid,timeout=20).read()
        return Image.open(io.BytesIO(b)).convert('RGB').resize((256,144))
    except Exception: return Image.new('RGB',(256,144),'gray')
rows=[]
for cid in ids:
    c=B[cid]; vs=[x for x in c.get(key,[]) if x.get('id')][:3]
    with ThreadPoolExecutor(3) as ex: ims=list(ex.map(thumb,[x['id'] for x in vs]))
    lab=c['title'][:14]+'  '+c['subs']+'  | '+'  '.join((x['meta'][0] if x['meta'] else '').replace('조회수 ','').replace('회','') for x in vs)
    rows.append((lab,ims))
W=256*3+10*4; H=len(rows)*(144+34)+10
img=Image.new('RGB',(W,H),'white'); d=ImageDraw.Draw(img); y=8
for lab,ims in rows:
    d.text((10,y),lab,fill='black',font=font); y+=28
    for i,im in enumerate(ims): img.paste(im,(10+i*266,y))
    y+=150
img.save(out,quality=82); print(out,img.size)
