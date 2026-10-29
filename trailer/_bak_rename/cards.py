"""Render the four trailer cards frame by frame (24 fps) with Playwright. Times come from timeline.json / words.json."""
import json, os, sys
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__))
ART = os.path.abspath(os.path.join(HERE, '..', 'brand', 'art_banner.png'))
FPS = 24
TL = json.load(open(os.path.join(HERE, 'timeline.json'))); L = TL['lines']; DUR = TL['duration']
cuts = [0.0] + [round(l['t0'] - 0.1, 3) for l in L[1:]] + [DUR]
nfr = [round((cuts[i + 1] - cuts[i]) * FPS) for i in range(len(L))]
json.dump({"cuts": cuts, "nfr": nfr}, open(os.path.join(HERE, 'cuts.json'), 'w'))
CHIPS = [["🍺", "술", "한두 잔은 약?"], ["😴", "잠", "주말에 몰아 자면?"], ["☕", "커피", "심장에 나쁘다?"], ["💪", "근력운동", "혈압엔 유산소만?"],
         ["🏔️", "니체", "시련이 나를 강하게?"], ["🏛️", "스토아", "걱정의 91%는?"], ["🤔", "데카르트", "정말 확실해?"], ["🦋", "장자", "쓸모없으면 어때?"]]

CSS = """
*{box-sizing:border-box} body{margin:0;width:1920px;height:1080px;overflow:hidden;background:#0B1626;font-family:'Noto Sans CJK KR',sans-serif;font-weight:900}
#stage{position:absolute;left:0;top:0;width:1920px;height:1080px;overflow:hidden}
.art{position:absolute;left:0;top:0;width:2560px;height:1440px;transform-origin:0 0}
.st{-webkit-text-stroke:var(--sw,14px) #141414;paint-order:stroke fill;text-shadow:0 8px 0 rgba(0,0,0,.35)}
.pill{position:absolute;padding:8px 30px 12px;border:6px solid #141414;border-radius:999px;box-shadow:0 6px 0 rgba(0,0,0,.35);white-space:nowrap}
.chip{position:absolute;width:320px;height:252px;background:#FFFDF6;border:7px solid #141414;border-radius:34px;box-shadow:0 12px 0 rgba(0,0,0,.35);text-align:center;transform-origin:50% 60%}
.chip .em{font-family:'Noto Color Emoji';font-size:74px;line-height:1;margin-top:22px}
.chip .lb{font-size:52px;line-height:1.15;color:#141414;margin-top:10px}
.chip .my{font-size:31px;line-height:1.2;color:#4B5563;font-weight:700;margin-top:8px;white-space:nowrap}
.rowlab{position:absolute;left:140px;width:330px}
.rl2{font-size:34px;color:#fff;margin-top:14px;font-weight:700}
.stamp{position:absolute;left:50%;top:356px;transform:translate(-50%,0) rotate(-8deg);padding:4px 22px 8px;border:6px solid #E5395B;color:#E5395B;border-radius:14px;font-size:38px;background:rgba(255,255,255,.9);white-space:nowrap}
.day{position:absolute;top:760px;width:104px;height:104px;border-radius:50%;background:#16233A;border:5px solid #2C3E5C;color:#93A4BD;font-size:40px;text-align:center;line-height:92px}
.day.on{background:#3DF2B0;border-color:#141414;color:#0B1626}
.btn{position:absolute;left:150px;top:430px;height:190px;padding:0 70px 0 60px;border-radius:999px;border:8px solid #141414;box-shadow:0 12px 0 rgba(0,0,0,.35);display:flex;align-items:center;gap:26px;font-size:112px;color:#fff;white-space:nowrap;transform-origin:50% 50%}
.btn .bell{font-family:'Noto Color Emoji';font-size:92px}
#cursor{position:absolute;width:90px;height:110px}
"""

def ease(x): x = max(0.0, min(1.0, x)); return 1 - (1 - x) ** 3
def pop(x):  # 0..1 -> scale with overshoot
    x = max(0.0, min(1.0, x)); return 0.6 + 0.4 * (1 - (1 - x) ** 3) + 0.08 * (1 - abs(2 * x - 1)) * (x < 1)

HTML = {
 "logo": """<div id="stage"><img class="art" id="art" src="file://ART"><div id="txt" style="position:absolute;left:0;top:0;width:2560px;height:1440px;transform-origin:0 0">
  <div id="pill" class="pill" style="left:562px;top:540px;background:#3DF2B0;font-size:34px;color:#0B1626;border-width:5px;padding:6px 26px 10px">매일 저녁 7시 · 새 실험</div>
  <div id="title" class="st" style="position:absolute;left:556px;top:612px;font-size:140px;line-height:1.1;color:#fff;--sw:20px;transform-origin:30% 60%"><span style="color:#F7E733">만약에</span>연구소</div>
  <div id="l1" class="st" style="position:absolute;left:564px;top:784px;font-size:56px;line-height:1.2;color:#fff;--sw:12px">알던 상식, 직접 실험합니다</div>
  <div id="l2" style="position:absolute;left:568px;top:868px;font-size:32px;line-height:1.2;font-weight:700;color:#C9D3DF">평일엔 몸·뇌 실험, 주말엔 철학자처럼 살아 보기</div>
 </div></div>""",
 "topics": """<div id="stage"><img class="art" id="art" src="file://ART"><div style="position:absolute;inset:0;background:rgba(6,12,22,.66)"></div>
  <div id="pill" class="pill" style="left:140px;top:70px;background:#3DF2B0;font-size:40px;color:#0B1626">다음 실험 예고</div>
  <div id="head" class="st" style="position:absolute;left:140px;top:140px;font-size:92px;color:#F7E733;--sw:16px">이 상식, 진짜일까?</div>
  <div id="r0" class="rowlab" style="top:340px"><div class="pill" style="position:static;display:inline-block;background:#3DF2B0;font-size:58px;color:#0B1626">평일</div><div class="rl2">몸·뇌 실험</div></div>
  <div id="r1" class="rowlab" style="top:622px"><div class="pill" style="position:static;display:inline-block;background:#F7E733;font-size:58px;color:#0B1626">주말</div><div class="rl2">철학자처럼 살아 보기</div></div>
  CHIPS</div>""",
 "time": """<div id="stage"><img class="art" id="art" src="file://ART"><div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(6,12,22,.82) 0%,rgba(6,12,22,.62) 55%,rgba(6,12,22,.15) 100%)"></div>
  <div id="t1" class="st" style="position:absolute;left:150px;top:150px;font-size:110px;color:#fff;--sw:16px">매일 저녁</div>
  <div id="t2" class="st" style="position:absolute;left:140px;top:250px;font-size:330px;line-height:1.05;color:#F7E733;--sw:26px;transform-origin:20% 60%">7시</div>
  <div id="t3" class="pill" style="left:760px;top:420px;background:#3DF2B0;font-size:60px;color:#0B1626">새 실험 쇼츠</div>
  DAYS</div>""",
 "sub": """<div id="stage"><img class="art" id="art" src="file://ART"><div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(6,12,22,.82) 0%,rgba(6,12,22,.55) 50%,rgba(6,12,22,.05) 100%)"></div>
  <div id="q" class="st" style="position:absolute;left:150px;top:220px;font-size:92px;color:#fff;--sw:16px">다음 실험이 궁금하다면</div>
  <div id="btn" class="btn" style="background:#FF3B3B"><span class="bell">🔔</span><span id="bt">구독</span></div>
  <svg id="cursor" viewBox="0 0 90 110"><path d="M6 4 L6 88 L28 68 L42 102 L58 95 L44 62 L76 62 Z" fill="#fff" stroke="#141414" stroke-width="7" stroke-linejoin="round"/></svg>
 </div>""",
}

def chips_html():
    out = []
    for k, (em, lb, my) in enumerate(CHIPS):
        x = 500 + (k % 4) * 344; y = 290 if k < 4 else 572
        out.append(f'<div class="chip" id="c{k}" style="left:{x}px;top:{y}px"><div class="em">{em}</div><div class="lb">{lb}</div><div class="my">{my}</div></div>')
    return ''.join(out)

def days_html():
    return ''.join(f'<div class="day" id="d{k}" style="left:{150 + k * 132}px">{d}</div>' for k, d in enumerate("월화수목금토일"))

def page(kind):
    body = HTML[kind].replace('ART', ART).replace('CHIPS', chips_html()).replace('DAYS', days_html())
    return f"<!doctype html><html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{body}</body></html>"

# times (seconds, relative to each card's start); chip pops follow the spoken words
W = json.load(open(os.path.join(HERE, 'words.json')))
def word_t(word, after):
    for w, s, e in W:
        if s >= after - 0.05 and w.startswith(word): return s
    return None

def run(kind, idx):
    c0 = cuts[idx]; n = nfr[idx]
    os.makedirs(os.path.join(HERE, 'frames'), exist_ok=True)
    if kind == 'topics':
        tw = [word_t(w, c0) for w in ('술', '잠', '커피', '건강')]
        tw = [(t if t is not None else c0 + 0.6 + 0.3 * k) - c0 - 0.06 for k, t in enumerate(tw)]
        t_we = (word_t('주말', c0 + 1.0) or (c0 + 3.4)) - c0 - 0.06
        tn = (word_t('니체', c0 + 1.0) or (c0 + t_we + 0.5)) - c0 - 0.06
        tj = (word_t('장자', c0 + 1.0) or (c0 + tn + 0.5)) - c0 - 0.06
        tw += [tn, tn + 0.22, tj - 0.1, tj + 0.12]
        ts = t_we
    if kind == 'time': t7 = (word_t('7시', c0) or c0 + 0.6) - c0 - 0.05
    if kind == 'sub': tc = (word_t('구독', c0) or c0 + 1.4) - c0 + 0.05
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1920, "height": 1080})
        hp = os.path.join(HERE, f'_card_{kind}.html'); open(hp, 'w').write(page(kind))
        pg.goto('file://' + hp); pg.wait_for_timeout(600)
        assert pg.evaluate("() => document.getElementById('art').naturalWidth") > 0, 'art not loaded'
        for f in range(n):
            t = f / FPS; js = []
            if kind == 'logo':
                # zoom into the banner's text+character block (2560-space block centre ~ (1275,730)); slow push-in
                s = 1.11 + 0.04 * (t / (n / FPS)); ox = 960 - 1275 * s; oy = 430 - 730 * s
                tr = f"translate({ox}px,{oy}px) scale({s})"
                js.append(f"$('art').style.transform='{tr}'; $('txt').style.transform='{tr}';")
                a = ease(t / 0.35); js.append(f"$('title').style.opacity={a}; $('title').style.transform='scale({0.86 + 0.14 * a})';")
                js.append(f"$('l1').style.opacity={ease((t - 0.45) / 0.4)}; $('pill').style.opacity={ease((t - 0.85) / 0.3)}; $('pill').style.transform='translateY({-30 * (1 - ease((t - 0.85) / 0.3))}px)'; $('l2').style.opacity={ease((t - 1.25) / 0.4)};")
            else:
                s = 0.75 * (1 + 0.025 * t / (n / FPS)); js.append(f"$('art').style.transform='translate({-960 * (s - 0.75)}px,{-540 * (s - 0.75)}px) scale({s})';")
            if kind == 'topics':
                js.append(f"$('pill').style.opacity={ease(t / 0.25)}; $('head').style.opacity={ease((t - 0.05) / 0.3)};")
                js.append(f"$('r0').style.opacity={ease((t - tw[0] + 0.25) / 0.3)}; $('r1').style.opacity={ease((t - ts + 0.1) / 0.3)};")
                for k in range(8):
                    x = (t - tw[k]) / 0.28; sc = pop(x) if x > 0 else 0.6
                    js.append(f"$('c{k}').style.opacity={1 if x > 0 else 0}; $('c{k}').style.transform='scale({sc})';")
            if kind == 'time':
                js.append(f"$('t1').style.opacity={ease(t / 0.3)};")
                x = (t - t7) / 0.3; js.append(f"$('t2').style.opacity={1 if x > 0 else 0}; $('t2').style.transform='scale({pop(x) if x > 0 else 0.6})';")
                js.append(f"$('t3').style.opacity={ease((t - t7 - 0.35) / 0.3)};")
                for k in range(7):
                    on = t > t7 + 0.5 + 0.09 * k
                    js.append(f"$('d{k}').className='day'+({'true' if on else 'false'}?' on':'');")
            if kind == 'sub':
                js.append(f"$('q').style.opacity={ease(t / 0.3)};")
                bx, by = 150 + 330, 430 + 120  # click target (inside the button)
                m = ease((t - 0.45) / (tc - 0.6)) if tc > 0.6 else 1
                cx = 1500 + (bx - 1500) * m; cy = 980 + (by - 980) * m
                pressed = tc <= t < tc + 0.12; done = t >= tc
                js.append(f"$('cursor').style.left='{cx}px'; $('cursor').style.top='{cy}px'; $('cursor').style.transform='scale({0.9 if pressed else 1})';")
                js.append(f"$('btn').style.transform='scale({0.94 if pressed else 1})'; $('btn').style.background='{'#6B7280' if done else '#FF3B3B'}'; $('bt').textContent='{'구독중 ✓' if done else '구독'}';")
            pg.evaluate("() => { const $ = id => document.getElementById(id); " + "".join(js) + " }")
            pg.screenshot(path=os.path.join(HERE, 'frames', f'{kind}_{f:04d}.jpg'), type='jpeg', quality=92)
        b.close()
    print(kind, n, 'frames')

if __name__ == "__main__":
    order = {'logo': 6, 'topics': 7, 'time': 8, 'sub': 9}
    for k in (sys.argv[1:] or order):
        run(k, order[k])
