"""017 인스타 카드뉴스 8장(1080x1350): 영상 장면 + 짧은 글.  python3 card017.py"""
import json, subprocess, io
from PIL import Image, ImageDraw, ImageFont
F = lambda s: ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc', s, index=1)
FB = lambda s: ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', s, index=1)
SRC = '../confucius017/상식실험실_실험017_공자_호감가는대화법_v1.mp4'
L = json.load(open('../confucius017/timeline.json'))['lines']
NAVY, RED, MINT, INK, SUB = (20, 30, 50), (232, 74, 60), (66, 211, 160), (20, 30, 50), (110, 98, 85)
CARDS = [  # (line, frac, title lines [(text, color)], body lines, source)
 (0, 0.6, [('말은 잘했는데', NAVY), ('왜 다시 안 만나 줄까?', RED)], ['2,500년 전 공자의 대화법으로', '일주일을 실험해 봤습니다 →'], ''),
 (6, 0.85, [('대화는', NAVY), ('캐치볼이다', RED)], ['공을 받으면, 돌려줘야 이어집니다.', '제로는 공을 꼭 끌어안고 놓지 않았죠.'], ''),
 (14, 0.6, [('자기 얘기를 하려고', NAVY), ('돈까지 포기한 사람들', RED)], ['받을 수 있던 돈의 평균 17%를 포기하고', '자기 얘기를 골랐습니다(한 번에 1~4센트).'], 'Tamir & Mitchell (2012) PNAS'),
 (24, 0.6, [('질문 하나가', NAVY), ('호감을 바꾼다', RED)], ['질문을 많이 한 쪽이 더 호감을 얻었고(5.79 대 5.31, 7점),', '특히 상대 말에 이어서 묻는 질문이 효과가 컸어요.'], 'Huang 외 (2017) JPSP'),
 (32, 0.92, [('그런데 질문 폭격과', NAVY), ('부메랑 질문은 역효과', RED)], ['"주말에 뭐 했어요? …저는요!"', '물어 놓고 내 얘기로 가져오면 진심이 없어 보입니다.'], 'Yeomans & Brooks (2025)'),
 (37, 0.8, [('공자가 꼽은', NAVY), ('말할 때의 세 가지 실수', RED)], ['조급함 · 숨김 · 그리고', '상대의 얼굴빛을 보지 않고 말하는 것(눈먼 것).'], '『논어』 계씨'),
 (63, 0.8, [('대화가 끝나고', NAVY), ('혼자 채점하지 마세요', RED)], ['우리는 상대가 나를 좋아한 정도를', '실제보다 낮게 짐작합니다(호감 격차).'], 'Boothby 외 (2018) Psychological Science'),
 (77, 0.6, [('오늘 써 볼', NAVY), ('딱 한 문장', RED)], ['누군가 이야기를 꺼내면, 이렇게.', '"그래서요? 그다음엔요?"', '전체 실험은 프로필 링크 · 유튜브 「상식실험실」'], ''),
]
def still(i, fr):
    t = L[i]['t0'] + fr * (L[i]['t1'] - L[i]['t0'])
    png = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{t:.2f}', '-i', SRC, '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True).stdout
    im = Image.open(io.BytesIO(png)).convert('RGB')
    return im.crop((200, 0, 1720, 880))                # centre, without the burnt-in subtitle strip
for n, (i, fr, title, body, src) in enumerate(CARDS, 1):
    c = Image.new('RGB', (1080, 1350), (255, 244, 224)); d = ImageDraw.Draw(c)
    d.rounded_rectangle((40, 40, 170, 100), 30, fill=MINT, outline=INK, width=4); d.text((105, 70), f'{n}/{len(CARDS)}', font=F(34), fill=INK, anchor='mm')
    d.text((1040, 70), '상식실험실 · 실험 017', font=FB(30), fill=SUB, anchor='rm')
    y = 150
    for txt, col in title: d.text((60, y), txt, font=F(76 if n == 1 else 68), fill=col); y += 96 if n == 1 else 88
    im = still(i, fr); w = 960; h = int(w * im.height / im.width); im = im.resize((w, h), Image.LANCZOS)
    top = y + 20; mask = Image.new('L', (w, h), 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, w, h), 32, fill=255)
    d.rounded_rectangle((60 - 6, top - 6, 60 + w + 6, top + h + 6), 36, fill=INK); c.paste(im, (60, top), mask)
    y = top + h + 50
    for j, b in enumerate(body): d.text((60, y), b, font=F(44) if (n == 8 and j == 1) else FB(38), fill=RED if (n == 8 and j == 1) else NAVY); y += 70
    if src: d.text((60, 1290), '출처: ' + src, font=FB(26), fill=SUB)
    c.save(f'017/카드_{n:02d}.jpg', quality=92)
print('ok')
