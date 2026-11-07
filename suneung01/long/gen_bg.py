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
