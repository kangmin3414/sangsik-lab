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
 'H3': ([], 'An EMPTY 1960s university psychology laboratory room, wide shot, NO people and NO furniture in the front half of the room: bare concrete floor that meets the back wall at about two thirds of the frame height, cold fluorescent tube lights, a wall clock, pale green tiled walls; on the right side of the back wall a closed door with a small wire-glass window, and through it the faint silhouette of a man strapped in a chair. The whole left and centre foreground floor is empty (characters and a machine will be drawn there later). Cold, clinical, tense.'),
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
