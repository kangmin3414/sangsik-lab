import os
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__)); errs = []
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
    pg.goto("file://" + os.path.join(here, "anim013.html"))
    pg.evaluate("""() => { const ex = exprAt([[0, '기본']], 0); document.getElementById('v').innerHTML = defs(0) + BG('#F4EFE6') +
      Z({ t: 0, seed: 1, x: 220, y: 900, s: 0.92, pose: '서기', ex, still: true }) +
      OM({ t: 0, seed: 2, x: 590, y: 900, s: 0.92, pose: '서기', ex, still: true }) +
      AP({ t: 0, seed: 3, x: 960, y: 900, s: 0.92, pose: '서기', ex, still: true }) +
      YM({ t: 0, seed: 4, x: 1330, y: 900, s: 0.92, pose: '안기', ex, still: true }) + baby13(1330, 760, 0.42, 0, { still: true }) +
      EPI({ t: 0, seed: 5, x: 1700, y: 900, s: 0.92, pose: '서기', ex, still: true }); }""")
    pg.screenshot(path=os.path.join(here, 'ref', 'chars.png'))
    pg.evaluate("""() => { document.getElementById('v').innerHTML = defs(0) + BG('#F4EFE6') +
      ['기본','미소?','서운함','걱정','울먹','신남','잠','지친'].map((e,i)=> OM({ t: 0, seed: 1, x: 140 + i*230, y: 520, s: 0.5, pose: '서기', ex: exprAt([[0, e.replace('?','')]], 0), still: true }) + T8(140+i*230, 560, e, {size: 28})).join('') +
      ['기본','화남','잠','신남','울먹','지친'].map((e,i)=> AP({ t: 0, seed: 1, x: 140 + i*230, y: 1000, s: 0.5, pose: i==1?'팔짱':'서기', ex: exprAt([[0, e]], 0), still: true }) + T8(140+i*230, 1040, e, {size: 28})).join('') +
      baby13(1600, 1000, 0.5, 0, { still: true }) + baby13(1800, 1000, 0.4, 0, { sleep: true, still: true }); }""")
    pg.screenshot(path=os.path.join(here, 'ref', 'expr.png'))
    br.close()
print('errors', errs)
