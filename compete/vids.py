import json,sys,time
from yt import get,initdata,walk,txt
r={}
for f in ['r1.json','r2.json']:
    for q,v in json.load(open(f)).items():
        if isinstance(v,list):
            for c in v: r[c['title'].strip()]=c
names=sys.argv[1].split('|')
out={}
for n in names:
    c=r.get(n)
    if not c: print('MISSING',n); continue
    try:
        d=initdata(get('https://www.youtube.com/channel/'+c['id']+'/videos'))
        vs=[]
        for v in walk(d,'videoRenderer'):
            vs.append((txt(v.get('title')),txt(v.get('viewCountText')),txt(v.get('publishedTimeText'))))
        if not vs:
            for v in walk(d,'lockupViewModel'):
                t=v.get('metadata',{}).get('lockupMetadataViewModel',{}).get('title',{}).get('content','')
                vs.append((t,'',''))
        out[n]=dict(subs=c['subs'],id=c['id'],handle=c['handle'],vids=vs[:10])
    except Exception as e: out[n]=str(e)
    time.sleep(0.6)
json.dump(out,open('vids.json','w'),ensure_ascii=False,indent=1)
for n,v in out.items():
    if isinstance(v,str): print('##',n,'ERR',v); continue
    print(f"## {n} {v['subs']}")
    for t,vc,p in v['vids'][:8]: print('   ',t[:60],'|',vc,'|',p)
