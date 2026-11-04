"""AI key-visuals for click thumbnails (Gemini image, Zero as reference). usage: python3 gen.py key [key...]  -> ai/<key>.png"""
import base64, io, json, os, sys, time
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
ZE = ('Zero is drawn exactly like the character in the reference picture: a round white head with no hair, a simple cartoon face with thick black '
      'eyebrows, a plain orange t-shirt, stick-like arms and legs, round white hands, thick slightly wobbly black outlines. Zero has NO moustache, NO beard, NO hat, NO glasses, NO costume.')
STYLE = ('Make a high-impact, eye-catching YouTube thumbnail key visual. Zero is HUGE on the RIGHT half of the frame: his head fills about 45% of the frame height, '
         'upper body visible, with a big exaggerated, instantly readable expression. Zero keeps the flat cartoon look of the reference with thick outlines and a clean bright rim light '
         'so he pops off the background; the scene around him is a rich, saturated, cinematic illustration with dramatic lighting, strong color contrast and a little depth of field. '
         'One single clear hero prop, no clutter. The LEFT 45% of the frame must be calmer and darker (soft out-of-focus background, no important details) because a big headline will be placed there. '
         'Wide 16:9, edge to edge, no borders, no frames. Absolutely no text, letters, numbers, question marks, signs or logos anywhere; screens are blank glowing shapes.')
OTH = 'Other people are simple cartoon characters with round white heads in muted grey or navy clothes (never orange), smaller than Zero, blurred or in the background.'
JOBS = {
 'a1': ('A late-evening office, cold fluorescent light. Zero, big on the right, wears a stiff, forced, too-wide smile with a big sweat drop on his head and slightly trembling eyebrows, bowing a little. '
        'A grey colleague hand reaches in from the top-right corner and drops an enormous, towering stack of paper folders onto the arms of Zero; the stack is taller than Zero and leaning dangerously. '
        'A wall clock shape shows evening (no numbers). Muted teal and grey office with the paper stack lit bright white.'),
 'a2': ('Night office, everyone else has gone home, dark rows of empty desks. Zero, big on the right, sits at his desk with a forced polite smile and tired dark circles under his eyes, '
        'buried behind a gigantic mountain of paper folders that a grey colleague just added to. Cold blue monitor glow on his face, one warm desk lamp.'),
 'b1': ('A plain office wall at dusk. Zero, big on the right, smiles a polite, gentle closed-eye smile with both hands together, nodding "yes" - looking perfectly kind. '
        'But his huge shadow cast on the wall behind him is a completely different, furious version of him: a glowing deep red silhouette with clenched raised fists, flames rising from its head and angry glowing eyes. '
        'Strong contrast: Zero is lit in soft warm light, the shadow is blazing red and dramatic.'),
 'b2': ('Split personality visual. Zero, big on the right, has a perfect polite customer-service smile. Directly behind him and slightly larger, a translucent glowing red ghost version of Zero with gritted teeth, '
        'steam puffing from its head and fists clenched, as if his inner self is screaming. Dark navy background with red rim light.'),
 'c1': ('Zero, big on the right, has a golden angel halo above his head that is cracking and shattering into glowing golden shards. Zero looks up at it shocked, eyes wide, mouth open, a sweat drop. '
        'He wears small fluffy white sheep ears and a little patch of sheep wool on his head. Dramatic dark purple background with golden light from the halo shards.'),
 'c2': ('Zero, big on the right, stands nervously with a glowing golden angel halo above his head; a black walking cane strikes the halo from the left edge of the frame and the halo shatters into golden shards with a burst of light. '
        'Zero flinches, eyes squeezed, teeth showing. Dark deep blue background, shards and sparks glowing gold.'),
}
keys = sys.argv[1:] or list(JOBS); vx.token(); first = True
for k in keys:
    if not first: time.sleep(10)
    first = False
    body = {"contents": [{"role": "user", "parts": [{"inlineData": {"mimeType": "image/png", "data": b64('zero_ref.png')}},
            {"text": f'{ZE} {OTH} {JOBS[k]} {STYLE}'}]}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    st = None
    for attempt in range(4):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, json.dumps(r, ensure_ascii=False)[:200], flush=True); time.sleep(40)
    if st != 200: continue
    imgs, _ = vx.inline_parts(r)
    if not imgs: print(k, 'no image', flush=True); continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((1920, 1080), Image.LANCZOS).save(f'ai/{k}.png'); print(k, 'ok', flush=True)
