"""썸네일 A/B. T1: 1961 재판정(흑백) + '악마는 뿔 달린 괴물이 아니다'. T2: 450V 레버를 내리는 주황 후드 제로 + '40명 중 26명이 끝까지 당겼다'."""
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageOps
F = '/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'; f = lambda s: ImageFont.truetype(F, s, index=1)
def text(d, xy, s, size, fill, sw=14, anchor='la'): d.text(xy, s, font=f(size), fill=fill, stroke_width=sw, stroke_fill='#10121C', anchor=anchor)
im = ImageOps.grayscale(Image.open('ai/H1.png')).convert('RGB'); im = ImageEnhance.Contrast(im).enhance(1.15)
im = im.crop((300, 120, 1620, 862)).resize((1920, 1080), Image.LANCZOS); d = ImageDraw.Draw(im)
d.rectangle((0, 0, 1920, 330), fill=(16, 18, 28)); text(d, (80, 50), '악마는 뿔 달린', 120, '#FFFFFF'); text(d, (80, 190), '괴물', 120, '#F28C38'); text(d, (360, 190), '이 아니다', 120, '#FFFFFF')
d.rounded_rectangle((1380, 900, 1860, 1010), 50, fill='#F28C38'); text(d, (1620, 955), '생각 없는 성실함', 44, '#10121C', 0, 'mm')
im.save('thumb/악의평범성_썸네일_T1.jpg', quality=92)
v = Image.open('short/ai/V1.png').convert('RGB').crop((0, 560, 1080, 1167)).resize((1920, 1080), Image.LANCZOS); d = ImageDraw.Draw(v)
d.rounded_rectangle((1240, 60, 1860, 250), 36, fill='#14161E', outline='#FF5A4A', width=10); text(d, (1550, 155), '450V', 140, '#FF5A4A', 0, 'mm')
d.rectangle((1080, 300, 1920, 640), fill=(16, 18, 28)); text(d, (1120, 330), '40명 중 26명이', 92, '#FFFFFF'); text(d, (1120, 470), '끝까지 당겼다', 104, '#FFD27A')
v.save('thumb/악의평범성_썸네일_T2.jpg', quality=92); print('ok')
