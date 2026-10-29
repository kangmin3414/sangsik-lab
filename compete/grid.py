import json,io,urllib.request
from PIL import Image,ImageDraw,ImageFont
B=json.load(open('bench_ch.json'))
pick=[('UCgpwML6hw_FJkAc7xrv4BXA',0),('UCWSkVDRzaeu_jrb1MN7y1iw',0),('UCAvsPirUHJoAQSYmt3_HrUQ',0),('UCBCEvvfy9EOoo_l5nX6cPAw',0),
      ('UCBFiFvoLLilYjJH9NDVEAww',0),('UC4uaNGU3_HMfJTjafd0yeew',0),('UCN1fp_n3guapCZpOyAfMDcg',0),('UCmC7fFX8WJt0EqH0Np1A4Pw',0),
      ('UCjDudhyRiFOZjLpti74tV6w',0),('UCQKZQFd7AfgHOYoui6OE9Ew',2),('UCitWd937oEliS7hDpgV1VuQ',0),('UCUOQddfF7LwZBPglW3nEzPQ',4)]
f1=ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc',20)
w,h=400,225; cols=4; pad=14; cap=34
img=Image.new('RGB',(cols*w+(cols+1)*pad,3*(h+cap)+4*pad),'white'); d=ImageDraw.Draw(img)
meta=[]
for i,(cid,k) in enumerate(pick):
    x=B[cid]['popular'][k]
    b=urllib.request.urlopen('https://i.ytimg.com/vi/%s/hqdefault.jpg'%x['id'],timeout=20).read()
    im=Image.open(io.BytesIO(b)).convert('RGB'); W0,H0=im.size; im=im.crop((0,(H0-W0*9//16)//2,W0,(H0-W0*9//16)//2+W0*9//16)).resize((w,h))
    r,c=divmod(i,cols); X=pad+c*(w+pad); Y=pad+r*(h+cap+pad)
    img.paste(im,(X,Y))
    v=x['meta'][0].replace('조회수 ','').replace('회','') if x['meta'] else ''
    d.text((X,Y+h+6),f"{B[cid]['title'].split(' |')[0][:10]} · {v}",fill='black',font=f1)
    meta.append((B[cid]['title'],x['title'],v,x['id']))
img.save('thumb_grid.jpg',quality=85); print(img.size)
for m in meta: print(m)
