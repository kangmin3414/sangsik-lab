import subprocess,numpy as np,json
E='/tmp/claude-0/-home-claude/8ea42618-92c7-5880-934a-1a398f438784/scratchpad/zhuangzi5/'
V=E+'상식실험실_실험008_장자처럼남의잣대내려놓기_v7.mp4'
W,H=160,90
p=subprocess.Popen(['ffmpeg','-v','error','-i',V,'-vf',f'scale={W}:{H}','-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE)
prev=None;res=[];i=0
while True:
    b=p.stdout.read(W*H*3)
    if len(b)<W*H*3:break
    f=np.frombuffer(b,np.uint8).reshape(H,W,3)[:68].astype(np.int16)  # drop bottom subtitle band (~25%)
    m=float(f.mean()); d=float(np.abs(f-prev).mean()) if prev is not None else 0
    res.append((i,m,d)); prev=f;i+=1
np.save('diffs.npy',np.array(res))
print(i)
