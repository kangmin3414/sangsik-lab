import subprocess, numpy as np, json
D='/tmp/claude-0/-home-claude/8ea42618-92c7-5880-934a-1a398f438784/scratchpad/descartes4/'
V=D+'상식실험실_실험007_데카르트처럼모든걸의심하기_v7.mp4'
w,h=160,90
p=subprocess.Popen(['ffmpeg','-v','error','-i',V,'-vf',f'scale={w}:{h}','-f','rawvideo','-pix_fmt','gray','-'],stdout=subprocess.PIPE)
fr=[]
while True:
    b=p.stdout.read(w*h)
    if len(b)<w*h: break
    fr.append(np.frombuffer(b,np.uint8).reshape(h,w)[:72].astype(np.float32))  # drop bottom 20% subtitle band
F=np.stack(fr); np.save('gray.npy',F)
d=np.abs(np.diff(F,axis=0)).mean(axis=(1,2))
mean=F.mean(axis=(1,2)); std=F.std(axis=(1,2))
json.dump({'d':d.tolist(),'mean':mean.tolist(),'std':std.tolist()},open('diff.json','w'))
print(len(fr))
