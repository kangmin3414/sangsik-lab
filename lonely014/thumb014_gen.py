"""Thumbnail D scenes for ep.014 (Nano Banana 2.1, billed to credits): D1 the park bench, D2 the hedgehogs in the snow.
Reference: ref/chars_crop.png = [Zero, Seojun, Schopenhauer, poodle, hedgehog]. usage: python3 thumb014_gen.py lonely1 lonely2"""
import base64, io, json, os, sys, time
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, os.path.join(os.path.dirname(HERE), 'gtts')); import vx
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
ZE = ('Zero is drawn exactly like the 1st (leftmost) character in the character reference: a round white head with no hair, a simple cartoon face '
      'with thick black eyebrows, a plain orange t-shirt, stick-like arms and legs and round white hands, thick slightly wobbly black outlines.')
HG = ('The hedgehogs are round brown hedgehogs with spiky backs and cream faces, drawn exactly like the 5th (rightmost) character in the reference.')
OTHERS = ('Any other people are tiny distant simple cartoon figures in muted clothes (never orange).')
STYLE = ('Style: a YouTube thumbnail illustration. Characters stay in the flat cartoon style of the reference; the setting is a detailed storybook '
         'illustration with painterly textures, soft atmospheric light, gentle shadows and warm film-like color grading, like a picture book. '
         'Zero is BIG in the frame: his head is about one third of the frame height, upper body visible, expression very clear and readable at a '
         'small size. Wide 16:9, edge to edge, no borders. The bottom 35% of the frame is the lower part of the scene (bench, ground, snow) with '
         'no important details because big captions will be overlaid there. Do not draw any text, letters, numbers, signs, logos or speech bubbles; '
         'screens are blank or softly glowing.')
JOBS = {
 'lonely1': (f'{ZE} {OTHERS} Early evening in a quiet Korean apartment-complex park in late autumn. Zero sits alone on a wooden park bench, slightly '
             'right of center, holding his phone loosely in his lap (screen softly glowing), looking a little to the side with a wistful, slightly '
             'lonely face — calm, but something is missing. Behind him, in the soft blue dusk, rows of tall apartment buildings with many small '
             'warm lit windows, fallen yellow leaves on the path, a single street lamp just turning on. Cool blue evening tones around Zero, warm '
             'window lights far away.'),
 'lonely2': (f'{ZE} {HG} A snowy forest clearing on a quiet winter night with soft falling snow. Zero, wearing a cozy red knitted scarf over his '
             'orange t-shirt, kneels or crouches slightly right of center, looking with a gentle, curious and warm smile at four hedgehogs on the '
             'left that sit in a loose ring at a comfortable middle distance from each other, sharing a soft warm golden glow that floats between '
             'them. Deep blue moonlit night, frosty pine trees, warm amber light on Zero\'s face from the hedgehogs\' glow. '
             'Composition: the hedgehogs sit on top of a raised snowy mound so that they are at MID-HEIGHT of the frame (their bodies between 30% and '
             '55% of the frame height from the top), large enough to read clearly; Zero is big on the right, his head in the upper half. '
             'The bottom 40% of the frame is plain smooth snow only.'),
}
keys = sys.argv[1:]; vx.token(); first = True
os.makedirs('thumb', exist_ok=True)
for k in keys:
    if not first: time.sleep(12)
    first = False
    body = {"contents": [{"role": "user", "parts": [{"inlineData": {"mimeType": "image/png", "data": b64('ref/chars_crop.png')}}, {"text": f'{JOBS[k]} {STYLE}'}]}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    st = None
    for attempt in range(4):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, json.dumps(r, ensure_ascii=False)[:200], flush=True); time.sleep(40)
    if st != 200: continue
    imgs, _ = vx.inline_parts(r)
    if not imgs: print(k, 'no image', flush=True); continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((1920, 1080), Image.LANCZOS).save(f'thumb/{k}.png'); print(k, 'ok', flush=True)
