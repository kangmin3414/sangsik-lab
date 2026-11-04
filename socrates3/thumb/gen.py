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
 'meet': ('A dim corporate meeting room. Zero, big on the right side of the frame (head about 40% of frame height), raises one hand high, nervous but brave, a big sweat drop, eyebrows up, mouth slightly open as if asking. '
          'A bright spotlight falls only on him. Around the long table, grey cartoon colleagues with round heads have all turned toward him at once, frozen with wide shocked eyes; '
          'the boss by a blank glowing whiteboard freezes mid-gesture with a marker. Cold teal room, warm spotlight on Zero. Keep the left 40% of the frame darker and calm for a headline.'),
 'scroll': ('Zero, big on the right side of the frame, holds open an ancient parchment scroll that glows with brilliant golden light from inside (the scroll surface is blank, no writing), '
            'the light illuminates his face from below, his eyes wide in awe, mouth open. Behind him ancient Greek marble columns at a deep purple dusk, floating dust sparkles. Keep the left 40% darker and calm for a headline.'),
 'crown': ('A bright modern office. Zero, big on the right, raises one hand to ask a question with a slightly embarrassed smile and sweat drop, and a shining golden crown appears floating just above his head with sparkles. '
           'Grey cartoon colleagues around him look at him with admiring sparkly eyes, one gives a thumbs up. Warm saturated light. Keep the left 40% calmer for a headline.'),
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
