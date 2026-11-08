"""기게스의 반지 편 배경 판(사람 없는 배경, test_q3 방식). Nano Banana 2.1, 무료 크레딧. 클로즈업은 같은 판을 흐리게 써서 장소마다 1장."""
import io, os, sys, time
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
STY = ('Background plate for a 2D cartoon animation, NO people, NO characters, NO animals anywhere. Clean flat cartoon style with thick slightly wobbly black outlines and soft painterly shading, '
       'matching a simple stick-figure cartoon. Wide 16:9. Absolutely no text, letters, numbers, signs, screens with writing or logos.')
P = {
 'meet': 'A small modern Korean office meeting room in the afternoon, seen at eye level from the end of the room: a large pull-down projector screen on the left wall (plain light blue, completely blank), a whiteboard (blank) on the back wall, a window with blinds on the right letting in soft daylight, a potted plant in the corner, a few empty office chairs along the back wall. '
         'IMPORTANT: the center foreground is open floor with NO table, because a long table and characters will be drawn there later. Grey carpet floor fills the bottom 22% of the frame.',
 'office': 'An open-plan Korean office floor, seen at eye level: rows of desks with monitors (screens blank and dark), office chairs, low partitions, a printer, ceiling lights, large windows at the back with a city view, filing cabinets. Tidy and ordinary. '
           'IMPORTANT: the center foreground is open floor space with NO desk, because a desk and characters will be drawn there later. The floor fills the bottom 22% of the frame.',
 'alley': 'A narrow Korean neighborhood alley at night in the rain: on the left a small convenience store with a large glowing glass front window (the inside is bright but softly blurred, no text, no logos), a couple of bicycles parked by the wall, a street lamp casting a warm cone of light with visible rain streaks, '
          'wet asphalt with shiny puddles reflecting the lights, low houses and power lines in the dark blue background. Moody but cozy. The wet ground fills the bottom 22% of the frame; open space in the middle where one character will stand.',
 'bath': 'A small plain Korean apartment bathroom at night, seen at eye level facing the sink: a white sink with a faucet on a small counter in the center, a large rectangular mirror above it (the mirror shows only a soft blurry reflection of pale tiles, NO person in it), a small shelf with a cup and toothbrushes, white square wall tiles, a warm small ceiling light, a towel hanging on the right. The floor is not visible much; the counter edge runs across the lower third of the frame.',
 'subway': 'Inside a Seoul subway train car in the morning, seen at eye level from the middle of the car: a long bench seat along the back wall with empty seats, grab handles hanging from the ceiling, windows above the bench showing a blurred tunnel, bright clean fluorescent light, a door at the right. '
           'The floor fills the bottom 22% of the frame; the bench seat is empty.',
}
vx.token()
for k in sys.argv[1:] or list(P):
    if not sys.argv[1:] and os.path.exists(f'ai/{k}.png'): continue
    body = {"contents": [{"role": "user", "parts": [{"text": P[k] + ' ' + STY}]}], "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    for a in range(8):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, str(r)[:120], flush=True); time.sleep(40 + 20 * a)
    imgs, _ = vx.inline_parts(r) if st == 200 else ([], '')
    if not imgs: print(k, 'fail', flush=True); continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((2400, 1350), Image.LANCZOS).save(f'ai/{k}.png'); print(k, 'ok', flush=True); time.sleep(8)
print('bg done', flush=True)
