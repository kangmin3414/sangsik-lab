import base64, io, json, os, sys, time
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
ZE = ('Zero is drawn exactly like the character in the reference picture: a round white head with no hair, a simple cartoon face with thick black eyebrows, '
      'a plain orange t-shirt, stick-like arms and legs, round white hands, thick slightly wobbly black outlines. Zero has NO moustache, NO beard, NO hat, NO glasses.')
END = (' High-impact YouTube thumbnail, wide 16:9, edge to edge, huge faces, exaggerated readable expressions, strong contrast, clean rim light so the characters pop. '
       'Absolutely no text, letters, numbers, signs or logos anywhere.')
J = {
 'split': ('A dramatic split-screen thumbnail divided by a jagged diagonal lightning crack down the middle. '
           'LEFT half, cold dark blue night: Zero as a small trembling lamb, fluffy white sheep ears and a wool tuft on his round head, a golden angel halo above, '
           'teary eyes, an anxious forced smile, sweat drop, hugging himself. '
           'RIGHT half, blazing gold and orange: the SAME Zero transformed into a huge golden lion, a giant glowing golden mane around his round white face, mouth wide open in a mighty roar, fierce eyebrows, '
           'golden sparks and wind. The lion side is bigger and closer to the camera than the lamb side.'),
 'mask': ('Close-up of Zero, big in the frame, center-right. He holds up in one hand a bright yellow cartoon smiley mask with a huge fake grin, half covering his face; '
          'the half of his real face visible behind the mask is pale, scared and teary with a trembling eyebrow and a sweat drop. '
          'Behind him, out of focus, a grey cartoon boss figure drops a towering stack of papers. Dark moody teal and navy background, a warm spotlight on the mask. Leave the left 40% darker and calmer for a headline.'),
}
keys = sys.argv[1:]; vx.token()
for n, kk in enumerate(keys):
    k, v = kk.split(':')
    if n: time.sleep(8)
    body = {"contents": [{"role": "user", "parts": [{"inlineData": {"mimeType": "image/png", "data": b64('zero_ref.png')}}, {"text": ZE + ' ' + J[k] + END}]}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    for a in range(4):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(kk, st, str(r)[:150], flush=True); time.sleep(40)
    imgs, _ = vx.inline_parts(r) if st == 200 else ([], '')
    if not imgs: print(kk, 'fail', flush=True); continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((1920, 1080), Image.LANCZOS).save(f'ai/{k}_{v}.png'); print(kk, 'ok', flush=True)
