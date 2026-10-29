"""Trailer v2 cards (logo / phil / sub), rendered frame by frame at 24 fps with Playwright.
usage: python3 cards2.py <kind> <n_frames> <t_click>   (t_click = seconds into the card for the subscribe click)"""
import os, sys
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__))
ART = os.path.abspath(os.path.join(HERE, '..', 'brand', 'art_banner.png'))
FPS = 24
PH = ['nietzsche', 'stoic', 'descartes', 'zhuangzi', 'socrates', 'buddha']

CSS = """
*{box-sizing:border-box} body{margin:0;width:1920px;height:1080px;overflow:hidden;background:#0B1626;font-family:'Noto Sans CJK KR',sans-serif;font-weight:900}
#stage{position:absolute;left:0;top:0;width:1920px;height:1080px;overflow:hidden}
.art{position:absolute;left:0;top:0;width:2560px;height:1440px;transform-origin:0 0}
.st{-webkit-text-stroke:var(--sw,14px) #141414;paint-order:stroke fill;text-shadow:0 8px 0 rgba(0,0,0,.35)}
.pill{position:absolute;padding:8px 30px 12px;border:6px solid #141414;border-radius:999px;box-shadow:0 6px 0 rgba(0,0,0,.35);white-space:nowrap}
.por{position:absolute;top:318px;width:272px;height:375px;object-fit:contain;filter:drop-shadow(0 14px 0 rgba(0,0,0,.35));transform-origin:50% 70%}
.btn{position:absolute;left:150px;top:430px;height:190px;padding:0 70px 0 60px;border-radius:999px;border:8px solid #141414;box-shadow:0 12px 0 rgba(0,0,0,.35);display:flex;align-items:center;gap:26px;font-size:112px;color:#fff;white-space:nowrap;transform-origin:50% 50%}
.btn .bell{font-family:'Noto Color Emoji';font-size:92px}
#cursor{position:absolute;width:90px;height:110px}
"""

HTML = {
 "logo": """<div id="stage"><img class="art" id="art" src="file://ART"><div id="txt" style="position:absolute;left:0;top:0;width:2560px;height:1440px;transform-origin:0 0">
  <div id="pill" class="pill" style="left:562px;top:540px;background:#3DF2B0;font-size:34px;color:#0B1626;border-width:5px;padding:6px 26px 10px">매일 저녁 7시 · 새 실험</div>
  <div id="title" class="st" style="position:absolute;left:556px;top:612px;font-size:140px;line-height:1.1;color:#fff;--sw:20px;transform-origin:30% 60%"><span style="color:#F7E733">상식</span>실험실</div>
  <div id="l1" class="st" style="position:absolute;left:564px;top:784px;font-size:56px;line-height:1.2;color:#fff;--sw:12px">알던 상식, 직접 실험합니다</div>
  <div id="l2" style="position:absolute;left:568px;top:868px;font-size:32px;line-height:1.2;font-weight:700;color:#C9D3DF">평일엔 몸·뇌 실험, 주말엔 철학자처럼 살아 보기</div>
 </div></div>""",
 "phil": """<div id="stage"><img class="art" id="art" src="file://ART"><div style="position:absolute;inset:0;background:rgba(6,12,22,.72)"></div>
  <div id="pill" class="pill" style="left:120px;top:84px;background:#F7E733;font-size:40px;color:#0B1626">주말 실험</div>
  <div id="head" class="st" style="position:absolute;left:120px;top:160px;font-size:96px;color:#fff;--sw:16px"><span style="color:#F7E733">철학자처럼</span> 살아 보기</div>
  PORTRAITS</div>""",
 "sub": """<div id="stage"><img class="art" id="art" src="file://ART"><div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(6,12,22,.82) 0%,rgba(6,12,22,.55) 50%,rgba(6,12,22,.05) 100%)"></div>
  <div id="q" class="st" style="position:absolute;left:150px;top:220px;font-size:92px;color:#fff;--sw:16px">다음 실험이 궁금하다면</div>
  <div id="btn" class="btn" style="background:#FF3B3B"><span class="bell">🔔</span><span id="bt">구독</span></div>
  <svg id="cursor" viewBox="0 0 90 110"><path d="M6 4 L6 88 L28 68 L42 102 L58 95 L44 62 L76 62 Z" fill="#fff" stroke="#141414" stroke-width="7" stroke-linejoin="round"/></svg>
 </div>""",
}


def ease(x): x = max(0.0, min(1.0, x)); return 1 - (1 - x) ** 3
def pop(x):
    x = max(0.0, min(1.0, x)); return 0.6 + 0.4 * (1 - (1 - x) ** 3) + 0.08 * (1 - abs(2 * x - 1)) * (x < 1)


def page(kind):
    por = ''.join(f'<img class="por" id="p{k}" src="file://{HERE}/assets/p_{n}.png" style="left:{88 + k * 296}px">' for k, n in enumerate(PH))
    body = HTML[kind].replace('ART', ART).replace('PORTRAITS', por)
    return f"<!doctype html><html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{body}</body></html>"


def run(kind, n, tc=1.4):
    out = os.path.join(HERE, 'frames'); os.makedirs(out, exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1920, "height": 1080})
        hp = os.path.join(HERE, f'_card_{kind}.html'); open(hp, 'w').write(page(kind))
        pg.goto('file://' + hp); pg.wait_for_timeout(800)
        assert pg.evaluate("() => document.getElementById('art').naturalWidth") > 0, 'art not loaded'
        for f in range(n):
            t = f / FPS; js = []
            if kind == 'logo':
                s = 1.11 + 0.04 * (t / (n / FPS)); ox = 960 - 1275 * s; oy = 430 - 730 * s
                tr = f"translate({ox}px,{oy}px) scale({s})"
                js.append(f"$('art').style.transform='{tr}'; $('txt').style.transform='{tr}';")
                a = ease(t / 0.35); js.append(f"$('title').style.opacity={a}; $('title').style.transform='scale({0.86 + 0.14 * a})';")
                js.append(f"$('l1').style.opacity={ease((t - 0.3) / 0.4)}; $('pill').style.opacity={ease((t - 0.7) / 0.3)}; $('pill').style.transform='translateY({-30 * (1 - ease((t - 0.7) / 0.3))}px)'; $('l2').style.opacity={ease((t - 1.0) / 0.4)};")
            else:
                s = 0.75 * (1 + 0.025 * t / (n / FPS)); js.append(f"$('art').style.transform='translate({-960 * (s - 0.75)}px,{-540 * (s - 0.75)}px) scale({s})';")
            if kind == 'phil':
                js.append(f"$('pill').style.opacity={ease(t / 0.25)}; $('head').style.opacity={ease((t - 0.05) / 0.3)};")
                for k in range(6):
                    x = (t - 0.3 - 0.13 * k) / 0.3; sc = pop(x) if x > 0 else 0.6
                    rot = (-2.5, 2, -1.5, 2.5, -2, 1.5)[k]; fy = 6 * __import__('math').sin(2.2 * t + k)
                    js.append(f"$('p{k}').style.opacity={1 if x > 0 else 0}; $('p{k}').style.transform='translateY({fy:.1f}px) rotate({rot}deg) scale({sc})';")
            if kind == 'sub':
                js.append(f"$('q').style.opacity={ease(t / 0.3)};")
                bx, by = 150 + 330, 430 + 120
                m = ease((t - 0.45) / (tc - 0.6)) if tc > 0.6 else 1
                cx = 1500 + (bx - 1500) * m; cy = 980 + (by - 980) * m
                pressed = tc <= t < tc + 0.12; done = t >= tc
                js.append(f"$('cursor').style.left='{cx}px'; $('cursor').style.top='{cy}px'; $('cursor').style.transform='scale({0.9 if pressed else 1})';")
                js.append(f"$('btn').style.transform='scale({0.94 if pressed else 1})'; $('btn').style.background='{'#6B7280' if done else '#FF3B3B'}'; $('bt').textContent='{'구독중 ✓' if done else '구독'}';")
            pg.evaluate("() => { const $ = id => document.getElementById(id); " + "".join(js) + " }")
            pg.screenshot(path=os.path.join(out, f'{kind}_{f:04d}.jpg'), type='jpeg', quality=92)
        b.close()
    print(kind, n, 'frames')


if __name__ == "__main__":
    run(sys.argv[1], int(sys.argv[2]), float(sys.argv[3]) if len(sys.argv) > 3 else 1.4)
