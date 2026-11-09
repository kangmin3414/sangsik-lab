"""렌더된 프레임(fr/)에서 줄마다 10%·50%·92% + 추가 시각을 뽑아 960x540 두 칸씩 큰 시트로. 사용: python3 peekfr.py [추가시각 ...]"""
import json, os, sys, glob
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
T = json.load(open('timeline_c1_sample.json')); FPS = 24
try: FN = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 22)
except Exception: FN = ImageFont.load_default()
pts = []
for l in T['lines']:
    for f in (0.1, 0.5, 0.92): pts.append((l['t0'] + (l['t1'] - l['t0']) * f, l['id'], l.get('sub') or '(말 없음)'))
for x in sys.argv[1:]:
    tt = float(x); lid = max((l for l in T['lines'] if l['t0'] - 0.15 <= tt), key=lambda l: l['t0'])['id']; pts.append((tt, lid + '*', ''))
pts.sort()
os.makedirs('chk/qa', exist_ok=True)
for f in glob.glob('chk/qa/*.jpg'): os.remove(f)
W, H = 960, 540
for k in range(0, len(pts), 6):
    sh = Image.new('RGB', (W * 2, H * 3), 'white'); d = ImageDraw.Draw(sh)
    for i, (tt, lid, sub) in enumerate(pts[k:k + 6]):
        fr = f'fr/f{min(int(tt * FPS), len(os.listdir("fr")) - 1):05d}.jpg'
        im = Image.open(fr).resize((W, H)); x, y = (i % 2) * W, (i // 2) * H; sh.paste(im, (x, y))
        d.rectangle([x, y, x + W, y + 30], fill=(0, 0, 0)); d.text((x + 6, y + 2), f'{tt:6.2f}s  {lid}  {sub[:36]}', fill=(255, 230, 80), font=FN)
    sh.save(f'chk/qa/qa_{k // 6:02d}.jpg', quality=80)
print(len(pts), 'pts', (len(pts) + 5) // 6, 'sheets')
