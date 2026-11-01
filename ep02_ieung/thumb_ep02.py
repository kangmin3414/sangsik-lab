"""Thumbnail: Zero lit by his phone (art/T1.png) + a phone bubble (long message) and the reply 'ㅇㅇ' in huge red."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
B = '/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'
im = Image.open('art/T1.png').convert('RGB').resize((1280, 720), Image.LANCZOS)
d = ImageDraw.Draw(im, 'RGBA')
# phone panel on the right
px, py, pw, ph = 760, 70, 470, 600
d.rounded_rectangle([px, py, px + pw, py + ph], 40, fill=(178, 199, 218, 255), outline=(20, 20, 24, 255), width=14)
f1 = ImageFont.truetype(B, 30); f0 = ImageFont.truetype(B, 22)
d.text((px + 40, py + 30), '‹ 오 팀장', font=f0, fill=(20, 20, 20))
lines = ['팀장님, 아침부터 죄송합니다.', '내일 오전에 어머니 검진이', '있어서 반차를 쓰고 싶습니다.', '마감 주간인 건 알지만…', '바쁘신데 죄송합니다']
bx, by = px + 70, py + 80
d.rounded_rectangle([bx, by, bx + 370, by + 30 + 38 * len(lines)], 22, fill=(254, 229, 0, 255))
for n, t in enumerate(lines): d.text((bx + 18, by + 14 + 38 * n), t, font=ImageFont.truetype(B, 24), fill=(30, 30, 30))
# the reply
ry = by + 30 + 38 * len(lines) + 40
d.rounded_rectangle([px + 40, ry, px + 370, ry + 190], 30, fill=(255, 255, 255, 255))
fO = ImageFont.truetype(B, 150)
d.text((px + 62, ry - 6), 'ㅇㅇ', font=fO, fill=(232, 52, 36))
# top caption
cap = '열한 번 고쳐 썼는데'
fc = ImageFont.truetype(B, 64)
for dx in range(-5, 6, 1):
    for dy in range(-5, 6, 1): d.text((40 + dx, 40 + dy), cap, font=fc, fill=(0, 0, 0))
d.text((40, 40), cap, font=fc, fill=(255, 255, 255))
im.save('S1E02_ㅇㅇ_썸네일_A.jpg', quality=92); print('thumb ok')
