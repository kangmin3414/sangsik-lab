import io, os, sys, time
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
STY = ('Background plate for a 2D cartoon animation, NO people, NO characters, NO animals anywhere. Clean flat cartoon style with thick slightly wobbly black outlines and soft painterly shading, '
       'matching a simple stick-figure cartoon. Wide 16:9. Absolutely no text, letters, numbers, signs, screens with writing or logos.')
P = {
 'wide': 'A small modern Korean office at sunset, seen at eye level: a row of light wooden desks with monitors (blank glowing screens), office chairs, a potted plant, a big window on the right with an orange-pink sunset over the city, '
         'warm golden light streaming across the floor. The floor is a flat grey-blue carpet that fills the bottom 22% of the frame. The middle of the frame is open floor space where characters will stand.',
 'close': 'The same small modern Korean office at sunset, a closer view: softly out-of-focus background of desks, a monitor glow and the big window with an orange-pink sunset on the right, warm bokeh lights. '
          'Very soft and blurry like a shallow depth-of-field camera shot, so characters in front will stand out.',
}
vx.token()
for k in sys.argv[1:] or list(P):
    body = {"contents": [{"role": "user", "parts": [{"text": P[k] + ' ' + STY}]}], "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    for a in range(4):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, str(r)[:120], flush=True); time.sleep(40)
    imgs, _ = vx.inline_parts(r) if st == 200 else ([], '')
    if not imgs: print(k, 'fail', flush=True); continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((2400, 1350), Image.LANCZOS).save(f'ai/{k}.png'); print(k, 'ok', flush=True); time.sleep(6)
