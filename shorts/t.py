from playwright.sync_api import sync_playwright
import time
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width":1080,"height":1920})
    pg.set_content("<html><body style='margin:0;font-family:\"Noto Sans CJK KR\";font-weight:900;font-size:120px'>한글 테스트 쿵!</body></html>")
    t=time.time()
    for i in range(10): pg.screenshot(path="t.jpg", type="jpeg", quality=90)
    print("per shot", (time.time()-t)/10)
    b.close()
