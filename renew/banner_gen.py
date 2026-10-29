"""Channel banner scenes in thumbnail-D style (Nano Banana 2.1, Zero reference).
usage: python3 banner_gen.py key [key...]  -> banner_ai/{key}.png (2560x1440)"""
import base64, io, json, os, sys, time
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); SP = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(SP, 'gtts')); import vx
REF = os.path.join(SP, 'thumbD', 'zero_ref.png')
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
ZE = ('Zero is drawn exactly like the character in the reference picture: a round white head with no hair, a simple cartoon face with thick '
      'black eyebrows, a plain orange t-shirt, stick-like arms and legs and round white hands, thick slightly wobbly black outlines.')
STYLE = ('Style: Zero stays in the flat cartoon style of the reference; the setting is a detailed storybook illustration with painterly '
         'textures, soft atmospheric light, gentle shadows and warm film-like color grading, like a picture book. '
         'This is a wide YouTube channel banner. LAYOUT IS CRITICAL: everything important must sit inside one horizontal strip across the '
         'vertical middle of the picture, between 36% and 64% of the image height. Zero is small and his head and upper body sit inside that middle strip. The LEFT half of the middle strip is calm, simple '
         'background (soft sky, plain wall or gentle light) with no objects and no details, because a two-line title will be placed there. '
         'The top and bottom parts of the picture just continue the scene softly with nothing important. Wide 16:9, edge to edge, no borders. '
         'Do not draw any text, letters, numbers, signs, logos or speech bubbles.')
JOBS = {
 'hillw': ('A vast, wide establishing shot of a quiet grassy hill at golden hour, seen from far away. Zero is SMALL in this big landscape: '
           'his whole sitting body is only about one fifth of the image height. He sits under a big old tree at about 65% from the left '
           'edge, with an open book on his knees, looking toward the wide sky with a peaceful, hopeful smile; his head is exactly at the '
           'vertical middle of the picture. The tree trunk and the grass around him are also at the middle height; the tree crown fills the '
           'top right. Huge open sky on the left fading from warm gold near the horizon to soft blue above, a few tiny birds, a winding path '
           'far away. Warm, calm, hopeful mood.'),
 'windoww': ('A wide view of a whole cozy small study room in the evening, seen from the far side of the room. Zero is SMALL in the picture: '
             'his whole sitting body is only about one fifth of the image height. He sits at a wooden desk by a big window at about 65% '
             'from the left edge, reading an open old book with a calm, curious smile; his head is exactly at the vertical middle of the '
             'picture. The window shows a deep blue evening sky with the first stars and a soft sunset glow. Warm desk lamp, a mug of tea, '
             'bookshelves on the right wall, a soft rug on the floor. The left part of the room is a calm, softly lit plain wall.'),
 'window': ('Evening in a cozy small room. A big window shows a deep blue evening sky with the first few stars and a soft warm sunset glow '
            'near the horizon. Zero sits at a wooden desk by the window, reading an open old book with a calm, curious, gentle smile, a warm '
            'desk lamp and a mug of tea beside him, a small stack of old books. Warm lamp light on Zero, cool blue sky outside.'),
 'hill': ('Golden hour on a quiet grassy hill. A huge old tree on the right side; Zero sits on the grass under it with an open book on his '
          'knees, looking up and out toward the wide sky with a peaceful, hopeful smile. The sky fades from warm gold near the horizon to soft '
          'blue above, a few birds far away, a winding path leading down the hill. Warm, calm, hopeful mood.'),
}
keys = sys.argv[1:]; vx.token(); os.makedirs(os.path.join(HERE, 'banner_ai'), exist_ok=True)
for n, k in enumerate(keys):
    if n: time.sleep(12)
    body = {"contents": [{"role": "user", "parts": [{"inlineData": {"mimeType": "image/png", "data": b64(REF)}},
            {"text": f'{ZE} {JOBS[k]} {STYLE}'}]}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    st = None
    for attempt in range(4):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, json.dumps(r, ensure_ascii=False)[:200], flush=True); time.sleep(40)
    if st != 200: continue
    imgs, _ = vx.inline_parts(r)
    if not imgs: print(k, 'no image', flush=True); continue
    im = Image.open(io.BytesIO(imgs[-1][1])).convert('RGB'); print(k, 'raw', im.size, flush=True)
    im.resize((2560, 1440), Image.LANCZOS).save(os.path.join(HERE, 'banner_ai', f'{k}.png')); print(k, 'ok', flush=True)
