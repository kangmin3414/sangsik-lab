"""시즌 1편 v10 보드: 장면 컷 보드(3장)와 인물별 감정 컷 보드(2장)."""
import os
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
FB = lambda s: ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc', s, index=1)
FM = lambda s: ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Medium.ttc', s, index=1)
BG, INK, SUB, ACC = (250, 244, 233), (42, 33, 24), (110, 98, 86), (232, 178, 40)

SCENES = [
    ('장면1_회의실', '1편 · 훅  월요일 첫 TF 회의', [
        ('c01', '3~4번', '첫인상', '제로: 허둥지둥 사과 / 서윤: 무표정, 한 번 훑기', '(…안경에 곱슬머리. 내 취향은 아니고.)'),
        ('c02', '6~8번', '아무도 안 들은 아이디어', '서윤: 담담한 제안 / 팀장님: 무관심 / 제로: 혼자 받아 적음', '"색을 한 가지로 줄이면 어떨까요."'),
    ]),
    ('장면2_정류장', '1편 · 위기  금요일 밤, 회사 앞 정류장', [
        ('c03', '13~15번', '서윤의 단호한 거절', '서윤: 차분하지만 차갑게 / 남자들: 끈질김', '"죄송해요. 괜찮습니다."'),
        ('c04', '19번', '존댓말로 버티기', '제로: 담담하고 진지 / 남자 2: 노려봄', '"아뇨. 이 가방 주인이요."'),
        ('c05', '26~27번', '물러서지 않는 제로', '제로: 서윤 앞 반 걸음, 어색한 미소', '"다들 얼굴 잘 나오게 웃으실래요?"'),
        ('c06', '30~31번', '들킨 거짓말', '제로: 시선 피함 / 서윤: 다 안다는 얼굴', '"…추워서요." / "…그러시겠죠."'),
        ('c07', '33~34번', '같은 순간', '둘 다: 동시에 하늘, 같은 표정', '"…첫눈."'),
        ('c08', '35번', '동시에 고개 돌림', '제로: 지퍼 확인 / 서윤: 버스 쪽', '(말 없음 2초)'),
    ]),
    ('장면3_포스트잇', '1편 · 통함과 여운  노란 포스트잇', [
        ('c09', '39~40번', '툴툴대며 다시 보기', '서윤: 트집 잡는 얼굴, 눈은 페이지에', '(…누가 이런 거 적어 달랬나. 오지랖은.)'),
        ('c10', '41번', '말 없는 답장', '서윤의 손: 반듯하게 붙이기', '포스트잇 "오타 없음."'),
        ('c11', '43~46번', '들킴', '팀장님: 피식 / 서윤: 눈도 안 듦 / 제로: 진지', '"…오타 찾는 중이에요."'),
        ('c12', '48번', '간직하는 사람, 보는 사람', '제로: 수첩에 간직 / 서윤: 곁눈', '(말 없음 2초)'),
        ('c13', '52~54번', '나란히', '서윤: 얼굴은 그대로, 창에 비친 얼굴만 옅게', '(…오지랖은.)'),
    ]),
]
EMO = [
    ('감정_서윤', '서윤 · 21살 인턴 · 쿨한 츤데레 · Leda', [
        ('e_s1', '1·4번', '기본 무표정', '(…내 취향은 아니고.)'),
        ('e_s2', '14번', '단호한 거절', '"죄송해요. 괜찮습니다."'),
        ('e_s3', '32번', '거짓말 알아듣기', '"…그러시겠죠."'),
        ('e_s4', '34번', '첫눈, 무장 해제', '"…첫눈."'),
        ('e_s5', '35번', '멈칫, 고개 돌림', '(말 없음)'),
        ('e_s6', '40번', '툴툴대며 다시 보기', '(…오지랖은.)'),
        ('e_s7', '46·48번', '곁눈질', '"…없던데요. 오타."'),
        ('e_s8', '53번', '한숨인지 웃음인지', '(…오지랖은.)'),
    ]),
    ('감정_제로', '제로 · 27살 2년 차 사원 · Enceladus', [
        ('e_z1', '3번', '허둥지둥 사과', '"죄, 죄송합니다."'),
        ('e_z2', '8번', '혼자 귀 기울임', '(수첩에 적기)'),
        ('e_z3', '19~23번', '정중하지만 꿈쩍 않음', '"아뇨. 이 가방 주인이요."'),
        ('e_z4', '27번', '어색한 미소', '"…웃으실래요?"'),
        ('e_z5', '31번', '떨림 숨기기', '"…추워서요."'),
        ('e_z6', '47번', '진심 업무 인사', '"…감사합니다. 꼼꼼히 봐 주셔서."'),
    ]),
]

def badge(d, x, y, t):
    d.rounded_rectangle((x + 12, y + 12, x + 38 + FB(24).getlength(t), y + 52), radius=12, fill=ACC)
    d.text((x + 25, y + 32), t, font=FB(24), fill=INK, anchor='lm')

def paste(board, d, path, x, y, w, h):
    if os.path.exists(path):
        im = Image.open(path).convert('RGB'); im = im.resize((w, int(im.height * w / im.width)), Image.LANCZOS)
        board.paste(im.crop((0, 0, w, h)), (x, y))
    else:
        d.text((x + w // 2, y + h // 2), '생성 실패', font=FB(30), fill=SUB, anchor='mm')
    d.rounded_rectangle((x, y, x + w, y + h), radius=16, outline=INK, width=4)

os.makedirs('board', exist_ok=True)
GAP = 28
for name, title, cuts in SCENES:
    PW, PH, CAP, COLS = 720, 405, 150, 2
    rows = (len(cuts) + 1) // COLS
    W = COLS * PW + (COLS + 1) * GAP; H = 110 + rows * (PH + CAP) + (rows + 1) * GAP
    b = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(b)
    d.text((GAP, 30), title, font=FB(42), fill=INK)
    d.text((W - GAP, 44), '대본_v10 줄 번호 기준', font=FM(24), fill=SUB, anchor='ra')
    for i, (k, ln, head, acting, line) in enumerate(cuts):
        r, c = divmod(i, COLS); x = GAP + c * (PW + GAP); y = 110 + GAP + r * (PH + CAP + GAP)
        paste(b, d, f'ai/scene/{k}.png', x, y, PW, PH); badge(d, x, y, ln)
        d.text((x + 4, y + PH + 12), head, font=FB(30), fill=INK)
        d.text((x + 4, y + PH + 56), acting, font=FM(22), fill=SUB)
        d.text((x + 4, y + PH + 92), line, font=FM(24), fill=INK)
    b.save(f'board/{name}.jpg', quality=88); print('saved', name, b.size)
for name, title, cuts in EMO:
    P, CAP, COLS = 420, 100, 4
    rows = (len(cuts) + COLS - 1) // COLS
    W = COLS * P + (COLS + 1) * GAP; H = 110 + rows * (P + CAP) + (rows + 1) * GAP
    b = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(b)
    d.text((GAP, 30), title, font=FB(42), fill=INK)
    d.text((W - GAP, 44), '1편 · 대본_v10 줄 번호 기준', font=FM(24), fill=SUB, anchor='ra')
    for i, (k, ln, emo, quote) in enumerate(cuts):
        r, c = divmod(i, COLS); x = GAP + c * (P + GAP); y = 110 + GAP + r * (P + CAP + GAP)
        paste(b, d, f'ai/emo/{k}.png', x, y, P, P); badge(d, x, y, ln)
        d.text((x + 4, y + P + 12), emo, font=FB(30), fill=INK)
        d.text((x + 4, y + P + 56), quote, font=FM(23), fill=SUB)
    b.save(f'board/{name}.jpg', quality=88); print('saved', name, b.size)
