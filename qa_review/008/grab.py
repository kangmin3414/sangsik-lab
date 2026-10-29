import json,subprocess,os,sys
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageDraw, ImageFont
E='/tmp/claude-0/-home-claude/8ea42618-92c7-5880-934a-1a398f438784/scratchpad/zhuangzi5/'
V=E+'상식실험실_실험008_장자처럼남의잣대내려놓기_v7.mp4'
L=json.load(open(E+'timeline.json'))['lines']; D=576.79
items=[]
for t in [0,0.5,1.0,1.5]: items.append(('start',t))
for l in L:
    for fr in (0.15,0.5,0.9): items.append((str(l['i']), l['t0']+fr*(l['t1']-l['t0'])))
    # gap after line
for t in [D-2,D-1.5,D-1,D-0.1]: items.append(('end',t))
def grab(k):
    lab,t=items[k]; p=f'f/{k:03d}.jpg'
    if not os.path.exists(p):
        subprocess.run(['ffmpeg','-v','error','-y','-ss',f'{t:.3f}','-i',V,'-frames:v','1','-q:v','3',p],check=False)
        if not os.path.exists(p): subprocess.run(["ffmpeg","-v","error","-y","-ss",f"{t:.3f}","-i",V,"-frames:v","1","-q:v","3",p])
    return p
with ThreadPoolExecutor(3) as ex: paths=list(ex.map(grab,range(len(items))))
try: font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',16)
except: font=None
cols=4; per=20; W=480; H=270
for s in range(0,len(items),per):
    chunk=list(range(s,min(s+per,len(items))))
    rows=(len(chunk)+cols-1)//cols
    S=Image.new('RGB',(cols*(W+6),rows*(H+6)),'white')
    for n,k in enumerate(chunk):
        im=Image.open(paths[k]).resize((W,H)); d=ImageDraw.Draw(im)
        lab,t=items[k]; txt=f'L{lab} {int(t//60):02d}:{t%60:05.2f}'
        d.rectangle([0,0,170,22],fill='black'); d.text((4,2),txt,fill='yellow',font=font)
        S.paste(im,((n%cols)*(W+6),(n//cols)*(H+6)))
    S.save(f'sheet_{s//per:02d}.jpg',quality=85)
json.dump(items,open('items.json','w'))
print(len(items))
