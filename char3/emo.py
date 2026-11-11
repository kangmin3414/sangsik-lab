"""팀장님 카톡 편(kakao01) 감정 컷: 대사 줄마다 제로 8컷·서윤 8컷 (운영자 2026-11-11 "이번 편에서 나오는 두 사람의 감정 표현 이미지").
참조: ref/zero_duo.png + ai/charmC_1.png (제로), ref/seoyun_duo.png + ai/uniA_1.png (서윤). 1:1, 1K로 빠르게.
사용: python3 emo.py            (없는 컷만)
      python3 emo.py z3 s5     (지정 컷만 다시)
"""
import base64, io, os, sys, time
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
os.makedirs('ai/emo', exist_ok=True)

BASE = ('Draw the SAME character as in the reference images (same face, hair, glasses or hair clip, outfit), matching the exact art style: '
        'flat Korean webtoon look, clean bold black outlines, flat cel colors with one soft shadow tone. ONE square panel, chest-up, '
        'character centered, expressive acting that reads clearly at small size. Natural human skin tones. No mole on the face. '
        'Absolutely no text, letters, numbers, speech bubbles, labels or logos anywhere. ')
OFFICE = 'Background: a softly blurred, realistic, photographic-looking Korean open-plan office in warm morning light. '
ZERO = 'The character is Zero, a 31-year-old office worker with fluffy messy dark curly hair, thin round glasses, cream knit cardigan over a mustard-yellow t-shirt, a lanyard with a blank white ID card. '
SEO = ('The character is Seoyun, a 21-year-old university intern, clearly an adult, very pretty with long straight glossy black hair, '
       'see-through bangs and a small mustard-yellow hair clip, pale sky-blue knit cardigan over a white blouse, lanyard with a blank ID card. '
       'She stays pretty and cute in every expression, no wrinkles. ')

Z, S = ['ref/zero_duo.png', 'ai/charmC_1.png'], ['ref/seoyun_duo.png', 'ai/uniA_1.png']
CUTS = {
    'z1': (Z, ZERO.replace('cream knit cardigan over a mustard-yellow t-shirt, a lanyard with a blank white ID card', 'a plain grey pajama t-shirt') +
           'Night, 10:47 pm, sitting up in bed holding a smartphone with both hands; we see only the BACK of the phone; cold blue screen glow on his face. '
           'Startled: eyes wide behind the glasses, one strand of his curly hair shoots straight up. '
           'Background: a softly blurred, realistic, photographic-looking dark one-room apartment at night.'),
    'z2': (Z, ZERO + 'Smug and a little proud: he nudges his glasses up with one hand, chin slightly raised, a small satisfied smile. ' + OFFICE),
    'z3': (Z, ZERO + 'Defeated: frozen stunned face with blank eyes, one strand of curly hair drooping limply, the background colors faded to grey. ' + OFFICE),
    'z4': (Z, ZERO + 'Double take: eyes huge behind his glasses, eyebrows high, mouth a small o, one sweat drop. ' + OFFICE),
    'z5': (Z, ZERO + 'Nervous curiosity: leaning forward, swallowing hard, tense eyebrows, eager to hear the answer. ' + OFFICE),
    'z6': (Z, ZERO + 'Soul leaving the body: face drained pale white, hollow dot eyes, mouth slightly open, a strand of curly hair slowly wilting, '
                     'a few faint cold-wind lines blowing past. Comically tragic. ' + OFFICE),
    'z7': (Z, ZERO + 'Exhausted: rubbing under his eyes beneath the glasses with one hand, half a yawn, faint dark circles. ' + OFFICE),
    'z8': (Z, ZERO + 'Facepalm: one hand over his forehead, eyes closed, a tired but amused crooked smile. ' + OFFICE),
    's1': (S, SEO + 'Curious: head tilted, holding a tumbler with both hands, bright eyes looking at someone just off-frame. ' + OFFICE),
    's2': (S, SEO + 'Proud and radiant: a big bright smile, a little sparkle effect next to her yellow hair clip. ' + OFFICE),
    's3': (S, SEO + 'Cheerfully confident: mid-nod with eyes closed, a cute satisfied smile, tumbler in one hand. ' + OFFICE),
    's4': (S, SEO + 'Innocently explaining: eyes glancing up as she remembers something, lips slightly pursed, one hand lightly raised. ' + OFFICE),
    's5': (S, SEO + 'Delighted discovery: hands clasped together near her cheek, eyes sparkling wide, open happy mouth, little sparkles around. ' + OFFICE),
    's6': (S, SEO + 'Leaning in to peer closely at someone\'s face, big curious worried eyes, slight frown of concern. ' + OFFICE),
    's7': (S, SEO + 'Victory despite exhaustion: clearly visible dark circles under her eyes, yet a beaming triumphant smile, a sparkle by her hair clip. ' + OFFICE),
    's8': (S, SEO + 'Frozen: her bright smile stuck in place like a statue, the sparkle by her hair clip fading out, a single sweat drop. ' + OFFICE),
}

b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
vx.token()
want = sys.argv[1:] or [k for k in CUTS if not os.path.exists(f'ai/emo/{k}.png')]
for n, k in enumerate(want):
    refs, prompt = CUTS[k]
    if n: time.sleep(5)
    parts = [{"inlineData": {"mimeType": "image/png", "data": b64(r)}} for r in refs] + [{"text": BASE + prompt}]
    body = {"contents": [{"role": "user", "parts": parts}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "1:1", "imageSize": "1K"}}}
    st, r = 0, None
    for a in range(4):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, str(r)[:150], flush=True); time.sleep(40)
    imgs, _ = vx.inline_parts(r) if st == 200 else ([], '')
    if not imgs:
        print(k, 'fail', flush=True); continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((768, 768), Image.LANCZOS).save(f'ai/emo/{k}.png')
    print(k, 'ok', flush=True)
print('ALL DONE')
