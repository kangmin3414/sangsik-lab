"""Cortisol / suppressed-anger episode thumbnails (A: empathy, B: curiosity). usage: python3 thumb_cortisol.py"""
import os, sys
from PIL import Image
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); SP = os.path.dirname(HERE)
FONT = os.path.join(HERE, 'node_modules', '@fontsource', 'black-han-sans', 'index.css')
ANIM = os.path.join(SP, 'anger012', 'anim012.html')

BOMB = r"""window.bomb = (cx, cy, s, rot) => `<g transform="translate(${cx} ${cy}) rotate(${rot||0}) scale(${s})">
  <circle r="150" fill="#FF3B30" opacity=".22"/><circle r="118" fill="#FF3B30" opacity=".25"/>
  <circle r="86" fill="#2B2B2B" stroke="#141414" stroke-width="10"/>
  <path d="M-6 -86 Q-6 -118 22 -128" fill="none" stroke="#141414" stroke-width="12" stroke-linecap="round"/>
  <path d="M22 -128 L40 -156 M22 -128 L52 -134 M22 -128 L10 -160" stroke="#FFC93C" stroke-width="9" stroke-linecap="round"/>
  <rect x="-58" y="-34" width="116" height="62" rx="10" fill="#1A0A0A" stroke="#FF3B30" stroke-width="6"/>
  <text x="0" y="14" text-anchor="middle" font-family="Black Han Sans, monospace" font-size="50" fill="#FF3B30">00:03</text>
</g>`;
"""
def js(variant):
    if variant == 'A':
        return r"""() => {
  const t = 1.3; let h = defs(0);
  h += `<defs><linearGradient id="bgA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE9C9"/><stop offset="1" stop-color="#FFB08A"/></linearGradient></defs>`;
  h += `<rect width="1920" height="1080" fill="url(#bgA)"/>`;
  h += `<circle cx="600" cy="650" r="500" fill="#FF3B30" opacity=".16"/>`;
  // belly bulge (behind chest bomb)
  h += Z({ t, seed: 8, x: 600, y: 1089, s: 1.9, pose: '서기', ex: exprAt([[0, '뿌듯']], 0), still: true, sweat: true, look: [0.3, 0] });
  h += `<ellipse cx="600" cy="868" rx="150" ry="118" fill="#FF9A55" stroke="#141414" stroke-width="10"/><path d="M500 850 Q560 905 640 880" stroke="#C9672B" stroke-width="8" fill="none" stroke-linecap="round" opacity=".6"/>`;
  h += window.bomb(600, 690, 0.85, -6);
  document.getElementById('v').innerHTML = h;
}"""
    return r"""() => {
  const t = 1.3; let h = defs(0);
  h += `<defs><linearGradient id="bgB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E1A2B"/><stop offset="1" stop-color="#26405F"/></linearGradient></defs>`;
  h += `<rect width="1920" height="1080" fill="url(#bgB)"/>`;
  h += `<circle cx="660" cy="620" r="470" fill="#4FC3F7" opacity=".14"/>`;
  h += Z({ t, seed: 8, x: 600, y: 1089, s: 1.9, pose: '서기', ex: exprAt([[0, '걱정']], 0), still: true, look: [0.3, 0] });
  h += `<ellipse cx="600" cy="760" rx="185" ry="200" fill="#0A1420" stroke="#4FC3F7" stroke-width="10" opacity=".96"/>`;
  h += `<path d="M460 690 Q600 650 740 690 M455 760 Q600 720 745 760 M465 830 Q600 790 735 830" stroke="#7FD6FF" stroke-width="9" fill="none" opacity=".5" stroke-linecap="round"/>`;
  h += window.bomb(600, 765, 0.8, -6);
  document.getElementById('v').innerHTML = h;
}"""

TEXT = {
 'A': """
<div class="t" style="left:1060px;top:90px;font-size:150px;color:#fff;-webkit-text-stroke:26px #141414;">웃으며</div>
<div class="t" style="left:1060px;top:270px;font-size:196px;color:#fff;-webkit-text-stroke:30px #141414;">참았다</div>
<div class="t" style="left:1040px;top:520px;font-size:150px;color:#FFE600;-webkit-text-stroke:28px #141414;transform:rotate(-2deg)">몸은</div>
<div class="t" style="left:1040px;top:710px;font-size:150px;color:#FFE600;-webkit-text-stroke:28px #141414;transform:rotate(-2deg)">알고 있었다</div>
""",
 'B': """
<div class="t" style="left:1080px;top:70px;font-size:150px;color:#fff;-webkit-text-stroke:26px #141414;">화를 삼키면</div>
<div class="t" style="left:1080px;top:270px;font-size:150px;color:#fff;-webkit-text-stroke:26px #141414;">뱃속에서</div>
<div class="t" style="left:1060px;top:500px;font-size:200px;color:#FFE600;-webkit-text-stroke:32px #141414;transform:rotate(-2deg)">생기는 일</div>
<div class="pill" style="left:1090px;top:830px;font-size:58px;background:#FF8A80">착한 사람의 몸속</div>
"""}
def run(v):
    with sync_playwright() as p:
        br = p.chromium.launch(); pg = br.new_page(viewport={"width":1920,"height":1080})
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
        pg.goto('file://'+ANIM)
        pg.evaluate("""(a) => { const l=document.createElement('link'); l.rel='stylesheet'; l.href='file://'+a.font; document.head.appendChild(l);
          const s=document.createElement('style'); s.textContent=`.t{position:absolute;z-index:5;white-space:nowrap;font-family:'Black Han Sans';line-height:1.05;letter-spacing:-2px;paint-order:stroke fill;text-shadow:0 10px 0 rgba(0,0,0,.35);transform-origin:left center}
          .pill{position:absolute;z-index:5;white-space:nowrap;font-family:'Black Han Sans';color:#141414;padding:6px 30px 14px;border:9px solid #141414;border-radius:30px;box-shadow:0 10px 0 rgba(0,0,0,.35)}`; document.head.appendChild(s);
          const d=document.createElement('div'); d.innerHTML=a.text; document.body.appendChild(d); }""", {'font':FONT,'text':TEXT[v]})
        pg.evaluate(BOMB)
        pg.evaluate('window.__run = ' + js(v))
        pg.evaluate("window.__run()")
        pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(900)
        out = os.path.join(HERE,'thumb',f'cortisol_{v}.png'); pg.screenshot(path=out); br.close()
    im = Image.open(out).convert('RGB').resize((1280,720), Image.LANCZOS); im.save(out.replace('.png','.jpg'), quality=90)
    print(v, 'errors', errs)
for v in (sys.argv[1:] or ['A','B']): run(v)
