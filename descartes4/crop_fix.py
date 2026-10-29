import sys
from PIL import Image
out = sys.argv[1]; box = tuple(int(v) for v in sys.argv[2].split(',')); fs = sys.argv[3:]; cols = 3
ims = [Image.open(f).crop(box) for f in fs]
w, h = ims[0].size; sc = min(1.0, 540 / w); W, H = int(w * sc), int(h * sc)
ims = [im.resize((W, H)) for im in ims]
rows = (len(ims) + cols - 1) // cols
S = Image.new('RGB', (cols * (W + 4), rows * (H + 4)), 'white')
for k, im in enumerate(ims): S.paste(im, ((k % cols) * (W + 4), (k // cols) * (H + 4)))
S.save(out, quality=85)
