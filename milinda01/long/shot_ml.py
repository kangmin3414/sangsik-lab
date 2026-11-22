"""몇몇 시각의 프레임을 찍는다: python3 shot_ml.py [--tl 타임라인.json] [--seq t0 t1 n] [--small] t1 t2 …
   --seq: t0~t1을 n장으로 고르게(움직임 점검용 연속 시트), --small: 960x540으로 줄여 저장. 결과 ML_CK(기본 /dev/shm/ml/chk), sheet.jpg도 만든다."""
import sys, os, json, time
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); CK = os.environ.get('ML_CK', '/dev/shm/ml/chk'); PAGE = os.environ.get('ML_PAGE', 'anim_ml.html')
a = sys.argv[1:]; tlf = 'timeline_ml.json'; small = False; ts = []
while a:
    x = a.pop(0)
    if x == '--tl': tlf = a.pop(0)
    elif x == '--seq': t0, t1, n = float(a.pop(0)), float(a.pop(0)), int(a.pop(0)); ts += [t0 + (t1 - t0) * i / max(1, n - 1) for i in range(n)]
    elif x == '--small': small = True
    else: ts.append(float(x))
os.makedirs(CK, exist_ok=True); TL = json.load(open(tlf))
for f in os.listdir(CK):
    if f.endswith('.jpg'): os.remove(os.path.join(CK, f))
with sync_playwright() as p:
    br = p.chromium.launch(args=['--disable-gpu']); pg = br.new_page(viewport={'width': 1920, 'height': 1080})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append('console: ' + m.text) if (m.type == 'error' and 'ERR_FILE_NOT_FOUND' not in m.text) else None)
    pg.goto('file://' + os.path.join(HERE, PAGE)); pg.evaluate('(tl) => { window.TL = tl; }', TL); pg.evaluate('window.AI_READY')
    if os.environ.get('ML_EVAL'): pg.evaluate(os.environ['ML_EVAL'])
    if not ts:
        for L in TL['lines']: ts += [L['t0'] + (L['t1'] - L['t0']) * f for f in (0.12, 0.5, 0.9)]
    t0 = time.time()
    for tt in ts:
        pg.evaluate(f'render({tt})'); pg.evaluate('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))'); pg.screenshot(path=f"{CK}/t{tt:08.3f}.jpg", type='jpeg', quality=80)
    dt = (time.time() - t0) / max(1, len(ts)); br.close()
from PIL import Image, ImageDraw
fs = sorted(f for f in os.listdir(CK) if f.startswith('t') and f.endswith('.jpg')); n = len(fs); cols = 1 if n == 1 else (2 if n <= 4 else (3 if n <= 9 else 4)); W = 1920 // cols if cols > 1 else 1920; H = W * 9 // 16
sh = Image.new('RGB', (W * cols, H * ((n + cols - 1) // cols)), 'white')
for i, f in enumerate(fs):
    im = Image.open(os.path.join(CK, f)).resize((W, H)); sh.paste(im, ((i % cols) * W, (i // cols) * H)); d = ImageDraw.Draw(sh); d.rectangle([(i % cols) * W, (i // cols) * H, (i % cols) * W + 92, (i // cols) * H + 18], fill='black'); d.text(((i % cols) * W + 4, (i // cols) * H + 3), f[1:-4] + 's', fill='yellow')
sh.save(os.path.join(CK, 'sheet.jpg'), quality=82)
print('frames', n, 'sec/frame', round(dt, 3), 'errors', errs[:6])
