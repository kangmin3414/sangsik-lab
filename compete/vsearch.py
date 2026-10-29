import json,sys,time,re,urllib.parse
from yt import get,initdata,walk,txt
def vsearch(q,sp='EgIQAQ%253D%253D'):
    url='https://www.youtube.com/results?search_query='+urllib.parse.quote(q)+'&sp='+sp
    d=initdata(get(url)); out=[]
    for v in walk(d,'videoRenderer'):
        o=v.get('ownerText',{}).get('runs',[{}])[0]
        cid=o.get('navigationEndpoint',{}).get('browseEndpoint',{}).get('browseId')
        out.append(dict(vid=v.get('videoId'),title=txt(v.get('title')),views=txt(v.get('viewCountText')),ch=o.get('text'),cid=cid))
    return out
SP=sys.argv[4] if len(sys.argv)>4 else 'EgIQAQ%253D%253D'
qs=json.load(open(sys.argv[1])); res={}
for q in qs:
    try: res[q]=vsearch(q,SP)
    except Exception as e: res[q]=str(e)
    time.sleep(0.7)
json.dump(res,open(sys.argv[2],'w'),ensure_ascii=False,indent=1)
agg={}
for q,v in res.items():
    if isinstance(v,str): continue
    for x in v:
        if not x['cid']: continue
        a=agg.setdefault(x['cid'],dict(ch=x['ch'],qs=set(),vids=[]))
        a['qs'].add(q); a['vids'].append((x['vid'],x['title'],x['views']))
L=sorted(agg.items(),key=lambda kv:-len(kv[1]['qs']))
json.dump({k:dict(ch=v['ch'],qs=sorted(v['qs']),vids=v['vids']) for k,v in L},open(sys.argv[3],'w'),ensure_ascii=False,indent=1)
print(len(L))
for k,v in L[:70]: print(len(v['qs']),k,v['ch'],'|',v['vids'][0][1][:50],'|',v['vids'][0][2])
