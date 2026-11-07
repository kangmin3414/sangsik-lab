"""AI illustrations for the long-form (Gemini image, Zero as reference). usage: python3 gen_ai.py key [key...] -> ai/<key>.png"""
import base64, io, json, os, sys, time
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
ZE = ('Zero is drawn exactly like the character in the reference picture: a round white head with no hair, a simple cartoon face with thick black eyebrows, '
      'a plain orange t-shirt, stick-like arms and legs, round white hands, thick slightly wobbly black outlines. Zero has NO moustache, NO beard, NO hat, NO glasses.')
STYLE = ('A cinematic illustration frame for an animated YouTube documentary, wide 16:9, edge to edge. Zero keeps the flat cartoon look of the reference with thick outlines; '
         'the world around him is a rich painterly illustration with dramatic lighting and strong color contrast. Keep the lower 18% of the frame simple and darker (subtitles go there). '
         'Absolutely no text, letters, numbers, signs or logos anywhere.')
JOBS = {
 'room': ('A dark messy small Korean studio bedroom at night, lit only by the cold blue glow of a phone. On the floor half-opened cardboard delivery boxes with tape still on (plain brown, no logos), '
          'a brand-new pair of bright running shoes still in its box, a foam roller, a tablet still in its plastic wrap, a thick unopened exam book and a set of colorful highlighters. '
          'On the bed Zero lies on his back like a lazy potato, wearing a stretched-out loose t-shirt, holding his phone right above his face with both hands, his face lit blue, half-lidded bored eyes. '
          'Funny, relatable, cozy-chaotic, a little gloomy. Zero is in the right-center of the frame.'),
}
keys = sys.argv[1:] or list(JOBS); vx.token()
for n, k in enumerate(keys):
    if n: time.sleep(8)
    body = {"contents": [{"role": "user", "parts": [{"inlineData": {"mimeType": "image/png", "data": b64('zero_ref.png')}}, {"text": f'{ZE} {JOBS[k]} {STYLE}'}]}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    for attempt in range(4):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, json.dumps(r, ensure_ascii=False)[:200], flush=True); time.sleep(40)
    imgs, _ = vx.inline_parts(r) if st == 200 else ([], '')
    if not imgs: print(k, 'fail', flush=True); continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((1920, 1080), Image.LANCZOS).save(f'ai/{k}.png'); print(k, 'ok', flush=True)
