import json,sys,numpy as np,soundfile as sf,librosa
from concurrent.futures import ProcessPoolExecutor
MALE={'Puck','Charon','Schedar','Umbriel','Orus','Alnilam','Sadaltager','Algenib','Achird','Enceladus','Rasalgethi','Sadachbia','Iapetus','Fenrir','Algieba','Zubenelgenubi','Alnilam'}
def vname(st,v):
    x=st['voices'].get(v); return x['name'] if isinstance(x,dict) else x
def work(d):
    st=json.load(open(d+'/style38.json')); tl=json.load(open(d+'/timeline.json'))
    y,sr=sf.read(d+'/voice.wav'); y=y.mean(1) if y.ndim>1 else y
    y=librosa.resample(y,orig_sr=sr,target_sr=16000); sr=16000
    out=[]
    for l in tl['lines']:
        for s in (l.get('segs') or []):
            a,b=int(s['t0']*sr),int(s['t1']*sr)
            if b-a<sr*0.3: continue
            f0,vf,_=librosa.pyin(y[a:b],fmin=65,fmax=400,sr=sr,frame_length=1024)
            f=f0[~np.isnan(f0)]
            if len(f)<5: continue
            out.append(dict(ep=d,i=l['i'],v=s['v'],voice=vname(st,s['v']),male=vname(st,s['v']) in MALE,f0=float(np.median(f)),t0=s['t0'],text=s['text'][:40]))
    return out
if __name__=='__main__':
    eps=sys.argv[1:]
    with ProcessPoolExecutor(4) as ex: res=[r for o in ex.map(work,eps) for r in o]
    json.dump(res,open('qa_review/f0.json','w'),ensure_ascii=False)
    import collections
    by=collections.defaultdict(list)
    for r in res: by[(r['ep'],r['v'],r['voice'])].append(r['f0'])
    for k,v in sorted(by.items()): print(k, 'n=',len(v),'median',round(np.median(v)),'min',round(min(v)),'max',round(max(v)))
