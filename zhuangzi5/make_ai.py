"""Story-scene illustrations for ep.008 (Zhuangzi) with Nano Banana 2.1 on Google Cloud (billed to credits).
Frames from the published v5 animation are passed as style / character references so the pictures look like the channel.
usage: python3 make_ai.py [key ...]   (no keys: make the missing ones)"""
import base64, io, json, os, sys, time
from PIL import Image
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'gtts'))
import vx
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
os.makedirs('ai', exist_ok=True)
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
CH = 'ref/chars.png'
ZH = ('Zhuangzi is drawn exactly like the 1st (leftmost) character in the character reference: a round white head, grey hair in a small topknot with a '
      'thin golden hairpin, bushy grey eyebrows, a long white pointed beard, a pale green robe with a dark green belt, simple stick-like legs and round white hands.')
HZ = ('Huizi is drawn exactly like the 2nd character in the character reference: a round white head, black hair under a small black official cap with a '
      'green bead and a golden hairpin, a thin black moustache and a small goatee, frowning eyebrows, a light-blue official robe with a dark-blue belt, '
      'stick-like legs and round white hands.')
KW = ('The King of Wei is drawn like the 3rd character in the character reference: a round white head, a full black beard, a black crown cap with golden '
      'tassels, a mustard-yellow robe with a purple belt.')
EN = ('The two envoys of Chu are drawn like the 4th pair of characters in the character reference: round white heads, black hair buns with small red caps, '
      'salmon-red robes with brown belts.')
SH = ('Carpenter Shi is drawn like the 5th (rightmost) character in the character reference: a round white head, dark-brown hair with a topknot, a full '
      'dark-brown beard, a brown work robe.')
STYLE = ('Characters: drawn exactly in the flat cartoon style of the character reference — round white heads, simple faces, thick slightly '
         'wobbly black outlines, simple robes, stick-like legs and round white hands; keep them small-to-medium in the frame. Background and setting: a '
         'richer, more detailed storybook illustration than a flat cartoon — layered depth, textured East-Asian ink-wash painting for mountains, water and '
         'trees, detailed period props and architecture of ancient China (Warring States period), soft atmospheric light, gentle shadows, warm film-like color '
         'grading, cinematic wide composition. Wide 16:9 frame; the illustration fills the whole frame edge to edge with no borders, frames or blank strips. The bottom fifth shows only simple ground, floor, grass or water without important details (subtitles are overlaid there). Do not draw any '
         'text, letters, Chinese characters, numbers, signs, inscriptions, logos, watermarks or speech bubbles.')
JOBS = {
 '04': ([CH], f'{ZH} About 2,300 years ago in ancient China, he works as a humble keeper of a lacquer-tree grove: he stands in the left third '
        'among rows of young lacquer trees, wearing a patched, worn robe, holding a small wooden bucket; a simple thatched hut in the distance. Calm, poor but '
        'content, warm morning light. The upper right half is open sky above misty mountains.'),
 '06': ([CH], f'{ZH} {KW} In the King of Wei\'s grand hall with tall red wooden pillars: Zhuangzi stands in the left third in a patched, '
        'mended robe and shoes tied up with string, calm and dignified; on the right the king sits on a golden throne leaning forward, puzzled. '
        'The upper third of the frame is calm plain wall between the pillars.'),
 '08': ([CH], f'{ZH} {EN} On the bank of the Pu river, Zhuangzi sits fishing with a long bamboo rod in the left-center, relaxed; the two envoys '
        'stand behind him on the left, bowing politely with a rolled scroll. In the shallow water on the right a small turtle happily drags its tail through the mud on '
        'a little mud bank. Peaceful afternoon. The upper half is open sky above misty mountains.'),
 '11': ([CH], f'{ZH} {HZ} Zhuangzi (left) and Huizi (right-center) stand side by side in front of Huizi\'s official residence with a curved '
        'roof; Huizi holds a long yellow wooden measuring ruler on his shoulder and looks skeptical, Zhuangzi smiles easily. Lifelong friends and rivals. '
        'The upper third is open sky.'),
 '17': ([CH], f'{HZ} In his garden, Huizi stands in the left third next to an enormous yellow bottle gourd as big as a person growing on a '
        'vine, scratching his head, troubled. Daylight. The upper right is open sky above misty mountains.'),
 '18': ([CH], f'{HZ} In his garden, Huizi stands in the left-center, fists raised, frustrated, next to the giant yellow gourd smashed into '
        'big broken pieces on the ground; a wooden club lies beside him. Comic, not violent. The upper right half is open sky.'),
 '19': ([CH], 'Ancient China, the state of Song: a humble family (a middle-aged father with short black hair, a small black moustache and a plain brown work tunic — clearly NOT the white-bearded philosopher of the reference — plus a mother and a boy, all with round white heads and stick legs like the '
        'reference characters) wash silk floss in a cold river on the left; a clay jar of hand salve sits on a rock; on the right a traveller in a straw hat with a '
        'bag of gold coins walks up to them to buy the recipe. Chilly but sunny. The upper half is open sky above misty mountains.'),
 '21': ([CH], 'Ancient China, deep winter: a battle on a wide icy river with falling snow. Small wooden warships of the state of Wu with red '
        'flags, full of soldiers with round white heads like the reference characters, push ahead against boats of the state of Yue on the right that '
        'retreat in disorder. No blood, no gore — playful, storybook. The upper third is a pale snowy sky.'),
 '23': ([CH], f'{ZH} Zhuangzi floats happily down a wide calm river with a giant yellow bottle gourd tied around his waist like a swim ring, '
        'lying back and laughing, placed in the center-left. Sunny, cheerful. The upper half is open sky above misty mountains.'),
 '33': ([CH], f'{HZ} {ZH} In Huizi\'s yard stands a huge old tree with a gnarled, knotty trunk and twisted branches; Huizi points at it, '
        'grumbling, on the left; two carpenters with tools walk past on the right without even looking at it; Zhuangzi stands to the far left, amused. '
        'The upper right is open sky.'),
 '35': ([CH], f'{SH} A gigantic ancient Chinese sacred oak tree (with a faded red cloth sash tied around its trunk) beside a small Chinese village earth-god shrine with a grey tiled roof and a smoking incense burner in front (Chinese style — NOT a Japanese shrine, no straw shimenawa rope, no zigzag paper streamers); dozens of tiny villagers '
        'gather around it admiring. Carpenter Shi, holding a saw over his shoulder, walks past in the left third without looking, followed by a young apprentice who '
        'stares up at the tree. Daylight. The upper right corner is open sky.'),
 '37': ([CH], f'{SH} Night, a dream: Carpenter Shi sleeps on a straw mat in the lower left; the gigantic old oak tree towers over him in '
        'moonlight, with a gentle, wise, ancient face formed in the bark of its trunk, looking down at him. Mysterious and calm, not scary. Deep blue night sky, '
        'stars. The upper left area is calm night sky.'),
 '47': ([CH], f'{ZH} {HZ} By a small pond, Zhuangzi (left) and Huizi (right) bicker playfully, both secretly smiling; '
        'between them stand a little yellow duck with short legs and a tall white crane with long legs. Warm afternoon. The upper third is open sky.'),
 '55': ([CH], f'{ZH} {HZ} At autumn dusk, Zhuangzi and Huizi stand together on an arched wooden bridge over the Hao river, looking down at the '
        'fish and chatting; autumn leaves drift down. Warm, nostalgic. The upper half is a soft dusk sky.'),
 '56': ([CH], f'{ZH} Late autumn dusk: Zhuangzi, old and alone, stands quietly in the left third before a small grass-covered grave mound with a '
        'plain stone marker (no writing), fallen leaves around. Melancholic but gentle. The upper half is a soft dusk sky.'),
 '57': ([CH], f'{SH} In a simple courtyard, Carpenter Shi swings his axe like a gust of wind, with motion lines, just past the nose of a calm man '
        '(round white head, simple grey robe) who stands still with his eyes open and a tiny white speck of plaster on the tip of his nose. Carpenter on the '
        'left, the man in the center-right. Dynamic but safe and funny. The upper third is calm plain wall.'),
 '58': ([CH], f'{SH} Carpenter Shi, older, stands alone in the left-center of the same simple courtyard holding his axe low, looking sadly at '
        'the empty spot beside him where his partner used to stand; a few fallen leaves. Quiet and melancholic. The upper third is calm plain wall.'),
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
