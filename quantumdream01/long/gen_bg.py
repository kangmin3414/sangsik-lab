import io, os, sys, time
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
STY = ('Background plate for a 2D cartoon animation, NO people, NO characters, NO animals anywhere. Clean flat cartoon style with thick slightly wobbly black outlines and soft painterly shading, '
       'matching a simple stick-figure cartoon. Wide 16:9. Absolutely no text, letters, numbers, signs with writing, posters with writing or logos.')
P = {
 'vessel': "The inside of a giant human blood vessel imagined as a cartoon highway tunnel, eye level: a long glossy red-pink tube curving away into the distance, soft wet-looking walls with gentle highlights and faint branching capillaries, warm red and coral palette with soft glowing light coming from far ahead, a few soft blurry floating particles. The CENTER is an EMPTY open lane (characters will be drawn later). The lower 22% is the curved floor of the tube. Cute, friendly, slightly magical, not gory, no blood splatter, no organs.",
 'stadium': "A huge empty football (soccer) stadium in the daytime seen from the stands at a high angle: the full green grass pitch with white field lines, empty colorful seats all around, a clear blue sky. No players, no people, no crowd, no scoreboard writing. Calm, bright, wide palette.",
}
vx.token()
for k in sys.argv[1:] or list(P):
    if os.path.exists(f'ai/{k}.png') and k not in sys.argv[1:]: continue
    body = {"contents": [{"role": "user", "parts": [{"text": P[k] + ' ' + STY}]}], "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    for a in range(5):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, str(r)[:120], flush=True); time.sleep(40)
    imgs, _ = vx.inline_parts(r) if st == 200 else ([], '')
    if not imgs: print(k, 'fail', flush=True); continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((2400, 1350), Image.LANCZOS).save(f'ai/{k}.png'); print(k, 'ok', flush=True); time.sleep(6)
