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
def meet(k='1'):
    im = leftshade(crop(f'ai/meet_{k}.png', (0, 0, 1920, 1080)), 160, 660); d = ImageDraw.Draw(im)
    txt(d, (40, 170), '"모르겠어요"', 104, WHITE, 580)
    txt(d, (40, 310), '했더니?', 190, '#111', 580, bar=YEL)
    return im
def meet2(): return meet('2')
def scroll():
    im = leftshade(crop('ai/scroll_1.png', (0, 0, 1920, 1080)), 160, 660); d = ImageDraw.Draw(im)
    txt(d, (40, 170), '독배와 바꾼', 104, WHITE, 580)
    txt(d, (40, 310), '한 문장', 190, '#111', 580, bar=YEL)
    return im
def crown():
    im = leftshade(crop('ai/crown_1.png', (0, 0, 1920, 1080)), 160, 660); d = ImageDraw.Draw(im)
    txt(d, (40, 170), '질문하면 바보?', 96, WHITE, 580)
    txt(d, (40, 310), '정반대', 200, '#111', 580, bar=YEL)
    return im
if __name__ == '__main__':
    which = sys.argv[1:] or ['meet', 'meet2', 'scroll', 'crown']
    for w in which: save(w, globals()[w]())
    print('ok', which)
    s = Image.new('RGB', (1280, 360 * ((len(OUT) + 1) // 2)))
    for n, im in enumerate(OUT): s.paste(im.resize((640, 360)), ((n % 2) * 640, (n // 2) * 360))
    s.save('out/_sheet.jpg', quality=85)
    m = Image.new('RGB', (168 * len(OUT) + 10 * (len(OUT) - 1), 94), '#0F0F0F')
    for n, im in enumerate(OUT): m.paste(im.resize((168, 94), Image.LANCZOS), (n * 178, 0))
    m.resize((m.width * 2, 188), Image.NEAREST).save('out/_mobile.jpg', quality=90)
