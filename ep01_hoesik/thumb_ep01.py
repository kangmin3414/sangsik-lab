import json, os
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__)); tl = json.load(open(os.path.join(here, 'timeline.json')))
JS = r'''() => {
  const t = 3.3;
  let h = defs(t) + '<g transform="translate(960 560) scale(1.18) translate(-960 -640)">' + karaokeBG(t) +
    roomPeople(t, { headband: true, ex: { Z: '억지미소', T: '신남', P: '억지미소', H: '억지미소', M: '억지미소' } }) + karaokeTable(t) + '</g>';
  h += '<rect width="1920" height="1080" fill="url(#vig)"/>';
  h += outlined(960, 210, [[['다 ', '#fff'], ['집에 가고 싶었다', YEL]]], { size: 150, sw: 26 });
  // thought bubbles "집…" over three heads
  [[440, 470], [1040, 470], [1620, 470]].forEach(([x, y]) => { h += bubble(x, y, 220, 100, `<text x="0" y="22" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="58" fill="${INK}">집…</text>`); });
  document.getElementById('v').innerHTML = h;
}'''
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={'width': 1920, 'height': 1080})
    pg.goto('file://' + os.path.join(here, 'anim_ep01.html')); pg.evaluate('tl => { window.TL = tl; }', tl)
    pg.evaluate(JS); pg.wait_for_timeout(300)
    pg.screenshot(path=os.path.join(here, 'thumb_full.png')); br.close()
from PIL import Image
Image.open(os.path.join(here, 'thumb_full.png')).convert('RGB').resize((1280, 720), Image.LANCZOS).save(os.path.join(here, 'S1E01_회식2차_썸네일_A.jpg'), quality=92)
print('ok')
