import os, math
from PIL import Image, ImageDraw, ImageFilter
os.chdir(os.path.dirname(os.path.abspath(__file__)))
S = 1600
def radial(c0, c1, cx=0.5, cy=0.42, r=0.75):
    im = Image.new('RGB', (S, S), c1); d = ImageDraw.Draw(im)
    for i in range(120, 0, -1):
        k = i / 120; col = tuple(int(c0[j] + (c1[j] - c0[j]) * k) for j in range(3)); rr = r * S * k
        d.ellipse((cx * S - rr, cy * S - rr, cx * S + rr, cy * S + rr), fill=col)
    return im.filter(ImageFilter.GaussianBlur(20))
def stars(im, n=40, seed=3):
    import random; R = random.Random(seed); d = ImageDraw.Draw(im)
    for _ in range(n):
        x, y = R.random() * S, R.random() * S * 0.6; r = R.choice([3, 4, 6])
        d.ellipse((x - r, y - r, x + r, y + r), fill=(255, 240, 200))
def sunburst(im, col, n=16):
    d = Image.new('L', (S, S), 0); dd = ImageDraw.Draw(d); cx, cy = S / 2, S * 0.42
    for i in range(n):
        a0 = i * 2 * math.pi / n; a1 = a0 + math.pi / n
        dd.polygon([(cx, cy), (cx + 2 * S * math.cos(a0), cy + 2 * S * math.sin(a0)), (cx + 2 * S * math.cos(a1), cy + 2 * S * math.sin(a1))], fill=70)
    return Image.composite(Image.new('RGB', (S, S), col), im, d)
def make(name, bg, zfile):
    z = Image.open(zfile).convert('RGBA').resize((S, S), Image.LANCZOS)
    bg.paste(z, (0, 40), z)
    out = bg.resize((800, 800), Image.LANCZOS); out.save(f'out/profile_{name}.png', optimize=True); return out
A = radial((88, 70, 150), (18, 22, 52)); stars(A); A = make('A', A, 'pz_smile.png')
B = sunburst(radial((255, 214, 96), (255, 140, 60)), (255, 236, 170)); B = make('B', B, 'pz_wink.png')
C = radial((96, 226, 206), (16, 110, 120), cy=0.42, r=0.8); C = make('C', C, 'pz_wink.png')
# preview: circle crops at 800 / 98 / 40 px on dark and light backgrounds
ims = [A, B, C]; pv = Image.new('RGB', (3 * 300 + 40, 520), '#0F0F0F'); pl = Image.new('RGB', (3 * 300 + 40, 160), '#FFFFFF')
def circ(im, d):
    m = Image.new('L', (d * 4, d * 4), 0); ImageDraw.Draw(m).ellipse((0, 0, d * 4, d * 4), fill=255); m = m.resize((d, d), Image.LANCZOS)
    o = im.resize((d, d), Image.LANCZOS); return o, m
for i, im in enumerate(ims):
    x = 20 + i * 300
    o, m = circ(im, 260); pv.paste(o, (x, 20), m)
    o, m = circ(im, 98); pv.paste(o, (x, 300), m)
    o, m = circ(im, 40); pv.paste(o, (x + 120, 330), m)
    o, m = circ(im, 24); pv.paste(o, (x + 180, 338), m)
    o, m = circ(im, 98); pl.paste(o, (x, 30), m); o, m = circ(im, 40); pl.paste(o, (x + 120, 60), m); o, m = circ(im, 24); pl.paste(o, (x + 180, 68), m)
sheet = Image.new('RGB', (pv.width, pv.height + pl.height)); sheet.paste(pv, (0, 0)); sheet.paste(pl, (0, pv.height)); sheet.save('out/_profile_preview.jpg', quality=88)
print('ok')
