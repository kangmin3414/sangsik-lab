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
def split():
    im = crop('ai/split_1.png', (0, 0, 1920, 1080)); d = ImageDraw.Draw(im)
    g = Image.new('L', im.size); gd = ImageDraw.Draw(g)
    for y in range(720): gd.line([(0, y), (1280, y)], fill=int(170 * max(0, (y - 470) / 250) ** 1.2))
    im = Image.composite(Image.new('RGB', im.size, (6, 8, 16)), im, g); d = ImageDraw.Draw(im)
    txt(d, (210, 650), '"네, 괜찮아요"', 66, '#111', 380, anchor='mm', bar='#FFFFFF')
    txt(d, (930, 585), '싫어!', 200, YEL, 600, anchor='mm', sw=22)
    return im
def mask():
    src = crop('ai/mask_2.png', (0, 0, 1920, 1080)); sh = 170
    im = Image.new('RGB', (1280, 720)); im.paste(src, (sh, 0))
    strip = src.crop((0, 0, sh, 720)).transpose(Image.FLIP_LEFT_RIGHT).filter(ImageFilter.GaussianBlur(8)); im.paste(strip, (0, 0))
    im = leftshade(im, 150, 680); d = ImageDraw.Draw(im)
    txt(d, (40, 175), '착한 게 아니라', 94, WHITE, 560)
    txt(d, (40, 300), '겁난 거다', 150, '#111', 560, bar=YEL)
    return im
if __name__ == '__main__':
    which = sys.argv[1:] or ['split', 'mask', 'sheep']
    for w in which: save(w, globals()[w]())
    print('ok', which)
    s = Image.new('RGB', (1280, 360 * ((len(OUT) + 1) // 2)))
    for n, im in enumerate(OUT): s.paste(im.resize((640, 360)), ((n % 2) * 640, (n // 2) * 360))
    s.save('out/_sheet.jpg', quality=85)
    m = Image.new('RGB', (168 * len(OUT) + 10 * (len(OUT) - 1), 94), '#0F0F0F')
    for n, im in enumerate(OUT): m.paste(im.resize((168, 94), Image.LANCZOS), (n * 178, 0))
    m.resize((m.width * 2, 188), Image.NEAREST).save('out/_mobile.jpg', quality=90)
