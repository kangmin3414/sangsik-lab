"""Collect public channel profile data (name, handle, description, keywords, home shelves, playlists, banner/avatar) for the benchmark + ours."""
import json, sys, time, re, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'compete'))
import yt
B = json.load(open('../compete/bench_ch.json'))
out = {}
def first(o, key):
    for x in yt.walk(o, key): return x
for cid, c in B.items():
    try:
        d = yt.initdata(yt.get(f'https://www.youtube.com/channel/{cid}'))
    except Exception as e:
        print('fail', cid, e); continue
    md = first(d, 'channelMetadataRenderer') or {}
    hdr = first(d, 'pageHeaderRenderer') or {}
    # home shelves
    shelves = []
    for s in yt.walk(d, 'shelfRenderer'):
        t = yt.txt(s.get('title', {}))
        if t: shelves.append(t)
    for s in yt.walk(d, 'richSectionRenderer'):
        t = first(s, 'title')
        if isinstance(t, dict): t = yt.txt(t)
        if isinstance(t, str) and t: shelves.append(t)
    # header bits: banner + metadata rows (handle, subs, videos)
    hs = json.dumps(hdr, ensure_ascii=False)
    has_banner = '"banner"' in hs or 'imageBannerViewModel' in hs
    rows = re.findall(r'"content":"([^"]{1,60})"', hs)
    # trailer / featured
    feat = [yt.txt(x.get('title', {})) for x in yt.walk(d, 'channelVideoPlayerRenderer')]
    time.sleep(0.8)
    try:
        dp = yt.initdata(yt.get(f'https://www.youtube.com/channel/{cid}/playlists'))
        pls = []
        for l in yt.walk(dp, 'lockupViewModel'):
            t = (((l.get('metadata') or {}).get('lockupMetadataViewModel') or {}).get('title') or {}).get('content')
            if t: pls.append(t)
        for p in yt.walk(dp, 'gridPlaylistRenderer'):
            pls.append(yt.txt(p.get('title', {})))
    except Exception as e:
        pls = ['ERR ' + str(e)[:40]]
    out[cid] = {'title': md.get('title'), 'desc': md.get('description', ''), 'keywords': md.get('keywords', ''),
                'vanity': md.get('vanityChannelUrl', ''), 'banner': has_banner, 'header_rows': rows[:12],
                'shelves': shelves[:15], 'featured': feat, 'playlists': pls[:30], 'subs': c.get('subs')}
    print(c['title'][:10], '| kw', len(md.get('keywords', '')), '| desc', len(md.get('description', '')), '| pl', len(pls), '| shelves', len(shelves), flush=True)
    time.sleep(0.8)
json.dump(out, open('profiles.json', 'w'), ensure_ascii=False, indent=1)
