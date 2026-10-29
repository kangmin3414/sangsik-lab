"""Philosophy long-form thumbnails (1280x720): the philosopher's real portrait (public-domain painting/sculpture)
in a gold museum frame + name plaque, a two-line curiosity hook, and Zero reacting.
Usage: python3 build.py [key ...]"""
import os, sys
from PIL import Image, ImageEnhance, ImageOps
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__)); SP = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(SP, 'ctr', 'thumbs')); import build as B  # Zero (char), EX, defsAll

YEL = '#F7E733'
SPEC = {  # src, crop box (source px, 4:5), name, years, hook lines, background (top, bottom, glow), zero pose/expr/look, enhance
    'descartes': dict(src='descartes.jpg', crop=(81, 0, 681, 750), name='르네 데카르트', years='1596–1650',
                      hook=[('모든 걸 의심한', '#FFFFFF'), ('진짜 이유', YEL)], bg=('#160F2E', '#3A2768', '#8E6CFF'),
                      zero=dict(pose='턱괴기', ex='놀람', look=[-0.8, -0.2])),
    'zhuangzi': dict(src='zhuangzi.jpg', crop=(330, 170, 990, 995), name='장자', years='기원전 4세기 · 중국',
                     hook=[('왕의 제안을', '#FFFFFF'), ('거절한 이유', YEL)], bg=('#0C241C', '#1D5240', '#3DF2B0'),
                     zero=dict(pose='턱괴기', ex='놀람', look=[-0.8, -0.2]), ink=True),
    'socrates': dict(src='socrates_david.jpg', crop=(1900, 820, 2900, 2070), name='소크라테스', years='기원전 470–399',
                     hook=[('독배 앞에서도', '#FFFFFF'), ('질문한 이유', YEL)], bg=('#0E1A2E', '#23406B', '#6FB7FF'),
                     zero=dict(pose='서기', ex='놀람', look=[-0.8, -0.3])),
    'buddha': dict(src='buddha.jpg', crop=(473, 160, 1273, 1160), name='붓다', years='기원전 5세기 · 인도',
                   hook=[('왕자가 궁을', '#FFFFFF'), ('떠난 이유', YEL)], bg=('#2A1608', '#6B3A12', '#FFB547'),
                   zero=dict(pose='턱괴기', ex='놀람', look=[-0.8, -0.2])),
    'stoic': dict(src='marcus.jpg', crop=(330, 40, 1590, 1615), name='마르쿠스 아우렐리우스', years='121–180 · 로마 황제',
                  hook=[('황제가 최악을', '#FFFFFF'), ('상상한 이유', YEL)], bg=('#2A0A12', '#6E1A2C', '#FF8A8A'),
                  zero=dict(pose='턱괴기', ex='놀람', look=[-0.8, -0.2])),
    'nietzsche': dict(src='nietzsche_munch.jpg', crop=(85, 60, 465, 535), name='프리드리히 니체', years='1844–1900',
                      hook=[('시련 없는 삶이', '#FFFFFF'), ('덜 행복한 이유', YEL)], bg=('#2A1206', '#7A3410', '#FFB547'),
                      zero=dict(pose='턱괴기', ex='놀람', look=[-0.8, -0.2])),
}
IN_W, IN_H = 420, 525
AI = os.environ.get('AIBG', '1') == '1'   # 2026-10-23: scene of the episode (Nano Banana 2.1, aibg/) behind the portrait
SUF = '명화AI' if AI else '명화'   # portrait window inside the frame (4:5)


def prep(key):
    s = SPEC[key]
    im = Image.open(os.path.join(HERE, 'src', s['src'])).convert('RGB')
    im = im.crop(s['crop']) if s['crop'] else ImageOps.fit(im, (IN_W * 4, IN_H * 4), centering=(0.5, 0.3))
    im = im.resize((IN_W * 2, IN_H * 2), Image.LANCZOS)
    if s.get('ink'):   # faint ink on silk: stretch levels and deepen the lines, keep the warm paper tone
        im = ImageOps.autocontrast(im, cutoff=1.5)
        im = ImageEnhance.Contrast(im).enhance(1.35); im = ImageEnhance.Brightness(im).enhance(0.97)
    else:
        im = ImageEnhance.Contrast(im).enhance(1.08); im = ImageEnhance.Color(im).enhance(1.08)
    out = os.path.join(HERE, f'_p_{key}.jpg'); im.save(out, quality=93)
    return out


def page(key, img):
    s = SPEC[key]; top, bot, glow = s['bg']; z = s['zero']
    aibg = os.path.join(HERE, 'aibg', f'{key}.png')
    bglayers = ('<div id="ai"></div><div id="scrim"></div><div id="glow" style="opacity:.55"></div>' if AI and os.path.exists(aibg)
                else '<div id="glow"></div><div id="rays"></div>')
    fonts = os.path.join(SP, 'thumb3', 'node_modules', '@fontsource')
    hook = ''.join(f'<div class="h" id="h{i}" style="color:{c}">{t}</div>' for i, (t, c) in enumerate(s['hook']))
    zero = f"shadow(1045, 706, 96) + Z({{ x: 1045, y: 718, s: 0.7, pose: '{z['pose']}', ex: EX('{z['ex']}'), look: {z['look']} }})"
    return f"""<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="file://{fonts}/black-han-sans/index.css">
<style>
body{{margin:0;background:#000}}
#wrap{{width:1280px;height:720px;position:relative;overflow:hidden;background:linear-gradient(160deg,{top} 0%,{bot} 100%);font-family:'Black Han Sans'}}
#glow{{position:absolute;left:-140px;top:-120px;width:900px;height:900px;border-radius:50%;background:radial-gradient(closest-side,{glow}55,{glow}00)}}
#rays{{position:absolute;inset:0;background:repeating-linear-gradient(115deg,rgba(255,255,255,.035) 0 26px,rgba(255,255,255,0) 26px 70px)}}
#ai{{position:absolute;inset:0;background:url('file://{aibg}') center/cover no-repeat;filter:saturate(1.1) brightness(.97)}}
#scrim{{position:absolute;inset:0;background:linear-gradient(90deg,{top}10 0%,{top}30 38%,{top}8C 62%,{top}A8 100%),radial-gradient(ellipse 520px 300px at 930px 210px,rgba(0,0,0,.30),rgba(0,0,0,0)),linear-gradient(180deg,rgba(0,0,0,0) 60%,rgba(0,0,0,.30) 100%)}}
#frame{{position:absolute;left:58px;top:40px;width:{IN_W}px;height:{IN_H}px;padding:24px;transform:rotate(-2.2deg);
  background:linear-gradient(135deg,#7a5612 0%,#f7e08a 18%,#b98a2a 38%,#ffeaa0 55%,#a77a22 75%,#f0d27a 90%,#6e4d10 100%);
  border-radius:8px;box-shadow:0 18px 0 rgba(0,0,0,.38),0 0 0 6px #141414}}
#frame .in{{width:100%;height:100%;box-sizing:border-box;border:7px solid #3b2a07;background:#222 url('file://{img}') center/cover no-repeat;
  box-shadow:inset 0 0 26px rgba(0,0,0,.55)}}
#plaque{{position:absolute;left:0;width:620px;top:572px;text-align:center;transform:rotate(-2.2deg)}}
#plaque div{{display:inline-block;padding:6px 34px 12px;background:linear-gradient(180deg,#FFF3B8,#E8C25A);border:7px solid #141414;border-radius:16px;box-shadow:0 9px 0 rgba(0,0,0,.4);white-space:nowrap}}
#plaque b{{display:block;font-weight:400;font-size:60px;line-height:1.1;color:#141414;letter-spacing:-1px}}
#plaque i{{display:block;font-style:normal;font-size:24px;line-height:1.1;color:#5A4210}}
.h{{position:absolute;left:600px;white-space:nowrap;line-height:1.05;letter-spacing:-2px;paint-order:stroke fill;-webkit-text-stroke:22px #141414;text-shadow:0 10px 0 rgba(0,0,0,.4)}}
#h0{{top:92px;font-size:112px}} #h1{{top:250px;font-size:150px;transform:rotate(-2deg);transform-origin:left center}}
svg{{position:absolute;left:0;top:0}}
</style>
<script src="file://{SP}/shorts/engine.js"></script>
<script>{B.LIB}
{B.SCENES}</script></head><body><div id="wrap">
{bglayers}
<div id="frame"><div class="in"></div></div>
<div id="plaque"><div><b>{s['name']}</b><i>{s['years']}</i></div></div>
{hook}
<svg id="v" width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg"></svg>
</div><script>
document.getElementById('v').innerHTML = defsAll() + {zero};
{{ const b = document.querySelector('#plaque b'); let fs = 60; while (b.getBoundingClientRect().width > 540 && fs > 30) {{ fs -= 2; b.style.fontSize = fs + 'px'; }} }}
for (const id of ['h0', 'h1']) {{ const el = document.getElementById(id); let fs = parseFloat(getComputedStyle(el).fontSize);
  while (el.getBoundingClientRect().width > 650 && fs > 60) {{ fs -= 2; el.style.fontSize = fs + 'px'; }} }}
</script></body></html>"""


if __name__ == '__main__':
    keys = sys.argv[1:] or list(SPEC)
    os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch()
        for k in keys:
            hp = os.path.join(HERE, f'_{k}.html'); open(hp, 'w', encoding='utf-8').write(page(k, prep(k)))
            pg = b.new_page(viewport={'width': 1280, 'height': 720}, device_scale_factor=2); errs = []
            pg.on('pageerror', lambda e: errs.append(str(e)))
            pg.goto('file://' + hp); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(500)
            big = os.path.join(HERE, 'out', f'{k}@2x.png'); pg.locator('#wrap').screenshot(path=big)
            Image.open(big).convert('RGB').resize((1280, 720), Image.LANCZOS).save(os.path.join(HERE, 'out', f'썸네일_{k}_{SUF}.png'))
            pg.close(); print(k, errs or 'ok')
        b.close()
    ims = [Image.open(os.path.join(HERE, 'out', f'썸네일_{k}_{SUF}.png')).resize((640, 360)) for k in SPEC if os.path.exists(os.path.join(HERE, 'out', f'썸네일_{k}_{SUF}.png'))]
    sheet = Image.new('RGB', (1290, 370 * ((len(ims) + 1) // 2)), 'white')
    for i, im in enumerate(ims): sheet.paste(im, ((i % 2) * 650, (i // 2) * 370))
    sheet.save(os.path.join(HERE, f'sheet_{SUF}.jpg'), quality=88)
