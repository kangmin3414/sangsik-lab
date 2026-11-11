"""웹툰 시리즈 인물 확장(2026-11-11 운영자 "각 캐릭터별 감정 표정 이미지"):
도윤·하린 디자인 시안 → 6인 라인업 → 인물별 감정 컷.
사용: python3 cast2.py design        (d_* 디자인 시안)
      python3 cast2.py emo_doyun ...  (접두사로 묶음 실행: emo_doyun / emo_harin / emo_taeho / emo_boss / emo_minjun / emo_seoyun / lineup)
      python3 cast2.py hd1 ht2        (지정 컷만 다시)
"""
import base64, io, os, sys, time
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
os.makedirs('ai/cast2', exist_ok=True)

STY = ('Art style exactly like the reference images: flat Korean webtoon, clean bold black outlines, flat cel colors with one soft shadow tone, '
       'natural human skin tones only (never pink skin), no moles on faces, no head ornaments. '
       'Absolutely no text, letters, numbers, labels, speech bubbles or logos anywhere. ')
EMO = ('Use the reference images ONLY for the character design (same face, hair, glasses/accessories, outfit). ONE square panel, chest-up, '
       'character alone and centered, clear readable acting at small size. ' + STY)
OFFICE = 'Background: a softly blurred, realistic, photographic-looking Korean open-plan office in daylight. '
BAR = 'Background: a softly blurred, realistic, photographic-looking cozy Korean pub-restaurant at night with warm lights. '

LINEUP = 'ai/lineup_1.png'
DOYUN = ('Doyun: 22-year-old Korean male university senior, marketing intern. Tall with broad shoulders, short light-brown two-block haircut, '
         'big bright eyes, wide friendly grin, slightly tanned healthy skin, a former basketball club member. Navy sweatshirt under an oversized '
         'open green-and-white check shirt, black slacks, white sneakers, lanyard with a blank white ID card. ')
HARIN = ('Harin: 27-year-old Korean woman, package designer, clearly an adult. Wavy dark-brown hair just below the shoulders in a loose half-up style '
         '(tied with a plain hair tie, no decorative clip), gentle warm eyes, soft calm smile, mature and elegant. Olive-green knit sweater, ivory wide '
         'trousers, a plain black hair tie worn on her wrist, lanyard with a blank white ID card. Pretty and graceful. ')
MINJUN = ('Minjun: 27-year-old Korean office worker, fluffy messy dark curly hair with one strand sticking up, thin round glasses, '
          'cream knit cardigan over a mustard-yellow t-shirt, lanyard with a blank white ID card. ')
SEOYUN = ('Seoyun: 21-year-old university intern, clearly an adult, very pretty, long straight glossy black hair with see-through bangs and a small '
          'mustard-yellow hair clip, pale sky-blue cardigan over a white blouse, lanyard with a blank ID card. Default face calm and cool; '
          'no blush, no sparkles. ')
TAEHO = ('Taeho: 27-year-old Korean man, short buzz cut, broad shoulders, big hearty smile, black bomber jacket over a white t-shirt. ')
BOSS = ('Team leader: Korean man around 48, swept-back dark hair with grey temples, square glasses, beige knit vest over a light-blue shirt. ')

R = {
    'minjun': ['ref/zero_duo.png', 'ai/charmC_1.png'],
    'seoyun': ['ref/seoyun_duo.png', 'ai/uniA_1.png'],
    'doyun': ['ref/doyun.png'], 'harin': ['ref/harin.png'],
    'taeho': ['ref/taeho.png'], 'boss': ['ref/boss.png'],
}
DESIGN = ('Character design sheet on a plain warm off-white background: the SAME new character shown twice side by side — '
          'left: full body standing front view; right: a large chest-up portrait with a natural smile. ' + STY)

CUTS = {
    'd_doyun1': ([LINEUP], '16:9', DESIGN + DOYUN),
    'd_doyun2': ([LINEUP], '16:9', DESIGN + DOYUN + 'Give him a slightly more boyish, puppy-like charm. '),
    'd_harin1': ([LINEUP], '16:9', DESIGN + HARIN),
    'd_harin3': ([LINEUP, 'ai/uniA_1.png'], '16:9', DESIGN + 'A DIFFERENT woman from the references; match only the drawing quality of the second reference: '
                 'refined pretty face with delicate thin eyebrows, clear eyes with detailed irises, long lashes and bright highlights, small nose. ' + HARIN +
                 'Her wavy hair is clearly half-up at the back. Warm, mature beauty — older-sister vibe, distinct from a cute student look. '),
    'd_harin4': ([LINEUP, 'ai/uniA_1.png'], '16:9', DESIGN + 'A DIFFERENT woman from the references; match only the drawing quality of the second reference: '
                 'refined pretty face with delicate thin eyebrows, clear eyes with detailed irises, long lashes and bright highlights, small nose. ' + HARIN +
                 'Her wavy hair is clearly half-up at the back, a few soft face-framing strands. Elegant, gentle, slightly almond-shaped warm eyes. '),
    'd_harin2': ([LINEUP], '16:9', DESIGN + HARIN + 'Give her a slightly more refined, quietly confident designer look. '),
}
E = {
    'doyun': (DOYUN, OFFICE, [
        ('직진 인사', 'Super bright greeting: big open grin, one hand raised high in a wave, leaning forward with energy.'),
        ('첫눈에 반함', 'Love at first sight but restrained: frozen mid-step, eyes wide and shining, mouth slightly open, ears a little red, holding a coffee cup.'),
        ('사부님 존경', 'Admiring awe: both hands clutching a small notebook to his chest, eyes sparkling with respect, looking up at someone off-frame.'),
        ('받아 적기', 'Earnestly writing in a small notebook with a neon-green sticky note pad, tongue slightly out in concentration, nodding.'),
        ('작전 실패', 'Cheerful defeat: forced big smile with a single sweat drop, scratching the back of his head, eyes curved.'),
        ('비상계단 숨 고르기', 'Alone, leaning back against a wall, eyes closed, taking a deep breath, quiet and a little sad, then hands in fists. Background: a softly blurred realistic office emergency stairwell.'),
        ('다시 파이팅', 'Determined comeback: both fists clenched at chest level, fired-up eyes, confident grin.'),
        ('깨달음, 물러섬', 'Quiet realization: a small gentle bittersweet smile, eyes lowered, shoulders relaxed, accepting.'),
    ]),
    'harin': (HARIN, OFFICE, [
        ('따뜻한 기본', 'Default: calm warm smile, holding a mint-green tumbler with both hands, relaxed shoulders.'),
        ('"민준아"', 'Casually calling out to a friend off-frame: light easy smile, one hand slightly raised, comfortable and familiar.'),
        ('3년째 체념', 'Resigned deadpan: half-lidded eyes, sipping from her mint tumbler, a tiny tired smile — "here we go again".'),
        ('서윤 마음 눈치챔', 'Noticing something: eyes slightly widened then softened, a knowing small smile, glancing sideways at someone off-frame.'),
        ('질투 반 응원 반', 'Complicated feelings: smiling with her mouth while her eyes look a little lonely, holding the tumbler tighter.'),
        ('일할 때', 'Focused designer: pencil in hand over a blank color swatch sheet, sharp attentive eyes, sleeves pushed up.'),
        ('우산', 'Holding a closed navy long umbrella with both hands in front of her, looking down at it with a wistful soft smile. Background: a softly blurred realistic office entrance on a rainy day.'),
        ('웃으면서 울기', 'Smiling while a single tear runs down one cheek, eyes curved, gentle and brave, not sobbing.'),
    ]),
    'taeho': (TAEHO, BAR, [
        ('호탕한 웃음', 'Laughing hard: head thrown back, mouth wide open, slapping the table.'),
        ('답답함', 'Exasperated: palm on his forehead, eyes closed, mouth crooked in disbelief.'),
        ('"그거 너 좋아하는 거잖아"', 'Pointing straight at someone off-frame with a beer glass in the other hand, eyebrows raised, "isn\'t it obvious?" face.'),
        ('진지한 친구', 'Serious and caring: leaning forward on his elbows, steady warm eyes, quiet listening face.'),
        ('숨은 시선', 'Caught off guard: a brief soft glance to the side at someone off-frame, a tiny private smile he quickly hides.'),
        ('어깨동무 응원', 'Cheering a friend: thumbs up, big confident grin, one arm stretched out as if around a friend\'s shoulder (friend not shown).'),
    ]),
    'boss': (BOSS, OFFICE, [
        ('무뚝뚝 기본', 'Default: expressionless, reading a printed report, glasses low on his nose.'),
        ('턱짓', 'Holding a coffee mug, pointing with his chin at something off-frame, a knowing tiny smirk.'),
        ('모른 척', 'Pretending not to notice: sipping coffee, eyes turned away to the ceiling, innocent face.'),
        ('피식', 'A short amused snort: mouth corner up, eyes half-closed, shaking his head slightly as he walks.'),
        ('업무 모드', 'Strict: pushing his glasses up with one finger, sharp eyes, lips pressed.'),
        ('속 따뜻함', 'Rare warm smile: soft eyes behind his glasses, a small proud nod, hands behind his back.'),
    ]),
    'minjun': (MINJUN, OFFICE, [
        ('허둥지둥', 'Flustered: bowing slightly, hand on the back of his head, sweat drop, one curly strand flying up.'),
        ('경청', 'Attentive: listening seriously, pen ready over a small notebook, eyes focused.'),
        ('"확인해 볼게요"', 'Earnest work mode: pushing up his round glasses, nodding sincerely, holding a document.'),
        ('업무로 받아치기', 'Totally oblivious: bright sincere smile, holding up a planner as if to schedule a meeting, eyebrows up.'),
        ('정중하지만 단호', 'Polite but firm: calm face, small bow, one open palm forward as if saying "excuse me, that is mine".'),
        ('"혹시… 나한테?"', 'A rare moment of doubt: freezing, staring into space, a faint confused look, curly strand slowly rising — then the beginning of shaking his head.'),
    ]),
    'seoyun': (SEOYUN, OFFICE, [
        ('쿨한 기본', 'Default cool face: neutral, composed, eyes slightly to the side, unimpressed.'),
        ('"…그러시겠죠"', 'Seeing through a lie: calm half-lidded eyes, one eyebrow barely lifted, lips in a tiny flat line.'),
        ('툴툴', 'Grumbling: brows knitted, slight pout, yet eyes fixed on a paper she holds.'),
        ('곁눈질', 'Side-eye: face toward a monitor, eyes slid sideways toward someone, pretending not to look.'),
        ('"민준아"에 흔들림', 'Bothered: a tiny twitch at the corner of her mouth, fingers tightening on a pen, looking away with a cool face that is slightly cracking.'),
        ('부정하지 않는 한마디', 'Finally honest: looking straight ahead with a small, genuine, shy-but-steady smile, eyes soft.'),
    ]),
}
for who, (desc, bg, emos) in E.items():
    for i, (_, act) in enumerate(emos, 1):
        CUTS[f'{who}{i}'] = (R[who], '1:1', EMO + desc + act + ' ' + (bg if 'Background:' not in act else ''))
CUTS['lineup'] = (R['minjun'][:1] + R['seoyun'][:1] + R['doyun'] + R['harin'] + R['taeho'] + R['boss'], '16:9',
                  'Draw a cast lineup on a plain warm off-white background: six adults standing side by side, full body, front view, evenly spaced, '
                  'left to right: Minjun, Seoyun, Doyun, Harin, Taeho, Team leader, matching the references exactly. ' + STY +
                  MINJUN + SEOYUN + DOYUN + HARIN + TAEHO + BOSS)

b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
out = lambda k: f'ai/cast2/{k}.png'
args = sys.argv[1:]
if args == ['design']:
    want = [k for k in CUTS if k.startswith('d_') and not os.path.exists(out(k))]
elif args and all(a.startswith('emo_') for a in args):
    want = [k for a in args for k in CUTS if k.rstrip('0123456789') == a[4:] and not os.path.exists(out(k))]
else:
    want = args
vx.token()
for n, k in enumerate(want):
    refs, ar, prompt = CUTS[k]
    if n: time.sleep(4)
    parts = [{"inlineData": {"mimeType": "image/png", "data": b64(r)}} for r in refs] + [{"text": prompt}]
    body = {"contents": [{"role": "user", "parts": parts}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": ar, "imageSize": "1K"}}}
    st, r = 0, None
    for a in range(5):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, str(r)[:120], flush=True); time.sleep(40)
    imgs, _ = vx.inline_parts(r) if st == 200 else ([], '')
    if not imgs:
        print(k, 'fail', flush=True); continue
    im = Image.open(io.BytesIO(imgs[-1][1])).convert('RGB'); im.thumbnail((1280, 1280), Image.LANCZOS); im.save(out(k))
    print(k, 'ok', flush=True)
print('ALL DONE')
