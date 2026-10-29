import json,re
from yt import get,initdata,walk
from deep import lockups,ytcfg,browse
def views(meta):
    for p in meta:
        m=re.fullmatch(r'(?:조회수\s*)?([\d.,]+)\s*(천|만|억)?회?',p.strip())
        if m: return float(m.group(1).replace(',',''))*{'천':1e3,'만':1e4,'억':1e8}.get(m.group(2),1)
    return 0
B=json.load(open('bench_ch.json'))
for cid in ['UCUOQddfF7LwZBPglW3nEzPQ','UCjDudhyRiFOZjLpti74tV6w','UCBFiFvoLLilYjJH9NDVEAww']:
    html=get('https://www.youtube.com/channel/'+cid+'/videos'); d=initdata(html); key,ver=ytcfg(html)
    allv=lockups(d)
    def nexttok(x):
        for c in walk(x,'continuationItemRenderer'):
            t=next(walk(c,'token'),None)
            if t: return t
        return None
    tok=nexttok(d)
    for _ in range(8):
        if not tok: break
        r=browse(tok,key,ver); allv+=lockups(r); tok=nexttok(r)
    allv.sort(key=lambda x:-views(x['meta']))
    B[cid]['popular']=allv[:30]; B[cid]['n_scanned']=len(allv)
    print(B[cid]['title'],len(allv),allv[0]['title'],allv[0]['meta'])
json.dump(B,open('bench_ch.json','w'),ensure_ascii=False,indent=1)
print(B['UCK2n3rqhkDM4zRhx2dC7weA'] if 'UCK2n3rqhkDM4zRhx2dC7weA' in B else '', B['UCmkpesc582q0FCTRjMlVRxQ']['recent'][0], B['UCmkpesc582q0FCTRjMlVRxQ']['popular'][0])
