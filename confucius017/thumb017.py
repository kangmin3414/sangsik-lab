"""Ep.017 thumbnails from the episode's own drawing code (no AI): T1 Zero talking alone at the café while the date checks the time; T2 the ball coming back — "그래서요? 그다음엔요?"."""
import os
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__))
COMMON = """
const t = 3.2;
const bg = `<rect width="1920" height="1080" fill="#1E2236"/><ellipse cx="960" cy="640" rx="980" ry="620" fill="url(#amber)" opacity=".45"/><rect width="1920" height="1080" fill="url(#dots)"/>`;
"""
T1 = COMMON + """
let h = defs(t) + bg;
const zo = { t, seed: 5, x: 560, y: 1150, s: 1.35, pose: '앉아안기', ex: exprAt([[0, '신남']], t), look: [0.6, -0.1] };
h += HALO(char(Object.assign({}, ZB17, zo))); const [bx, by] = handAt(zo, 'hR'); h += ball17(bx - 60, by - 40, 70);
h += DATEW17({ t, seed: 6, x: 1500, y: 1150, s: 1.25, pose: '앉기', ex: exprAt([[0, '지친']], t), look: [0.6, 0.7] });
h += `<g transform="translate(1690 560) scale(1.6)">` + icon17('watch') + `</g>`;
h += `<g transform="translate(560 470) rotate(-4)">` + label(0, 0, '내 말 95%', { size: 60, bg: '#FFB0A0' }) + `</g>`;
h += outlined(960, 150, [[['말은 잘했는데', '#fff']]], { size: 110, sw: 22 });
h += outlined(960, 300, [[['왜 다시 ', '#fff'], ['안 만나 줄까', '#FFE27A'], ['?', '#fff']]], { size: 140, sw: 26 });
document.getElementById('v').innerHTML = h;
"""
T2 = COMMON + """
let h = defs(t) + bg;
h += HALO(char(Object.assign({}, ZB17, { t, seed: 7, x: 520, y: 1150, s: 1.25, pose: '안기', ex: exprAt([[0, '놀람']], t), look: [0.6, -0.2] })));
h += SA({ t, seed: 8, x: 1420, y: 1150, s: 1.2, pose: '던지기', ex: exprAt([[0, '미소']], t), look: [-0.6, -0.1] });
h += ball17(960, 640, 80, 0.9);
h += outlined(960, 150, [[['그래서요?', '#FFE27A']]], { size: 150, sw: 26 });
h += outlined(960, 310, [[['그다음엔요?', '#fff']]], { size: 120, sw: 22 });
h += `<g transform="translate(960 990) rotate(-2)">` + label(0, 0, '공자의 대화법', { size: 58, bg: '#FFE27A' }) + `</g>`;
document.getElementById('v').innerHTML = h;
"""
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("file://" + os.path.join(here, "anim017.html")); pg.evaluate("tl => { window.TL = tl; }", {"duration": 10, "lines": [], "env": []})
    pg.wait_for_timeout(500)
    for name, js in (("T1", T1), ("T2", T2)):
        pg.evaluate("() => {" + js + "}"); pg.wait_for_timeout(200)
        pg.screenshot(path=os.path.join(here, f"thumb/상식실험실_실험017_썸네일_{name}.jpg"), type="jpeg", quality=92)
    br.close()
for e in errs: print('JS', e[:200])
print("ok")
