import json,re,statistics as st
from datetime import datetime,timedelta
from collections import Counter
R=json.load(open('rss.json'))
KST=timedelta(hours=9); WD='월화수목금토일'
allh=Counter(); allwd=Counter(); rows=[]
for cid,c in R.items():
    es=c.get('entries',[])
    lf=[e for e in es if '/shorts/' not in e['link']]; sh=[e for e in es if '/shorts/' in e['link']]
    ts=[datetime.fromisoformat(e['pub'])+KST for e in lf]
    hrs=Counter(t.hour for t in ts); wds=Counter(WD[t.weekday()] for t in ts)
    if cid!='UCSNT-TsvhptVyD63_3yn2yg':
        allh.update(t.hour for t in ts); allwd.update(WD[t.weekday()] for t in ts)
    gaps=[(ts[i]-ts[i+1]).total_seconds()/86400 for i in range(len(ts)-1)]
    ds=[e['desc'] for e in lf]
    f=lambda p: sum(1 for d in ds if re.search(p,d))
    rows.append(dict(ch=c['title'],n_lf=len(lf),n_sh=len(sh),gap_med=round(st.median(gaps),1) if gaps else None,
        hours=hrs.most_common(3),wd=wds.most_common(3),minutes=Counter(t.minute for t in ts).most_common(2),
        desc_len=int(st.median(len(d) for d in ds)) if ds else 0,chap=f(r'(?m)^\s*\(?\d{1,2}:\d{2}'),tags=round(st.median(len(re.findall(r'#\S+',d)) for d in ds),1) if ds else 0,
        src=f(r'참고|출처|논문|연구|References|Source|도서|책'),sub=f(r'구독'),ai=f(r'AI|인공지능|생성'),link=f(r'https?://'),
        last=str(ts[0])[:16] if ts else ''))
for r in rows: print(r)
print('시간대(KST) 전체:',sorted(allh.items()))
print('요일 전체:',allwd.most_common())
json.dump(dict(rows=rows,hours=sorted(allh.items()),wd=allwd.most_common()),open('rssana.json','w'),ensure_ascii=False)
