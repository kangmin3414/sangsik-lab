"""AI illustrations for the long-form (Gemini image, Zero as reference). usage: python3 gen_ai.py key [key...] -> ai/<key>.png"""
import base64, io, json, os, sys, time
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
ZE = ('Zero is drawn exactly like the character in the reference picture: a round white head with no hair, a simple cartoon face with thick black eyebrows, '
      'a plain orange t-shirt, stick-like arms and legs, round white hands, thick slightly wobbly black outlines. Zero has NO moustache, NO beard, NO hat, NO glasses.')
STYLE = ('A cinematic illustration frame for an animated YouTube documentary, wide 16:9, edge to edge. Zero keeps the flat cartoon look of the reference with thick outlines; '
         'the world around him is a rich painterly illustration with dramatic lighting and strong color contrast. Keep the lower 18% of the frame simple and darker (subtitles go there). '
         'Absolutely no text, letters, numbers, signs or logos anywhere.')
JOBS = {
 'sheep': ('Night, a cold moonlit field. Zero is a small trembling lamb: he wears fluffy white sheep ears and a little tuft of white wool on his round head, '
           'he crouches low in the center-right of the frame, hugging his knees, shivering, eyes wide and teary, chewing a single blade of grass. '
           'Around him three big grey cartoon wolves with sharp teeth snarl and snatch a basket of food away from right in front of him; their eyes glow yellow. '
           'Zero does not resist at all. Deep blue and violet night palette, cold rim light on Zero, the wolves partly in shadow.'),
 'mercy': ('Golden late-afternoon savanna. A huge majestic lion with long sharp claws clearly visible and a powerful body lies calmly and gently in the grass, eyes half closed, '
           'while a small white rabbit and a little bird rest fearlessly right beside its paw. Strength held back: calm, noble, peaceful. Zero is NOT in this picture. Warm gold and amber light, painterly.'),
 'dog': ('A dim kitchen at night. Zero has small floppy brown dog ears on his round white head and wears a red collar with a leash; he sits on the floor looking up anxiously with big pleading eyes, '
         'tail-less, shoulders hunched. A huge grey hand from the top of the frame holds a food bowl just out of reach and a grey hand holds the leash tight. Zero is in the center. Cold blue light with one warm spot on the bowl.'),
 'camel': ('A vast scorching desert under a white-hot sun. Zero is a tired camel: a camel body with two humps and long legs, but his head is Zero round white head with thick eyebrows, sweating, eyes heavy. '
           'On his back is a towering, wobbling mountain of office paper stacks, folders, gift boxes and suitcases tied with rope, much taller than him. He walks slowly in the center of the frame leaving footprints, '
           'heat haze, cracked sand, an orange and ochre palette.'),
 'lion': ('A dramatic transformation in the desert at dusk. Bursting out of a torn camel skin and scattered paper stacks, Zero becomes a magnificent golden lion: a powerful lion body with a huge glowing golden mane, '
          'and the face in the mane is Zero round white face with thick eyebrows and a fierce, determined look. Golden light explodes from him, sand and paper fly outward. Center of frame, heroic low angle.'),
 'dragon': ('An epic confrontation on a dark rocky plain under storm clouds. On the right, a gigantic ancient dragon towers over everything; every one of its countless golden scales glows like a small metal plate, '
            'its eyes burn and it looms down. On the left, much smaller but standing firm, the golden lion with Zero round white face in its glowing mane faces the dragon, chest out, feet planted. '
            'Cinematic scale contrast, blue-grey storm palette with gold highlights.'),
 'roar': ('The golden lion with Zero round white face in its glowing mane roars with his mouth wide open toward the right; a shockwave of golden light blasts out of his roar and the huge dragon on the right '
          'is shattering: its glowing golden scales burst off and fly away like broken plates, chains snap. Dramatic, powerful, wind and sparks, low angle, gold and deep blue palette.'),
 'proud': ('A wide road at dramatic sunset leading toward a blazing red-orange sky. Zero walks confidently toward the viewer at the center, chin up, chest out, a small proud smile, hands relaxed. '
           'Behind him, his long shadow stretched on the road is the shape of a lion with a mane. Far behind him on the left, a pale grey line of timid sheep stand under a dull flat cloud. Rich warm saturated colors.'),
 'window': ('Inside an office at sunset, the room is calm and empty. Zero stands at a big window on the right side of the frame, seen from slightly behind and to the side, chest open, '
            'shoulders relaxed, smiling widely and happily at a beautiful orange and pink sunset over the city. Warm golden light floods in and falls on his face. A tidy desk behind him with a small, normal pile of papers.'),
}
keys = sys.argv[1:] or list(JOBS); vx.token()
for n, k in enumerate(keys):
    if n: time.sleep(8)
    body = {"contents": [{"role": "user", "parts": [{"inlineData": {"mimeType": "image/png", "data": b64('zero_ref.png')}}, {"text": f'{ZE} {JOBS[k]} {STYLE}'}]}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    for attempt in range(4):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, json.dumps(r, ensure_ascii=False)[:200], flush=True); time.sleep(40)
    imgs, _ = vx.inline_parts(r) if st == 200 else ([], '')
    if not imgs: print(k, 'fail', flush=True); continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((1920, 1080), Image.LANCZOS).save(f'ai/{k}.png'); print(k, 'ok', flush=True)
