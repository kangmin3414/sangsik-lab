import json,re,statistics as st
from ana import B,views
F={'숫자':r'\d','특징/공통점/신호':r'특징|공통점|신호|유형','이유':r'이유','방법/법':r'방법|하는 법|는법|사는 법|법\b|비법|기술','사람':r'사람','감정어(소름/무서운/충격)':r'소름|무서|충격|미친|압도','99%/상위%':r'\d+%|상위','과학 권위(뇌과학/심리학/연구)':r'뇌과학|심리학|연구|과학|신경','질문형(?)':r'\?','따옴표 인용':r'["“”\'‘’]','구분자 |':r'\||ㅣ','vs 비교':r'vs|VS','시간 약속(N분/N일)':r'\d+\s*(분|초|일|시간)\s*(만에|정리)?','나이/세대':r'\d0대|중년|노후|나이|오십|65세|세대','철학자/고전':r'니체|쇼펜하우어|철학|스토아|소크라테스|부처|붓다|장자|공자|노자|아리스토|에피쿠로스|세네카|고전','당신/너':r'당신|너\b|네가'}
hits=[];reg=[]
for cid,c in B.items():
    if cid=='UCSNT-TsvhptVyD63_3yn2yg': continue
    rec=c['recent'][:30]; vs=[views(x['meta']) for x in rec]; med=st.median(vs)
    pop_ids=set()
    for x in c.get('popular',[])[:15]:
        if x.get('id'): hits.append(x['title']); pop_ids.add(x['id'])
    for x,v in zip(rec,vs):
        if x['id'] in pop_ids: continue
        if v>=3*med: hits.append(x['title'])
        elif v<=med: reg.append(x['title'])
def rate(ts,pat): return sum(1 for t in ts if re.search(pat,t))/len(ts)*100
print('hits',len(hits),'reg',len(reg))
print('제목 길이(글자) 중앙: 터진',st.median(len(t) for t in hits),'평범',st.median(len(t) for t in reg))
main=lambda t: re.split(r'\s[\|ㅣ]\s|\s[\|ㅣ]|[\|ㅣ]\s',t)[0]
print('구분자 앞 본제목 길이 중앙: 터진',st.median(len(main(t)) for t in hits),'평범',st.median(len(main(t)) for t in reg))
res=[]
for k,p in F.items(): res.append((k,round(rate(hits,p)),round(rate(reg,p))))
for r in sorted(res,key=lambda r:-(r[1]-r[2])): print(f'{r[0]:<22} 터진 {r[1]:>3}%  평범 {r[2]:>3}%  차이 {r[1]-r[2]:+}')
json.dump(dict(features=res,n_hits=len(hits),n_reg=len(reg),len_hits=st.median(len(t) for t in hits),len_reg=st.median(len(t) for t in reg),main_hits=st.median(len(main(t)) for t in hits),main_reg=st.median(len(main(t)) for t in reg)),open('titles.json','w'),ensure_ascii=False)
