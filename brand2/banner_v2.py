"""Channel banner v2: one-line promise + daily schedule (2560x1440, text inside the 1546x423 mobile safe area)."""
import os
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__))
ART = os.path.join(HERE, '..', 'brand', 'art_banner.png')
FONT = "'Noto Sans CJK KR','Noto Sans KR',sans-serif"
INK, YEL, MINT, NAVY = "#141414", "#F7E733", "#3DF2B0", "#0B1626"
def stroke(w): return f"-webkit-text-stroke: {w}px {INK}; paint-order: stroke fill; text-shadow: 0 {max(4, w // 2)}px 0 rgba(0,0,0,0.35)"
PILL = "매일 저녁 7시 · 새 실험"
LINE1 = "알던 상식, 직접 실험합니다"
LINE2 = "평일엔 몸·뇌 실험, 주말엔 철학자처럼 살아 보기"
def banner(scale=1.0, art=ART):
    return f'''<div id="bn" style="width: 2560px; height: 1440px; position: relative; overflow: hidden; font-family: {FONT}; font-weight: 900; transform: scale({scale}); transform-origin: 0 0">
<img src="file://{art}" alt="" style="position: absolute; left: 0; top: 0; width: 2560px; height: 1440px">
<div style="position: absolute; left: 562px; top: 540px; padding: 6px 26px 10px; background: {MINT}; border: 5px solid {INK}; border-radius: 999px; font-size: 34px; letter-spacing: 1px; color: {NAVY}; box-shadow: 0 6px 0 rgba(0,0,0,0.35)">{PILL}</div>
<div style="position: absolute; left: 556px; top: 612px; font-size: 140px; line-height: 1.1; color: #FFFFFF; {stroke(20)}"><span style="color: {YEL}">만약에</span>연구소</div>
<div style="position: absolute; left: 564px; top: 784px; font-size: 56px; line-height: 1.2; color: #FFFFFF; {stroke(12)}">{LINE1}</div>
<div style="position: absolute; left: 568px; top: 868px; font-size: 32px; line-height: 1.2; font-weight: 700; color: #C9D3DF">{LINE2}</div>
</div>'''
if __name__ == "__main__":
    html = f"<!doctype html><html><head><meta charset='utf-8'><style>body{{margin:0;background:#000}}</style></head><body>{banner()}</body></html>"
    open(os.path.join(HERE, 'banner_v2.html'), 'w').write(html)
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={"width": 2560, "height": 1440})
        pg.goto('file://' + os.path.join(HERE, 'banner_v2.html')); pg.wait_for_timeout(500)
        # report text boxes to check the safe area
        boxes = pg.evaluate("""() => [...document.querySelectorAll('#bn > div')].map(d => { const r = d.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom), d.innerText.slice(0, 12)]; })""")
        for bx in boxes: print(bx)
        pg.screenshot(path=os.path.join(HERE, '만약에연구소_채널배너_v2_2560x1440.png'))
        b.close()
