"""기게스의 반지 편 썸네일: raw/A·B·C.png 위에 2줄 글자(니체 편 mk.py의 txt·leftshade). 시트(원본 + 모바일 168×94를 2배) 포함."""
import os, sys
sys.path.insert(0, '/home/claude/sangsik-lab/nietzsche_no01/thumb2')
from PIL import Image, ImageDraw
import mk as NK
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); os.makedirs('out', exist_ok=True)
SPEC = {  # 1줄, 2줄, 왼쪽 어둡게(세기, 너비), 파일 이름
 'A': ('들킬 확률', '0%라면?', 150, 620, '기게스편_썸네일A_들킬확률0퍼센트라면'),
 'B': ('아무도', '모른다면?', 150, 620, '기게스편_썸네일B_아무도모른다면'),
 'C': ('너라면', '쓸 거야?', 150, 620, '기게스편_썸네일C_너라면쓸거야')}
OUT = []
for k, (l1, l2, a, w, name) in SPEC.items():
    im = NK.leftshade(Image.open(f'raw/{k}.png').convert('RGB').resize((1280, 720), Image.LANCZOS), a, w); d = ImageDraw.Draw(im)
    NK.txt(d, (40, 80), l1, 120, NK.WHITE, 520)
    NK.txt(d, (40, 245), l2, 132, '#111', 520, bar=NK.YEL)
    im.save(f'out/{name}.jpg', quality=93); OUT.append(im); print('ok', name)
S = Image.new('RGB', (1280, 360 * 2 + 230), 'white'); [S.paste(im.resize((640, 360)), ((n % 2) * 640, (n // 2) * 360)) for n, im in enumerate(OUT)]
m = Image.new('RGB', (168 * 3 + 20, 94), '#0F0F0F'); [m.paste(im.resize((168, 94), Image.LANCZOS), (n * 178, 0)) for n, im in enumerate(OUT)]
S.paste(m.resize((m.width * 2, 188), Image.NEAREST), (116, 720 + 21)); S.save('out/_sheet.jpg', quality=88); print('sheet')
