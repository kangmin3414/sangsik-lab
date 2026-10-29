import json,re,statistics as st,io,contextlib
with contextlib.redirect_stdout(io.StringIO()):
    from ana import B,views
T={'가족(부모·자식·부부·형제)':r'부모|자식|아이|부부|배우자|형제|엄마|아빠|가족|육아|남편|아내','연애·호감':r'연애|호감|사랑|남자|여자|끌리|매력|짝사랑','인간관계·손절':r'관계|친구|손절|사람들?이|대화|말투|사회성|인맥','멘탈·감정(우울·불안·예민)':r'우울|불안|예민|멘탈|화|감정|지치|번아웃|외로|트라우마|상처|스트레스','자기관리(습관·공부·게으름)':r'습관|공부|게으|미루|루틴|집중|의지|절제|목표|기억|독서|정리|버리','돈·부자':r'부자|돈|가난|주식|자산|명품','삶의 의미·철학·행복':r'인생|삶|행복|의미|허무|죽음|철학|니체|신|자유의지|역설|딜레마','뇌과학·지능':r'뇌|지능|IQ|천재|고지능','성격유형(MBTI 등)':r'MBTI|I[SN][FT][JP]|E[SN][FT][JP]|에니어그램|유형'}
hits=[];reg=[]
for cid,c in B.items():
    if cid=='UCSNT-TsvhptVyD63_3yn2yg': continue
    rec=c['recent'][:30]; vs=[views(x['meta']) for x in rec]; med=st.median(vs)
    pid=set()
    for x in c.get('popular',[])[:15]:
        if x.get('id'): hits.append(x['title']); pid.add(x['id'])
    for x,v in zip(rec,vs):
        if x['id'] in pid: continue
        if v>=3*med: hits.append(x['title'])
        elif v<=med: reg.append(x['title'])
res=[]
for k,p in T.items():
    h=sum(1 for t in hits if re.search(p,t))/len(hits)*100; r=sum(1 for t in reg if re.search(p,t))/len(reg)*100
    res.append(dict(topic=k,hit=round(h),reg=round(r),lift=round(h/r,2) if r else None))
res.sort(key=lambda d:-(d['lift'] or 0))
for d in res: print(d)
json.dump(res,open('topics.json','w'),ensure_ascii=False)
