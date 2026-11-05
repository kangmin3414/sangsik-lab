import os, sys
sys.path.insert(0, '/home/claude/sangsik-lab/nietzsche_no01/thumb2')
from PIL import Image, ImageDraw
import mk as M
os.chdir(os.path.dirname(os.path.abspath(__file__))); os.makedirs('out', exist_ok=True)
im = M.leftshade(M.crop('ai/envy_2.png', (0, 0, 1920, 1080)), 180, 620); d = ImageDraw.Draw(im)
# chat bubble "축하해!!" with a tail toward Zero's phone
f, sz = M.fit(d, '축하해!!', 104, 460); bb = d.textbbox((70, 150), '축하해!!', font=f)
d.rounded_rectangle((bb[0] - 34, bb[1] - 26, bb[2] + 34, bb[3] + 30), 46, fill='#FFFFFF', outline='#111111', width=6)
d.text((70, 150), '축하해!!', font=f, fill='#111111')
M.txt(d, (40, 345), '배 아프다', 170, '#111', 580, bar=M.YEL)
im.save('out/니체2탄_썸네일_배아프다.jpg', quality=93)
m = Image.new('RGB', (520, 300), '#0F0F0F'); m.paste(im.resize((168, 94), Image.LANCZOS).resize((336, 188), Image.NEAREST), (92, 56)); m.save('out/_mobile.jpg', quality=90)
print('ok')
