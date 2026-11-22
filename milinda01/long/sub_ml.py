"""자막만 투명 그림으로 뽑는다(장면과 따로). 장면 프레임(fr/, 자막 없는 깨끗한 판) 위에 인코딩 때 얹는다.
   python3 sub_ml.py            # 전체 → sub/s00000.png … (화면 아래 띠 1920×260, y = 820부터)
   python3 sub_ml.py a b        # 프레임 a~b만
자막 모양·따라가기 방식을 바꿔도 장면을 다시 그리지 않는다(전체 약 2분). 같은 그림은 한 번만 찍고 링크한다.
인코딩: ffmpeg -framerate 24 -i fr/f%05d.jpg -framerate 24 -i sub/s%05d.png -i mix.wav -filter_complex "[0:v][1:v]overlay=0:820:format=auto[v]" -map "[v]" -map 2:a …"""
import json, os, sys, hashlib, shutil
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
TL = json.load(open('timeline_ml.json')); FPS = 24; N = round(TL['duration'] * FPS) + 1; OUT = os.environ.get('ML_SUB') or os.path.join(HERE, 'sub'); os.makedirs(OUT, exist_ok=True)
Y0, HH = 820, 260
a = int(sys.argv[1]) if len(sys.argv) > 1 else 0; b = int(sys.argv[2]) if len(sys.argv) > 2 else N - 1
with sync_playwright() as p:
    br = p.chromium.launch(args=['--disable-gpu']); pg = br.new_page(viewport={'width': 1920, 'height': 1080})
    pg.goto('file://' + os.path.join(HERE, os.environ.get('ML_PAGE', 'anim_ml.html'))); pg.evaluate('(tl) => { window.TL = tl; }', TL); pg.evaluate('window.AI_READY')
    pg.evaluate("document.documentElement.style.background = 'transparent'; document.body.style.background = 'transparent'; document.getElementById('ai').style.display = 'none'; window.ML_NOSUB = 0")
    if os.environ.get('ML_EVAL'): pg.evaluate(os.environ['ML_EVAL'])
    seen = {}; shots = 0
    for i in range(a, b + 1):
        # 장면 쪽의 처음·끝 검은 페이드(처음 0.5초, 끝 1초)를 자막에도 똑같이 건다(자막만 또렷이 남지 않게)
        svg = pg.evaluate("(t) => { const D = TL.duration, f = Math.max(1 - Math.min(1, Math.max(0, t / 0.5)), Math.min(1, Math.max(0, t - (D - 1)))), q = mlSub(t), s = q && f > 0.004 ? `<g opacity=\"${(1 - f).toFixed(3)}\">${q}</g>` : q; document.getElementById('v').innerHTML = s; return s; }", i / FPS); key = hashlib.md5(svg.encode()).hexdigest(); dst = f'{OUT}/s{i:05d}.png'
        if os.path.lexists(dst): os.remove(dst)
        if key in seen: os.link(seen[key], dst); continue
        pg.screenshot(path=dst, type='png', omit_background=True, clip={'x': 0, 'y': Y0, 'width': 1920, 'height': HH}); seen[key] = dst; shots += 1
    br.close()
print('sub done', a, b, 'unique', shots, flush=True)
