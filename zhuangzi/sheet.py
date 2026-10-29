import sys, glob
from PIL import Image, ImageDraw
fs = sorted(glob.glob(sys.argv[1]))
per = int(sys.argv[3]) if len(sys.argv) > 3 else 12
cols = 3; w, h = 640, 360
for si in range(0, len(fs), per):
    chunk = fs[si:si + per]; rows = (len(chunk) + cols - 1) // cols
    sh = Image.new('RGB', (cols * w, rows * h), 'white'); d = ImageDraw.Draw(sh)
    for k, f in enumerate(chunk):
        im = Image.open(f).resize((w, h)); x, y = (k % cols) * w, (k // cols) * h
        sh.paste(im, (x, y)); d.rectangle([x, y, x + 120, y + 26], fill='black'); d.text((x + 4, y + 6), f.split('/')[-1], fill='white')
    sh.save(f"{sys.argv[2]}{si // per}.jpg", quality=82)
print('ok')
