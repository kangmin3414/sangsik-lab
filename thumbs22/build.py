"""Click-friendly vertical thumbnails (1080x1920) for the 22 philosophy Shorts.
Bright philosopher-tinted background, two big hook lines on top (white + yellow, thick ink stroke),
a large crop of the Short's best frame, channel pill. Usage: python3 build.py [key ...]"""
import json, os, subprocess, sys
from PIL import Image
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
SP = os.path.dirname(HERE)
FONT_CSS = os.path.join(SP, 'thumb3', 'node_modules', '@fontsource', 'black-han-sans', 'index.css')
INFO = json.load(open(os.path.join(HERE, 'cand_info.json')))
META = json.load(open(os.path.join(SP, 'shorts_all', 'new22_meta.json')))

THEME = {  # background gradient top/bottom, ray colour, pill colour, series label
    '005': ('#FFF1C9', '#FFC06B', 'rgba(255,255,255,.38)', '#FFB547', '니체처럼 살아 보기'),
    '006': ('#E6F6FF', '#9FD6FF', 'rgba(255,255,255,.42)', '#7CC7FF', '스토아 철학자의 일주일'),
    '007': ('#F2EDFF', '#C2AEFF', 'rgba(255,255,255,.42)', '#B79CFF', '데카르트처럼 의심하기'),
    '008': ('#E8FAEA', '#A3E3AE', 'rgba(255,255,255,.42)', '#7FD98F', '장자처럼 남의 잣대 내려놓기'),
}
# key: (hook line 1, hook line 2, candidate frame index, crop centre x (0-1), crop centre y (0-1), crop width (0-1))
SPEC = {
    '005-1': ("'신은 죽었다'", '니체의 진짜 뜻', 5, 0.45, 0.5, 0.655),
    '005-2': ('니체가 매일 걸은 이유', '아이디어 +60%', 4, 0.51, 0.5, 0.56),
    '005-5': ('오늘이 영원히', '반복된다면?', 0, 0.57, 0.5, 0.655),
    '005-6': ("'아모르 파티'", '진짜 뜻은?', 6, 0.5, 0.5, 0.62),
    '006v3-1': ('황제·노예·부자가', '매일 한 마음 훈련', 5, 0.5, 0.5, 0.655),
    '006v3-3': ('로마 황제의', '아침 주문', 4, 0.5, 0.5, 0.655),
    '006v3-5': ('남의 고민엔 현자,', '내 고민엔 바보?', 4, 0.5, 0.5, 0.655),
    '006v3-6': ('연인을 못 만났다면?', '상상의 반전', 3, 0.5, 0.5, 0.62),
    '006v3-7': ('죽음을 떠올리면', '감사가 커진다', 0, 0.47, 0.62, 0.5),
    '006v3-8': ('자기 전 15분', '점수 23%↑', 4, 0.5, 0.62, 0.6),
    '007v4-1': ('400년 전, 길을 잃은', '스물세 살 청년', 0, 0.45, 0.5, 0.62),
    '007v4-4': ('공유 버튼 누르기 전', '딱 10초', 6, 0.6, 0.5, 0.655),
    '007v4-5': ('시작이 어려운', '진짜 이유', 6, 0.55, 0.5, 0.655),
    '007v4-7': ('나는 생각한다,', '그러므로 존재한다', 4, 0.5, 0.55, 0.56),
    '007v4-8': ('최고만 고르면', '덜 행복하다?', 6, 0.5, 0.5, 0.655),
    '007v4-9': ('모든 걸 의심한', '철학자의 눈물', 0, 0.45, 0.5, 0.62),
    '008v4-1': ('내 쓸모,', '고작 20센티?', 6, 0.6, 0.5, 0.655),
    '008v4-2': ('가난할 뿐,', '고달픈 건 아니다', 6, 0.53, 0.5, 0.655),
    '008v4-3': ('왕의 제안을', '거절한 철학자', 4, 0.5, 0.5, 0.655),
    '008v4-4': ('쓸모없다고', '깨 버린 박', 1, 0.45, 0.5, 0.62),
    '008v4-6': ('쓸모없어서', '크게 자란 나무', 0, 0.42, 0.5, 0.655),
    '008v4-9': ('평생 말다툼한 친구가', '떠난 뒤', 0, 0.48, 0.5, 0.62),
}
BOX_W, BOX_H = 1000, 700
ASPECT = BOX_W / BOX_H


def crop_frame(key):
    l1, l2, ci, cx, cy, wf = SPEC[key]
    info = INFO[key]
    t = info['cands'][ci]
    raw = os.path.join(HERE, f'_full_{key}.png')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.2f}', '-i', info['vid'], '-frames:v', '1', '-vf', 'crop=1920:880:0:0', raw], check=True)
    im = Image.open(raw).convert('RGB')
    w = wf * 1920
    h = min(880, w / ASPECT)
    w = h * ASPECT
    x0 = min(max(0, cx * 1920 - w / 2), 1920 - w)
    y0 = min(max(0, cy * 880 - h / 2), 880 - h)
    out = os.path.join(HERE, f'_crop_{key}.jpg')
    im.crop((int(x0), int(y0), int(x0 + w), int(y0 + h))).resize((BOX_W * 2, BOX_H * 2), Image.LANCZOS).save(out, quality=92)
    os.remove(raw)
    return out


def page(key, img):
    l1, l2 = SPEC[key][:2]
    top, bot, ray, pill, label = THEME[key[:3]]
    rays = ''.join(f'<path d="M540 980 L{540 + 3000 * __import__("math").cos(a / 24 * 6.2832):.0f} {980 + 3000 * __import__("math").sin(a / 24 * 6.2832):.0f} L{540 + 3000 * __import__("math").cos((a + 0.5) / 24 * 6.2832):.0f} {980 + 3000 * __import__("math").sin((a + 0.5) / 24 * 6.2832):.0f} Z" fill="{ray}"/>' for a in range(24))
    return f"""<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="file://{FONT_CSS}">
<style>
body{{margin:0;background:#000}}
#w{{width:1080px;height:1920px;position:relative;overflow:hidden;background:linear-gradient(180deg,{top} 0%,{bot} 100%);font-family:'Black Han Sans'}}
svg{{position:absolute;left:0;top:0}}
.t{{position:absolute;left:0;width:1080px;text-align:center;white-space:nowrap;letter-spacing:-2px;paint-order:stroke fill;line-height:1.08}}
#l1{{top:150px;font-size:118px;color:#FFFFFF;-webkit-text-stroke:20px #141414;text-shadow:0 9px 0 rgba(0,0,0,.30)}}
#l2{{top:290px;font-size:164px;color:#F7E733;-webkit-text-stroke:26px #141414;text-shadow:0 11px 0 rgba(0,0,0,.30);transform:rotate(-2deg)}}
#box{{position:absolute;left:40px;top:600px;width:{BOX_W - 20}px;height:{BOX_H - 20}px;border:10px solid #141414;border-radius:34px;overflow:hidden;transform:rotate(-1.6deg);box-shadow:0 18px 0 rgba(0,0,0,.28);background:#fff}}
#box img{{width:100%;height:100%;object-fit:cover;display:block}}
#tag{{position:absolute;left:0;width:1080px;top:1395px;text-align:center}}
#tag span{{display:inline-block;font-size:52px;color:#141414;background:{pill};padding:10px 38px 16px;border:7px solid #141414;border-radius:999px;box-shadow:0 8px 0 rgba(0,0,0,.28)}}
#brand{{position:absolute;left:0;width:1080px;top:1505px;text-align:center;font-size:40px;color:#141414;opacity:.75}}
</style></head><body><div id="w">
<svg width="1080" height="1920" viewBox="0 0 1080 1920">{rays}</svg>
<div class="t" id="l1">{l1}</div><div class="t" id="l2">{l2}</div>
<div id="box"><img src="file://{img}"></div>
<div id="tag"><span>{label}</span></div>
<div id="brand">상식실험실</div>
</div>
<script>
for (const id of ['l1','l2']) {{ const el = document.getElementById(id); let fs = parseFloat(getComputedStyle(el).fontSize);
  const inner = document.createElement('span'); inner.textContent = el.textContent; el.textContent=''; el.appendChild(inner);
  while (inner.getBoundingClientRect().width > 1010 && fs > 60) {{ fs -= 4; el.style.fontSize = fs + 'px'; }} }}
</script></body></html>"""


if __name__ == '__main__':
    keys = sys.argv[1:] or list(SPEC)
    os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={'width': 1080, 'height': 1920})
        for k in keys:
            img = crop_frame(k)
            hp = os.path.join(HERE, f'_{k}.html')
            open(hp, 'w', encoding='utf-8').write(page(k, img))
            pg.goto('file://' + hp); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(250)
            name = META[k]['png'].replace('.png', '')
            outp = os.path.join(HERE, 'out', f'{name}_v3.png')
            pg.locator('#w').screenshot(path=outp)
            print(k, os.path.getsize(outp))
        b.close()
