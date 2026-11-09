import json, os, sys
from playwright.sync_api import sync_playwright
HERE=os.getcwd(); TL=json.load(open('timeline_gf.json')); i=int(sys.argv[1])
def trial(js):
    with sync_playwright() as p:
        br=p.chromium.launch(args=['--disable-gpu']); pg=br.new_page(viewport={'width':1920,'height':1080}); pg.set_default_timeout(15000)
        pg.goto('file://'+os.path.join(HERE,'anim_gf.html')); pg.evaluate('(tl)=>{window.TL=tl;}',TL); pg.evaluate('window.AI_READY')
        pg.evaluate(f'render({i/24})'); info = pg.evaluate(js)
        try: pg.screenshot(path='/tmp/ct.jpg', type='jpeg', quality=60); ok=True
        except Exception: ok=False
        try: br.close()
        except Exception: pass
        return ok, info
# 모든 말단 요소에 번호를 매기고, 구간을 지워 가며 이분 탐색
lo, hi = 0, None
ok, n = trial("(()=>{window.__L=[...document.querySelectorAll('#v *')].filter(e=>!e.children.length && !['stop','feTurbulence','feDisplacementMap','feGaussianBlur','feMorphology','feFlood','feComposite','feMergeNode','feColorMatrix'].includes(e.tagName)); return window.__L.length})()")
print('leaves', n, 'crash' if not ok else 'ok', flush=True)
a, b = 0, n
while b - a > 1:
    m = (a + b) // 2
    ok, _ = trial(f"(()=>{{const L=[...document.querySelectorAll('#v *')].filter(e=>!e.children.length && !['stop','feTurbulence','feDisplacementMap','feGaussianBlur','feMorphology','feFlood','feComposite','feMergeNode','feColorMatrix'].includes(e.tagName)); L.slice({a},{m}).forEach(e=>e.remove()); return 0}})()")
    if ok: b = m   # 앞쪽 절반 안에 범인
    else: a = m
    print(a, b, flush=True)
_, desc = trial(f"(()=>{{const L=[...document.querySelectorAll('#v *')].filter(e=>!e.children.length && !['stop','feTurbulence','feDisplacementMap','feGaussianBlur','feMorphology','feFlood','feComposite','feMergeNode','feColorMatrix'].includes(e.tagName)); return L[{a}].outerHTML.slice(0,400)}})()")
print('culprit', a, desc)
