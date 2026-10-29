import json,subprocess,sys,numpy as np
from PIL import Image
S=sys.argv[1]
V=S+'/socrates3/상식실험실_실험009_소크라테스처럼질문하며살기_v5.mp4'
jobs=json.load(open('jobs.json'))
want={}
for n,t,_ in jobs:
    want.setdefault(min(12690,int(round(t*24))),[]).append(n)
W,H=1920,1080; FS=W*H*3
p=subprocess.Popen(['ffmpeg','-v','error','-i',V,'-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE,bufsize=FS*2)
small=[]; i=0
while True:
    b=p.stdout.read(FS)
    if len(b)<FS: break
    a=np.frombuffer(b,np.uint8).reshape(H,W,3)
    if i in want:
        im=Image.fromarray(a)
        for n in want[i]: im.save(f'f/{n}.jpg',quality=90)
    small.append(a[::8,::8].mean(axis=2).astype(np.uint8))
    i+=1
np.save('small.npy',np.stack(small))
print('frames',i)
