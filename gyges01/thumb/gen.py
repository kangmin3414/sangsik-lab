"""기게스의 반지 편 썸네일 그림(Nano Banana 2.1, 무료 크레딧). usage: python3 gen.py ghost_1 ghost_2 ring_1 ring_2"""
import base64, io, os, sys, time
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
Z = ('Use the FIRST reference picture for the character Zero: a round white head with no hair, a simple cartoon face with thick black eyebrows, stick-like arms and legs, round white hands, '
     'thick slightly wobbly black outlines; in this story he wears an ORANGE HOODIE with white drawstrings and a front pocket. NO moustache, NO beard, NO hat, NO glasses. '
     'Use the SECOND reference picture for the place: the same narrow Korean alley at night in the rain, the warm street lamp, wet shiny asphalt with puddles. ')
J = {
 'ghost': Z + 'High-impact YouTube thumbnail, wide 16:9, edge to edge: Zero stands on the RIGHT half of the frame, big and close (his head about 42% of the frame height). '
          'His whole body has turned HALF-TRANSPARENT like glass, pale blue and see-through with a faint glowing blue outline — we can see the rainy alley through his body. '
          'He is in total shock: eyes wide open as tiny dots, mouth a small round "o", sweat drops flying, both hands raised in front of his face as he stares at them. '
          'A dark navy umbrella floats in the air above him all by itself (no hand holding it). On one raised finger, a small gold ring with a red stone glows. '
          'Keep the LEFT 42% of the frame darker and calmer (rain, the dark alley, out of focus) for a headline. Absolutely no text, letters, numbers, signs or logos anywhere.',
 'ring':  Z + 'High-impact YouTube thumbnail, wide 16:9, edge to edge: on the RIGHT half, a huge close-up of Zero\'s round white hand held up to the camera with one finger raised, '
          'an old gold ring with a big red stone on it, glowing and sparkling; behind the hand, Zero\'s face (big, slightly out of focus) peeks with a nervous, tempted half-smile and one raised eyebrow, '
          'and the lower half of his body is fading into transparent pale blue as if disappearing. Rain falls, the street lamp makes a warm rim light. '
          'Keep the LEFT 42% of the frame darker and calmer (the dark rainy alley, out of focus) for a headline. Absolutely no text, letters, numbers, signs or logos anywhere.',
}
vx.token()
for k in sys.argv[1:]:
    key = k.split('_')[0]
    body = {"contents": [{"role": "user", "parts": [{"inlineData": {"mimeType": "image/png", "data": b64('zero_ref.png')}}, {"inlineData": {"mimeType": "image/png", "data": b64('scene_ref.png')}}, {"text": J[key]}]}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    for a in range(6):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, str(r)[:150], flush=True); time.sleep(40)
    imgs, _ = vx.inline_parts(r) if st == 200 else ([], '')
    if not imgs: print(k, 'fail', flush=True); continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((1920, 1080), Image.LANCZOS).save(f'ai/{k}.png'); print(k, 'ok', flush=True); time.sleep(6)
print('done', flush=True)
