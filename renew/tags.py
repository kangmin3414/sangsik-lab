"""Video tags (videoDetails.keywords) + description hashtags for top videos of chosen benchmark channels, via the public innertube player endpoint."""
import json, sys, os, re, time, urllib.request
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'compete'))
import yt
B = json.load(open('../compete/bench_ch.json'))
home = yt.get('https://www.youtube.com/')
key = re.search(r'"INNERTUBE_API_KEY":"([^"]+)"', home).group(1)
ver = re.search(r'"INNERTUBE_CLIENT_VERSION":"([^"]+)"', home).group(1)
def player(vid):
    body = {"context": {"client": {"clientName": "WEB", "clientVersion": ver, "hl": "ko", "gl": "KR"}}, "videoId": vid}
    req = urllib.request.Request(f'https://www.youtube.com/youtubei/v1/player?key={key}&prettyPrint=false', data=json.dumps(body).encode(),
                                 headers={**yt.H, 'Content-Type': 'application/json'})
    return json.loads(urllib.request.urlopen(req, timeout=20).read())
pick = ['한눈에 심리학', '오늘은 심리학', '책식주의', '지식은 날리지', '친절한심리학', '마인드풀 메이트', '이클립스', 'Grabity', '바로쓰는 심리학', '숨겨진심리학']
out = {}
for cid, c in B.items():
    if not any(c['title'].startswith(p) for p in pick): continue
    rows = []
    for v in c.get('popular', [])[:6]:
        try:
            p = player(v['id']); vd = p.get('videoDetails', {})
            desc = vd.get('shortDescription', '')
            rows.append({'id': v['id'], 'title': v['title'], 'views': v.get('meta'), 'kw': vd.get('keywords', []),
                         'hashtags': re.findall(r'#[^\s#]+', desc)[:15], 'desc_len': len(desc), 'desc_head': desc[:160],
                         'len': vd.get('lengthSeconds')})
        except Exception as e:
            rows.append({'id': v['id'], 'err': str(e)[:80]})
        time.sleep(1.2)
    out[c['title']] = rows
    print(c['title'][:10], [len(r.get('kw', [])) for r in rows], flush=True)
json.dump(out, open('tags.json', 'w'), ensure_ascii=False, indent=1)
