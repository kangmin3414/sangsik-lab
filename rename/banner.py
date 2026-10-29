"""Final channel banner with the new name (same art/layout as brand2/banner_v2.py)."""
import os, sys
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); SP = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(SP, 'brand2')); import banner_v2 as bv
h = bv.banner(); old = f'<span style="color: {bv.YEL}">만약에</span>연구소'; assert old in h
h = h.replace(old, f'<span style="color: {bv.YEL}">상식</span>실험실')
html = f"<!doctype html><html><head><meta charset='utf-8'><style>body{{margin:0;background:#000}}</style></head><body>{h}</body></html>"
hp = os.path.join(HERE, '_banner_final.html'); open(hp, 'w', encoding='utf-8').write(html)
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 2560, 'height': 1440})
    pg.goto('file://' + hp); pg.wait_for_timeout(500)
    print(pg.evaluate("""() => [...document.querySelectorAll('#bn > div')].map(d => { const r = d.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom), d.innerText.slice(0, 10)]; })"""))
    out = os.path.join(HERE, '상식실험실_채널배너_2560x1440.png'); pg.screenshot(path=out); b.close()
print(out, os.path.getsize(out))
