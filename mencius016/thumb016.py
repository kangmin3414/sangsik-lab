"""Ep.016 thumbnails from the episode's own drawing code (no AI): T1 big Zero with the flying cape vs a giant executive; T2 the bean Zero."""
import os, json
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__))
COMMON = """
const t = 3.2;
const bg = `<rect width="1920" height="1080" fill="#2A1A1E"/><ellipse cx="1300" cy="560" rx="900" ry="620" fill="url(#redglow)" opacity=".7"/><rect width="1920" height="1080" fill="url(#dots)"/>`;
"""
T1 = COMMON + """
let h = defs(t) + bg;
h += `<path d="M120 1080 L420 120 L720 1080 Z" fill="#000" opacity=".25"/>`;
h += `<g opacity=".9">` + EX2({ t, seed: 5, x: 420, y: 1120, s: 1.75, pose: '팔짱', ex: exprAt([[0, '결심']], t), look: [0.6, 0.3] }) + `</g>`;
h += ZC({ t: 0.6, seed: 7, x: 1380, y: 1120, s: 1.22, pose: '허리', cape: 0.95, ex: exprAt([[0, '결심']], t), look: [-0.5, -0.1], still: true });
h += outlined(1300, 150, [[['남들 앞에서', '#fff']]], { size: 120, sw: 22 });
h += outlined(1300, 300, [[['주눅 든다면', '#FFE27A']]], { size: 150, sw: 26 });
h += `<g transform="translate(400 990) rotate(-3)">` + label(0, 0, '맹자의 5가지 태도', { size: 58, bg: '#FFE27A' }) + `</g>`;
document.getElementById('v').innerHTML = h;
"""
T2 = COMMON + """
let h = defs(t) + bg;
h += EX({ t, seed: 3, x: 330, y: 1150, s: 1.5, pose: '팔짱', ex: exprAt([[0, '기본']], t), look: [0.6, 0.4] });
h += EX2({ t, seed: 4, x: 1590, y: 1150, s: 1.5, pose: '팔짱', ex: exprAt([[0, '결심']], t), look: [-0.6, 0.4] });
h += ZC({ t, seed: 7, x: 960, y: 1010, s: 0.42, pose: '움츠림', ex: exprAt([[0, '겁먹음']], t), look: [0, -0.6], sweat: true });
h += `<g transform="translate(960 720) rotate(4)">` + label(0, 0, '콩알', { size: 56, bg: '#C9E8A0' }) + `</g>`;
h += outlined(960, 230, [[['왜 저 사람 앞에선', '#fff']]], { size: 108, sw: 20 });
h += outlined(960, 380, [[['작아질까', '#FFE27A'], ['?', '#fff']]], { size: 150, sw: 26 });
document.getElementById('v').innerHTML = h;
"""
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    pg.goto("file://" + os.path.join(here, "anim016.html")); pg.evaluate("tl => { window.TL = tl; }", {"duration": 10, "lines": [], "env": []})
    pg.wait_for_timeout(500)
    for name, js in (("T1", T1), ("T2", T2)):
        pg.evaluate("() => {" + js + "}"); pg.wait_for_timeout(200)
        pg.screenshot(path=os.path.join(here, f"thumb/상식실험실_실험016_썸네일_{name}.jpg"), type="jpeg", quality=92)
    br.close()
print("ok")
