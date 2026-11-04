"""예고편 쇼츠 그림 (세로 9:16) — Nano Banana 2.1, 무료 크레딧. ref/zero_ages.png 맨 왼쪽 = 제로(여기선 주황 후드).
홀로코스트 주제 규칙: 나치 문양·휘장 금지, 참상 직접 묘사 금지(열차 실루엣·연기만), 실존 인물은 단순한 캐릭터(실제 얼굴 금지)."""
import base64, io, json, os, sys, time
from PIL import Image
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'gtts'))
import vx
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); os.makedirs('ai', exist_ok=True)
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
ZR = 'ref/zero_ages.png'
Z = ('Zero is drawn exactly like the 1st (leftmost) character in the reference: a round white head with no hair, a simple face, stick-like legs and round white hands, '
     'but he wears a bright orange hoodie.')
STYLE = ('Characters in the flat cartoon style of the reference: round white heads, simple faces (dot eyes, simple brows and mouth, no nose, no realistic human faces), thick slightly '
         'wobbly black outlines; every person is in this same round-head style. Background: a rich, painterly storybook illustration with cinematic lighting and depth, '
         'serious and tense mood but not gory. Wide 16:9 frame filled edge to edge, no borders. Keep the bottom fifth simple (subtitles are overlaid there). '
         'Absolutely no text, letters, numbers, dial numbers, logos, flags, swastikas, military insignia, armbands or Nazi symbols; no weapons, no blood, no camps, no gas chambers.')
JOBS = {
 'H1': ([], 'A 1961 courtroom in Jerusalem seen from the public gallery, wide shot: in the middle a bulletproof glass booth; inside, a thin middle-aged man in a plain dark suit and black-rimmed glasses (round white head in the same simple cartoon style, no realistic face) calmly arranges papers on a small desk, headphones around his neck; judges\' bench in the distance under tall windows, rows of spectators seen from behind. Desaturated, documentary-like, solemn and chilling.'),
 'H2': ([], 'Symbolic illustration, sepia and grey, wide: in the foreground on a plain office desk, a rubber stamp presses down on a neat document (blank, no writing), a tidy row of pencils and a timetable sheet with blank grid lines; beyond a tall window, a long line of steam locomotives with closed freight wagons departs into grey fog. No people. Quiet, orderly and deeply ominous.'),
 'H3': ([], 'An EMPTY 1960s university psychology laboratory room, wide shot, NO people and NO furniture in the front half of the room: bare concrete floor that meets the back wall at about two thirds of the frame height, cold fluorescent tube lights, a wall clock, pale green tiled walls; on the right side of the back wall a closed door with a small wire-glass window, and through it the faint silhouette of a man strapped in a chair. The whole left and centre foreground floor is empty. Cold, clinical, tense.'),
 'H4': ([], 'The same 1961 Jerusalem courtroom, seen from the press seats: in the foreground, a woman journalist-philosopher in her fifties (round white head in the simple cartoon style, short dark wavy hair, dark dress, no realistic face) sits writing in a notebook with a pencil, looking toward the glass booth far away in the background. Desaturated, documentary-like, quiet and thoughtful.'),
 'H7': ([], 'A dim 1950s study room in Argentina, still life, no people: an old reel-to-reel tape recorder on a wooden table with its reels turning, a microphone on a small stand, an ashtray, scattered typed pages (blank, no writing), a lamp casting hard shadows; window blinds. Desaturated sepia, documentary-like, unsettling.'),
 'H8': ([], 'A 1940s European railway signal box and station office seen as one wide symbolic picture, sepia and grey: many ordinary workers in simple uniforms and suits (round white heads in the simple cartoon style, no realistic faces, NO insignia, NO armbands) each doing a small task — a clerk stamping forms, a signalman pulling a lever, a typist typing, a driver checking a watch — while beyond the windows a long freight train waits in fog. Quiet, orderly, ominous.'),
 'H9': ([], 'A 1961 American university corridor: a bulletin board with a pinned newspaper page and a recruiting flyer (blank, no writing, only blank lines and a small picture of a laboratory), several ordinary people (round white heads in the simple cartoon style: a postman in uniform, a schoolteacher with a cardigan, a salesman in a suit, a worker in overalls) read it curiously. Warm daylight, slightly desaturated, documentary-like.'),
 'H10': ([], 'The small room behind the wire-glass door of a 1960s psychology lab: the man who was strapped to the chair (round white head in the simple cartoon style, a plain grey suit, no realistic face) is unstrapped, perfectly unharmed, standing up and shaking hands with the experimenter in a grey lab coat; the electrodes hang loose; a calm, almost apologetic smile. Cold fluorescent light but a relieved mood.'),
 'H11': ([], 'Morning rush hour on a wide city crosswalk among tall glass office towers, wide 16:9: hundreds of identical round-head office workers (simple cartoon style) in grey suits march in neat lines, each wearing a small brass gear-shaped hat. Muted grey palette. Cinematic, unsettling, orderly.'),
 'H13': ([], 'A quiet triptych-like still life in one wide picture, three objects side by side in soft grey light, no people: on the left, a small humidifier standing silent next to an empty child\'s bed with a teddy bear; in the middle, a construction site with a crane and an unfinished concrete apartment building whose corner has collapsed, seen from far away; on the right, an empty open wallet and a bank passbook on a table (blank pages). Solemn, respectful, not graphic.'),
 'H14': ([], 'A Seoul subway car at dusk, warm orange sunset light through the window: a young office worker with a round white head in the simple cartoon style, wearing a bright orange hoodie and NO hat, leans against the window, tired but with calm, clear eyes; his faint reflection in the glass; the city and river passing outside. The only vivid colours are his hoodie and the sunset; the rest is soft grey. Quiet, hopeful.'),
}
ZR = 'ref/zero_ages.png'
ZO = ('Zero is drawn exactly like the 1st (leftmost) character in the reference: a round white head with no hair, a simple face, stick-like legs and round white hands, '
      'wearing a bright orange hoodie and a small brass gear-shaped hat on top of his head.')
JOBS.update({
 'T1': ([ZR], f'{ZO} THUMBNAIL, big and simple: a close-up of Zero from the chest up, slightly left of centre, giving a polite, perfectly obedient office smile while holding up a red rubber stamp; '
              f'behind him on a plain grey office wall, his own black shadow is cast by a hard light from the left — but the shadow has sharp devil horns and a long pointed tail. '
              f'High contrast, cold grey background, the orange hoodie and the red stamp are the only colours. The right third of the frame is plain empty grey wall (text goes there). Uncanny, clever, eye-catching.'),
 'T2': ([ZR], f'{ZO} THUMBNAIL, big and simple: an extreme close-up of Zero\'s face filling the left half of the frame, sweating, eyes wide with fear and guilt, lit from below by a harsh red light; '
              f'in the lower right corner his round white hand is pushing down a heavy black lever switch on a grey metal panel with a glowing red lamp. Dark background. '
              f'The upper right area is dark and empty (text goes there). Intense, dramatic, high contrast.'),
})
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
