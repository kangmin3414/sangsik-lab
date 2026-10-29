exec(open('thumbS/mk3.py').read().split("A='thumbD/ai/'")[0])
A='thumbD/ai/'
def make(src,box,ell,l1,l2,l3,col,out):
    o=base(A+src,box,ell); d=ImageDraw.Draw(o)
    txt(d,(44,135),l1,96,'white'); txt(d,(44,262),l2,120,'#111',bar=col); txt(d,(52,445),l3,62,col)
    o.save(out,quality=92)
make('descartes1.png',(230,0,1750,855),(950,120,1750,1080),'남의 말,','잘 믿는다면','400년 전 의심법','#FFE14A','thumbS/U_데카르트.jpg')
make('zhuangzi1.png',(560,150,1920,915),(850,250,1800,950),'남과 비교하다','지쳤다면','장자의 처방','#8CFF7A','thumbS/U_장자.jpg')
make('socrates1.png',(330,200,1830,1044),(900,240,1700,1080),'아는 척하느라','피곤하다면','소크라테스의 질문','#FFE14A','thumbS/U_소크라테스.jpg')
make('buddha1.png',(200,120,1640,930),(850,180,1600,1050),'마음이 늘','딴 데 있다면','붓다의 13분','#FFB26B','thumbS/U_붓다.jpg')
from PIL import Image as I
ims=[I.open(f'thumbS/U_{n}.jpg').resize((640,360)) for n in ['데카르트','장자','소크라테스','붓다']]
W=I.new('RGB',(1280,720));[W.paste(im,((i%2)*640,(i//2)*360)) for i,im in enumerate(ims)];W.save('thumbS/grid3.jpg',quality=85)
