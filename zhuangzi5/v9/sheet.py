import sys, glob, os
from PIL import Image, ImageDraw, ImageFont
fs = sys.argv[2:]; out = sys.argv[1]; cols = 4; W, H = 640, 360
try: fnt = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 26)
except Exception: fnt = None
rows = (len(fs) + cols - 1) // cols; S = Image.new('RGB', (cols * (W + 6), rows * (H + 6)), 'white')
for k, f in enumerate(fs):
    lab = f.split('|')[1] if '|' in f else os.path.basename(f); f = f.split('|')[0]
    im = Image.open(f).convert('RGB').resize((W, H)); d = ImageDraw.Draw(im)
    d.rectangle([0, 0, 170, 34], fill='black'); d.text((6, 3), lab, fill='yellow', font=fnt)
    S.paste(im, ((k % cols) * (W + 6), (k // cols) * (H + 6)))
S.save(out, quality=85); print(out, S.size)
