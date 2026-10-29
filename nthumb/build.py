"""Nietzsche long-form thumbnail v2 (1280x720): worried Zero under the storm -> Zero with Nietzsche's moustache in the light.
Background = the episode's Sils-Maria art (portraits/aibg/nietzsche.png). Three headline variants.
usage: python3 build.py [A B C]"""
import os, sys
from PIL import Image
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__)); SP = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(SP, 'ctr', 'thumbs')); import build as B   # LIB, SCENES (Z, EX, defsAll, shadow)

YEL, WHITE = '#F7E733', '#FFFFFF'
HEAD = {   # (text, x, y, font-size, color, rot)
    'A': [('니체처럼 5일', 40, 26, 104, WHITE, 0), ('살아 봤더니', 34, 138, 132, YEL, -2)],
    'B': [('걱정 많던 내가', 40, 26, 100, WHITE, 0), ('니체가 됐다', 34, 136, 136, YEL, -2)],
    'C': [('나를 죽이지 못하면', 40, 30, 84, WHITE, 0), ('더 강해진다?', 34, 128, 132, YEL, -2)],
    'base': [],   # no headline: background for the editable canvas artboards
}

SVG = r"""
function cloud(x, y, s) {
  const drops = [[-46, 70], [0, 92], [46, 70]].map(([a, b]) =>
    `<path d="M${a} ${b - 18} Q${a + 9} ${b} ${a} ${b + 8} Q${a - 9} ${b} ${a} ${b - 18} Z" fill="#8FC7FF" stroke="${INK}" stroke-width="4"/>`).join('');
  return `<g transform="translate(${x} ${y}) scale(${s})">${drops}
  <path d="M-92 36 Q-118 36 -118 8 Q-118 -22 -86 -22 Q-80 -64 -34 -60 Q-12 -92 30 -76 Q72 -84 82 -40 Q120 -36 118 4 Q116 36 86 36 Z" fill="#7D8899" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
  <path d="M-70 10 Q-40 22 -10 10" fill="none" stroke="#9AA5B5" stroke-width="6" stroke-linecap="round"/></g>`;
}
function arrow() {
  const d = 'M430 560 Q600 470 770 520';
  return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="40" stroke-linecap="round"/>
  <path d="${d}" fill="none" stroke="${YEL}" stroke-width="24" stroke-linecap="round"/>
  <g transform="translate(788 526) rotate(18)"><path d="M-40 -46 L34 0 L-40 46 Z" fill="${YEL}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/></g>`;
}
function scene() {
  let h = `<defs><radialGradient id="sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".95"/><stop offset=".55" stop-color="#FFC861" stop-opacity=".45"/><stop offset="1" stop-color="#FFB547" stop-opacity="0"/></radialGradient>
  <linearGradient id="dark" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0E1522" stop-opacity=".82"/><stop offset=".42" stop-color="#1A2436" stop-opacity=".55"/><stop offset=".62" stop-color="#1A2436" stop-opacity="0"/></linearGradient>
  <linearGradient id="topscrim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B111C" stop-opacity=".55"/><stop offset="1" stop-color="#0B111C" stop-opacity="0"/></linearGradient></defs>`;
  h += `<rect width="1280" height="720" fill="url(#dark)"/><rect width="1280" height="330" fill="url(#topscrim)"/>`;
  h += `<ellipse cx="1010" cy="440" rx="330" ry="330" fill="url(#sun)"/>`;
  // worried Zero, small, under a rain cloud
  h += shadow(300, 706, 80) + Z({ x: 300, y: 716, s: 0.6, pose: '웅크림', ex: EX('걱정'), look: [0.2, 0.5], tilt: 4 });
  h += cloud(300, 372, 0.78);
  h += arrow();
  // Zero with Nietzsche's moustache, big, in the light
  h += shadow(1010, 708, 120) + Z({ x: 1010, y: 724, s: 0.98, pose: '서기', ex: EX('뿌듯'), look: [-0.25, -0.15], stache: '#4A3426' });
  return h;
}
"""


def text_html(items):
    out = []
    for txt, x, y, fs, col, rot in items:
        sw = max(14, round(fs * 0.16))
        out.append(f'<div class="t" style="left:{x}px;top:{y}px;font-size:{fs}px;color:{col};-webkit-text-stroke:{sw}px #141414;'
                   f'text-shadow:0 {max(6, fs // 18)}px 0 rgba(0,0,0,.35);transform:rotate({rot}deg)">{txt}</div>')
    out.append('<div class="pill" style="left:118px;top:640px;font-size:30px;background:#B9C4D4">평소의 나</div>')
    out.append('<div class="pill" style="left:880px;top:624px;font-size:38px;background:#F7E733">니체가 된 나</div>')
    return '\n'.join(out)


def page(v):
    fonts = os.path.join(SP, 'thumb3', 'node_modules', '@fontsource')
    bg = os.path.join(SP, 'portraits', 'aibg', 'nietzsche.png')
    return f"""<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="file://{fonts}/black-han-sans/index.css">
<style>body{{margin:0;background:#000}} #wrap{{width:1280px;height:720px;position:relative;overflow:hidden}}
#bg{{position:absolute;left:0;top:0;width:1280px;height:720px;object-fit:cover;filter:saturate(1.05)}}
.t{{position:absolute;white-space:nowrap;font-family:'Black Han Sans';line-height:1.05;letter-spacing:-1px;paint-order:stroke fill;transform-origin:left center}}
.pill{{position:absolute;white-space:nowrap;font-family:'Black Han Sans';color:#141414;padding:4px 22px 10px;border:6px solid #141414;border-radius:20px;box-shadow:0 7px 0 rgba(0,0,0,.35)}}
svg{{position:absolute;left:0;top:0}}</style>
<script src="file://{SP}/shorts/engine.js"></script>
<script>{B.LIB}
{B.SCENES}
{SVG}</script></head><body><div id="wrap">
<img id="bg" src="file://{bg}">
<svg id="v" width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg"></svg>
{text_html(HEAD[v])}
</div><script>document.getElementById('v').innerHTML = defsAll() + scene();</script></body></html>"""


if __name__ == '__main__':
    names = sys.argv[1:] or list(HEAD)
    with sync_playwright() as p:
        b = p.chromium.launch()
        for v in names:
            path = os.path.join(HERE, f'_{v}.html'); open(path, 'w', encoding='utf-8').write(page(v))
            pg = b.new_page(viewport={'width': 1280, 'height': 720}, device_scale_factor=2)
            errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
            pg.goto('file://' + path); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(600)
            out2 = os.path.join(HERE, f'니체_썸네일_{v}@2x.png'); pg.locator('#wrap').screenshot(path=out2)
            Image.open(out2).convert('RGB').resize((1280, 720), Image.LANCZOS).save(os.path.join(HERE, f'니체_썸네일_{v}.jpg'), quality=92)
            if v == 'base': Image.open(out2).convert('RGB').save(os.path.join(HERE, 'nietzsche_thumb_base_2x.jpg'), quality=90)
            pg.close(); print(v, errs or 'ok')
        b.close()
