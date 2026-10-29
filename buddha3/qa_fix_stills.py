"""QA stills for the v6 fixes. usage: python3 qa_fix_stills.py <name> <spec> [cols] [crop x0,y0,x1,y1]
spec: comma list of  L<i>:<n>  (n stills evenly over line i, incl. ends)  or  t<seconds>  or  L<i>@<frac>"""
import sys, os, json
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw
here = os.path.dirname(os.path.abspath(__file__)); tl = json.load(open(os.path.join(here, "timeline.json"))); L = tl["lines"]
name, spec = sys.argv[1], sys.argv[2]; cols = int(sys.argv[3]) if len(sys.argv) > 3 else 4
crop = [int(v) for v in sys.argv[4].split(',')] if len(sys.argv) > 4 else None
ts = []
for it in spec.split(','):
    if it.startswith('t'): ts.append((it, float(it[1:])))
    elif '@' in it:
        i, f = it[1:].split('@'); i = int(i); f = float(f); ts.append((f'L{i}@{f}', L[i]['t0'] + f * (L[i]['t1'] - L[i]['t0'])))
    else:
        i, n = it[1:].split(':'); i, n = int(i), int(n)
        for k in range(n):
            t = L[i]['t0'] - 0.1 + (L[i]['t1'] - L[i]['t0'] + 0.1) * k / max(1, n - 1); ts.append((f'L{i} {t:.2f}', t))
od = os.path.join(here, 'qa_fix'); os.makedirs(od, exist_ok=True)
errs = []
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto("file://" + os.path.join(here, "anim10.html")); pg.evaluate("tl => { window.TL = tl; }", tl); pg.evaluate("window.AI_READY")
    ims = []
    for lab, t in ts:
        f = round(t * 24); pg.evaluate(f"render({f / 24})")
        fp = os.path.join(od, f'_{name}_{len(ims):02d}.png'); pg.screenshot(path=fp)
        im = Image.open(fp).convert('RGB'); os.remove(fp)
        if crop: im = im.crop(crop)
        ims.append((f'{lab} f{f}', im))
    br.close()
w0, h0 = ims[0][1].size; sc = min(1.0, 640 / w0); tw, th = int(w0 * sc), int(h0 * sc)
rows = (len(ims) + cols - 1) // cols; S = Image.new('RGB', (cols * tw, rows * th), 'white')
for k, (lab, im) in enumerate(ims):
    im = im.resize((tw, th)); d = ImageDraw.Draw(im); d.rectangle([0, 0, 150, 16], fill='black'); d.text((3, 3), lab, fill='yellow')
    S.paste(im, ((k % cols) * tw, (k // cols) * th))
S.save(os.path.join(od, f'{name}.jpg'), quality=85)
print('saved', os.path.join(od, f'{name}.jpg'), len(ims), 'ERRORS:', errs)
