import json, re, sys, time, urllib.request

H = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
     'Accept-Language': 'ko-KR,ko;q=0.9'}
CID = 'UCK2n3rqhkDM4zRhx2dC7weA'
OUT = sys.argv[1]
TAB = sys.argv[2] if len(sys.argv) > 2 else 'videos'   # videos | shorts


def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=H), timeout=30).read().decode('utf-8', 'ignore')


def post(url, body):
    req = urllib.request.Request(url, data=json.dumps(body).encode(),
                                 headers={**H, 'Content-Type': 'application/json'})
    return json.loads(urllib.request.urlopen(req, timeout=30).read().decode('utf-8', 'ignore'))


def initdata(html):
    m = re.search(r'var ytInitialData = (\{.*?\});</script>', html, re.S)
    return json.loads(m.group(1)) if m else None


def walk(o, key):
    if isinstance(o, dict):
        for k, v in o.items():
            if k == key:
                yield v
            else:
                yield from walk(v, key)
    elif isinstance(o, list):
        for x in o:
            yield from walk(x, key)


def find_token(o):
    for c in walk(o, 'continuationItemRenderer'):
        try:
            return c['continuationEndpoint']['continuationCommand']['token']
        except KeyError:
            pass
    return None


DUR = re.compile(r'"text":\s*"(\d{1,2}:\d{2}(?::\d{2})?)"')
VID = re.compile(r'"(?:videoId|contentId)":\s*"([A-Za-z0-9_-]{11})"')
seen = {}


def collect(o):
    n_before = len(seen)
    for v in walk(o, 'lockupViewModel'):
        s = json.dumps(v, ensure_ascii=False)
        m = VID.search(s)
        if not m:
            continue
        vid = m.group(1)
        md = v.get('metadata', {}).get('lockupMetadataViewModel', {})
        title = md.get('title', {}).get('content', '')
        parts = []
        for row in walk(md, 'metadataRows'):
            for r in row:
                for p in r.get('metadataParts', []):
                    parts.append(p.get('text', {}).get('content', ''))
        dur = ''
        dm = DUR.search(json.dumps(v.get('contentImage', {}), ensure_ascii=False))
        if dm:
            dur = dm.group(1)
        if vid not in seen:
            seen[vid] = dict(id=vid, title=title, meta=parts, duration=dur, format=TAB)
    for v in walk(o, 'shortsLockupViewModel'):
        s = json.dumps(v, ensure_ascii=False)
        m = VID.search(s)
        if not m:
            continue
        vid = m.group(1)
        title = v.get('overlayMetadata', {}).get('primaryText', {}).get('content', '')
        views = v.get('overlayMetadata', {}).get('secondaryText', {}).get('content', '')
        if vid not in seen:
            seen[vid] = dict(id=vid, title=title, meta=[views], duration='', format='shorts')
    return len(seen) - n_before


url = f'https://www.youtube.com/channel/{CID}/{TAB}'
html = get(url)
key = re.search(r'"INNERTUBE_API_KEY":\s*"([^"]+)"', html).group(1)
ver = re.search(r'"INNERTUBE_CLIENT_VERSION":\s*"([^"]+)"', html).group(1)
d = initdata(html)
added = collect(d)
tok = find_token(d)
pages = 1
stale = 0
while tok and pages < 200 and stale < 3:
    body = {'context': {'client': {'clientName': 'WEB', 'clientVersion': ver, 'hl': 'ko', 'gl': 'KR'}},
            'continuation': tok}
    r = post(f'https://www.youtube.com/youtubei/v1/browse?key={key}&prettyPrint=false', body)
    got = collect(r)
    stale = 0 if got else stale + 1
    tok = find_token(r)
    pages += 1
    time.sleep(1.0)

items = list(seen.values())
json.dump(items, open(OUT, 'w'), ensure_ascii=False, indent=1)
print(f'tab={TAB} pages={pages} total={len(items)} first_page_added={added} more_token={bool(tok)}')
for it in items[:5]:
    print(it['title'][:50], it['meta'], it['duration'])
