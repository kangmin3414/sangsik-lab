import base64, io, json, os, sys, time
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
P = {
 'a': ('A wide panoramic YouTube channel banner background, whimsical hand-drawn cartoon world with thick slightly wobbly black outlines and rich painterly color. '
       'A magical little world at golden dusk: on the far left a sunlit desert with a tiny camel carrying a tall stack of papers and a small golden lion on a dune; '
       'on the far right a cozy city with a warm-lit office window, a giant gnarled ancient tree on a green hill, and a foggy crossroads with signposts. '
       'A starry violet-blue sky fading to warm orange near the horizon, floating paper sheets and tiny glowing stars drifting across. '
       'The whole CENTER of the image (the middle 60% width and middle 40% height) must be calm open sky with a soft glow and no objects, because a big title and a character will be placed there. '
       'No people, no characters, absolutely no text, letters, numbers, signs or logos anywhere.'),
 'b': ('A wide panoramic YouTube channel banner background in a cozy cartoon picture-book style with thick black outlines. A night city skyline and rolling hills under a huge deep blue-violet sky full of soft stars, '
       'with a warm orange sunset glow along the horizon. Along the far left and far right edges small story vignettes: a desert with a camel carrying papers, a golden lion on a rock, a big old tree, a lamp-lit window, a crescent moon, floating paper airplanes. '
       'The entire center area (middle 60% width, middle 45% height) is empty soft gradient sky with a gentle radial glow, completely free of objects. '
       'No people, no characters, absolutely no text, letters, numbers, signs or logos anywhere.'),
}
vx.token()
for n, k in enumerate(sys.argv[1:] or list(P)):
    if n: time.sleep(8)
    body = {"contents": [{"role": "user", "parts": [{"text": P[k]}]}], "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "4K"}}}
    for a in range(4):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, str(r)[:200], flush=True); time.sleep(40)
        if st == 400 and a == 0: body['generationConfig']['imageConfig']['imageSize'] = '2K'
    imgs, _ = vx.inline_parts(r) if st == 200 else ([], '')
    if not imgs: print(k, 'fail', flush=True); continue
    im = Image.open(io.BytesIO(imgs[-1][1])).convert('RGB'); print(k, im.size, flush=True)
    im.resize((2560, 1440), Image.LANCZOS).save(f'ai/bg_{k}.png'); print(k, 'ok', flush=True)
