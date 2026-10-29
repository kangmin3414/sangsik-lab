"""Preview candidate channel names on the current banner (mobile safe area crop), stacked into one image."""
import os, sys
from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
SP = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(SP, 'brand2'))
import banner_v2 as bv  # noqa: E402

CANDS = [  # (label, yellow part, white part)
    ('A  상식실험실  (추천)', '상식', '실험실'),
    ('B  지식실험실', '지식', '실험실'),
    ('C  생각실험실', '생각', '실험실'),
]
SAFE = (507, 508, 2053, 931)  # 1546x423 mobile safe area of a 2560x1440 banner
FONT = '/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'


def html_for(yel, white):
    h = bv.banner()
    old = f'<span style="color: {bv.YEL}">만약에</span>연구소'
    assert old in h
    return h.replace(old, f'<span style="color: {bv.YEL}">{yel}</span>{white}')


def main():
    crops = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={'width': 2560, 'height': 1440})
        for i, (label, y, w) in enumerate(CANDS):
            hp = os.path.join(HERE, f'_b{i}.html')
            open(hp, 'w', encoding='utf-8').write(
                "<!doctype html><html><head><meta charset='utf-8'><style>body{margin:0;background:#000}</style></head><body>"
                + html_for(y, w) + '</body></html>')
            pg.goto('file://' + hp); pg.wait_for_timeout(400)
            outp = os.path.join(HERE, f'_b{i}.png')
            pg.screenshot(path=outp)
            crops.append((label, Image.open(outp).convert('RGB').crop(SAFE)))
        b.close()
    W = SAFE[2] - SAFE[0]; H = SAFE[3] - SAFE[1]; LAB = 86; GAP = 26
    sheet = Image.new('RGB', (W, len(crops) * (LAB + H + GAP) + GAP), (245, 246, 248))
    d = ImageDraw.Draw(sheet)
    f = ImageFont.truetype(FONT, 50)
    y0 = GAP
    for label, im in crops:
        d.text((24, y0 + 10), label, font=f, fill=(20, 20, 20))
        sheet.paste(im, (0, y0 + LAB)); y0 += LAB + H + GAP
    out = os.path.join(HERE, '채널이름_후보_배너미리보기.jpg')
    sheet.save(out, quality=88)
    print(out, sheet.size, os.path.getsize(out))


if __name__ == '__main__':
    main()
