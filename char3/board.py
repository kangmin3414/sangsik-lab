"""감정 컷 보드: ai/emo/*.png 를 인물별 4×2 보드로 묶고 대사 줄 번호·감정 이름·대사를 붙인다."""
import os
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
FB = lambda s: ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc', s, index=1)
FM = lambda s: ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Medium.ttc', s, index=1)
BG, INK, SUB, ACC = (250, 244, 233), (42, 33, 24), (110, 98, 86), (232, 178, 40)

BOARDS = {
    '제로': ('제로 · 31살 대리 · 목소리 Enceladus', [
        ('z1', '2번', '깜짝', '지금? 밤 열 시 사십칠 분인데?'),
        ('z2', '5번', '은근한 자랑', '음… 이 분?'),
        ('z3', '7번', '패배', '(…졌다.)'),
        ('z4', '10번', '두 번 보기', '…세 번이요?'),
        ('z5', '14번', '긴장한 호기심', '뭐라고 하셨는데요?'),
        ('z6', '16번', '영혼 가출', '(…어머님 세대였구나, 나.)'),
        ('z7', '18번', '피곤', '새벽 한 시에 잤어요.'),
        ('z8', '20번', '이마 짚기', '…그걸 왜 이겨요.'),
    ]),
    '서윤': ('서윤 · 21살 인턴 · 목소리 Leda', [
        ('s1', '4번', '궁금', '몇 분 만에 답하셨어요?'),
        ('s2', '6번', '뿌듯', '아, 저는 일 분이요!'),
        ('s3', '9번', '해맑은 자신감', '저도 다 읽었는데요?'),
        ('s4', '11·13번', '순진한 설명', '엄마한테 여쭤봤죠.'),
        ('s5', '15번', '발견의 기쁨', '대리님 답장이랑 똑같네요!'),
        ('s6', '17번', '걱정 반 호기심 반', '눈 밑이 왜 그래요?'),
        ('s7', '19번', '피곤해도 승리', '저는 두 시요!'),
        ('s8', '22번', '웃는 채로 굳음', '(다음 주…?)'),
    ]),
}

P, GAP, CAP, TOP, COLS = 440, 26, 100, 110, 4
for who, (title, cuts) in BOARDS.items():
    rows = (len(cuts) + COLS - 1) // COLS
    W = COLS * P + (COLS + 1) * GAP
    H = TOP + rows * (P + CAP) + (rows + 1) * GAP
    board = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(board)
    d.text((GAP, 28), title, font=FB(44), fill=INK)
    d.text((W - GAP, 44), '팀장님 카톡 편 · 대사 줄 번호 기준', font=FM(26), fill=SUB, anchor='ra')
    for i, (k, ln, emo, quote) in enumerate(cuts):
        r, c = divmod(i, COLS)
        x = GAP + c * (P + GAP); y = TOP + GAP + r * (P + CAP + GAP)
        path = f'ai/emo/{k}.png'
        if os.path.exists(path):
            board.paste(Image.open(path).convert('RGB').resize((P, P), Image.LANCZOS), (x, y))
        else:
            d.rectangle((x, y, x + P, y + P), outline=SUB, width=3)
            d.text((x + P // 2, y + P // 2), '생성 실패', font=FB(30), fill=SUB, anchor='mm')
        d.rounded_rectangle((x, y, x + P, y + P), radius=18, outline=INK, width=4)
        d.rounded_rectangle((x + 12, y + 12, x + 12 + 26 + FB(24).getlength(ln), y + 52), radius=12, fill=ACC)
        d.text((x + 25, y + 32), ln, font=FB(24), fill=INK, anchor='lm')
        d.text((x + 4, y + P + 14), emo, font=FB(32), fill=INK)
        d.text((x + 4, y + P + 58), quote, font=FM(24), fill=SUB)
    board.save(f'emo_{who}.jpg', quality=90)
    print('saved', f'emo_{who}.jpg', board.size)
