import json
from PIL import Image, ImageDraw, ImageFont
items=json.load(open('items.json'))
try: F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',18)
except: F=None
cols,W,H=4,480,270; per=16
for s in range(0,len(items),per):
    ch=items[s:s+per]; rows=(len(ch)+cols-1)//cols
    S=Image.new('RGB',(cols*(W+6),rows*(H+6)),'white')
    for k,(lab,t,fr) in enumerate(ch):
        im=Image.open(f'f/{s+k+1:03d}.jpg').resize((W,H)); d=ImageDraw.Draw(im)
        d.rectangle([0,0,190,24],fill='black'); d.text((4,2),lab,fill='yellow',font=F)
        S.paste(im,((k%cols)*(W+6),(k//cols)*(H+6)))
    S.save(f'sheet_{s//per:02d}.jpg',quality=85)
print('ok')
