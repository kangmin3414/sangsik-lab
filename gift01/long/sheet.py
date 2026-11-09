import sys, os, json, glob
from PIL import Image, ImageDraw, ImageFont
TL = json.load(open(os.environ.get('TLF', 'timeline_gf_sample.json')))
fs = sorted(glob.glob('chk/t*.jpg')); out = sys.argv[1]; cols = int(sys.argv[2]) if len(sys.argv) > 2 else 3; lo = float(sys.argv[3]) if len(sys.argv) > 3 else 0; hi = float(sys.argv[4]) if len(sys.argv) > 4 else 1e9
fs = [f for f in fs if lo <= float(os.path.basename(f)[1:-4]) <= hi]
W, H = 640, 360; font = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 22)
rows = (len(fs) + cols - 1) // cols; S = Image.new('RGB', (cols * W, rows * (H + 30)), 'white'); d = ImageDraw.Draw(S)
for i, f in enumerate(fs):
    t = float(os.path.basename(f)[1:-4]); lid = ''
    for l in TL['lines']:
        if t >= l['t0'] - 0.15: lid = l['id'] + ' ' + l['scene']
    x, y = (i % cols) * W, (i // cols) * (H + 30); S.paste(Image.open(f).resize((W, H)), (x, y + 30)); d.text((x + 6, y + 2), f'{t:.2f}s  {lid}', fill='black', font=font)
S.save(out, quality=82); print(out, len(fs))
