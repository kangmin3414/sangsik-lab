"""사람 없는 배경 판 (test_q3 방식): 장소마다 전체용 + 흐린 클로즈업용. Nano Banana 2.1, 무료 크레딧."""
import io, os, sys, time
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
STY = ('Background plate for a 2D cartoon animation, NO people, NO characters, NO animals, NO birds anywhere. Clean flat cartoon style with thick slightly wobbly black outlines and soft painterly shading, '
       'matching a simple stick-figure cartoon. Wide 16:9. Absolutely no text, letters, numbers, signs, screens with writing or logos.')
P = {
 'cross': 'A quiet residential side street in Seoul on a bright weekday morning around 8am, seen at eye level: a zebra crosswalk running across the street, a pedestrian traffic light pole, low apartment buildings and small shops with plain awnings, '
          'a row of young street trees, a convenience-store-like corner shop (no signage text), soft clean morning sunlight with long gentle shadows, light blue sky. The sidewalk fills the bottom 22% of the frame; open space in the middle where one character will stand.',
 'cross_c': 'The same Seoul side street on a bright morning, a closer view: softly out-of-focus crosswalk stripes, street trees and shop fronts, warm morning light. Very soft and blurry like a shallow depth-of-field shot, so a character in front stands out.',
 'park': 'A small neighborhood pocket park in Seoul on a calm morning: a wooden bench on the left, a paved path, a few trees with fresh green leaves, a low hedge, a lamp post, apartment buildings softly in the distance, gentle morning light. '
         'The paved ground fills the bottom 22% of the frame; open space in the middle for a character and some birds (do not draw any birds).',
 'park_c': 'The same small park, a closer low view: blurry bokeh of trees and the bench, soft green and warm light. Very soft and blurry like a shallow depth-of-field shot.',
 'kitchen': 'A tiny one-room studio apartment kitchen in Korea late at night, seen at eye level: a tall white two-door fridge on the right third of the frame, a small counter with a sink and an electric kettle on the left, a window with dark blue night outside, '
            'a warm small ceiling light. Cozy, a little cluttered. The floor (light wood) fills the bottom 22% of the frame; open space in the middle in front of the fridge where one character will stand.',
 'kitchen_c': 'The same tiny studio kitchen at night, a closer view: softly out-of-focus counter, kettle and window, warm dim light. Very soft and blurry like a shallow depth-of-field shot.',
 'study': 'An old university study room in Oxford at dusk: tall wooden bookshelves full of old books, a heavy wooden desk with a green banker lamp glowing, an empty leather chair, a tall arched window with a soft purple-blue evening sky, a blackboard on the side wall (completely blank). '
          'Quiet, scholarly, a little mysterious. The wooden floor fills the bottom 22% of the frame.',
 'space': 'Deep outer space: a vast dark navy-to-black starfield with a soft glowing spiral galaxy on the right and faint colorful nebula clouds, tiny distant stars, calm and awe-inspiring, painted in a clean cartoon style with soft glow. Leave the center fairly empty.',
}
P.update({
 'bunsik': 'Inside a small cozy Korean street-food snack restaurant (bunsik) in the evening, seen at eye level: in the background a steaming food counter with big shallow pans, a menu board on the wall that is completely blank (plain colored panels, no writing), a few small tables with red plastic stools along the back wall, warm yellow pendant lights, tiled walls, lively and cozy. '
           'IMPORTANT: the center foreground is open floor with NO table and NO stools, because characters and a table will be drawn there later. The floor fills the bottom 22% of the frame.',
 'room': 'A small cozy Korean one-room studio apartment on a bright morning, seen at eye level: on the left an EMPTY plain wooden desk with nothing on it and a desk chair, in the center a large window with a wide empty windowsill (nothing on the sill) and soft blue morning sky with clouds outside, '
         'on the right a single bed with a blanket and a pillow, a wooden door at the far right edge, a small rug, a few books on a shelf above the bed. Light wood floor fills the bottom 22% of the frame; open floor space in the middle in front of the window.',
 'village': 'A tiny cute cartoon village for a simple 2D video game, side view: a sandy town square fills the whole lower third of the frame, behind it a row of small colorful houses with round red and blue roofs, round green trees, a little stone well, a tiny fence, bright blue sky with puffy white clouds. '
            'Simple, flat, cheerful, toy-like game art with thick outlines.',
})
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
