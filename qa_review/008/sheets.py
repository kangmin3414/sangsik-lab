import json,os,sys
from PIL import Image, ImageDraw, ImageFont
E='/tmp/claude-0/-home-claude/8ea42618-92c7-5880-934a-1a398f438784/scratchpad/zhuangzi5/'
L=json.load(open(E+'timeline.json'))['lines']; D=576.79
items=[]
for t in [0,0.5,1.0,1.5]: items.append(('start',t))
for l in L:
    for fr in (0.15,0.5,0.9): items.append((str(l['i']), l['t0']+fr*(l['t1']-l['t0'])))
for t in [D-2,D-1.5,D-1,D-0.1]: items.append(('end',t))
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',18)
cols=4; per=16; W=480; H=270
a,b=int(sys.argv[1]),int(sys.argv[2])
for s in range(a,b,per):
    chunk=[k for k in range(s,min(s+per,len(items))) if os.path.exists(f'f/{k:03d}.jpg')]
    if not chunk: continue
    rows=(len(chunk)+cols-1)//cols
    S=Image.new('RGB',(cols*(W+6),rows*(H+6)),'white')
    for n,k in enumerate(chunk):
        im=Image.open(f'f/{k:03d}.jpg').resize((W,H)); d=ImageDraw.Draw(im)
        lab,t=items[k]; txt=f'L{lab} {int(t//60):02d}:{t%60:05.2f}'
        d.rectangle([0,0,190,24],fill='black'); d.text((4,2),txt,fill='yellow',font=font)
        S.paste(im,((n%cols)*(W+6),(n//cols)*(H+6)))
    S.save(f'cs_{s//per:02d}.jpg',quality=85)
json.dump(items,open('items.json','w'))
