"""사피엔스 편 썸네일 3종: raw/*.png(render_thumb.py) 위에 2줄 글자. 니체 편 mk.py의 txt·leftshade를 그대로 씀.
   A 파스텔 그림책 "출근길이 / 가벼워진다"(0:27~0:33)  B 게임 화면 "돈·직급이 / 게임이라면?"(0:14~0:27)  C 도트 레트로 "하트를 / 다시 채우는 법"(0:27~0:33 하트 1→3)"""
import os, sys
sys.path.insert(0, '/home/claude/sangsik-lab/nietzsche_no01/thumb2')
from PIL import Image, ImageDraw
import mk as NK
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); os.makedirs('out', exist_ok=True)
YEL, WHITE = NK.YEL, NK.WHITE
def base(k, a, w): im = Image.open(f'raw/{k}.png').convert('RGB').resize((1280, 720), Image.LANCZOS); return NK.leftshade(im, a, w)
SPEC = {'A': ('출근길이', '가벼워진다', 120, 640), 'B': ('돈·직급이', '게임이라면?', 120, 640), 'C': ('하트를', '다시 채우는 법', 100, 620)}
OUT = []
for k, (l1, l2, a, w) in SPEC.items():
    im = base(k, a, w); d = ImageDraw.Draw(im)
    NK.txt(d, (44, 170), l1, 112, WHITE, 540)
    NK.txt(d, (44, 330), l2, 118, '#111', 540, bar=YEL)
    name = {'A': '사피엔스편_썸네일A_출근길이가벼워진다', 'B': '사피엔스편_썸네일B_돈직급이게임이라면', 'C': '사피엔스편_썸네일C_하트를다시채우는법'}[k]
    im.save(f'out/{name}.jpg', quality=93); OUT.append(im); print('ok', name)
S = Image.new('RGB', (1280, 360 * 2 + 230), 'white'); [S.paste(im.resize((640, 360)), ((n % 2) * 640, (n // 2) * 360)) for n, im in enumerate(OUT)]
m = Image.new('RGB', (168 * 3 + 20, 94), '#0F0F0F'); [m.paste(im.resize((168, 94), Image.LANCZOS), (n * 178, 0)) for n, im in enumerate(OUT)]
S.paste(m.resize((m.width * 2, 188), Image.NEAREST), (116, 720 + 21)); S.save('out/_sheet.jpg', quality=88)
