"""Ep.018 story pictures with Nano Banana 2.1 on Google Cloud (free-trial credits).
ref/zero_ages.png = Zero at year 1, 5, 10, 30 (left to right); ref/cast.png = [Yamada, Sato, Hana, Mom, sister, nephew Minjun, Korean newcomer].
usage: python3 make_ai.py [key ...]   -> ai/<key>.png (1920x1080)"""
import base64, io, json, os, sys, time
from PIL import Image
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'gtts'))
import vx
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); os.makedirs('ai', exist_ok=True)
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
LR, CR = 'ref/lee_ages.png', 'ref/cast.png'
LEE = {
 1: 'The boy (age 11, in 1953) is drawn exactly like the 1st (leftmost, smallest) character in the first reference: a round white head, short black hair, a dark navy school uniform with a small collar, stick-like legs and round white hands.',
 2: 'The young businessman (age 32, in 1974) is drawn exactly like the 2nd character in the first reference: a round white head, short black hair, a grey suit with a dark-red tie.',
 3: 'The chairman (1990s) is drawn exactly like the 3rd character in the first reference: a round white head, short black hair, thin dark glasses, a dark navy suit with a navy tie; serious, focused.',
 4: 'The older man (2010s) is drawn exactly like the 4th (rightmost) character in the first reference: a round white head, short light-grey hair, glasses, a taupe sweater over a collared shirt.',
}
EMP = 'factory workers drawn like the 1st character in the cast reference (round white heads, short dark hair, white short-sleeved work shirts)'
EXEC = 'executives drawn like the 2nd character in the cast reference (round white heads, dark suits)'
ENG = 'engineers drawn like the 3rd character in the cast reference, wearing white clean-room bunny suits with hoods'
DOC = 'the old scientist drawn exactly like the rightmost character in the cast reference (round white head, fluffy white hair on both sides, round glasses, white lab coat)'
STYLE = ('Characters: drawn exactly in the flat cartoon style of the references — plain round white heads, simple dot eyes, simple eyebrows and mouth, no nose, '
         'no wrinkles, no sweat drops, no realistic human faces; hair only as simple flat hair caps; thick slightly wobbly black outlines, stick-like legs and round '
         'white hands; every person (including background people) is in this same round-head style; characters small-to-medium in the frame. These are '
         'stylised cartoon characters, NOT portraits of any real person. Background: a rich, detailed storybook illustration — layered depth, painterly '
         'gouache and watercolor textures, soft cinematic light, gentle shadows, film-like color grading, wide composition. Mood bright and clear even in night or '
         'sad scenes (warm lamps, glowing light), never gloomy or muddy. Wide 16:9 frame filled edge to edge, no borders. The bottom fifth shows only simple ground, '
         'floor or table surface (subtitles go there). Absolutely NO text, letters, numbers, logos, brand names, company emblems, signs with writing, or watermarks '
         'anywhere — products, buildings, uniforms and screens are plain and unbranded; TV and phone screens show only simple shapes.')
S1950 = 'Color grading: warm faded sepia like an old photograph, but still bright.'
S1970 = 'Color grading: soft faded 1970s film colors, warm.'
S1990 = 'Color grading: clear, vivid early-1990s colors.'
S2020 = 'Color grading: bright natural daylight, fresh and clean.'
JOBS = {
 'H1': ([CR], f'An outdoor factory sports ground in early spring, 1995: a huge mountain of discarded old mobile phones, cordless phones and fax machines (all plain, unbranded, grey and black, 1990s style) is burning with bright orange flames and sparks rising into a pale sky; in the foreground, seen from behind, a long row of {EMP} stand watching silently, some with heads bowed. Dramatic, powerful, but bright: firelight glow, clear sky. {S1990}'),
 'H2': ([CR], f'Close view in the same place: the faces of a few {EMP} lit warmly by the orange firelight, watching the burning pile with complicated, solemn expressions — sad, determined, moved. Sparks float in the air. {S1990}'),
 'H3': ([LR], f'{LEE[1]} Inside an old 1950s Tokyo movie theater, completely empty except for the boy: he sits alone in the middle of the front row, small, looking up at the big glowing screen (the screen shows only soft light); the beam of the projector cuts through the dark above the seats; warm light on his face. Lonely but magical. {S1950}'),
 '1-1': ([LR], f'{LEE[1]} 1953: the boy stands alone on a busy old Tokyo street with a small suitcase, looking up at unfamiliar buildings, trams and adults walking past him; he looks small and a little lost. {S1950}'),
 '1-2': ([LR], f'{LEE[1]} A small Japanese-style room in the 1950s: the boy sits on the tatami floor hugging a fluffy puppy close, smiling softly for the first time; a small window with evening light, a school bag in the corner. Lonely but warm. {S1950}'),
 '1-3': ([LR], f'{LEE[1]} Outside a 1950s cinema in Tokyo at dusk: the boy walks in alone through the entrance under big hand-painted movie posters (only abstract shapes and colors, no writing) and warm marquee bulbs; other moviegoers are adults. {S1950}'),
 '1-4': ([LR], f'{LEE[1]} Inside the empty old theater, the boy in the front row watches the screen; above and around him float three soft, translucent dream bubbles, each showing the SAME simple movie scene (two round-head characters on a bridge) from three different viewpoints: a close-up from the hero, a view from a side character, and a wide view from a director\'s camera with a tiny movie camera icon. Wonder and curiosity. {S1950}'),
 '1-5': ([LR], f'{LEE[1]} A close shot of the boy in the dark theater, his face softly lit by the screen, eyes wide and thoughtful, as if seeing something no one else sees. Gentle, hopeful. {S1950}'),
 '2-1': ([LR], f'{LEE[2]} 1974: in front of a small, shabby, old one-storey factory building with a rusty gate and a few weeds, the young businessman stands holding a briefcase, looking at the building with quiet determination. A cloudy but bright sky. {S1970}'),
 '2-2': ([LR, CR], f'{LEE[2]} A 1970s office meeting room: around a table, several {EXEC} lean back, shaking their heads, arms crossed, doubtful; the young businessman at the head of the table listens calmly, hands folded. Old box television in the corner. {S1970}'),
 '2-2b': ([LR, CR], f'{LEE[2]} Late at night in a small 1970s lab: {ENG} (hoods down) look tiredly at a tray of failed chips under a desk lamp; the young businessman stands behind them with his jacket off and sleeves rolled up, encouraging them with a hand on a shoulder. Warm lamp light, a calendar on the wall with pages flying. {S1970}'),
 '2-3': ([CR], f'1983: a bright, brand-new semiconductor clean room with yellow-tinted lights: {ENG} in white bunny suits carefully hold up a shiny silicon wafer that reflects rainbow colors; rows of machines. Exciting, hopeful. {S1970}'),
 '2-4': ([LR, CR], f'{LEE[3]} 1992: a big bright modern clean room seen through a large glass window; inside, {ENG} raise their arms and cheer; outside the glass the chairman stands with a small, quiet smile, hands behind his back. Big shiny wafers on racks. Triumphant but understated. {S1990}'),
 '2-5': ([], 'A simple, cute illustration of a child (round white cartoon head, simple face) sitting alone at a small table in a plain room, staring very hard at a single marshmallow on a plate in front of them, hands clasped, trying hard not to eat it; a wall clock. Light comedy, bright pastel colors.'),
 '2-5b': ([], 'A warm, bright illustration: the same kind of child (round white cartoon head) waiting patiently and calmly at a small table with a marshmallow, smiling, while a kind adult (round white cartoon head) in the doorway keeps a promise, coming back with a whole bag of marshmallows. Trust and warmth, bright pastel colors.'),
 '2-6': ([LR], f'{LEE[2]} Night by a large window in an office: the young businessman, seen from behind, looks out at a city at night with scattered lights and a clear starry sky, his reflection faint in the glass. Quiet hope. Bright moonlit blues and warm interior lamp, not dark. {S1970}'),
 '3-1': ([LR], f'{LEE[3]} 1987: a large, very quiet chairman\'s office with a wide wooden desk and tall windows; the new chairman stands alone by the window, hands behind his back, looking out; the room feels too big for one person. Soft winter light. {S1990}'),
 '3-2': ([LR], f'{LEE[3]} Inside a big, bright electronics store abroad in the early 1990s: glamorous unbranded televisions shine on the main display stands, while on a low shelf at the very back corner, a few dusty unbranded TVs sit ignored; the chairman crouches slightly, looking at them with a serious face. {S1990}'),
 '3-3': ([LR], f'{LEE[3]} 3 a.m. in a home study: the chairman sits at a desk piled high with reports and product samples, chin on his hand, unable to sleep; a desk lamp glows warmly; a wall clock shows a little after three (hands only, no numbers). Restless but warm light. {S1990}'),
 '3-4': ([LR, CR], f'{LEE[3]} A meeting room: on a large old CRT television screen, a video shows a factory line where {EMP} are shaving the plastic lid of a washing machine with a small knife to force it to fit; in front of the TV, the chairman sits very still, staring, one hand clenched on the armrest. {S1990}'),
 '3-5': ([LR], f'{LEE[1]} The same empty 1950s movie theater as before, but on the big screen now plays the factory scene: workers shaving a washing-machine lid with a knife; the small boy in the front row watches it with a sad, serious face. Dreamlike, symbolic. {S1950}'),
 '3-6': ([LR, CR], f'{LEE[3]} 1993: a grand European hotel conference hall with chandeliers and tall windows; about two hundred {EXEC} sit in rows, all facing the front, tense; at the far front the chairman stands at a simple lectern, small in the distance. Wide shot, dramatic but bright. {S1990}'),
 '3-6b': ([LR, CR], f'{LEE[3]} A montage-like single picture: the chairman speaking passionately, leaning forward over a meeting table with both hands, in front of a few tired but listening {EXEC}; behind them, large windows show several different city skylines blended together (a European old town, a Tokyo skyline, an American city) as if days and cities flow by. {S1990}'),
 '3-7': ([LR], f'{LEE[3]} The same conference hall seen from the side: the chairman at the lectern, a strong backlight from the tall windows making him almost a silhouette, one hand raised firmly; the rows of executives in the foreground blurred. Powerful, cinematic. {S1990}'),
 '3-8': ([CR], f'A city street at 7 a.m. in summer 1993, soft dawn light: crowds of {EMP} and office workers in short-sleeved shirts walk briskly toward a large modern office building (plain, no signs); some yawn, some smile. Fresh morning energy. {S1990}'),
 '3-9': ([CR], f'An airport departure hall in the early 1990s: a few young employees in casual travel clothes (round white heads) with backpacks and suitcases wave goodbye, holding thick language textbooks (blank covers); a big departure board with only colored blocks. Hopeful, adventurous. {S1990}'),
 '3-9b': ([CR], f'A lively foreign street market (a mix of Southeast Asian / Middle Eastern / Latin American market feel, no text on stalls): a young employee (round white head, short dark hair, casual shirt, backpack) walks among the stalls writing in a small notebook, chatting with a friendly local vendor (round white head). Colorful, warm, curious. {S1990}'),
 '3-10': ([LR], f'{LEE[3]} A warehouse in 1995 filled with tall stacks of boxes of returned, faulty unbranded mobile phones; the chairman stands among them, holding one phone and looking at it with a stern, decided face. Shafts of light through high windows. {S1990}'),
 '4-2': ([CR], f'A closer view of the burning pile of discarded unbranded phones and fax machines: bright flames and sparks; silhouettes of {EMP} in front, one worker wiping his eye with the back of his hand. Strong orange and gold firelight against a pale blue sky. {S1990}'),
 '4-3': ([], 'A bright, empty old theater: one cartoon person (round white head, simple face) sits alone in the middle of the seats with a ticket in hand, bored and slumping, yawning, while a dull play continues on stage; all other seats are empty. Gently funny. Warm stage light.'),
 '4-4': ([LR], f'{LEE[3]} Early morning after the fire: the factory ground with only a large patch of grey ash and thin smoke left; the chairman stands alone at the edge, seen from behind, the sky turning a clear dawn gold. Quiet resolve, new beginning. {S1990}'),
 '5-0': ([LR], f'{LEE[3]} A large, empty chairman\'s office in soft evening light: the chairman\'s chair is turned away from the desk, empty; on the desk, neatly stacked papers and a closed fountain pen; a tall clock stands in the corner. Still, quiet, reflective — calm muted colors but not dark.'),
 '6-1': ([LR], f'{LEE[4]} A bright hospital room by a large window: the older man sits up in a hospital bed under soft blankets, looking out at the trees whose leaves change from spring green to autumn gold across the window panes (time passing). Peaceful, gentle, bright. {S2020}'),
 '6-2': ([CR], f'A bright museum storage hall: museum staff (round white heads, white gloves, aprons) carefully carry many wrapped framed paintings and wooden boxes of ceramics; the artworks are wrapped or seen from behind, never showing a recognizable painting. Respectful, quiet. {S2020}'),
 '6-3': ([CR], f'Outside a large modern national museum on a sunny summer day: a very long line of all kinds of people (round white heads: families, grandparents, students, couples) waiting happily, some holding umbrellas against the sun. Bright, lively, hopeful. {S2020}'),
 '6-4': ([LR], f'{LEE[1]} A dreamy, symbolic picture: in the foreground, many people of all ages (round white heads) stand side by side in front of large framed artworks on a gallery wall (the frames show only soft blurred color, no recognizable painting), seen from behind; and faintly blended into the same gallery space, like a translucent memory, the small boy from the old movie theater sits on a single theater seat, also looking at the art. Warm golden light, emotional. {S2020}'),
 '7-2': ([CR], f'{DOC} in a bright, cosy lab-office with plants and bookshelves, smiling warmly and holding up a small notebook and a pencil toward the viewer, as if gently giving advice. Bright and friendly. {S2020}'),
 '7-3': ([LR], f'{LEE[1]} A bright spring evening outside the old movie theater from the beginning, now repainted and lively: the small boy runs out of the doors, no longer alone — other children (round white heads) run out with him, laughing; warm lights on, cherry blossoms. Hopeful ending. {S1950}'),
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
