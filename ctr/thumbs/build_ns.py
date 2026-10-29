"""New CTR-style thumbnails (1280x720) for 실험 005 니체 / 006 스토아, same look as build.py (002-004).
Thumbnail = result/twist in two lines, bright background, one big picture, bottom-right left empty.
Usage: python3 build_ns.py [variant ...]   (default: all)"""
import os, sys
from playwright.sync_api import sync_playwright
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build as B

HERE = B.HERE
R = B.R

SCENES2 = r"""
const mtn = (x, y, w, hh, c) => `<path d="M${x - w} ${y} L${x} ${y - hh} L${x + w} ${y} Z" fill="${c}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`
  + `<path d="M${x - w * 0.3} ${y - hh * 0.7} L${x} ${y - hh} L${x + w * 0.3} ${y - hh * 0.7} L${x + w * 0.14} ${y - hh * 0.62} L${x + w * 0.02} ${y - hh * 0.74} L${x - w * 0.12} ${y - hh * 0.6} Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
const cloud = (x, y, s, fill, txt, fs = 46, tc = '#FFFFFF') => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-90 30 Q-120 30 -116 0 Q-120 -40 -76 -40 Q-66 -84 -16 -76 Q16 -110 56 -76 Q100 -84 104 -40 Q136 -30 124 6 Q124 34 90 34 Z" fill="${fill}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>${txt ? `<text x="4" y="16" text-anchor="middle" font-family="Black Han Sans" font-size="${fs}" fill="${tc}">${txt}</text>` : ''}</g>`;
const rain = (x, y, n, s = 1) => { let h = ''; for (let i = 0; i < n; i++) h += `<line x1="${x + i * 34 * s}" y1="${y + (i % 2) * 18}" x2="${x + i * 34 * s - 12}" y2="${y + (i % 2) * 18 + 40 * s}" stroke="#7CC7FF" stroke-width="${7 * s}" stroke-linecap="round"/>`; return h; };
const bandaid = (x, y, r, s = 1) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><rect x="-46" y="-15" width="92" height="30" rx="14" fill="#F5C7A0" stroke="${INK}" stroke-width="5"/><rect x="-13" y="-11" width="26" height="22" rx="4" fill="#E8AE80"/><circle cx="-30" cy="-4" r="2.5" fill="#C98E62"/><circle cx="-30" cy="5" r="2.5" fill="#C98E62"/><circle cx="30" cy="-4" r="2.5" fill="#C98E62"/><circle cx="30" cy="5" r="2.5" fill="#C98E62"/></g>`;
const bubble = (x, y, txt, o = {}) => { const w = o.w || 120, hh = o.h || 84, fs = o.fs || 56; const tail = o.tail || 'down';
  return `<g transform="translate(${x} ${y}) rotate(${o.rot || 0})"><rect x="${-w / 2}" y="${-hh / 2}" width="${w}" height="${hh}" rx="24" fill="${o.bg || '#FFFFFF'}" stroke="${INK}" stroke-width="7"/>`
  + (tail === 'down' ? `<path d="M-14 ${hh / 2 - 4} L4 ${hh / 2 + 26} L18 ${hh / 2 - 4} Z" fill="${o.bg || '#FFFFFF'}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><rect x="-16" y="${hh / 2 - 12}" width="36" height="10" fill="${o.bg || '#FFFFFF'}"/>` : '')
  + `<text x="0" y="${fs * 0.36}" text-anchor="middle" font-family="Black Han Sans" font-size="${fs}" fill="${o.color || INK}">${txt}</text></g>`; };
const chocBar = (x, y, s, r = 0, bitten = false) => { let h = `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><rect x="-120" y="-76" width="240" height="152" rx="12" fill="#6B3A1E" stroke="${INK}" stroke-width="8"/>`;
  for (let rr = 0; rr < 3; rr++) for (let c = 0; c < 4; c++) h += `<rect x="${-106 + c * 54}" y="${-62 + rr * 44}" width="46" height="36" rx="5" fill="#86512D" stroke="#4A2412" stroke-width="3"/><path d="M${-100 + c * 54} ${-56 + rr * 44} L${-70 + c * 54} ${-56 + rr * 44}" stroke="#A86B42" stroke-width="4" stroke-linecap="round"/>`;
  if (bitten) h += `<circle cx="120" cy="-76" r="40" fill="#FFE3EC"/><path d="M80 -76 Q88 -46 120 -36" fill="none" stroke="${INK}" stroke-width="7"/>`;
  return h + `</g>`; };
const wrapper = (x, y, s, r = 0) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="M-130 -84 L130 -84 L130 84 L-130 84 Z" fill="#C8102E" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M-130 -84 L-60 -84 L-100 84 L-130 84 Z" fill="#E33A52"/><rect x="-60" y="-30" width="120" height="60" rx="10" fill="#F7E733" stroke="${INK}" stroke-width="5"/></g>`;
const calendar = (x, y, s, r, big, small) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><rect x="-90" y="-100" width="180" height="200" rx="16" fill="#FFFFFF" stroke="${INK}" stroke-width="8"/><rect x="-90" y="-100" width="180" height="56" rx="16" fill="${RED}" stroke="${INK}" stroke-width="8"/><rect x="-82" y="-60" width="164" height="18" fill="${RED}"/><circle cx="-44" cy="-100" r="10" fill="#FFF" stroke="${INK}" stroke-width="5"/><circle cx="44" cy="-100" r="10" fill="#FFF" stroke="${INK}" stroke-width="5"/><text x="0" y="-60" text-anchor="middle" font-family="Black Han Sans" font-size="34" fill="#FFF">${small}</text><text x="0" y="62" text-anchor="middle" font-family="Black Han Sans" font-size="96" fill="${INK}">${big}</text></g>`;
const lineBoard = (x, y, s) => { const L = (lx, len, c, lab) => `<line x1="${lx}" y1="${60 - len}" x2="${lx}" y2="60" stroke="${c}" stroke-width="16" stroke-linecap="round"/><text x="${lx}" y="112" text-anchor="middle" font-family="Black Han Sans" font-size="48" fill="${INK}">${lab}</text>`;
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-300" y="-190" width="600" height="340" rx="22" fill="#FFFFFF" stroke="${INK}" stroke-width="10"/>`
  + `<line x1="-210" y1="-90" x2="-210" y2="60" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><text x="-210" y="112" text-anchor="middle" font-family="Black Han Sans" font-size="40" fill="#8A93A6">기준</text>`
  + `<line x1="-140" y1="-150" x2="-140" y2="120" stroke="#E2E6EE" stroke-width="5" stroke-dasharray="10 12"/>`
  + L(-40, 110, '#5B6B86', 'A') + L(90, 150, '#3E9E48', 'B') + L(220, 215, '#5B6B86', 'C') + `</g>`; };

// ---------- 005 A: 시련 없는 삶, 덜 행복했다 ----------
V.nietA = () => {
  let h = `<rect width="1280" height="720" fill="url(#skyA)"/><circle cx="1040" cy="300" r="380" fill="url(#warm)"/>`;
  h += mtn(770, 640, 300, 300, '#A9C1F0') + mtn(1110, 640, 340, 380, '#8EABE6');
  h += cloud(660, 360, 1.15, '#6D7690') + rain(590, 410, 5, 1.1) + bolt(700, 420, 0.75, YEL);
  h += hills('#A6DE86', '#7CC768');
  h += shadow(950, 712, 128) + Z({ x: 950, y: 732, s: 0.96, pose: '만세', ex: EX('신남'), look: [0, -0.3], stache: '#4A3426' });
  h += bandaid(1003, 318, -24, 0.92);
  h += sparkle(1150, 300, 0.85) + sparkle(810, 250, 0.6, WHITE) + sparkle(1210, 470, 0.55);
  return h;
};
// ---------- 005 B: 정답 뻔한데, 75%가 오답 ----------
V.nietB = () => {
  let h = `<rect width="1280" height="720" fill="url(#wall)"/>`;
  h += `<rect x="-20" y="610" width="1320" height="130" fill="#E9CFA4" stroke="${INK}" stroke-width="8"/>`;
  h += lineBoard(960, 360, 0.86);
  h += bubble(130, 470, 'A!', { w: 130, h: 96, fs: 64, rot: -8 }) + bubble(660, 400, 'A!', { w: 130, h: 96, fs: 64, rot: 6 }) + bubble(170, 610, 'A!', { w: 116, h: 88, fs: 56, rot: 4 }) + bubble(700, 540, 'A!', { w: 116, h: 88, fs: 56, rot: -5 });
  h += Z({ x: 420, y: 846, s: 0.9, pose: '서기', ex: EX('걱정'), look: [0.7, -0.5], tilt: 4, stache: '#4A3426' }) + sweat(530, 400, 1.25) + sweat(300, 440, 1.0);
  h += bubble(560, 660, 'B…?', { w: 150, h: 76, fs: 44, rot: 0, bg: '#FFF4B8', tail: 'none' });
  return h;
};
// ---------- 006 A: 걱정의 91%, 헛걱정이었다 ----------
V.stoaA = () => {
  let h = `<rect width="1280" height="720" fill="url(#skyA)"/><circle cx="1060" cy="250" r="340" fill="url(#warm)"/>`;
  h += hills('#A6DE86', '#7CC768');
  // worries drifting into the not-mine crate
  const arc = (x0, y0, x1, y1) => `<path d="M${x0} ${y0} Q${(x0 + x1) / 2 + 60} ${(y0 + y1) / 2 - 40} ${x1} ${y1}" fill="none" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" stroke-dasharray="4 22" opacity=".95"/>`;
  h += arc(1150, 250, 1010, 330) + arc(1010, 380, 920, 450);
  h += cloud(1170, 190, 0.8, '#6D7690', '?', 78) + cloud(1020, 330, 0.68, '#6D7690', '?', 78) + cloud(900, 430, 0.56, '#7C859E', '?', 74);
  h += cloud(1210, 380, 0.46, '#FFFFFF', '', 40) + sparkle(1240, 470, 0.6, WHITE) + sparkle(760, 330, 0.6) + sparkle(1080, 470, 0.45);
  h += `<g transform="translate(880 568) scale(0.92)"><path d="M-190 -60 L190 -60 L172 120 L-172 120 Z" fill="#B57D48" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>`
    + [0, 1, 2].map(i => `<line x1="${-182 + i * 4}" y1="${-10 + i * 44}" x2="${182 - i * 4}" y2="${-10 + i * 44}" stroke="#8A5A30" stroke-width="6"/>`).join('')
    + `<rect x="-128" y="10" width="256" height="70" rx="16" fill="#FFFFFF" stroke="${INK}" stroke-width="7"/><text x="0" y="60" text-anchor="middle" font-family="Black Han Sans" font-size="48" fill="${INK}">내 것 아님</text></g>`;
  h += shadow(380, 712, 116) + Z({ x: 380, y: 728, s: 0.88, pose: '손인사', ex: EX('뿌듯'), look: [0.7, -0.2] });
  return h;
};
// ---------- 006 B: 초콜릿 1주 끊자, 더 맛있어졌다 ----------
V.stoaB = () => {
  let h = `<rect width="1280" height="720" fill="url(#pinkbg)"/>` + rays(1000, 470, 'rgba(0,0,0,0)', 'rgba(255,255,255,.45)', 20);
  h += `<path d="M-20 650 Q640 620 1300 650 L1300 740 L-20 740 Z" fill="#F7B9CC" stroke="${INK}" stroke-width="6"/>`;
  h += `<circle cx="1000" cy="470" r="260" fill="url(#warm)"/>`;
  h += wrapper(985, 505, 0.6, 12) + chocBar(935, 395, 1.1, -10, true);
  h += sparkle(1150, 270, 0.85) + sparkle(780, 290, 0.65, WHITE) + sparkle(1180, 470, 0.5) + sparkle(760, 520, 0.5);
  h += calendar(660, 480, 0.6, -8, '7일', '참기');
  h += shadow(380, 712, 112) + Z({ x: 380, y: 726, s: 0.86, pose: '만세', ex: EX('신남'), look: [0.6, -0.2] });
  return h;
};
"""

TEXT2 = {
    'nietA': [('시련 없는 삶', 40, 26, 96, '#FFFFFF', 0), ('덜 행복했다', 30, 124, 160, '#F7E733', -2)],
    'nietB': [('정답 뻔한데', 40, 26, 96, '#FFFFFF', 0), ('75%가 오답', 30, 124, 160, '#F7E733', -2)],
    'stoaA': [('걱정의 91%', 40, 26, 104, '#FFFFFF', 0), ('헛걱정이었다', 30, 130, 150, '#F7E733', -2)],
    'stoaB': [('초콜릿 1주 끊자', 40, 26, 92, '#FFFFFF', 0), ('더 맛있어졌다', 30, 120, 146, '#F7E733', -2)],
}


def page2(v):
    fonts = os.path.join(R, 'thumb3', 'node_modules', '@fontsource')
    return f"""<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="file://{fonts}/black-han-sans/index.css">
<style>body{{margin:0;background:#000}} #wrap{{width:1280px;height:720px;position:relative;overflow:hidden}}
.t{{position:absolute;white-space:nowrap;font-family:'Black Han Sans';line-height:1.05;letter-spacing:-1px;paint-order:stroke fill;transform-origin:left center}}
.pill{{position:absolute;white-space:nowrap;font-family:'Black Han Sans';color:#141414;padding:6px 26px 12px;border:7px solid #141414;border-radius:22px;box-shadow:0 8px 0 rgba(0,0,0,.35)}}
svg{{position:absolute;left:0;top:0}}</style>
<script src="file://{R}/shorts/engine.js"></script>
<script>{B.LIB}
{B.SCENES}
{SCENES2}</script></head><body><div id="wrap">
<svg id="v" width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg"></svg>
{B.text_html(TEXT2[v])}
</div><script>document.getElementById('v').innerHTML = defsAll() + V['{v}']();</script></body></html>"""


if __name__ == '__main__':
    names = sys.argv[1:] or list(TEXT2)
    with sync_playwright() as p:
        b = p.chromium.launch()
        for v in names:
            path = os.path.join(HERE, f'_{v}.html')
            open(path, 'w', encoding='utf-8').write(page2(v))
            pg = b.new_page(viewport={'width': 1280, 'height': 720}, device_scale_factor=2)
            errs = []
            pg.on('pageerror', lambda e: errs.append(str(e)))
            pg.goto('file://' + path)
            pg.evaluate('document.fonts.ready')
            pg.wait_for_timeout(500)
            out2 = os.path.join(HERE, f'{v}@2x.png')
            pg.locator('#wrap').screenshot(path=out2)
            Image.open(out2).convert('RGB').resize((1280, 720), Image.LANCZOS).save(os.path.join(HERE, f'{v}.png'))
            pg.close()
            print(v, errs or 'ok')
        b.close()
    ims = [Image.open(os.path.join(HERE, f'{v}.png')).resize((640, 360)) for v in TEXT2]
    sheet = Image.new('RGB', (1290, 730), 'white')
    for i, im in enumerate(ims):
        sheet.paste(im, ((i % 2) * 650, (i // 2) * 370))
    sheet.save(os.path.join(HERE, 'sheet_ns.jpg'), quality=88)
