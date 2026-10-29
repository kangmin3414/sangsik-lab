"""Thumbnail v3 (B) — big-face split, everyday rooms, bottom two-line text, inner-voice bubble, series badge.
   and C — one question line + Zero's expression.  usage: DSF=1.5 python3 v3.py B|C [keys]"""
import os, sys
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); SP = os.path.dirname(HERE)
sys.path.insert(0, HERE); import split as S
B = S.B

# key: (line1, line2, inner voice, episode no, question for C, C expression, philosopher guide)
EP = {
 'stoic':    ('작은 일에 흔들리던 내가', '일주일 만에 단단해졌다', '또 나만 왜…', '006', '왜 나만 이렇게 흔들릴까?', '걱정', S.EPS['stoic'][5]),
 'descartes':('속보 보면 바로 믿던 내가', '10초 의심하게 됐다', '이거 진짜야?!', '007', '그 뉴스, 정말 믿어도 될까?', '놀람', S.EPS['descartes'][5]),
 'zhuangzi': ('나만 쓸모없다 느끼던 내가', '남의 잣대를 내려놨다', '나만 뒤처졌나…', '008', '나만|쓸모없는 걸까?', '지침', S.EPS['zhuangzi'][5]),
 'socrates': ('아는 척 끄덕이던 내가', '처음으로 손을 들었다', '무슨 뜻이지…?', '009', '모르는데 왜 끄덕였을까?', '걱정', S.EPS['socrates'][5]),
 'buddha':   ('밥 먹으며 폰만 보던 내가', '점심 맛을 되찾았다', '답장… 내일 걱정…', '010', '오늘 점심, 무슨 맛이었지?', '지침', S.EPS['buddha'][5]),
 'time':     ('1년이 순식간이던 내가', '오늘이 제일 길었다', '벌써 연말…?', '011', '왜 1년이 점점 빨라질까?', '놀람', S.EPS['time'][5]),
 'anger':    ('화나면 바로 보내던 내가', '친구를 잃지 않았다', '지금 보내 버려?', '012', '화는 풀어야 풀릴까?', '결심', S.EPS['anger'][5]),
 'mom':      ('좋은 일 하나 없던 일주일,', '별 세 개를 적었더니', '오늘도 별일 없네…', '013', '힘든 날에도|좋은 일이 있을까?', '지침', S.EPS['mom'][5]),
}
# right-side and left-side props (reuse small pieces from split.SVG helpers)
PROPS = {
 'stoic':    ("card(490, 250, 210, '!', '#FF6B6B', '팀장: 잠깐…', -6, 25)", "`<g transform=\"translate(760 210) rotate(-6) scale(.85)\"><rect x=\"-70\" y=\"-50\" width=\"140\" height=\"110\" rx=\"10\" fill=\"#C99A5B\" stroke=\"${INK}\" stroke-width=\"6\"/><text x=\"0\" y=\"22\" text-anchor=\"middle\" font-family=\"Black Han Sans\" font-size=\"25\" fill=\"#fff\">내 것 아님</text></g>`"),
 'descartes':("qm(500, 250, 96)", "`<g transform=\"translate(760 200) rotate(-8) scale(.85)\"><rect x=\"-90\" y=\"-50\" width=\"180\" height=\"100\" rx=\"14\" fill=\"#fff\" stroke=\"${INK}\" stroke-width=\"6\"/><text x=\"0\" y=\"14\" text-anchor=\"middle\" font-family=\"Black Han Sans\" font-size=\"40\" fill=\"${RED}\">가짜!</text></g>`"),
 'zhuangzi': ("`<g transform=\"translate(500 230)\"><rect x=\"-60\" y=\"-24\" width=\"120\" height=\"48\" rx=\"24\" fill=\"${RED}\" stroke=\"${INK}\" stroke-width=\"5\"/><text x=\"0\" y=\"11\" text-anchor=\"middle\" font-family=\"Black Han Sans\" font-size=\"30\" fill=\"#fff\">20cm</text></g>`", "tree(1210, 470, 0.7)"),
 'socrates': ("qm(500, 240, 80, '???')", "bubble(760, 210, 220, ['무슨 뜻', '이에요?'], { fs: 34 })"),
 'buddha':   ("phone(500, 260, 0.55, { rot: -10, glow: .4 })", "`<g transform=\"translate(760 250) scale(.8)\"><ellipse cx=\"0\" cy=\"-50\" rx=\"100\" ry=\"28\" fill=\"#fff\" stroke=\"${INK}\" stroke-width=\"6\"/><path d=\"M-100 -50 Q-90 30 0 30 Q90 30 100 -50\" fill=\"#E9EEF5\" stroke=\"${INK}\" stroke-width=\"6\"/></g>`"),
 'time':     ("calendar(500, 230, 0.32, i => i === 9, -6)", "calendar(770, 210, 0.36, i => i % 3 !== 1, 6)"),
 'anger':    ("bolt(510, 230, 0.6, RED)", "bubble(770, 200, 250, ['생일 축하해!'], { fs: 32 })"),
 'mom':      ("rainCloud(480, 200, 0.45)", "`<g transform=\"translate(760 230) rotate(-8) scale(.75)\"><rect x=\"-70\" y=\"-90\" width=\"140\" height=\"180\" rx=\"10\" fill=\"#7A5236\" stroke=\"${INK}\" stroke-width=\"6\"/><text x=\"0\" y=\"-30\" text-anchor=\"middle\" font-family=\"Black Han Sans\" font-size=\"28\" fill=\"#F1DFBA\">1998</text></g>` + sparkle(830, 140, 0.6)"),
}
ROOM = r"""
function rooms() {
  let h = `<defs><linearGradient id="nightwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2C3550"/><stop offset="1" stop-color="#1B2236"/></linearGradient>
  <linearGradient id="daywall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3D9"/><stop offset="1" stop-color="#FFE3B0"/></linearGradient>
  <radialGradient id="lamp" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFD98A" stop-opacity=".55"/><stop offset="1" stop-color="#FFD98A" stop-opacity="0"/></radialGradient>
  <radialGradient id="sunbeam" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".85"/><stop offset="1" stop-color="#FFF6D8" stop-opacity="0"/></radialGradient>
  <linearGradient id="botscrim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B111C" stop-opacity="0"/><stop offset="1" stop-color="#0B111C" stop-opacity=".78"/></linearGradient>
  <clipPath id="Lc3"><path d="M0 0 L700 0 L560 720 L0 720 Z"/></clipPath></defs>`;
  // right: sunny room
  h += `<rect width="1280" height="720" fill="url(#daywall)"/><rect y="560" width="1280" height="160" fill="#E2BE8C"/><line x1="0" y1="560" x2="1280" y2="560" stroke="#C99D66" stroke-width="6"/>`;
  h += `<g transform="translate(980 60)"><rect x="0" y="0" width="250" height="230" rx="10" fill="#9ED8FF" stroke="${INK}" stroke-width="8"/><circle cx="190" cy="60" r="34" fill="#FFE07A"/><line x1="125" y1="0" x2="125" y2="230" stroke="${INK}" stroke-width="7"/><line x1="0" y1="115" x2="250" y2="115" stroke="${INK}" stroke-width="7"/></g>`;
  h += `<ellipse cx="1040" cy="330" rx="330" ry="250" fill="url(#sunbeam)"/>`;
  h += `<g transform="translate(1210 520)"><path d="M-40 0 L40 0 L30 50 L-30 50 Z" fill="#D9774E" stroke="${INK}" stroke-width="6"/><path d="M0 0 Q-50 -60 -30 -110 M0 0 Q10 -80 30 -120 M0 0 Q50 -50 60 -90" fill="none" stroke="#4FA35A" stroke-width="12" stroke-linecap="round"/></g>`;
  // left: dark night room
  h += `<g clip-path="url(#Lc3)"><rect width="1280" height="720" fill="url(#nightwall)"/><rect y="560" width="1280" height="160" fill="#151A28"/>`;
  h += `<g transform="translate(60 60)"><rect x="0" y="0" width="220" height="200" rx="10" fill="#0E1426" stroke="#05070D" stroke-width="8"/><circle cx="160" cy="54" r="22" fill="#E8EEF8" opacity=".85"/>`;
  for (let i = 0; i < 14; i++) { const x = 14 + (i * 37) % 200, y = 30 + (i * 53) % 150; h += `<line x1="${x}" y1="${y}" x2="${x - 6}" y2="${y + 18}" stroke="#7FA6D8" stroke-width="3" opacity=".6"/>`; }
  h += `<line x1="110" y1="0" x2="110" y2="200" stroke="#05070D" stroke-width="7"/></g>`;
  h += `<ellipse cx="560" cy="430" rx="240" ry="200" fill="url(#lamp)"/>`;
  h += `</g>`;
  return h;
}
const seam3 = () => `<path d="M700 0 L560 720" stroke="#141414" stroke-width="16"/><path d="M700 0 L560 720" stroke="#FFFFFF" stroke-width="7"/>`;
const bscrim = () => `<rect y="430" width="1280" height="290" fill="url(#botscrim)"/>`;
"""

def badge_html(no):
    return (f'<div style="position:absolute;left:24px;top:20px;font-family:\'Black Han Sans\';font-size:30px;color:#141414;'
            f'background:#F7E733;border:5px solid #141414;border-radius:14px;padding:2px 16px 6px;box-shadow:0 5px 0 rgba(0,0,0,.35)">제로의 실험 #{no}</div>')

def voice_html(t):
    return (f'<div style="position:absolute;left:30px;top:96px;font-family:\'Black Han Sans\';font-size:40px;color:#141414;background:#fff;'
            f'border:6px solid #141414;border-radius:26px;padding:6px 24px 12px;box-shadow:0 6px 0 rgba(0,0,0,.35)">{t}</div>')

def bottom_html(l1, l2):
    def fit(t, target, maxw=1200):
        units = sum(0.98 if '가' <= ch <= '힣' else (0.32 if ch == ' ' else 0.6) for ch in t)
        return min(target, int(maxw / max(units, 1)))
    f1, f2 = fit(l1, 78), fit(l2, 104)
    y2 = 720 - 28 - int(f2 * 1.08); y1 = y2 - int(f1 * 1.06)
    out = []
    for txt, y, fs, col in [(l1, y1, f1, '#FFFFFF'), (l2, y2, f2, '#F7E733')]:
        sw = max(14, round(fs * 0.17))
        out.append(f'<div class="t" style="left:40px;top:{y}px;font-size:{fs}px;color:{col};-webkit-text-stroke:{sw}px #141414;'
                   f'text-shadow:0 {max(6, fs // 18)}px 0 rgba(0,0,0,.35)">{txt}</div>')
    return '\n'.join(out)

def guide_small(g):
    s = S.guide_svg(g)
    return f'<g transform="translate(1196 238) scale(.86) translate(-1196 -132)">{s}</g>'

def page_B(k):
    l1, l2, voice, no, q, cex, g = EP[k]; lp, rp = PROPS[k]
    exL = {'stoic': '겁먹음', 'descartes': '놀람', 'zhuangzi': '지침', 'socrates': '걱정', 'buddha': '지침', 'time': '놀람', 'anger': '결심', 'mom': '지침'}[k]
    exR = {'stoic': '뿌듯', 'descartes': '결심', 'zhuangzi': '신남', 'socrates': '결심', 'buddha': '신남', 'time': '신남', 'anger': '신남', 'mom': '신남'}[k]
    js = f"""document.getElementById('v').innerHTML = defsAll() + rooms() + ({lp}) + Z({{x: 290, y: 840, s: 1.2, pose: '서기', ex: EX('{exL}'), look: [0.2, 0.1], tilt: -4}})
      + ({rp}) + Z({{x: 960, y: 860, s: 1.25, pose: '서기', ex: EX('{exR}'), look: [-0.2, -0.1]}}) + seam3() + bscrim();"""
    return wrap(js, guide_small(g), badge_html(no) + voice_html(voice) + bottom_html(l1, l2))

def page_C(k):
    l1, l2, voice, no, q, cex, g = EP[k]
    js = f"""document.getElementById('v').innerHTML = defsAll() + `<rect width="1280" height="720" fill="#20283C"/><ellipse cx="900" cy="420" rx="520" ry="420" fill="#2E3A57"/>`
      + Z({{x: 930, y: 1080, s: 1.6, pose: '서기', ex: EX('{cex}'), look: [-0.4, -0.2], tilt: -4}}) + qm(1180, 250, 120);"""
    def fit(t, target, maxw=760):
        units = sum(0.98 if '가' <= ch <= '힣' else (0.32 if ch == ' ' else 0.6) for ch in t)
        return min(target, int(maxw / max(units, 1)))
    # split question into two lines at the middle space
    if '|' in q: a, b = q.split('|')
    else:
        words = q.split(' '); mid = len(words) // 2 + (len(words) % 2)
        a, b = ' '.join(words[:mid]), ' '.join(words[mid:])
    fs = min(fit(a, 110), fit(b, 110))
    text = (f'<div class="t" style="left:48px;top:{360 - int(fs*1.1)}px;font-size:{fs}px;color:#FFFFFF;-webkit-text-stroke:{round(fs*.16)}px #141414">{a}</div>'
            f'<div class="t" style="left:48px;top:{360}px;font-size:{fs}px;color:#F7E733;-webkit-text-stroke:{round(fs*.16)}px #141414">{b}</div>')
    return wrap(js, '', badge_html(no) + text)

def wrap(js, gsvg, html):
    fonts = os.path.join(SP, 'thumb3', 'node_modules', '@fontsource')
    return f"""<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="file://{fonts}/black-han-sans/index.css">
<style>body{{margin:0;background:#000}} #wrap{{width:1280px;height:720px;position:relative;overflow:hidden}}
.t{{position:absolute;white-space:nowrap;font-family:'Black Han Sans';line-height:1.05;letter-spacing:-1px;paint-order:stroke fill}}
svg{{position:absolute;left:0;top:0}}</style>
<script src="file://{SP}/shorts/engine.js"></script>
<script>{B.LIB}
{B.SCENES}
{S.SVG}
{ROOM}</script></head><body><div id="wrap">
<svg id="v" width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg"></svg>
<svg id="g" width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">{gsvg}</svg>
{html}
</div><script>{js}</script></body></html>"""

if __name__ == '__main__':
    kind = sys.argv[1]; keys = sys.argv[2:] or list(EP)
    out_dir = os.path.join(SP, 'abthumb'); os.makedirs(out_dir, exist_ok=True)
    names = {'stoic': '스토아', 'descartes': '데카르트', 'zhuangzi': '장자', 'socrates': '소크라테스', 'buddha': '붓다', 'time': '시간', 'anger': '화', 'mom': '엄마수첩'}
    with sync_playwright() as p:
        br = p.chromium.launch(args=['--allow-file-access-from-files'])
        pg = br.new_page(viewport={'width': 1280, 'height': 720}, device_scale_factor=float(os.environ.get('DSF', '1')))
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        for k in keys:
            f = os.path.join(HERE, f'_v3{kind}_{k}.html'); open(f, 'w', encoding='utf-8').write(page_B(k) if kind == 'B' else page_C(k))
            pg.goto('file://' + f); pg.wait_for_timeout(900)
            png = os.path.join(HERE, f'v3{kind}_{k}.png'); pg.locator('#wrap').screenshot(path=png)
            from PIL import Image
            Image.open(png).convert('RGB').resize((1280, 720), Image.LANCZOS).save(os.path.join(out_dir, f'{kind}_{names[k]}.jpg'), quality=86, optimize=True)
            print(k, 'ok', errs[-1:] if errs else ''); errs.clear()
        br.close()
