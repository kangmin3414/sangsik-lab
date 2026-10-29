exec(open('thumbS/mk4.py').read().split("make('descartes1.png'")[0])
B=(0,0,1920,1080); E_=(1000,60,1720,1080)
make('stoic1.png',B,E_,'작은 일에도','흔들린다면','로마 황제의 습관','#FFE14A','thumbS/U_스토아.jpg')
o=base(A+'stoic1.png',B,E_); d=ImageDraw.Draw(o)
txt(d,(44,140),'걱정의 91%는',96,'white'); txt(d,(44,270),'안 일어난다',125,'#111',bar='#7FD6FF'); txt(d,(52,450),'그런데 왜 불안할까?',60,'#FF6B6B')
o.save('thumbS/T_스토아.jpg',quality=92)
from PIL import Image as I
ims=[I.open(f).resize((640,360)) for f in ['thumbS/U_스토아.jpg','thumbS/T_스토아.jpg']]
W=I.new('RGB',(1280,360));[W.paste(im,(i*640,0)) for i,im in enumerate(ims)];W.save('thumbS/grid_스토아.jpg',quality=88)
