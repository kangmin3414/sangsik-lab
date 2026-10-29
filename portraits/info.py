"""Batch imageinfo for candidate Commons files (retries on 429). Usage: python3 info.py 'File:A|File:B|...'"""
import json, sys, time, urllib.parse, urllib.request, re
UA = 'SangsikLabThumbnailBot/1.0 (https://www.youtube.com/channel/UCSNT-TsvhptVyD63_3yn2yg; kangmin3414@gmail.com)'
def api(params):
    url = 'https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(dict(params, format='json'))
    for k in range(8):
        try: return json.load(urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=30))
        except urllib.error.HTTPError as e:
            if e.code != 429: raise
            time.sleep(15 + 5 * k)
    raise SystemExit('rate limited')
if __name__ == '__main__':
    mode = sys.argv[1]
    if mode == 'info':
        d = api({'action': 'query', 'titles': sys.argv[2], 'prop': 'imageinfo', 'iiprop': 'url|size|extmetadata', 'iiurlwidth': 1600,
                 'iiextmetadatafilter': 'LicenseShortName|Artist|DateTimeOriginal|Credit'})
        out = {}
        for p in d['query']['pages'].values():
            if 'imageinfo' not in p: print('MISSING', p['title']); continue
            ii = p['imageinfo'][0]; m = ii.get('extmetadata', {})
            g = lambda k: re.sub('<[^>]+>', '', m.get(k, {}).get('value', ''))[:70]
            print(f"OK {ii['width']}x{ii['height']} [{g('LicenseShortName')}] {p['title']} | {g('Artist')} | {g('DateTimeOriginal')}")
            out[p['title']] = {'url': ii['url'], 'thumb': ii.get('thumburl'), 'w': ii['width'], 'h': ii['height'], 'license': g('LicenseShortName'), 'artist': g('Artist')}
        json.dump(out, open('_info.json', 'w'), ensure_ascii=False, indent=1)
    else:  # search
        for q in sys.argv[2:]:
            d = api({'action': 'query', 'list': 'search', 'srnamespace': 6, 'srlimit': 12, 'srsearch': q})
            print('==', q); [print('  ', s['title']) for s in d['query']['search']]
            time.sleep(3)
