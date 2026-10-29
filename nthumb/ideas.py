"""Nietzsche long-form thumbnail IDEAS (1280x720 mockups), built from the episode's own vector art / AI art.
A = quote vs science ('반만 맞다'), B = pain point ('뭘 위해 사는지'), C = eternal recurrence ('이 하루를 영원히?'),
D = moustache experiment ('콧수염 붙이고 5일'). usage: python3 ideas.py [A B C D]"""
import os, sys
from PIL import Image
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__)); SP = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(SP, 'ctr', 'thumbs')); import build as B   # LIB, SCENES (Z, EX, defsAll, shadow, rays, sparkle)

YEL, WHITE, RED = '#F7E733', '#FFFFFF', '#FF4D4D'
GRAB = '\n'.join([B.grab('nietzsche3/scenes6.js', 'stacheG'), B.grab('nietzsche3/scenes6.js', 'imp')])

# (text, x, y, font-size, color, rot)
HEAD = {
    'A': [('나를 죽이지 못하면', 44, 22, 82, WHITE, 0), ('더 강해진다?', 38, 112, 124, YEL, -2)],
    'B': [('뭘 위해 사는지', 44, 22, 96, WHITE, 0), ('모르겠다면', 38, 130, 128, YEL, -2)],
    'C': [('이 하루를', 820, 60, 96, WHITE, 0), ('영원히', 800, 166, 150, YEL, -3), ('반복한다면?', 820, 330, 80, WHITE, 0)],
    'D': [('니체 콧수염 붙이고', 44, 22, 82, WHITE, 0), ('5일 살아 봄', 38, 112, 132, YEL, -2)],
}
PILLS = {   # (text, x, y, size, bg)
    'A': [('니체', 60, 600, 40, '#E8E2D6')],
    'B': [('니체', 1112, 196, 42, '#E8E2D6')],
    'C': [('니체의 질문', 860, 456, 40, '#E8E2D6')],
    'D': [],
}

SVG = r"""
const NZ = o => char(Object.assign({ goggles: 'none', vest: '#3B3F4E', patch: false, tee: true, vshade: 'rgba(0,0,0,0.28)', hair: '#5A4130', stache: '#5A4130', noMouth: true, collar: true, tie: '#1E2230', still: true, noBlink: true }, o));
const stamp = (x, y, rot, txt, size) => `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="${-size * txt.length * 0.56}" y="${-size * 0.78}" width="${size * txt.length * 1.12}" height="${size * 1.5}" rx="18" fill="#fff" fill-opacity=".92" stroke="${RED}" stroke-width="12"/>
  <text x="0" y="${size * 0.36}" text-anchor="middle" font-family="Black Han Sans" font-size="${size}" fill="${RED}">${txt}</text></g>`;
function chartCard(x, y) {   // inverted-U: 마음 건강 vs 시련의 양
  let h = `<g transform="translate(${x} ${y})"><rect x="0" y="0" width="520" height="360" rx="26" fill="#FFFDF4" stroke="${INK}" stroke-width="9"/>`;
  h += `<path d="M70 300 L480 300 M70 300 L70 50" stroke="${INK}" stroke-width="7" stroke-linecap="round" fill="none"/>`;
  h += `<path d="M78 250 C150 250 190 80 270 80 C350 80 400 250 470 262" fill="none" stroke="#2B9BF4" stroke-width="16" stroke-linecap="round"/>`;
  h += `<circle cx="270" cy="80" r="20" fill="${YEL}" stroke="${INK}" stroke-width="6"/>`;
  h += `<text x="84" y="44" font-family="Black Han Sans" font-size="28" fill="#6B6255">마음 건강</text><text x="486" y="288" text-anchor="end" font-family="Black Han Sans" font-size="28" fill="#6B6255">시련 →</text>`;
  h += `<text x="95" y="340" font-family="Black Han Sans" font-size="34" fill="${INK}">없음</text><text x="240" y="340" font-family="Black Han Sans" font-size="34" fill="${INK}">조금</text><text x="410" y="340" font-family="Black Han Sans" font-size="34" fill="${INK}">많음</text>`;
  return h + `</g>`;
}
function sceneA() {
  let h = `<rect width="1280" height="720" fill="#1C2333"/><ellipse cx="300" cy="520" rx="420" ry="380" fill="url(#warm)" opacity=".22"/>`;
  h += NZ({ x: 330, y: 1110, s: 1.62, pose: '서기', ex: EX('결심'), look: [0.6, -0.1] });
  h += chartCard(690, 296);
  h += `<text x='994' y='358' text-anchor='start' font-family='Black Han Sans' font-size='31' fill='${INK}'>적당히가 최고</text>`;
  h += stamp(970, 236, -8, '반만 맞음', 66);
  return h;
}
function sceneB() {
  let h = `<rect width="1280" height="720" fill="#4A4C55"/><rect y="560" width="1280" height="160" fill="#3E4048"/>`;
  h += `<ellipse cx="1080" cy="470" rx="380" ry="380" fill="url(#warm)" opacity=".18"/>`;
  h += Z({ x: 320, y: 716, s: 0.82, pose: '웅크림', ex: EX('지침'), look: [0.5, 0.3], tilt: 6 });
  h += NZ({ x: 1080, y: 1300, s: 2.0, pose: '서기', ex: EX('결심'), look: [-0.7, 0.1] });
  // speech bubble from Nietzsche
  h += `<g transform="translate(600 420)"><path d="M-170 -62 Q-170 -96 -136 -96 L190 -96 Q224 -96 224 -62 L224 30 Q224 64 190 64 L120 64 L170 118 L60 64 L-136 64 Q-170 64 -170 30 Z" fill="#fff" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
    <text x="27" y="2" text-anchor="middle" font-family="Black Han Sans" font-size="66" fill="${RED}">아모르파티!</text><text x="27" y="46" text-anchor="middle" font-family="Black Han Sans" font-size="31" fill="${INK}">네 운명을 사랑하라</text></g>`;
  return h;
}
function sceneC() {
  let h = `<image href="file://${AI28}" x="-90" y="-250" width="1636" height="920" preserveAspectRatio="none"/>`;
  h += `<linearGradient id="scrR" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0B1020" stop-opacity="0"/><stop offset=".5" stop-color="#0B1020" stop-opacity=".78"/><stop offset="1" stop-color="#0B1020" stop-opacity=".9"/></linearGradient>`;
  h += `<rect x="560" width="720" height="720" fill="url(#scrR)"/>`;
  // infinity loop
  h += `<g transform="translate(975 598) scale(1.12)"><path d="M0 0 C-40 -60 -130 -60 -130 0 C-130 60 -40 60 0 0 C40 -60 130 -60 130 0 C130 60 40 60 0 0 Z" fill="none" stroke="${INK}" stroke-width="30" stroke-linejoin="round"/><path d="M0 0 C-40 -60 -130 -60 -130 0 C-130 60 -40 60 0 0 C40 -60 130 -60 130 0 C130 60 40 60 0 0 Z" fill="none" stroke="${YEL}" stroke-width="16" stroke-linejoin="round"/></g>`;
  return h;
}
function sceneD() {
  let h = rays(860, 440, '#2E6FD8', '#3A7FE6', 24);
  h += `<ellipse cx="860" cy="480" rx="420" ry="360" fill="url(#warm)" opacity=".35"/>`;
  h += Z({ x: 840, y: 1075, s: 1.5, pose: '서기', ex: EX('신남'), look: [-0.2, -0.1], stache: '#4A3426' });
  // the original, small, in a frame
  h += `<g transform="translate(1150 520) rotate(6)"><rect x="-96" y="-120" width="192" height="230" rx="10" fill="#C9A46A" stroke="${INK}" stroke-width="7"/><rect x="-80" y="-104" width="160" height="198" rx="6" fill="#D9C7A4" stroke="${INK}" stroke-width="5"/>
    <clipPath id="fr"><rect x="-80" y="-104" width="160" height="198" rx="6"/></clipPath><g clip-path="url(#fr)">${NZ({ x: 0, y: 260, s: 0.5, pose: '서기', ex: EX('결심'), look: [0, 0] })}</g></g>`;
  h += `<g transform="translate(1150 690)"><rect x="-70" y="-28" width="140" height="50" rx="14" fill="${YEL}" stroke="${INK}" stroke-width="6"/><text x="0" y="12" text-anchor="middle" font-family="Black Han Sans" font-size="32" fill="${INK}">원조</text></g>`;
  h += sparkle(560, 380, 1.2) + sparkle(1180, 240, 0.9);
  return h;
}
"""


def text_html(v):
    out = []
    for txt, x, y, fs, col, rot in HEAD[v]:
        sw = max(14, round(fs * 0.16))
        out.append(f'<div class="t" style="left:{x}px;top:{y}px;font-size:{fs}px;color:{col};-webkit-text-stroke:{sw}px #141414;'
                   f'text-shadow:0 {max(6, fs // 18)}px 0 rgba(0,0,0,.35);transform:rotate({rot}deg)">{txt}</div>')
    for txt, x, y, fs, bg in PILLS[v]:
        out.append(f'<div class="pill" style="left:{x}px;top:{y}px;font-size:{fs}px;background:{bg}">{txt}</div>')
    return '\n'.join(out)


def page(v):
    fonts = os.path.join(SP, 'thumb3', 'node_modules', '@fontsource')
    ai28 = os.path.join(SP, 'nietzsche3', 'ai', '28.png')
    return f"""<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="file://{fonts}/black-han-sans/index.css">
<style>body{{margin:0;background:#000}} #wrap{{width:1280px;height:720px;position:relative;overflow:hidden}}
.t{{position:absolute;white-space:nowrap;font-family:'Black Han Sans';line-height:1.05;letter-spacing:-1px;paint-order:stroke fill;transform-origin:left center}}
.pill{{position:absolute;white-space:nowrap;font-family:'Black Han Sans';color:#141414;padding:4px 22px 10px;border:6px solid #141414;border-radius:20px;box-shadow:0 7px 0 rgba(0,0,0,.35)}}
svg{{position:absolute;left:0;top:0}}</style>
<script src="file://{SP}/shorts/engine.js"></script>
<script>const AI28 = {ai28!r};
{B.LIB}
{B.SCENES}
{GRAB}
{SVG}</script></head><body><div id="wrap">
<svg id="v" width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>
{text_html(v)}
</div><script>document.getElementById('v').innerHTML = defsAll() + scene{v}();</script></body></html>"""


if __name__ == '__main__':
    vs = sys.argv[1:] or ['A', 'B', 'C', 'D']
    with sync_playwright() as p:
        br = p.chromium.launch(args=['--allow-file-access-from-files'])
        pg = br.new_page(viewport={'width': 1280, 'height': 720}, device_scale_factor=float(os.environ.get('DSF', '1')))
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        for v in vs:
            fn = os.path.join(HERE, f'_idea{v}.html')
            open(fn, 'w', encoding='utf-8').write(page(v))
            pg.goto('file://' + fn); pg.wait_for_timeout(700)
            out = os.path.join(HERE, f'idea_{v}.png')
            pg.locator('#wrap').screenshot(path=out)
            Image.open(out).convert('RGB').save(out.replace('.png', '.jpg'), quality=92)
            print(v, 'ok', errs[-1:] if errs else '')
        br.close()
