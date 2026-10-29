"""Compilation #1 (스토아·데카르트·장자·소크라테스) — thumbnail, intro card, chapter cards.
usage: python3 cards.py            -> thumb.jpg (1280x720), intro.png + ch1..ch4.png (1920x1080)"""
import os, sys
from playwright.sync_api import sync_playwright
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); SP = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(SP, 'nthumb'))
import split as S
import v3

CH = [  # key, ep, problem line, experiment line, Zero expression
 ('stoic',    '006', '작은 일에 자꾸 흔들릴 때', '스토아 철학자처럼 일주일',  '겁먹음'),
 ('descartes','007', '가짜 뉴스에 자꾸 속을 때', '데카르트처럼 모든 걸 의심하기', '놀람'),
 ('zhuangzi', '008', '나만 뒤처진 것 같을 때',  '장자처럼 남의 잣대 내려놓기', '지침'),
 ('socrates', '009', '모르면서 아는 척할 때',   '소크라테스처럼 질문하며 살기', '걱정'),
]
NAME = {'stoic': '스토아', 'descartes': '데카르트', 'zhuangzi': '장자', 'socrates': '소크라테스'}


def medal(key, cx, cy, R, label=None, fs=25):
    fn, fx, fy, r, _ = S.EPS[key][5]
    k = R / r; cid = f'm_{key}_{int(cx)}_{int(cy)}'
    s = (f'<circle cx="{cx}" cy="{cy}" r="{R + R * .15:.1f}" fill="#C9A24E" stroke="#141414" stroke-width="7"/>'
         f'<clipPath id="{cid}"><circle cx="{cx}" cy="{cy}" r="{R}"/></clipPath>'
         f'<image href="file://{S.PORT}/{fn}" x="{cx - fx * k:.1f}" y="{cy - fy * k:.1f}" width="{840 * k:.1f}" height="{1050 * k:.1f}" clip-path="url(#{cid})" preserveAspectRatio="none"/>'
         f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="none" stroke="#141414" stroke-width="5"/>')
    if label:
        w = len(label.replace(' ', '')) * fs * 1.04 + fs * 1.6; h = fs * 1.76
        s += (f'<g transform="translate({cx} {cy + R * 1.15 + h * .55:.1f})"><rect x="{-w / 2:.1f}" y="{-h / 2:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{h / 2:.1f}" fill="#FFFDF4" stroke="#141414" stroke-width="5"/>'
              f'<text x="0" y="{fs * .4:.1f}" text-anchor="middle" font-family="Black Han Sans" font-size="{fs}" fill="#141414">{label}</text></g>')
    return s


def T(txt, x, y, fs, col='#FFFFFF', sw=None, extra=''):
    sw = sw or max(10, round(fs * .16))
    return (f'<div class="t" style="left:{x}px;top:{y}px;font-size:{fs}px;color:{col};-webkit-text-stroke:{sw}px #141414;'
            f'text-shadow:0 {max(5, fs // 18)}px 0 rgba(0,0,0,.35);{extra}">{txt}</div>')


def pill(txt, x, y, fs=30, bg='#F7E733', col='#141414'):
    return (f'<div style="position:absolute;left:{x}px;top:{y}px;font-family:\'Black Han Sans\';font-size:{fs}px;color:{col};'
            f'background:{bg};border:5px solid #141414;border-radius:14px;padding:2px 16px 6px;box-shadow:0 5px 0 rgba(0,0,0,.35);white-space:nowrap">{txt}</div>')


BG = """`<defs><radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#3B4D78" stop-opacity=".9"/><stop offset="1" stop-color="#3B4D78" stop-opacity="0"/></radialGradient></defs>
<rect width="1280" height="720" fill="#1B2236"/>` """


BG_T = """`<defs><linearGradient id="tb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3B82F6"/><stop offset="1" stop-color="#7C3AED"/></linearGradient>
<radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#93C5FD" stop-opacity=".75"/><stop offset="1" stop-color="#93C5FD" stop-opacity="0"/></radialGradient></defs>
<rect width="1280" height="720" fill="url(#tb)"/>` """


def thumb():
    meds = ''.join(medal(k, 900 + (i % 2) * 230, 300 + (i // 2) * 250, 78, NAME[k], 26) for i, (k, *_r) in enumerate(CH))
    js = f"""document.getElementById('v').innerHTML = defsAll() + {BG} + `<ellipse cx="300" cy="600" rx="380" ry="300" fill="url(#glow)"/><ellipse cx="1015" cy="420" rx="330" ry="330" fill="url(#glow)"/>`
      + Z({{x: 330, y: 1010, s: 1.2, pose: '서기', ex: EX('뿌듯'), look: [0.25, -0.1], tilt: 3}}) + `{meds}`;""".replace('{BG}', '')
    html = (pill('제로의 실험 몰아보기', 24, 20, 30, '#FFFFFF') + T('흔들릴 때 꺼내 보는', 34, 92, 74) + T('철학 실험 4편', 30, 176, 138, '#F7E733')
            + pill('29분 · 한 번에', 1036, 22, 34, '#FF5A5A', '#FFFFFF'))
    return v3.wrap(js, '', html)


def intro():
    rows = ''
    svg = ''
    for i, (k, ep, prob, exp, ex) in enumerate(CH):
        y = 330 + i * 92
        svg += medal(k, 760, y, 36)
        rows += (f'<div class="t" style="left:818px;top:{y - 30}px;font-size:26px;color:#9FB3D9;-webkit-text-stroke:0;letter-spacing:0">#{ep} · {NAME[k]}</div>'
                 + T(prob, 818, y - 2, 40, '#FFFFFF', 9))
    js = f"""document.getElementById('v').innerHTML = defsAll() + {BG} + `<ellipse cx="300" cy="620" rx="360" ry="280" fill="url(#glow)"/>`
      + Z({{x: 330, y: 1000, s: 1.1, pose: '서기', ex: EX('미소'), look: [0.3, -0.1]}}) + `{svg}`;"""
    html = (pill('제로의 실험 몰아보기', 24, 20) + T('흔들리는 마음을 잡아 준', 34, 92, 70) + T('철학 실험 4편', 30, 170, 120, '#F7E733')
            + rows + T('보고 싶은 실험부터 챕터로 골라 보세요', 720, 662, 26, '#C9D3DF', 0, 'letter-spacing:0'))
    return v3.wrap(js, '', html)


def chapter(i):
    k, ep, prob, exp, ex = CH[i]
    dots = ''.join(f'<circle cx="{560 + j * 46}" cy="640" r="{13 if j == i else 9}" fill="{"#F7E733" if j == i else "#4A5A80"}" stroke="#141414" stroke-width="4"/>' for j in range(4))
    js = f"""document.getElementById('v').innerHTML = defsAll() + {BG} + `<ellipse cx="300" cy="330" rx="330" ry="300" fill="url(#glow)"/>` + `{medal(k, 300, 300, 150, NAME[k] + ' 철학', 34)}`
      + Z({{x: 1120, y: 840, s: 0.85, pose: '서기', ex: EX('{ex}'), look: [-0.4, -0.1], tilt: -3}}) + `{dots}`;"""
    html = (pill(f'실험 {i + 1} / 4 · 제로의 실험 #{ep}', 560, 170, 32) + T(prob, 560, 250, 74 if len(prob) <= 12 else 66)
            + T(exp, 562, 360, 44, '#F7E733', 9))
    return v3.wrap(js, '', html)


if __name__ == '__main__':
    jobs = [('thumb', thumb(), 1.0), ('intro', intro(), 1.5)] + [(f'ch{i + 1}', chapter(i), 1.5) for i in range(4)]
    want = sys.argv[1:]
    with sync_playwright() as p:
        br = p.chromium.launch(args=['--allow-file-access-from-files'])
        for name, html, dsf in jobs:
            if want and name not in want: continue
            pg = br.new_page(viewport={'width': 1280, 'height': 720}, device_scale_factor=dsf if name != 'thumb' else 1.5)
            errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
            f = os.path.join(HERE, f'_{name}.html'); open(f, 'w', encoding='utf-8').write(html)
            pg.goto('file://' + f); pg.wait_for_timeout(1000)
            png = os.path.join(HERE, f'{name}.png'); pg.locator('#wrap').screenshot(path=png)
            if name == 'thumb':
                Image.open(png).convert('RGB').resize((1280, 720), Image.LANCZOS).save(os.path.join(HERE, 'thumb.jpg'), quality=88, optimize=True)
            print(name, Image.open(png).size, errs[:1])
            pg.close()
        br.close()
