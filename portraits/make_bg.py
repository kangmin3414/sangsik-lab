"""Thumbnail backgrounds (scene of each philosopher's famous episode, no people) with Nano Banana 2.1 on Google Cloud.
Style references: frames of the channel's own animation."""
import base64, io, json, os, sys, time
from PIL import Image
SP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(SP, 'gtts')); import vx
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
REFS = [os.path.join(SP, 'nietzsche3', 'ref', 'line09_c.png'), os.path.join(SP, 'gtts', 'img', 'ref_style.png')]
STYLE = ('Match the drawing style of the reference images: hand-drawn flat 2D cartoon, thick slightly wobbly black outlines, simple shapes, soft colors, '
         'cinematic lighting. This is a YouTube thumbnail BACKGROUND: no people or characters at all, no text or letters. Keep the left 40% and the right 45% '
         'of the frame calm and low-detail (a framed portrait and big title text will be placed there); put the most atmospheric detail softly in the middle and edges. '
         'Rich but slightly dark tones so white and yellow text stays readable. Wide 16:9.')
JOBS = {
 'nietzsche': 'A winding path high in the Swiss Alps above a turquoise lake (Sils-Maria) at dramatic golden hour, storm clouds breaking open with light rays.',
 'stoic': 'A Roman army camp at dawn on the Danube frontier: a large leather command tent glowing with lamplight, misty river, sunrise behind distant hills.',
 'descartes': 'A small wooden room in a 1619 German village at night, warmed by a big green tiled stove glowing orange, snow falling outside the window, a candle and books on a desk.',
 'zhuangzi': 'An ancient Chinese river in soft morning mist with a small fishing boat and a bamboo fishing rod, white butterflies, a distant ornate palace on the far bank.',
 'socrates': 'The ancient Athens agora at sunset with marble columns and stoas, the Acropolis and Parthenon on the hill in warm light.',
 'buddha': 'An ornate Indian palace gate at night under a big moon, a path leading out toward a forest, the silhouette of a great bodhi tree on the horizon.',
}
only = sys.argv[1:]
for k, prompt in JOBS.items():
    if (only and k not in only) or os.path.exists(f'aibg/{k}.png'): continue
    parts = [{"inlineData": {"mimeType": "image/png", "data": b64(p)}} for p in REFS] + [{"text": prompt + ' ' + STYLE}]
    body = {"contents": [{"role": "user", "parts": parts}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    for attempt in range(6):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        time.sleep(40)
    if st != 200: print(k, st, json.dumps(r, ensure_ascii=False)[:200]); continue
    imgs, _ = vx.inline_parts(r)
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((2560, 1440), Image.LANCZOS).save(f'aibg/{k}.png')
    print(k, 'ok', flush=True); time.sleep(15)
