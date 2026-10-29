import os, json
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__))
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    pg.goto("file://" + os.path.join(here, "anim11.html"))
    pg.evaluate("""() => { document.getElementById('v').innerHTML = defs(0) + BG('#F4EFE6') +
      Z({ t: 0, seed: 1, x: 420, y: 900, s: 1.0, pose: '서기', ex: exprAt([[0, '신남']], 0), still: true }) +
      GP({ t: 0, seed: 2, x: 960, y: 900, s: 1.0, pose: '서기', ex: exprAt([[0, '뿌듯']], 0), still: true }) +
      SF({ t: 0, seed: 3, x: 1500, y: 900, s: 1.0, pose: '서기', ex: exprAt([[0, '기본']], 0), still: true }); }""")
    pg.screenshot(path=os.path.join(here, 'ref', 'chars.png'))
    # quick test frames of each scene at mid-line
    tl = {"duration": 10, "lines": []}
    br.close()
print('ok')
