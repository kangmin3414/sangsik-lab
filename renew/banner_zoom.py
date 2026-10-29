"""Zoom-out edit of a banner scene so Zero fits the 2560x423 desktop band (y 508-931) and the 1546-wide mobile safe area.
usage: python3 banner_zoom.py key [key...] -> banner_ai/{key}_z.png"""
import base64, io, json, os, sys, time
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); SP = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(SP, 'gtts')); import vx
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
ASK = ('Zoom out this exact picture. Keep the same scene, the same painterly storybook style, the same lighting and the same character '
       'Zero (round white head, thick black eyebrows, orange t-shirt, stick limbs, thick black outlines), but show it from farther away so '
       'that Zero is about HALF of his current size. After zooming out, Zero\'s head must be centered on the horizontal middle line of the '
       'image (50% of the height), and his whole sitting body must stay between 38% and 64% of the image height, at about 66% from the left '
       'edge. Naturally extend the scene in every direction: more sky above, more ground below, more of the surroundings at the sides. '
       'The left half around the middle stays calm and simple (soft sky or plain wall) with no objects. Wide 16:9, no borders, no text, '
       'no letters, no logos.')
keys = sys.argv[1:]; vx.token()
for n, k in enumerate(keys):
    if n: time.sleep(12)
    src = os.path.join(HERE, 'banner_ai', f'{k}.png')
    tmp = os.path.join(HERE, 'banner_ai', f'_{k}_in.jpg'); Image.open(src).convert('RGB').resize((1920, 1080)).save(tmp, quality=90)
    body = {"contents": [{"role": "user", "parts": [{"inlineData": {"mimeType": "image/jpeg", "data": b64(tmp)}}, {"text": ASK}]}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    st = None
    for attempt in range(4):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, json.dumps(r, ensure_ascii=False)[:200], flush=True); time.sleep(40)
    if st != 200: continue
    imgs, _ = vx.inline_parts(r)
    if not imgs: print(k, 'no image', flush=True); continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((2560, 1440), Image.LANCZOS).save(os.path.join(HERE, 'banner_ai', f'{k}_z.png'))
    print(k, 'ok', flush=True)
