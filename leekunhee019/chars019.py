"""019 캐릭터 설정표: python3 chars019.py -> thumb/캐릭터시트_019.jpg + ref/lee_ages.png (그림 생성 참조, 라벨 없음) + ref/cast.png"""
import os
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__))
DEFS = r"""
const t = 1.3;
const SH = { goggles: 'none', patch: false, tee: true };
const L1 = o => HALO(char(Object.assign({}, SH, { vest: '#2F3B52', vshade: 'rgba(0,0,0,0.25)', collar: true, hair: '#1E1E1E' }, o)));               // 1953 boy: dark school uniform
const L2 = o => HALO(char(Object.assign({}, SH, { vest: '#5A6378', vshade: 'rgba(0,0,0,0.22)', collar: true, tie: '#7A2E2E', hair: '#1E1E1E' }, o))); // 1974: grey suit
const L3 = o => { const q = Object.assign({}, SH, { vest: '#1F2A44', vshade: 'rgba(0,0,0,0.3)', collar: true, tie: '#3A4A6A', hair: '#262626', pencil: GLS13 }, o); return HALO(glasses13(char(q), '#2A2A2A')); };  // 1990s chairman
const L4 = o => { const q = Object.assign({}, SH, { vest: '#6E6A62', vshade: 'rgba(0,0,0,0.2)', collar: true, hair: '#BDBAB4', pencil: GLS13 }, o); return HALO(glasses13(char(q), '#4A4A4A')); };  // 2010s
const EMP = o => HALO(char(Object.assign({}, SH, { vest: '#E9EEF4', vshade: 'rgba(60,80,120,0.15)', collar: true, hair: '#2A2A2A' }, o)));            // employee, white work shirt
const EXEC = o => HALO(char(Object.assign({}, SH, { vest: '#2B2F3A', vshade: 'rgba(0,0,0,0.3)', collar: true, tie: '#4A3A3A', hair: '#444' }, o)));    // 1993 executive
const ENG = o => HALO(char(Object.assign({}, SH, { vest: '#F4F6F8', vshade: 'rgba(0,0,0,0.12)', hair: '#2A2A2A' }, o)));                               // clean-room engineer (white suit; hood drawn in prompt)
const tag = (x, y, name, sub, c) => label(x, y, name, { size: 32, bg: c }) + T8(x, y + 64, sub, { size: 21, fill: '#6B6255', w: 700 });
"""
SHEET = DEFS + r"""
let h = defs(t) + `<rect width="1920" height="1080" fill="#F4EFE4"/><rect width="1920" height="1080" fill="url(#paper)"/>`;
h += outlined(960, 56, [[['실험 019 · 캐릭터 설정표 (캐릭터화 · 실제 얼굴 아님)', NAVY]]], { size: 42, sw: 0, shadow: false, fill: NAVY, stroke: 'none' });
const row = y => `<rect x="40" y="${y - 6}" width="1840" height="12" rx="6" fill="#D9CDB4"/>`; h += row(560) + row(1030);
[[L1, '1953 · 소년', '검은 교복 · 짧은 머리', '#E6E1D8', 0.5], [L2, '1974 · 서른둘', '회색 양복 · 붉은 넥타이', '#D6E4F0', 0.64], [L3, '1993 · 회장', '짙은 남색 양복 · 안경', '#C9D3DE', 0.66], [L4, '2010년대', '회색 머리 · 안경', '#E4E0D8', 0.64]]
  .forEach(([f, n, s, c, sc], j) => { const x = 280 + j * 450; h += f({ t, seed: 10 + j, x, y: 552, s: sc, pose: '서기', ex: exprAt([[0, j === 0 ? '서운함' : j === 2 ? '결심' : '기본']], t), look: [0.2, 0] }) + tag(x, 112, '이건희 ' + n, s, c); });
[[EMP, '직원', '흰 작업 셔츠', '#E6EBF0'], [EXEC, '1993 임원', '짙은 양복', '#D6D9E0'], [ENG, '연구원', '흰 방진복', '#F0F2F4']].forEach(([f, n, s, c], j) => { const x = 260 + j * 380; h += f({ t, seed: 30 + j, x, y: 1022, s: 0.56, pose: '서기', ex: exprAt([[0, '기본']], t) }) + tag(x, 610, n, s, c); });
h += doctor(1500, 1030, 0.5, { t, expr: '미소' }) + tag(1500, 610, '박사님', '마무리 한마디', MINT);
document.getElementById('v').innerHTML = h;
"""
REF_L = DEFS + r"""
let h = `<rect width="1920" height="1080" fill="#FFFFFF"/>`;
[[L1, 0.8], [L2, 1.0], [L3, 1.0], [L4, 1.0]].forEach(([f, s], j) => { h += f({ t, seed: 10 + j, x: 260 + j * 470, y: 900, s, pose: '서기', ex: exprAt([[0, '기본']], t), look: [0, 0] }); });
document.getElementById('v').innerHTML = h;
"""
REF_C = DEFS + r"""
let h = `<rect width="1920" height="1080" fill="#FFFFFF"/>`;
[EMP, EXEC, ENG].forEach((f, j) => { h += f({ t, seed: 30 + j, x: 300 + j * 470, y: 900, s: 0.85, pose: '서기', ex: exprAt([[0, '기본']], t), look: [0, 0] }); });
h += doctor(1650, 920, 0.72, { t, expr: '미소' });
document.getElementById('v').innerHTML = h;
"""
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("file://" + os.path.join(here, '..', 'confucius017', 'anim017.html')); pg.evaluate("tl => { window.TL = tl; }", {"duration": 10, "lines": [], "env": []})
    pg.wait_for_timeout(400)
    for js, out, clip in ((SHEET, 'thumb/캐릭터시트_019.jpg', None), (REF_L, 'ref/lee_ages.png', {'x': 0, 'y': 260, 'width': 1920, 'height': 680}), (REF_C, 'ref/cast.png', {'x': 0, 'y': 260, 'width': 1920, 'height': 700})):
        pg.evaluate("() => {" + js + "}"); pg.wait_for_timeout(200)
        kw = {'path': os.path.join(here, out)}
        if out.endswith('.jpg'): kw.update(type='jpeg', quality=92)
        if clip: kw['clip'] = clip
        pg.screenshot(**kw)
    br.close()
for e in errs: print('JS', e[:300])
print('ok')
