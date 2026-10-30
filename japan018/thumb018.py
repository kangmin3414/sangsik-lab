"""Ep.018 thumbnails from the episode's own pictures: T1 year-1 Zero vs year-30 Zero (split), T2 the Seoul banchan table."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
F = lambda s: ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc', s, index=1)
INK, YEL, RED, WHITE = (20, 30, 50), (255, 226, 122), (232, 74, 60), (255, 255, 255)
def text(d, xy, s, size, fill, anchor='mm', sw=14):
    d.text(xy, s, font=F(size), fill=fill, anchor=anchor, stroke_width=sw, stroke_fill=INK)
# T1
a = Image.open('ai/1-1.png').convert('RGB'); b = Image.open('ai/5-4.png').convert('RGB')
im = Image.new('RGB', (1920, 1080)); im.paste(a.crop((480, 0, 1440, 1080)), (0, 0)); im.paste(b.crop((960, 0, 1920, 1080)), (960, 0))
d = ImageDraw.Draw(im); d.polygon([(940, 0), (980, 0), (980, 1080), (940, 1080)], fill=WHITE); d.line([(960, 0), (960, 1080)], fill=INK, width=8)
d.rectangle((0, 0, 1920, 300), fill=(20, 30, 50)); text(d, (960, 100), '일본에서 30년 살면', 92, WHITE, sw=0); text(d, (960, 225), '나는 어느 나라 사람?', 110, YEL, sw=0)
for x, s, c in ((300, '1년 차', (255, 205, 220)), (1620, '30년 차', (205, 225, 245))):
    d.rounded_rectangle((x - 150, 900, x + 150, 1010), 40, fill=c, outline=INK, width=8); d.text((x, 955), s, font=F(64), fill=INK, anchor='mm')
im.save('thumb/상식실험실_실험018_썸네일_T1.jpg', quality=92)
# T2
im = Image.open('ai/4-6.png').convert('RGB'); d = ImageDraw.Draw(im)
d.rectangle((0, 0, 1920, 320), fill=(255, 244, 224)); d.line([(0, 320), (1920, 320)], fill=INK, width=8)
d.text((960, 110), '일본 30년 살고 돌아오니', font=F(88), fill=INK, anchor='mm'); d.text((960, 235), '한국이 신기해졌다', font=F(110), fill=RED, anchor='mm')
d.rounded_rectangle((1240, 880, 1880, 1030), 40, fill=YEL, outline=INK, width=8); d.text((1560, 955), '"그냥 드시는 거예요~"', font=F(52), fill=INK, anchor='mm')
im.save('thumb/상식실험실_실험018_썸네일_T2.jpg', quality=92)
print('ok')
