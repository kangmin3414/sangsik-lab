"""소원이 다 이루어지는 방 — story pictures with Nano Banana 2.1 on Google Cloud (free-trial credits).
ref/zero_ages.png: Zero = the 1st (leftmost) character (white office shirt, blue lanyard).
usage: python3 make_ai.py [key ...]   -> ai/<key>.png (1920x1080). Existing files are skipped unless named."""
import base64, io, json, os, sys, time
from PIL import Image
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'gtts'))
import vx
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); os.makedirs('ai', exist_ok=True)
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
ZR = 'ref/zero_ages.png'
Z = ('Zero is drawn exactly like the 1st (leftmost) character in the reference: a round white head with no hair, a simple face, '
     'a white collared office shirt, stick-like legs and round white hands.')
ZH = ('Zero is drawn exactly like the 1st (leftmost) character in the reference — a round white head with no hair, a simple face, stick-like legs and round white hands — '
      'but at home he wears a soft grey hoodie and dark sweatpants instead of the shirt and lanyard.')
DOC = ('the old landlord "the doctor", about eighty, drawn in the same round-head style: a round white head with fluffy white hair on both sides, '
       'round glasses, a warm brown knitted cardigan over a white shirt')
STYLE = ('Characters: drawn exactly in the flat cartoon style of the reference — round white heads, simple friendly faces, thick slightly wobbly black outlines, '
         'stick-like legs and round white hands; every person in the picture (including background people) is drawn in this same round-head style: a plain round white head, '
         'simple dot eyes, simple eyebrows and mouth, no nose, no wrinkles, no realistic human faces; hair only as simple flat hair caps. Keep characters small-to-medium in the frame. '
         'Background and setting: a rich, detailed storybook illustration — layered depth, painterly gouache and watercolor textures, soft light, gentle shadows, '
         'warm bright film-like color grading, cinematic wide composition. Even night and dawn scenes are cosy and softly lit, never dark or gloomy. '
         'Wide 16:9 frame; the illustration fills the whole frame edge to edge with no borders, frames or blank strips. The bottom fifth shows only simple floor, '
         'ground or table surface without important details (subtitles are overlaid there). Do not draw any text, letters, numbers, hangul, signs with writing, logos, '
         'watermarks or speech bubbles; screens are blank or softly glowing; paper notes are blank.')
ROOM = ('a small Korean semi-basement studio room (banjiha): a narrow high window near the ceiling at street level through which passers-by\'s ankles and shoes are seen, '
        'faded patterned wallpaper, a single bed, a small low table, a rice cooker and a kettle, clothes on a hanger')
JOBS = {
 'A1': ([ZR], f'{ZH} {ROOM}, at six in the morning on a Monday: soft blue dawn light falls from the high window, a warm small lamp is on; Zero sits on the edge of his bed, '
              f'shoulders slumped, holding a softly glowing phone with a tired, bored face; on the low table a cold cup of instant ramen with chopsticks. Through the window, several '
              f'pairs of shoes and ankles walk past. Quiet, a little weary, but cosy and gently lit.'),
 'A2': (['ai/A1.png'], 'The SAME semi-basement room and the SAME small round low table as in the reference picture, now seen as a close-up still life; NO people in the picture at all: a crumpled instant ramen packet (plain red and orange wrapper, no writing) '
            'next to a cold ramen cup with chopsticks; from between the folds of the ramen packet, the small corner of a folded white paper note peeks out. Soft blue dawn light '
            'from a high window mixed with warm lamp light. Subtle, mysterious, gentle.'),
 'A3': ([ZR], f'{Z} He carries a small backpack and has white earphones in. The narrow outdoor concrete stairs of an old two-story Korean house (dagagu house) in the morning, '
              f'potted plants and a few flower pots on the steps: on a step sits {DOC}, wiping a wooden baduk (go) board with a cloth, a bowl of black and white stones beside him, '
              f'looking up at Zero with a friendly smile; Zero walks down past him with a flat, uninterested face. Morning sunlight, warm and bright.'),
 'A4': ([ZR], f'{Z} A morning subway car of Seoul line 2 (green accents, no writing): rows of round-head commuters sit and stand, all looking at their phones; Zero sits in the '
              f'same corner seat, head leaning against the glass partition, bored. Bright, slightly monotonous, gently comic.'),
 'A5': ([ZR], f'{Z} A bright open-plan Korean office: Zero sits at his desk with his chin on his hand, staring at a monitor showing an endless blank spreadsheet grid '
              f'(only empty cells, no numbers); colleagues around him do the same; a wall clock; a window with a sunset beginning outside. Monotonous, gently comic.'),
 'A6': ([ZR], f'{ZH} {ROOM}, at eleven at night, warmly lit by a small desk lamp: Zero stands by a small trash bin crumpling an instant ramen packet in his hand, '
              f'staring into space and murmuring to himself with a wistful face. Cosy, quiet, softly lit.'),
 'A7': ([ZR], f'{ZH} {ROOM} at night: on the patterned wallpaper wall, the outline of a tall door that was never there slowly rises out of the wallpaper pattern, its edges '
              f'glowing with a soft warm white light; Zero has stepped back, holding a crumpled ramen packet, eyes wide in astonishment. Magical, mysterious, wondrous, not scary.'),
 'A8': ([ZR, 'ai/A7.png'], f'{ZH} He wears simple slippers. The SAME semi-basement room and the SAME glowing door as in the second reference picture (high street-level window, patterned wallpaper, single bed, small low table). The magical door now stands open: beyond it is a vast, endless, softly glowing pure white space with a '
              f'gentle pearly haze, no walls and no horizon; seen from behind, Zero stands at the threshold and lifts one slippered foot to step in, a long soft shadow behind him '
              f'in the small room. Awe, wonder, calm.'),
 'A9': ([ZR], f'{ZH} In an endless, softly glowing white space with a pearly haze, an impossibly long banquet table stretches to the horizon, covered with every kind of food — '
              f'Korean dishes, bowls of noodles, cakes, fruit towers, roast chicken, ice cream; Zero stands small at the near end of the table, arms wide, mouth open in delight. '
              f'Dreamlike, abundant, bright pastel colors.'),
 'A10': ([ZR], f'{ZH} Floating in a vast dreamy cosmos of soft pastel colors (lavender, peach, sky blue) with nebula clouds: Zero flicks one finger and a bright new star sparkles '
               f'into being; around him float several small colorful planets he has made, one with a tiny ocean and rings; he grins proudly. Wondrous, playful, luminous.'),
}
only = sys.argv[1:]; vx.token(); first = True
for k, (refs, prompt) in JOBS.items():
    if only and k not in only: continue
    if not only and os.path.exists(f'ai/{k}.png'): continue
    if not first: time.sleep(15)
    first = False
    parts = [{"inlineData": {"mimeType": "image/png", "data": b64(r)}} for r in refs] + [{"text": prompt + ' ' + STYLE}]
    body = {"contents": [{"role": "user", "parts": parts}], "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    st = None
    for attempt in range(12):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, json.dumps(r, ensure_ascii=False)[:120], flush=True); time.sleep(60 + 30 * min(attempt, 4))
    if st != 200: continue
    imgs, _ = vx.inline_parts(r)
    if not imgs: print(k, 'no image', flush=True); continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((1920, 1080), Image.LANCZOS).save(f'ai/{k}.png'); print(k, 'ok', flush=True)
