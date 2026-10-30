"""017 새 캐릭터 시트: python3 chars017.py -> thumb/캐릭터시트_017.jpg"""
import os
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__))
JS = r"""() => {
const t = 1.3;
let h = defs(t) + `<rect width="1920" height="1080" fill="#F4EFE4"/><rect width="1920" height="1080" fill="url(#paper)"/>`;
h += outlined(960, 70, [[['실험 017 · 새 캐릭터', NAVY]]], { size: 52, sw: 0, shadow: false, fill: NAVY, stroke: 'none' });
const row = (y) => `<rect x="40" y="${y - 6}" width="1840" height="12" rx="6" fill="#D9CDB4"/>`;
h += row(560) + row(1030);
const tag = (x, y, name, sub, c) => label(x, y, name, { size: 34, bg: c }) + T8(x, y + 52, sub, { size: 22, fill: '#6B6255', w: 700 });
// row 1: ancient + Zero with the prop
h += KZ({ t, seed: 1, x: 260, y: 552, s: 0.62, pose: '서기', ex: exprAt([[0, '미소']], t), look: [0.4, 0] }) + bamboo17(260 + (284 - 200) * 0.62 + 10, 552 + (406 - 560) * 0.62, 0.62, 0);
h += tag(260, 120, '공자', '검은 관 · 긴 검은 수염 · 남색 도포 · 죽간', YEL);
h += JY({ t, seed: 2, x: 620, y: 552, s: 0.56, pose: '서기', ex: exprAt([[0, '졸림']], t), look: [-0.3, 0.4] });
h += tag(620, 120, '재여 (제자)', '말솜씨로 꼽힌 제자 · 낮잠', '#E9DFC6');
h += ZK({ t, seed: 3, x: 1000, y: 552, s: 0.6, pose: '서기', ex: exprAt([[0, '신남']], t), look: [0.3, 0] }) + bamboo17(1000 + (284 - 200) * 0.6 + 14, 552 + (406 - 560) * 0.6, 0.6, 1);
h += tag(1000, 120, '제로 + 공자 소품', '가짜 수염(귀에 끈) · 죽간', '#FFB98A');
h += ZB17 ? char(Object.assign({}, ZB17, { t, seed: 4, x: 1420, y: 552, s: 0.6, pose: '앉아받기' in P ? '앉아받기' : '서기', ex: exprAt([[0, '신남']], t) })) : '';
h += ball17(1420, 552 + (352 - 560) * 0.6, 34, 0.6);
h += tag(1420, 120, '캐치볼 공', '누가 말하는지 = 공을 쥔 사람', MINT);
h += T8(1700, 300, '말을 쏟아낼 땐', { size: 26, fill: NAVY }) + T8(1700, 336, '수염이 흔들리고,', { size: 26, fill: NAVY }) + T8(1700, 372, '들을 땐 공을 돌려준다', { size: 26, fill: NAVY });
// row 2: today's people
h += HR({ t, seed: 5, x: 300, y: 1022, s: 0.62, pose: '손인사', ex: exprAt([[0, '신남']], t), look: [0.3, 0] });
h += tag(300, 600, '하린 (동료)', '등산 좋아함 · 포니테일 · 초록 플리스', '#BFE3C7');
h += SA({ t, seed: 6, x: 760, y: 1022, s: 0.62, pose: '서기', ex: exprAt([[0, '미소']], t), look: [0.2, 0] });
h += tag(760, 600, '수아 (소개팅)', '긴 갈색 머리 · 복숭아색 니트 · 머리핀', '#F8D3C4');
h += GM({ t, seed: 7, x: 1220, y: 1022, s: 0.6, pose: '서기', ex: exprAt([[0, '미소']], t), look: [-0.2, 0] });
h += tag(1220, 600, '할머니 (회상)', '회색 곱슬 파마 · 돋보기 · 자두색 카디건', '#E4CFE2');
h += TL17({ t, seed: 8, x: 1650, y: 1022, s: 0.62, pose: '서기', ex: exprAt([[0, '기본']], t), look: [-0.3, 0] });
h += tag(1650, 600, '팀장', '016과 같은 디자인', '#C9D3DE');
document.getElementById('v').innerHTML = h;
}"""
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("file://" + os.path.join(here, "anim017.html")); pg.evaluate("tl => { window.TL = tl; }", {"duration": 10, "lines": [], "env": []})
    pg.wait_for_timeout(400); pg.evaluate(JS); pg.wait_for_timeout(200)
    os.makedirs(os.path.join(here, 'thumb'), exist_ok=True)
    pg.screenshot(path=os.path.join(here, 'thumb/캐릭터시트_017.jpg'), type='jpeg', quality=92)
    br.close()
for e in errs: print('JS', e[:300])
print('ok')
