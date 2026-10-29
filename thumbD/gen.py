"""Thumbnail D (model: 한눈에 심리학 / 오늘은 심리학 formula) — AI storybook scene with Zero large, text added later.
usage: python3 gen.py key [variant]"""
import base64, io, json, os, sys, time
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, os.path.join(os.path.dirname(HERE), 'gtts')); import vx
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
ZE = ('Zero is drawn exactly like the character in the reference picture: a round white head with no hair, a simple cartoon face with thick '
      'black eyebrows, a plain orange t-shirt, stick-like arms and legs and round white hands, thick slightly wobbly black outlines.')
STYLE = ('Style: a YouTube thumbnail illustration. Zero stays in the flat cartoon style of the reference; the setting is a detailed storybook '
         'illustration with painterly textures, soft atmospheric light, gentle shadows and warm film-like color grading, like a picture book. '
         'Zero is BIG in the frame: his head is about one third of the frame height, upper body visible, expression very clear and readable at a '
         'small size. Wide 16:9, edge to edge, no borders. The bottom 35% of the frame is the lower part of the scene (desk, floor, ground) with '
         'no important details because big captions will be overlaid there. Do not draw any text, letters, numbers, signs, logos or speech bubbles; '
         'screens are blank or softly glowing.')
JOBS = {
 'stoic1': ('Late evening in a small Korean office. Zero sits at his desk, slightly right of center, eyes calmly closed with a small steady, confident '
            'smile, holding a warm mug of tea in both hands. All around him small everyday troubles are happening: his phone on the desk lights up '
            'with buzzing notification glow, loose papers fly through the air from a toppling stack, sticky notes everywhere, rain streaks on the dark '
            'window behind him. Warm desk-lamp light falls on Zero while the rest of the office is in cool blue night shadow, so he looks calm in '
            'the middle of a storm.'),
 'stoic2': ('Split moment in one picture: on the LEFT third, a small worried Zero in the rain under a dark grey cloud, clutching a buzzing phone; on '
            'the RIGHT two thirds, a big calm Zero standing tall in warm golden sunlight on a city street after rain, chin up, arms relaxed, eyes '
            'gently closed with a confident smile, a small puddle reflecting the light. Soft diagonal transition from stormy blue-grey to warm golden light.'),
}

OTHERS = ('Any other people are simple cartoon characters with round white heads in muted grey, navy or beige clothes (never orange), '
          'smaller than Zero or partly out of focus.')
JOBS.update({
 'descartes1': ('Evening on a crowded Korean subway car. Zero sits slightly right of center holding his phone (screen softly glowing, blank) at '
                'arm\'s length and looking at it through a big magnifying glass, one eyebrow raised, eyes narrowed in calm, clever doubt with a '
                'small knowing smile. Around him other passengers stare at their own glowing phones with shocked, panicked faces. Cool blue '
                'subway light with warm highlights on Zero.'),
 'descartes2': ('One picture with a soft diagonal transition. LEFT third: a small Zero in a dim room, eyes wide in shock, gripping a phone that '
                'glows alarming red. RIGHT two thirds: a big calm Zero by a bright sunny window holding the phone in one hand and a magnifying '
                'glass in the other, studying it with a sharp, thoughtful, confident look, a coffee cup on the table.'),
 'zhuangzi1': ('A sunny meadow on a hill. Zero lies relaxed on the grass in the shade of a huge gnarled old tree, slightly right of center, '
               'hands behind his head, eyes closed, a peaceful happy smile. Next to him on the grass lies a long wooden measuring ruler snapped '
               'in half. Far in the background, tiny people in suits rush with briefcases along a road toward a hazy grey city. Golden '
               'late-afternoon light, warm and free.'),
 'zhuangzi2': ('One picture with a soft diagonal transition. LEFT third: a small gloomy Zero standing stiffly in a grey office next to a giant '
               'measuring ruler that towers over him, shoulders slumped, tired eyes. RIGHT two thirds: a big Zero beaming with a relaxed happy '
               'smile under a huge old tree in a golden sunny meadow, arms open wide.'),
 'socrates1': ('A Korean office meeting room. Zero, slightly right of center and big in the frame, raises one hand high, his face brave and a '
               'little nervous but determined, mouth open as if asking a question. Around the long table, colleagues sit with blank, '
               'glazed expressions, silently nodding; a projector screen behind glows blank white. Warm light falls on Zero.'),
 'socrates2': ('One picture with a soft diagonal transition. LEFT third: in a dim meeting room, a small Zero nods nervously with a forced '
               'smile and a drop of sweat, pretending to understand. RIGHT two thirds: a big Zero in bright light raising his hand high, '
               'confident and curious, eyes bright.'),
 'buddha1': ('A cozy Korean lunch spot by a sunny window. Zero sits slightly right of center at a small table, eyes closed, savoring a spoonful '
             'of warm rice with a blissful, peaceful smile; a steaming bowl of soup and small side dishes in front of him. His phone lies face '
             'down far away at the edge of the table. Warm golden midday light, gentle steam.'),
 'buddha2': ('One picture with a soft diagonal transition. LEFT third: a small Zero hunched over a glowing phone at a lunch table, his food '
             'going cold, dim and grey, tired eyes. RIGHT two thirds: a big Zero in warm sunlight happily eating with chopsticks, eyes '
             'sparkling, steam rising from the bowl, phone face down.'),
 'time1': ('An unfamiliar charming old alley Zero has never visited, full of small new things: a tiny flower shop, a cat on a wall, a hand-painted '
           'cafe, autumn leaves falling. Zero walks through it slightly right of center, looking around with big curious, delighted eyes and an '
           'open smile, holding a small notebook. Warm afternoon light, rich colors.'),
 'time2': ('One picture with a soft diagonal transition. LEFT third: a small Zero sitting at a grey desk in front of a wall calendar, staring '
           'blankly, everything in dull grey. RIGHT two thirds: a big Zero amazed and smiling on a colorful, sunny street full of new sights, '
           'autumn leaves swirling around him.'),
 'anger1': ('Night in Zero\'s small bedroom. Zero sits on the edge of his bed slightly right of center, his face still a bit red and angry, '
            'but he is calmly placing his glowing phone face down on the nightstand and taking a slow deep breath, eyes closed. A small desk '
            'lamp glows warmly; the window shows a calm night sky.'),
 'anger2': ('One picture with a soft diagonal transition. LEFT third: a small furious Zero typing hard on a phone that glows red, steam '
            'puffing from his head, dark room. RIGHT two thirds: a big Zero laughing happily next to his best friend (a round-white-head '
            'character with short dark hair and a navy hoodie) who holds a small birthday cake with candles, warm cozy light.'),
 'mom1': ('Night. Zero sits at a small desk by an open window, slightly right of center, writing in a small notebook under a warm lamp, with a '
          'gentle smile and slightly teary, grateful eyes. Through the window, a deep blue night sky with three bright twinkling stars. Cozy, '
          'warm, quiet mood.'),
 'mom2': ('One picture with a soft diagonal transition. LEFT third: a small tired Zero under a dark rain cloud, shoulders slumped. RIGHT two '
          'thirds: a big Zero on a balcony at night looking up at a beautiful starry sky with a warm smile, holding a small notebook to his chest.'),
})

keys = sys.argv[1:]; vx.token(); first = True
for k in keys:
    if not first: time.sleep(12)
    first = False
    body = {"contents": [{"role": "user", "parts": [{"inlineData": {"mimeType": "image/png", "data": b64('zero_ref.png')}},
            {"text": f'{ZE} {OTHERS} {JOBS[k]} {STYLE}'}]}],
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
