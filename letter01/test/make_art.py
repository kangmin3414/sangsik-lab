"""Letter ep.1 style test: stick-figure Zero (014 reference) in soft watercolor storybook backgrounds.
Nano Banana 2.1 via gtts/vx.py (project credits).  usage: python3 make_art.py [key ...]"""
import base64, io, json, os, sys, time
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(ROOT, 'gtts'))
import vx
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); os.makedirs('art', exist_ok=True)
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
CH = os.path.join(ROOT, 'lonely014/ref/chars_crop.png')
ZE = ('Zero is drawn exactly like the 1st (leftmost) character in the character reference: a round white head with no hair, a simple face, '
      'stick-like legs and round white hands. Here he wears a plain orange hoodie (the same orange as his t-shirt in the reference) and dark '
      'grey trousers. Ignore all the other characters in the reference.')
STYLE = ('Characters: drawn exactly in the flat cartoon style of the character reference — round white heads, simple faces, thick slightly wobbly '
         'black outlines, stick-like legs and round white hands; keep them small-to-medium in the frame. Background and setting: a soft '
         'hand-painted watercolor and gouache storybook illustration — visible paper grain, gentle bleeding edges, layered transparent washes, '
         'soft atmospheric light, a quiet muted palette of deep navy blue shadows and warm amber lamp light, cinematic wide composition. Wide 16:9 '
         'frame; the illustration fills the whole frame edge to edge with no borders, frames or blank strips. The bottom fifth shows only simple '
         'floor, ground or table surface without important details (subtitles are overlaid there). Do not draw any text, letters, numbers, signs, '
         'logos, watermarks or speech bubbles; screens and keypads are blank or softly glowing.')
JOBS = {
 'corridor': f'{ZE} The narrow outdoor-style corridor of an ordinary Korean apartment building late at night. Zero stands still in front of a '
             'plain grey steel apartment front door with a digital door-lock keypad, seen from a three-quarter back angle, a backpack on one '
             'shoulder, one hand raised toward the keypad but not touching it, shoulders slightly slumped. A small round motion-sensor ceiling '
             'light right above him casts a single soft warm cone of light over him; the rest of the long corridor fades into deep navy darkness, '
             'other identical doors receding into the dark. Quiet, tired, tender mood.',
 'desk':     f'{ZE} A small Korean one-room apartment at night. Zero sits at a simple wooden desk under a small desk lamp, seen from the side and '
             'slightly behind, bent over a sheet of letter paper with a pencil in his hand. On the desk: an eraser with a little heap of eraser '
             'crumbs, a glass of water, a faint round water ring on the corner of the paper, a plain envelope. Warm orange lamp light pools '
             'around the desk; the rest of the room sinks into soft navy shadow; a window shows distant lit apartment windows. Quiet, tender mood.',
 'shoes':    'No people. A low close view at floor level of the small entryway of a Korean apartment at night: a pair of worn white sneakers taken '
             'off and left slightly askew on the tiled entry floor, just below the raised wooden floor step; seen from behind so both heels face the '
             'viewer, and the outer heel of the sole is clearly worn down at a slant, more on one shoe than the other, the laces loose. No '
             'people, no characters, no animals, no toys anywhere. Soft warm light spills from the room beyond, deep navy shadows around. A still life, quiet '
             'and tender.',
 'windows':  'A wide night view of the facade of a tall Korean apartment building: a grid of many windows, most of them dark, about a dozen lit with '
             'warm yellow light. Inside the lit windows, tiny simple figures in the same flat round-headed cartoon style as the reference do '
             'ordinary late-evening things: washing dishes, a parent fallen asleep beside a small child, someone still at a laptop, someone '
             'putting a pot of ramen on the stove. Deep navy sky with a few faint stars. Quiet, gentle, lonely-but-together mood.',
}
only = sys.argv[1:]
vx.token(); first = True
for k, prompt in JOBS.items():
    if only and k not in only: continue
    out = f'art/{k}.png'
    if os.path.exists(out) and not only: continue
    if not first: time.sleep(15)
    first = False
    noref = prompt.startswith('No people')   # still lifes: no character reference, or it pastes the cast in
    parts = ([] if noref else [{"inlineData": {"mimeType": "image/png", "data": b64(CH)}}]) + [{"text": prompt + ' ' + STYLE}]
    body = {"contents": [{"role": "user", "parts": parts}], "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    st = None
    for attempt in range(5):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, json.dumps(r, ensure_ascii=False)[:200], flush=True); time.sleep(40)
    if st != 200: continue
    imgs, _ = vx.inline_parts(r)
    if not imgs: print(k, 'no image', json.dumps(r, ensure_ascii=False)[:300], flush=True); continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((1920, 1080), Image.LANCZOS).save(out)
    print(k, 'ok', flush=True)
