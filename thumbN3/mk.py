"""AI key visual + crisp Korean text overlay. usage: python3 mk.py -> out/*.jpg, _sheet.jpg, _mobile.jpg"""
import os, sys
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(HERE), 'thumbN')); import mk as M   # reuse fit()/line()
os.chdir(HERE); os.makedirs('out', exist_ok=True)
YEL, MINT, ORG, RED, SKY = M.YEL, M.MINT, M.ORG, M.RED, M.SKY
def make(name, key, l1, l2, l3, bar, c3=None):
    o = Image.open(f'ai/{key}.png').convert('RGB').resize((1280, 720), Image.LANCZOS)
    g = Image.new('L', (1280, 720)); gd = ImageDraw.Draw(g)
    for x in range(1280): gd.line([(x, 0), (x, 720)], fill=int(165 * max(0, 1 - x / 720) ** 1.2))
    o = Image.composite(Image.new('RGB', (1280, 720), (6, 8, 16)), o, g); d = ImageDraw.Draw(o)
    y = 120; y = M.line(d, y, l1, 104, 'white') + 10
    y = M.line(d, y, l2, 150, '#111', bar=bar) + 22
    M.line(d, y, l3, 68, c3 or bar)
    o.save(f'out/{name}.jpg', quality=93); return o
J = [
 ('005_니체_A', 'nz_a', '다들 달리는데', '나만 멈췄다', '니체가 답했다', YEL),
 ('005_니체_B', 'nz_b', '뭘 위해 사는지', '모르겠다면', '140년 전 니체의 답', YEL, RED),
 ('006_스토아', 'stoic', '난리 난 회사', '나만 평온한 법', '로마 황제의 습관', SKY, YEL),
 ('007_데카르트', 'desc', '똑똑해도', '속는다', '하버드생 절반도', YEL, RED),
 ('008_장자', 'zhuang', '쓸모없어서', '살아남았다', '2,300년 전 반전', MINT, YEL),
 ('009_소크라테스', 'socra', '"모르겠어요"', '했더니?', '연구 결과는 반대', YEL, RED),
 ('010_붓다', 'buddha', '깨어 있는 시간의', '46.9%', '딴생각 중', ORG, 'white'),
 ('011_시간', 'time', '1년이 왜', '이렇게 빠를까', '시간을 늘리는 법', YEL, MINT),
 ('012_화', 'anger', '화났을 때', '보내기 전에', '딱 하루만', RED, YEL),
 ('013_행복', 'mom', '좋은 일 없는 날', '별 세 개', '일주일 뒤 달라진 것', YEL, SKY),
 ('몰아보기01', 'cozy', '흔들릴 때 꺼내 보는', '철학 4편', '한 번에 몰아보기', YEL, 'white'),
]
if __name__ == '__main__':
    only = sys.argv[1:]; ims = []
    for j in J:
        if os.path.exists(f'ai/{j[1]}.png'): ims.append(make(*j).resize((640, 360)))
    s = Image.new('RGB', (1920, 360 * ((len(ims) + 2) // 3)))
    for n, im in enumerate(ims): s.paste(im, ((n % 3) * 640, (n // 3) * 360))
    s.save('out/_sheet.jpg', quality=85)
    m = Image.new('RGB', (168 * 6, 94 * 2))
    for n, im in enumerate(ims): m.paste(im.resize((168, 94), Image.LANCZOS), ((n % 6) * 168, (n // 6) * 94))
    m.resize((168 * 12, 94 * 4), Image.NEAREST).save('out/_mobile.jpg', quality=90); print('ok', len(ims))
