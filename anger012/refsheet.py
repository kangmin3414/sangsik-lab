import os
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__))
errs = []
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
    pg.goto("file://" + os.path.join(here, "anim012.html"))
    pg.evaluate("""() => { document.getElementById('v').innerHTML = defs(0) + BG('#F4EFE6') +
      Z({ t: 0, seed: 1, x: 420, y: 900, s: 1.0, pose: '서기', ex: exprAt([[0, '기본']], 0), still: true }) +
      DY({ t: 0, seed: 2, x: 960, y: 900, s: 1.0, pose: '서기', ex: exprAt([[0, '기본']], 0), still: true }) +
      SE({ t: 0, seed: 3, x: 1500, y: 900, s: 1.0, pose: '서기', ex: exprAt([[0, '기본']], 0), still: true }); }""")
    pg.screenshot(path=os.path.join(here, 'ref', 'chars.png'))
    pg.evaluate("""() => { document.getElementById('v').innerHTML = defs(0) + BG('#F4EFE6') +
      ['화남','서운함','미안','울먹','비웃음','지친','잠','걱정'].map((e,i)=> Z({ t: 0, seed: 1, x: 140 + i*230, y: 700, s: 0.55, pose: i==4? '팔짱' : '서기', ex: exprAt([[0, e]], 0), still: true }) + T8(140+i*230, 760, e, {size: 30})).join('') +
      Z({ t: 0, seed: 1, x: 400, y: 1060, s: 0.45, pose: '펀치', ex: exprAt([[0, '화남']], 0), still: true }) + Z({ t: 0, seed: 1, x: 800, y: 1060, s: 0.45, pose: '가드', ex: exprAt([[0, '화남']], 0), still: true }); }""")
    pg.screenshot(path=os.path.join(here, 'ref', 'expr.png'))
    br.close()
print('errors', errs)
