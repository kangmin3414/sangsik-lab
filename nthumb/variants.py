"""Hook-style A/B thumbnail variants for the scheduled philosopher episodes (1280x720 layout, rendered at DSF).
S = Stoic ('걱정의 91%는 일어나지 않았다'), Q = Socrates ('아는 척 끄덕인 적 있다면?').
usage: DSF=1.5 python3 variants.py [S Q]"""
import os, sys
from PIL import Image
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__)); SP = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(SP, 'ctr', 'thumbs')); import build as B

YEL, WHITE, RED = '#F7E733', '#FFFFFF', '#FF4D4D'
P = os.path.join(SP, 'portraits')
HEAD = {
    'S': [('걱정의 91%는', 44, 22, 96, WHITE, 0), ('일어나지 않았다', 38, 128, 118, YEL, -2)],
    'Q': [('아는 척', 44, 22, 110, WHITE, 0), ('끄덕인 적 있다면?', 38, 140, 104, YEL, -2)],
}
PILLS = {
    'S': [('로마 황제의 습관', 842, 206, 36, '#E8E2D6')],
    'Q': [('소크라테스', 922, 216, 36, '#E8E2D6')],
}

SVG = r"""
function frame(x, y, w, h, href, ix, iy, iw, ih) {   // gold frame + clipped picture
  const id = 'fr' + Math.round(x);
  return `<g transform="translate(${x} ${y}) rotate(3)"><rect x="${-w / 2 - 18}" y="${-h / 2 - 18}" width="${w + 36}" height="${h + 36}" rx="10" fill="#C9A24E" stroke="${INK}" stroke-width="8"/>
  <clipPath id="${id}"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="4"/></clipPath>
  <g clip-path="url(#${id})"><image href="file://${href}" x="${ix}" y="${iy}" width="${iw}" height="${ih}" preserveAspectRatio="none"/></g>
  <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="4" fill="none" stroke="${INK}" stroke-width="5"/></g>`;
}
function bigCloud(x, y, s, txt) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M-150 60 Q-200 60 -200 14 Q-200 -36 -146 -38 Q-138 -104 -60 -100 Q-24 -150 44 -128 Q114 -142 132 -70 Q196 -64 194 0 Q192 60 140 60 Z" fill="#6E7A8C" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>
  <text x="0" y="40" text-anchor="middle" font-family="Black Han Sans" font-size="104" fill="#fff" stroke="${INK}" stroke-width="10" paint-order="stroke fill">${txt}</text></g>`;
}
function sceneS() {
  let h = `<rect width="1280" height="720" fill="#1F2838"/><ellipse cx="330" cy="560" rx="380" ry="300" fill="url(#warm)" opacity=".2"/>`;
  // cracked worry cloud with 91%
  h += bigCloud(330, 350, 1.0, '걱정');
  h += `<path d="M455 280 L430 330 L462 360 L440 410" fill="none" stroke="#FFE680" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`;
  h += sparkle(520, 270, 1.0) + sparkle(140, 300, 0.8) + sparkle(470, 450, 0.7);
  h += Z({ x: 330, y: 830, s: 0.8, pose: '서기', ex: EX('놀람'), look: [0, -0.8] });
  h += frame(1010, 460, 320, 400, PORT + '/_p_stoic.jpg', -230, -230, 420, 525);
  return h;
}
function sceneQ() {
  let h = `<rect width="1280" height="720" fill="#26324A"/><ellipse cx="380" cy="560" rx="380" ry="300" fill="url(#warm)" opacity=".16"/>`;
  // jargon bubble from off-screen boss
  h += `<g transform="translate(280 440)"><path d="M-170 -70 Q-170 -104 -136 -104 L150 -104 Q184 -104 184 -70 L184 40 Q184 74 150 74 L-136 74 Q-170 74 -170 40 L-170 20 L-262 52 L-170 -20 Z" fill="#fff" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
    <text x="7" y="-10" text-anchor="middle" font-family="Black Han Sans" font-size="54" fill="${INK}">린하게,</text><text x="7" y="50" text-anchor="middle" font-family="Black Han Sans" font-size="54" fill="${INK}">피벗 각!</text></g>`;
  h += `<g transform="translate(150 316)"><rect x="-62" y="-26" width="124" height="48" rx="14" fill="#C3CDD8" stroke="${INK}" stroke-width="5"/><text x="0" y="12" text-anchor="middle" font-family="Black Han Sans" font-size="30" fill="${INK}">팀장님</text></g>`;
  h += Z({ x: 650, y: 820, s: 0.8, pose: '서기', ex: EX('걱정'), look: [-0.6, -0.2], tilt: -6 });
  h += sweat(760, 450, 1.1) + sweat(548, 470, 0.9);
  h += `<text x="650" y="398" text-anchor="middle" font-family="Black Han Sans" font-size="80" fill="${YEL}" stroke="${INK}" stroke-width="10" paint-order="stroke fill">???</text>`;
  h += frame(1055, 470, 300, 400, PORT + '/_p_socrates.jpg', -700, -250, 1092, 1365);
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
    return f"""<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="file://{fonts}/black-han-sans/index.css">
<style>body{{margin:0;background:#000}} #wrap{{width:1280px;height:720px;position:relative;overflow:hidden}}
.t{{position:absolute;white-space:nowrap;font-family:'Black Han Sans';line-height:1.05;letter-spacing:-1px;paint-order:stroke fill;transform-origin:left center}}
.pill{{position:absolute;white-space:nowrap;font-family:'Black Han Sans';color:#141414;padding:4px 22px 10px;border:6px solid #141414;border-radius:20px;box-shadow:0 7px 0 rgba(0,0,0,.35)}}
svg{{position:absolute;left:0;top:0}}</style>
<script src="file://{SP}/shorts/engine.js"></script>
<script>{B.LIB}
{B.SCENES}
const PORT = {P!r};
{SVG}</script></head><body><div id="wrap">
<svg id="v" width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg"></svg>
{text_html(v)}
</div><script>document.getElementById('v').innerHTML = defsAll() + scene{v}();</script></body></html>"""


if __name__ == '__main__':
    vs = sys.argv[1:] or ['S', 'Q']
    with sync_playwright() as p:
        br = p.chromium.launch(args=['--allow-file-access-from-files'])
        pg = br.new_page(viewport={'width': 1280, 'height': 720}, device_scale_factor=float(os.environ.get('DSF', '1')))
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        for v in vs:
            fn = os.path.join(HERE, f'_var{v}.html')
            open(fn, 'w', encoding='utf-8').write(page(v))
            pg.goto('file://' + fn); pg.wait_for_timeout(900)
            out = os.path.join(HERE, f'var_{v}.png')
            pg.locator('#wrap').screenshot(path=out)
            print(v, 'ok', errs[-1:] if errs else '')
        br.close()
