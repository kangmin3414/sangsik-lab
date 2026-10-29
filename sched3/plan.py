import datetime as dt, json
D=lambda m,d: dt.date(2026,m,d)
LF=[('006',D(10,27)),('007',D(10,30)),('008',D(11,2)),('009',D(11,5)),('010',D(11,8)),('011',D(11,11)),('012',D(11,14))]
lfday={d:e for e,d in LF}
old={D(10,26):['004-3'],D(10,27):['003-1'],D(10,28):['004-1'],D(10,29):['003-5'],D(10,30):['004-5'],
     D(10,31):['005-1','004-2'],D(11,1):['005-6','004-4'],D(11,2):['003-6'],D(11,4):['003-7'],D(11,6):['003-2'],D(11,9):['004-6']}
new={'006':['006v3-%d'%i for i in (1,7,3,5,6,8,2,4)],
     '007':['007v4-%d'%i for i in (1,7,9,2,3,4,5,6,8)],
     '008':['008v4-%d'%i for i in (1,3,9,2,4,5,6,7,8)],
     '009':['009-%d'%i for i in range(1,6)],'010':['010-%d'%i for i in range(1,6)],
     '011':['011-%d'%i for i in range(1,6)],'012':['012-%d'%i for i in range(1,6)]}
placed={e:0 for e in new}
cal=[]
d=D(10,26)
while any(placed[e]<len(new[e]) for e in new) or d<=D(11,14):
    slots=['12:00'] if d in lfday else ['12:00','19:00']
    fixed=old.get(d,[])
    items=[]
    for s in slots:
        if fixed:
            items.append((s,fixed.pop(0),'old')); continue
        rel=[e for e,ld in LF if ld<d and placed[e]<len(new[e])]
        if not rel: items.append((s,None,None)); continue
        newest=[e for e,ld in LF if ld<d][-1]
        pick = newest if placed.get(newest,99)<min(2,len(new[newest])) else rel[0]
        if placed[pick]>=len(new[pick]): pick=rel[0]
        items.append((s,new[pick][placed[pick]],pick)); placed[pick]+=1
    if d in lfday: items.append(('18:00','LF-'+lfday[d],'LF'))
    cal.append((d,items)); d+=dt.timedelta(1)
    if d>D(12,31): break
wd='월화수목금토일'
for d,items in cal:
    print(d.strftime('%m/%d'),wd[d.weekday()],' | '.join(f'{s} {n}' for s,n,_ in sorted(items) if n))
json.dump([[d.isoformat(),[[s,n,k] for s,n,k in items if n]] for d,items in cal],open('cal.json','w'),ensure_ascii=False)
