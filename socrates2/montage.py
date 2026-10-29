# stack preview rows: python3 montage.py out.jpg i1,i2,...  (rows from prev/rowNN.jpg)
import sys
from PIL import Image
ids = [int(x) for x in sys.argv[2].split(',')]
ims = [Image.open('prev/row%02d.jpg' % i) for i in ids]
W = 1500; ims = [im.resize((W, int(im.height * W / im.width))) for im in ims]
H = sum(im.height for im in ims); out = Image.new('RGB', (W, H), 'white'); y = 0
for im in ims: out.paste(im, (0, y)); y += im.height
out.save(sys.argv[1], quality=85)
