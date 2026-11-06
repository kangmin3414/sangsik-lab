import io, os, sys, time
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
STY = ('Background plate for a 2D cartoon animation, NO people, NO characters, NO animals anywhere. Clean flat cartoon style with thick slightly wobbly black outlines and soft painterly shading, '
       'matching a simple stick-figure cartoon. Wide 16:9. Absolutely no text, letters, numbers, signs with writing, posters with writing or logos.')
P = {
 'alley': 'A rainy narrow underground back alley in Seoul late at night, seen at eye level. On the left third, a shabby little shop front with a wooden door that has a small glowing window, and above the door an EMPTY blank dark rectangular sign board with nothing on it. '
          'The right half is a long old red-brick wall with pipes, open space in front of it where people could stand in a line. Wet black asphalt with puddles reflecting purple and teal light, thin rain streaks, a single dim street lamp. Moody purple-blue night palette. The ground fills the bottom 22% of the frame.',
 'shop': 'Inside a tiny cluttered late-night repair shop, seen straight on at eye level: the back wall has wooden shelves full of glass jars, old radios, alarm clocks, wrenches and spare springs, a hanging bare light bulb and a warm amber desk lamp glow, '
         'a wooden door with a small bell on the far right edge. Dark wooden plank floor filling the bottom 22%. The middle is open floor space (no furniture in the middle). Cozy warm amber light against deep teal shadows.',
 'shopc': 'The same tiny cluttered late-night repair shop, a closer view of the back wall: shelves of jars, old radios and clocks, warm amber lamp glow and bokeh. Very soft and blurry like a shallow depth-of-field camera shot, so characters in front will stand out.',
 'bedroom': 'A small Korean studio apartment on a gloomy grey weekend afternoon, eye level: curtains half closed, grey window light, a desk with a cold mug and a laptop at the far left, clothes on a chair, plain wall. The floor is a light wooden floor filling the bottom 22%. The center and right are open floor space (no bed, no furniture there). Muted blue-grey palette.',
 'winter': 'A frozen ancient Roman-era frontier military camp at night in a blizzard: wooden palisade wall, leather tents, a dark pine forest, a dim campfire far away, heavy falling snow, cold blue palette. In the foreground a long snowy dug trench runs horizontally across the bottom of the frame. Snow ground fills the bottom 22%.',
 'tent': 'Interior of an ancient Roman military leather tent at night, eye level: leather walls with wooden poles, a hanging cloak and a shield on the wall, the tent flap on the right open to a cold blue snowy night. Warm flickering oil-lamp glow inside. Rug-covered ground filling the bottom 22%, the center is open space (no table, no furniture in the center).',
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
