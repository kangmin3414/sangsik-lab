from PIL import Image, ImageFilter, ImageDraw, ImageFont, ImageEnhance
F='/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'
def mk(src,box,ell,lines,out):
    im=Image.open(src).convert('RGB')
    c=im.crop(box).resize((1280,720),Image.LANCZOS); sx=1280/(box[2]-box[0]); sy=720/(box[3]-box[1])
    e=[(ell[0]-box[0])*sx,(ell[1]-box[1])*sy,(ell[2]-box[0])*sx,(ell[3]-box[1])*sy]
    bg=ImageEnhance.Color(ImageEnhance.Brightness(c.filter(ImageFilter.GaussianBlur(18))).enhance(0.38)).enhance(0.6)
    m=Image.new('L',(1280,720),0); ImageDraw.Draw(m).ellipse(e,fill=255); m=m.filter(ImageFilter.GaussianBlur(35))
    o=Image.composite(ImageEnhance.Contrast(c).enhance(1.08),bg,m); d=ImageDraw.Draw(o)
    tot=sum(int(sz*1.15) for _,_,sz in lines); y=(720-tot)//2-10
    for t,col,sz in lines:
        f=ImageFont.truetype(F,sz,index=0)
        d.text((48,y),t,font=f,fill=col,stroke_width=sz//10,stroke_fill='black'); y+=int(sz*1.15)
    o.save(out,quality=92)
A='thumbD/ai/'
mk(A+'descartes1.png',(230,0,1750,855),(950,120,1750,1080),[('속보 볼 땐',"white",120),('10초만!',"#FFE14A",170)],'thumbS/S_데카르트.jpg')
mk(A+'zhuangzi1.png',(560,150,1920,915),(850,250,1800,950),[('쓸모없어도',"white",118),('괜찮아',"#8CFF7A",170)],'thumbS/S_장자.jpg')
mk(A+'socrates1.png',(330,200,1830,1044),(900,240,1700,1080),[('모르면',"white",140),('손 들기!',"#FFE14A",160)],'thumbS/S_소크라테스.jpg')
mk(A+'buddha1.png',(200,120,1640,930),(850,180,1600,1050),[('밥 먹을 땐',"white",118),('밥만!',"#FFB26B",190)],'thumbS/S_붓다.jpg')
from PIL import Image as I
ims=[I.open(f'thumbS/S_{n}.jpg').resize((640,360)) for n in ['데카르트','장자','소크라테스','붓다']]
W=I.new('RGB',(1280,720));[W.paste(im,((i%2)*640,(i//2)*360)) for i,im in enumerate(ims)];W.save('thumbS/grid.jpg',quality=85)
# small mobile-size preview
W.resize((640,360)).save('thumbS/grid_small.jpg',quality=85)
