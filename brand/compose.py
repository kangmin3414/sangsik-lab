import os, sys
here=os.path.dirname(os.path.abspath(__file__))
FONT="'Noto Sans KR','Noto Sans CJK KR',sans-serif"
INK="#141414"; YEL="#F7E733"; MINT="#3DF2B0"; NAVY="#0B1626"; PINK="#FF5FA2"
def stroke(w): return f"-webkit-text-stroke: {w}px {INK}; paint-order: stroke fill; text-shadow: 0 {max(4,w//2)}px 0 rgba(0,0,0,0.35)"
def thumb(img):
    return f'''<div style="width: 1280px; height: 720px; position: relative; overflow: hidden; font-family: {FONT}; font-weight: 900">
<img src="{img}" alt="" style="position: absolute; left: 0; top: 0; width: 1280px; height: 720px">
<div style="position: absolute; left: 52px; top: 40px; padding: 6px 30px 10px; background: {MINT}; border: 6px solid {INK}; border-radius: 999px; font-size: 44px; color: {NAVY}; box-shadow: 0 6px 0 rgba(0,0,0,0.35)">하루 30분</div>
<div style="position: absolute; left: 48px; top: 136px; font-size: 104px; line-height: 1.1; color: #FFFFFF; {stroke(22)}">걷기만 했는데</div>
<div style="position: absolute; left: 44px; top: 266px; font-size: 134px; line-height: 1.1; color: {YEL}; transform: rotate(-3deg); transform-origin: left center; {stroke(26)}">뇌가 자랐다</div>
<div style="position: absolute; left: 56px; top: 488px; padding: 8px 30px 14px; background: {PINK}; border: 7px solid {INK}; border-radius: 18px; transform: rotate(-2deg); font-size: 58px; color: #FFFFFF; box-shadow: 0 8px 0 rgba(0,0,0,0.35); {stroke(10)}">치매 위험 −51%</div>
<div style="position: absolute; left: 1046px; top: 318px; white-space: nowrap; padding: 4px 22px 8px; background: {YEL}; border: 6px solid {INK}; border-radius: 999px; transform: rotate(6deg); font-size: 40px; color: {NAVY}; box-shadow: 0 6px 0 rgba(0,0,0,0.35)">해마 +2%</div>
</div>'''
def banner(img):
    return f'''<div style="width: 2560px; height: 1440px; position: relative; overflow: hidden; font-family: {FONT}; font-weight: 900">
<img src="{img}" alt="" style="position: absolute; left: 0; top: 0; width: 2560px; height: 1440px">
<div style="position: absolute; left: 566px; top: 548px; padding: 6px 24px 10px; border: 4px solid {MINT}; border-radius: 12px; font-size: 30px; letter-spacing: 2px; color: {MINT}; background: rgba(11,22,38,0.6)">실험 기록 · 매주 금요일</div>
<div style="position: absolute; left: 560px; top: 612px; font-size: 140px; line-height: 1.1; color: #FFFFFF; {stroke(20)}"><span style="color: {YEL}">만약에</span>연구소</div>
<div style="position: absolute; left: 566px; top: 784px; font-size: 54px; line-height: 1.2; color: #FFFFFF; {stroke(12)}">모든 ‘만약에’는 실험이 된다</div>
<div style="position: absolute; left: 568px; top: 866px; font-size: 32px; line-height: 1.2; font-weight: 700; color: #B8C4D2">과학으로 끝까지 따라가는 만약에 이야기</div>
</div>'''
def profile(img):
    return f'''<div style="width: 800px; height: 800px; position: relative; overflow: hidden">
<img src="{img}" alt="" style="position: absolute; left: 0; top: 0; width: 800px; height: 800px">
</div>'''
PAGES={"thumb":(thumb,1280,720),"banner":(banner,2560,1440),"profile":(profile,800,800)}
if __name__=="__main__":
    from playwright.sync_api import sync_playwright
    out={"thumb":"만약에연구소_실험002_썸네일_v2.png","banner":"만약에연구소_채널배너_2560x1440.png","profile":"만약에연구소_프로필_800x800.png"}
    with sync_playwright() as p:
        b=p.chromium.launch()
        for k,(fn,w,h) in PAGES.items():
            html=f"<!doctype html><html><head><meta charset='utf-8'><style>body{{margin:0}}</style></head><body>{fn('art_'+k+'.png')}</body></html>"
            open(os.path.join(here,f"final_{k}.html"),"w").write(html)
            pg=b.new_page(viewport={"width":w,"height":h}); pg.goto("file://"+os.path.join(here,f"final_{k}.html")); pg.wait_for_timeout(300)
            pg.screenshot(path=os.path.join(here,out[k])); pg.close(); print(out[k])
        b.close()
