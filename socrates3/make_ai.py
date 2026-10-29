"""Story-scene illustrations for ep.009 (Socrates) with Nano Banana 2.1 on Google Cloud (billed to credits).
Frames from the published v3 animation are passed as style / character references so the pictures look like the channel.
usage: python3 make_ai.py [key ...]   (no keys: make the missing ones)"""
import base64, io, json, os, sys, time
from PIL import Image
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'gtts'))
import vx
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
os.makedirs('ai', exist_ok=True)
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
SO = ('Socrates is drawn exactly like the character in the Socrates reference: a round white bald head with a ring of curly white-grey hair on the '
      'sides, a big curly white-grey beard, a round little nose, kind small eyes, a plain beige tunic with a brown sash, BAREFOOT, simple stick-like '
      'legs and round white hands.')
STYLE = ('Match the drawing style of the reference images exactly: hand-drawn flat 2D cartoon, thick slightly wobbly black outlines, simple shapes, '
         'soft flat colors, gentle film-like lighting, cozy educational-documentary look. Wide 16:9 frame. The illustration fills the whole frame edge '
         'to edge, the scene continues to the very bottom edge (no blank border, no empty paper band); keep the bottom fifth simple and uncluttered '
         '(subtitles go there). Do not draw any text, letters, numbers, signs, inscriptions or speech bubbles.')
CS = 'ref/char_SOC.png'
JOBS = {
 '04': (['ref/line04_c.png', CS], f'Ancient Athens about 2,400 years ago, the Agora on a bright sunny morning: white stone colonnades (stoa), an olive tree, '
        f'the Acropolis with the Parthenon on a hill in the background. {SO} He walks barefoot in the left third and asks a question with one hand raised, '
        'smiling; three ordinary Athenian citizens in colorful tunics stand in the middle, puzzled, scratching their heads. The upper half is open blue sky.'),
 '06': (['ref/line06_c.png', 'ref/char_CHAER.png', 'ref/char_PYTHIA.png'], 'The Temple of Apollo at Delphi on a mountainside at golden afternoon, '
        'with rocky peaks and cypress trees. Inside the temple entrance on the right, the priestess Pythia (drawn like the priestess reference: round '
        'white head, long black hair, a laurel wreath, a white robe) sits on a tall bronze tripod with her eyes closed, wrapped in soft pale-purple '
        'mist rising from the ground. In the left third, Socrates\' young friend Chaerephon (drawn like the man reference: round white head, black '
        'hair and a full black beard, a red tunic with a brown sash) stands asking her earnestly. Mysterious but gentle. The upper left is open sky.'),
 '29': (['ref/line29_c.png', 'ref/chars_laches.png'], 'Athens, an open-air training ground (gymnasium) beside a long white colonnade, sunny day. '
        'In the left half, two worried elderly fathers in simple tunics (one blue, one green, grey beards, one with a walking stick) stand with their '
        'two small sons (orange and blue tunics), watching. On the right, a soldier in bronze armour, a red-crested helmet and a round red shield '
        'demonstrates fighting with a spear on the sand. Drawn exactly in the style and with the characters of the reference. The upper area is calm '
        'colonnade and sky.'),
 '51': (['ref/line51_c.png', CS], f'The people\'s court of ancient Athens, daylight: many rows of jurors (about a hundred small simple citizens with round '
        f'white heads in colorful tunics) sit on long stone-and-wood benches rising in tiers, all looking at the center. {SO} Now 70 years old, he stands '
        'calmly on a low marble platform in the center, barefoot, facing the jurors with a gentle, unafraid face. Serious, solemn but not scary. '
        'The upper left area is a calm stone wall.'),
 '55': (['ref/line55_c.png', 'ref/chars_cell.png'], f'A simple stone prison cell in Athens at early dawn: rough stone-brick walls, a small barred window '
        f'with a pale blue dawn sky, a wooden bench, a heavy wooden door. {SO} He sits calmly on the bench in the left third. His old friend Crito '
        '(drawn like the right character in the cell reference: grey hair and grey beard, a blue tunic, a worried face) has just come in on the '
        'right and leans toward him, whispering urgently, holding a small money pouch and a key. A small oil lamp glows on the floor. The upper middle '
        'is the calm stone wall.'),
 '57': (['ref/line57_c.png', 'ref/chars_cell.png'], f'The same simple stone prison cell at sunset: warm orange light streams through the small barred '
        f'window. {SO} He sits peacefully on the wooden bench in the left third, eyes calm, gently smiling. Three friends (one is Crito with a grey '
        'beard and blue tunic) sit quietly on a bench to the right, heads slightly bowed, close together. Quiet, dignified and tender. No cup, no '
        'drink and no objects in anyone\'s hands. The upper area is warm calm stone wall.'),
}
only = sys.argv[1:]
first = True
for k, (refs, prompt) in JOBS.items():
    if only and k not in only: continue
    out = f'ai/{k}.png'
    if os.path.exists(out) and not only: continue
    if not first: time.sleep(40)
    first = False
    parts = [{"inlineData": {"mimeType": "image/png", "data": b64(p)}} for p in refs] + [{"text": prompt + ' ' + STYLE}]
    body = {"contents": [{"role": "user", "parts": parts}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    for attempt in range(6):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, json.dumps(r, ensure_ascii=False)[:200], flush=True)
        time.sleep(90 + 30 * attempt)
    if st != 200: continue
    imgs, _ = vx.inline_parts(r)
    if not imgs: print(k, 'no image', flush=True); continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((1920, 1080), Image.LANCZOS).save(out)
    print(k, 'ok', flush=True)
