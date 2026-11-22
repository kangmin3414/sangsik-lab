"""렌더된 프레임으로 점검 시트를 만든다(브라우저를 다시 띄우지 않는다. 가볍다).
   python3 sheet_ml.py            # 줄마다 세 순간(시작 +0.3초 · 가운데 · 끝 -0.3초) → /dev/shm/ml/sheets/lines_NN.jpg (한 장에 5줄)
   python3 sheet_ml.py --seq t0 t1 n [이름]   # t0~t1을 n장으로 고르게 → seq_이름.jpg (움직임 점검)
   칸마다 줄 id · 시각 · 자막 문장을 적는다(독립 검토자에게 그대로 넘길 수 있게)."""
import sys, os, json
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
FR = os.environ.get('ML_FR', '/dev/shm/ml/fr'); OUT = os.environ.get('ML_SHEETS', '/dev/shm/ml/sheets'); os.makedirs(OUT, exist_ok=True)
TL = json.load(open('timeline_ml.json')); FPS = 24
FONT = next(f for f in ['/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', '/usr/share/fonts/truetype/nanum/NanumGothicBold.ttf'] if os.path.exists(f))
F1 = ImageFont.truetype(FONT, 17); F2 = ImageFont.truetype(FONT, 15)
def frame(t, w, h):
    i = max(0, min(int(TL['duration'] * FPS) - 1, round(t * FPS))); p = f'{FR}/f{i:05d}.jpg'
    return Image.open(p).convert('RGB').resize((w, h), Image.LANCZOS) if os.path.exists(p) else Image.new('RGB', (w, h), '#553333')
def lines_sheets(per=5, w=512):
    h = w * 9 // 16; bar = 30; L = TL['lines']; n = 0
    for k in range(0, len(L), per):
        part = L[k:k + per]; sh = Image.new('RGB', (w * 3, (h + bar) * len(part)), 'white'); d = ImageDraw.Draw(sh)
        for r, l in enumerate(part):
            dur = l['t1'] - l['t0']; ts = [l['t0'] + min(0.3, dur * 0.2), (l['t0'] + l['t1']) / 2, l['t1'] - min(0.3, dur * 0.2)]; y = r * (h + bar)
            d.rectangle([0, y, w * 3, y + bar], fill='#1c1c22'); who = {'N': '나레이션', 'Z': '제로', 'B': '팀장', 'T': '딱지', 'K': '왕', 'M': '스님', None: '(말 없음)'}.get(l.get('v'), l.get('v'))
            d.text((8, y + 4), f"{l['id']}  {l['t0']:.1f}~{l['t1']:.1f}s  [{who}]  {l.get('sub') or ''}"[:118], font=F1, fill='#ffe14a')
            for c, t in enumerate(ts):
                sh.paste(frame(t, w, h), (c * w, y + bar)); d.rectangle([c * w, y + bar, c * w + 70, y + bar + 20], fill='black'); d.text((c * w + 4, y + bar + 1), f'{t:.2f}s', font=F2, fill='white')
        n += 1; sh.save(f'{OUT}/lines_{n:02d}.jpg', quality=84)
    return n
def seq_sheet(t0, t1, n, name, cols=4, w=480):
    h = w * 9 // 16; sh = Image.new('RGB', (w * cols, h * ((n + cols - 1) // cols)), 'white'); d = ImageDraw.Draw(sh)
    for i in range(n):
        t = t0 + (t1 - t0) * i / max(1, n - 1); x, y = (i % cols) * w, (i // cols) * h; sh.paste(frame(t, w, h), (x, y)); d.rectangle([x, y, x + 70, y + 20], fill='black'); d.text((x + 4, y + 1), f'{t:.2f}s', font=F2, fill='#ffe14a')
    sh.save(f'{OUT}/seq_{name}.jpg', quality=84); return f'{OUT}/seq_{name}.jpg'
if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == '--seq': print(seq_sheet(float(a[1]), float(a[2]), int(a[3]), a[4] if len(a) > 4 else f'{float(a[1]):.1f}'))
    else: print('sheets', lines_sheets())
