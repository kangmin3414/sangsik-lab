"""Click-thumbnails v2: plain Zero only (no philosopher faces/badges), 3 short lines, big text.
usage: python3 mk.py  -> out/*.jpg (1280x720) + out/_sheet.jpg"""
import os, sys
from PIL import Image, ImageFilter, ImageDraw, ImageFont, ImageEnhance
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); os.makedirs('out', exist_ok=True)
F = '/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'; AI = '../thumbD/ai/'
YEL, MINT, ORG, RED, SKY = '#FFE14A', '#8CFF7A', '#FFB26B', '#FF6B6B', '#7FD6FF'
def base(src, box, ell):
    im = Image.open(src).convert('RGB'); c = im.crop(box).resize((1280, 720), Image.LANCZOS)
    sx, sy = 1280 / (box[2] - box[0]), 720 / (box[3] - box[1])
    e = [(ell[0] - box[0]) * sx, (ell[1] - box[1]) * sy, (ell[2] - box[0]) * sx, (ell[3] - box[1]) * sy]
    bg = ImageEnhance.Color(ImageEnhance.Brightness(c.filter(ImageFilter.GaussianBlur(16))).enhance(0.30)).enhance(0.55)
    m = Image.new('L', (1280, 720), 0); ImageDraw.Draw(m).ellipse(e, fill=255); m = m.filter(ImageFilter.GaussianBlur(35))
    o = Image.composite(ImageEnhance.Contrast(c).enhance(1.12), bg, m)
    # dark gradient on the left for text contrast
    g = Image.new('L', (1280, 720)); gd = ImageDraw.Draw(g)
    for x in range(1280): gd.line([(x, 0), (x, 720)], fill=int(150 * max(0, 1 - x / 760)))
    return Image.composite(Image.new('RGB', (1280, 720), (6, 8, 16)), o, g)
def fit(t, size, maxw):
    while size > 40:
        f = ImageFont.truetype(F, size, index=0)
        if f.getlength(t) <= maxw: return f, size
        size -= 4
    return ImageFont.truetype(F, 40, index=0), 40
def line(d, y, t, size, col, bar=None, maxw=590, x=44, sw=None):
    f, size = fit(t, size, maxw); bb = d.textbbox((x, y), t, font=f)
    if bar: d.rounded_rectangle((bb[0] - 16, bb[1] - 10, bb[2] + 16, bb[3] + 14), 10, fill=bar)
    d.text((x, y), t, font=f, fill=col, stroke_width=0 if bar else max(5, size // 9), stroke_fill='black')
    return bb[3] + (14 if bar else 8)
def make(name, src, box, ell, l1, l2, l3, bar, c3=None):
    o = base(AI + src, box, ell); d = ImageDraw.Draw(o)
    y = 120; y = line(d, y, l1, 104, 'white') + 10
    y = line(d, y, l2, 150, '#111', bar=bar) + 22
    line(d, y, l3, 68, c3 or bar)
    o.save(f'out/{name}.jpg', quality=92); return o
J = [
 ('005_니체_A', 'nz4.png', (240, 0, 1920, 945), (800, 60, 1920, 1080), '다들 달리는데', '나만 멈췄다', '니체가 답했다', YEL),
 ('005_니체_B', 'nz3.png', (50, 0, 1850, 1012), (900, 100, 1850, 1080), '뭘 위해 사는지', '모르겠다면', '140년 전 니체의 답', YEL, RED),
 ('006_스토아', 'stoic1.png', (0, 0, 1920, 1080), (1000, 60, 1720, 1080), '난리 난 회사', '나만 평온한 법', '로마 황제의 습관', SKY, YEL),
 ('007_데카르트', 'descartes1.png', (230, 0, 1750, 855), (950, 120, 1750, 1080), '똑똑해도', '속는다', '하버드생 절반도', YEL, RED),
 ('008_장자', 'zhuangzi1.png', (560, 150, 1920, 915), (850, 250, 1800, 950), '쓸모없어서', '살아남았다', '2,300년 전 반전', MINT, YEL),
 ('009_소크라테스', 'socrates1.png', (330, 200, 1830, 1044), (900, 240, 1700, 1080), '"모르겠어요"', '했더니?', '연구 결과는 반대', YEL, RED),
 ('010_붓다', 'buddha1.png', (200, 120, 1640, 930), (850, 180, 1600, 1050), '깨어 있는 시간의', '46.9%', '딴생각 중', ORG, 'white'),
 ('011_시간', 'time1.png', (30, 0, 1530, 843), (800, 120, 1400, 1080), '1년이 왜', '이렇게 빠를까', '시간을 늘리는 법', YEL, MINT),
 ('012_화', 'anger1.png', (116, 0, 1436, 742), (600, 40, 1400, 960), '화났을 때', '보내기 전에', '딱 하루만', RED, YEL),
 ('013_행복', 'mom1.png', (180, 100, 1680, 943), (880, 100, 1560, 1080), '좋은 일 없는 날', '별 세 개', '일주일 뒤 달라진 것', YEL, SKY),
 ('몰아보기01', 'compile.png', (280, 60, 1680, 848), (940, 100, 1740, 960), '흔들릴 때 꺼내 보는', '철학 4편', '한 번에 몰아보기', YEL, 'white'),
]
if __name__ == '__main__':
    ims = [make(*j).resize((640, 360)) for j in J]
    s = Image.new('RGB', (1920, 360 * 4))
    for n, im in enumerate(ims): s.paste(im, ((n % 3) * 640, (n // 3) * 360))
    s.save('out/_sheet.jpg', quality=85)
    # mobile legibility test (168x94 each)
    m = Image.new('RGB', (168 * 6, 94 * 2))
    for n, im in enumerate(ims): m.paste(im.resize((168, 94), Image.LANCZOS), ((n % 6) * 168, (n // 6) * 94))
    m.resize((168 * 6 * 2, 94 * 2 * 2), Image.NEAREST).save('out/_mobile.jpg', quality=90)
    print('ok', len(J))
