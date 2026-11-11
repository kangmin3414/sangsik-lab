"""웹툰체 시트콤 캐릭터 시안(운영자 2026-11-11 "이런 식으로 캐릭터·목소리·대본을 만들고 싶다. 먼저 캐릭터").
비치키의 그림 '문법'(평면 웹툰체, 굵은 외곽선, 표정 과장, 흐린 실사풍 배경)만 참고하고,
얼굴·피부색·머리 위 상징은 따라 하지 않는다. 프롬프트에 다른 채널 이름이나 그림을 넣지 않는다.

사용: python3 gen.py zero:1 zero:2 cast:1 scene:1:ai/zero_1.png
"""
import base64, io, os, sys, time
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
os.makedirs('ai', exist_ok=True)

STYLE = ('Original character art for a Korean YouTube sitcom animation about the everyday feelings of modern adults '
         '(office life, friends, small daily dilemmas). Style: clean Korean webtoon look, flat cel colors with one soft shadow tone, '
         'bold clean black outlines of even weight, simple semi-realistic adult proportions (about 6 heads tall), simple faces with '
         'expressive thick eyebrows, heavy upper eyelids, a small nose and mouth shapes that read clearly at small size, light blush for emotion. '
         'Natural human skin tones only. No animal parts, no horns, no ears or objects growing on the head. '
         'Designed to be easy to animate as a 2D cut-out puppet with a clearly separate head, torso and arms. '
         'Absolutely no text, letters, numbers, speech bubbles, labels or logos anywhere. '
         'Must not resemble any existing famous character, mascot or YouTube channel character.')

ZERO = ('The main character "Zero": a 31-year-old ordinary Korean office worker man with average looks (plain, not handsome, not ugly), '
        'slightly tired, faint dark circles under sleepy half-lidded eyes, messy short black hair with ONE stubborn cowlick strand '
        'sticking up from the crown; this cowlick is his signature and shows his mood. He wears an oversized heather-grey hoodie '
        'over a white shirt collar and a blank white lanyard ID card.')

J = {
    'zero': STYLE + ' ' + ZERO + ' Layout: a character expression sheet on a plain warm off-white background. '
            'Top row: five chest-up portraits of the SAME man, same size, evenly spaced: 1 neutral deadpan, '
            '2 awkward polite smile with one sweat drop, 3 tired and drained with slumped shoulders and the cowlick drooping, '
            '4 annoyed with a twitching eyebrow, 5 shocked with wide eyes and the cowlick standing straight up. '
            'Bottom row: one full-body front view and one full-body side view of the same man.',
    'cast': STYLE + ' Layout: a cast lineup on a plain warm off-white background, four DIFFERENT adults standing side by side, '
            'full body, each clearly distinct in silhouette and colors: '
            '1 Zero (described below); '
            '2 Taeho, Zero\'s best friend, 31, taller and broad-shouldered, buzz-cut hair, big easy grin, black bomber jacket over a white t-shirt; '
            '3 the team leader, a man in his late 40s, thinning swept-back hair, rectangular glasses, beige knit vest over a light blue shirt, holding a smartphone; '
            '4 Seoyun, a 29-year-old female coworker, low ponytail, calm sharp eyes, mustard cardigan over a cream blouse, holding a coffee tumbler. '
            + ZERO,
    'scene': 'Use the man in the attached reference image as the exact same character (same face, hair, cowlick, hoodie, ID card). '
             + STYLE + ' Draw ONE 16:9 animation frame: the character chest-up in the right half of the frame, holding a smartphone '
             'so that only the back of the phone is visible, the screen glow lighting his deadpan face, one sweat drop. '
             'Background: a softly blurred, realistic, photographic-looking Korean open-plan office at night (desks, monitors, warm lamp light), '
             'shallow depth of field. The flat cartoon character stays crisp and flat against the realistic blurred background. '
             'Keep the bottom 15% of the frame calm and dark enough for subtitles.',
}

# 2차(운영자 "캐릭을 좀 더 매력적으로"): 공감되는 직장인은 유지하되 인기 웹툰 주인공처럼 호감 가는 얼굴.
CHARM = (' Make him a genuinely appealing, charming protagonist like the lead of a popular Korean webtoon: good-looking but approachable, '
         'clean balanced facial features, expressive eyes with small highlights, nicely styled hair, a stylish casual outfit with a strong, simple silhouette, '
         'an appealing harmonious color palette. Keep him relatable as an ordinary office worker in his early thirties. '
         'He keeps ONE signature cowlick strand on the crown that shows his mood (droops when sad, zigzags when annoyed, stands straight up when shocked). '
         'No mole on the face, no pink skin. Layout: a character expression sheet on a plain warm off-white background. '
         'Top row: five chest-up portraits of the SAME man, same size, evenly spaced: 1 neutral, 2 warm smile, 3 tired and drained, '
         '4 annoyed, 5 shocked. Bottom row: one full-body front view, centered.')
J['charmA'] = (STYLE + ' The character "Zero", warm boy-next-door type: soft handsome face, gentle slightly droopy eyes, a neat two-block haircut in dark brown-black '
             'with a soft fringe, a calm kind expression. Outfit: a mustard-yellow hoodie over a white t-shirt, a blank white lanyard ID card, light grey wide trousers, white sneakers.' + CHARM)
J['charmB'] = (STYLE + ' The character "Zero", cool deadpan type: sharp single-lidded eyes, straight eyebrows, a comma-shaped fringe hairstyle in jet black, '
             'a dry, unbothered default face that makes his rare smile charming. Outfit: an oversized charcoal hoodie layered under an open light-grey work jacket, '
             'a mustard-yellow lanyard with a blank ID card, black straight trousers, clean black-and-white sneakers.' + CHARM)
J['charmC'] = (STYLE + ' The character "Zero", cute puppy-like type: big round eyes, a soft round face, fluffy messy dark hair, thin round glasses as a signature accessory, '
             'a shy, earnest expression. Outfit: a cream knit cardigan over a mustard-yellow t-shirt, a blank white lanyard ID card, navy chinos, brown loafers.' + CHARM)

# 3차(운영자 "여자도 그려줘"): 여자 주인공 서윤, 같은 화풍·같은 상징색.
FCHARM = (' Make her a genuinely appealing, charming female lead like in a popular Korean webtoon: pretty but approachable and natural, '
          'not sexualized, modest everyday office clothes, clean balanced facial features, expressive eyes with small highlights, nicely styled hair, '
          'a strong simple silhouette and an appealing harmonious color palette. She is an ordinary office worker around 29 years old. '
          'Her signature is a small mustard-yellow hair clip she always wears. No mole on the face, no pink skin. '
          'Layout: a character expression sheet on a plain warm off-white background. Top row: five chest-up portraits of the SAME woman, '
          'same size, evenly spaced: 1 neutral, 2 bright smile, 3 tired and drained, 4 annoyed, 5 shocked. Bottom row: one full-body front view, centered.')
J['womanA'] = (STYLE + ' The character "Seoyun", warm and kind coworker type: soft gentle eyes, a low loose ponytail with a few face-framing strands '
               'in dark brown, a calm friendly face. Outfit: a cream knit cardigan over a light blouse, a blank white lanyard ID card, beige wide trousers, '
               'white sneakers.' + FCHARM)
J['womanB'] = (STYLE + ' The character "Seoyun", cool and competent career type: sharp clear eyes, a sleek jaw-length bob in black, a composed, '
               'slightly dry expression that makes her smile special. Outfit: a charcoal oversized blazer over a white t-shirt, a blank white lanyard ID card, '
               'black straight trousers, simple loafers.' + FCHARM)
J['womanC'] = (STYLE + ' The character "Seoyun", bright and quirky type: big lively eyes, full see-through bangs, medium-length slightly wavy hair '
               'in warm dark brown, a playful expression. Outfit: an oversized soft green sweater, a blank white lanyard ID card, light denim jeans, '
               'chunky white sneakers.' + FCHARM)

# 4차(운영자 "여자는 더 매력적으로"): 인기 로맨스 웹툰 여주인공 수준의 미모. 노출·성적 표현 없이 얼굴·머릿결·옷 맵시로.
FPRETTY = (' Make her truly beautiful and lovable, like the heroine of a hit Korean romance webtoon: a small V-line face, large sparkling eyes with '
           'long lashes and two catchlights, softly arched brows, a small refined nose, glossy rosy lips, a light natural blush, '
           'silky shiny hair with highlight streaks and a few flowing loose strands, slim balanced proportions about 7 heads tall, graceful posture. '
           'Fashionable but modest, well-tailored modern office outfit and small delicate earrings. Tasteful and not sexualized. '
           'She stays pretty and cute in EVERY expression (no wrinkles, no ugly distortion): even tired or annoyed faces look charming, '
           'like a pout or a cute frown. She always wears a small mustard-yellow hair clip as her signature. No mole on the face, no pink skin. '
           'Layout: a character expression sheet on a plain warm off-white background. Top row: five chest-up portraits of the SAME woman, '
           'same size, evenly spaced: 1 neutral with a faint smile, 2 bright smile, 3 tired and sleepy, 4 annoyed pout, 5 surprised. '
           'Bottom row: one full-body front view, centered.')
J['prettyB'] = (STYLE + ' The character "Seoyun", 29, cool and competent career woman: a sleek glossy jaw-length bob in black with soft inward curls '
                'and a side part, cat-like clear eyes, a composed expression that turns into a dazzling smile. Outfit: a cropped light-grey tailored blazer '
                'over a white knit top, a thin gold necklace, a blank white lanyard ID card, black high-waisted slacks, black loafers.' + FPRETTY)
J['prettyA'] = (STYLE + ' The character "Seoyun", 29, warm and kind: long glossy dark-brown hair in a loose low ponytail over one shoulder with soft '
                'face-framing strands, gentle doe eyes, a sweet calm smile. Outfit: a soft butter-cream cardigan over a light blue collared blouse, '
                'a blank white lanyard ID card, a long pleated beige skirt, white sneakers.' + FPRETTY)
J['prettyC'] = (STYLE + ' The character "Seoyun", 29, bright and playful: medium-length wavy warm-brown hair with see-through bangs, big lively eyes, '
                'a mischievous smile. Outfit: a sage-green knit vest over a white shirt with rolled sleeves, a blank white lanyard ID card, '
                'straight light-blue jeans, white sneakers.' + FPRETTY)

# 4차-2: 기본 STYLE의 '굵은 눈썹·무거운 눈꺼풀'이 미모를 누름 → 여자용 화풍(섬세한 얼굴)으로 교체.
FSTYLE = STYLE.replace('simple faces with expressive thick eyebrows, heavy upper eyelids, a small nose and mouth shapes that read clearly at small size, light blush for emotion',
                       'refined pretty faces with delicate thin eyebrows, clear eyes with detailed irises, long lashes and bright highlights, '
                       'a small nose and mouth shapes that read clearly at small size, soft blush')
for _k in ['prettyA', 'prettyB', 'prettyC']:
    J[_k + '2'] = J[_k].replace(STYLE, FSTYLE, 1)

# 5차(운영자 "더 매력적으로 대학생"): 여자 주인공을 21~22살 대학생으로. 성인임이 분명하게, 단정한 옷.
UNIV = (' She is a 21-year-old university student, clearly an adult in her early twenties with mature adult proportions. '
        'Make her stunningly beautiful with an idol-like visual, the kind of girl everyone on campus notices: a small V-line face, '
        'large sparkling eyes with long lashes, detailed irises and two catchlights, softly arched brows, a small refined nose, glossy rosy lips, '
        'a natural blush, silky shiny hair with highlight streaks and flowing loose strands, slim balanced proportions about 7.5 heads tall, '
        'a confident graceful posture. Trendy but modest Korean campus fashion. Tasteful and not sexualized. '
        'She stays pretty and cute in EVERY expression (no wrinkles, no eye bags, no ugly distortion). '
        'She always wears a small mustard-yellow hair clip as her signature. No lanyard, no mole on the face, no pink skin. '
        'Layout: a character expression sheet on a plain warm off-white background. Top row: five chest-up portraits of the SAME woman, '
        'same size, evenly spaced, fully inside the frame: 1 neutral with a faint smile, 2 bright smile, 3 sleepy, 4 annoyed pout with puffed cheeks, '
        '5 surprised. Bottom row: one full-body front view, centered, natural relaxed pose.')
J['uniA'] = (FSTYLE + ' The character "Seoyun", pure and elegant type: long straight glossy black hair with soft see-through bangs, '
             'gentle doe eyes, a calm sweet smile. Outfit: an oversized cream cable-knit sweater, a long pleated light-grey skirt, '
             'white sneakers, a canvas tote bag on one shoulder and two textbooks held to her chest.' + UNIV)
J['uniB'] = (FSTYLE + ' The character "Seoyun", bright and lovely type: shoulder-length wavy chestnut-brown hair in a half-up style, '
             'big lively eyes, a radiant smile. Outfit: a light-blue denim jacket over a white-and-navy striped long-sleeve top, '
             'cream wide-leg trousers, white sneakers, a small backpack.' + UNIV)
J['uniC'] = (FSTYLE + ' The character "Seoyun", chic senior-student type: a layered glossy black medium cut that frames her face, '
             'cool cat-like eyes, a composed look that melts into a charming smile. Outfit: a camel long trench coat over a black turtleneck, '
             'straight dark jeans, black ankle boots, wireless earbuds, a laptop held under one arm.' + UNIV)

b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
vx.token()
for n, kk in enumerate(sys.argv[1:]):
    parts = kk.split(':')
    k, v = parts[0], parts[1]
    ref = parts[2] if len(parts) > 2 else None
    if n:
        time.sleep(6)
    p = []
    if ref:
        p.append({"inlineData": {"mimeType": "image/png", "data": b64(ref)}})
    p.append({"text": J[k]})
    body = {"contents": [{"role": "user", "parts": p}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    st, r = 0, None
    for a in range(4):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200:
            break
        print(kk, st, str(r)[:150], flush=True)
        time.sleep(40)
    imgs, _ = vx.inline_parts(r) if st == 200 else ([], '')
    if not imgs:
        print(kk, 'fail', flush=True)
        continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((1920, 1080), Image.LANCZOS).save(f'ai/{k}_{v}.png')
    print(kk, 'ok', flush=True)
