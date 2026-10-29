"""Story pictures for ep.012 with Nano Banana 2.1 on Google Cloud (billed to credits). ref/chars_crop.png = [Zero, Doyun, Seneca].
usage: python3 make_ai.py [key ...]"""
import base64, io, json, os, sys, time
from PIL import Image
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'gtts'))
import vx
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); os.makedirs('ai', exist_ok=True)
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
CH = 'ref/chars_crop.png'
ZE = ('Zero is drawn exactly like the 1st (left) character in the character reference: a round white head with no hair, a simple face, '
      'a plain orange t-shirt, stick-like legs and round white hands.')
DYd = ('Doyun is drawn exactly like the 2nd (middle) character in the character reference: a round white head, short black hair, a simple face, '
       'a plain blue t-shirt, stick-like legs and round white hands.')
SEd = ('Seneca, the Roman philosopher, is drawn exactly like the 3rd (right) character in the character reference: a round white head, short grey '
       'hair and a full short grey beard, a white Roman toga with a red stripe across it, stick-like legs and round white hands.')
STYLE = ('Characters: drawn exactly in the flat cartoon style of the character reference — round white heads, simple faces, thick slightly wobbly '
         'black outlines, stick-like legs and round white hands; keep them small-to-medium in the frame. Background and setting: a richer, more '
         'detailed storybook illustration than a flat cartoon — layered depth, painterly textures, soft atmospheric light, gentle shadows, warm '
         'film-like color grading, cinematic wide composition. Wide 16:9 frame; the illustration fills the whole frame edge to edge with no borders, '
         'frames or blank strips. The bottom fifth shows only simple ground, floor or table surface without important details (subtitles are overlaid '
         'there). Do not draw any text, letters, numbers, signs, logos, watermarks or speech bubbles; phone screens are blank or softly glowing.')
JOBS = {
 '01': f'{ZE} A cozy small Korean restaurant on a Friday evening: Zero sits alone at a table for two by a big window (center-left), looking down '
       'sadly at his smartphone lying on the table; in front of him a small round birthday cake with a few lit candles; the chair across from him '
       'is empty, a folded napkin and an unused glass set for the friend who has not come; warm pendant lights, a few other diners blurred in the '
       'background, a rainy night street with soft bokeh lights outside the window. Lonely but gentle mood. The upper area is the warm wall and window.',
 '02': f'{SEd} Ancient Rome, a quiet study at night lit by a small bronze oil lamp: Seneca sits at a wooden desk (center-left) writing a letter on '
       'a papyrus scroll with a reed pen, calm and thoughtful; shelves of rolled scrolls, a small marble bust, an open window showing Roman '
       'rooftops and cypress trees under a deep blue starry night sky. Wise and serene, warm lamp light against cool night tones. The upper right '
       'is the window and night sky.',
 '03': f'{DYd} A quiet hospital emergency-room corridor late at night: Doyun sits alone on a row of plastic chairs along the wall (center-right), '
       'hunched over, looking down at his glowing smartphone with an exhausted, worried face; a backpack on the chair beside him with a small '
       'wrapped gift box with a ribbon peeking out of it; pale fluorescent ceiling lights, a closed swinging door to the treatment area, an empty '
       'wheelchair at the far end. Cold blue-green tones, lonely and tense. No signs or text anywhere.',
 '04': f'{ZE} {DYd} A sunny autumn afternoon in a small garden in front of a hospital: Zero (left) and Doyun (right) sit side by side on a '
       'wooden bench, seen from the front; Doyun holds out a small wrapped gift box with a red ribbon toward Zero with both hands, smiling shyly; '
       'Zero looks at the gift, touched, his eyes a little teary; golden ginkgo trees, fallen yellow leaves on the path, soft warm light, a few '
       'pigeons. Heartwarming and gentle. The upper area is soft sky and trees.',
}
only = sys.argv[1:]
vx.token(); first = True
for k, prompt in JOBS.items():
    if only and k not in only: continue
    out = f'ai/{k}.png'
    if os.path.exists(out) and not only: continue
    if not first: time.sleep(15)
    first = False
    parts = [{"inlineData": {"mimeType": "image/png", "data": b64(CH)}}, {"text": prompt + ' ' + STYLE}]
    body = {"contents": [{"role": "user", "parts": parts}], "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    st = None
    for attempt in range(4):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, json.dumps(r, ensure_ascii=False)[:200], flush=True); time.sleep(40)
    if st != 200: continue
    imgs, _ = vx.inline_parts(r)
    if not imgs: print(k, 'no image', json.dumps(r, ensure_ascii=False)[:300], flush=True); continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((1920, 1080), Image.LANCZOS).save(out)
    print(k, 'ok', flush=True)
