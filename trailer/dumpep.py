import json, sys, importlib.util, os
def txt_of(e):
    out=[]
    def walk(x):
        if isinstance(x,str):
            if any('가'<=c<='힣' for c in x) and len(x)>3: out.append(x)
        elif isinstance(x,(list,tuple)):
            for y in x: walk(y)
        elif isinstance(x,dict):
            for k,v in x.items():
                if k in ('segs','text','sub','lines'): walk(v)
    walk(e)
    return out
for d in sys.argv[1:]:
    spec=importlib.util.spec_from_file_location('s_'+d, f'{d}/script.py'); m=importlib.util.module_from_spec(spec)
    cwd=os.getcwd(); os.chdir(d)
    try: spec.loader.exec_module(m)
    finally: os.chdir(cwd)
    S=m.S; TL=json.load(open(f'{d}/timeline.json'))['lines']
    print('=====',d,len(S),len(TL))
    for i,e in enumerate(S):
        t=TL[i]['t0'] if i<len(TL) else -1
        tx=txt_of(e)
        # dedupe: prefer first (subtitle) strings
        s=' / '.join(dict.fromkeys(tx))
        print(i, round(t,1), (e[0] if isinstance(e,(list,tuple)) else ''), s[:150])
