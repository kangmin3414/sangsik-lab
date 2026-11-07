"""AI key-visuals for click thumbnails (Gemini image, Zero as reference). usage: python3 gen.py key [key...]  -> ai/<key>.png"""
import base64, io, json, os, sys, time
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, os.path.join(os.path.dirname(HERE), 'gtts')); import vx
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
ZE = ('Zero is drawn exactly like the character in the reference picture: a round white head with no hair, a simple cartoon face with thick black '
      'eyebrows, a plain orange t-shirt, stick-like arms and legs, round white hands, thick slightly wobbly black outlines. Zero has NO moustache, NO beard, NO hat, NO glasses, NO costume.')
STYLE = ('Make a high-impact, eye-catching YouTube thumbnail key visual. Zero is HUGE on the RIGHT half of the frame: his head fills about 45% of the frame height, '
         'upper body visible, with a big exaggerated, instantly readable expression. Zero keeps the flat cartoon look of the reference with thick outlines and a clean bright rim light '
         'so he pops off the background; the scene around him is a rich, saturated, cinematic illustration with dramatic lighting, strong color contrast and a little depth of field. '
         'One single clear hero prop, no clutter. The LEFT 45% of the frame must be calmer and darker (soft out-of-focus background, no important details) because a big headline will be placed there. '
         'Wide 16:9, edge to edge, no borders, no frames. Absolutely no text, letters, numbers, question marks, signs or logos anywhere; screens are blank glowing shapes.')
OTH = 'Other people are simple cartoon characters with round white heads in muted grey or navy clothes (never orange), smaller than Zero, blurred or in the background.'
JOBS = {
 'nz_a': ('Rush hour on a big city street at golden dusk. Zero stands perfectly still in the middle of the right half, one palm raised like a calm "stop" gesture, a wide, relaxed, '
          'smug grin, eyes bright. All around him a crowd of grey commuters streak past with strong motion blur, all heading left, staring at phones. Warm sunlight beams down only on Zero.'),
 'nz_b': ('A foggy mountain crossroads at sunrise. Zero stands at the right, holding a small notebook, head tilted, one eyebrow raised high in a puzzled, lost-but-curious look straight at the viewer. '
          'Two blank wooden signposts point in opposite directions, a wide misty valley with glowing orange sunrise behind him, dramatic god-rays.'),
 'stoic': ('Inside a chaotic office at night during a storm. Zero sits calm at the right, eyes gently closed, a peaceful smile, holding a steaming mug in both hands. '
           'Around him papers fly through the air, several phones buzz with glowing red notification dots, a lightning flash lights the rain-streaked window. A warm lamp light falls only on Zero, the rest is in violent blue and purple.'),
 'desc': ('A packed subway car, cool blue light. Zero holds a glowing phone in one hand and looks through a huge magnifying glass held in the other, one eyebrow cocked, eyes narrowed in clever suspicion, a tiny knowing smirk. '
          'The phone screen glows an alarming orange-red (blank). Grey passengers behind him stare at their own phones with shocked open mouths.'),
 'zhuang': ('Close-up portrait framing, Zero is very large in the frame (head 45% of frame height, upper body only, cropped at the waist). A sunlit hillside meadow at golden hour. Zero leans back relaxed against the trunk of a gigantic gnarled ancient tree on the right, hands behind his head, eyes closed, a deeply peaceful smile. '
            'A long wooden measuring ruler lies snapped in two pieces on the grass in front of him. Far away in the hazy distance, tiny people in suits hurry toward a grey city. Rich warm greens and gold.'),
 'socra': ('A dim corporate meeting room. Zero, big on the right, thrusts one hand high in the air with a brave, bright, determined look and mouth open about to speak. A bright spotlight beam falls on him. '
           'Around the table grey colleagues slump with blank glazed sleepy faces. Dark teal room with a glowing blank projector screen.'),
 'buddha': ('A cozy sunlit Korean lunch spot. Zero, big on the right, eyes closed in pure bliss, taking a spoonful of steaming rice with a deeply savoring smile; a bubbling soup bowl and side dishes in front of him. '
            'His phone lies face down far away on the table edge. Warm golden window light, gentle steam, rich orange and amber tones.'),
 'time': ('A swirling whirlwind of flying calendar pages, wall clocks and hourglasses on a vivid purple and blue background. Zero, big on the right, hair-free round head tilted back, eyes wide and mouth open in total shock as time rushes past him; '
          'motion streaks and glowing speed lines. Dynamic, energetic, dramatic lighting.'),
 'anger': ('A dark bedroom at night lit only by the glow of a phone. Zero, big on the right, face bright red with fury, eyebrows slammed down, steam puffing from his head, gritted teeth, '
           'his thumb hovering just above a huge glowing orange send button on the phone (blank, no text). Deep red and orange glow against a dark blue room.'),
 'mom': ('A quiet room at night. Zero, big on the right, smiling warmly with teary grateful eyes, holding a pencil over a small notebook; three big glowing golden stars float up from the notebook into the dark blue night sky behind him, '
         'sparkles trailing. Warm lamp glow on his face, deep navy and gold palette.'),
 'cozy': ('A rainy night in a cozy room. Zero, big on the right, wrapped in a soft blanket in a big armchair, sleepy half-lidded relaxed eyes and a soft smile, both hands around a steaming mug. '
          'A stack of books on a side table, warm lamp glow, rain on the window, deep warm browns with teal rain-light.'),
}
keys = sys.argv[1:] or list(JOBS); vx.token(); first = True
for k in keys:
    if not first: time.sleep(10)
    first = False
    body = {"contents": [{"role": "user", "parts": [{"inlineData": {"mimeType": "image/png", "data": b64('zero_ref.png')}},
            {"text": f'{ZE} {OTH} {JOBS[k]} {STYLE}'}]}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    st = None
    for attempt in range(4):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, json.dumps(r, ensure_ascii=False)[:200], flush=True); time.sleep(40)
    if st != 200: continue
    imgs, _ = vx.inline_parts(r)
    if not imgs: print(k, 'no image', flush=True); continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((1920, 1080), Image.LANCZOS).save(f'ai/{k}.png'); print(k, 'ok', flush=True)
