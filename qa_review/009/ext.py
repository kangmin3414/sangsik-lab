import json,subprocess,sys,os
S=sys.argv[1]
V=S+'/socrates3/상식실험실_실험009_소크라테스처럼질문하며살기_v5.mp4'
d=json.load(open(S+'/socrates3/timeline.json'))
jobs=[]
for l in d['lines']:
    for p in (0.15,0.5,0.9):
        t=l['t0']+(l['t1']-l['t0'])*p
        jobs.append((f"L{l['i']:02d}_{int(p*100):02d}",t,l['i']))
for t in (0,0.5,1,1.5,2): jobs.append((f"S_{t}",t,-1))
D=d['duration']
for t in (D-2,D-1.5,D-1,D-0.5,D-0.05): jobs.append((f"E_{t:.2f}",t,-2))
json.dump(jobs,open('jobs.json','w'))
from concurrent.futures import ThreadPoolExecutor
def run(j):
    n,t,_=j
    subprocess.run(['ffmpeg','-v','error','-y','-ss',f'{t:.3f}','-i',V,'-frames:v','1','-q:v','3',f'f/{n}.jpg'])
with ThreadPoolExecutor(8) as ex: list(ex.map(run,jobs))
