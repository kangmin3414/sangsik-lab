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
