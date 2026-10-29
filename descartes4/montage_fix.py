import sys
from PIL import Image
out = sys.argv[1]; fs = sys.argv[2:]; cols = 2; W, H = 800, 450
ims = [Image.open(f).resize((W, H)) for f in fs]
rows = (len(ims) + cols - 1) // cols
S = Image.new('RGB', (cols * (W + 6), rows * (H + 6)), 'white')
for k, im in enumerate(ims): S.paste(im, ((k % cols) * (W + 6), (k // cols) * (H + 6)))
S.save(out, quality=80)
