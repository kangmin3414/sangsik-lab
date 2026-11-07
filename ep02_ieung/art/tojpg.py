import glob, os
from PIL import Image
os.chdir(os.path.dirname(os.path.abspath(__file__)))
for p in glob.glob('*.png'):
    j = p[:-4] + '.jpg'
    if os.path.exists(j) and os.path.getmtime(j) > os.path.getmtime(p): continue
    Image.open(p).convert('RGB').resize((2560, 1440), Image.LANCZOS).save(j, quality=90); print('jpg', j)
