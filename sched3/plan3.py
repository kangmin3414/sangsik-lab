import datetime as dt, json
D=lambda m,d: dt.date(2026,m,d)
LF=[('006',D(10,27)),('007',D(10,30)),('008',D(11,2)),('009',D(11,5)),('010',D(11,8)),('011',D(11,11)),('012',D(11,14))]
lfday={d:e for e,d in LF}
oldq=['004-3','003-1','004-1','003-5','004-5','005-1','004-2','005-6','004-4','003-6','003-7','003-2','004-6']
new={'006':['006v3-%d'%i for i in (2,1,3,5,6,4,7,8)],
     '007':['007v4-%d'%i for i in (3,6,2,4,8,5,7,1,9)],
     '008':['008v4-%d'%i for i in (1,3,5,7,8,6,4,2,9)],
     '009':['009-%d'%i for i in range(1,6)],'010':['010-%d'%i for i in range(1,6)],
     '011':['011-%d'%i for i in range(1,6)],'012':['012-%d'%i for i in range(1,6)]}
ID={'004-3':'WEcjkfxkE00','003-1':'C-C9ToIPaZ8','004-1':'6Y5vhuxoA4g','003-5':'aP0Hm7MvrY4','004-5':'tdV6r4Rw3z4','005-1':'wc_xDil4BMI','004-2':'53BldIEBTC0','005-6':'QFToWZ7z-hU','004-4':'w2rE4DEQWkU','003-6':'EzQuOSehm7Y','003-7':'HHhwxFma32k','003-2':'lA0tc8AqNmU','004-6':'TbYrRBaFimk',
'006v3-1':'O5wyWvZD_oY','006v3-2':'ZOeWO3-2CNg','006v3-3':'UjQ_Y09uqrg','006v3-4':'zrpMlu_Vr44','006v3-5':'KVqdV401_Ak','006v3-6':'vVeCbEDXi-w','006v3-7':'khhgfh63nm0','006v3-8':'YurST74EIn8',
'007v4-1':'1oasnwbzKBc','007v4-2':'RI6Bd9yPvBk','007v4-3':'rtffMcjadWg','007v4-4':'Irsi1U-iNDc','007v4-5':'PJpiHi4Cpgs','007v4-6':'NonsONMDQck','007v4-7':'XA1Dch6nUkc','007v4-8':'iouxIIjseyg','007v4-9':'9JUQSPt5GNI',
'008v4-1':'gzwThsun2FA','008v4-2':'7IiaVdvm3pg','008v4-3':'Y2smLqrYXnI','008v4-4':'lDRdJcRBWsc','008v4-5':'_MvXLgUcLl4','008v4-6':'L-zU4t8H3hk','008v4-7':'7Cf5FK0O0gs','008v4-8':'7oBmFFDAQds','008v4-9':'mpBNiflbyVU','LF-006':'y8A1cGWRh2k'}
CUR={'004-3':'10/26 19:00','003-1':'10/27 19:00','004-1':'10/28 19:00','003-5':'10/29 19:00','004-5':'10/30 19:00','005-1':'10/31 12:00','004-2':'10/31 19:00','005-6':'11/01 12:00','004-4':'11/01 19:00','003-6':'11/02 19:00','003-7':'11/04 19:00','003-2':'11/06 19:00','004-6':'11/09 19:00',
'006v3-7':'11/21 12:00','006v3-2':'11/21 19:00','006v3-5':'11/22 12:00','006v3-4':'11/22 19:00','006v3-8':'11/28 12:00','006v3-6':'11/28 19:00','006v3-3':'11/29 12:00','006v3-1':'11/29 19:00',
'007v4-2':'11/03 19:00','007v4-3':'11/05 19:00','007v4-8':'11/07 12:00','007v4-6':'11/07 19:00','007v4-4':'11/08 12:00','007v4-5':'12/05 12:00','007v4-7':'12/05 19:00','007v4-1':'12/06 12:00','007v4-9':'12/06 19:00',
'008v4-7':'11/10 19:00','008v4-1':'11/14 12:00','008v4-5':'11/14 19:00','008v4-6':'11/15 12:00','008v4-8':'11/15 19:00','008v4-4':'12/12 12:00','008v4-3':'12/12 19:00','008v4-2':'12/13 12:00','008v4-9':'12/13 19:00','LF-006':'11/17 10:00'}
placed={e:0 for e in new}; cal=[]; d=D(10,26); turn=0
def left(): return oldq or any(placed[e]<len(new[e]) for e in new)
while left():
    slots=['12:00'] if d in lfday else ['12:00','19:00']
    items=[]
    for s in slots:
        out=[e for e,ld in LF if ld<d]; newest=out[-1] if out else None
        rel=[e for e in out if placed[e]<len(new[e])]
        if newest and placed[newest]<2: pick=newest
        elif oldq and (turn%2==0 or not rel):
            items.append((s,oldq.pop(0))); turn+=1; continue
        elif rel: pick=rel[0]
        else: continue
        turn+=1; items.append((s,new[pick][placed[pick]])); placed[pick]+=1
    if d in lfday: items.append(('18:00','LF-'+lfday[d]))
    cal.append((d,items)); d+=dt.timedelta(1)
sched={}
for d,items in cal:
    for s,n in items: sched[n]=d.strftime('%m/%d')+' '+s
ops=[]
for n,w in sched.items():
    if n in CUR:
        if CUR[n]!=w: ops.append((n,ID[n],CUR[n],w))
    else: ops.append((n,ID.get(n,'NEW'),'-',w))
ops.sort(key=lambda x:x[3])
json.dump({'sched':sched,'ops':ops,'id':ID},open('plan3.json','w'),ensure_ascii=False,indent=1)
resched=[o for o in ops if o[1]!='NEW' and not o[0].startswith('LF-0') or o[0]=='LF-006']
print('reschedule',len([o for o in ops if o[2]!='-']),'new',len([o for o in ops if o[2]=='-']))
for o in ops: print(*o)
