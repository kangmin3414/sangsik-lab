"""ms.html(마커 종이) + 우리 애니메이션 엔진(shorts/engine.js의 char, zw/act.js의 연기) → ms2.html.
종이와 마커는 캔버스, 제로와 채점이는 그 위 SVG 층(종이와 같은 카메라), 자막 종잇조각은 맨 위 캔버스.
쓰기: python3 make_ms2.py web/ms.html web/ms_chars.js /dev/shm/op/web/ms2.html  (서버 뿌리에 repo 링크가 있어야 엔진을 읽는다)"""
import re, sys
src, chars, out = sys.argv[1:4]
s = open(src, encoding='utf-8').read()
head, rest = s.split('<script>', 1)
body, tail = rest.rsplit('</script>', 1)

def must(a, b, n=1):
    global body
    assert body.count(a) == n, (a[:70], body.count(a)); body = body.replace(a, b)

# 1) 엔진과 이름이 겹치는 내 도우미(clamp·lerp·easeInOut)는 m 접두사로
body = re.sub(r'\bclamp\(', 'mC(', body); body = re.sub(r'\blerp\(', 'mL(', body); body = re.sub(r'\beaseInOut\(', 'mE(', body)
must('const clamp = (x, a = 0, b = 1)', 'const mC = (x, a = 0, b = 1)')
must(', lerp = (a, b, k) => a + (b - a) * k,', ', mL = (a, b, k) => a + (b - a) * k,')
must(', easeInOut = k => k * k * (3 - 2 * k);', ', mE = k => k * k * (3 - 2 * k);')
# 2) 장 1: 기준표를 채점이보다 먼저 그린다(채점이가 그 위에 튀어나와 말을 시작), 카메라는 제로가 보이게
must("rect('cl', 1180, 290, 1650, 470, 'k', 7, t, t9 + 0.15, 0.4); stroke('clc', [[1360, 278], [1470, 278]], 'k', 10, t, t9 + 0.55, 0.1);",
     "rect('cl', 1180, 290, 1650, 470, 'k', 7, t, t9 - 0.6, 0.4); stroke('clc', [[1360, 278], [1470, 278]], 'k', 10, t, t9 - 0.2, 0.1);")
must("const cam1 = t => { const a = LN('m8').t0; return [[a, [700, 320, 1.3]], [LN('m9').t0 + 0.1, [960, 520, 1.0]]]; };",
     "const cam1 = t => { const a = LN('m8').t0; return [[a, [640, 560, 1.2]], [LN('m9').t0 - 0.55, [960, 520, 1.0]]]; };")
# 3) 장 2: 9,400의 작은 막대 사람 대신 엔진 제로가 뛰어와 선다(점과 이름표만 남김)
must("stickman('zz', GX(9400), GY(9400) - 40, 0.8, t, T94 + 0.05, 'b');", "")
must("write('zl', '오늘의 제로', GX(9400) - 135, 545, 46, 'b', t, T94 + 0.3, 14);", "write('zl', '오늘의 제로', GX(9400) + 82, 612, 46, 'b', t, T94 + 0.3, 14);")
must("const cam2 = t => [[LN('m11').t0 - 0.2, [760, 400, 1.3]]", "const cam2 = t => [[LN('m11').t0 - 0.2, [900, 470, 1.08]]")   # 이름표가 잘리지 않고 왼쪽 여백의 제로가 보이게
# 4) 자막은 맨 위 캔버스로, 인물은 SVG 층으로
must("  slip(t);\n};", "  drawChars(i, t, u, mE(u));\n  TX.clearRect(0, 0, W, H); const keepX = X; X = TX; slip(t); X = keepX;\n};")
must("window.fillEV = () => { for (let i = 0; i < SHEETS.length; i++) { drawSheet(BG, i, DUR); if (i) ev('peel' + i, SHEETS[i][0], 'peel', 0.38); } };",
     "window.fillEV = () => { for (let i = 0; i < SHEETS.length; i++) { drawSheet(BG, i, DUR); if (i) ev('peel' + i, SHEETS[i][0], 'peel', 0.38); } charEvents(); };")
body = body.replace("window.render = t => {", open(chars, encoding='utf-8').read() + "\nwindow.render = t => {", 1)

head = head.replace('<style>html,body{margin:0;background:#000;overflow:hidden}canvas{display:block}</style></head><body><canvas id="c" width="1920" height="1080"></canvas>',
    '<style>html,body{margin:0;background:#000;overflow:hidden}canvas,svg{display:block;position:absolute;left:0;top:0}</style>'
    '<script src="repo/shorts/engine.js"></script><script src="repo/zw/act.js"></script></head><body>'
    '<canvas id="c" width="1920" height="1080"></canvas><svg id="v" width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg"></svg>'
    '<canvas id="top" width="1920" height="1080"></canvas>')
assert 'repo/shorts/engine.js' in head
open(out, 'w', encoding='utf-8').write(head + '<script>' + body + '</script>' + tail)
print('ok', out)
