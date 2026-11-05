import os, sys
sys.path.insert(0, '/home/claude/sangsik-lab/nietzsche_no01/thumb2')
from PIL import Image, ImageDraw
import mk as M
os.chdir(os.path.dirname(os.path.abspath(__file__))); os.makedirs('out', exist_ok=True)
im = M.leftshade(M.crop('ai/angry_1.png', (0, 0, 1920, 1080)), 170, 640); d = ImageDraw.Draw(im)
M.txt(d, (40, 175), '화는 참으면', 100, M.WHITE, 560)
M.txt(d, (40, 315), '병이 된다?', 170, '#111', 560, bar=M.YEL)
im.save('out/012_썸네일_참으면병.jpg', quality=93)
m = Image.new('RGB', (520, 300), '#0F0F0F'); m.paste(im.resize((168, 94), Image.LANCZOS).resize((336, 188), Image.NEAREST), (92, 56)); m.save('out/_mobile.jpg', quality=90)
print('ok')
