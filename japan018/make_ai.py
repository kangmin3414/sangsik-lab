"""Ep.018 story pictures with Nano Banana 2.1 on Google Cloud (free-trial credits).
ref/zero_ages.png = Zero at year 1, 5, 10, 30 (left to right); ref/cast.png = [Yamada, Sato, Hana, Mom, sister, nephew Minjun, Korean newcomer].
usage: python3 make_ai.py [key ...]   -> ai/<key>.png (1920x1080)"""
import base64, io, json, os, sys, time
from PIL import Image
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'gtts'))
import vx
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); os.makedirs('ai', exist_ok=True)
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
ZR, CR = 'ref/zero_ages.png', 'ref/cast.png'
Z = {
 1: 'Zero (his first year in Japan) is drawn exactly like the 1st (leftmost) character in the Zero reference: a round white head with no hair, simple face, '
    'a white short-sleeved collared office shirt with a blue lanyard and a small white ID card, stick-like legs and round white hands.',
 5: 'Zero (5 years later) is drawn exactly like the 2nd character in the Zero reference: a round white head with no hair, thin dark glasses, '
    'a light-blue short-sleeved collared shirt, stick-like legs and round white hands.',
 10: 'Zero (10 years later) is drawn exactly like the 3rd character in the Zero reference: a round white head with no hair, thin dark glasses, '
     'a navy jacket with a rust-red tie, stick-like legs and round white hands.',
 30: 'Zero (30 years later) is drawn exactly like the 4th (rightmost) character in the Zero reference: a round white head with short light-grey hair on top, '
     'brown-framed glasses, a beige button cardigan over a collared shirt, stick-like legs and round white hands; he often carries a small green folding shopping bag.',
}
YAM = ('Mr. Yamada, the elderly Japanese neighbor, is drawn exactly like the 1st (leftmost) character in the cast reference: a round white head, short light-grey hair, '
       'grey glasses, a sage-green shirt with a beige apron, stick-like legs and round white hands.')
STYLE = ('Characters: drawn exactly in the flat cartoon style of the references — round white heads, simple friendly faces, thick slightly wobbly black outlines, '
         'stick-like legs and round white hands; every person in the picture (including background people) is drawn in this same round-head style: a plain round white head, simple dot eyes, simple eyebrows and mouth, no nose, no wrinkles, no sweat drops, no realistic human faces; hair only as simple flat hair caps like in the references; keep '
         'characters small-to-medium in the frame. Background and setting: a rich, detailed storybook illustration — layered depth, painterly gouache and '
         'watercolor textures, soft natural light, gentle shadows, warm bright film-like color grading, cinematic wide composition. The mood is always bright, '
         'warm and hopeful, never dark or gloomy. Wide 16:9 frame; the illustration fills the whole frame edge to edge with no borders, frames or blank strips. '
         'The bottom fifth shows only simple ground, floor or table surface without important details (subtitles are overlaid there). Do not draw any text, '
         'letters, numbers, kanji, hangul, signs with writing, logos, watermarks or speech bubbles; signs and labels are blank shapes; phone screens are blank '
         'or softly glowing. Cars drive on the left in Japan.')
JOBS = {
 # style tests
 't1b': ([ZR], f'{Z[30]} His face stays exactly as simple as in the reference (no wrinkles). A busy, cheerful Korean home-style restaurant (baekban) in Seoul at lunchtime, spring light through the window: Zero sits alone at a '
        'small table in the center, startled and a little flustered, holding a small open wallet in one hand, looking at a smiling middle-aged restaurant auntie in an '
        'apron who is setting down MORE small side dishes (banchan) in many little bowls on his already full table — kimchi, bean sprouts, spinach, fish cake, '
        'a steaming stew pot. Around them, other customers (also round-head characters) chat and laugh at their tables; metal chopsticks and long spoons. '
        'Warm, lively, affectionate mood with a touch of comedy.'),
 't2': ([ZR, CR], f'{Z[1]} {YAM} 7 a.m. on a spring morning in a quiet Tokyo residential street: a small neat garbage collection point beside a low concrete wall '
        'with a green net folded over it; cherry blossom petals drifting. Zero (left) stands holding two stuffed semi-transparent garbage bags, completely '
        'confused, looking at a blank rule board on the wall; Mr. Yamada (right) has just walked up from his doorway and kindly reaches toward Zero\'s bag with a '
        'small blank sticker in his hand, gently smiling. Low wooden houses, potted plants, a bicycle, utility poles with wires, soft pink-and-sky-blue pastel '
        'morning light. Gentle, funny, kind mood.'),
 't3': ([ZR], f'{Z[30]} An underwater view looking UP from the bright sea floor: Zero, small in the lower-middle of the frame, wears a simple yellow old-style '
        'diving helmet with a round glass window (his round white face and glasses visible inside) and floats beside a sandy seabed, shining a flashlight upward. '
        'Above him, two huge icebergs float at the surface, seen from below: their large underwater bodies glow in turquoise and soft white, and near the seabed '
        'the bottoms of the two icebergs are joined by one shared rocky ridge covered in sea grass and small corals. Sunbeams stream down through clear turquoise '
        'water, tiny fish and bubbles. Wonder, calm, hopeful mood — bright, clear and luminous, not dark.'),
}
only = sys.argv[1:]; vx.token(); first = True
for k, (refs, prompt) in JOBS.items():
    if only and k not in only: continue
    if not first: time.sleep(15)
    first = False
    parts = [{"inlineData": {"mimeType": "image/png", "data": b64(r)}} for r in refs] + [{"text": prompt + ' ' + STYLE}]
    body = {"contents": [{"role": "user", "parts": parts}], "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    st = None
    for attempt in range(4):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, json.dumps(r, ensure_ascii=False)[:200], flush=True); time.sleep(40)
    if st != 200: continue
    imgs, _ = vx.inline_parts(r)
    if not imgs: print(k, 'no image', flush=True); continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((1920, 1080), Image.LANCZOS).save(f'ai/{k}.png'); print(k, 'ok', flush=True)
