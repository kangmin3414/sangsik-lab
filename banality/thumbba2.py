"""썸네일 3종(테스트 및 비교용). 원칙: 그림 하나에 시선 하나, 글자 2줄·6자 안팎, 얼굴 감정, 고대비, 제목과 글자가 겹치지 않게.
T1 그림자 악마(착한 사람이 더 무섭다) · T2 땀 흘리는 제로와 레버(450V, 당신도 누른다) · T3 40명 중 26명(65%가 눌렀다)."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
F = '/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'; f = lambda s: ImageFont.truetype(F, s, index=1)
def glow_text(im, xy, s, size, fill, sw=18, glow=None, anchor='la'):
    if glow:
        g = Image.new('RGBA', im.size, (0, 0, 0, 0)); ImageDraw.Draw(g).text(xy, s, font=f(size), fill=glow, stroke_width=sw + 10, stroke_fill=glow, anchor=anchor)
        im.alpha_composite(g.filter(ImageFilter.GaussianBlur(18)))
    ImageDraw.Draw(im).text(xy, s, font=f(size), fill=fill, stroke_width=sw, stroke_fill='#0B0C12', anchor=anchor)
# T1
im = Image.open('ai/T1.png').convert('RGBA'); im = Image.alpha_composite(im, Image.new('RGBA', im.size, (0, 0, 0, 0)))
glow_text(im, (1090, 230), '착한 사람이', 140, '#FFFFFF')
glow_text(im, (1090, 420), '더 무섭다', 176, '#FF4A3A', 20, glow=(255, 60, 40, 150))
im.convert('RGB').save('thumb/악의평범성_썸네일_A_그림자.jpg', quality=93)
# T2
im = Image.open('ai/T2.png').convert('RGBA')
glow_text(im, (1060, 150), '450V', 230, '#FF4A3A', 20, glow=(255, 40, 30, 170))
glow_text(im, (1100, 420), '당신도', 120, '#FFFFFF'); glow_text(im, (1100, 560), '누른다', 150, '#FFD27A')
im.convert('RGB').save('thumb/악의평범성_썸네일_B_레버.jpg', quality=93)
# T3: 40 people, 26 lit red, and one huge number
im = Image.new('RGBA', (1920, 1080), (14, 16, 24, 255)); d = ImageDraw.Draw(im)
for n in range(40):
    c, r = n % 8, n // 8; x, y = 120 + c * 105, 170 + r * 160; on = n < 26
    col = (255, 74, 58) if on else (70, 76, 92)
    d.ellipse((x - 34, y - 34, x + 34, y + 34), fill=col); d.rounded_rectangle((x - 30, y + 40, x + 30, y + 100), 18, fill=col)
glow_text(im, (1420, 420), '65%', 330, '#FF4A3A', 22, glow=(255, 50, 40, 170), anchor='mm')
glow_text(im, (1420, 700), '끝까지 눌렀다', 110, '#FFFFFF', 16, anchor='mm')
glow_text(im, (1420, 840), '평범한 사람 40명 중 26명', 56, '#C9CDD6', 10, anchor='mm')
im.convert('RGB').save('thumb/악의평범성_썸네일_C_65퍼센트.jpg', quality=93)
print('ok')
