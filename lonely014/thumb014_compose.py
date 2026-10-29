import os, sys
from playwright.sync_api import sync_playwright
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(os.path.dirname(HERE), 'thumbD'))
import compose as C
SPEC = {'D1': ('lonely1', '혼자가 편했던 내가', '외로운 진짜 이유를 알았다', '#FFFFFF', C.YEL, '"혼자가 편해… 근데 왜 허전하지?"', 'left'),
        'D2': ('lonely2', '가까우면 찔리고', '멀면 추운 사람에게', '#FFFFFF', C.YEL, '"딱 좋은 거리는?"', 'left')}
with sync_playwright() as p:
    br = p.chromium.launch(args=['--allow-file-access-from-files'])
    pg = br.new_page(viewport={'width': 1280, 'height': 720}, device_scale_factor=1.5)
    for name, (pic, l1, l2, c1, c2, q, qp) in SPEC.items():
        img = os.path.join(HERE, 'thumb', f'{pic}.png')
        f = os.path.join(HERE, 'thumb', f'_{name}.html'); open(f, 'w', encoding='utf-8').write(C.page(img, l1, l2, c1, c2, q, qp))
        pg.goto('file://' + f); pg.wait_for_timeout(700)
        png = os.path.join(HERE, 'thumb', f'{name}.png'); pg.locator('#wrap').screenshot(path=png)
        Image.open(png).convert('RGB').resize((1280, 720), Image.LANCZOS).save(os.path.join(HERE, f'상식실험실_실험014_썸네일_{name}.jpg'), quality=88, optimize=True)
        print(name, 'ok')
    br.close()
