"""'제로의 세계' channel banner 2560x1440. usage: python3 compose.py bgkey -> out/banner_<key>.png + out/preview_<key>.jpg"""
import sys, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
os.chdir(os.path.dirname(os.path.abspath(__file__))); os.makedirs('out', exist_ok=True)
F = '/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'; FB = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
ORG, WHITE, INK, YEL = '#FF9A55', '#FFFFFF', '#141414', '#FFE14A'
SX0, SY0, SX1, SY1 = 507, 508, 2053, 931   # safe area for all devices
def make(key):
    bg = Image.open(f'ai/bg_{key}.png').convert('RGB').resize((2560, 1440), Image.LANCZOS)
    # soft dark oval behind the safe area for legibility
    m = Image.new('L', bg.size, 0); ImageDraw.Draw(m).ellipse((380, 420, 2180, 1020), fill=150); m = m.filter(ImageFilter.GaussianBlur(120))
    bg = Image.composite(Image.new('RGB', bg.size, (10, 12, 30)), bg, m)
    d = ImageDraw.Draw(bg)
    x0 = 610
    # pill
    pf = ImageFont.truetype(FB, 50, index=0); pt = '철학 · 심리 · 뇌과학 이야기'
    pw = d.textlength(pt, font=pf); d.rounded_rectangle((x0, 536, x0 + pw + 64, 614), 39, fill=None, outline=YEL, width=6)
    d.text((x0 + 32, 546), pt, font=pf, fill=YEL)
    # title
    tf = ImageFont.truetype(F, 236, index=0)
    y = 618; sw = 22
    a = '제로의 '; d.text((x0, y), a, font=tf, fill=ORG, stroke_width=sw, stroke_fill=INK)
    d.text((x0 + d.textlength(a, font=tf), y), '세계', font=tf, fill=WHITE, stroke_width=sw, stroke_fill=INK)
    tw = d.textlength('제로의 세계', font=tf)
    # tagline
    gf = ImageFont.truetype(F, 66, index=0)
    d.text((x0 + 4, 872 - 18), '흔들리는 날, 제로가 먼저 겪어 봅니다', font=gf, fill=WHITE, stroke_width=8, stroke_fill=INK)
    # Zero
    z = Image.open('zero_wave.png').convert('RGBA'); z = z.crop(z.getbbox())
    zh = 470; z = z.resize((int(z.width * zh / z.height), zh), Image.LANCZOS)
    zx = SX1 - z.width - 40; zy = SY1 - zh + 8
    sh = Image.new('L', bg.size, 0); ImageDraw.Draw(sh).ellipse((zx + 30, SY1 - 18, zx + z.width - 30, SY1 + 22), fill=120); sh = sh.filter(ImageFilter.GaussianBlur(10))
    bg = Image.composite(Image.new('RGB', bg.size, (0, 0, 0)), bg, sh)
    bg.paste(z, (zx, zy), z)
    bg.save(f'out/banner_{key}.png', optimize=True)
    print(key, 'title right edge', x0 + tw, 'zero x', zx, os.path.getsize(f'out/banner_{key}.png') // 1024, 'KB')
    # preview: TV (full), desktop (2560x423 centre band), mobile (safe area)
    tv = bg.resize((1280, 720)); desk = bg.crop((0, 508, 2560, 931)).resize((1280, 212)); mob = bg.crop((SX0, SY0, SX1, SY1)).resize((775, 212))
    pv = Image.new('RGB', (1280, 720 + 212 + 212 + 60), '#222'); pd = ImageDraw.Draw(pv); lf = ImageFont.truetype(FB, 26, index=0)
    pv.paste(tv, (0, 0)); pv.paste(desk, (0, 740)); pv.paste(mob, (0, 972))
    pd.text((10, 6), 'TV (전체)', font=lf, fill='white'); pd.text((10, 742), 'PC', font=lf, fill='white'); pd.text((790, 1060), '← 휴대폰 (안전 영역)', font=lf, fill='white')
    pv.save(f'out/preview_{key}.jpg', quality=85)
for k in sys.argv[1:]: make(k)
