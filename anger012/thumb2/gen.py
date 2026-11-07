import base64, io, os, sys, time
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
P = ('Use the FIRST reference picture for the character Zero: a round white head with no hair, a simple cartoon face with thick black eyebrows, a plain orange t-shirt, stick-like arms, round white hands, '
     'thick slightly wobbly black outlines; NO moustache, NO beard, NO hat, NO glasses. Use the SECOND reference picture for the place: the same cozy warm-lit restaurant on a rainy night, '
     'the same rain-streaked window, a small birthday cake with lit candles on a wooden table and an EMPTY chair opposite him. '
     'High-impact YouTube thumbnail, wide 16:9, edge to edge: Zero sits at the table on the RIGHT half of the frame, big and close to the camera (his head about 42% of the frame height). '
     'He grips his glowing phone tightly in one hand (the screen is a blank glowing rectangle), his face is flushed bright red with fury, eyebrows slammed down, gritted teeth, '
     'steam puffing from the top of his head, a vein mark on his forehead. The birthday cake with lit candles sits right in front of him, the empty chair is clearly visible. '
     'Strong red-orange glow around Zero against the cool blue rainy window. Keep the LEFT 42% of the frame darker and calmer (rain window, out of focus) for a headline. '
     'Absolutely no text, letters, numbers, signs or logos anywhere.')
vx.token()
for k in sys.argv[1:]:
    body = {"contents": [{"role": "user", "parts": [{"inlineData": {"mimeType": "image/png", "data": b64('zero_ref.png')}}, {"inlineData": {"mimeType": "image/png", "data": b64('scene_ref.png')}}, {"text": P}]}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    for a in range(4):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, str(r)[:150], flush=True); time.sleep(40)
    imgs, _ = vx.inline_parts(r) if st == 200 else ([], '')
    if not imgs: print(k, 'fail', flush=True); continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((1920, 1080), Image.LANCZOS).save(f'ai/angry_{k}.png'); print(k, 'ok', flush=True); time.sleep(6)
