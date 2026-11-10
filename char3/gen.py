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
