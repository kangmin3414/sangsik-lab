import json, os
from PIL import Image
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
P = json.load(open(os.path.join(HERE, 'plan.json'))); FPS = 24
TL = {ep: json.load(open(os.path.join(ROOT, e['dir'], 'timeline.json')))['lines'] for ep, e in P['eps'].items()}
with sync_playwright() as pw:
    br = pw.chromium.launch(); tp = br.new_page(viewport={'width': 1080, 'height': 1920})
    tp.goto('file://' + os.path.join(HERE, 'short_thumb.html')); tp.evaluate('document.fonts.ready'); tp.wait_for_timeout(400)
    for sh in P['shorts']:
        e = P['eps'][sh['ep']]; l = TL[sh['ep']][sh['thumb']]; tt = l['t0'] + 0.75 * (l['t1'] - l['t0'])
        fr = Image.open(os.path.join(ROOT, e['dir'], 'frames', f'f{int(tt * FPS):05d}.jpg')).crop((330, 0, 1590, 880))
        fp = os.path.join(HERE, 'work', f"tf_{sh['name']}.jpg"); fr.save(fp, quality=92)
        o = {'theme': e['theme'], 'accent': e['accent'], 'tag': f"만약에연구소 · 실험 {sh['ep']}", 'title': sh['title'], 'img': 'file://' + fp}
        tp.evaluate('o => setup(o)', o); tp.wait_for_timeout(250)
        tp.screenshot(path=os.path.join(HERE, 'out', f"썸네일_{sh['name']}.png"))
    br.close()
print('ok')
