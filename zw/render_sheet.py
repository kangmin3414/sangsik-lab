import os, sys
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); os.makedirs(f'{HERE}/out', exist_ok=True)
with sync_playwright() as p:
    br = p.chromium.launch(); errs = []
    for kind, w, h in [('faces', 1920, 1460), ('acting', 1920, 1080)]:
        pg = br.new_page(viewport={'width': w, 'height': h}, device_scale_factor=1)
        pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
        pg.goto('file://' + f'{HERE}/sheet.html'); pg.wait_for_timeout(300)
        pg.evaluate(f'drawSheet("{kind}")'); pg.wait_for_timeout(200)
        pg.screenshot(path=f'{HERE}/out/제로_{"표정시트" if kind == "faces" else "리액션연기"}_v3.png')
    br.close(); print('errors', errs[:5])
