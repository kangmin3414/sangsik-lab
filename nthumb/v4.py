"""Thumbnail v4 = colour fix of A (split v2), B (v3) and C (question).
 - every episode gets its own signature colour (the 'after' side, B's sunny wall, C's background)
 - the 'before' side is lifted from near-black navy to slate so the frame does not vanish in YouTube dark mode
 - yellow is kept for the one key text line only; arrow, labels, badge and '?' go white
usage: DSF=1.5 python3 v4.py A|B|C [keys]  -> abthumb4/{A|B|C}_{name}.jpg"""
import os, sys
from playwright.sync_api import sync_playwright
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); SP = os.path.dirname(HERE)
sys.path.insert(0, HERE)
import split as S
import v3

# light, base, deep, pastel wall (Tailwind 300/500/600/100)
PAL = {
 'stoic':     ('#5EEAD4', '#14B8A6', '#0D9488', '#CCFBF1'),
 'descartes': ('#93C5FD', '#3B82F6', '#2563EB', '#DBEAFE'),
 'zhuangzi':  ('#86EFAC', '#22C55E', '#16A34A', '#DCFCE7'),
 'socrates':  ('#C4B5FD', '#8B5CF6', '#7C3AED', '#EDE9FE'),
 'buddha':    ('#67E8F9', '#06B6D4', '#0891B2', '#CFFAFE'),
 'time':      ('#A5B4FC', '#6366F1', '#4F46E5', '#E0E7FF'),
 'anger':     ('#F0ABFC', '#D946EF', '#C026D3', '#FAE8FF'),
 'mom':       ('#FDA4AF', '#F43F5E', '#E11D48', '#FFE4E6'),
}
NAMES = {'stoic': '스토아', 'descartes': '데카르트', 'zhuangzi': '장자', 'socrates': '소크라테스', 'buddha': '붓다', 'time': '시간', 'anger': '화', 'mom': '엄마수첩'}
SLATE_TOP, SLATE_BOT = '#5B6782', '#3B4660'


def epc_js(k):
    a, b, c, d = PAL[k]
    return f"const EPC = {{light: '{a}', base: '{b}', deep: '{c}', wall: '{d}'}};"


# ---- A: patch split.SVG ----
SVG_A = (S.SVG
         .replace('<stop offset="0" stop-color="#3B4558"/><stop offset="1" stop-color="#1A2030"/>',
                  f'<stop offset="0" stop-color="{SLATE_TOP}"/><stop offset="1" stop-color="{SLATE_BOT}"/>')
         .replace('<stop offset="0" stop-color="#6EC3FF"/><stop offset=".7" stop-color="#CDEEFF"/><stop offset="1" stop-color="#FFF4D6"/>',
                  '<stop offset="0" stop-color="${EPC.light}"/><stop offset="1" stop-color="${EPC.base}"/>')
         .replace('<path d="${d}" fill="none" stroke="${YEL}" stroke-width="20" stroke-linecap="round"/>',
                  '<path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="20" stroke-linecap="round"/>')
         .replace('<path d="M-34 -40 L30 0 L-34 40 Z" fill="${YEL}"', '<path d="M-34 -40 L30 0 L-34 40 Z" fill="#FFFFFF"'))
assert SVG_A.count('${EPC.light}') == 1 and SLATE_TOP in SVG_A


def head_A(l1, l2):
    # key line stays yellow; give the whole two-line block one dark band so yellow never sits on a light colour
    h = S.head_html(l1, l2)
    return '<div style="position:absolute;left:0;top:0;width:1280px;height:250px;background:linear-gradient(180deg,rgba(15,20,32,.55),rgba(15,20,32,0))"></div>' + h


def pills_A(lp, rp):
    return S.pills_html(lp, rp).replace('background:#F7E733', 'background:#FFFFFF').replace('background:#B9C4D4', 'background:#D9DEE7')


def page_A(k):
    l1, l2, lp, rp, fn, g = S.EPS[k]
    fonts = os.path.join(SP, 'thumb3', 'node_modules', '@fontsource')
    return f"""<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="file://{fonts}/black-han-sans/index.css">
<style>body{{margin:0;background:#000}} #wrap{{width:1280px;height:720px;position:relative;overflow:hidden}}
.t{{position:absolute;white-space:nowrap;font-family:'Black Han Sans';line-height:1.05;letter-spacing:-1px;paint-order:stroke fill;transform-origin:left center}}
svg{{position:absolute;left:0;top:0}}</style>
<script src="file://{SP}/shorts/engine.js"></script>
<script>{epc_js(k)}
{S.B.LIB}
{S.B.SCENES}
{SVG_A}</script></head><body><div id="wrap">
<svg id="v" width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg"></svg>
<svg id="g" width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">{S.guide_svg(g)}</svg>
{head_A(l1, l2)}
{pills_A(lp, rp)}
</div><script>document.getElementById('v').innerHTML = defsAll() + {fn}() + seam() + arrow() + scrim();</script></body></html>"""


# ---- B: patch v3.ROOM + badge ----
ROOM_B = (v3.ROOM
          .replace('<stop offset="0" stop-color="#2C3550"/><stop offset="1" stop-color="#1B2236"/>',
                   f'<stop offset="0" stop-color="{SLATE_TOP}"/><stop offset="1" stop-color="{SLATE_BOT}"/>')
          .replace('<stop offset="0" stop-color="#FFF3D9"/><stop offset="1" stop-color="#FFE3B0"/>',
                   '<stop offset="0" stop-color="${EPC.light}"/><stop offset="1" stop-color="${EPC.base}"/>')
          .replace('fill="#E2BE8C"/><line x1="0" y1="560" x2="1280" y2="560" stroke="#C99D66"', 'fill="${EPC.deep}"/><line x1="0" y1="560" x2="1280" y2="560" stroke="#141414"')
          .replace('fill="#151A28"/>', 'fill="#2E3850"/>')
          .replace('<stop offset="1" stop-color="#0B111C" stop-opacity=".78"/>', '<stop offset="1" stop-color="#0B111C" stop-opacity=".62"/>'))
assert ROOM_B.count('${EPC.light}') == 1 and '${EPC.deep}' in ROOM_B


def badge_W(no):
    return v3.badge_html(no).replace('background:#F7E733', 'background:#FFFFFF')


def wrap4(k, js, gsvg, html, room):
    fonts = os.path.join(SP, 'thumb3', 'node_modules', '@fontsource')
    return f"""<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="file://{fonts}/black-han-sans/index.css">
<style>body{{margin:0;background:#000}} #wrap{{width:1280px;height:720px;position:relative;overflow:hidden}}
.t{{position:absolute;white-space:nowrap;font-family:'Black Han Sans';line-height:1.05;letter-spacing:-1px;paint-order:stroke fill}}
svg{{position:absolute;left:0;top:0}}</style>
<script src="file://{SP}/shorts/engine.js"></script>
<script>{epc_js(k)}
{S.B.LIB}
{S.B.SCENES}
{S.SVG}
{room}</script></head><body><div id="wrap">
<svg id="v" width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg"></svg>
<svg id="g" width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">{gsvg}</svg>
{html}
</div><script>{js}</script></body></html>"""


def page_B(k):
    l1, l2, voice, no, q, cex, g = v3.EP[k]; lp, rp = v3.PROPS[k]
    exL = {'stoic': '겁먹음', 'descartes': '놀람', 'zhuangzi': '지침', 'socrates': '걱정', 'buddha': '지침', 'time': '놀람', 'anger': '결심', 'mom': '지침'}[k]
    exR = {'stoic': '뿌듯', 'descartes': '결심', 'zhuangzi': '신남', 'socrates': '결심', 'buddha': '신남', 'time': '신남', 'anger': '신남', 'mom': '신남'}[k]
    js = f"""document.getElementById('v').innerHTML = defsAll() + rooms() + ({lp}) + Z({{x: 290, y: 840, s: 1.2, pose: '서기', ex: EX('{exL}'), look: [0.2, 0.1], tilt: -4}})
      + ({rp}) + Z({{x: 960, y: 860, s: 1.25, pose: '서기', ex: EX('{exR}'), look: [-0.2, -0.1]}}) + seam3() + bscrim();"""
    return wrap4(k, js, v3.guide_small(g), badge_W(no) + v3.voice_html(voice) + v3.bottom_html(l1, l2), ROOM_B)


def page_C(k):
    l1, l2, voice, no, q, cex, g = v3.EP[k]
    js = f"""document.getElementById('v').innerHTML = defsAll() + `<defs><radialGradient id="cbg" cx=".72" cy=".55" r=".75"><stop offset="0" stop-color="${{EPC.base}}"/><stop offset="1" stop-color="${{EPC.deep}}"/></radialGradient></defs>
      <rect width="1280" height="720" fill="url(#cbg)"/><ellipse cx="930" cy="430" rx="440" ry="380" fill="${{EPC.light}}" opacity=".45"/>`
      + Z({{x: 930, y: 1080, s: 1.6, pose: '서기', ex: EX('{cex}'), look: [-0.4, -0.2], tilt: -4}})
      + `<text x="1180" y="250" text-anchor="middle" font-family="Black Han Sans" font-size="120" fill="#FFFFFF" stroke="#141414" stroke-width="9" paint-order="stroke fill">?</text>`;"""
    def fit(t, target, maxw=760):
        units = sum(0.98 if '가' <= ch <= '힣' else (0.32 if ch == ' ' else 0.6) for ch in t)
        return min(target, int(maxw / max(units, 1)))
    if '|' in q: a, b = q.split('|')
    else:
        words = q.split(' '); mid = len(words) // 2 + (len(words) % 2)
        a, b = ' '.join(words[:mid]), ' '.join(words[mid:])
    fs = min(fit(a, 110), fit(b, 110))
    text = (f'<div class="t" style="left:48px;top:{360 - int(fs * 1.1)}px;font-size:{fs}px;color:#FFFFFF;-webkit-text-stroke:{round(fs * .16)}px #141414;text-shadow:0 6px 0 rgba(0,0,0,.35)">{a}</div>'
            f'<div class="t" style="left:48px;top:{360}px;font-size:{fs}px;color:#F7E733;-webkit-text-stroke:{round(fs * .16)}px #141414;text-shadow:0 6px 0 rgba(0,0,0,.35)">{b}</div>')
    return wrap4(k, js, '', badge_W(no) + text, v3.ROOM)


if __name__ == '__main__':
    kind = sys.argv[1]; keys = sys.argv[2:] or list(PAL)
    out_dir = os.path.join(SP, 'abthumb4'); os.makedirs(out_dir, exist_ok=True)
    fn = {'A': page_A, 'B': page_B, 'C': page_C}[kind]
    with sync_playwright() as p:
        br = p.chromium.launch(args=['--allow-file-access-from-files'])
        pg = br.new_page(viewport={'width': 1280, 'height': 720}, device_scale_factor=float(os.environ.get('DSF', '1')))
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        for k in keys:
            f = os.path.join(HERE, f'_v4{kind}_{k}.html'); open(f, 'w', encoding='utf-8').write(fn(k))
            pg.goto('file://' + f); pg.wait_for_timeout(900)
            png = os.path.join(HERE, f'v4{kind}_{k}.png'); pg.locator('#wrap').screenshot(path=png)
            Image.open(png).convert('RGB').resize((1280, 720), Image.LANCZOS).save(os.path.join(out_dir, f'{kind}_{NAMES[k]}.jpg'), quality=86, optimize=True)
            print(kind, k, 'ok', errs[-1:] if errs else ''); errs.clear()
        br.close()
