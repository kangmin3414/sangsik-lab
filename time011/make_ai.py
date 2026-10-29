"""Story pictures for ep.011 with Nano Banana 2.1 on Google Cloud (billed to credits). ref/chars.png = [Zero, Grandpa, Siffre].
usage: python3 make_ai.py [key ...]"""
import base64, io, json, os, sys, time
from PIL import Image
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'gtts'))
import vx
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); os.makedirs('ai', exist_ok=True)
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
CH = 'ref/chars.png'
ZE = ('Zero is drawn exactly like the 1st (left) character in the character reference: a round white head with no hair, rosy cheeks, a simple '
      'smiling face, a plain orange t-shirt, stick-like legs and round white hands.')
GP = ('Grandpa is drawn exactly like the 2nd (middle) character in the character reference: a round white head, short white hair, a bushy white '
      'moustache, a warm brown cardigan over a white shirt collar, stick-like legs and round white hands; gentle and kind.')
SF = ('Michel Siffre, a 23-year-old French cave explorer, is drawn like the 3rd (right) character in the character reference: a round white head, '
      'short dark-brown hair, a blue-grey wool sweater, stick-like legs and round white hands; he wears a yellow caving helmet with a small headlamp.')
STYLE = ('Characters: drawn exactly in the flat cartoon style of the character reference — round white heads, simple faces, thick slightly wobbly '
         'black outlines, stick-like legs and round white hands; keep them small-to-medium in the frame. Background and setting: a richer, more '
         'detailed storybook illustration than a flat cartoon — layered depth, painterly textures, soft atmospheric light, gentle shadows, warm '
         'film-like color grading, cinematic wide composition. Wide 16:9 frame; the illustration fills the whole frame edge to edge with no borders, '
         'frames or blank strips. The bottom fifth shows only simple ground or floor without important details (subtitles are overlaid there). Do not '
         'draw any text, letters, numbers, signs, clocks with numbers, logos, watermarks or speech bubbles.')
JOBS = {
 '05': f'{SF} Summer 1962 in the French Alps: the young explorer stands at the dark mouth of a deep limestone cave on a rocky mountain slope '
       '(left-center), about to climb down a rope ladder into the darkness; a few teammates and coils of rope and wooden supply crates near the '
       'entrance; green alpine meadows, snowy peaks and bright blue sky behind. Sense of adventure and mystery. The upper right is open sky.',
 '06': f'{SF} Deep inside an icy glacier cave 130 meters underground: he sits alone on a camp stool beside a small red tent pitched on rocks '
       'and ice (center-left), lit only by his headlamp and a small lantern; a field telephone with a cable running up into the dark, notebooks, '
       'a sleeping bag; frosty walls, stalactites and deep darkness around; no clocks anywhere. Quiet, lonely, mysterious, cold blue tones with a '
       'warm lantern glow. The upper area is dark cave ceiling.',
 '08': f'{SF} He climbs out of the cave entrance into bright late-summer daylight (center), squinting and shielding his eyes with one hand, '
       'pale and amazed, looking surprised; two teammates welcome him and one holds up a calendar page (blank, no text); the alpine meadow '
       'already turning slightly golden. The upper right is open sky.',
 '14': f'{ZE} A tall open steel tower about 30 meters high at an amusement park (right third, full height of the frame) with a big safety net '
       'stretched below it; a cartoon person (round white head, blue t-shirt) is falling backwards in mid-air from the top toward the net, '
       'arms and legs spread, surprised; Zero stands on the ground at the left watching with his mouth open. Blue sky, a few clouds, park trees. '
       'Exciting but safe, friendly.',
 '37': f'A sunny holiday resort hotel on a tropical beach: palm trees, white sand, turquoise sea, a pool and loungers; several tiny cartoon '
       'guests (round white heads, colorful swimwear and hats) relax on loungers, walk on the beach and play in the water, small in the frame; '
       'bright, cheerful, summery. The upper area is open blue sky.',
 '40': f'{ZE} {GP} A quiet old-fashioned neighborhood street in Korea on a calm Saturday afternoon: Zero (right) holds Grandpa\'s hand (left) '
       'as they walk toward the door of a small, old, cozy family photo studio with a large shop window showing framed family portraits (no '
       'text on the sign); autumn ginkgo trees with yellow leaves, warm low sun. Gentle and heartwarming. The upper area is soft sky and trees.',
 '41': f'{ZE} {GP} Inside a small cozy old photo studio: Grandpa sits on a wooden chair (center-left) and Zero stands right beside him with '
       'a hand on his shoulder, both smiling toward the camera; in front of them (right edge) an old photographer behind a big camera on a '
       'tripod and a softbox light; a plain warm grey backdrop, a few framed family portraits on the side wall. Warm, tender, nostalgic light.',
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
