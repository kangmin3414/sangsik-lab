import json, re, sys, urllib.parse, urllib.request, time
H={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36','Accept-Language':'ko-KR,ko;q=0.9'}
def get(url):
    req=urllib.request.Request(url,headers=H)
    return urllib.request.urlopen(req,timeout=30).read().decode('utf-8','ignore')
def initdata(html):
    m=re.search(r'var ytInitialData = (\{.*?\});</script>',html,re.S)
    return json.loads(m.group(1)) if m else None
def walk(o,key):
    if isinstance(o,dict):
        for k,v in o.items():
            if k==key: yield v
            else: yield from walk(v,key)
    elif isinstance(o,list):
        for x in o: yield from walk(x,key)
def txt(t):
    if not t: return ''
    if 'simpleText' in t: return t['simpleText']
    return ''.join(r.get('text','') for r in t.get('runs',[]))
def parse_subs(s):
    m=re.search(r'구독자\s*([\d.,]+)\s*(천|만|억)?',s)
    if not m: return None
    n=float(m.group(1).replace(',',''))
    mul={'천':1e3,'만':1e4,'억':1e8}.get(m.group(2),1)
    return int(n*mul)
def search_channels(q):
    url='https://www.youtube.com/results?search_query='+urllib.parse.quote(q)+'&sp=EgIQAg%253D%253D'
    d=initdata(get(url)); out=[]
    for c in walk(d,'channelRenderer'):
        a=txt(c.get('subscriberCountText')); b=txt(c.get('videoCountText'))
        subs_txt=a if '구독자' in a else b
        handle=a if a.startswith('@') else ''
        out.append(dict(id=c.get('channelId'),title=txt(c.get('title')),handle=handle,subs_txt=subs_txt,subs=parse_subs(subs_txt) or 0,desc=txt(c.get('descriptionSnippet'))[:120]))
    return out
if __name__=='__main__':
    qs=json.load(open(sys.argv[1])); res={}
    for q in qs:
        try: res[q]=search_channels(q)
        except Exception as e: res[q]=str(e)
        time.sleep(0.8)
    json.dump(res,open(sys.argv[2],'w'),ensure_ascii=False,indent=1)
    for q,v in res.items():
        print('##',q, len(v) if isinstance(v,list) else v)
