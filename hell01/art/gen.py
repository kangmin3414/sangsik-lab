"""Hell (Buddhist) episode — style samples, 16:9. Stick-figure cast (014 reference) in a Goryeo Buddhist-painting (Siwangdo) inspired watercolor.
usage: python3 gen.py [key ...]"""
import base64, io, json, os, sys, time
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(ROOT, 'gtts'))
import vx
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); os.makedirs('png', exist_ok=True)
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
CH = os.path.join(ROOT, 'lonely014/ref/chars_crop.png')
ZE = ('Zero is drawn exactly like the 1st (leftmost) character in the character reference: a round white head with no hair, a simple face, '
      'stick-like legs and round white hands, wearing a plain orange hoodie and dark grey trousers. Ignore the other characters in the reference.')
REAPER = ('The grim reaper (Korean jeoseungsaja) is a simple figure in the same flat round-headed cartoon style: a pale round white face with a calm, '
          'polite, businesslike expression, a tall black wide-brimmed traditional Korean gat hat and a long black traditional robe.')
KING = ('The underworld king is a figure in the same flat round-headed cartoon style but larger, seated behind a high red lacquered judge\'s desk on '
        'a raised platform: a round white face with a stern but not frightening expression and a long black beard, wearing a red and black '
        'Korean-Chinese royal official robe with wide sleeves and a flat-topped royal crown with hanging bead strings, holding a writing brush.')
STYLE = ('Characters: flat cartoon style of the character reference — round white heads, simple faces, thick slightly wobbly black outlines, '
         'stick-like limbs, round white hands; small-to-medium in the frame. Setting and background: a hand-painted watercolor storybook '
         'illustration inspired by Korean Goryeo and early Joseon Buddhist paintings of the Ten Kings of the underworld — vermilion red, ink black, '
         'muted gold and mineral green, soft ink washes, clouds drawn as curling ink swirls, paper grain. Mysterious and solemn but gentle, never '
         'gory or horrifying: no blood, no torture shown up close, no suffering bodies. Wide 16:9 frame filled edge to edge, no white paper border, '
         'no frame. Keep the bottom fifth visually simple (subtitles). Do not draw any text, letters, Chinese characters, numbers, signs or logos; '
         'signboards and scrolls are blank or covered with illegible wavy brush marks.')
J = {
 '01_bus':    (True, f'{ZE} {REAPER} Inside a late-night city bus, almost empty. Zero sits asleep in the very last row, head leaning on the window. '
               'Outside the window, the night street dissolves into dark ink-wash mist and a faint red glow. At the open front door of the bus, the '
               'grim reaper is just stepping in, bowing slightly and holding a rolled-up scroll, looking toward Zero. Cool blue bus lights mixed '
               'with ink-black and a hint of vermilion. Eerie, quiet, slightly funny.'),
 '02_gate':   (True, f'{ZE} {REAPER} A misty riverbank in the underworld at dusk: a grand traditional Korean government-office gate with red pillars '
               'and a tiled roof stands on the far side of a stone bridge, soft red lanterns glowing. Zero, looking small and confused, stands on '
               'the bridge next to the grim reaper, who unrolls a very long scroll (a schedule) that trails down to the ground. Ink-swirl clouds, '
               'calm grey-green river. Solemn, curious, gentle.'),
 '03_court':  (True, f'{ZE} {KING} {REAPER} The first underworld courtroom: red lacquered pillars, a folding screen with gold clouds behind the '
               'king, a large lattice window on one side through which, far away and small, a mountain bristling with upright sword blades rises '
               'out of ink mist. Zero stands small in front of the high desk, looking up nervously; the grim reaper stands to the side reading from '
               'an unrolled scroll. Vermilion, black, gold. Solemn but slightly comic.'),
 '04_jijang': (True, f'{ZE} A misty road between underworld courts at night. Far away, among dim red glows of distant hell fires seen only as soft '
               'light in the fog, a Buddhist monk (bodhisattva) walks calmly: a figure in the same flat round-headed style with a shaved round head, '
               'a gentle serene face, a simple grey-brown monk\'s robe with a red kasaya draped over one shoulder, holding a tall ringed monk\'s '
               'staff in one hand and a glowing pearl in the other, a soft golden halo behind his head. In the foreground, Zero stands small, seen '
               'from behind, watching him. Peaceful, warm amid darkness, reverent.'),
 '05_mirror': (True, f'{ZE} {KING} The great hall of the fifth king: in front of the king\'s high desk stands a large round bronze mirror on an '
               'ornate carved wooden stand with cloud patterns (the karma mirror). Inside the mirror glows a warm, softly painted scene: on a rainy '
               'city street, Zero hands an umbrella to a small student and runs off the other way in the rain. Zero stands before the mirror, seen '
               'from a three-quarter back view, looking at it in surprise. The king leans forward slightly, brush lowered. Warm golden light from '
               'the mirror against the vermilion-and-black hall. Moving, gentle.'),
 '06_stop':   (True, f'{ZE} A real city bus terminal stop late at night after rain: wet asphalt reflecting street lamps, an empty bus with its '
               'lights on parked behind. Zero bends down to pick up an empty drink can from the pavement near a trash bin; nobody else is around. '
               'Above, the clouds part slightly and a few stars show. Soft navy and warm lamp light. Quiet, gentle, hopeful.'),
}


def call(parts):
    body = {"contents": [{"role": "user", "parts": parts}], "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    for attempt in range(6):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200:
            imgs, _ = vx.inline_parts(r)
            if imgs: return Image.open(io.BytesIO(imgs[-1][1])).convert('RGB')
            print('no image', json.dumps(r, ensure_ascii=False)[:200], flush=True)
        else:
            print(st, json.dumps(r, ensure_ascii=False)[:160], flush=True)
        time.sleep(40)


only = sys.argv[1:]; vx.token(); first = True
for k, (ref, prompt) in J.items():
    if only and k not in only: continue
    out = f'png/{k}.png'
    if os.path.exists(out) and not only: continue
    if not first: time.sleep(12)
    first = False
    parts = ([{"inlineData": {"mimeType": "image/png", "data": b64(CH)}}] if ref else []) + [{"text": prompt + ' ' + STYLE}]
    im = call(parts)
    if im is None: print(k, 'FAILED', flush=True); continue
    im.resize((1920, 1080), Image.LANCZOS).save(out); print(k, 'ok', flush=True)
