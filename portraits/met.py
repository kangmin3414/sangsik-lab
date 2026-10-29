"""Search The Met open-access collection (CC0) and print public-domain objects with images."""
import json, sys, urllib.parse, urllib.request, time
def get(url): return json.load(urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 SangsikLab'}), timeout=30))
for q in sys.argv[1:]:
    d = get('https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=' + urllib.parse.quote(q))
    ids = (d.get('objectIDs') or [])[:12]
    print('==', q, d.get('total'))
    for i in ids:
        o = get(f'https://collectionapi.metmuseum.org/public/collection/v1/objects/{i}')
        if not o.get('isPublicDomain') or not o.get('primaryImage'): continue
        print(f"  {i} | {o.get('title','')[:60]} | {o.get('artistDisplayName','')[:30]} | {o.get('objectDate','')} | {o.get('department','')}")
        time.sleep(0.2)
