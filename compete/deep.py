import json,re,sys,time,urllib.request
from concurrent.futures import ThreadPoolExecutor
from yt import get,initdata,walk,txt,H
def lockups(d):
    out=[]
    for v in walk(d,'lockupViewModel'):
        vid=v.get('contentId')
        md=v.get('metadata',{}).get('lockupMetadataViewModel',{})
        t=md.get('title',{}).get('content','')
        parts=[]
        for row in walk(md,'metadataRows'):
            for r in row:
                for p in r.get('metadataParts',[]): parts.append(p.get('text',{}).get('content',''))
        dur=''
        for b in walk(v.get('contentImage',{}),'thumbnailBadgeViewModel'):
            dur=b.get('text',''); break
        out.append(dict(id=vid,title=t,meta=parts,dur=dur))
    return out
def ytcfg(html):
    m=re.search(r'"INNERTUBE_API_KEY":"([^"]+)"',html); k=m.group(1) if m else None
    m=re.search(r'"INNERTUBE_CLIENT_VERSION":"([^"]+)"',html); v=m.group(1) if m else '2.20251020.00.00'
    return k,v
def browse(token,key,ver):
    body=json.dumps({'context':{'client':{'clientName':'WEB','clientVersion':ver,'hl':'ko','gl':'KR'}},'continuation':token}).encode()
    req=urllib.request.Request('https://www.youtube.com/youtubei/v1/browse?prettyPrint=false',data=body,headers={**H,'Content-Type':'application/json'})
    return json.loads(urllib.request.urlopen(req,timeout=30).read())
def popular(d,html):
    key,ver=ytcfg(html)
    for c in walk(d,'chipViewModel'):
        if c.get('text') in ('인기순','Popular'):
            tok=next(walk(c,'token'),None)
            if tok:
                return lockups(browse(tok,key,ver))
    return []
def channel(cid):
    html=get('https://www.youtube.com/channel/'+cid+'/videos'); d=initdata(html)
    m=re.search(r'구독자\s*([\d.,]+\s*(?:천|만|억)?)명',html)
    meta=next(walk(d,'channelMetadataRenderer'),{})
    recent=lockups(d)
    try: pop=popular(d,html)
    except Exception as e: pop=[{'err':str(e)}]
    try:
        hs=get('https://www.youtube.com/channel/'+cid+'/shorts'); ds=initdata(hs)
        shorts=[]
        for s in walk(ds,'shortsLockupViewModel'):
            vid=next(walk(s,'videoId'),None)
            shorts.append(dict(id=vid,title=s.get('overlayMetadata',{}).get('primaryText',{}).get('content',''),views=s.get('overlayMetadata',{}).get('secondaryText',{}).get('content','')))
    except Exception as e: shorts=[{'err':str(e)}]
    return cid,dict(title=meta.get('title'),subs=m.group(1) if m else '',desc=meta.get('description',''),keywords=meta.get('keywords',''),recent=recent,popular=pop,shorts=shorts)
if __name__=='__main__':
    ids=json.load(open(sys.argv[1]))
    with ThreadPoolExecutor(5) as ex: res=dict(ex.map(channel,ids))
    json.dump(res,open(sys.argv[2],'w'),ensure_ascii=False,indent=1)
    for k,v in res.items(): print(v['title'],v['subs'],len(v['recent']),len(v['popular']),len(v['shorts']))
