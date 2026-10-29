"""Story pictures for ep.012 with Nano Banana 2.1 on Google Cloud (billed to credits). ref/chars_crop.png = [Zero, Mom, Dad, young mom + baby, Epicurus].
usage: python3 make_ai.py [key ...]"""
import base64, io, json, os, sys, time
from PIL import Image
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'gtts'))
import vx
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); os.makedirs('ai', exist_ok=True)
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
CH = 'ref/chars_crop.png'
ZE = ('Zero is drawn exactly like the 1st (leftmost) character in the character reference: a round white head with no hair, a simple face, '
      'a plain orange t-shirt, stick-like legs and round white hands.')
OMd = ('Mom is drawn exactly like the 2nd character in the character reference: a round white head, short dark-brown curly permed hair, '
       'a dusty-rose short-sleeved top, stick-like legs and round white hands.')
APd = ('Dad is drawn exactly like the 3rd (middle) character in the character reference: a round white head, short grey hair, thin dark '
       'rectangular glasses, a plain light-blue hospital gown, stick-like legs and round white hands.')
YMd = ('The young mother of 1998 is drawn exactly like the 4th character in the character reference: a round white head, long straight black '
       'hair, a yellow t-shirt; her baby is the small round-headed baby in an orange onesie from the same reference.')
EPd = ('Epicurus, the ancient Greek philosopher, is drawn exactly like the 5th (rightmost) character in the character reference: a round white '
       'head, grey-brown hair and a full grey-brown beard, a cream Greek chiton with a sage-green cloak draped over one shoulder, stick-like legs.')
STYLE = ('Characters: drawn exactly in the flat cartoon style of the character reference — round white heads, simple faces, thick slightly wobbly '
         'black outlines, stick-like legs and round white hands; keep them small-to-medium in the frame. Background and setting: a richer, more '
         'detailed storybook illustration than a flat cartoon — layered depth, painterly textures, soft atmospheric light, gentle shadows, warm '
         'film-like color grading, cinematic wide composition. Wide 16:9 frame; the illustration fills the whole frame edge to edge with no borders, '
         'frames or blank strips. The bottom fifth shows only simple ground, floor or table surface without important details (subtitles are overlaid '
         'there). Do not draw any text, letters, numbers, signs, logos, watermarks or speech bubbles; phone screens are blank or softly glowing.')
JOBS = {
 '01': f'{ZE} {OMd} Mom must have the same short, voluminous, tightly CURLY dark-brown permed hair as in the reference (not straight hair). A hospital surgery waiting area late at night: Zero (center) and Mom (just left of him) sit side by side on a row of connected '
       'plastic waiting chairs, seen from the front; Mom has fallen asleep with her head resting on Zero\'s shoulder, a small handbag on her lap; '
       'Zero is awake and sits very still so as not to wake her, looking ahead toward closed double doors on the right with a tired, worried face; '
       'a paper cup of coffee on the empty chair beside him; a dim corridor, a vending machine glowing softly in the background, pale fluorescent '
       'light, a round wall clock with no numbers. Quiet and tense yet tender mood, cool blue-grey tones with a warm vending-machine glow. '
       'No signs or text anywhere.',
 '02': f'{YMd} A tiny Korean one-room apartment at night in the late 1990s: the young mother sits on the floor at a low wooden folding table '
       '(center-left), writing in a small notebook with a pen under a small desk lamp, looking tired but gently smiling; beside her on a thin floor '
       'mattress with a flowery blanket, the baby sleeps peacefully; old-fashioned details: a boxy CRT television switched off, an old rice cooker, '
       'laundry drying on a rack; a small window shows a dark blue night sky with many small stars. Warm nostalgic sepia-toned color grading with '
       'soft lamplight; humble, loving mood.',
 '03': f'{EPd} Ancient Athens, a modest walled garden in golden late-afternoon light: Epicurus (center-left) sits on a simple stone bench at a rough '
       'wooden table under olive and fig trees, sharing a frugal meal of bread, olives, a little cheese and a clay jug of water with three friends '
       '(simple round-headed cartoon figures in plain chitons in the same character style), Epicurus smiling and talking with an open hand; '
       'vegetable beds, a low stone wall, cypress trees and distant rooftops. Peaceful, friendly, warm mood. The upper right is sky and trees.',
 '04': f'{ZE} {OMd} {APd} A hospital room at night, seen from behind the family: Dad (center) sits on the edge of a hospital bed in his light-blue '
       'gown, Mom (left) and Zero (right) sit close beside him; all three look out of a large window at a deep blue night sky full of bright stars '
       '(only stars, no lines); a small warm bedside lamp glows, two small new notebooks lie on the bed; faint city lights far below. The upper '
       'sixty percent of the frame is the window with a wide, clear starry sky. Warm, peaceful, quietly happy mood.',
 '05': f'{ZE} {OMd} {APd} A hospital room in the afternoon: Dad sits up in the hospital bed (right) in his light-blue gown, smiling gently; Mom sits on '
       'a chair beside the bed (center), holding an old, worn small notebook open in both hands and smiling warmly with a hint of nostalgia; Zero '
       '(left) stands by the bed, moved, his eyes a little teary; soft sunlight through sheer curtains, a small vase of flowers and a water bottle '
       'on the bedside table, an IV stand. Heartwarming mood. The upper area is the window and soft light.',
}
only = sys.argv[1:]
vx.token(); first = True
for k, prompt in JOBS.items():
    if only and k not in only: continue
    out = f'ai/{k}.png'
    if os.path.exists(out) and not only: continue
    if not first: time.sleep(15)
    first = False
    parts = [{"inlineData": {"mimeType": "image/png", "data": b64(CH)}}, {"text": prompt + ' ' + STYLE}]
    body = {"contents": [{"role": "user", "parts": parts}], "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    st = None
    for attempt in range(4):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, json.dumps(r, ensure_ascii=False)[:200], flush=True); time.sleep(40)
    if st != 200: continue
    imgs, _ = vx.inline_parts(r)
    if not imgs: print(k, 'no image', json.dumps(r, ensure_ascii=False)[:300], flush=True); continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((1920, 1080), Image.LANCZOS).save(out)
    print(k, 'ok', flush=True)
