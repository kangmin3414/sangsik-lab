"""Thumbnail D text layer, following the 한눈에 심리학 / 오늘은 심리학 formula:
two huge bottom lines filling the width (one white, one yellow or neon green) on a black fade, a small neon-green quote at the top.
usage: python3 compose.py  (renders every entry in SPEC that has its AI picture)"""
import os, sys
from playwright.sync_api import sync_playwright
from PIL import Image
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'nthumb'))
import split as S
HERE = os.path.dirname(os.path.abspath(__file__)); SP = os.path.dirname(HERE)
FONTS = os.path.join(SP, 'thumb3', 'node_modules', '@fontsource')
YEL, GRN = '#FFE51A', '#3DF23D'

# out name: (picture, line1, line2, colour of line1, colour of line2, quote, quote x (left|right))
SPEC = {
 'D_스토아_1': ('stoic1', "'내 것 아님' 상자 하나로", '일주일 만에 단단해졌다', '#FFFFFF', YEL, '"그건 내 몫이 아니야"', 'left'),
 'D_데카르트_1': ('descartes1', S.EPS['descartes'][0], S.EPS['descartes'][1], '#FFFFFF', YEL, '"잠깐, 출처가 어디지?"', 'left'),
 'D_데카르트_2': ('descartes2', S.EPS['descartes'][0], S.EPS['descartes'][1], '#FFFFFF', YEL, '"이거 진짜야?!"', 'left'),
 'D_장자_1': ('zhuangzi1', S.EPS['zhuangzi'][0], S.EPS['zhuangzi'][1], '#FFFFFF', YEL, '"나는 나대로 괜찮아"', 'left'),
 'D_장자_2': ('zhuangzi2', S.EPS['zhuangzi'][0], S.EPS['zhuangzi'][1], '#FFFFFF', YEL, '"나만 뒤처졌나…"', 'left'),
 'D_소크라테스_1': ('socrates1', S.EPS['socrates'][0], S.EPS['socrates'][1], '#FFFFFF', YEL, '"저… 그게 무슨 뜻이에요?"', 'left'),
 'D_소크라테스_2': ('socrates2', S.EPS['socrates'][0], S.EPS['socrates'][1], '#FFFFFF', YEL, '"무슨 뜻이지…?"', 'left'),
 'D_붓다_1': ('buddha1', S.EPS['buddha'][0], S.EPS['buddha'][1], '#FFFFFF', YEL, '"아, 이런 맛이었구나"', 'left'),
 'D_붓다_2': ('buddha2', S.EPS['buddha'][0], S.EPS['buddha'][1], '#FFFFFF', YEL, '"답장… 내일 걱정…"', 'left'),
 'D_시간_1': ('time1', S.EPS['time'][0], S.EPS['time'][1], '#FFFFFF', YEL, '"오늘, 처음 와 봤어"', 'left'),
 'D_시간_2': ('time2', S.EPS['time'][0], S.EPS['time'][1], '#FFFFFF', YEL, '"벌써 연말…?"', 'left'),
 'D_화_1': ('anger1', S.EPS['anger'][0], S.EPS['anger'][1], '#FFFFFF', YEL, '"보내는 건 내일 아침에"', 'left'),
 'D_화_2': ('anger2', S.EPS['anger'][0], S.EPS['anger'][1], '#FFFFFF', YEL, '"지금 보내 버려?"', 'left'),
 'D_엄마수첩_1': ('mom1', S.EPS['mom'][0], S.EPS['mom'][1], '#FFFFFF', YEL, '"오늘 좋았던 일 세 가지"', 'left'),
 'D_엄마수첩_2': ('mom2', S.EPS['mom'][0], S.EPS['mom'][1], '#FFFFFF', YEL, '"오늘도 별일 없네…"', 'left'),
 'D_스토아_2': ('stoic2', "'내 것 아님' 상자 하나로", '일주일 만에 단단해졌다', '#FFFFFF', YEL, '"또 나만 왜…"', 'left'),
 'D_니체_1': ('nietzsche1', '남들 따라 달리던 내가', '다시 살고 싶은 하루를 찾았다', '#FFFFFF', YEL, '"이 하루, 또 살고 싶을까?"', 'left'),
 'D_니체_2': ('nietzsche2', '시련이 하나도 없던 사람이', '더 약했다?', '#FFFFFF', YEL, '"남들 다 하니까…"', 'left'),
 'D_몰아보기01': ('compile', '흔들릴 때마다 꺼내 보는', '철학 실험 4편 몰아보기', '#FFFFFF', YEL, '"오늘은 이거 하나면 돼"', 'left'),
}


def fit(t, maxw=1244, cap=132):
    units = sum(1.0 if '가' <= ch <= '힣' else (0.34 if ch == ' ' else 0.62) for ch in t)
    return min(cap, int(maxw / max(units, 1)))


def page(img, l1, l2, c1, c2, quote, qpos):
    f1, f2 = fit(l1), fit(l2)
    fs = min(f1, f2)                      # same size for both lines, like the model channels
    y2 = 720 - 26 - int(fs * 1.06); y1 = y2 - int(fs * 1.08)
    sw = round(fs * .2)
    def line(t, y, c):
        return (f'<div class="t" style="top:{y}px;font-size:{fs}px;color:{c};-webkit-text-stroke:{sw}px #000;'
                f'text-shadow:0 {round(fs * .07)}px 0 rgba(0,0,0,.6)">{t}</div>')
    qx = 'left:34px' if qpos == 'left' else 'right:34px'
    q = (f'<div class="q" style="{qx};top:22px;font-size:50px;color:{GRN};-webkit-text-stroke:11px #000;'
         f'text-shadow:0 3px 0 rgba(0,0,0,.6)">{quote}</div>') if quote else ''
    return f"""<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="file://{FONTS}/black-han-sans/index.css">
<style>body{{margin:0;background:#000}} #wrap{{width:1280px;height:720px;position:relative;overflow:hidden}}
.bg{{position:absolute;inset:0;width:1280px;height:720px;object-fit:cover}}
.fade{{position:absolute;left:0;right:0;bottom:0;height:330px;background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,.62) 45%,rgba(0,0,0,.86) 100%)}}
.t{{position:absolute;left:0;right:0;text-align:center;white-space:nowrap;font-family:'Black Han Sans';line-height:1;letter-spacing:-2px;paint-order:stroke fill}}
.q{{position:absolute;white-space:nowrap;font-family:'Black Han Sans';line-height:1;paint-order:stroke fill}}</style></head>
<body><div id="wrap"><img class="bg" src="file://{img}"><div class="fade"></div>{q}{line(l1, y1, c1)}{line(l2, y2, c2)}</div></body></html>"""


if __name__ == '__main__':
    want = sys.argv[1:]
    out = os.path.join(SP, 'abthumbD'); os.makedirs(out, exist_ok=True)
    with sync_playwright() as p:
        br = p.chromium.launch(args=['--allow-file-access-from-files'])
        pg = br.new_page(viewport={'width': 1280, 'height': 720}, device_scale_factor=1.5)
        for name, (pic, l1, l2, c1, c2, q, qp) in SPEC.items():
            if want and name not in want: continue
            img = os.path.join(HERE, 'ai', f'{pic}.png')
            if not os.path.exists(img): print(name, 'no picture'); continue
            f = os.path.join(HERE, f'_{name}.html'); open(f, 'w', encoding='utf-8').write(page(img, l1, l2, c1, c2, q, qp))
            pg.goto('file://' + f); pg.wait_for_timeout(700)
            png = os.path.join(HERE, f'{name}.png'); pg.locator('#wrap').screenshot(path=png)
            Image.open(png).convert('RGB').resize((1280, 720), Image.LANCZOS).save(os.path.join(out, f'{name}.jpg'), quality=88, optimize=True)
            print(name, 'ok')
        br.close()
