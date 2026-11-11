"""인물별 감정 보드: ai/cast2/<인물>N.png → board2/감정_<이름>.jpg (도윤·하린은 디자인 시안을 위에 붙인다)."""
import os, importlib.util, sys
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
FB = lambda s: ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc', s, index=1)
FM = lambda s: ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Medium.ttc', s, index=1)
BG, INK, SUB, ACC = (250, 244, 233), (42, 33, 24), (110, 98, 86), (232, 178, 40)

# cast2.py 의 감정 이름을 그대로 가져온다(생성 없이 읽기만)
src = open('cast2.py').read().split("b64 = lambda")[0].replace("import vx", "vx = None")
ns = {'__file__': os.path.abspath('cast2.py')}; exec(src, ns); E = ns['E']

PEOPLE = [
    ('minjun', '민준', '27살 입사 2년 차 · 성실한데 자기를 계산에서 빼는 사람', 'Enceladus', None),
    ('seoyun', '서윤', '21살 겨울 인턴 · 쿨한 츤데레, 외모로 먼저 읽히는 게 지겨운 사람', 'Leda', None),
    ('doyun', '도윤', '22살 마케팅팀 인턴 · 사람을 좋아하는 법을 잘못 배운 직진', 'Achird / Puck 후보', 'd_doyun1'),
    ('harin', '하린', '27살 디자인팀 · 민준 입사 동기, 3년째 우산을 돌려받지 못한 사람', 'Sulafat / Vindemiatrix 후보', 'd_harin3'),
    ('taeho', '태호', '27살 민준의 대학 동기 · 시청자의 입', '미정', None),
    ('boss', '팀장님', '48살 안팎 TF 리더 · 다 알고 모른 척하는 사람', 'Charon(임시)', None),
]
os.makedirs('board2', exist_ok=True)
P, CAP, COLS, GAP = 400, 64, 4, 26
for key, name, line, voice, design in PEOPLE:
    emos = E[key][2]
    rows = (len(emos) + COLS - 1) // COLS
    W = COLS * P + (COLS + 1) * GAP
    DH = int((W - 2 * GAP) * 9 / 16) + GAP if design else 0
    H = 150 + DH + rows * (P + CAP) + (rows + 1) * GAP
    b = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(b)
    d.text((GAP, 26), name, font=FB(56), fill=INK)
    d.text((GAP + FB(56).getlength(name) + 24, 50), line, font=FM(26), fill=SUB)
    d.text((GAP, 104), f'목소리: {voice}', font=FM(22), fill=SUB)
    y0 = 150
    if design:
        im = Image.open(f'ai/cast2/{design}.png').convert('RGB'); w = W - 2 * GAP
        im = im.resize((w, int(im.height * w / im.width)), Image.LANCZOS); b.paste(im, (GAP, y0))
        d.rounded_rectangle((GAP, y0, GAP + w, y0 + im.height), radius=16, outline=INK, width=4)
        d.rounded_rectangle((GAP + 12, y0 + 12, GAP + 150, y0 + 52), radius=12, fill=ACC)
        d.text((GAP + 26, y0 + 32), '디자인 시안', font=FB(24), fill=INK, anchor='lm')
        y0 += DH
    for i, (label, _) in enumerate(emos):
        r, c = divmod(i, COLS); x = GAP + c * (P + GAP); y = y0 + GAP + r * (P + CAP + GAP)
        path = f'ai/cast2/{key}{i + 1}.png'
        if os.path.exists(path):
            b.paste(Image.open(path).convert('RGB').resize((P, P), Image.LANCZOS), (x, y))
        else:
            d.text((x + P // 2, y + P // 2), '생성 실패', font=FB(30), fill=SUB, anchor='mm')
        d.rounded_rectangle((x, y, x + P, y + P), radius=16, outline=INK, width=4)
        d.text((x + 4, y + P + 12), label, font=FB(28), fill=INK)
    b.save(f'board2/감정_{name}.jpg', quality=88); print('saved', name, b.size)
