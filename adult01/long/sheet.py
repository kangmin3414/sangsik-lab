import sys, glob
from PIL import Image
fs = sorted(glob.glob('chk/t*.jpg')) if len(sys.argv) < 3 else [f'chk/t{float(x):07.2f}.jpg' for x in sys.argv[2:]]
cols = 3; w, h = 800, 450; rows = (len(fs) + cols - 1) // cols
S = Image.new('RGB', (cols * w, rows * h), '#000')
for i, f in enumerate(fs): S.paste(Image.open(f).resize((w, h)), ((i % cols) * w, (i // cols) * h))
S.save(sys.argv[1] if len(sys.argv) > 1 else 'chk/sheet.jpg', quality=72)
