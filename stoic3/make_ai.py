"""Story-scene illustrations for ep.006 (Stoic week) with Nano Banana 2.1 on Google Cloud (billed to credits).
Frames from the published v3 animation are passed as style / character references so the pictures look like the channel.
usage: python3 make_ai.py [key ...]   (no keys: make the missing ones)"""
import base64, io, json, os, sys, time
from PIL import Image
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'gtts'))
import vx
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
os.makedirs('ai', exist_ok=True)
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
MA = ('Marcus Aurelius is drawn exactly like the left character in the character reference: a round white head, thick dark-brown hair and a full '
      'dark-brown beard around the lower face, a green laurel wreath, a purple tunic with a white sash, simple stick-like legs and round white hands.')
EP = ('Epictetus is drawn exactly like the middle character in the character reference: a round white bald head, a short grey beard and grey moustache, '
      'a plain brown tunic, and a long wooden walking stick; simple stick-like legs and round white hands.')
SE = ('Seneca is drawn exactly like the right character in the character reference: a round white head, grey hair and a full grey beard, '
      'a white toga with a thin red stripe, simple stick-like legs and round white hands.')
STYLE = ('Match the drawing style of the reference images exactly: hand-drawn flat 2D cartoon, thick slightly wobbly black outlines, simple shapes, '
         'soft flat colors, gentle film-like lighting, cozy educational-documentary look. Wide 16:9 frame. Keep the bottom fifth of the frame calm and '
         'uncluttered (subtitles go there). Do not draw any text, letters, numbers, signs, inscriptions or speech bubbles.')
CH = 'ref/chars_trio.png'
JOBS = {
 '01': (['ref/line01_c.png', CH], 'Ancient Athens, about 2,300 years ago: the Stoa Poikile, a long painted colonnade with white marble columns at the edge of the Agora, '
        'in warm golden late-afternoon light. Several small philosophers in simple Greek tunics and cloaks talk, listen and teach under the columns in the '
        'left half of the frame; every philosopher looks different (different beards, hair and tunic colors), drawn with round white heads and stick legs like the '
        'reference characters, but none of them wears a laurel wreath or a purple toga; the Acropolis stands on a hill far in the background. The right third is calm warm sky above quiet stone pavement.'),
 '09': (['ref/line09_c.png', CH], f'{EP} In his small open-air school at Nicopolis in Greece, he stands in the left third leaning on his walking stick, calmly teaching; '
        'a few young students sit on simple stone benches listening. Plain stone walls, an olive tree, the blue sea in the distance, bright clear morning. '
        'The upper right half is open sky.'),
 '15': (['ref/line15_c.png', CH], f'{MA} Early dawn in his simple leather military tent on the Danube frontier: he sits on a stool in the left-center writing in a small '
        'notebook by a little oil lamp; the open tent flap shows a pale dawn sky and a quiet Roman army camp. Calm, thoughtful, not dramatic. '
        'The right third is the calm plain wall of the tent.'),
 '19': (['ref/line19_c.png', CH], f'{SE} In a corner of his rich Roman villa (marble columns, a heap of gold coins and fine furniture in the background), he sits on a '
        'humble straw mat in the left-center, wearing a rough plain brown cloak over his toga, eating a piece of dry bread with a simple cup of water, '
        'content and curious. Daylight. The upper half and the right third are calm wall.'),
 '24': (['ref/line24_c.png', 'ref/line01_c.png', CH], f'{MA} He stands small in the lower-left corner on a high mountain ridge above the clouds, looking down. Below him '
        'spreads a vast landscape: a winding river, tiny fields, and a tiny Roman city far away; soft clouds drift below the ridge; a calm wide sky at '
        'sunrise. The upper middle of the frame is open sky.'),
 '28': (['ref/line28_c.png', CH], f'{EP} In a bare, sunlit little room he sits in the left third holding a plain clay cup gently in both hands, looking at it '
        'tenderly and thoughtfully; a small window and a simple wooden shelf. Quiet and warm. The right half is calm plain wall.'),
 '32': (['ref/line32_c.png', CH], f'{MA} At night he sits at a wooden table in the left third, writing by a single candle; on the right side of the table '
        'stands a large hourglass with sand running. Moonlight through a window, dignified and quiet, not scary. The upper area is a calm dim wall.'),
 '36': (['ref/line36_c.png', CH], f'{SE} Night in a simple Roman bedroom: the small clay oil lamp on the bedside table has just been put out and a thin trail of '
        'smoke rises from it; soft moonlight through a window. He sits up in bed in the left-center, eyes calm and thoughtful, reflecting on his day. '
        'Peaceful, not dark. The upper right is a calm dim wall.'),
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
