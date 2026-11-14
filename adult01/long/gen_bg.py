import io, os, sys, time
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
STY = ('Background plate for a 2D cartoon animation, NO people, NO characters, NO animals anywhere. Clean flat cartoon style with thick slightly wobbly black outlines and soft painterly shading, '
       'matching a simple stick-figure cartoon. Wide 16:9. Absolutely no text, letters, numbers, signs with writing, posters with writing or logos.')
P = {
 'er': "The waiting area of a small Korean hospital emergency room just after midnight, eye level, BRIGHT clean lighting, NOT dark. On the RIGHT third: a reception counter with a low glass partition, seen at a slight angle, with a desk lamp and a monitor showing nothing. On the LEFT third in the back wall: a wide automatic glass sliding door with the night outside in soft blue. Along the back wall in the middle: a row of five EMPTY pale-blue waiting chairs and a potted plant, a round wall clock with NO numbers. The CENTER floor is EMPTY (people will be drawn later). The shiny floor fills the bottom 24%. Palette: white, soft mint green, pale blue, a little warm light from the counter.",
 'store': "Inside a small Korean convenience store late at night, eye level, very BRIGHT cheerful lighting. The back wall is a long shelf unit full of colorful snack packages and bread in plain wrappers with simple shapes like stars and dots (no writing). On the far RIGHT: a checkout counter. On the far LEFT: a glass drink fridge. The CENTER floor in front of the shelves is EMPTY (a person will be drawn later). The floor fills the bottom 24%. Palette: white, warm yellow, candy colors, soft shadows.",
 'bay': "A curtained treatment bay in a small Korean hospital emergency room at night, eye level, BRIGHT soft lighting, NOT dark. Pale mint curtains hang on a rail on the left and right sides, a clean white wall at the back with a small shelf and a wall light, an IV stand with nothing on it at the far left, a small round stool at the far right. The CENTER of the bay and center floor are EMPTY (a bed and people will be drawn later). The floor fills the bottom 24%. Palette: white, mint, pale blue, warm cream light.",
}
vx.token()
for k in sys.argv[1:] or list(P):
    if os.path.exists(f'ai/{k}.jpg') and k not in sys.argv[1:]: continue
    body = {"contents": [{"role": "user", "parts": [{"text": P[k] + ' ' + STY}]}], "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    for a in range(5):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, str(r)[:120], flush=True); time.sleep(40)
    imgs, _ = vx.inline_parts(r) if st == 200 else ([], '')
    if not imgs: print(k, 'fail', flush=True); continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((2400, 1350), Image.LANCZOS).save(f'ai/{k}.jpg', quality=90); print(k, 'ok', flush=True); time.sleep(6)
