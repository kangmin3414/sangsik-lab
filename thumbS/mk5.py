exec(open('thumbS/mk4.py').read().split("make('descartes1.png'")[0])
make('nietzsche1.png',(80,40,1600,895),(950,130,1600,1080),'뭘 위해 사는지','모르겠다면','니체의 질문','#FFE14A','thumbS/U_니체.jpg')
o=base(A+'nietzsche1.png',(80,40,1600,895),(950,130,1600,1080)); d=ImageDraw.Draw(o)
txt(d,(44,140),"'신은 죽었다'",100,'white'); txt(d,(44,275),'진짜 뜻은?',140,'#111',bar='#FFE14A'); txt(d,(52,470),'140년 전 니체의 답',62,'#FF6B6B')
o.save('thumbS/T_니체.jpg',quality=92)
from PIL import Image as I
ims=[I.open(f).resize((640,360)) for f in ['thumbS/U_니체.jpg','thumbS/T_니체.jpg']]
W=I.new('RGB',(1280,360));[W.paste(im,(i*640,0)) for i,im in enumerate(ims)];W.save('thumbS/grid_니체.jpg',quality=88)
