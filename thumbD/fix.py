"""Edit pass: make Zero's head pure white in scenes where warm grading turned it cream; plus the compilation scene.
usage: python3 fix.py key..."""
import base64, io, json, os, sys, time
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, os.path.join(os.path.dirname(HERE), 'gtts')); import vx
exec(open('gen.py').read().split("keys = sys.argv")[0].split("JOBS = {")[0])     # ZE, STYLE
OTHERS = ('Any other people are simple cartoon characters with round white heads in muted grey, navy or beige clothes (never orange), '
          'smaller than Zero or partly out of focus.')
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
EDIT = ('Edit this picture. Keep everything exactly the same — composition, characters, poses, expressions, background, lighting — '
        'except one thing: every round cartoon head (especially the big main character in the orange t-shirt) must be pure clean bright white, '
        'like white paper, with only a soft light-grey shade on one side. Remove any cream, beige, yellow or orange tint from the heads and '
        'faces. Do not add any text.')
COMP = ('Night in a cozy Korean living room. Zero sits sunk deep in a soft armchair under a thick blanket, slightly right of center and big '
        'in the frame, holding a warm mug, smiling peacefully with relaxed half-closed eyes, completely at ease. Beside him on a small side '
        'table lies a stack of four old books with plain colored spines (teal, blue, green, purple) and a softly glowing reading lamp. Rain '
        'streaks on the dark window behind him, warm lamplight inside. Zero\'s head is pure bright white like paper.')
keys = sys.argv[1:]; vx.token(); first = True
for k in keys:
    if not first: time.sleep(12)
    first = False
    if k == 'compile':
        parts = [{"inlineData": {"mimeType": "image/png", "data": b64('zero_ref.png')}}, {"text": f'{ZE} {COMP} {STYLE}'}]
        out = 'ai/compile.png'
    else:
        src = f'ai/{k}.png'
        im = Image.open(src).convert('RGB').resize((1376, 774)); buf = io.BytesIO(); im.save(buf, 'PNG')
        parts = [{"inlineData": {"mimeType": "image/png", "data": base64.b64encode(buf.getvalue()).decode()}}, {"text": EDIT}]
        out = f'ai/{k}.png'
        if not os.path.exists(f'ai/{k}_cream.png'): os.rename(src, f'ai/{k}_cream.png')
    body = {"contents": [{"role": "user", "parts": parts}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    st = None
    for attempt in range(4):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, json.dumps(r, ensure_ascii=False)[:160], flush=True); time.sleep(40)
    imgs, _ = vx.inline_parts(r) if st == 200 else ([], None)
    if not imgs:
        print(k, 'failed', flush=True)
        if k != 'compile' and not os.path.exists(out): os.rename(f'ai/{k}_cream.png', out)
        continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((1920, 1080), Image.LANCZOS).save(out); print(k, 'ok', flush=True)
