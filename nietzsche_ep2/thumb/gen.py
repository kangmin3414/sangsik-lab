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
 'envy': ('Zero, big on the right half of the frame (head about 42% of frame height), holds his phone up and smiles a huge, stiff, obviously FAKE smile with twitching eyebrows and a big sweat drop, '
          'while his face is turning slightly green with jealousy and a swirling dark green cloud twists out of his stomach area. '
          'Behind him, softly out of focus on the left-center, a grey cartoon friend with a round head celebrates under falling confetti holding a shiny golden trophy. '
          'Night bedroom lit by the phone. Strong contrast between the warm confetti glow and the sickly green swirl. Keep the left 40% of the frame darker and calmer for a headline.'),
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
