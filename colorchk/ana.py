import json,io,urllib.request,glob,colorsys,os
from PIL import Image
import numpy as np
SP=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
B=json.load(open(f'{SP}/compete/bench_ch.json'))
ids=[]
for cid,c in B.items():
    for x in c.get('popular',[])[:3]: ids.append(x['id'])
def stats(im):
    a=np.asarray(im.convert('RGB').resize((320,180))).astype(float)/255
    L=0.2126*a[...,0]+0.7152*a[...,1]+0.0722*a[...,2]
    mx=a.max(-1); mn=a.min(-1); S=np.where(mx>0,(mx-mn)/np.maximum(mx,1e-6),0)
    dark=(L<0.18).mean()   # share of near-black/navy pixels
    edge=np.concatenate([L[:6].ravel(),L[-6:].ravel(),L[:,:6].ravel(),L[:,-6:].ravel()]).mean()
    return L.mean(),S.mean(),dark,edge
bench=[]
os.makedirs(f'{SP}/colorchk/b',exist_ok=True)
for i in ids:
    p=f'{SP}/colorchk/b/{i}.jpg'
    if not os.path.exists(p):
        try: open(p,'wb').write(urllib.request.urlopen(f'https://i.ytimg.com/vi/{i}/mqdefault.jpg',timeout=15).read())
        except Exception as e: continue
    bench.append(stats(Image.open(p)))
ours={k:[stats(Image.open(f)) for f in sorted(glob.glob(f'{SP}/abthumb/{k}_*.jpg'))] for k in 'ABC'}; ours.update({k+'(수정)':[stats(Image.open(f)) for f in sorted(glob.glob(f'{SP}/abthumb4/{k}_*.jpg'))] for k in 'ABC'})
ours['몰아보기']=[stats(Image.open(f'{SP}/compile1/thumb.jpg'))]
def row(n,v):
    v=np.array(v); print(f'{n:10s} n={len(v):3d}  밝기 {v[:,0].mean():.2f}  채도 {v[:,1].mean():.2f}  어두운면적 {v[:,2].mean()*100:4.0f}%  테두리밝기 {v[:,3].mean():.2f}')
row('벤치마크',bench)
for k,v in ours.items(): row(k,v)
