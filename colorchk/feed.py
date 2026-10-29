import os
from PIL import Image, ImageDraw, ImageFont
SP=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
F=ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc',30)
f2=ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc',20)
names=['스토아','데카르트','장자','소크라테스','붓다','시간','화','엄마수첩']
tw,th,g=300,169,14
def rounded(im,r=14):
    m=Image.new('L',im.size,0); ImageDraw.Draw(m).rounded_rectangle((0,0,*im.size),r,fill=255)
    out=Image.new('RGB',im.size,(15,15,15)); out.paste(im,(0,0),m); return out
def panel(folder,comp,label):
    W=4*tw+5*g; H=60+3*(th+g)+g+40
    p=Image.new('RGB',(W,H),(15,15,15)); d=ImageDraw.Draw(p); d.text((g,12),label,font=F,fill=(241,241,241))
    items=[f'{SP}/{folder}/A_{n}.jpg' for n in names]+[f'{SP}/{folder}/C_{n}.jpg' for n in names[:3]]+[comp]
    for i,f in enumerate(items):
        r,c=divmod(i,4); im=rounded(Image.open(f).convert('RGB').resize((tw,th),Image.LANCZOS))
        p.paste(im,(g+c*(tw+g),60+r*(th+g)))
    d.text((g,H-34),'윗줄 두 줄 = A안 8편 · 셋째 줄 = C안 3편 + 몰아보기',font=f2,fill=(170,170,170))
    return p
a=panel('abthumb',f'{SP}/compile1/_thumb_old.jpg','지금 (유튜브 다크 모드)')
b=panel('abthumb4',f'{SP}/compile1/thumb.jpg','고친 뒤 (유튜브 다크 모드)')
out=Image.new('RGB',(a.width,a.height+b.height+20),(40,40,40)); out.paste(a,(0,0)); out.paste(b,(0,a.height+20))
out.save(f'{SP}/colorchk/썸네일_색수정_다크모드비교.jpg',quality=88); print(out.size)
