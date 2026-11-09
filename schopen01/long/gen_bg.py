import io, os, sys, time
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
STY = ('Background plate for a 2D cartoon animation, NO people, NO characters, NO animals anywhere. Clean flat cartoon style with thick slightly wobbly black outlines and soft painterly shading, '
       'matching a simple stick-figure cartoon. Wide 16:9. Absolutely no text, letters, numbers, signs with writing, posters with writing or logos.')
P = {
 'street': 'A quiet Korean residential alley on a fresh morning after rain, eye level: low apartment buildings and small shops with blank signboards, a few potted plants, wet asphalt with shiny reflective puddles in the middle ground, soft blue-sky morning light. The ground fills the bottom 22%. The center foreground is open space. Fresh bright palette.',
 'genkan': 'The entrance hallway (genkan) of a small Korean apartment seen from inside, eye level: a plain front door with a peephole on the left side, beige wallpaper, a light switch, a small round mirror, a tiled entry floor one step lower than the wooden floor. The center and right side of the wall are EMPTY with no furniture and no shoes. The floor fills the bottom 22%. Warm evening indoor light.',
 'study19': 'A cozy 1850s German scholar\'s study in Frankfurt, eye level: dark wooden bookshelves full of old leather books, a tall window with curtains and soft afternoon light, a writing desk with an inkwell and quill on the far left, a small bust on a shelf, an old rug. The center of the room is open floor. The floor fills the bottom 22%. Warm sepia-tinted palette.',
 'clocktower': 'The inside of a huge old clock tower, eye level: giant brass gears and cogs on the back wall, wooden beams, a big round clock face window glowing from behind with soft golden light, dusty warm atmosphere. The center of the image is a large EMPTY open space (for a giant pendulum to be drawn later). Wooden floor fills the bottom 18%. Warm amber and teal palette.',
 'beach': 'A wide sunny beach at midday, eye level: calm blue sea with gentle waves on the horizon, bright sky with a few puffy clouds, smooth pale sand that fills the bottom 30%. Nothing on the sand. Bright, slightly too hot summer palette.',
 'lecture': 'An empty 1820s German university lecture hall, eye level: tiered wooden benches rising toward the back, a wooden lecturer\'s desk and a blackboard at the front left, tall arched windows with pale daylight, plaster walls. NO people. The floor fills the bottom 20%. Muted parchment palette.',
 'frankfurt': 'A riverside street in 1850s Frankfurt, eye level: old half-timbered houses, a cobblestone promenade along a river, a few trees, gas street lamps, soft afternoon light. The cobblestone ground fills the bottom 22%. The center foreground is open space. NO people. Warm sepia-tinted palette.',
 'river': 'A Korean city riverside park at golden-hour sunset (like the Han River), eye level: a wide calm river reflecting orange and pink sky, a long bridge and distant city skyline on the far bank, a paved walking path and grass in the foreground. The ground fills the bottom 22%. The center foreground is open space. NO people, NO benches. Warm dreamy sunset palette.',
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
