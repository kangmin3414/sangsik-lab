import io, os, sys, time
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
STY = ('Background plate for a 2D cartoon animation, NO people, NO characters, NO animals anywhere. Clean flat cartoon style with thick slightly wobbly black outlines and soft painterly shading, '
       'matching a simple stick-figure cartoon. Wide 16:9. Absolutely no text, letters, numbers, signs with writing, posters with writing or logos.')
P = {
 'bedn': 'A small Korean studio apartment bedroom before dawn, eye level: dark blue window with the faint first light, a small nightstand on the right with a glowing phone-shaped light, plain walls, a light wooden floor filling the bottom 22%. The center is open floor space (no bed, no furniture in the center). Deep blue pre-dawn palette.',
 'shower': 'A small clean bathroom, eye level: white and mint square tiles on the wall, a chrome shower head on the wall at the upper center, a shower curtain rod, a small shelf with bottles on the right. Tiled floor fills the bottom 22%. The center is open space. Cool fresh palette.',
 'subway': 'Inside a Seoul subway car in the morning, eye level: rows of empty seats along the back wall, hanging hand straps, poles, windows showing a blurred tunnel, ad frames with no writing. Floor fills the bottom 22%. The center is open standing space. Cool morning palette.',
 'office': 'A bright modern office in the afternoon, eye level: rows of desks with monitors in the background, plants, a window wall with soft daylight. The foreground center is open space (no desk in the center foreground). Floor fills the bottom 22%. Clean bright palette.',
 'gym': 'A small neighborhood gym in the evening, eye level: dumbbell racks and a mirror wall in the background, a treadmill on the left, rubber floor filling the bottom 22%. The center is open floor space. Energetic warm palette.',
 'desknight': 'A cozy small room at night, eye level: a window with a dark night sky and city lights, a bookshelf, a warm desk lamp glow on the left, a plain wall. The center and right are open space (no desk in the center). Floor fills the bottom 22%. Warm lamp light against deep blue night.',
 'living': 'A small living room on a Friday night, eye level: a big soft mustard-yellow two-seat sofa at the center against the wall, a floor lamp with warm light on the left, a window with night city lights, a small rug on the floor. Floor fills the bottom 22%. Warm tired evening palette.',
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
