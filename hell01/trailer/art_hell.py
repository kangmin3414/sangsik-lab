"""Hell (Buddhist) episode — style samples, 16:9. Stick-figure cast (014 reference) in a Goryeo Buddhist-painting (Siwangdo) inspired watercolor.
usage: python3 gen.py [key ...]"""
import base64, io, json, os, sys, time
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(ROOT, 'gtts'))
import vx
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); os.makedirs('art', exist_ok=True)
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
         'gory or horrifying: no blood, no torture shown up close, no suffering bodies. Tall vertical 9:16 frame filled edge to edge, no white paper border, '
         'no frame. Keep the top tenth and the bottom quarter visually simple (captions); subject in the middle. Do not draw any text, letters, Chinese characters, numbers, signs or logos; '
         'signboards and scrolls are blank or covered with illegible wavy brush marks.')


SIL = ('The damned are drawn as small dark silhouettes of simple round-headed stick figures (the flat style of the character reference, but as black or deep-red silhouettes without faces). ')
GUARD = ('Hell guards: towering ox-headed and horse-headed demon jailers (Korean ushu and madu) in dark armor with iron tridents and chains, drawn large and menacing, glowing eyes, in the same ink-and-watercolor style. ')
HELLSTYLE = ('Mood: terrifying, dramatic, epic, like a dark Goryeo-era hell painting come alive: deep blacks, blood-red and fire-orange light, heavy ink washes, '
             'smoke and swirling ink clouds, extreme scale, low dramatic angle. Fear is shown through scale, shadow, poses and atmosphere only: absolutely no blood, '
             'no gore, no wounds, no body parts, no realistic human anatomy; the sinners are faceless silhouettes. Ignore every character in the reference except '
             'its drawing style.')
J = {
 'hell_sword':   (True, SIL + GUARD + 'Dosan hell, the Mountain of Swords: a colossal mountain made entirely of countless upright sword blades rising into a blood-red storm sky split by lightning. Long lines of tiny silhouetted sinners are forced to climb the blades toward the top, driven on by a giant ox-headed guard in the foreground swinging a trident. Embers and ash fly. Vertical composition, the mountain towering over everything.'),
 'hell_cauldron':(True, SIL + GUARD + 'Hwatang hell, the Boiling Cauldrons: an immense black iron cauldron, as big as a house, boiling furiously over a roaring sea of flames; scalding steam billows up; dozens of tiny silhouetted heads and reaching arms bob in the churning surface. A giant horse-headed guard stands on the rim stirring it with an enormous iron paddle, lit orange from below. More cauldrons glow in the smoky distance. Vertical composition, low angle.'),
 'hell_ice':     (True, SIL + GUARD + 'Hanbing hell, the Frozen Hell: a vast frozen valley under a black sky in a howling blizzard; rows of tiny silhouetted sinners are trapped inside huge cracked blocks of blue ice, curled up, only their dark shapes visible; jagged ice cliffs and icicles like teeth. A huge ox-headed guard with frost on its horns drags a chain across the ice in the foreground. Cold blue-black and white, wind-whipped snow. Vertical composition.'),
 'hell_tongue':  (True, SIL + GUARD + 'Balseol hell, the Hell of Lies: a dark plain under a red-black sky where long rows of tiny silhouetted sinners kneel with their heads bowed and their hands pressed over their mouths. A colossal horse-headed guard looms over them holding giant iron tongs raised high, and behind him a black ox drags a huge iron plough across the scarred dark ground, leaving glowing red furrows. Smoke, ash and dread. Vertical composition, the guard filling the upper half.'),
}



def call(parts):
    body = {"contents": [{"role": "user", "parts": parts}], "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "9:16", "imageSize": "2K"}}}
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
    prompt = prompt + ' ' + HELLSTYLE
    if only and k not in only: continue
    out = f'art/{k}.png'
    if os.path.exists(out) and not only: continue
    if not first: time.sleep(12)
    first = False
    parts = ([{"inlineData": {"mimeType": "image/png", "data": b64(CH)}}] if ref else []) + [{"text": prompt + ' ' + STYLE}]
    im = call(parts)
    if im is None: print(k, 'FAILED', flush=True); continue
    im.resize((1080, 1920), Image.LANCZOS).save(out); print(k, 'ok', flush=True)
