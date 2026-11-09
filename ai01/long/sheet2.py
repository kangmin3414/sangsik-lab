import sys, os, json, glob
from PIL import Image, ImageDraw, ImageFont
TL = json.load(open(os.environ.get('TLF', 'timeline_ai_sample.json')))
fs = sorted(glob.glob('chk/t*.jpg')); out = sys.argv[1]; lo, hi = float(sys.argv[2]), float(sys.argv[3])
fs = [f for f in fs if lo <= float(os.path.basename(f)[1:-4]) < hi]
W, H, cols = 640, 360, 3; font = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 19)
rows = (len(fs) + cols - 1) // cols; S = Image.new('RGB', (cols * W, rows * (H + 56)), 'white'); d = ImageDraw.Draw(S)
for i, f in enumerate(fs):
    t = float(os.path.basename(f)[1:-4]); cur = None
    for l in TL['lines']:
        if t >= l['t0'] - 0.15: cur = l
    txt = cur.get('sub') or '(말 없음)'
    x, y = (i % cols) * W, (i // cols) * (H + 56); S.paste(Image.open(f).resize((W, H)), (x, y + 56))
    d.text((x + 6, y + 2), f"[{cur['id']}] {t:.1f}s", fill='black', font=font); d.text((x + 6, y + 27), txt[:34], fill='#333', font=font)
S.save(out, quality=80); print(out, len(fs))
