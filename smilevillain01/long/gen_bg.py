"""사람 없는 배경 판 (test_q3 방식): 장소마다 전체용 + 흐린 클로즈업용. Nano Banana 2.1, 무료 크레딧."""
import io, os, sys, time
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
STY = ('Background plate for a 2D cartoon animation, NO people, NO characters, NO animals anywhere. Clean flat cartoon style with thick slightly wobbly black outlines and soft painterly shading, '
       'matching a simple stick-figure cartoon. Wide 16:9. Absolutely no text, letters, numbers, signs, screens with writing or logos.')
P = {
 'pantry': 'A small quiet office pantry (break room) in a modern Korean office, seen at eye level: a sink with a faucet on the left, a counter with a coffee machine, a water dispenser and a small fridge, '
           'mugs on a shelf, cool white fluorescent light with a slightly greenish office tint, a frosted glass door on the right. The floor is light grey tile that fills the bottom 22% of the frame. '
           'The middle of the frame is open floor space in front of the counter where two characters will stand.',
 'pantry_c': 'The same small office pantry, a closer view: softly out-of-focus background of the counter, the coffee machine and mugs, cool fluorescent light. '
             'Very soft and blurry like a shallow depth-of-field camera shot, so characters in front will stand out.',
 'street': 'A quiet Seoul side street at night after work, seen at eye level: wet asphalt reflecting streetlights, a convenience store glowing far away, closed shops, a bus stop shelter, '
           'deep blue night sky, lonely and a little cold. The sidewalk fills the bottom 22% of the frame; open space in the middle where one character will walk.',
 'street_c': 'The same Seoul side street at night, a closer view: blurry bokeh of streetlights and the convenience store glow, wet reflections, deep blue tones. Very soft and blurry like a shallow depth-of-field shot.',
}
vx.token()
for k in sys.argv[1:] or list(P):
    if not sys.argv[1:] and os.path.exists(f'ai/{k}.png'): continue
    body = {"contents": [{"role": "user", "parts": [{"text": P[k] + ' ' + STY}]}], "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    for a in range(8):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, str(r)[:120], flush=True); time.sleep(40 + 20 * a)
    imgs, _ = vx.inline_parts(r) if st == 200 else ([], '')
    if not imgs: print(k, 'fail', flush=True); continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((2400, 1350), Image.LANCZOS).save(f'ai/{k}.png'); print(k, 'ok', flush=True); time.sleep(8)
