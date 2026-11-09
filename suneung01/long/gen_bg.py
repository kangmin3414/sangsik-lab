import io, os, sys, time
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
STY = ('Background plate for a 2D cartoon animation, NO people, NO characters, NO animals anywhere. Clean flat cartoon style with thick slightly wobbly black outlines and soft painterly shading, '
       'matching a simple stick-figure cartoon. Wide 16:9. Absolutely no text, letters, numbers, signs with writing, posters with writing or logos.')
P = {
 'sroom': "A Korean high-school senior's small bedroom late at night, eye level, seen from the foot of the room: a study desk on the LEFT with neat stacks of workbooks, a pencil case and a small switched-off desk lamp, a bulletin board with plain colored sticky notes (no writing), "
          "a window in the back wall showing distant apartment buildings with a few lit windows and a deep blue night sky, a round wall clock (no numbers, just tick marks). The CENTER and RIGHT of the room are EMPTY floor space (a bed will be drawn later). "
          "The floor fills the bottom 22%. Dim cool blue moonlight palette with a faint warm glow from the window.",
 'cvsapt': "The ground-floor convenience store of a Korean apartment building at night, eye level from the sidewalk: a bright glowing glass storefront on the RIGHT half with shelves of snacks and a drink fridge inside (blank colorful packaging, no logos), "
           "the apartment building's tiled wall and a few lit windows above, a small flower bed with low bushes on the left, a street lamp, a bicycle rack in the distance. The CENTER foreground is an EMPTY paved sidewalk (a bench will be drawn later). "
           "The paved ground fills the bottom 24%. Cozy cold November night palette: deep navy sky, warm white light spilling from the store onto the pavement.",
 'elev': "The inside of a plain Korean apartment elevator, eye level, facing the closed stainless-steel doors from inside: brushed metal walls, a small floor-number display panel above the doors (blank, no digits), a handrail, soft cool morning light from the ceiling. The center is EMPTY space for two people to stand. The floor fills the bottom 20%. Calm early-morning palette.",
 'gate': "The front gate of a Korean high school on an early November morning, eye level from the sidewalk: tall stone gate pillars and an open sliding metal gate on the RIGHT side, a school building behind trees with autumn yellow ginkgo leaves, blank banners with no writing hanging on the fence, a clear cold blue sky with soft morning sun. The LEFT and CENTER foreground is an empty sidewalk. The ground fills the bottom 24%. Fresh crisp hopeful palette.",
 'exroom': "A quiet Korean high-school classroom used as an exam room at lunchtime, eye level from a student's seat: rows of empty single desks and chairs, a green chalkboard at the back with nothing written, tall windows with bright daylight on the left, a wall clock (no numbers). The CENTER foreground is open space (one desk will be drawn later). The floor fills the bottom 20%. Bright calm daylight palette.",
 'runway': "A wide airport apron and runway at midday, eye level: several white passenger airplanes (no logos, no writing) parked and standing still near the terminal, the long empty runway stretching away, a control tower in the distance, clear pale blue sky. Everything is still and quiet. The ground fills the bottom 30%. Clean calm palette.",
 'gatedusk': "The front gate of a Korean high school at sunset in November, eye level from the sidewalk: tall stone gate pillars and an open metal gate in the CENTER-RIGHT, the school building silhouetted against a warm orange and pink sunset sky, long shadows, bare trees, a few street lamps just turning on. The foreground sidewalk is EMPTY. The ground fills the bottom 24%. Warm golden emotional palette.",
 'campus': "A Korean university campus quad on a bright spring day in March, eye level: a big brick lecture building, cherry trees with first blossoms, a wide paved path and lawn, blank club banners with no writing. The center foreground is empty paved path. The ground fills the bottom 24%. Fresh slightly washed-out nostalgic palette.",
 'oneroom': "A tiny cozy Korean studio apartment (one-room) at night, eye level, seen from the floor level: a low folding table in the CENTER on a warm wooden floor, a single bed against the wall on the right, a small window, a mini fridge, clothes on a rack, warm string lights. The floor fills the bottom 26%. Warm nostalgic palette.",
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
