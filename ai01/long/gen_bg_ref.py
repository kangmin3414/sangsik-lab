"""참조 그림(같은 방)을 넣어 배경 판을 다시 만든다: python3 gen_bg_ref.py morning"""
import base64, io, os, sys, time
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
def b64(p):
    im = Image.open(p).convert('RGB').resize((1200, 675)); bio = io.BytesIO(); im.save(bio, 'PNG'); return base64.b64encode(bio.getvalue()).decode()
J = {'morning': ('ai/night.png', "This is the exact same small studio apartment as in the reference image, same camera angle, same wardrobe on the left, same window in the center-left, same door, same coat hook and shelf on the right. "
                 "Now it is 7 am: the room is bright, soft golden morning sunlight streams through the window with gentle light beams and dust, warm cream walls, the city outside in morning haze. Keep the floor area EMPTY. NO people, NO characters. "
                 "Same flat cartoon style with thick slightly wobbly black outlines. Absolutely no text, letters, numbers or logos.")}
vx.token()
for k in sys.argv[1:]:
    ref, prompt = J[k]
    body = {"contents": [{"role": "user", "parts": [{"inlineData": {"mimeType": "image/png", "data": b64(ref)}}, {"text": prompt}]}], "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    for a in range(5):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, str(r)[:120], flush=True); time.sleep(40)
    imgs, _ = vx.inline_parts(r) if st == 200 else ([], '')
    if not imgs: print(k, 'fail'); continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((2400, 1350), Image.LANCZOS).save(f'ai/{k}.png'); print(k, 'ok', flush=True)
