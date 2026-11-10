"""새 주인공 후보 콘셉트 시트(운영자 2026-11-11 "아예 캐릭터를 바꾸자"). python3 gen.py human:1 hog:1 ..."""
import io, os, sys, time
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
COMMON = ('Original character design sheet for a Korean YouTube animation channel about the everyday feelings of modern adults. '
          'Flat 2D vector cartoon, thick slightly wobbly black outlines, simple shapes, flat colors with soft shading, cute and expressive, '
          'designed to be easy to animate as a 2D cut-out puppet (separate round head, simple body, simple arms and legs). '
          'Show the SAME character five times in one row, full body, same size, evenly spaced, on a plain soft cream background: '
          '1 neutral front view, 2 happy laughing, 3 tired and sad, 4 angry, 5 shocked and surprised. '
          'Absolutely no text, letters, numbers, labels or logos anywhere. Must not resemble any existing famous character or mascot.')
J = {
 'human': 'The character: a 31-year-old ordinary Korean office worker drawn in chibi proportions (about 2.5 heads tall), a round face, messy black hair with one stubborn cowlick, '
          'sleepy half-moon eyes, small mouth, slightly tired dark circles, an oversized heather-grey hoodie over a white shirt collar, a blank lanyard ID card, dark trousers, white sneakers.',
 'hog':   'The character: a small round adult hedgehog office worker, standing upright, a warm cream face and belly, soft brown quills on the head and back, tiny round ears, a little black nose, '
          'a loosened navy necktie and a blank lanyard ID card. The quills show its mood: lying flat and soft when calm or happy, standing straight up and spiky when angry, drooping when sad, '
          'bursting outward when shocked. Brown and cream colors only (not blue), no shoes, no gloves.',
 'mochi': 'The character: a soft white rice-cake (mochi) blob person with tiny stubby arms and tiny feet, simple black dot eyes and a small mouth, light pink cheeks, '
          'a tiny green sprout on top of its head. Its whole body squashes and stretches with its mood: plump and bouncy when happy, melting flat like a puddle when sad, '
          'puffed up round and red-tinted when angry, stretched tall and thin when shocked. Wears a small blank lanyard ID card.',
 'capy':  'The character: an adult capybara office worker standing upright, a chunky rounded rectangle body, warm brown fur, small ears, small calm eyes, '
          'a big gentle nose, wearing a loose light-blue office shirt with rolled-up sleeves and a blank lanyard ID card. It always tries to look calm and fine, so even its happy, sad, angry and shocked '
          'expressions stay small and deadpan on the face, while its body language (slumping shoulders, clenched fists, sweat drops, shaking) shows the real feeling.',
}
vx.token()
for n, kk in enumerate(sys.argv[1:]):
    k, v = kk.split(':')
    if n: time.sleep(6)
    body = {"contents": [{"role": "user", "parts": [{"text": COMMON + ' ' + J[k]}]}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    st, r = 0, None
    for a in range(4):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(kk, st, str(r)[:150], flush=True); time.sleep(40)
    imgs, _ = vx.inline_parts(r) if st == 200 else ([], '')
    if not imgs: print(kk, 'fail', flush=True); continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((1920, 1080), Image.LANCZOS).save(f'ai/{k}_{v}.png'); print(kk, 'ok', flush=True)
