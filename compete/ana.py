import json,re,statistics as st
B=json.load(open('bench_ch.json'))
def num(s):
    m=re.fullmatch(r'(?:조회수\s*)?([\d.,]+)\s*(천|만|억)?회?',(s or '').strip())
    return float(m.group(1).replace(',',''))*{'천':1e3,'만':1e4,'억':1e8}.get(m.group(2),1) if m else None
def views(meta):
    for p in meta:
        n=num(p)
        if n is not None: return n
    return 0
def age_days(meta):
    for p in meta:
        m=re.search(r'(\d+)\s*(분|시간|일|주|개월|년)\s*전',p)
        if m: return int(m.group(1))*{'분':0,'시간':0,'일':1,'주':7,'개월':30,'년':365}[m.group(2)]
    return None
def secs(d):
    p=[int(x) for x in d.split(':')] if re.fullmatch(r'[\d:]+',d or '') else []
    s=0
    for x in p: s=s*60+x
    return s
rows=[]
for cid,c in B.items():
    if cid=='UCSNT-TsvhptVyD63_3yn2yg': continue
    rec=c['recent'][:30]
    vs=[views(x['meta']) for x in rec]; ages=[age_days(x['meta']) for x in rec]; durs=[secs(x['dur']) for x in rec if secs(x['dur'])]
    med=st.median(vs)
    last30=sum(1 for a in ages if a is not None and a<=30)
    span=max(a for a in ages if a is not None) or 1
    perweek=round(30/span*7,1) if span else None
    out=[(x['title'],views(x['meta'])) for x in rec if views(x['meta'])>=3*med]
    sh=[num(s.get('views','').replace('조회수','').strip()) for s in c['shorts'] if isinstance(s,dict) and 'views' in s]
    sh=[x for x in sh if x]
    pop=c.get('popular',[])[:15]
    popv=[views(x['meta']) for x in pop]
    rows.append(dict(ch=c['title'],subs=c['subs'],med=med,per_week=perweek,last30=last30,span=span,dur_med=round(st.median(durs)/60,1) if durs else None,
        dur_rng=(round(min(durs)/60,1),round(max(durs)/60,1)) if durs else None, n_short=len(sh),short_med=st.median(sh) if sh else None,
        outliers=len(out), top=[(x['title'],x['meta'][0] if x['meta'] else '',x['dur']) for x in pop[:5]]))
json.dump(rows,open('ana1.json','w'),ensure_ascii=False,indent=1)
for r in rows:
    print(f"## {r['ch']} {r['subs']} | 최근30 중앙 {r['med']:.0f} | 주당 {r['per_week']} (30개={r['span']}일) | 30일내 {r['last30']} | 길이 중앙 {r['dur_med']}분 {r['dur_rng']} | 쇼츠 {r['n_short']}개 중앙 {r['short_med']} | 3배이상 {r['outliers']}")
    for t in r['top']: print('    ',t[1],t[2],t[0][:60])
