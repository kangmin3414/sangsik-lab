import json,sys
TAB=1542696814
def tstr(hm):
    h,m=map(int,hm.split(':')); ap='오전' if h<12 else '오후'; h12=h if 1<=h<=12 else (h-12 if h>12 else 12)
    return f'{ap} {h12}:{m:02d}'
def one(vid,when):
    md,hm=when.split(' '); m,d=md.split('/'); date=f'2026. {int(m)}. {int(d)}.'; time=tstr(hm)
    c=lambda a,**k: {"name":"computer","input":dict(action=a,tabId=TAB,**k)}
    j=lambda t: {"name":"javascript_tool","input":{"action":"javascript_exec","tabId":TAB,"text":t}}
    return [{"name":"navigate","input":{"url":f"https://studio.youtube.com/video/{vid}/edit","tabId":TAB}},
      j(f"(0,eval)(localStorage.__h);await PD('{vid}')"), c('key',text='ctrl+a',action_summary='Selects the date text'), c('type',text=date,action_summary='Types the new publish date'), j(f"CK('{date}')"),
      c('key',text='Return',action_summary='Confirms the date'), c('wait',duration=1), j('PT()'), c('key',text='ctrl+a',action_summary='Selects the time text'),
      c('type',text=time,action_summary='Types the new publish time'), c('key',text='Return',action_summary='Confirms the time'),
      c('wait',duration=1), j(f"await FN('{vid}','{date} {time}')")]
ops=[l.split() for l in open('todo.txt') if l.strip()]
s,e=int(sys.argv[1]),int(sys.argv[2])
out=[]
for o in ops[s:e]: out+=one(o[1],o[2]+' '+o[3])
print(json.dumps(out,ensure_ascii=False,separators=(',',':')))
