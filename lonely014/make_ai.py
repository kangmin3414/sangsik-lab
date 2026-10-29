"""Story pictures for ep.014 with Nano Banana 2.1 (billed to credits). ref/chars_crop.png = [Zero, Seojun, Schopenhauer, poodle, hedgehog].
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
SJd = ('Seojun is drawn exactly like the 2nd character in the character reference: a round white head, short black hair, a navy jacket, '
       'stick-like legs and round white hands.')
SCd = ('Schopenhauer is drawn exactly like the 3rd (middle) character in the character reference: a round white head with a bald crown and two big '
       'fluffy white tufts of hair sticking out at both temples, no beard, a dark frock coat with a white collar and a white cravat, stick-like '
       'legs and round white hands.')
PDd = 'His dog is the fluffy white poodle with pompom puffs, drawn exactly like the 4th character in the character reference.'
HGd = ('The animals are round brown hedgehogs with spiky backs and cream faces, drawn exactly like the 5th (rightmost) character in the character '
       'reference.')
OTH = ('Any other people are simple round-headed cartoon figures in the same style, in muted grey, brown or navy clothes (never orange), '
       'smaller or partly out of focus.')
STYLE = ('Characters: drawn exactly in the flat cartoon style of the character reference — round white heads, simple faces, thick slightly wobbly '
         'black outlines, stick-like legs and round white hands; keep them small-to-medium in the frame. Background and setting: a richer, more '
         'detailed storybook illustration than a flat cartoon — layered depth, painterly textures, soft atmospheric light, gentle shadows, warm '
         'film-like color grading, cinematic wide composition. Wide 16:9 frame; the illustration fills the whole frame edge to edge with no borders, '
         'frames or blank strips. The bottom fifth shows only simple ground, floor or table surface without important details (subtitles are overlaid '
         'there). Do not draw any text, letters, numbers, signs, logos, watermarks or speech bubbles; phone screens are blank or softly glowing.')
JOBS = {
 '01': f'{SCd} {OTH} Berlin, about 1820: a huge old university lecture hall with steep rows of dark wooden benches rising toward the back, '
       'almost completely empty. Schopenhauer (right of center) stands at a wooden lectern on the small stage, still lecturing with one hand raised, '
       'proud but a little lonely. Only five students sit far apart in the vast benches, two of them yawning. Tall arched windows let in cool '
       'grey morning light and dust floats in the beams. Quiet, slightly comic and lonely mood, muted blue-grey and brown tones.',
 '02': f'{HGd} A snowy forest clearing on a cold winter night under a big moon: a group of seven hedgehogs. On the left, three of them are '
       'pressed tightly together, wincing as their spikes poke each other; on the right, four of them sit in a loose ring at a gentle middle '
       'distance from each other, close enough to share a soft warm golden glow that hangs in the air between them, calm and content. Snow '
       'falls softly, frosty pine trees, blue moonlight with warm amber light around the ring. Tender, fable-like mood. No people.',
 '03': f'{SCd} {PDd} {OTH} Frankfurt am Main in the 1850s, a crisp autumn morning: Schopenhauer, now old, walks briskly along a tree-lined '
       'riverside path with his white poodle trotting beside him, his hands behind his back, a calm, content face. Across the wide river: the '
       'old town with steep roofs, an old stone bridge and a tall red sandstone cathedral tower in soft morning haze. Fallen golden leaves on '
       'the path. Peaceful, solitary but warm mood.',
 '04': f'{SCd} {OTH} A small rented room at night in 1831: Schopenhauer, middle-aged, sits alone at a wooden writing desk by a single candle, '
       'writing a letter with a quill pen on a sheet of paper, his head slightly bowed, a hesitant, tender expression; piles of unsold books '
       'tied with string stacked in the corner, a medicine bottle on the desk, a small window with a pale moon. Warm candlelight against deep blue '
       'shadows. Quiet, lonely but hopeful mood.',
 '05': f'{ZE} {SJd} A modern Korean riverside park at golden-hour sunset: Zero (left) and Seojun (right) walk side by side along the river path, '
       'both laughing, Seojun playfully nudging Zero with his shoulder. Behind them a wide river glitters, a long city bridge and distant '
       'apartment towers glow in warm orange and pink light, a few cyclists far away, autumn trees. Heartwarming, reunited mood.',
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
