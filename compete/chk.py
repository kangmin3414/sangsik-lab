import json,re,sys,time
from concurrent.futures import ThreadPoolExecutor
from yt import get,initdata,walk,txt,parse_subs
def chk(cid):
    try:
        html=get('https://www.youtube.com/channel/'+cid+'/videos')
        m=re.search(r'구독자\s*[\d.,]+\s*(?:천|만|억)?명',html)
        subs=parse_subs(m.group(0)) if m else 0
        d=initdata(html)
        meta=next(walk(d,'channelMetadataRenderer'),{}) if d else {}
        vids=[]
        for v in walk(d,'lockupViewModel'):
            md=v.get('metadata',{}).get('lockupMetadataViewModel',{})
            t=md.get('title',{}).get('content','')
            parts=[]
            for row in walk(md,'metadataRows'):
                for r in row:
                    for p in r.get('metadataParts',[]): parts.append(p.get('text',{}).get('content',''))
            vids.append((v.get('contentId'),t,' / '.join(parts),''))
        return cid,dict(title=meta.get('title',''),subs=subs,desc=(meta.get('description') or '')[:150],vids=vids[:8])
    except Exception as e:
        return cid,dict(err=str(e))
if __name__=='__main__':
  ids=json.load(open(sys.argv[1]))
  with ThreadPoolExecutor(6) as ex: res=dict(ex.map(chk,ids))
  json.dump(res,open(sys.argv[2],'w'),ensure_ascii=False,indent=1)
  print(len(res), sum(1 for v in res.values() if 'err' in v))
