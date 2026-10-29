import os, base64
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__))
html = """<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#000}#w{position:relative;width:1920px;height:1080px;overflow:hidden}
#bg{position:absolute;left:-60px;top:-30px;width:2100px;height:1181px;object-fit:cover;transform:scaleX(-1);filter:saturate(1.12) brightness(1.04)}
svg{position:absolute;left:0;top:0}</style></head><body><div id="w"><img id="bg" src="ai/40.png"><svg width="1920" height="1080" id="v"></svg></div>
<script src="../shorts/engine.js"></script></body></html>"""
open(os.path.join(here, '_thumb.html'), 'w').write(html)
JS = r"""() => {
 const FNT = "'Noto Sans CJK KR','Noto Sans KR',sans-serif";
 const txt = (x, y, s, size, fill, sw) => `<text x="${x}" y="${y}" font-family="${FNT}" font-weight="900" font-size="${size}" stroke="#141414" stroke-width="${sw}" stroke-linejoin="round" paint-order="stroke" fill="${fill}">${s}</text>`;
 let h = `<defs><linearGradient id="lg" x1="0" x2="1"><stop offset="0" stop-color="#0B1626" stop-opacity=".88"/><stop offset=".4" stop-color="#0B1626" stop-opacity=".6"/><stop offset=".55" stop-color="#0B1626" stop-opacity="0"/></linearGradient></defs>`;
 h += `<rect width="1920" height="1080" fill="url(#lg)"/>`;
 h += txt(70, 270, '1년이', 210, '#FFFFFF', 30) + txt(70, 510, '빨라진', 210, '#FFFFFF', 30) + txt(70, 760, '진짜 이유', 210, '#F7E733', 30);
 // empty calendar vs one full of photos
 const cal = (x, y, full) => { let g = `<g transform="translate(${x} ${y})"><rect x="0" y="0" width="330" height="230" rx="18" fill="#FFFDF7" stroke="#141414" stroke-width="9"/><rect x="0" y="0" width="330" height="54" rx="18" fill="${full ? '#E2553A' : '#9AA3B0'}" stroke="#141414" stroke-width="9"/>`;
   for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) { const cx = 22 + c * 60, cy = 72 + r * 50; g += full ? `<rect x="${cx}" y="${cy}" width="46" height="40" rx="5" fill="${['#7FC8E8','#F7A35C','#B5E36B','#FF9EB8','#F7E733'][(r*5+c)%5]}" stroke="#141414" stroke-width="3"/>` : `<rect x="${cx}" y="${cy}" width="46" height="40" rx="5" fill="#EEF1F5"/>`; }
   return g + '</g>'; };
 h += cal(80, 820, false) + `<path d="M440 935 L530 935" stroke="#F7E733" stroke-width="18" stroke-linecap="round"/><path d="M520 905 L560 935 L520 965" fill="none" stroke="#F7E733" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>` + cal(590, 820, true);
 document.getElementById('v').innerHTML = h; }"""
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    pg.goto("file://" + os.path.join(here, '_thumb.html')); pg.wait_for_timeout(500); pg.evaluate(JS); pg.wait_for_timeout(300)
    pg.screenshot(path=os.path.join(here, '상식실험실_실험011_썸네일.png')); br.close()
from PIL import Image
im = Image.open(os.path.join(here, '상식실험실_실험011_썸네일.png')).convert('RGB').resize((1280, 720), Image.LANCZOS)
im.save(os.path.join(here, '상식실험실_실험011_썸네일.jpg'), quality=90); im.resize((640, 360)).save(os.path.join(here, 'qa', 'thumb_small.jpg'))
print('ok')
