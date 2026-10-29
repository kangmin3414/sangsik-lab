import json,numpy as np,soundfile as sf,librosa
from concurrent.futures import ProcessPoolExecutor
MALE={'Puck','Charon','Schedar','Umbriel','Orus','Alnilam','Sadaltager','Algenib','Achird','Enceladus','Rasalgethi','Sadachbia','Iapetus'}
def vname(st,v):
    x=st['voices'].get(v); return x['name'] if isinstance(x,dict) else x
def work(d):
    st=json.load(open(d+'/style38.json')); tl=json.load(open(d+'/timeline.json'))
    y,sr=sf.read(d+'/voice.wav'); y=y.mean(1) if y.ndim>1 else y
    y=librosa.resample(y,orig_sr=sr,target_sr=16000); sr=16000
    out=[]
    for l in tl['lines']:
        for s in (l.get('segs') or []):
            a,b=int(s['t0']*sr),int(s['t1']*sr); seg=y[a:b]
            if len(seg)<sr*0.3: continue
            f0,vf,_=librosa.pyin(seg,fmin=65,fmax=420,sr=sr,frame_length=1024,hop_length=256)
            m=librosa.feature.mfcc(y=seg,sr=sr,n_mfcc=20,hop_length=256)
            n=min(m.shape[1],len(f0)); vmask=~np.isnan(f0[:n])
            if vmask.sum()<5: continue
            mf=m[1:,:n][:,vmask].mean(1)
            f=f0[:n][vmask]
            out.append(dict(ep=d,i=l['i'],v=s['v'],voice=vname(st,s['v']),f0=float(np.median(f)),hi=float((f>185).mean()),mf=mf.tolist(),t0=s['t0'],text=s['text'][:36]))
    return out
if __name__=='__main__':
    eps=['descartes4','zhuangzi5','socrates3','buddha3']
    with ProcessPoolExecutor(4) as ex: R=[r for o in ex.map(work,eps) for r in o]
    X=np.array([r['mf'] for r in R]); mu=X.mean(0); sd=X.std(0)+1e-6; Z=(X-mu)/sd
    fem=np.array([r['voice'] not in MALE for r in R])
    # train simple LDA-like direction: female centroid vs male centroid (using all segs of labelled voices)
    cf=Z[fem].mean(0); cm=Z[~fem].mean(0); w=cf-cm
    score=(Z-(cf+cm)/2)@w/np.linalg.norm(w)
    for r,s in zip(R,score): r['fscore']=float(s); r.pop('mf')
    json.dump(R,open('qa_review/timbre.json','w'),ensure_ascii=False)
    print('female voices mean score',score[fem].mean().round(2),'male mean',score[~fem].mean().round(2))
    print('female min',score[fem].min().round(2))
    for r in sorted(R,key=lambda r:-r['fscore']):
        if r['voice'] in MALE and (r['fscore']>score[fem].min()*0.6 or r['hi']>0.5):
            m,s=divmod(r['t0'],60); print(r['ep'][:4],'L%02d'%r['i'],r['v'],r['voice'],'f0',round(r['f0']),'hi%.2f'%r['hi'],'fs%.2f'%r['fscore'],'%d:%04.1f'%(m,s),r['text'])
