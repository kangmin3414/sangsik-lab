"""chk/*.jpg를 6장씩(3x2) 모아 chk/sheet_NN.jpg로. 각 칸에 시각 표시."""
import glob, os, sys
from PIL import Image, ImageDraw
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
fs = sorted(glob.glob('chk/t*.jpg')); W, H = 640, 360
for f in glob.glob('chk/sheet_*.jpg'): os.remove(f)
for k in range(0, len(fs), 6):
    sh = Image.new('RGB', (W * 3, H * 2), 'white'); d = ImageDraw.Draw(sh)
    for i, f in enumerate(fs[k:k + 6]):
        im = Image.open(f).resize((W, H)); x, y = (i % 3) * W, (i // 3) * H; sh.paste(im, (x, y)); d.rectangle([x, y, x + 110, y + 22], fill='black'); d.text((x + 4, y + 4), os.path.basename(f)[1:-4], fill='yellow')
    sh.save(f'chk/sheet_{k // 6:02d}.jpg', quality=82)
print(len(fs), 'shots ->', (len(fs) + 5) // 6, 'sheets')
