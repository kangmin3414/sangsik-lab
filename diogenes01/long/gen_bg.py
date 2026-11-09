import io, os, sys, time
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
STY = ('Background plate for a 2D cartoon animation, NO people, NO characters, NO animals anywhere. Clean flat cartoon style with thick slightly wobbly black outlines and soft painterly shading, '
       'matching a simple stick-figure cartoon. Wide 16:9. Absolutely no text, letters, numbers, signs with writing or logos.')
P = {
 'subway': "A Korean subway station underground passage seen from the side, eye level: tiled walls, a bright exit opening in the upper RIGHT corner pouring warm morning sunlight down, handrails, ceiling lights, a few blank ad panels with no writing. The center and bottom of the frame are EMPTY wall and floor space (a staircase will be drawn later). The floor fills the bottom 20%. Busy cool morning palette with warm light from the exit.",
 'subway2': "A Korean subway station underground passage seen from the side at eye level: pale blue tiled wall, ceiling pipes and fluorescent lights, two blank ad panels with no writing on the LEFT half. In the upper RIGHT corner of the wall there is a big bright exit opening to the street, pouring warm morning sunlight. There are NO stairs, NO steps, NO handrails, NO escalator anywhere in the picture: the whole lower half and the right side of the wall below the exit are EMPTY plain tiles (a staircase will be drawn later). The floor is only a thin strip at the very bottom. Cool morning palette with warm light from the exit.",
 'corinth': "The sunny outskirts of an ancient Greek city (Corinth) in the 4th century BC, eye level: a dusty open ground with a low stone wall, tall dark cypress trees, olive trees, distant white temple columns on a hill, a bright warm sun in the upper RIGHT sky casting soft shadows to the left. The LEFT and CENTER foreground is EMPTY dusty ground (people and a jar will be drawn later). The ground fills the bottom 26%. Warm golden ancient Mediterranean palette.",
 'fount': "An ancient Greek public fountain house in a small sunny square, eye level: a stone basin on the RIGHT with water pouring from a carved spout, stone columns, potted plants, a dusty paved ground, blue sky. The LEFT and CENTER foreground is EMPTY paved ground. The ground fills the bottom 24%. Warm bright ancient Mediterranean palette.",
 'street': "A busy street of an ancient Greek market town (agora) in the afternoon, eye level: market stalls with cloth awnings and clay pots, stone buildings, a stone wall, olive trees, warm sunlight from the upper right. The CENTER foreground is EMPTY dusty ground. The ground fills the bottom 26%. Warm golden palette.",
}
vx.token()
for k in sys.argv[1:] or list(P):
    body = {"contents": [{"role": "user", "parts": [{"text": P[k] + ' ' + STY}]}], "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    for a in range(5):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, str(r)[:120], flush=True); time.sleep(40)
    imgs, _ = vx.inline_parts(r) if st == 200 else ([], '')
    if not imgs: print(k, 'fail', flush=True); continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((2400, 1350), Image.LANCZOS).save(f'ai/{k}.png'); print(k, 'ok', flush=True); time.sleep(6)
