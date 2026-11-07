"""니체 거절 편 썸네일: AI 장면 + 두 줄 큰 글씨. usage: python3 mk.py key:copy ... -> out/*.jpg"""
import os, sys
from PIL import Image, ImageDraw
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, '/home/claude/sangsik-lab/thumbN'); import mk as M
os.chdir(HERE); os.makedirs('out', exist_ok=True)
COPY = {'A': ('착해서가 아니라', '겁나서다', M.YEL), 'B': ('웃고 있지만', '속은 지옥', M.RED), 'C': ('너는 착한 게', '아니다', M.YEL)}
def make(key, cp):
    l1, l2, bar = COPY[cp]
    o = Image.open(f'ai/{key}.png').convert('RGB').resize((1280, 720), Image.LANCZOS)
    g = Image.new('L', (1280, 720)); gd = ImageDraw.Draw(g)
    for x in range(1280): gd.line([(x, 0), (x, 720)], fill=int(175 * max(0, 1 - x / 700) ** 1.1))
    o = Image.composite(Image.new('RGB', (1280, 720), (6, 8, 16)), o, g); d = ImageDraw.Draw(o)
    f1, s1 = M.fit(l1, 120, 600); f2, s2 = M.fit(l2, 190, 620)
    h = (s1 * 1.25) + 30 + s2 * 1.3; y = int((720 - h) / 2) - 10
    y = M.line(d, y, l1, 120, 'white', maxw=600) + 26
    M.line(d, y, l2, 190, '#111', bar=bar, maxw=620)
    o.save(f'out/{cp}_{key}.jpg', quality=93); return o
if __name__ == '__main__':
    ims = [make(*a.split(':')) for a in sys.argv[1:]]
    s = Image.new('RGB', (1280, 360 * ((len(ims) + 1) // 2)))
    for n, im in enumerate(ims): s.paste(im.resize((640, 360)), ((n % 2) * 640, (n // 2) * 360))
    s.save('out/_sheet.jpg', quality=85)
    m = Image.new('RGB', (168 * len(ims), 94))
    for n, im in enumerate(ims): m.paste(im.resize((168, 94), Image.LANCZOS), (n * 168, 0))
    m.resize((m.width * 2, 188), Image.NEAREST).save('out/_mobile.jpg', quality=90); print('ok')
