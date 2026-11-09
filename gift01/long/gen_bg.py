import io, os, sys, time
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
STY = ('Background plate for a 2D cartoon animation, NO people, NO characters, NO animals anywhere. Clean flat cartoon style with thick slightly wobbly black outlines and soft painterly shading, '
       'matching a simple stick-figure cartoon. Wide 16:9. Absolutely no text, letters, numbers, signs with writing, posters with writing, calendars with numbers or logos.')
P = {
 'room': "A small cozy Korean studio apartment (one-room) at 11 pm, eye level, seen from where a desk would face into the room: the back wall has a single bed with a rumpled blanket on the RIGHT, a dark window in the CENTER-LEFT showing distant apartment buildings with a few lit windows and a navy night sky, "
         "a narrow wardrobe on the far left, a small shelf with a plant and books, a coat on a hook. The CENTER foreground is EMPTY floor (a desk will be drawn later in front). The floor fills the bottom 22%. "
         "Dim cool night palette, the room lit only by a warm desk-lamp glow coming from the bottom center.",
 'morning': "The same kind of small Korean studio apartment on a bright Saturday morning, eye level: single bed with a rumpled blanket on the RIGHT, sheer curtains half open at a window in the CENTER-LEFT with soft golden morning sun streaming in, dust in the light beams, "
            "a narrow wardrobe on the far left with its door slightly open, a small shelf with a plant. The CENTER foreground is EMPTY floor (a desk will be drawn later in front). The floor fills the bottom 22%. Warm fresh gentle morning palette.",
 'lab': "A 1970s American university psychology laboratory, eye level: two small identical testing cubicles side by side separated by a thin partition wall in the CENTER that has a small square mail slot hole in it, each cubicle with a plain wooden table and a chair, "
        "old fluorescent ceiling lights, beige walls, a big analog wall clock with only tick marks, a reel-to-reel tape recorder on a shelf, wood paneling. The foreground floor is EMPTY. The floor fills the bottom 22%. Warm faded sepia vintage film palette.",
 'library': "A university library reading room on a winter night, eye level: long wooden study tables in rows with green-shaded reading lamps, tall bookshelves in the back, big windows on the left with falling snow outside and a deep blue night, "
            "the room mostly empty and quiet. The CENTER foreground has one empty study table seen from the front (its top at about 62% of the image height). The floor fills the bottom 20%. Cold blue palette with small warm lamp pools, nostalgic and lonely.",
 'hall': "The entrance lobby of a Korean wedding hall on a bright autumn Saturday, eye level: tall glass doors on the left with sunlight, big white and pale pink flower arrangements on stands, a white reception table with a white tablecloth on the RIGHT, "
         "a soft carpet, a chandelier, an arch of flowers in the back leading to the ceremony room. The CENTER foreground is EMPTY space for guests. The floor fills the bottom 22%. Warm bright joyful palette with soft golden light.",
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
