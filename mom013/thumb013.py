"""Ep.013 thumbnail: '구름만 보던 나' (small, shoulders down under a dark cloud) -> '별을 찾은 나' (big, hugging the notebook under a starry
sky with the family constellation). Headline in Black Han Sans like the ep.012 thumbnail. usage: python3 thumb013.py"""
import os
from PIL import Image
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); SP = os.path.dirname(HERE)
FONT = os.path.join(SP, 'thumb3', 'node_modules', '@fontsource', 'black-han-sans', 'index.css')
JS = r"""() => {
  const t = 1.3;
  let h = defs(0);
  h += `<defs><linearGradient id="gloom" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2B2F3E"/><stop offset="1" stop-color="#4A4F63"/></linearGradient>
        <linearGradient id="night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A1238"/><stop offset=".7" stop-color="#25306A"/><stop offset="1" stop-color="#4B3F7A"/></linearGradient></defs>`;
  h += `<rect width="1920" height="1080" fill="url(#night)"/>`;
  for (let i = 0; i < 90; i++) { const x = 900 + hash(i * 1.7) * 1100, y = hash(i * 3.3) * 1000; h += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(1.5 + hash(i * 5.1) * 3).toFixed(1)}" fill="#fff" opacity="${(0.4 + hash(i * 7) * 0.5).toFixed(2)}"/>`; }
  h += `<path d="M0 0 L860 0 L640 1080 L0 1080 Z" fill="url(#gloom)"/>`;
  h += `<path d="M860 0 L640 1080" stroke="#141414" stroke-width="10"/>`;
  // right: the family constellation, glowing
  h += constellation13(930, 330, 0.62, t, 8, 1, { lines: 1, all: true, r: 1.15 });
  h += `<circle cx="1480" cy="760" r="380" fill="url(#warm)" opacity=".55"/>`;
  // left: under the cloud
  h += cloud13(330, 470, 0.85, t, { rain: true, c: '#3A3F55' });
  h += Z({ t, seed: 3, x: 330, y: 900, s: 0.52, pose: '주머니', ex: exprAt([[0, '지침']], 0), still: true, look: [0, 0.5] });
  // arrow
  const d = 'M560 900 Q700 800 860 840';
  h += `<path d="${d}" fill="none" stroke="#141414" stroke-width="44" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#F7E733" stroke-width="26" stroke-linecap="round"/>`;
  h += `<g transform="translate(880 846) rotate(14)"><path d="M-44 -50 L38 0 L-44 50 Z" fill="#F7E733" stroke="#141414" stroke-width="9" stroke-linejoin="round"/></g>`;
  // right: smiling, hugging the old notebook
  h += Z({ t, seed: 4, x: 1480, y: 1130, s: 1.0, pose: '안기', ex: exprAt([[0, '신남']], 0), still: true });
  h += oldBook13(1500, 922, 0.3, t, { rot: -10 });
  document.getElementById('v').innerHTML = h;
}"""
TEXT = """
<div class="t" style="left:58px;top:30px;font-size:150px;color:#fff;-webkit-text-stroke:24px #141414;">힘든 일주일,</div>
<div class="t" style="left:46px;top:196px;font-size:168px;color:#F7E733;-webkit-text-stroke:30px #141414;transform:rotate(-2deg)">별 3개를 적었더니</div>
<div class="pill" style="left:120px;top:930px;font-size:44px;background:#B9C1D6">구름만 보던 나</div>
<div class="pill" style="left:1170px;top:955px;font-size:50px;background:#F7E733">별을 찾은 나</div>
"""
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
    pg.goto('file://' + os.path.join(HERE, 'anim013.html'))
    pg.evaluate("""(a) => { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'file://' + a.font; document.head.appendChild(l);
      const s = document.createElement('style'); s.textContent = `.t{position:absolute;z-index:5;white-space:nowrap;font-family:'Black Han Sans';line-height:1.05;letter-spacing:-2px;paint-order:stroke fill;text-shadow:0 10px 0 rgba(0,0,0,.35);transform-origin:left center}
      .pill{position:absolute;z-index:5;white-space:nowrap;font-family:'Black Han Sans';color:#141414;padding:6px 30px 14px;border:9px solid #141414;border-radius:30px;box-shadow:0 10px 0 rgba(0,0,0,.35)}`; document.head.appendChild(s);
      const d = document.createElement('div'); d.innerHTML = a.text; document.body.appendChild(d); }""", {'font': FONT, 'text': TEXT})
    pg.evaluate(JS); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(800)
    out = os.path.join(HERE, '상식실험실_실험013_썸네일.png'); pg.screenshot(path=out); br.close()
im = Image.open(out).convert('RGB').resize((1280, 720), Image.LANCZOS)
im.save(os.path.join(HERE, '상식실험실_실험013_썸네일.jpg'), quality=90); im.resize((320, 180), Image.LANCZOS).save(os.path.join(HERE, 'qa', 'thumb_small.jpg'))
print('errors', errs)
