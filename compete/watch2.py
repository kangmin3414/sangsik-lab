import json,re,time,urllib.error
from watch import one
B=json.load(open('bench_ch.json'))
try: W=json.load(open('watch2.json'))
except Exception: W={}
vids=[]
for cid,c in B.items():
    for x in c['recent'][:12]:
        if x['id'] and x['id'] not in W: vids.append(x['id'])
print('todo',len(vids),flush=True)
time.sleep(90)
fails=0
for i,v in enumerate(vids):
    vid,r=one(v)
    if 'err' in r and '429' in r['err']:
        fails+=1; print('429 at',i,flush=True); time.sleep(120*fails)
        if fails>5: break
        vid,r=one(v)
    if 'err' not in r: W[vid]=r; fails=max(0,fails-1)
    if i%20==0:
        json.dump(W,open('watch2.json','w'),ensure_ascii=False); print(i,len(W),flush=True)
    time.sleep(3)
json.dump(W,open('watch2.json','w'),ensure_ascii=False); print('done',len(W),flush=True)
