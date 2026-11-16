"""사피엔스 편 썸네일 v2(더 매력적으로): raw/A2·B2·C2.png 위에 2줄 글자. 니체 편 mk.py의 txt·leftshade."""
import os, sys
sys.path.insert(0, '/home/claude/sangsik-lab/nietzsche_no01/thumb2')
from PIL import Image, ImageDraw
import mk as NK
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); os.makedirs('out', exist_ok=True)
SPEC = {  # 1줄, 2줄, 왼쪽 어둡게(세기, 너비), 이름
 'A2': ('출근길이', '가벼워진 이유', 70, 560, '사피엔스편_썸네일v2_A_출근길이가벼워진이유'),
 'B2': ('내 월급이', '게임 머니?', 40, 560, '사피엔스편_썸네일v2_B_내월급이게임머니'),
 'C2': ('밀한테', '길들여졌다고?', 60, 560, '사피엔스편_썸네일v2_C_밀한테길들여졌다고')}
OUT = []
for k, (l1, l2, a, w, name) in SPEC.items():
    im = NK.leftshade(Image.open(f'raw/{k}.png').convert('RGB').resize((1280, 720), Image.LANCZOS), a, w); d = ImageDraw.Draw(im)
    NK.txt(d, (40, 70), l1, 122, NK.WHITE, 520)
    NK.txt(d, (40, 235), l2, 124, '#111', 520 if k != 'A2' else 470, bar=NK.YEL)
    im.save(f'out/{name}.jpg', quality=93); OUT.append(im); print('ok', name)
S = Image.new('RGB', (1280, 360 * 2 + 230), 'white'); [S.paste(im.resize((640, 360)), ((n % 2) * 640, (n // 2) * 360)) for n, im in enumerate(OUT)]
m = Image.new('RGB', (168 * 3 + 20, 94), '#0F0F0F'); [m.paste(im.resize((168, 94), Image.LANCZOS), (n * 178, 0)) for n, im in enumerate(OUT)]
S.paste(m.resize((m.width * 2, 188), Image.NEAREST), (116, 720 + 21)); S.save('out/_sheet_v2.jpg', quality=88)
