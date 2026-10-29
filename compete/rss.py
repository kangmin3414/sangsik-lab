import json,time,urllib.request,xml.etree.ElementTree as ET
from yt import H
ns={'a':'http://www.w3.org/2005/Atom','yt':'http://www.youtube.com/xml/schemas/2015','m':'http://search.yahoo.com/mrss/'}
ids=json.load(open('bench.json')); out={}
for cid in ids:
    try:
        x=urllib.request.urlopen(urllib.request.Request('https://www.youtube.com/feeds/videos.xml?channel_id='+cid,headers=H),timeout=30).read()
        r=ET.fromstring(x); es=[]
        for e in r.findall('a:entry',ns):
            g=e.find('m:group',ns)
            st=g.find('m:community/m:statistics',ns)
            es.append(dict(id=e.find('yt:videoId',ns).text,title=e.find('a:title',ns).text,pub=e.find('a:published',ns).text,
                link=e.find('a:link',ns).get('href'),desc=g.find('m:description',ns).text or '',views=int(st.get('views')) if st is not None else None))
        out[cid]=dict(title=r.find('a:title',ns).text,entries=es)
    except Exception as ex: out[cid]=dict(err=str(ex))
    time.sleep(1.5)
json.dump(out,open('rss.json','w'),ensure_ascii=False,indent=1)
for k,v in out.items(): print(v.get('title'),len(v.get('entries',[])),v.get('err',''))
