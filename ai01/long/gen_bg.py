import io, os, sys, time
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
STY = ('Background plate for a 2D cartoon animation, NO people, NO characters, NO animals anywhere. Clean flat cartoon style with thick slightly wobbly black outlines and soft painterly shading, '
       'matching a simple stick-figure cartoon. Wide 16:9. Absolutely no text, letters, numbers, signs with writing, posters with writing, calendars with numbers or logos.')
P = {
 'night': "A small Korean studio apartment (one-room) at 2 am, eye level, lights off: the back wall has a dark window in the CENTER-LEFT showing distant apartment buildings with a few lit windows and a deep navy night sky, a small shelf with a plant and books on the right, a coat on a hook, a narrow wardrobe on the far left. "
          "The CENTER and RIGHT foreground is EMPTY floor (a bed will be drawn later). The floor fills the bottom 22%. Very dark cool navy palette, only faint moonlight and city glow, but every shape still readable.",
 'morning': "The same small Korean studio apartment at 7 am, eye level: sheer curtains at a window in the CENTER-LEFT with soft golden morning sunlight streaming in, dust in the light beams, a small shelf with a plant and books on the right, a coat on a hook, a narrow wardrobe on the far left. "
            "The CENTER and RIGHT foreground is EMPTY floor (a bed will be drawn later). The floor fills the bottom 22%. Warm fresh gentle morning palette.",
 'subway': "Inside a Seoul subway car late at night, eye level, looking across the car: a long row of empty grey-blue bench seats along the back wall, dark windows above them with blurred streaks of tunnel lights, metal hand poles and hanging straps, cool fluorescent light. "
           "The floor fills the bottom 22%. Cool tired night palette.",
 'office': "A modern Korean open-plan office in the morning, eye level: rows of white desks with blank dark monitors, office chairs, a potted plant, big windows in the back with a city view and soft daylight, a round wall clock with only tick marks. "
           "The CENTER foreground is EMPTY floor. The floor fills the bottom 22%. Clean light grey and soft blue palette.",
 'cafe': "A cozy small cafe in the afternoon, eye level: a long wooden window counter with high stools on the left, small round tables, warm pendant lamps, shelves with cups and plants, big window with a street outside. "
         "The CENTER foreground is EMPTY floor. The floor fills the bottom 22%. Warm brown and cream palette.",
 'lab': "A bright minimal modern university psychology research room, eye level: clean white walls, one long white table in the center with a single chair, a laptop closed on it, soft overhead panel lights, a whiteboard with nothing written on it, a potted plant. "
        "The CENTER foreground is EMPTY. The floor fills the bottom 22%. Clean white, pale mint and soft grey palette.",
 'soup': "Inside a small old Korean haejangguk (hangover soup) restaurant early in the morning, eye level: a plain wooden table in the CENTER with two wooden stools facing each other at its left and right ends, stainless steel water cups and a napkin box on the table, steam in the air, "
         "a kitchen pass-through window in the back with big pots and rising steam, worn warm walls, a small TV on a high shelf (screen off). The floor fills the bottom 22%. Warm cozy morning palette.",
 'hall': "A narrow Korean apartment entrance hallway at 7 am, eye level: a full-length mirror on the right wall (reflecting only the empty wall), a shoe rack, a coat hook with a tie hanging, a small window with soft morning light, light wooden floor. "
         "The CENTER is EMPTY space. The floor fills the bottom 22%. Soft morning palette.",
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
