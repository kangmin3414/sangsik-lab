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

J = {
 'bus':    (True, f'{ZE} {REAPER} Inside a late-night city bus seen down the aisle, vertical composition. Zero sits asleep in the last row, head against the window; outside the windows the night melts into ink-black mist with a faint red glow. In the foreground the front door is open and the grim reaper strides in toward Zero, one arm reaching out, a rolled scroll under the other arm. Tense, eerie, slightly funny.'),
 'bridge': (True, f'{ZE} {REAPER} An arched stone bridge over a misty grey-green underworld river, vertical composition looking along the bridge toward a red-pillared gate with lanterns at the far end. The grim reaper walks briskly ahead, pulling Zero along by the wrist; Zero stumbles behind, alarmed. The reaper’s unrolled scroll flaps behind him like a long ribbon. Ink-swirl clouds. Sense of hurry and motion.'),
 'court1': (True, f'{ZE} {KING} {REAPER} The first underworld courtroom, vertical composition: red pillars, gold cloud screen, the king high up at the top of the frame at his desk; a tall lattice window shows a far mountain bristling with upright sword blades in ink mist. Zero, small at the bottom, stands with hands raised in protest; the grim reaper beside him reads a scroll. Vermilion and black.'),
 'court2': (True, f'{ZE} {KING} {REAPER} The second underworld courtroom, vertical: dark wooden hall lit orange from below; through a round window far away a huge black iron cauldron steams over fire (small, distant, no people in it). A different king with a white beard frowns from his high desk. Zero, small, points at himself in disbelief; the grim reaper reads a scroll.'),
 'court3': (True, f'{ZE} {KING} {REAPER} The third underworld courtroom, vertical: frost on the floor and pillars, pale blue light, icicles from the roof beams, through the window a frozen ice valley. A different king wrapped in a thick robe sits high up; Zero, small, hugs himself shivering, his breath visible; the grim reaper reads a scroll, also breathing white mist.'),
 'court4': (True, f'{ZE} {KING} {REAPER} The fourth underworld courtroom, vertical, quiet and dim, lit only by a few tall candles: a calm old king sits high up looking down. The grim reaper has stopped and holds up a scroll so long that it pours down the steps and coils across the whole floor in a huge pile; it is covered with countless identical small wavy brush marks. Zero stands small and still, head lowered. Hushed, heavy, tender.'),
 'door':   (True, f'{ZE} {REAPER} An enormous pair of red lacquered doors with gold studs in a dark hall, vertical composition, the doors just beginning to open and a thin blade of warm golden light spilling through the gap onto the floor. Zero and the grim reaper stand very small at the bottom, seen from behind, facing the doors. Solemn, awe, suspense.'),
 'mirror': (True, f'{ZE} {KING} The great hall of the fifth king, vertical: the king (larger, with a long black beard and a tall bead-strung crown) sits high at the top behind his desk; in the middle of the frame a large round bronze mirror on an ornate carved cloud-pattern stand. The mirror’s surface is NOT showing any picture: it is a swirling, rippling disc of molten golden light, beginning to glow brightly. Zero stands small at the bottom in front of it, seen from behind, flinching, one arm half raised against the glow. Vermilion, black and gold. Suspense.'),
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
    if only and k not in only: continue
    out = f'art/{k}.png'
    if os.path.exists(out) and not only: continue
    if not first: time.sleep(12)
    first = False
    parts = ([{"inlineData": {"mimeType": "image/png", "data": b64(CH)}}] if ref else []) + [{"text": prompt + ' ' + STYLE}]
    im = call(parts)
    if im is None: print(k, 'FAILED', flush=True); continue
    im.resize((1080, 1920), Image.LANCZOS).save(out); print(k, 'ok', flush=True)
