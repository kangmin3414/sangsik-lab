import sys, os
from PIL import Image
import numpy as np
F=sys.argv[1]
step=int(sys.argv[2]) if len(sys.argv)>2 else 12
files=sorted(os.listdir(F))
n=len(files)
prev=None
for i in range(0,n,step):
    im=np.asarray(Image.open(os.path.join(F,'f%05d.jpg'%i)).convert('L'))
    band=im[881:896,:]
    dark=(band<50)
    cols=np.where(dark.any(axis=0))[0]
    cnt=dark.sum()
    if cnt>30:
        # group columns
        groups=[]
        s=cols[0];p=cols[0]
        for c in cols[1:]:
            if c-p>20:
                groups.append((s,p));s=c
            p=c
        groups.append((s,p))
        # lowest dark row in 880-940 for each group
        info=[]
        for a,b in groups:
            sub=im[870:960,a:b+1]<50
            rows=np.where(sub.any(axis=1))[0]
            info.append((int(a),int(b),int(870+rows.max())))
        t=i/24
        print('%5d %d:%04.1f cnt=%d %s'%(i,int(t//60),t%60,cnt,info))
