"""Ep.012 thumbnail: '풀던 나' (punching the bag in front of a fire) -> '늦춘 나' (calm in the dawn light, the fire gone to embers).
Headline in Black Han Sans like the Nietzsche B thumbnail. usage: python3 thumb012.py"""
import os
from PIL import Image
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); SP = os.path.dirname(HERE)
FONT = os.path.join(SP, 'thumb3', 'node_modules', '@fontsource', 'black-han-sans', 'index.css')
JS = r"""() => {
  const t = 1.3;
  let h = defs(0);
  h += `<defs><linearGradient id="hot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A0E18"/><stop offset="1" stop-color="#7A2416"/></linearGradient>
        <linearGradient id="dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3D5E9A"/><stop offset=".6" stop-color="#9FC3E6"/><stop offset="1" stop-color="#FFE2B8"/></linearGradient></defs>`;
  h += `<rect width="1920" height="1080" fill="url(#dawn)"/>`;
  h += `<path d="M0 0 L1010 0 L760 1080 L0 1080 Z" fill="url(#hot)"/>`;
  h += `<path d="M1010 0 L760 1080" stroke="#141414" stroke-width="10"/>`;
  h += `<circle cx="1560" cy="520" r="420" fill="url(#warm)" opacity=".75"/>`;
  // left: venting
  h += `<g opacity=".95">${fire12(660, 1010, 1.0, t, 9.4)}</g>`;
  h += sandbag12(470, 1050, 0.7, -8);
  h += Z({ t, seed: 3, x: 270, y: 1040, s: 0.6, pose: '펀치', ex: exprAt([[0, '화남']], 0), still: true, look: [0.6, 0] });
  h += fan12(900, 690, 0.72, -14);
  // arrow
  const d = 'M820 930 Q990 800 1150 850';
  h += `<path d="${d}" fill="none" stroke="#141414" stroke-width="44" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#F7E733" stroke-width="26" stroke-linecap="round"/>`;
  h += `<g transform="translate(1172 858) rotate(18)"><path d="M-44 -50 L38 0 L-44 50 Z" fill="#F7E733" stroke="#141414" stroke-width="9" stroke-linejoin="round"/></g>`;
  // right: delayed, calm
  h += `<circle cx="1520" cy="640" r="330" fill="${MINT}" opacity=".18" stroke="${MINT}" stroke-width="8" stroke-opacity=".45"/>`;
  h += fire12(1770, 1050, 0.6, t, 0);
  h += Z({ t, seed: 4, x: 1520, y: 1110, s: 1.02, pose: '서기', ex: exprAt([[0, '잠']], 0), still: true });
  document.getElementById('v').innerHTML = h;
}"""
TEXT = """
<div class="t" style="left:54px;top:34px;font-size:150px;color:#fff;-webkit-text-stroke:24px #141414;">화는 풀어야 산다?</div>
<div class="t" style="left:46px;top:206px;font-size:206px;color:#F7E733;-webkit-text-stroke:32px #141414;transform:rotate(-2deg)">정반대였다</div>
<div class="pill" style="left:150px;top:940px;font-size:46px;background:#FFB0A0">풀던 나</div>
<div class="pill" style="left:1360px;top:930px;font-size:56px;background:#F7E733">늦춘 나</div>
"""
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
    pg.goto('file://' + os.path.join(HERE, 'anim012.html'))
    pg.evaluate("""(a) => { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'file://' + a.font; document.head.appendChild(l);
      const s = document.createElement('style'); s.textContent = `.t{position:absolute;z-index:5;white-space:nowrap;font-family:'Black Han Sans';line-height:1.05;letter-spacing:-2px;paint-order:stroke fill;text-shadow:0 10px 0 rgba(0,0,0,.35);transform-origin:left center}
      .pill{position:absolute;z-index:5;white-space:nowrap;font-family:'Black Han Sans';color:#141414;padding:6px 30px 14px;border:9px solid #141414;border-radius:30px;box-shadow:0 10px 0 rgba(0,0,0,.35)}`; document.head.appendChild(s);
      const d = document.createElement('div'); d.innerHTML = a.text; document.body.appendChild(d); }""", {'font': FONT, 'text': TEXT})
    pg.evaluate(JS); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(800)
    out = os.path.join(HERE, '상식실험실_실험012_썸네일.png'); pg.screenshot(path=out); br.close()
im = Image.open(out).convert('RGB').resize((1280, 720), Image.LANCZOS)
im.save(os.path.join(HERE, '상식실험실_실험012_썸네일.jpg'), quality=90); im.resize((320, 180), Image.LANCZOS).save(os.path.join(HERE, 'qa', 'thumb_small.jpg'))
print('errors', errs)
