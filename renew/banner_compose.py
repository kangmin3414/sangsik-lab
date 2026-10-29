"""Compose channel banner 2560x1440: AI scene (scaled/shifted so Zero sits in the 2560x423 desktop band and inside the
1546x423 mobile safe area) + three text lines on the left of the safe area. Also writes a device preview sheet.
usage: python3 banner_compose.py  -> banner_{key}.jpg, banner_{key}_preview.jpg"""
import os
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__)); SP = os.path.dirname(HERE)
FONTS = os.path.join(SP, 'thumb3', 'node_modules', '@fontsource')
YEL = '#FFE51A'
# key: (scale, offset x, offset y)
SCENES = {'windoww': (1.04, -102, -29), 'hillw': (1.25, -280, -350)}
L1, L2, L3 = '철학자의 방법,', '제로가 대신 살아 봅니다', '사흘마다 저녁 6시 · 새 실험'
BAND = (508, 931); SAFE = (507, 2053)


def page(img, s, ox, oy):
    w, h = round(2560 * s), round(1440 * s)
    x0 = 572
    def t(txt, top, fs, col, sw):
        return (f'<div class="t" style="left:{x0}px;top:{top}px;font-size:{fs}px;color:{col};-webkit-text-stroke:{sw}px #111;'
                f'text-shadow:0 {round(fs*.07)}px 0 rgba(0,0,0,.55)">{txt}</div>')
    return f"""<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="file://{FONTS}/black-han-sans/index.css">
<style>body{{margin:0;background:#000}} #wrap{{width:2560px;height:1440px;position:relative;overflow:hidden}}
.bg{{position:absolute;left:{ox}px;top:{oy}px;width:{w}px;height:{h}px}}
.shade{{position:absolute;left:0;top:{BAND[0]}px;width:1900px;height:{BAND[1]-BAND[0]}px;background:radial-gradient(ellipse 45% 47% at 40% 50%,rgba(10,12,24,.22) 0%,rgba(10,12,24,.10) 55%,rgba(10,12,24,0) 100%)}}
.t{{position:absolute;white-space:nowrap;font-family:'Black Han Sans';line-height:1;letter-spacing:-1px;paint-order:stroke fill}}</style></head>
<body><div id="wrap"><img class="bg" src="file://{img}"><div class="shade"></div>
{t(L1, 548, 92, '#FFFFFF', 18)}{t(L2, 652, 112, YEL, 22)}{t(L3, 800, 58, '#FFFFFF', 12)}</div></body></html>"""


def preview(src, out):
    im = Image.open(src).convert('RGB')
    tv = im.resize((1280, 720))
    desk = im.crop((0, BAND[0], 2560, BAND[1])).resize((1280, 212))
    mob = im.crop((SAFE[0], BAND[0], SAFE[1], BAND[1])).resize((773, 212))
    W = 1280; H = 720 + 212 + 212 + 3 * 46
    sheet = Image.new('RGB', (W, H), (245, 245, 245)); d = ImageDraw.Draw(sheet)
    try: f = ImageFont.truetype('/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc', 26)
    except Exception: f = ImageFont.load_default()
    y = 0
    for label, part in [('TV (전체)', tv), ('PC (가운데 띠)', desk), ('휴대폰 (안전 영역)', mob)]:
        d.text((12, y + 8), label, fill=(30, 30, 30), font=f); y += 46
        sheet.paste(part, (0, y)); y += part.size[1]
    sheet.save(out, quality=88)


if __name__ == '__main__':
    with sync_playwright() as p:
        br = p.chromium.launch(args=['--allow-file-access-from-files'])
        pg = br.new_page(viewport={'width': 2560, 'height': 1440})
        for k, (s, ox, oy) in SCENES.items():
            img = os.path.join(HERE, 'banner_ai', f'{k}.png')
            f = os.path.join(HERE, f'_banner_{k}.html'); open(f, 'w', encoding='utf-8').write(page(img, s, ox, oy))
            pg.goto('file://' + f); pg.wait_for_timeout(800)
            png = os.path.join(HERE, f'_banner_{k}.png'); pg.locator('#wrap').screenshot(path=png)
            out = os.path.join(HERE, f'banner_{k}.jpg'); Image.open(png).convert('RGB').save(out, quality=90, optimize=True)
            preview(out, os.path.join(HERE, f'banner_{k}_preview.jpg'))
            print(k, os.path.getsize(out) // 1024, 'KB')
        br.close()
