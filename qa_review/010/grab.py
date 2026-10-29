import json, subprocess, sys, os
from concurrent.futures import ThreadPoolExecutor
B=sys.argv[1]; Q=sys.argv[2]
V=os.path.join(B,'상식실험실_실험010_붓다처럼지금여기에살기_v5.mp4')
L=json.load(open(os.path.join(B,'timeline.json')))['lines']
items=[]
for l in L:
    for p in (0.15,0.5,0.9):
        t=l['t0']+p*(l['t1']-l['t0']); items.append((f"L{l['i']} {int(t//60):02d}:{t%60:05.2f}",t))
for t in (0.1,1.0,1.9,533.8,534.8,535.6): items.append((f"END {int(t//60):02d}:{t%60:05.2f}" if t>100 else f"START {t}",t))
items.sort(key=lambda x:x[1])
def g(k):
    lab,t=items[k]; p=f"{Q}/f/{k:03d}.jpg"
    subprocess.run(['ffmpeg','-v','error','-y','-ss',f'{t:.3f}','-i',V,'-frames:v','1','-q:v','3',p],check=True)
with ThreadPoolExecutor(3) as ex: list(ex.map(g,range(len(items))))
json.dump(items,open(f"{Q}/items.json",'w'),ensure_ascii=False)
print(len(items))
