import json,re,sys
from concurrent.futures import ThreadPoolExecutor
from yt import get
def pr(html):
    m=re.search(r'var ytInitialPlayerResponse = (\{.*?\});(?:var|</script>)',html,re.S)
    return json.loads(m.group(1)) if m else None
def one(vid):
    try:
        h=get('https://www.youtube.com/watch?v='+vid); p=pr(h)
        vd=p.get('videoDetails',{}); mf=p.get('microformat',{}).get('playerMicroformatRenderer',{})
        desc=vd.get('shortDescription','')
        ch=len(re.findall(r'(?m)^\s*\(?\d{1,2}:\d{2}(?::\d{2})?\)?\s',desc))
        lk=re.search(r'"likeCount":"?(\d+)',h) or re.search(r'좋아요 ([\d,]+)개',h)
        cm=re.search(r'댓글 ([\d,.]+(?:천|만)?)개',h)
        return vid,dict(len=int(vd.get('lengthSeconds',0)),views=int(vd.get('viewCount',0)),kw=vd.get('keywords',[]),desc=desc,chapters=ch,
            pub=mf.get('publishDate'),cat=mf.get('category'),title=vd.get('title'),likes=(lk.group(1).replace(',','') if lk else None))
    except Exception as e: return vid,dict(err=str(e))
if __name__=="__main__":
  B=json.load(open("bench_ch.json"))
  vids=set()
  for cid,c in B.items():
      for x in c['recent'][:30]: vids.add(x['id'])
      for x in c.get('popular',[])[:15]:
          if x.get('id'): vids.add(x['id'])
  vids=[v for v in vids if v]
  print(len(vids))
  with ThreadPoolExecutor(10) as ex: W=dict(ex.map(one,vids))
  json.dump(W,open('watch.json','w'),ensure_ascii=False)
  print(sum(1 for v in W.values() if 'err' in v))
