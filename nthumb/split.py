"""Before → after thumbnails: left = the worry (stormy, dark), right = what changed (clear sky), split diagonally.
Headline: '[이랬던] 내가' / '[이렇게 됐다]'. Philosopher = small medallion on the split (the bridge between the two).
usage: DSF=1.5 python3 split.py [keys...]"""
import os, sys
from PIL import Image
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__)); SP = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(SP, 'ctr', 'thumbs')); import build as B
PORT = os.path.join(SP, 'portraits')

# key: (line1, line2, left pill, right pill, scene, guide)
EPS = {
 'stoic':    ('작은 일에 흔들리던 내가', '일주일 만에 단단해졌다', '흔들리던 나', '단단해진 나', 'sStoic', ('_p_stoic.jpg', 330, 400, 300, '스토아 철학')),
 'descartes':('속보 보면 바로 믿던 내가', '10초 의심하게 됐다', '바로 믿던 나', '한 번 의심하는 나', 'sDesc', ('_p_descartes.jpg', 420, 400, 260, '데카르트 철학')),
 'zhuangzi': ('나만 쓸모없다 느끼던 내가', '남의 잣대를 내려놨다', '남과 재던 나', '나다운 나', 'sZhuang', ('_p_zhuangzi.jpg', 420, 360, 240, '장자 철학')),
 'socrates': ('아는 척 끄덕이던 내가', '처음으로 손을 들었다', '아는 척하던 나', '묻는 나', 'sSocr', ('_p_socrates.jpg', 540, 170, 150, '소크라테스 철학')),
 'buddha':   ('밥 먹으며 폰만 보던 내가', '점심 맛을 되찾았다', '마음은 딴 데', '지금 여기', 'sBuddha', ('_p_buddha.jpg', 405, 360, 230, '붓다 철학')),
 'time':     ('1년이 순식간이던 내가', '오늘이 제일 길었다', '늘 같은 하루', '매일 처음', 'sTime', ('pill', '심리학 실험')),
 'anger':    ('화나면 바로 보내던 내가', '친구를 잃지 않았다', '보내기 직전', '하룻밤 뒤', 'sAnger', ('pill', '심리학 실험')),
 'mom':      ('좋은 일 하나 없던 일주일,', '별 세 개를 적었더니', '구름만 보던 나', '별을 찾은 나', 'sMom', ('pill', '심리학 실험')),
}

SVG = r"""
const ZL = (o) => Z(Object.assign({ x: 290, y: 805, s: 0.85, pose: '서기' }, o));
const ZR = (o) => Z(Object.assign({ x: 1000, y: 890, s: 1.05, pose: '서기' }, o));
function base() {
  let h = `<defs><linearGradient id="storm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3B4558"/><stop offset="1" stop-color="#1A2030"/></linearGradient>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6EC3FF"/><stop offset=".7" stop-color="#CDEEFF"/><stop offset="1" stop-color="#FFF4D6"/></linearGradient>
  <linearGradient id="topscrim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B111C" stop-opacity=".5"/><stop offset="1" stop-color="#0B111C" stop-opacity="0"/></linearGradient>
  <clipPath id="Lc"><path d="M0 0 L700 0 L560 720 L0 720 Z"/></clipPath><clipPath id="Rc"><path d="M700 0 L1280 0 L1280 720 L560 720 Z"/></clipPath></defs>`;
  h += `<rect width="1280" height="720" fill="url(#sky)"/><ellipse cx="1060" cy="250" rx="360" ry="360" fill="url(#warm)" opacity=".9"/>`;
  h += `<g clip-path="url(#Lc)"><rect width="1280" height="720" fill="url(#storm)"/>`;
  for (let i = 0; i < 46; i++) { const x = (i * 97) % 700, y = 260 + (i * 53) % 440; h += `<line x1="${x}" y1="${y}" x2="${x - 10}" y2="${y + 26}" stroke="#8FB4E0" stroke-width="3" opacity=".45"/>`; }
  h += `</g>`;
  return h;
}
const seam = () => `<path d="M700 0 L560 720" stroke="#141414" stroke-width="16"/><path d="M700 0 L560 720" stroke="#FFFFFF" stroke-width="7"/>`;
const arrow = () => { const d = 'M430 610 Q600 520 770 560'; return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="34" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${YEL}" stroke-width="20" stroke-linecap="round"/><g transform="translate(786 566) rotate(22)"><path d="M-34 -40 L30 0 L-34 40 Z" fill="${YEL}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/></g>`; };
const scrim = () => `<rect width="1280" height="300" fill="url(#topscrim)"/>`;
const rainCloud = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-150 60 Q-200 60 -200 14 Q-200 -36 -146 -38 Q-138 -104 -60 -100 Q-24 -150 44 -128 Q114 -142 132 -70 Q196 -64 194 0 Q192 60 140 60 Z" fill="#6E7A8C" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/></g>`;
const card = (x, y, w, icon, ic, txt, rot = 0, fs = 27) => `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="${-w / 2}" y="-30" width="${w}" height="60" rx="16" fill="#fff" stroke="${INK}" stroke-width="5"/>
  <circle cx="${-w / 2 + 32}" cy="0" r="17" fill="${ic}" stroke="${INK}" stroke-width="4"/><text x="${-w / 2 + 32}" y="8" text-anchor="middle" font-family="Black Han Sans" font-size="21" fill="#fff">${icon}</text>
  <text x="${-w / 2 + 58}" y="10" font-family="Black Han Sans" font-size="${fs}" fill="${INK}">${txt}</text></g>`;
const bubble = (x, y, w, lines, o = {}) => { const hh = 30 + lines.length * 50; let s = `<g transform="translate(${x} ${y})"><rect x="${-w / 2}" y="${-hh / 2}" width="${w}" height="${hh}" rx="24" fill="#fff" stroke="${INK}" stroke-width="7"/>`;
  if (o.tail) s += `<path d="${o.tail}" fill="#fff" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><rect x="${-w / 2 + 6}" y="${-hh / 2 + 6}" width="${w - 12}" height="${hh - 12}" rx="20" fill="#fff"/>`;
  lines.forEach((l, i) => { s += `<text x="0" y="${-hh / 2 + 56 + i * 50}" text-anchor="middle" font-family="Black Han Sans" font-size="${o.fs || 42}" fill="${o.color || INK}">${l}</text>`; });
  return s + `</g>`; };
const qm = (x, y, s, t = '?') => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Black Han Sans" font-size="${s}" fill="${YEL}" stroke="${INK}" stroke-width="9" paint-order="stroke fill">${t}</text>`;
const shine = (x, y, s) => sparkle(x, y, s);
function sStoic() {
  let h = base();
  h += rainCloud(350, 300, 0.7) + ZL({ x: 360, ex: EX('겁먹음'), look: [-0.3, -0.2], tilt: -5 }) + sweat(465, 420, 1.0);
  h += card(118, 380, 200, '!', '#FF6B6B', '팀장: 잠깐…', -6, 24) + card(118, 465, 180, '✕', '#8E7CC3', '악플 1개', 5, 24) + card(118, 550, 180, '!', '#F5A623', '차 막힘', -3, 24);
  h += ZR({ ex: EX('뿌듯'), look: [-0.2, -0.1] });
  h += `<g transform="translate(830 420) rotate(-6)"><rect x="-70" y="-50" width="140" height="110" rx="10" fill="#C99A5B" stroke="${INK}" stroke-width="6"/><rect x="-80" y="-66" width="160" height="30" rx="8" fill="#B5864A" stroke="${INK}" stroke-width="6"/>
    <text x="0" y="22" text-anchor="middle" font-family="Black Han Sans" font-size="25" fill="#fff">내 것 아님</text></g>` + shine(850, 300, 0.9);
  return h;
}
function sDesc() {
  let h = base();
  h += ZL({ x: 375, ex: EX('놀람'), look: [-0.6, 0.2] }) + qm(490, 380, 90);
  h += `<g transform="translate(130 470) rotate(-6) scale(.88)"><rect x="-120" y="-80" width="240" height="160" rx="18" fill="#fff" stroke="${INK}" stroke-width="6"/><text x="-100" y="-34" font-family="Black Han Sans" font-size="30" fill="${RED}">[속보] 충격!!</text>
    <rect x="-100" y="-14" width="200" height="12" rx="6" fill="#C9D3E0"/><g transform="translate(50 46)"><rect x="-50" y="-22" width="100" height="44" rx="22" fill="#4C8DF6" stroke="${INK}" stroke-width="4"/><text x="0" y="10" text-anchor="middle" font-family="Black Han Sans" font-size="24" fill="#fff">공유</text></g></g>`;
  h += ZR({ ex: EX('결심'), look: [-0.5, 0] });
  h += `<g transform="translate(840 360) rotate(-8)"><rect x="-110" y="-74" width="220" height="148" rx="16" fill="#fff" stroke="${INK}" stroke-width="6"/><text x="-90" y="-28" font-family="Black Han Sans" font-size="28" fill="#8A93A3">[속보] 충격!!</text>
    <g transform="translate(20 22) rotate(-12)"><rect x="-80" y="-30" width="160" height="60" rx="10" fill="none" stroke="${RED}" stroke-width="7"/><text x="0" y="14" text-anchor="middle" font-family="Black Han Sans" font-size="38" fill="${RED}">가짜!</text></g></g>`;
  h += `<g transform="translate(1170 470) rotate(30)"><circle r="54" fill="#DFF4FF" fill-opacity=".7" stroke="${INK}" stroke-width="10"/><rect x="-12" y="54" width="24" height="90" rx="10" fill="#8C6638" stroke="${INK}" stroke-width="6"/></g>`;
  return h;
}
function sZhuang() {
  let h = base();
  h += ZL({ x: 360, ex: EX('지침'), look: [-0.4, 0.3], tilt: 6 });
  h += `<g transform="translate(140 520) rotate(-3)"><rect x="-36" y="-200" width="72" height="400" rx="8" fill="#F7D774" stroke="${INK}" stroke-width="6"/>`;
  for (let i = 0; i < 10; i++) h += `<line x1="-36" y1="${-180 + i * 40}" x2="${i % 5 === 0 ? -4 : -18}" y2="${-180 + i * 40}" stroke="${INK}" stroke-width="4"/>`;
  h += `<line x1="-56" y1="150" x2="50" y2="150" stroke="${RED}" stroke-width="8"/></g><g transform="translate(140 690)"><rect x="-64" y="-26" width="128" height="52" rx="26" fill="${RED}" stroke="${INK}" stroke-width="5"/><text x="0" y="11" text-anchor="middle" font-family="Black Han Sans" font-size="30" fill="#fff">20cm</text></g>`;
  h += tree(1190, 610, 1.4) + ZR({ x: 960, ex: EX('신남'), look: [0, 0] }) + shine(820, 330, 0.9);
  return h;
}
function sSocr() {
  let h = base();
  h += bubble(150, 400, 240, ['린하게,', '피벗 각!'], { fs: 36 }) + `<g transform="translate(80 325)"><rect x="-56" y="-22" width="112" height="44" rx="12" fill="#C3CDD8" stroke="${INK}" stroke-width="4"/><text x="0" y="10" text-anchor="middle" font-family="Black Han Sans" font-size="26" fill="${INK}">팀장님</text></g>`;
  h += ZL({ x: 385, ex: EX('걱정'), look: [-0.5, -0.2], tilt: -5 }) + qm(385, 370, 70, '???') + sweat(495, 430, 1);
  h += ZR({ pose: '손인사', ex: EX('결심'), look: [-0.4, -0.2] });
  h += bubble(860, 330, 280, ['무슨 뜻', '이에요?'], { fs: 40 });
  return h;
}
function sBuddha() {
  let h = base();
  h += ZL({ x: 370, ex: EX('지침'), look: [-0.5, 0.4] }) + phone(150, 520, 0.8, { rot: -10, glow: .4 });
  h += bubble(130, 340, 200, ['답장…'], { fs: 30 }) + bubble(380, 330, 190, ['내일 걱정'], { fs: 26 });
  h += ZR({ ex: EX('신남'), look: [0, 0.5] });
  h += `<g transform="translate(850 600)"><ellipse cx="0" cy="-50" rx="110" ry="30" fill="#fff" stroke="${INK}" stroke-width="6"/><path d="M-110 -50 Q-100 40 0 40 Q100 40 110 -50" fill="#E9EEF5" stroke="${INK}" stroke-width="6"/>
    <path d="M-30 -100 q-14 -24 0 -48 M10 -96 q-14 -24 0 -48 M50 -100 q-14 -24 0 -48" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".9"/></g>` + shine(760, 470, 0.8);
    return h;
}
function calendar(x, y, s, lit, rot) {
  let h = `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect x="-200" y="-170" width="400" height="340" rx="16" fill="#fff" stroke="${INK}" stroke-width="7"/><rect x="-200" y="-170" width="400" height="62" rx="16" fill="${RED}" stroke="${INK}" stroke-width="7"/>
  <text x="0" y="-126" text-anchor="middle" font-family="Black Han Sans" font-size="38" fill="#fff">2026</text>`;
  const cols = ['#FFD84D', '#7FD3FF', '#FF9EC4', '#9BE58F', '#C7A6FF'];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) { const i = r * 7 + c, xx = -176 + c * 51, yy = -92 + r * 50, on = lit(i);
    h += `<rect x="${xx}" y="${yy}" width="42" height="40" rx="7" fill="${on ? cols[i % 5] : '#E3E7EE'}" stroke="${on ? INK : '#C9D0DA'}" stroke-width="${on ? 4 : 3}"/>`;
    if (on) h += `<text x="${xx + 21}" y="${yy + 29}" text-anchor="middle" font-size="24">★</text>`; }
  return h + `</g>`;
}
function sTime() {
  let h = base();
  h += calendar(140, 470, 0.58, i => i === 9, -6) + ZL({ x: 390, ex: EX('놀람'), look: [-0.6, 0.2] });
  h += calendar(840, 380, 0.7, i => i % 3 !== 1, 6) + ZR({ x: 1060, ex: EX('신남'), look: [-0.3, 0] });
  return h;
}
function sAnger() {
  let h = base();
  h += ZL({ x: 390, ex: EX('결심'), look: [-0.6, 0.2] }) + bolt(500, 380, 0.7, RED);
  h += `<g transform="translate(140 480) rotate(-6) scale(.9)"><rect x="-130" y="-90" width="260" height="180" rx="18" fill="#fff" stroke="${INK}" stroke-width="6"/><rect x="-110" y="-66" width="220" height="64" rx="16" fill="#FFE1E1" stroke="${RED}" stroke-width="4"/>
    <text x="-96" y="-24" font-family="Black Han Sans" font-size="28" fill="${RED}">너 왜 그래?!</text><g transform="translate(60 48)"><rect x="-52" y="-24" width="104" height="48" rx="24" fill="${RED}" stroke="${INK}" stroke-width="5"/><text x="0" y="10" text-anchor="middle" font-family="Black Han Sans" font-size="26" fill="#fff">전송</text></g></g>`;
  h += ZR({ ex: EX('신남'), look: [-0.3, 0] });
  h += `<g transform="translate(830 560)"><rect x="-80" y="-30" width="160" height="90" rx="10" fill="#FFB4C8" stroke="${INK}" stroke-width="6"/><rect x="-90" y="-50" width="180" height="30" rx="8" fill="#FF8FAE" stroke="${INK}" stroke-width="6"/><path d="M0 -50 L0 60" stroke="${YEL}" stroke-width="12"/></g>`;
  h += bubble(860, 340, 300, ['생일 축하해!'], { fs: 38 });
  return h;
}
function sMom() {
  let h = base();
  h += rainCloud(330, 300, 0.8) + ZL({ x: 330, ex: EX('지침'), look: [0, 0.4] });
  const st = [[790, 420], [820, 330], [880, 270], [1240, 470], [1210, 560]];
  st.forEach(([x, y], i) => { if (i && i !== 3) h += `<line x1="${st[i - 1][0]}" y1="${st[i - 1][1]}" x2="${x}" y2="${y}" stroke="#FFF4C2" stroke-width="5" opacity=".9"/>`; });
  st.forEach(([x, y]) => { h += `<circle cx="${x}" cy="${y}" r="34" fill="url(#warm)"/>` + sparkle(x, y, 0.6); });
  h += ZR({ ex: EX('신남'), look: [0, -0.4] });
  h += `<g transform="translate(830 560) rotate(-8)"><rect x="-80" y="-100" width="160" height="200" rx="10" fill="#7A5236" stroke="${INK}" stroke-width="6"/><rect x="-46" y="-64" width="92" height="40" rx="5" fill="#F1DFBA" stroke="${INK}" stroke-width="4"/>
    <text x="0" y="-36" text-anchor="middle" font-family="Black Han Sans" font-size="28" fill="#4A3424">1998</text></g>`;
  return h;
}
"""


def head_html(l1, l2):
    def fit(t, target, maxw=1180):
        units = sum(0.98 if '가' <= ch <= '힣' else (0.32 if ch == ' ' else 0.6) for ch in t)
        return min(target, int(maxw / max(units, 1)))
    f1, f2 = fit(l1, 84), fit(l2, 112)
    out = []
    for txt, y, fs, col, rot in [(l1, 22, f1, '#FFFFFF', 0), (l2, 22 + int(f1 * 1.1), f2, '#F7E733', -1.5)]:
        sw = max(14, round(fs * 0.17))
        out.append(f'<div class="t" style="left:40px;top:{y}px;font-size:{fs}px;color:{col};-webkit-text-stroke:{sw}px #141414;'
                   f'text-shadow:0 {max(6, fs // 18)}px 0 rgba(0,0,0,.35);transform:rotate({rot}deg)">{txt}</div>')
    return '\n'.join(out)


def pills_html(lp, rp):
    st = "position:absolute;white-space:nowrap;font-family:'Black Han Sans';color:#141414;padding:3px 20px 9px;border:6px solid #141414;border-radius:18px;box-shadow:0 6px 0 rgba(0,0,0,.35);font-size:32px"
    return (f'<div style="{st};left:40px;top:640px;background:#B9C4D4">{lp}</div>'
            f'<div style="{st};left:820px;top:640px;background:#F7E733">{rp}</div>')


def guide_svg(g):
    cx, cy = 1196, 238
    if g[0] == 'pill':
        return f"""<g transform="translate({cx} {cy})"><circle r="58" fill="#2B3A5E" stroke="#141414" stroke-width="7"/><text x="0" y="16" text-anchor="middle" font-size="50">🔬</text>
<g transform="translate({min(0, 1264 - 86 - cx)} 84)"><rect x="-86" y="-22" width="172" height="44" rx="22" fill="#FFFDF4" stroke="#141414" stroke-width="5"/><text x="0" y="10" text-anchor="middle" font-family="Black Han Sans" font-size="25" fill="#141414">{g[1]}</text></g></g>"""
    fn, fx, fy, r, name = g
    R = 58; k = R / r
    w = len(name.replace(' ', '')) * 26 + 40
    return f"""<g><circle cx="{cx}" cy="{cy}" r="{R + 9}" fill="#C9A24E" stroke="#141414" stroke-width="7"/>
<clipPath id="med"><circle cx="{cx}" cy="{cy}" r="{R}"/></clipPath>
<image href="file://{PORT}/{fn}" x="{cx - fx * k:.1f}" y="{cy - fy * k:.1f}" width="{840 * k:.1f}" height="{1050 * k:.1f}" clip-path="url(#med)" preserveAspectRatio="none"/>
<circle cx="{cx}" cy="{cy}" r="{R}" fill="none" stroke="#141414" stroke-width="5"/>
<g transform="translate({min(cx, 1264 - w / 2)} {cy + 84})"><rect x="{-w / 2}" y="-22" width="{w}" height="44" rx="22" fill="#FFFDF4" stroke="#141414" stroke-width="5"/><text x="0" y="10" text-anchor="middle" font-family="Black Han Sans" font-size="25" fill="#141414">{name}</text></g></g>"""


def page(key):
    l1, l2, lp, rp, fn, g = EPS[key]
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
<svg id="g" width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">{guide_svg(g)}</svg>
{head_html(l1, l2)}
{pills_html(lp, rp)}
</div><script>document.getElementById('v').innerHTML = defsAll() + {fn}() + seam() + arrow() + scrim();</script></body></html>"""


if __name__ == '__main__':
    keys = sys.argv[1:] or list(EPS)
    with sync_playwright() as p:
        br = p.chromium.launch(args=['--allow-file-access-from-files'])
        pg = br.new_page(viewport={'width': 1280, 'height': 720}, device_scale_factor=float(os.environ.get('DSF', '1')))
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        for k in keys:
            f = os.path.join(HERE, f'_split_{k}.html'); open(f, 'w', encoding='utf-8').write(page(k))
            pg.goto('file://' + f); pg.wait_for_timeout(900)
            out = os.path.join(HERE, f'split_{k}.png'); pg.locator('#wrap').screenshot(path=out)
            print(k, 'ok', errs[-1:] if errs else ''); errs.clear()
        br.close()
