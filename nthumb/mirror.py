"""'거울' thumbnails: the viewer's own situation as a question, Zero's big face carrying the feeling,
the philosopher as a small guide medallion (bottom-left, clear of the duration badge).
usage: DSF=1.5 python3 mirror.py [keys...]"""
import os, sys, json
from PIL import Image
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__)); SP = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(SP, 'ctr', 'thumbs')); import build as B
PORT = os.path.join(SP, 'portraits')

# key: (line1, line2, scene fn, guide)  guide = (portrait, fx, fy, r_src, name, sub) or ('pill', text)
EPS = {
 'stoic':    ('작은 일에도', '멘탈이 흔들린다면', 'sStoic', ('_p_stoic.jpg', 330, 400, 300, '마르쿠스 아우렐리우스', '로마 황제의 처방')),
 'descartes':('단톡방 속보,', '그냥 믿었다면?', 'sDesc', ('_p_descartes.jpg', 420, 400, 260, '데카르트', '400년 전 의심법')),
 'zhuangzi': ('나만', '쓸모없는 것 같을 때', 'sZhuang', ('_p_zhuangzi.jpg', 420, 360, 240, '장자', '쓸모없음의 쓸모')),
 'socrates': ('아는 척', '끄덕인 적 있다면?', 'sSocr', ('_p_socrates.jpg', 540, 170, 150, '소크라테스', '모른다고 말하는 용기')),
 'buddha':   ('몸은 여기,', '마음은 딴 데라면', 'sBuddha', ('_p_buddha.jpg', 405, 360, 230, '붓다', '지금 여기에 사는 법')),
 'time':     ('올해 기억나는 날,', '며칠이나 되나요?', 'sTime', ('pill', '심리학 실험 · 시간')),
 'anger':    ('화나서 보낸 메시지,', '후회한 적 있다면', 'sAnger', ('pill', '심리학 실험 · 화')),
 'mom':      ('요즘', '좋은 일이 하나도 없다면', 'sMom', ('pill', '심리학 실험 · 감사일기')),
}

SVG = r"""
const ZB = (o) => Z(Object.assign({ x: 1010, y: 915, s: 1.25, pose: '서기' }, o));
const glow = (cx, cy, r, op) => `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r}" fill="url(#warm)" opacity="${op}"/>`;
const bg = () => `<rect width="1280" height="720" fill="#1E2840"/>` + glow(1010, 420, 380, .28);
const card = (x, y, w, icon, ic, txt, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="${-w / 2}" y="-34" width="${w}" height="68" rx="18" fill="#fff" stroke="${INK}" stroke-width="6"/>
  <circle cx="${-w / 2 + 36}" cy="0" r="20" fill="${ic}" stroke="${INK}" stroke-width="4"/><text x="${-w / 2 + 36}" y="9" text-anchor="middle" font-family="Black Han Sans" font-size="24" fill="#fff">${icon}</text>
  <text x="${-w / 2 + 66}" y="11" font-family="Black Han Sans" font-size="31" fill="${INK}">${txt}</text></g>`;
const wob = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"><path d="M-20 -30 Q-34 0 -20 30"/><path d="M-44 -44 Q-64 0 -44 44"/></g>`;
const qm = (x, y, s, c = YEL) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Black Han Sans" font-size="${s}" fill="${c}" stroke="${INK}" stroke-width="9" paint-order="stroke fill">?</text>`;
function sStoic() {
  let h = bg();
  h += ZB({ ex: EX('겁먹음'), look: [-0.5, 0], tilt: -4 });
  h += card(620, 330, 380, '!', '#FF6B6B', '팀장: 잠깐 볼까요?', -4) + card(660, 430, 300, '✕', '#8E7CC3', '악플 1개', 3) + card(610, 530, 330, '!', '#F5A623', '차 막힘 40분', -2);
  h += wob(848, 380, 1.1) + sweat(1150, 300, 1.3);
  return h;
}
function sDesc() {
  let h = bg();
  h += ZB({ ex: EX('놀람'), look: [-0.6, 0.1] });
  h += `<g transform="translate(640 430) rotate(-6)"><rect x="-200" y="-120" width="400" height="240" rx="22" fill="#fff" stroke="${INK}" stroke-width="7"/>
    <text x="-170" y="-58" font-family="Black Han Sans" font-size="40" fill="${RED}">[속보] 충격!!</text>
    <rect x="-170" y="-30" width="340" height="16" rx="8" fill="#C9D3E0"/><rect x="-170" y="0" width="280" height="16" rx="8" fill="#C9D3E0"/>
    <g transform="translate(110 70)"><rect x="-64" y="-28" width="128" height="56" rx="28" fill="#4C8DF6" stroke="${INK}" stroke-width="5"/><text x="0" y="12" text-anchor="middle" font-family="Black Han Sans" font-size="30" fill="#fff">공유</text></g>
    <text x="-170" y="84" font-family="Black Han Sans" font-size="30" fill="#8A93A3">단톡방 · 방금</text></g>`;
  h += qm(860, 330, 110) + qm(1180, 280, 80);
  return h;
}
function sZhuang() {
  let h = bg();
  h += ZB({ x: 1040, ex: EX('지침'), look: [-0.4, 0.2], tilt: 6 });
  // tall ruler
  h += `<g transform="translate(735 500) rotate(-3)"><rect x="-46" y="-220" width="92" height="460" rx="10" fill="#F7D774" stroke="${INK}" stroke-width="7"/>`;
  for (let i = 0; i < 11; i++) h += `<line x1="-46" y1="${-200 + i * 40}" x2="${i % 5 === 0 ? -6 : -22}" y2="${-200 + i * 40}" stroke="${INK}" stroke-width="5"/>`;
  h += `<text x="18" y="-120" font-family="Black Han Sans" font-size="40" fill="${INK}" writing-mode="tb">쓸모</text>`;
  h += `<line x1="-70" y1="170" x2="60" y2="170" stroke="${RED}" stroke-width="9"/><g transform="translate(-150 170)"><rect x="-74" y="-30" width="148" height="60" rx="30" fill="${RED}" stroke="${INK}" stroke-width="5"/><text x="0" y="12" text-anchor="middle" font-family="Black Han Sans" font-size="34" fill="#fff">20cm</text></g></g>`;
  h += card(480, 330, 270, '✓', '#2DBE7E', '6시 기상 갓생', -5) + card(470, 430, 270, '✓', '#2DBE7E', '자격증 합격!', 4);
  h += sweat(1190, 300, 1.2);
  return h;
}
function sSocr() {
  let h = bg();
  h += ZB({ ex: EX('걱정'), look: [-0.6, -0.1], tilt: -6 });
  h += `<g transform="translate(600 440)"><path d="M-190 -80 Q-190 -114 -156 -114 L176 -114 Q210 -114 210 -80 L210 50 Q210 84 176 84 L-156 84 Q-190 84 -190 50 L-190 30 L-282 62 L-190 -10 Z" fill="#fff" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
    <text x="10" y="-14" text-anchor="middle" font-family="Black Han Sans" font-size="58" fill="${INK}">린하게,</text><text x="10" y="54" text-anchor="middle" font-family="Black Han Sans" font-size="58" fill="${INK}">피벗 각!</text></g>`;
  h += `<g transform="translate(450 318)"><rect x="-64" y="-26" width="128" height="48" rx="14" fill="#C3CDD8" stroke="${INK}" stroke-width="5"/><text x="0" y="12" text-anchor="middle" font-family="Black Han Sans" font-size="30" fill="${INK}">팀장님</text></g>`;
  h += `<text x="1010" y="250" text-anchor="middle" font-family="Black Han Sans" font-size="96" fill="${YEL}" stroke="${INK}" stroke-width="10" paint-order="stroke fill">???</text>`;
  h += sweat(1180, 330, 1.3) + sweat(840, 360, 1.0);
  return h;
}
function thought(x, y, s, txt) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-120 40 Q-160 40 -160 4 Q-160 -34 -118 -36 Q-108 -80 -48 -76 Q-20 -110 34 -94 Q90 -104 104 -52 Q156 -48 154 2 Q152 40 110 40 Z" fill="#fff" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
  <text x="0" y="12" text-anchor="middle" font-family="Black Han Sans" font-size="40" fill="${INK}">${txt}</text></g>`;
}
function sBuddha() {
  let h = bg();
  h += ZB({ ex: EX('지침'), look: [-0.4, 0.4] });
  h += phone(820, 520, 1.05, { rot: 12, glow: .5 });
  h += thought(560, 330, 1.0, '답장해야지…') + thought(620, 470, 0.9, '내일 걱정');
  h += `<g transform="translate(1010 760)"><ellipse cx="0" cy="-60" rx="150" ry="40" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="M-150 -60 Q-140 40 0 40 Q140 40 150 -60" fill="#E9EEF5" stroke="${INK}" stroke-width="7"/></g>`;
  return h;
}
function sTime() {
  let h = bg();
  h += ZB({ x: 1060, ex: EX('놀람'), look: [-0.6, 0.2] });
  h += `<g transform="translate(640 430) rotate(-5)"><rect x="-230" y="-190" width="460" height="380" rx="18" fill="#fff" stroke="${INK}" stroke-width="7"/><rect x="-230" y="-190" width="460" height="70" rx="18" fill="${RED}" stroke="${INK}" stroke-width="7"/>
    <text x="0" y="-140" text-anchor="middle" font-family="Black Han Sans" font-size="42" fill="#fff">2026</text>`;
  const lit = { 3: '#FFD84D', 17: '#7FD3FF', 29: '#FF9EC4' };
  for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) { const i = r * 7 + c, x = -200 + c * 58, y = -100 + r * 56;
    h += `<rect x="${x}" y="${y}" width="46" height="44" rx="8" fill="${lit[i] || '#E3E7EE'}" stroke="${lit[i] ? INK : '#C9D0DA'}" stroke-width="${lit[i] ? 5 : 3}"/>`;
    if (lit[i]) h += `<text x="${x + 23}" y="${y + 33}" text-anchor="middle" font-size="28">★</text>`; }
  h += `</g>`;
  return h;
}
function sAnger() {
  let h = bg();
  h += ZB({ ex: EX('결심'), look: [-0.5, 0.2] });
  h += `<g transform="translate(640 450) rotate(-6)"><rect x="-210" y="-140" width="420" height="280" rx="24" fill="#fff" stroke="${INK}" stroke-width="7"/>
    <rect x="-180" y="-104" width="330" height="96" rx="22" fill="#FFE1E1" stroke="${RED}" stroke-width="5"/><text x="-160" y="-44" font-family="Black Han Sans" font-size="40" fill="${RED}">너 진짜 왜 그래?!</text>
    <g transform="translate(110 76)"><rect x="-78" y="-32" width="156" height="64" rx="32" fill="${RED}" stroke="${INK}" stroke-width="6"/><text x="0" y="13" text-anchor="middle" font-family="Black Han Sans" font-size="36" fill="#fff">전송</text></g>
    <path d="M-150 60 L-60 60" stroke="#C9D3E0" stroke-width="14" stroke-linecap="round"/></g>`;
  h += `<g fill="#fff" stroke="${INK}" stroke-width="6" opacity=".95"><path d="M900 250 q-20 -30 0 -60 q20 -30 0 -60" fill="none"/><path d="M1120 250 q-20 -30 0 -60 q20 -30 0 -60" fill="none"/></g>`;
  h += bolt(860, 300, 0.9, RED);
  return h;
}
function sMom() {
  let h = bg();
  h += ZB({ ex: EX('지침'), look: [0, 0.4] });
  h += `<g transform="translate(1010 205) scale(1.15)"><path d="M-150 60 Q-200 60 -200 14 Q-200 -36 -146 -38 Q-138 -104 -60 -100 Q-24 -150 44 -128 Q114 -142 132 -70 Q196 -64 194 0 Q192 60 140 60 Z" fill="#6E7A8C" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/></g>`;
  for (const [x, y] of [[90, 60], [70, 220], [-90, 160]]) h += `<g transform="translate(${1010 + x} ${y})"><circle r="34" fill="url(#warm)"/>` + sparkle(0, 0, 0.55) + `</g>`;
  h += `<g transform="translate(640 470) rotate(-8)"><rect x="-110" y="-140" width="220" height="280" rx="12" fill="#7A5236" stroke="${INK}" stroke-width="7"/><rect x="-62" y="-90" width="124" height="54" rx="6" fill="#F1DFBA" stroke="${INK}" stroke-width="4"/>
    <text x="0" y="-52" text-anchor="middle" font-family="'Nanum Pen Script', Black Han Sans" font-size="40" fill="#4A3424">1998</text><text x="0" y="40" text-anchor="middle" font-family="Black Han Sans" font-size="30" fill="#F1DFBA">좋았던 일</text></g>`;
  return h;
}
"""


def head_html(l1, l2):
    def fit(t, target, maxw=760):
        units = sum(0.98 if '가' <= ch <= '힣' else (0.32 if ch == ' ' else 0.6) for ch in t)
        return min(target, int(maxw / max(units, 1)))
    f1, f2 = fit(l1, 92), fit(l2, 118)
    out = []
    for txt, y, fs, col, rot in [(l1, 26, f1, '#FFFFFF', 0), (l2, 26 + int(f1 * 1.08), f2, '#F7E733', -2)]:
        sw = max(14, round(fs * 0.16))
        out.append(f'<div class="t" style="left:40px;top:{y}px;font-size:{fs}px;color:{col};-webkit-text-stroke:{sw}px #141414;'
                   f'text-shadow:0 {max(6, fs // 18)}px 0 rgba(0,0,0,.35);transform:rotate({rot}deg)">{txt}</div>')
    return '\n'.join(out)


def guide_svg(g):
    if g[0] == 'pill':
        return f"""<g transform="translate(40 618)"><rect x="0" y="0" width="{len(g[1]) * 30 + 56}" height="66" rx="33" fill="#2B3A5E" stroke="#141414" stroke-width="6"/>
<text x="28" y="44" font-family="Black Han Sans" font-size="32" fill="#7FE0C2">🔬 {g[1]}</text></g>"""
    fn, fx, fy, r, name, sub = g
    R, cx, cy = 84, 130, 610
    k = R / r
    w = max(len(name) * 34, len(sub) * 26) + 50
    return f"""<g><circle cx="{cx}" cy="{cy}" r="{R + 10}" fill="#C9A24E" stroke="#141414" stroke-width="7"/>
<clipPath id="med"><circle cx="{cx}" cy="{cy}" r="{R}"/></clipPath>
<image href="file://{PORT}/{fn}" x="{cx - fx * k:.1f}" y="{cy - fy * k:.1f}" width="{840 * k:.1f}" height="{1050 * k:.1f}" clip-path="url(#med)" preserveAspectRatio="none"/>
<circle cx="{cx}" cy="{cy}" r="{R}" fill="none" stroke="#141414" stroke-width="5"/>
<g transform="translate({cx + R + 18} {cy - 52})"><rect x="0" y="0" width="{w}" height="104" rx="20" fill="#FFFDF4" stroke="#141414" stroke-width="6"/>
<text x="24" y="44" font-family="Black Han Sans" font-size="34" fill="#141414">{name}</text>
<text x="24" y="84" font-family="Black Han Sans" font-size="26" fill="#8A6A44">{sub}</text></g></g>"""


def page(key):
    l1, l2, fn, g = EPS[key]
    fonts = os.path.join(SP, 'thumb3', 'node_modules', '@fontsource')
    return f"""<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="file://{fonts}/black-han-sans/index.css">
<style>body{{margin:0;background:#000}} #wrap{{width:1280px;height:720px;position:relative;overflow:hidden}}
.t{{position:absolute;white-space:nowrap;font-family:'Black Han Sans';line-height:1.05;letter-spacing:-1px;paint-order:stroke fill;transform-origin:left center}}
svg{{position:absolute;left:0;top:0}}</style>
<script src="file://{SP}/shorts/engine.js"></script>
<script>{B.LIB}
{B.SCENES}
{SVG}</script></head><body><div id="wrap">
<svg id="v" width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg"></svg>
{head_html(l1, l2)}
<svg id="g" width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">{guide_svg(g)}</svg>
</div><script>document.getElementById('v').innerHTML = defsAll() + {fn}();</script></body></html>"""


if __name__ == '__main__':
    keys = sys.argv[1:] or list(EPS)
    with sync_playwright() as p:
        br = p.chromium.launch(args=['--allow-file-access-from-files'])
        pg = br.new_page(viewport={'width': 1280, 'height': 720}, device_scale_factor=float(os.environ.get('DSF', '1')))
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        for k in keys:
            f = os.path.join(HERE, f'_mir_{k}.html'); open(f, 'w', encoding='utf-8').write(page(k))
            pg.goto('file://' + f); pg.wait_for_timeout(900)
            out = os.path.join(HERE, f'mirror_{k}.png'); pg.locator('#wrap').screenshot(path=out)
            print(k, 'ok', errs[-1:] if errs else ''); errs.clear()
        br.close()
