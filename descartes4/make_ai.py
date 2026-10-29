"""Story-scene illustrations for ep.007 (Descartes) with Nano Banana 2.1 on Google Cloud (billed to credits).
Frames from the published v5 animation are passed as style / character references so the pictures look like the channel.
Lines 1-5 keep the young man's face hidden (the animation reveals him as Descartes on line 6).
usage: python3 make_ai.py [key ...]   (no keys: make the missing ones)"""
import base64, io, json, os, sys, time
from PIL import Image
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'gtts'))
import vx
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
os.makedirs('ai', exist_ok=True)
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
DC = ('René Descartes is drawn exactly like the character in the character reference: a round white head, long dark-brown curly hair falling '
      'to the shoulders in thick curls, a thin dark moustache and a tiny goatee, small dark eyes, a black coat with a white collar, simple stick-like '
      'legs and round white hands.')
YOUTH = ('A young man of 23 drawn in the same style as the character reference (long dark-brown curly shoulder-length hair, black coat with white '
         'collar, stick-like legs), but seen FROM BEHIND (back view) so that his face is NOT visible at all.')
FR = ('His little daughter Francine is drawn exactly like the small girl in the reference: a round white head, light-brown hair to the shoulders '
      'with a small yellow bow, rosy cheeks, a simple pink dress, stick-like legs.')
STYLE = ('Match the drawing style of the reference images exactly: hand-drawn flat 2D cartoon, thick slightly wobbly black outlines, simple shapes, '
         'soft flat colors, gentle film-like lighting, cozy educational-documentary look. Wide 16:9 frame. The illustration fills the whole frame edge to edge, the scene continues to '
         'the very bottom edge (no blank border, no empty paper band); keep the bottom fifth simple and uncluttered (subtitles go there). Do not draw any text, letters, numbers, signs, inscriptions, maps or speech bubbles.')
C1, C2 = 'ref/char_DC.png', 'ref/char_DC_FR.png'
JOBS = {
 '01': (['ref/line01_c.png', C1], f'Europe around 1619, golden dusk. {YOUTH} He stands at a crossroads of dirt roads in the left-center, beside a '
        'wooden signpost with three blank arrow boards pointing different ways, unsure which way to go. Rolling fields, a distant small town with a '
        'church spire. The upper right half is open warm sky.'),
 '02': (['ref/line02_c.png', C1], f'{YOUTH} He stands in the left-center holding a tall stack of books, in front of a grand old stone Jesuit college '
        '(La Flèche in France) with arched windows, a bell tower and a courtyard; late afternoon. A few books lie open on a bench. Thoughtful mood. '
        'The right third is calm sky and wall.'),
 '03': (['ref/line03_c.png', C1], f'{YOUTH} Wearing a wide-brimmed hat with a feather and a travelling cloak, carrying a small bag, he walks away along a '
        'long country road in the lower-left toward the horizon: windmills and canals on one side, a distant army camp with white tents and plain '
        'flags on a hill. Fresh bright morning, a sense of adventure. The upper middle is open sky.'),
 '04': (['ref/line04_c.png', C1], f'Winter night in a small room in a German village, around 1619. {YOUTH} He sits at a wooden table in the center-right, '
        'seen from behind, chin on his hand, deep in thought beside a single candle and a few papers. On the left a big green tiled stove glows warmly; '
        'snow falls outside a small window. Quiet, cozy, contemplative. The upper left is calm dim wall.'),
 '35': (['ref/line35_c.png', C1], f'{DC} At night in his study in a Dutch town house, he sits at a wooden desk in the left third writing with a quill on '
        'manuscript pages, a candle glowing, a stack of finished pages beside him; through the window, canal houses under the moon. Calm, focused, '
        'a quiet moment of certainty. The right half is calm dark wall.'),
 '45': (['ref/line45_c.png', C2], f'{DC} {FR} A warm sunny afternoon in a cozy Dutch home: Descartes kneels down in the left-center, smiling gently, holding '
        'his little daughter\'s hands; she is laughing. A window with soft sunlight, a simple wooden floor. Tender and happy. The right third and upper '
        'area are calm warm wall.'),
 '47': (['ref/line47_c.png', C2], 'An empty small child\'s wooden chair stands in the center of a quiet room, a small yellow hair ribbon resting on its seat; '
        'through the window, autumn trees with falling orange leaves; soft, gentle afternoon light. Respectful, quiet, no people. The upper left is calm wall.'),
 '48': (['ref/line48_c.png', C1], f'{DC} At night he sits at a small wooden desk in the left third, writing a letter with a quill by a single candle; '
        'a small yellow hair ribbon lies on the desk beside the letter. His face is sad but calm and dignified. Dim, warm candlelight; the right half '
        'is a calm dark wall.'),
}
only = sys.argv[1:]
first = True
for k, (refs, prompt) in JOBS.items():
    if only and k not in only: continue
    out = f'ai/{k}.png'
    if os.path.exists(out) and not only: continue
    if not first: time.sleep(20)
    first = False
    parts = [{"inlineData": {"mimeType": "image/png", "data": b64(p)}} for p in refs] + [{"text": prompt + ' ' + STYLE}]
    body = {"contents": [{"role": "user", "parts": parts}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    for attempt in range(6):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, json.dumps(r, ensure_ascii=False)[:200], flush=True)
        time.sleep(90 + 30 * attempt)
    if st != 200: continue
    imgs, _ = vx.inline_parts(r)
    if not imgs: print(k, 'no image', flush=True); continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((1920, 1080), Image.LANCZOS).save(out)
    print(k, 'ok', flush=True)
