from PIL import Image, ImageFilter, ImageDraw, ImageFont, ImageEnhance
import math
F='/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'
def base(src,box,ell):
    im=Image.open(src).convert('RGB')
    c=im.crop(box).resize((1280,720),Image.LANCZOS); sx=1280/(box[2]-box[0]); sy=720/(box[3]-box[1])
    e=[(ell[0]-box[0])*sx,(ell[1]-box[1])*sy,(ell[2]-box[0])*sx,(ell[3]-box[1])*sy]
    bg=ImageEnhance.Color(ImageEnhance.Brightness(c.filter(ImageFilter.GaussianBlur(18))).enhance(0.32)).enhance(0.5)
    m=Image.new('L',(1280,720),0); ImageDraw.Draw(m).ellipse(e,fill=255); m=m.filter(ImageFilter.GaussianBlur(35))
    return Image.composite(ImageEnhance.Contrast(c).enhance(1.1),bg,m)
def txt(d,xy,t,sz,col,bar=None):
    f=ImageFont.truetype(F,sz,index=0); x,y=xy
    if bar:
        bb=d.textbbox((x,y),t,font=f); d.rectangle((bb[0]-14,bb[1]-10,bb[2]+14,bb[3]+12),fill=bar)
    d.text((x,y),t,font=f,fill=col,stroke_width=0 if bar else sz//10,stroke_fill='black')
    return d.textbbox((x,y),t,font=f)
def arrow(d,p0,p1,w=18,col='#FF2D2D'):
    d.line([p0,p1],fill='black',width=w+10); d.line([p0,p1],fill=col,width=w)
    a=math.atan2(p1[1]-p0[1],p1[0]-p0[0]); L=55
    pts=[p1,(p1[0]-L*math.cos(a-0.5),p1[1]-L*math.sin(a-0.5)),(p1[0]-L*math.cos(a+0.5),p1[1]-L*math.sin(a+0.5))]
    d.polygon(pts,fill=col,outline='black')
A='thumbD/ai/'
# 데카르트
o=base(A+'descartes1.png',(230,0,1750,855),(950,120,1750,1080)); d=ImageDraw.Draw(o)
txt(d,(44,150),'똑똑해도',110,'white'); txt(d,(44,290),'속는다',175,'#111',bar='#FFE14A')
txt(d,(52,505),'하버드생 절반도',62,'#FF6B6B')
o.save('thumbS/T_데카르트.jpg',quality=92)
# 장자
o=base(A+'zhuangzi1.png',(560,150,1920,915),(850,250,1800,950)); d=ImageDraw.Draw(o)
txt(d,(44,130),'쓸모없어서',112,'white'); txt(d,(44,265),'살아남았다',128,'#111',bar='#8CFF7A'); txt(d,(52,440),'2,300년 전 반전',62,'#FFE14A')
o.save('thumbS/T_장자.jpg',quality=92)
# 소크라테스
o=base(A+'socrates1.png',(330,200,1830,1044),(900,240,1700,1080)); d=ImageDraw.Draw(o)
txt(d,(44,140),'"모르겠어요"',100,'white'); txt(d,(44,275),'했더니?',170,'#111',bar='#FFE14A'); txt(d,(52,490),'연구 결과는 반대',66,'#FF6B6B')
o.save('thumbS/T_소크라테스.jpg',quality=92)
# 붓다
o=base(A+'buddha1.png',(200,120,1640,930),(850,180,1600,1050)); d=ImageDraw.Draw(o)
txt(d,(44,130),'깨어 있는 시간',84,'white'); txt(d,(44,250),'46.9%',150,'#111',bar='#FFB26B'); txt(d,(48,450),'딴생각 중',105,'white')
o.save('thumbS/T_붓다.jpg',quality=92)
from PIL import Image as I
ims=[I.open(f'thumbS/T_{n}.jpg').resize((640,360)) for n in ['데카르트','장자','소크라테스','붓다']]
W=I.new('RGB',(1280,720));[W.paste(im,((i%2)*640,(i//2)*360)) for i,im in enumerate(ims)];W.save('thumbS/grid2.jpg',quality=85)
