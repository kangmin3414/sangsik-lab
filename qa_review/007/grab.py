import json, subprocess, os
D='/tmp/claude-0/-home-claude/8ea42618-92c7-5880-934a-1a398f438784/scratchpad/descartes4/'
V=D+'상식실험실_실험007_데카르트처럼모든걸의심하기_v7.mp4'
L=json.load(open(D+'timeline.json'))['lines']
picks=[]
for l in L:
    for f in (0.15,0.5,0.9):
        picks.append((l['i'],l['t0']+f*(l['t1']-l['t0'])))
for t in (0.0,0.5,1.0,1.5,459.5,460.5,461.5,462.5,463.3):
    picks.append((-1,t))
json.dump(picks,open('picks.json','w'))
import concurrent.futures as cf
def g(p):
    i,t=p; out=f'frames/L{i:02d}_{t:07.2f}.jpg'
    if not os.path.exists(out):
        subprocess.run(['ffmpeg','-v','error','-ss',f'{t:.3f}','-i',V,'-frames:v','1','-q:v','3','-y',out])
    return out
with cf.ThreadPoolExecutor(8) as ex: list(ex.map(g,picks))
print(len(picks))
