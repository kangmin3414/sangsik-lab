"""Story-scene illustrations for ep.010 (Buddha) with Nano Banana 2.1 on Google Cloud (billed to credits).
Frames from the published v3 animation are passed as style / character references so the pictures look like the channel.
usage: python3 make_ai.py [key ...]   (no keys: make the missing ones)"""
import base64, io, json, os, sys, time
from PIL import Image
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'gtts'))
import vx
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
os.makedirs('ai', exist_ok=True)
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
CH = 'ref/chars.png'
PR = ('Prince Siddhartha is drawn exactly like the 1st (leftmost) character in the character reference: a round white head, short black hair, rosy cheeks, '
      'a golden crown with red and green jewels, a cream tunic with a golden sash, stick-like legs and round white hands.')
KG = ('His father, King Suddhodana, is drawn like the 2nd character in the character reference: a round white head, a full grey-black beard, a golden '
      'crown, a cream tunic with a purple belt.')
BU = ('The Buddha (the former prince, now a monk) is drawn exactly like the 3rd character in the character reference: a round white head, black hair in a '
      'small topknot, a calm gentle smile, a saffron-orange monk robe with a dark-red sash, sitting cross-legged on an orange round cushion.')
SU = ('Sujata is drawn like the 4th character in the character reference: a round white head, long dark-brown hair, rosy cheeks, a yellow top and an '
      'orange skirt.')
SO = ('Sona is drawn like the 5th character in the character reference: a round white head with no hair, big round eyes, a saffron-orange monk robe '
      'with a dark-red sash.')
GO = ('Kisa Gotami is drawn like the 6th (rightmost) character in the character reference: a round white head, long black hair, a pink dress, '
      'round white hands.')
STYLE = ('Characters: drawn exactly in the flat cartoon style of the character reference — round white heads, simple faces, thick slightly '
         'wobbly black outlines, simple robes, stick-like legs and round white hands; keep them small-to-medium in the frame. Background and setting: a '
         'richer, more detailed storybook illustration than a flat cartoon — layered depth, textured East-Asian ink-wash painting for mountains, water and '
         'trees, detailed period props and architecture of ancient India about 2,500 years ago (Himalayan foothills, Kapilavastu, forests of the Ganges plain), soft atmospheric light, gentle shadows, warm film-like color '
         'grading, cinematic wide composition. Wide 16:9 frame; the illustration fills the whole frame edge to edge with no borders, frames or blank strips. The bottom fifth shows only simple ground, floor, grass or water without important details (subtitles are overlaid there). Do not draw any '
         'text, letters, Chinese characters, numbers, signs, inscriptions, logos, watermarks or speech bubbles.')
JOBS = {
 '05': ([CH], f'{PR} {KG} The beautiful palace of the Shakya kingdom at the foot of the snowy Himalayas: white domes, gardens and a lotus pond. The young '
        'prince stands happily in the right-center by the pond surrounded by flowers, musicians playing and plates of delicious food; his father, the king, '
        'stands protectively in the left third. Bright, joyful daylight. The upper area is open sky with snowy peaks.'),
 '07': ([CH], f'{PR} Outside the city gate for the first time, the prince stands beside his small royal chariot in the left third, shocked; along the road '
        'he sees an old man with a cane walking slowly, a sick man lying on a mat, and in the distance a small, quiet funeral procession carrying a draped bier '
        '(gentle, not graphic). Dusty road, palm trees, the city walls behind. The upper area is a calm pale sky.'),
 '08': ([CH], f'{PR} On the same road the prince (left third) meets a wandering ascetic (round white head, shaved head, a simple saffron robe, holding an '
        'alms bowl) who stands in the right-center with an unusually peaceful, serene smile, glowing softly. Late afternoon light. The upper right is open sky.'),
 '09': ([CH], f'{PR} Night: the prince quietly leaves the palace on a white horse through the open palace gate, looking back once, in the left-center; '
        'the palace domes behind with a few warm lit windows, a crescent moon and stars. Calm, determined, bittersweet. The upper right is a deep blue night sky.'),
 '10': ([CH], f'{BU} He is now a thin ascetic (gentle cartoon, not grim) meditating under a tree in a quiet forest for six years, in the center-left; a tiny '
        'bowl with a single grain of rice beside him; dry leaves, a few other ascetics far away. Muted, dusty light. The upper right is calm sky between trees.'),
 '12': ([CH], f'{BU} {SU} By the Nairanjana river at the edge of the forest, the girl Sujata (right-center) kindly offers a wooden bowl of milk-rice to the '
        'weak monk sitting under a tree (left-center), who accepts it gratefully. Warm golden morning light, the river sparkling. The upper area is open sky.'),
 '14': ([CH], f'{BU} At dawn he sits in calm meditation under a huge, ancient Bodhi tree with heart-shaped leaves, in the center; soft golden rays of '
        'enlightenment glow around him and through the leaves; peaceful plain at sunrise. The upper corners are calm sunrise sky.'),
 '45': ([CH], f'{SO} The young monk Sona walks barefoot on a long forest meditation path, exhausted, his feet sore and wrapped in small cloth bandages (no '
        'blood), shoulders slumped, about to give up, in the left-center. Bamboo hut and trees, soft morning mist. The upper right is calm sky.'),
 '46': ([CH], f'{BU} {SO} In a forest clearing, the Buddha (right-center) sits on his cushion and gently speaks to young Sona (left-center) who sits '
        'opposite, listening; a wooden Indian stringed instrument (veena) lies beside Sona. Peaceful dappled light. The upper area is calm sky between trees.'),
 '54': ([CH], f'{GO} At dusk in a small Indian village of mud houses with thatched roofs, the young mother Gotami (center-left) holds her small child wrapped '
        'in a cloth to her chest and goes from door to door asking for help, worried; a villager in a doorway shakes his head kindly. Gentle and sad, not '
        'graphic. The upper area is a soft purple dusk sky over distant hills.'),
 '55': ([CH], f'{BU} {GO} Under a tree at the edge of the village, the Buddha (left-center) speaks gently and kindly to Gotami (right-center) who listens '
        'with tears in her eyes; a small clay bowl with a handful of tiny yellow mustard seeds sits between them. Warm dusk light. The upper right is calm sky.'),
 '56': ([CH], f'{GO} Gotami knocks on door after door in the village street at dusk; villagers in several doorways hold out little handfuls of mustard seeds '
        'but lower their eyes sadly. Long village street, thatched houses, soft lamplight starting. The upper area is a soft purple dusk sky.'),
 '58': ([CH], f'{GO} Night in the village: Gotami stands quietly in the center of the street, calm now, eyes closed; in every house window and doorway a '
        'small oil lamp glows warmly, lights stretching into the distance; stars above. Peaceful, tender. The upper half is a deep blue starry night sky.'),
 '59': ([CH], f'{BU} Night in a grove of two tall sal trees in blossom: the old Buddha lies peacefully on his right side on a simple cot, calm and smiling; '
        'a few monks sit quietly around him; many small clay oil lamps glow on the ground; petals drift down. Serene, not sad. The upper half is calm night sky.'),
}
only = sys.argv[1:]
first = True
for k, (refs, prompt) in JOBS.items():
    if only and k not in only: continue
    out = f'ai/{k}.png'
    if os.path.exists(out) and not only: continue
    if not first: time.sleep(20)
    first = False
    parts = [{"inlineData": {"mimeType": "image/png", "data": b64(p)}} for p in refs] + [{"text": prompt + ' ' + STYLE}]
    body = {"contents": [{"role": "user", "parts": parts}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    st = None
    for attempt in range(4):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, json.dumps(r, ensure_ascii=False)[:200], flush=True)
        time.sleep(50)
    if st != 200: continue
    imgs, _ = vx.inline_parts(r)
    if not imgs: print(k, 'no image', flush=True); continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((1920, 1080), Image.LANCZOS).save(out)
    print(k, 'ok', flush=True)
