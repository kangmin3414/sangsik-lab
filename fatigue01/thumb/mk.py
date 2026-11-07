"""피로사회 편 썸네일. usage: python3 mk.py [melt_cando melt_6 culprit]"""
import os, sys
from PIL import Image, ImageDraw, ImageEnhance
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, '/home/claude/sangsik-lab/nietzsche_no01/thumb2')
import mk as nm  # crop, leftshade, txt (그 파일은 import 때 자기 폴더로 chdir 하므로 아래에서 되돌림)
os.chdir(HERE); os.makedirs('out', exist_ok=True)
crop, leftshade, txt, YEL, WHITE = nm.crop, nm.leftshade, nm.txt, nm.YEL, nm.WHITE
OUT = []
NAME = {'melt_cando': '피로사회편_썸네일_1_그게문제다', 'culprit': '피로사회편_썸네일_2_범인은', 'melt_6': '피로사회편_썸네일_3_아직6'}
def save(k, im): im.save(f'out/{NAME[k]}.jpg', quality=93); OUT.append(im)
def melt():
    im = crop('ai/melt_2.png', (120, 30, 1920, 1043)); im = ImageEnhance.Contrast(im).enhance(1.06)
    return leftshade(im, 165, 660)
# 1) 코치 대사(0:24) + 블라인드 — 답은 1:32 "'할 수 있다'에는 끝이 없다"
def melt_cando():
    im = melt(); d = ImageDraw.Draw(im)
    txt(d, (44, 200), '“할 수 있어!”', 86, WHITE, 520)
    txt(d, (40, 330), '그게 문제다', 150, '#111', 560, bar=YEL)
    return im
# 3) 코치 대사 그대로(0:24)
def melt_6():
    im = melt(); d = ImageDraw.Draw(im)
    txt(d, (40, 170), '아직 6%', 130, WHITE, 560)
    txt(d, (40, 340), '남았어!', 170, '#111', 560, bar=YEL)
    return im
# 2) 0:40 "범인은, 생각보다 가까이 있습니다."
def culprit():
    im = crop('ai/culprit_2.png', (100, 0, 1920, 1024)); im = leftshade(im, 175, 640); d = ImageDraw.Draw(im)
    txt(d, (40, 180), '범인은', 130, WHITE, 540)
    txt(d, (40, 350), '가까이 있다', 140, '#111', 560, bar=YEL)
    return im
if __name__ == '__main__':
    which = sys.argv[1:] or ['melt_cando', 'culprit', 'melt_6']
    for w in which: save(w, globals()[w]())
    print('ok', which)
    s = Image.new('RGB', (1280, 360 * ((len(OUT) + 1) // 2)))
    for n, im in enumerate(OUT): s.paste(im.resize((640, 360)), ((n % 2) * 640, (n // 2) * 360))
    s.save('out/_sheet.jpg', quality=85)
    m = Image.new('RGB', (168 * len(OUT) + 10 * (len(OUT) - 1), 94), '#0F0F0F')
    for n, im in enumerate(OUT): m.paste(im.resize((168, 94), Image.LANCZOS), (n * 178, 0))
    m.resize((m.width * 2, 188), Image.NEAREST).save('out/_mobile.jpg', quality=90)
