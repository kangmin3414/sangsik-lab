import datetime as dt, json
D=lambda m,d: dt.date(2026,m,d)
LF=[('006',D(10,27)),('007',D(10,30)),('008',D(11,2)),('009',D(11,5)),('010',D(11,8)),('011',D(11,11)),('012',D(11,14))]
lfday={d:e for e,d in LF}
oldq=['004-3','003-1','004-1','003-5','004-5','005-1','004-2','005-6','004-4','003-6','003-7','003-2','004-6']
cur={'004-3':'10/26 19','003-1':'10/27 19','004-1':'10/28 19','003-5':'10/29 19','004-5':'10/30 19','005-1':'10/31 12','004-2':'10/31 19','005-6':'11/01 12','004-4':'11/01 19','003-6':'11/02 19','003-7':'11/04 19','003-2':'11/06 19','004-6':'11/09 19'}
new={'006':['006v3-%d'%i for i in (1,7,3,5,6,8,2,4)],
     '007':['007v4-%d'%i for i in (1,7,9,2,3,4,5,6,8)],
     '008':['008v4-%d'%i for i in (1,3,9,2,4,5,6,7,8)],
     '009':['009-%d'%i for i in range(1,6)],'010':['010-%d'%i for i in range(1,6)],
     '011':['011-%d'%i for i in range(1,6)],'012':['012-%d'%i for i in range(1,6)]}
placed={e:0 for e in new}
cal=[]; d=D(10,26); turn=0
def left(): return oldq or any(placed[e]<len(new[e]) for e in new)
while left():
    slots=['12:00'] if d in lfday else ['12:00','19:00']
    items=[]
    for s in slots:
        out=[e for e,ld in LF if ld<d]
        newest=out[-1] if out else None
        rel=[e for e in out if placed[e]<len(new[e])]
        if newest and placed[newest]<2:
            pick=newest
        elif oldq and (turn%2==0 or not rel):
            items.append((s,oldq.pop(0),'old')); turn+=1; continue
        elif rel:
            pick=rel[0]
        else:
            continue
        turn+=1
        items.append((s,new[pick][placed[pick]],pick)); placed[pick]+=1
    if d in lfday: items.append(('18:00','LF-'+lfday[d],'LF'))
    cal.append((d,items)); d+=dt.timedelta(1)
wd='월화수목금토일'
moves=0
for d,items in cal:
    row=[]
    for s,n,k in sorted(items):
        tag=''
        if k=='old':
            same = cur[n]==d.strftime('%m/%d')+' '+s[:2]
            tag='' if same else '*'; moves+= not same
        row.append(f'{s[:2]}시 {n}{tag}')
    print(d.strftime('%m/%d'),wd[d.weekday()],' | '.join(row))
print('old moved',moves)
json.dump([[d.isoformat(),[[s,n,k] for s,n,k in items]] for d,items in cal],open('cal2.json','w'),ensure_ascii=False)
