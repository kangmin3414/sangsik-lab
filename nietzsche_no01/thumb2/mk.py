"""니체 편 썸네일 v2. usage: python3 mk.py"""
import os, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); os.makedirs('out', exist_ok=True)
F = '/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'
YEL, RED, WHITE, INK = '#FFE14A', '#FF4D4D', '#FFFFFF', '#111111'
def font(sz): return ImageFont.truetype(F, sz, index=0)
def fit(d, t, sz, maxw):
    while sz > 40 and d.textlength(t, font=font(sz)) > maxw: sz -= 4
    return font(sz), sz
def txt(d, xy, t, sz, fill, maxw=1200, anchor='la', sw=None, bar=None):
    f, sz = fit(d, t, sz, maxw); sw = sw if sw is not None else max(6, sz // 8)
    if bar:
        bb = d.textbbox(xy, t, font=f, anchor=anchor); d.rounded_rectangle((bb[0] - 18, bb[1] - 12, bb[2] + 18, bb[3] + 16), 14, fill=bar); sw = 0
    d.text(xy, t, font=f, fill=fill, anchor=anchor, stroke_width=sw, stroke_fill=INK)
    return d.textbbox(xy, t, font=f, anchor=anchor, stroke_width=sw)
def crop(src, box): return Image.open(src).convert('RGB').crop(box).resize((1280, 720), Image.LANCZOS)
def leftshade(im, a=170, w=700):
    g = Image.new('L', im.size); gd = ImageDraw.Draw(g)
    for x in range(im.width): gd.line([(x, 0), (x, im.height)], fill=int(a * max(0, 1 - x / w) ** 1.1))
    return Image.composite(Image.new('RGB', im.size, (6, 8, 16)), im, g)
OUT = []
def save(name, im): im.save(f'out/{name}.jpg', quality=93); OUT.append(im)
# C: sheep among wolves (the video's own frame)
def sheep():
    im = crop('../long/ai/sheep.png', (380, 120, 1820, 930)); im = ImageEnhance.Contrast(im).enhance(1.08); im = leftshade(im, 150, 640); d = ImageDraw.Draw(im)
    txt(d, (40, 150), '너는 착한 게', 104, WHITE, 600)
    txt(d, (40, 290), '아니다', 210, '#111', 600, bar=YEL)
    return im
if __name__ == '__main__':
    which = sys.argv[1:] or ['sheep']
    for w in which: save(w, globals()[w]())
    print('ok', which)
