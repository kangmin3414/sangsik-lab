"""Contact sheet: one frame per script line (mid-line). Uses timeline.json if present, else a synthetic one from script.py."""
import json, os, sys
from playwright.sync_api import sync_playwright
from PIL import Image
here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here)
if os.path.exists(os.path.join(here, 'timeline.json')) and '--synthetic' not in sys.argv:
    tl = json.load(open(os.path.join(here, 'timeline.json')))
else:
    from script import S
    t = 0.8; lines = []
    for i, (sc, a, sub, sp) in enumerate(S):
        d = a['silent'] if a.get('silent') else max(1.2, len(sub.replace(' ', '')) / 4.5)
        segs = [{'v': s[0], 'text': s[1], 't0': t, 't1': t + d} for s in a.get('segs', [])]
        lines.append({'i': i, 'scene': sc, 'args': a, 'sub': sub, 't0': t, 't1': t + d, 'segs': segs}); t += d + 0.6 + a.get('pause', 0)
    tl = {'duration': t + 2, 'lines': lines, 'env': [0.5] * int((t + 2) * 24 + 10)}
sel = [int(x) for x in sys.argv[1].split(',')] if len(sys.argv) > 1 and sys.argv[1][0].isdigit() else list(range(len(tl['lines'])))
od = os.path.join(here, 'qa'); os.makedirs(od, exist_ok=True)
errs = []
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={'width': 1920, 'height': 1080})
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + os.path.join(here, 'anim_ep01.html')); pg.evaluate('tl => { window.TL = tl; }', tl)
    shots = []
    for i in sel:
        l = tl['lines'][i]; tt = l['t0'] + min(1.6, (l['t1'] - l['t0']) * 0.6)
        pg.evaluate(f'render({tt})'); f = os.path.join(od, f'l{i:03d}.jpg'); pg.screenshot(path=f, type='jpeg', quality=70); shots.append((i, f))
    br.close()
print('errors', errs[:5])
cols = 6; tw, th = 480, 270; rows = (len(shots) + cols - 1) // cols
sheets = []
for page in range(0, len(shots), 36):
    part = shots[page:page + 36]; r = (len(part) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * tw, r * th), 'black')
    for n, (i, f) in enumerate(part): sheet.paste(Image.open(f).resize((tw, th)), ((n % cols) * tw, (n // cols) * th))
    out = os.path.join(od, f'sheet_{page // 36}.jpg'); sheet.save(out, quality=80); sheets.append(out)
print(sheets)
