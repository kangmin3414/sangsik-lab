"""018 인스타 카드뉴스 8장(1080x1350): 영상 장면 + 짧은 글.  python3 card017.py"""
import json, subprocess, io
from PIL import Image, ImageDraw, ImageFont
F = lambda s: ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc', s, index=1)
FB = lambda s: ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', s, index=1)
SRC = '../japan018/상식실험실_실험018_일본30년_v1.mp4'
L = json.load(open('../japan018/timeline.json'))['lines']
NAVY, RED, MINT, INK, SUB = (20, 30, 50), (232, 74, 60), (66, 211, 160), (20, 30, 50), (110, 98, 85)
CARDS = [  # (line, frac, title lines [(text, color)], body lines, source)
 (1, 0.5, [('일본에서 30년을 살면', NAVY), ('무엇을 알게 될까?', RED)], ['1년, 5년, 10년, 30년.', '한 층씩 내려가 봤습니다 →'], ''),
 (6, 0.7, [('1년 차', NAVY), ('돌려받지 못하는 돈, 레이킨', RED)], ['집주인에게 고맙다고 내는 돈.', '그리고 아침 7시, 쓰레기 앞에서 길을 잃는다.'], ''),
 (11, 0.9, [('문화 충격은', NAVY), ('U자가 아니었다', RED)], ['처음엔 신나고 → 우울 → 회복? 아니요.', '처음이 가장 힘들고, 차차 나아졌습니다.'], 'Ward 외 (1998)'),
 (19, 0.8, [('5년 차', NAVY), ('"생각해 보겠습니다"', RED)], ['考えておきます — 많은 경우, 정중한 거절.', '한국엔 눈치, 일본엔 공기를 읽는다.'], 'Edward T. Hall (1976)'),
 (34, 0.8, [('10년 차', NAVY), ('완벽한 일본 사람 되기', RED)], ['엄마: "너… 왜 이렇게 남처럼 말하니?"', '두 문화를 함께 가진 쪽이 더 잘 적응하는 경향.'], 'Nguyen & Benet-Martínez (2013)'),
 (41, 0.6, [('30년 차', NAVY), ('처음 본 사람도 "이모"', RED)], ['일본 사람이 다 된 눈으로 보니,', '한국은 이모·삼촌·언니의 나라였다.'], ''),
 (51, 0.8, [('폐를 끼치지 않는 배려', NAVY), ('폐를 끼쳐도 되는 사이', RED)], ['둘 다 다정함이었습니다.', '방향이 달랐을 뿐.'], ''),
 (56, 0.9, [('가장 늦게 알게 된 건', NAVY), ('우리 자신', RED)], ['和而不同 — 어울리되, 같아지지 않는다.', '"밥은 먹었어요?"', '전체 실험은 프로필 링크 · 유튜브 「상식실험실」'], '『논어』 자로'),
]
def still(i, fr):
    t = L[i]['t0'] + fr * (L[i]['t1'] - L[i]['t0'])
    png = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{t:.2f}', '-i', SRC, '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True).stdout
    im = Image.open(io.BytesIO(png)).convert('RGB')
    return im.crop((200, 0, 1720, 880))                # centre, without the burnt-in subtitle strip
for n, (i, fr, title, body, src) in enumerate(CARDS, 1):
    c = Image.new('RGB', (1080, 1350), (255, 244, 224)); d = ImageDraw.Draw(c)
    d.rounded_rectangle((40, 40, 170, 100), 30, fill=MINT, outline=INK, width=4); d.text((105, 70), f'{n}/{len(CARDS)}', font=F(34), fill=INK, anchor='mm')
    d.text((1040, 70), '상식실험실 · 실험 018', font=FB(30), fill=SUB, anchor='rm')
    y = 150
    for txt, col in title: d.text((60, y), txt, font=F(76 if n == 1 else 68), fill=col); y += 96 if n == 1 else 88
    im = still(i, fr); w = 960; h = int(w * im.height / im.width); im = im.resize((w, h), Image.LANCZOS)
    top = y + 20; mask = Image.new('L', (w, h), 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, w, h), 32, fill=255)
    d.rounded_rectangle((60 - 6, top - 6, 60 + w + 6, top + h + 6), 36, fill=INK); c.paste(im, (60, top), mask)
    y = top + h + 50
    for j, b in enumerate(body): d.text((60, y), b, font=F(44) if (n == 8 and j == 1) else FB(38), fill=RED if (n == 8 and j == 1) else NAVY); y += 70
    if src: d.text((60, 1290), '출처: ' + src, font=FB(26), fill=SUB)
    c.save(f'018/카드_{n:02d}.jpg', quality=92)
print('ok')
