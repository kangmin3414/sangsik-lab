"""019 인스타 카드뉴스 8장(1080x1350): 영상 장면 + 짧은 글.  python3 card017.py"""
import json, subprocess, io
from PIL import Image, ImageDraw, ImageFont
F = lambda s: ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc', s, index=1)
FB = lambda s: ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', s, index=1)
SRC = '../leekunhee019/상식실험실_실험019_이건희_15만대_v1.mp4'
L = json.load(open('../leekunhee019/timeline.json'))['lines']
NAVY, RED, MINT, INK, SUB = (20, 30, 50), (232, 74, 60), (66, 211, 160), (20, 30, 50), (110, 98, 85)
CARDS = [
 (0, 0.6, [('자기가 만든 휴대폰', NAVY), ('15만 대를 불태운 사람', RED)], ['1995년 3월. 왜 그랬을까?', '외톨이 소년에서 세계 1등까지, 5개의 계단 →'], ''),
 (9, 0.7, [('1계단', NAVY), ('보는 눈', RED)], ['도쿄의 외톨이 소년, 영화 1,200편(알려진 이야기).', '같은 영화를 주인공·조연의 눈으로 다시 봤다.'], ''),
 (24, 0.6, [('2계단 · 믿는 힘', NAVY), ('아무도 안 믿은 18년', RED)], ['1974년 자기 돈으로 반도체 → 1992년 D램 세계 1위.', '기다림은 믿을 이유가 있을 때 생긴다.'], 'Kidd 외 (2013)'),
 (33, 0.6, [('3계단 · 부끄러움', NAVY), ('세탁기 뚜껑 영상', RED)], ['규격이 안 맞는 뚜껑을 칼로 깎아 끼우던 현장.', '그리고 "마누라와 자식 빼고 다 바꿔라"'], '1993 신경영'),
 (49, 0.6, [('4계단 · 버리는 용기', NAVY), ('아까워서 못 버리는 마음', RED)], ['불량 15만 대, 약 500억 원어치를 태웠다.', '불량률 11.8% → 2%대, 그해 국내 1위.'], 'Arkes & Blumer (1985)'),
 (52, 0.5, [('삼성을 키운', NAVY), ('6가지 결정', RED)], ['먼저 들어가기 · 고치기 쉬운 길 · 먼저 크게', '양보다 질 · 사람에게 투자 · 아까워도 버리기'], ''),
 (60, 0.8, [('5계단', NAVY), ('나누는 마음', RED)], ['미술품 2만 3천여 점, 조건 없는 기증.', '혼자 보던 소년이 남긴, 모두가 함께 보는 것.'], ''),
 (63, 0.8, [('인생을 바꾸는 건', NAVY), ('부끄러운 장면을 보는 용기', RED)], ['내 삶의 세탁기 뚜껑은 무엇인가요?', '지금 나는 몇 번째 계단에?', '전체 이야기는 프로필 링크 · 유튜브 「상식실험실」'], ''),
]
def still(i, fr):
    t = L[i]['t0'] + fr * (L[i]['t1'] - L[i]['t0'])
    png = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{t:.2f}', '-i', SRC, '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True).stdout
    im = Image.open(io.BytesIO(png)).convert('RGB')
    return im.crop((200, 0, 1720, 880))                # centre, without the burnt-in subtitle strip
for n, (i, fr, title, body, src) in enumerate(CARDS, 1):
    c = Image.new('RGB', (1080, 1350), (255, 244, 224)); d = ImageDraw.Draw(c)
    d.rounded_rectangle((40, 40, 170, 100), 30, fill=MINT, outline=INK, width=4); d.text((105, 70), f'{n}/{len(CARDS)}', font=F(34), fill=INK, anchor='mm')
    d.text((1040, 70), '상식실험실 · 실험 019', font=FB(30), fill=SUB, anchor='rm')
    y = 150
    for txt, col in title: d.text((60, y), txt, font=F(76 if n == 1 else 68), fill=col); y += 96 if n == 1 else 88
    im = still(i, fr); w = 960; h = int(w * im.height / im.width); im = im.resize((w, h), Image.LANCZOS)
    top = y + 20; mask = Image.new('L', (w, h), 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, w, h), 32, fill=255)
    d.rounded_rectangle((60 - 6, top - 6, 60 + w + 6, top + h + 6), 36, fill=INK); c.paste(im, (60, top), mask)
    y = top + h + 50
    for j, b in enumerate(body): d.text((60, y), b, font=F(44) if (n == 8 and j == 1) else FB(38), fill=RED if (n == 8 and j == 1) else NAVY); y += 70
    if src: d.text((60, 1290), '출처: ' + src, font=FB(26), fill=SUB)
    c.save(f'019/카드_{n:02d}.jpg', quality=92)
print('ok')
