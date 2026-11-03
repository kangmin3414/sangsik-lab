"""썸네일 A/B (제목·훅과 같은 장면). T1: 하얀 공간에 홀로 앉은 제로 + '1,000년' 배지 + 글자. T2: 왼쪽 무채색 소원의 방 / 오른쪽 따뜻한 바둑판."""
from PIL import Image, ImageDraw, ImageFont, ImageEnhance
F = '/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'
f = lambda s: ImageFont.truetype(F, s, index=1)
def text(d, xy, s, size, fill, stroke=14, anchor='la'):
    d.text(xy, s, font=f(size), fill=fill, stroke_width=stroke, stroke_fill='#1A1F33', anchor=anchor)
src = Image.open('ai/B2.png').convert('RGB'); src = ImageEnhance.Color(src).enhance(0.6)
im = src.crop((285, 250, 1245, 790)).resize((1920, 1080), Image.LANCZOS)   # zoom in on lonely Zero (he sits a bit right of centre)
d = ImageDraw.Draw(im)
text(d, (90, 90), '소원이 다 이루어지는 방', 96, '#FFFFFF')
text(d, (90, 230), '1,000년 뒤', 150, '#FFE27A', 18)
text(d, (90, 420), '나는 반지하를 골랐다', 110, '#FFFFFF')
d.rounded_rectangle((90, 900, 570, 1010), 55, fill='#1A1F33'); text(d, (330, 955), '방에 들어온 지 1,000년', 40, '#FFFFFF', 0, 'mm')
im.save('thumb/소원의방_썸네일_T1.jpg', quality=92)
L = ImageEnhance.Color(Image.open('ai/B6.png').convert('RGB')).enhance(0.25).crop((260, 0, 1220, 1080))
R = Image.open('ai/C5.png').convert('RGB').crop((480, 0, 1440, 1080))
im = Image.new('RGB', (1920, 1080)); im.paste(L, (0, 0)); im.paste(R, (960, 0)); d = ImageDraw.Draw(im)
d.rectangle((952, 0, 968, 1080), fill='#FFFFFF')
text(d, (480, 120), '뭐든 다 되는 방', 84, '#FFFFFF', 12, 'mm'); text(d, (1440, 120), '반지하 바둑 한 판', 84, '#FFE27A', 12, 'mm')
text(d, (960, 960), '1,000년 뒤, 나는 이쪽을 골랐다', 92, '#FFFFFF', 16, 'mm')
im.save('thumb/소원의방_썸네일_T2.jpg', quality=92); print('ok')
