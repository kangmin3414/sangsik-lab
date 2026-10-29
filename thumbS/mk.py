from PIL import Image, ImageFilter, ImageDraw, ImageFont, ImageEnhance
import sys
F='/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'
def mk(src,box,face,lines,out,textx=60):
    im=Image.open(src).convert('RGB'); W,H=im.size
    s=W/1280; box=[int(v*s) for v in box]; face=[int(v*s) for v in face]
    # hide old text band by cropping above it
    c=im.crop(box).resize((1280,720),Image.LANCZOS)
    fx=[(face[0]-box[0])*1280/(box[2]-box[0]),(face[1]-box[1])*720/(box[3]-box[1]),(face[2]-box[0])*1280/(box[2]-box[0]),(face[3]-box[1])*720/(box[3]-box[1])]
    bg=ImageEnhance.Brightness(c.filter(ImageFilter.GaussianBlur(14))).enhance(0.45)
    m=Image.new('L',(1280,720),0); d=ImageDraw.Draw(m); d.ellipse(fx,fill=255); m=m.filter(ImageFilter.GaussianBlur(40))
    o=Image.composite(c,bg,m); d=ImageDraw.Draw(o)
    y=150
    for t,col,sz in lines:
        f=ImageFont.truetype(F,sz,index=0)
        d.text((textx,y),t,font=f,fill=col,stroke_width=max(8,sz//12),stroke_fill='black'); y+=int(sz*1.12)
    o.save(out,quality=92)
mk('abthumbD/D_데카르트_1.jpg',(380,0,1280,506),(560,40,1080,520),[('속보,',"white",150),('10초만',"#FFE14A",190),('의심',"#FFE14A",190)],'thumbS/S_데카르트.jpg')
mk('abthumbD/D_장자_1.jpg',(560,0,1280,405),(660,40,1200,430),[('쓸모',"white",170),('없어도',"white",170),('괜찮아',"#8CFF7A",170)],'thumbS/S_장자.jpg')
mk('abthumbD/D_소크라테스_1.jpg',(500,60,1280,499),(660,170,1160,560),[('모르면',"white",160),('물어봐',"#FFE14A",190)],'thumbS/S_소크라테스.jpg')
mk('abthumbD/D_붓다_1.jpg',(560,60,1280,465),(840,120,1280,520),[('밥 먹을 땐',"white",140),('밥만',"#FFB26B",200)],'thumbS/S_붓다.jpg')
