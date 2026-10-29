"""Look up candidate public-domain portrait files on Wikimedia Commons (size + licence)."""
import json, sys, time, urllib.parse, urllib.request
UA = 'SangsikLabThumbnailBot/1.0 (https://www.youtube.com/channel/UCSNT-TsvhptVyD63_3yn2yg)'
def api(params):
    url = 'https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(dict(params, format='json'))
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    return json.load(urllib.request.urlopen(req, timeout=30))
for q in sys.argv[1:]:
    d = api({'action': 'query', 'generator': 'search', 'gsrnamespace': 6, 'gsrsearch': q, 'gsrlimit': 8,
             'prop': 'imageinfo', 'iiprop': 'url|size|extmetadata', 'iiextmetadatafilter': 'LicenseShortName|Artist|DateTimeOriginal'})
    print('==', q)
    for p in sorted(d.get('query', {}).get('pages', {}).values(), key=lambda p: p.get('index', 0)):
        ii = p['imageinfo'][0]; m = ii.get('extmetadata', {})
        lic = m.get('LicenseShortName', {}).get('value', '?'); art = m.get('Artist', {}).get('value', '')
        import re; art = re.sub('<[^>]+>', '', art)[:50]
        print(f"  {ii['width']}x{ii['height']} {lic:18s} {p['title'][5:90]} | {art}")
    time.sleep(1.5)
