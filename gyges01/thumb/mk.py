"""기게스의 반지 편 썸네일: 그림 + 2줄 글자(둘째 줄 노란 바). nietzsche_no01/thumb2/mk.py의 도구를 그대로 옮김."""
import os
from PIL import Image, ImageDraw, ImageFont, ImageEnhance
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); os.makedirs('out', exist_ok=True)
F = '/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'
YEL, WHITE, INK = '#FFE14A', '#FFFFFF', '#111111'
def font(sz): return ImageFont.truetype(F, sz, index=0)
def fit(d, t, sz, maxw):
    while sz > 40 and d.textlength(t, font=font(sz)) > maxw: sz -= 4
    return font(sz), sz
def txt(d, xy, t, sz, fill, maxw=1200, anchor='la', sw=None, bar=None):
    f, sz = fit(d, t, sz, maxw); sw = sw if sw is not None else max(6, sz // 8)
    if bar:
        bb = d.textbbox(xy, t, font=f, anchor=anchor); d.rounded_rectangle((bb[0] - 18, bb[1] - 12, bb[2] + 18, bb[3] + 16), 14, fill=bar); sw = 0
    d.text(xy, t, font=f, fill=fill, anchor=anchor, stroke_width=sw, stroke_fill=INK)
def crop(src, box): return Image.open(src).convert('RGB').crop(box).resize((1280, 720), Image.LANCZOS)
def leftshade(im, a=170, w=700):
    g = Image.new('L', im.size); gd = ImageDraw.Draw(g)
    for x in range(im.width): gd.line([(x, 0), (x, im.height)], fill=int(a * max(0, 1 - x / w) ** 1.1))
    return Image.composite(Image.new('RGB', im.size, (6, 8, 16)), im, g)
OUT = []
def make(name, src, box, l1, l2, s1=100, s2=150):
    im = ImageEnhance.Contrast(crop(src, box)).enhance(1.08); im = leftshade(im, 175, 720); d = ImageDraw.Draw(im)
    txt(d, (44, 190), l1, s1, WHITE, 600)
    txt(d, (44, 330), l2, s2, INK, 600, bar=YEL)
    im.save(f'out/{name}.jpg', quality=93); OUT.append(im)
make('기게스_썸네일_A_내몸어디갔어', 'ai/ghost_1.png', (120, 0, 1920, 1013), '내 몸…', '어디 갔어?', 112, 140)
make('기게스_썸네일_B_반지를돌리면', 'ai/ring_1.png', (120, 0, 1920, 1013), '반지를 돌리면', '사라진다', 92, 150)
s = Image.new('RGB', (1280, 360)); [s.paste(im.resize((640, 360)), (n * 640, 0)) for n, im in enumerate(OUT)]; s.save('out/_sheet.jpg', quality=85)
m = Image.new('RGB', (168 * 2 + 10, 94), '#0F0F0F'); [m.paste(im.resize((168, 94), Image.LANCZOS), (n * 178, 0)) for n, im in enumerate(OUT)]
m.resize((m.width * 2, 188), Image.NEAREST).save('out/_mobile.jpg', quality=90); print('ok')
