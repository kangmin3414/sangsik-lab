"""018 캐릭터 설정표: python3 chars018.py -> thumb/캐릭터시트_018.jpg (라벨 있음, 운영자 확인용)
+ ref/zero_ages.png (제로 4개 나이), ref/cast.png (등장인물 8명) — 그림 생성용 참조(라벨 없음)"""
import os
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__))
DEFS = r"""
const t = 1.3;
const SHIRT = { goggles: 'none', patch: false, tee: true };
const lanyard = o => local17(o, `<path d="M166 258 L200 330 L234 258" fill="none" stroke="#3E6FB0" stroke-width="6"/><rect x="184" y="326" width="32" height="40" rx="5" fill="#fff" stroke="${INK}" stroke-width="4"/><rect x="190" y="334" width="20" height="10" fill="#9FB4D8"/>`);
const apron = o => local17(o, `<path d="M158 300 L242 300 L250 430 L150 430 Z" fill="#E9DCC0" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M166 300 L182 262 M234 300 L218 262" stroke="${INK}" stroke-width="5"/><rect x="182" y="340" width="36" height="26" rx="4" fill="none" stroke="#B9A27E" stroke-width="4"/>`);
const cardigan = o => local17(o, `<path d="M200 262 L200 420" stroke="${INK}" stroke-width="4"/><circle cx="200" cy="300" r="5" fill="#6E5A3E"/><circle cx="200" cy="340" r="5" fill="#6E5A3E"/><circle cx="200" cy="380" r="5" fill="#6E5A3E"/>`);
const backpack = o => local17(o, `<path d="M150 270 Q132 330 146 400 L164 400 Q156 330 168 272 Z" fill="#E07A5F" stroke="${INK}" stroke-width="5"/>`);
const hoodie = o => local17(o, `<path d="M150 262 Q200 300 250 262" fill="none" stroke="${INK}" stroke-width="5"/><path d="M186 280 L186 320 M214 280 L214 320" stroke="#F4F1EA" stroke-width="5" stroke-linecap="round"/>`);
const bag = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-30 -40 Q0 -80 30 -40" fill="none" stroke="${INK}" stroke-width="6"/><rect x="-44" y="-40" width="88" height="80" rx="10" fill="#8DB89A" stroke="${INK}" stroke-width="6"/><path d="M-20 -40 L-14 -60 M14 -40 L20 -62" stroke="#5E8A3A" stroke-width="6" stroke-linecap="round"/></g>`;
// Zero at four ages
const Z1 = o => { const q = Object.assign({}, SHIRT, { vest: '#F4F6FA', vshade: 'rgba(60,80,120,0.15)', collar: true }, o); return HALO(char(q) + lanyard(q)); };
const Z5 = o => { const q = Object.assign({}, SHIRT, { vest: '#A9CCE3', vshade: 'rgba(0,40,90,0.18)', collar: true, pencil: GLS13 }, o); return HALO(glasses13(char(q), '#3A3A3A')); };
const Z10 = o => { const q = Object.assign({}, SHIRT, { vest: '#3E4A66', vshade: 'rgba(0,0,0,0.25)', collar: true, tie: '#B5523B', pencil: GLS13 }, o); return HALO(glasses13(char(q), '#3A3A3A')); };
const Z30 = o => { const q = Object.assign({}, SHIRT, { vest: '#B9A27E', vshade: 'rgba(60,40,0,0.2)', collar: true, hair: '#CFCBC4', pencil: GLS13 }, o); return HALO(glasses13(char(q), '#5A4A3A') + cardigan(q)); };
// cast
const YAM = o => { const q = Object.assign({}, SHIRT, { vest: '#7C9A7A', vshade: 'rgba(0,40,0,0.2)', hair: '#BDB8B0', pencil: GLS13 }, o); return HALO(glasses13(char(q), '#6E6E6E') + apron(q)); };
const SATO = o => { const q = Object.assign({}, SHIRT, { vest: '#4A4F5A', vshade: 'rgba(0,0,0,0.25)', collar: true, tie: '#2E4057', hair: '#222', pencil: GLS13 }, o); return HALO(glasses13(char(q), '#222')); };
const HANA = o => HALO(char(Object.assign({}, SHIRT, { vest: '#E8C468', vshade: 'rgba(120,80,0,0.18)', hair: '#2A2220', longHair: '#2A2220', lashes: true }, o)));
const SIS = o => HALO(char(Object.assign({}, SHIRT, { vest: '#9FC5E8', vshade: 'rgba(0,40,90,0.18)', hair: '#4A3226', longHair: '#4A3226', lashes: true, ribbon: '#F7A8B8' }, o)));
const MJ = o => { const q = Object.assign({}, SHIRT, { vest: '#6FA8DC', vshade: 'rgba(0,40,90,0.2)', hair: '#1E1E1E' }, o); return HALO(char(q) + hoodie(q)); };
const NEW = o => { const q = Object.assign({}, SHIRT, { vest: '#9AD0B0', vshade: 'rgba(0,60,30,0.18)', hair: '#1E1E1E' }, o); return HALO(backpack(q) + char(q)); };
const tag = (x, y, name, sub, c) => label(x, y, name, { size: 32, bg: c }) + T8(x, y + 64, sub, { size: 21, fill: '#6B6255', w: 700 });
"""
SHEET = DEFS + r"""
let h = defs(t) + `<rect width="1920" height="1080" fill="#F4EFE4"/><rect width="1920" height="1080" fill="url(#paper)"/>`;
h += outlined(960, 56, [[['실험 018 · 캐릭터 설정표', NAVY]]], { size: 48, sw: 0, shadow: false, fill: NAVY, stroke: 'none' });
const row = (y) => `<rect x="40" y="${y - 6}" width="1840" height="12" rx="6" fill="#D9CDB4"/>`;
h += row(560) + row(1030);
const ages = [[Z1, '1년 차 · 봄', '첫 출근 셔츠 · 사원증', '#F8D3E0'], [Z5, '5년 차 · 여름', '얇은 안경 · 하늘색 반팔 셔츠', '#BFE3C7'], [Z10, '10년 차 · 가을', '안경 · 남색 재킷 · 넥타이', '#F6C9A0'], [Z30, '30년 차 · 겨울', '회색 머리 · 카디건 · 장바구니', '#D6E4F0']];
ages.forEach(([f, n, s, c], j) => { const x = 280 + j * 450; h += f({ t, seed: 10 + j, x, y: 552, s: 0.66, pose: '서기', ex: exprAt([[0, j === 3 ? '미소' : j === 2 ? '생각' : '신남']], t), look: [0.2, 0] }) + tag(x, 112, '제로 ' + n, s, c); });
h += bag(280 + 3 * 450 + 92, 470, 0.7);
const cast = [[YAM, '야마다 씨', '60대 이웃 · 앞치마', '#CFE3C8'], [SATO, '사토 과장', '정장 · 안경', '#C9D3DE'], [HANA, '하나', '동료 → 친구', '#F6E3A0'], [OM, '엄마 (한국)', '013의 엄마와 같은 디자인', '#F3C9CF'],
  [SIS, '여동생', '하늘색 셔츠 · 리본', '#CFE2F3'], [MJ, '조카 민준', '10대 · 후드티', '#BCD7EE'], [NEW, '한국 청년', '30년 차의 새내기 · 배낭', '#CDEBD9']];
cast.forEach(([f, n, s, c], j) => { const x = 150 + j * 232; h += f({ t, seed: 30 + j, x, y: 1022, s: j === 5 ? 0.46 : 0.52, pose: '서기', ex: exprAt([[0, '미소']], t), look: [0.2, 0] }) + tag(x, 610, n, s, c); });
h += doctor(1790, 1030, 0.5, { t, expr: '미소' }) + tag(1790, 610, '박사님', '영상통화 창', MINT);
document.getElementById('v').innerHTML = h;
"""
REF_Z = DEFS + r"""
let h = `<rect width="1920" height="1080" fill="#FFFFFF"/>`;
[Z1, Z5, Z10, Z30].forEach((f, j) => { h += f({ t, seed: 10 + j, x: 260 + j * 470, y: 900, s: 1.0, pose: '서기', ex: exprAt([[0, '기본']], t), look: [0, 0] }); });
h += bag(260 + 3 * 470 + 140, 760, 1.0);
document.getElementById('v').innerHTML = h;
"""
REF_C = DEFS + r"""
let h = `<rect width="1920" height="1080" fill="#FFFFFF"/>`;
[YAM, SATO, HANA, OM, SIS, MJ, NEW].forEach((f, j) => { h += f({ t, seed: 30 + j, x: 150 + j * 270, y: 900, s: j === 5 ? 0.66 : 0.76, pose: '서기', ex: exprAt([[0, '기본']], t), look: [0, 0] }); });
document.getElementById('v').innerHTML = h;
"""
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("file://" + os.path.join(here, '..', 'confucius017', 'anim017.html')); pg.evaluate("tl => { window.TL = tl; }", {"duration": 10, "lines": [], "env": []})
    pg.wait_for_timeout(400)
    for js, out, clip in ((SHEET, 'thumb/캐릭터시트_018.jpg', None), (REF_Z, 'ref/zero_ages.png', {'x': 0, 'y': 260, 'width': 1920, 'height': 680}), (REF_C, 'ref/cast.png', {'x': 0, 'y': 330, 'width': 1920, 'height': 610})):
        pg.evaluate("() => {" + js + "}"); pg.wait_for_timeout(200)
        kw = {'path': os.path.join(here, out)}
        if out.endswith('.jpg'): kw.update(type='jpeg', quality=92)
        if clip: kw['clip'] = clip
        pg.screenshot(**kw)
    br.close()
for e in errs: print('JS', e[:300])
print('ok')
