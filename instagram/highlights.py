"""인스타 하이라이트 커버 5개(1080x1920, 가운데 원 안만 보임) + 프로필 사진(유튜브와 같은 그림).  python3 highlights.py"""
import shutil
from PIL import Image, ImageDraw, ImageFont
F = lambda s: ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc', s, index=1)
INK, MINT, CREAM, YEL, RED = (20, 30, 50), (66, 211, 160), (255, 244, 224), (255, 214, 92), (232, 74, 60)
def base(fill):
    im = Image.new('RGB', (1080, 1920), CREAM); d = ImageDraw.Draw(im)
    d.ellipse((190, 610, 890, 1310), fill=fill, outline=INK, width=14); return im, d
def flask(d):
    d.polygon([(500, 760), (580, 760), (580, 900), (700, 1110), (380, 1110), (500, 900)], fill=(255, 255, 255), outline=INK, width=12)
    d.polygon([(445, 1000), (635, 1000), (690, 1100), (390, 1100)], fill=MINT); d.ellipse((470, 1030, 500, 1060), fill=(255, 255, 255)); d.line([(480, 760), (600, 760)], fill=INK, width=14)
def play(d): d.rounded_rectangle((400, 780, 680, 1140), 40, fill=(255, 255, 255), outline=INK, width=12); d.polygon([(500, 880), (500, 1040), (610, 960)], fill=RED)
def book(d):
    d.polygon([(330, 820), (540, 860), (540, 1110), (330, 1070)], fill=(255, 255, 255), outline=INK, width=12)
    d.polygon([(750, 820), (540, 860), (540, 1110), (750, 1070)], fill=(255, 255, 255), outline=INK, width=12)
    for k in range(3): d.line([(370, 900 + k * 50), (500, 925 + k * 50)], fill=(180, 170, 150), width=8); d.line([(580, 925 + k * 50), (710, 900 + k * 50)], fill=(180, 170, 150), width=8)
def bars(d):
    for k, h in enumerate((130, 210, 300)): d.rounded_rectangle((380 + k * 120, 1110 - h, 460 + k * 120, 1110), 14, fill=[MINT, YEL, RED][k], outline=INK, width=10)
    d.line([(350, 1120), (750, 1120)], fill=INK, width=12)
def bubble(d):
    d.rounded_rectangle((340, 800, 740, 1060), 60, fill=(255, 255, 255), outline=INK, width=12); d.polygon([(430, 1050), (400, 1130), (500, 1056)], fill=(255, 255, 255), outline=INK)
    d.text((540, 930), '?', font=F(200), fill=RED, anchor='mm')
for name, fill, icon in (('실험', YEL, flask), ('쇼츠', (255, 190, 170), play), ('철학자', (200, 225, 245), book), ('연구', (205, 236, 220), bars), ('다음실험', (240, 220, 245), bubble)):
    im, d = base(fill); icon(d); im.save(f'profile/하이라이트_{name}.jpg', quality=92)
shutil.copy('../brand/만약에연구소_프로필_800x800.png', 'profile/프로필사진_800x800.png')
print('ok')
