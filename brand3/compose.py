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
    x0 = 640
    pf = ImageFont.truetype(FB, 46, index=0); pt = '철학 · 심리 · 뇌과학 이야기'
    tf = ImageFont.truetype(F, 200, index=0); gf = ImageFont.truetype(F, 60, index=0); sw = 20
    pb = d.textbbox((0, 0), pt, font=pf); tb = d.textbbox((0, 0), '제로의 세계', font=tf, stroke_width=sw); gb = d.textbbox((0, 0), '흔들리는 날, 제로가 먼저 겪어 봅니다', font=gf, stroke_width=8)
    ph = (pb[3] - pb[1]) + 36; th = tb[3] - tb[1]; gh = gb[3] - gb[1]; gap1, gap2 = 14, 10
    total = ph + gap1 + th + gap2 + gh; top = (SY0 + SY1) / 2 - total / 2
    pw = pb[2] - pb[0]; d.rounded_rectangle((x0, top, x0 + pw + 60, top + ph), ph / 2, outline=YEL, width=6)
    d.text((x0 + 30, top + 18 - pb[1]), pt, font=pf, fill=YEL)
    ty = top + ph + gap1 - tb[1]
    a = '제로의 '; d.text((x0, ty), a, font=tf, fill=ORG, stroke_width=sw, stroke_fill=INK)
    d.text((x0 + d.textlength(a, font=tf), ty), '세계', font=tf, fill=WHITE, stroke_width=sw, stroke_fill=INK)
    tw = d.textlength('제로의 세계', font=tf)
    d.text((x0 + 4, top + ph + gap1 + th + gap2 - gb[1]), '흔들리는 날, 제로가 먼저 겪어 봅니다', font=gf, fill=WHITE, stroke_width=8, stroke_fill=INK)
    print('stack', round(top), round(top + total))
    # Zero
    z = Image.open('zero_wave.png').convert('RGBA'); z = z.crop(z.getbbox())
    zh = 440; z = z.resize((int(z.width * zh / z.height), zh), Image.LANCZOS)
    zx = SX1 - z.width - 70; zy = SY1 - zh + 4
    sh = Image.new('L', bg.size, 0); ImageDraw.Draw(sh).ellipse((zx + 30, SY1 - 18, zx + z.width - 30, SY1 + 22), fill=120); sh = sh.filter(ImageFilter.GaussianBlur(10))
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
