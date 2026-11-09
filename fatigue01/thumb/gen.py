"""피로사회 편 썸네일 그림. usage: python3 gen.py melt:1 melt:2 culprit:1 culprit:2"""
import base64, io, os, sys, time
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
ZE = ('Use the FIRST reference picture for the character Zero: a round white head with no hair, a simple cartoon face with thick black eyebrows, a plain orange t-shirt, '
      'stick-like arms and legs, round white hands, thick slightly wobbly black outlines; NO moustache, NO beard, NO hat, NO glasses. '
      'Use the SECOND reference picture for the place and the tiny coach: the same cozy evening living room with a mustard-yellow sofa, and the tiny coach character '
      '(a very small stick figure with a round white head, a red headband, a blue tracksuit with white stripes, holding a yellow megaphone). ')
END = (' High-impact YouTube thumbnail, wide 16:9, edge to edge, huge readable expressions, strong contrast, clean white rim outline around the characters so they pop. '
       'Physically correct: Zero sits ON the sofa cushion; the tiny coach stands ON TOP of Zero\'s head with both feet; the megaphone points UP and AWAY to the upper left, never covering any face. '
       'Absolutely no text, letters, numbers, signs or logos anywhere.')
J = {
 'melt': ('Zero, big on the RIGHT half of the frame (his head about 42% of the frame height), is completely exhausted and melting into the sofa cushion like a puddle: '
          'his body sags, shoulders drooping, half-closed tired eyes with dark circles, mouth slightly open, a small grey ghost-like soul wisp floating out of his head. '
          'Standing on top of his head, the tiny coach shouts energetically through the megaphone pointed up and to the left, sweat and motion lines, fist pumping. '
          'Warm lamp light on the right, the LEFT 42% of the frame is darker and calm (out-of-focus living room) for a headline.'),
 'culprit': ('A dark living room at night with a single dramatic spotlight from above. Zero, big on the RIGHT half (his head about 42% of the frame height), sits on the sofa and slowly '
             'rolls his eyes UPWARD with a suspicious, shocked side-glance, one eyebrow raised, a big sweat drop, as if he just realized who the culprit is. '
             'The tiny coach stands on top of his head in the spotlight, freezing mid-shout with the megaphone held up and pointing away to the upper left, caught red-handed with a guilty startled face. '
             'Strong spotlight cone, deep shadows, the LEFT 42% of the frame very dark and empty for a headline.'),
}
REF = {'melt': 'ref_coach.png', 'culprit': 'ref_culprit.png'}
vx.token()
for n, kk in enumerate(sys.argv[1:]):
    k, v = kk.split(':')
    if n: time.sleep(8)
    body = {"contents": [{"role": "user", "parts": [{"inlineData": {"mimeType": "image/png", "data": b64('zero_ref.png')}}, {"inlineData": {"mimeType": "image/png", "data": b64(REF[k])}}, {"text": ZE + J[k] + END}]}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    for a in range(4):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(kk, st, str(r)[:150], flush=True); time.sleep(40)
    imgs, _ = vx.inline_parts(r) if st == 200 else ([], '')
    if not imgs: print(kk, 'fail', flush=True); continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((1920, 1080), Image.LANCZOS).save(f'ai/{k}_{v}.png'); print(kk, 'ok', flush=True)
