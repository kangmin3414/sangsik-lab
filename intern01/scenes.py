"""시즌 1편(intern01) v10 장면 컷 + 인물별 감정 컷 (운영자 2026-11-11 "씬 관련 이미지, 캐릭터 표현·표정·감정도 함께").
장면 컷: 16:9 1K → ai/scene/*.png   감정 컷: 1:1 1K → ai/emo/*.png
사용: python3 scenes.py scene        (없는 장면만)
      python3 scenes.py emo          (없는 감정 컷만)
      python3 scenes.py c05 e_s3     (지정 컷만 다시)
"""
import base64, io, os, sys, time
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
C = '/home/claude/sangsik-lab/char3/'
os.makedirs('ai/scene', exist_ok=True); os.makedirs('ai/emo', exist_ok=True)

BASE = ('Use the reference images ONLY for character design (same faces, hair, glasses, hair clip, outfits); draw a NEW image. '
        'Art style: flat Korean webtoon, clean bold black outlines, flat cel colors with one soft shadow tone, characters crisp; '
        'background is a softly blurred, realistic, photographic-looking real place. Natural human skin tones only, never pink skin. '
        'No moles on faces. No blush stickers or pink cheeks. No hearts, sparkles or flower effects. '
        'Absolutely no text, letters, numbers, speech bubbles, signs, labels or logos anywhere; paper and sticky notes are blank. '
        'Keep the bottom 15% of the frame free of faces (subtitle area). Subtle, readable acting. ')
ZERO = ('Zero: 27-year-old Korean office worker, fluffy messy dark curly hair with one strand sticking up, thin round glasses, '
        'cream knit cardigan over a mustard-yellow t-shirt, lanyard with a blank white ID card. ')
SEO = ('Seoyun: 21-year-old university intern, clearly an adult, very pretty, long straight glossy black hair with see-through bangs '
       'and a small mustard-yellow hair clip, pale sky-blue cardigan over a white blouse. Her default face is calm, cool and composed: '
       'small mouth, steady eyes, never a big smile. ')
BOSS = 'Team leader: man around 48, swept-back dark hair with grey temples, square glasses, beige knit vest over a light-blue shirt. '
WINTER = ('Winter night clothes: Seoyun wears a long cream wool coat and a light-grey scarf over her cardigan, a grey laptop bag on her shoulder; '
          'Zero wears a navy padded jacket and a mustard scarf over his cardigan, holding an identical grey laptop bag. ')
THUGS = ('Two rude young men in their late 20s, a bit tipsy with slightly red faces: man A has short bleached hair, an ear piercing, '
         'an open black padded jacket, chewing gum; man B wears a backwards cap, hands in pockets, slouching. No weapons, no touching. ')
SW = ('ALONE in the frame, no other people. Winter night clothes: long cream wool coat and a light-grey scarf over her cardigan, a grey laptop bag on her shoulder. ')
ZW = ('ALONE in the frame, no other people. Winter night clothes: navy padded jacket and a mustard scarf over his cardigan. ')
STOP = 'Background: a softly blurred realistic Seoul bus stop at night in front of an office building, warm street lamps, wet asphalt. '
MEET = 'Background: a softly blurred realistic modern Korean office meeting room, glass wall, morning light. '
OFFICE = 'Background: a softly blurred realistic Korean open-plan office, desk partitions, monitors, daytime. '

Z, S, B = [C + 'ref/zero_duo.png', C + 'ai/charmC_1.png'], [C + 'ref/seoyun_duo.png', C + 'ai/uniA_1.png'], [C + 'ref/boss.png']
W16, W11 = '16:9', '1:1'

CUTS = {
    # ── 장면 컷 (대본 줄 번호) ──
    'c01': (Z + S, W16, ZERO + SEO + 'Line 3-4. Zero rushes into the meeting room flustered, bowing apologetically while putting down a grey laptop bag '
            'next to hers; one curly strand flies up, a sweat drop. Seoyun, seated, gives him one quick cool sideways glance, expressionless, '
            'judging. Two identical grey laptop bags sit side by side by the chairs. ' + MEET),
    'c02': (Z + S + B, W16, ZERO + SEO + BOSS + 'Line 6-8. Meeting table. Seoyun raises her hand halfway, calmly pointing at a colorful blank package mockup sheet. '
            'The team leader flips his papers without looking at her, uninterested. In the foreground, Zero alone is quietly writing in a small '
            'notebook with a pen, serious and attentive. Seoyun does not notice him. ' + MEET),
    'c03': (S, W16, SEO + WINTER + THUGS + 'Line 13-15. The two men crowd Seoyun at the bus stop, man A leaning in holding out his phone, man B smirking. '
            'Seoyun takes half a step back, face calm but firm and cold, clearly refusing, holding her bag strap. Light snow-less winter air. ' + STOP),
    'c04': (Z + S, W16, ZERO + SEO + WINTER + THUGS + 'Line 19. Zero, slightly out of breath with white breath vapor, politely holds up his own grey laptop bag '
            'toward the men with a straight, sincere, unbothered face. Man B glares at him chin raised; man A frowns. Seoyun stands behind, '
            'watching Zero with slight surprise. ' + STOP),
    'c05': (Z + S, W16, ZERO + SEO + WINTER + THUGS + 'Line 26-27. Low angle. Zero has stepped half a step in front of Seoyun, not backing down, pointing with '
            'an open palm up at a small CCTV camera on the bus-stop pole whose red light glows; he wears an awkward but polite smile. '
            'Man A, who stepped closer, freezes; man B clicks his tongue. ' + STOP),
    'c06': (Z + S, W16, ZERO + SEO + WINTER + 'Line 30-31. Only the two of them now, the bus leaving in the blurred background. Zero looks away to the side, '
            'sliding his slightly trembling hand into his padded jacket pocket, a tiny embarrassed pause. Seoyun looks down at his hand with a quiet, '
            'knowing, unreadable face. One step of space between them. ' + STOP),
    'c07': (Z + S, W16, ZERO + SEO + WINTER + 'Line 33-34. Wide two-shot side view: the very first snowflakes falling in the street-lamp light. Zero and Seoyun '
            'look up at the sky at exactly the same moment, both lips slightly parted, white breath, the same soft stillness on both faces. '
            'One step of space between them, not touching. Quiet, poetic. ' + STOP),
    'c08': (Z + S, W16, ZERO + SEO + WINTER + 'Line 35. Front two-shot, light snow falling. Both have just turned their heads away in opposite directions at the '
            'same time: Zero looks down fiddling with his bag zipper, Seoyun looks toward the road where the bus will come. Both faces '
            'composed but caught, a tiny pause. Not touching. ' + STOP),
    'c09': (S, W16, SEO + 'Line 39-40. Next week, afternoon, beside an office printer. Seoyun holds a printed report open at one page, reading it; '
            'her face is grumpy and unimpressed, eyebrows slightly knitted, but her eyes are lingering on the page as she turns back to look again. '
            'Report pages are blank with faint grey lines only. Background: a softly blurred realistic office printer corner. '),
    'c10': (S, W16, 'Close-up insert of a young woman\'s hand with a pale sky-blue cardigan sleeve placing a small square yellow sticky note '
            '(completely blank) neatly on the margin of a printed report page with faint grey lines, precise and careful. '
            'Background: softly blurred office printer and desk. The image fills the whole frame edge to edge, no white border. '),
    'c11': (Z + S + B, W16, ZERO + SEO + BOSS + 'Line 43-46. Open-plan office. Seoyun sits at her desk reading a report, not looking up, calm deadpan face, '
            'holding a pen. The team leader walks behind her carrying a coffee mug, pausing and pointing at the report with his chin, a knowing small smirk. '
            'Over the desk partition, Zero peeks up holding a report with a yellow blank sticky note on it, serious and earnest. ' + OFFICE),
    'c12': (Z + S, W16, ZERO + SEO + 'Line 48. Office. Foreground right: Zero carefully peels the yellow blank sticky note and sticks it inside the cover of '
            'his small notebook, sincere, absorbed. Background left at the next desk: Seoyun facing her monitor (only the back of the monitor visible) '
            'but her eyes slide sideways to watch him, face still composed. ' + OFFICE),
    'c13': (S, W16, SEO + WINTER + 'Line 52-54. Thursday night inside a city bus, snow outside the dark window with blurred city lights. Seoyun sits by the window '
            'with her grey laptop bag on her lap; on its handle two small square yellow blank sticky notes are placed neatly side by side. '
            'Her thumb presses the corner of the second one. Her reflection in the window shows a very faint, almost hidden smile; '
            'her real face stays calm. Background: softly blurred realistic bus interior. '),
    # ── 서윤 감정 컷(쿨한 츤데레) ──
    'e_s1': (S, W11, SEO + 'Chest-up. Default cool face: neutral, composed, eyes looking slightly to the side, completely unimpressed. ' + MEET),
    'e_s2': (S, W11, SEO + SW + 'Chest-up. Firm refusal: polite small bow of the head but eyes cold and steady, lips pressed, one hand raised slightly as a stop. ' + STOP),
    'e_s3': (S, W11, SEO + SW + 'Chest-up. Seeing through a lie: looking straight at someone off-frame with calm half-lidded eyes, one eyebrow barely lifted, '
             'lips in a tiny flat line, as if saying "sure you are". ' + STOP),
    'e_s4': (S, W11, SEO + SW + 'Chest-up. Looking up at the first snow, face softened and open, lips slightly parted, snowflakes, white breath. ' + STOP),
    'e_s5': (S, W11, SEO + SW + 'Chest-up. Caught: head turned away abruptly, eyes wide for half a second, body frozen, composed but startled. ' + STOP),
    'e_s6': (S, W11, SEO + 'Chest-up. Grumbling while reading a paper: brows knitted, mouth pouting slightly, yet eyes fixed on the page. ' + OFFICE),
    'e_s7': (S, W11, SEO + 'Chest-up. Side-eye: face toward a monitor, eyes slid sideways toward someone, lips neutral, pretending not to look. ' + OFFICE),
    'e_s8': (S, W11, SEO + SW + 'Chest-up by a dark bus window at night: a short breath out through the nose, the smallest hidden smile at one corner of '
             'her mouth, eyes lowered to her lap. Ambiguous between a sigh and a smile. Snow and blurred city lights outside. '),
    # ── 제로 감정 컷 ──
    'e_z1': (Z, W11, ZERO + 'Chest-up. Flustered apology: bowing slightly, hand on the back of his head, sweat drop, one curly strand flying up. ' + MEET),
    'e_z2': (Z, W11, ZERO + 'Chest-up. Quietly attentive: writing in a small notebook with a pen, eyes serious and focused. ' + MEET),
    'e_z3': (Z, W11, ZERO + ZW + 'Chest-up. Polite but unmoving: calm sincere face, holding up his grey laptop bag, standing his ground. ' + STOP),
    'e_z4': (Z, W11, ZERO + ZW + 'Chest-up. Awkward polite smile while pointing up with an open palm at something above, slightly nervous eyes. ' + STOP),
    'e_z5': (Z, W11, ZERO + ZW + 'Chest-up. Hiding the tremble: eyes averted to the side, hand going into his padded jacket pocket, '
             'lips pressed, embarrassed little pause. ' + STOP),
    'e_z6': (Z, W11, ZERO + 'Chest-up. Sincere thanks: small earnest bow, gentle grateful face, holding a report with a blank yellow sticky note. ' + OFFICE),
}

b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
def out(k): return f"ai/{'scene' if k.startswith('c') else 'emo'}/{k}.png"
args = sys.argv[1:]
if args in (['scene'], ['emo']):
    pre = 'c' if args[0] == 'scene' else 'e_'
    want = [k for k in CUTS if k.startswith(pre) and not os.path.exists(out(k))]
else:
    want = args or [k for k in CUTS if not os.path.exists(out(k))]
vx.token()
for n, k in enumerate(want):
    refs, ar, prompt = CUTS[k]
    if n: time.sleep(4)
    parts = [{"inlineData": {"mimeType": "image/png", "data": b64(r)}} for r in refs] + [{"text": BASE + prompt}]
    body = {"contents": [{"role": "user", "parts": parts}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": ar, "imageSize": "1K"}}}
    st, r = 0, None
    for a in range(4):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, str(r)[:150], flush=True); time.sleep(40)
    imgs, _ = vx.inline_parts(r) if st == 200 else ([], '')
    if not imgs:
        print(k, 'fail', flush=True); continue
    im = Image.open(io.BytesIO(imgs[-1][1])).convert('RGB')
    im.thumbnail((1280, 1280), Image.LANCZOS); im.save(out(k))
    print(k, 'ok', im.size, flush=True)
print('ALL DONE')
