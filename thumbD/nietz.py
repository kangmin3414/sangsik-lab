import base64, io, json, os, sys, time
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, os.path.join(os.path.dirname(HERE), 'gtts')); import vx
exec(open('gen.py').read().split("keys = sys.argv")[0].split("JOBS = {")[0])   # ZE, STYLE
OTHERS = ('Any other people are simple cartoon characters with round white heads in muted grey, navy or beige clothes (never orange), '
          'smaller than Zero or partly out of focus.')
MU = ('In this episode Zero wears a big bushy dark-brown fake mustache like the philosopher Nietzsche, exactly as in the second reference '
      'picture; his head stays pure bright white like paper.')
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
im = Image.open('../nietzsche3/ai/28.png').convert('RGB').resize((1024, 576)); buf = io.BytesIO(); im.save(buf, 'PNG'); ref2 = base64.b64encode(buf.getvalue()).decode()
JOBS = {
 'nietzsche1': ('Early morning on a mountain trail above a turquoise alpine lake with snowy peaks, like Sils Maria in the Swiss Alps. Zero walks '
                'briskly toward the viewer, slightly right of center and big in the frame, holding a small notebook and pencil, chin up, eyes '
                'bright with a quietly inspired, determined smile, wind in the grass. Golden sunrise light on Zero.'),
 'nietzsche2': ('One picture with a soft diagonal transition. LEFT third: a dull grey city street where a crowd of identical grey people all '
                'walk the same direction staring at phones; a small tired Zero is squeezed among them, blank eyes. RIGHT two thirds: a big '
                'joyful Zero standing on a sunny alpine ridge above a turquoise lake, arms wide open, eyes closed, big happy smile, golden light.'),
}
vx.token(); first = True
for k in sys.argv[1:]:
    if not first: time.sleep(12)
    first = False
    parts = [{"inlineData": {"mimeType": "image/png", "data": b64('zero_ref.png')}}, {"inlineData": {"mimeType": "image/png", "data": ref2}},
             {"text": f'{ZE} {MU} {OTHERS} {JOBS[k]} {STYLE}'}]
    body = {"contents": [{"role": "user", "parts": parts}], "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    st = None
    for attempt in range(4):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, json.dumps(r, ensure_ascii=False)[:160], flush=True); time.sleep(40)
    imgs, _ = vx.inline_parts(r) if st == 200 else ([], None)
    if not imgs: print(k, 'failed', flush=True); continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((1920, 1080), Image.LANCZOS).save(f'ai/{k}.png'); print(k, 'ok', flush=True)
