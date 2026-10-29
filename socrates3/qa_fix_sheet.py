import sys, os
from PIL import Image
od, out, cols = sys.argv[1], sys.argv[2], int(sys.argv[3]); fs = sys.argv[4:]
ims = [Image.open(os.path.join(od, f + '.jpg')).resize((480, 270)) for f in fs]
rows = (len(ims) + cols - 1) // cols
S = Image.new('RGB', (cols * 484, rows * 274), 'white')
for k, im in enumerate(ims): S.paste(im, ((k % cols) * 484, (k // cols) * 274))
S.save(out, quality=85)
