"""Story-scene illustrations for ep.005 (Nietzsche) with Nano Banana 2.1 on Google Cloud (billed to credits).
Frames from the published animation are passed as style / character references so the pictures look like the channel."""
import base64, io, json, os, sys
from PIL import Image
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'gtts'))
import vx
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
os.makedirs('ai', exist_ok=True)
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
NZ = ('Nietzsche is drawn exactly like the character in the first reference image: a round white head, thick dark-brown swept hair, '
      'a big walrus moustache, small dark eyes, dark coat with white collar, simple stick-like legs.')
STYLE = ('Match the drawing style of the reference images exactly: hand-drawn flat 2D cartoon, thick slightly wobbly black outlines, simple shapes, '
         'soft flat colors, gentle film-like lighting, cozy educational-documentary look. Wide 16:9 frame. Keep the bottom fifth of the frame calm and '
         'uncluttered (subtitles go there). Do not draw any text, letters, numbers, signs or speech bubbles.')
JOBS = {
 '01': (['ref/line01_c.png'], f'Year 1884-ish Europe. {NZ} He stands thoughtfully in the left third of the frame in front of tall bookshelves in a warm, '
        'old study lit by a window; the right half of the frame is open warm wall space.'),
 '02': (['ref/line01_c.png'], f'{NZ} A young professor (age 24) giving a lecture in an old University of Basel lecture hall with wooden benches and an arched window, '
        'placed in the left third; he presses one hand to his temple because of a headache, squinting. The right half is the calm back wall of the hall.'),
 '03': (['ref/line03_c.png'], f'{NZ} At dusk he stands in the left third holding a notebook, beside an old cracked stone tablet that is crumbling; '
        'a faint new dawn light glows on the horizon. Contemplative, not dark. The upper right area is open sky.'),
 '09': (['ref/line09_c.png', 'ref/line01_c.png'], f'{NZ} He walks along a winding mountain path in the Swiss Alps near a turquoise lake (Sils-Maria), small in the lower-left, '
        'holding a little notebook. Big snowy peaks, pine trees, bright clear morning. The upper middle is open sky.'),
 '10': (['ref/line10_c.png', 'ref/line01_c.png'], f'{NZ} He sits on a large rock beside the turquoise lake of Sils-Maria writing ideas into a small notebook, placed in the left-center; '
        'a little wooden house of the village and mountains behind. Peaceful afternoon. The right side is open lake and sky.'),
 '21': (['ref/line21_c.png', 'ref/line01_c.png'], f'{NZ} Late at night during a thunderstorm, he writes at a wooden desk by a single candle, placed low in the center; '
        'rain and a flash of lightning in the window behind him. Determined despite pain. The upper half is dark stormy sky through a wide window.'),
 '28': (['ref/line28_c.png'], 'Night in a small bedroom lit by moonlight. The round-headed white character from the reference (Zero, orange shirt, wearing a fake big moustache) '
        'lies awake in bed in the left half while a small cute purple imp with tiny horns and bat wings, holding an hourglass, floats near his ear whispering. '
        'Mysterious but gentle, not scary. The upper right area is calm night sky through the window.'),
 '38': (['ref/line38_c.png', 'ref/line01_c.png'], f'{NZ} Alone at a small desk in a bare rented room at night, placed in the left-center, a short neat stack of about forty thin books '
        'beside him, a single candle and a moonlit window. Lonely, quiet, dignified. The upper right is a dim empty wall.'),
 '39': (['ref/line01_c.png'], f'{NZ} Winter dusk in a grand Italian piazza in Turin with long stone arcades and gas lamps; he sits alone on stone steps in the left third, '
        'tired and frail, wrapped in a coat. Respectful, melancholic, no drama. The upper right is soft evening sky.'),
}
only = sys.argv[1:]
for k, (refs, prompt) in JOBS.items():
    if only and k not in only: continue
    out = f'ai/{k}.png'
    if os.path.exists(out) and not only: continue
    parts = [{"inlineData": {"mimeType": "image/png", "data": b64(p)}} for p in refs] + [{"text": prompt + ' ' + STYLE}]
    body = {"contents": [{"role": "user", "parts": parts}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    st, r = vx.generate('gemini-nano-banana-2.1', body)
    if st != 200: print(k, st, json.dumps(r, ensure_ascii=False)[:300]); continue
    imgs, _ = vx.inline_parts(r)
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((1920, 1080), Image.LANCZOS).save(out)
    print(k, 'ok', flush=True)
