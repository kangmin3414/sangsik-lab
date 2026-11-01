"""Shorts 01 vertical (9:16) watercolor art. Nano Banana 2.1 via gtts/vx.py.  usage: python3 art.py [key ...]
'building_lit' is an edit of 'building_dark' (same layout, lights turned on)."""
import base64, io, json, os, sys, time
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(ROOT, 'gtts'))
import vx
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); os.makedirs('art', exist_ok=True)
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
CH = os.path.join(ROOT, 'lonely014/ref/chars_crop.png')
ZE = ('Zero is drawn exactly like the 1st (leftmost) character in the character reference: a round white head with no hair, a simple face, '
      'stick-like legs and round white hands. Here he wears a plain orange hoodie and dark grey trousers. Ignore all the other characters in the reference.')
OTHER = ('The person is NOT Zero: a different simple cartoon figure in the same flat style as the reference (round white head, simple face, '
         'thick wobbly black outlines, stick-like limbs, round white hands) but with {look}. No orange clothes. Ignore the characters in the reference '
         'except for their drawing style.')
STYLE = ('Characters: flat cartoon style of the character reference — round white heads, simple faces, thick slightly wobbly black outlines, '
         'stick-like limbs, round white hands. Background: a soft hand-painted watercolor and gouache storybook illustration — visible paper grain, '
         'gentle bleeding edges, layered transparent washes, quiet muted palette of deep navy blue shadows and warm amber lamp light. Tall vertical '
         '9:16 frame; the painting fills the whole frame edge to edge with no white paper border, no frame, no blank strips. Keep the top tenth and '
         'the bottom quarter visually simple (dark wall, floor or sky) because captions go there; put the subject in the middle. Do not draw any text, '
         'letters, numbers, signs, logos, watermarks or speech bubbles; screens are blank and softly glowing.')
J = {
 'corridor': (True, f'{ZE} The narrow corridor of an ordinary Korean apartment building late at night, seen from slightly above and behind. Zero stands '
              'still in the middle of the frame in front of a plain grey steel front door with a digital door-lock keypad, a backpack on one shoulder, one '
              'hand raised toward the keypad but not pressing it, shoulders slightly slumped. A small round motion-sensor ceiling light right above him '
              'casts one soft warm cone of light over him; the rest of the corridor fades into deep navy darkness. Quiet, tired, tender mood.'),
 'envelope': (True, f'{ZE} The same apartment corridor in almost complete darkness (the ceiling light is off), deep navy-black. Zero stands in the middle, '
              'seen from the front at a slight angle, holding a plain white letter envelope with both hands at chest height, looking down at it; only the '
              'envelope catches a faint warm glow, softly lighting his hands and the lower part of his round face. Quiet, hopeful, tender.'),
 'building_dark': (False, 'No people. A tall vertical view of the front facade of an ordinary Korean apartment building at night, seen straight on: a '
              'regular grid of many identical windows with small balconies and air-conditioner units, about 6 columns and 9 floors visible. ALL windows '
              'are completely dark, no light anywhere in the building. Deep navy night sky with a few faint stars at the top, a few dark trees at the '
              'bottom. Calm, quiet, lonely.'),
 'room1':    (True, OTHER.format(look='short black hair and a plain grey hoodie') + ' Inside a tiny Korean one-room studio at night: the person lies '
              'curled up under a thick blanket on a thin mattress on the floor, eyes half closed, looking unwell. On the floor right beside the '
              'mattress: a small white convenience-store medicine bag, a plastic water bottle and a box of tissues. A small desk lamp gives weak warm '
              'light; the rest of the small room is dim navy. Lonely but tender mood.'),
 'room2':    (True, OTHER.format(look='messy short black hair and a navy sweatshirt') + ' A small desk in a cramped room at night: the young person sits in '
              'front of an open laptop whose blank screen glows softly on their round face, one hand on the touchpad, shoulders slumped, a little tired '
              'but still going. On the desk: a stack of printed papers, a few sticky notes on the wall, a paper cup of instant coffee. Quiet, tender mood.'),
 'room3':    (True, OTHER.format(look='short greying hair, a beige cardigan and an apron') + ' A Korean apartment kitchen and dining area in the evening, '
              'seen from behind the middle-aged person: they stand alone at the dining table stacking used dishes and wiping the table. Behind, in the '
              'living room, two family members sit on the sofa each looking down at their own phone, faces lit blue by the screens, nobody looking at '
              'the kitchen. Warm yellow kitchen light, cool blue living room. Quiet, slightly lonely mood.'),
 'room4':    (True, OTHER.format(look='short white permed hair, round reading glasses and a knitted vest') + ' A small old-fashioned Korean living room '
              'at night: the elderly person sits on a floor cushion holding a large smartphone close to their face with both hands, looking at the '
              'screen carefully. On a low cabinet beside them: a framed family photo of smiling grown-up children and a small child; a television in '
              'the corner gives a soft flickering glow. Quiet, tender, a little lonely.'),
 'zeroroom': (True, f'{ZE} A small Korean one-room apartment at night, vertical composition: Zero sits at a simple wooden desk under a small desk lamp, '
              'seen from the side and slightly behind, folding a hand-written letter; a plain envelope, an eraser with a little heap of eraser crumbs and '
              'a pencil on the desk. Warm orange lamp light around the desk, the rest of the room in soft navy shadow, a window with distant lit '
              'apartment windows. Quiet, tender mood.'),
}
EDIT = ('Edit this image. Keep EVERYTHING exactly the same — the same building, the same windows in the same positions, the same sky, trees, colors '
        'and painting style — and only turn on warm yellow interior light in about 14 of the windows, scattered over different floors and columns, '
        'including at least one window on the lowest floor near the center. Lit windows glow softly from inside with warm curtains; all other '
        'windows stay dark. Do not add any people, text or new objects.')


def call(parts, ar='9:16'):
    body = {"contents": [{"role": "user", "parts": parts}], "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": ar, "imageSize": "2K"}}}
    for attempt in range(5):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200:
            imgs, _ = vx.inline_parts(r)
            if imgs: return Image.open(io.BytesIO(imgs[-1][1])).convert('RGB')
            print('no image', json.dumps(r, ensure_ascii=False)[:200], flush=True)
        else:
            print(st, json.dumps(r, ensure_ascii=False)[:200], flush=True)
        time.sleep(40)


only = sys.argv[1:]
vx.token(); first = True
keys = list(J) + ['building_lit']
for k in keys:
    if only and k not in only: continue
    out = f'art/{k}.png'
    if os.path.exists(out) and not only: continue
    if not first: time.sleep(12)
    first = False
    if k == 'building_lit':
        parts = [{"inlineData": {"mimeType": "image/png", "data": b64('art/building_dark.png')}}, {"text": EDIT}]
    else:
        ref, prompt = J[k]
        parts = ([{"inlineData": {"mimeType": "image/png", "data": b64(CH)}}] if ref else []) + [{"text": prompt + ' ' + STYLE}]
    im = call(parts)
    if im is None: print(k, 'FAILED', flush=True); continue
    if k == 'building_lit':                       # keep the exact canvas of the dark plate
        im = im.resize(Image.open('art/building_dark.png').size, Image.LANCZOS)
    else:
        im = im.resize((1080, 1920), Image.LANCZOS)
    im.save(out); print(k, 'ok', flush=True)
