"""인물 시안 시트: 젊은 아시모프(1942, 타자기) · 노년 아시모프(구레나룻·볼로 타이) · 삼칙이(표정 4가지·원칙 칸) · 제로와 키 비교 → ../chars_v1.png"""
import os
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
JS = r"""
() => {
  const lab = (x, y, s, fs = 40) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${fs}" fill="#2B2D42">${s}</text>`;
  let h = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">` + GY_DEFS + `<rect width="1920" height="1080" fill="#F4EFE6"/>`;
  // ① 1942 젊은 아시모프 + 타자기
  h += `<rect x="20" y="20" width="620" height="1040" rx="30" fill="#EADFC8"/>` + lab(330, 80, '① 1942년 아시모프(22세)');
  h += asAsimov({ x: 330, y: 900, s: 1.0, pose: '서기', look: [0.2, 0.3], exk: 'z기본' }, 0);
  h += `<g transform="translate(330 1000)">${asTypewriter(0.7, 1.15)}</g>`;
  h += lab(330, 1045, '짙은 머리 · 뿔테 · 구레나룻 없음', 28);
  // ② 노년 아시모프
  h += `<rect x="660" y="20" width="560" height="1040" rx="30" fill="#E6E1D6"/>` + lab(940, 80, '② 노년 아시모프');
  h += asAsimov({ x: 940, y: 980, s: 1.25, pose: 'as손', look: [0, 0], exk: 'z빵긋' }, 1);
  h += lab(940, 1045, '큰 구레나룻 · 뿔테 · 볼로 타이', 28);
  // ③ 삼칙이 표정 + 제로와 키 비교
  h += `<rect x="1240" y="20" width="660" height="1040" rx="30" fill="#E3ECF4"/>` + lab(1570, 80, '③ 삼칙이 · 제로와 키 비교');
  h += Z({ x: 1400, y: 640, s: 0.95, t: 1, pose: '서기', ex: fEx('z빵긋'), look: [0.4, 0] });
  h += `<g transform="translate(1690 640) scale(.86)">${asBot(1.2, { ex: 'smile', wave: 1, lamps: [1, 1, 1, 0] })}</g>`;
  const ex = [['open', '기본'], ['heart', '아첨'], ['wave', '당황'], ['x', '충돌']];
  ex.forEach(([e, n], i) => { const x = 1330 + i * 160; h += `<g transform="translate(${x} 1010) scale(.42)">${asBot(0.3 + i, { ex: e, lamps: i === 3 ? [1, 1, 1, 0] : [1, 1, 1, 0], blink: i === 3 })}</g>` + lab(x, 1050, n, 26); });
  h += lab(1570, 720, '가슴 칸 넷: ①해치지 않기 ②말 따르기 ③나 지키기 + 빈 넷째 칸', 24);
  return h + `</svg>`;
}
"""
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1920, 'height': 1080})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + os.path.abspath('../../gyges01/long/anim_gy.html')); pg.wait_for_timeout(800)
    pg.add_script_tag(path=os.path.abspath('asgf.js'))
    pg.evaluate("f => { document.body.style.margin = 0; document.body.innerHTML = (eval(f))(); }", JS)
    pg.wait_for_timeout(500); pg.screenshot(path='../chars_v1.png'); b.close(); print('errors', errs)
