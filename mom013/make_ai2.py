"""Ep.013 picture fixes: 02 (1998 room, the baby tucked in under a small blanket) and 06 (the ward after the apology, same room as 05)."""
import base64, io, json, os, sys, time
from PIL import Image
sys.path.insert(0, '../gtts'); import vx
exec(open('make_ai.py').read().split("only = sys.argv")[0].split("JOBS = {")[0])   # ZE, OMd, APd, YMd, EPd, STYLE, CH
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
JOBS = {
 '02': ([CH], f'{YMd} A tiny Korean one-room apartment at night in the late 1990s: the young mother sits on the floor at a low wooden folding table '
       '(center-left), writing in a small notebook with a pen under a small desk lamp, looking tired but gently smiling; right beside her, the baby '
       'sleeps peacefully on a small baby futon mattress, tucked in UNDER a soft little baby blanket that covers the baby up to the chest, only the '
       'round head and one tiny hand peeking out, head resting on a small pillow; old-fashioned details: a boxy CRT television switched off, an old '
       'rice cooker, laundry drying on a rack; a small window shows a dark blue night sky with many small stars. Warm nostalgic sepia-toned color '
       'grading with soft lamplight; humble, loving mood. The upper-left area is plain wall.'),
 '06': ([CH, 'ai/05.png'], f'{ZE} {OMd} {APd} The SAME hospital room as in the second reference picture (same window with sheer curtains, flowers, '
       'water bottle, IV stand, bed and chair), a moment later in the warm late-afternoon light: Mom (center) sits on the chair holding the old worn '
       'notebook on her lap and laughs warmly; Zero (left) stands beside her, smiling with teary eyes, wiping one eye with his hand; Dad sits up in '
       'the hospital bed (right) in his light-blue gown, smiling at the two of them. Heartwarming, relieved, gently funny mood.'),
}
only = sys.argv[1:]; vx.token(); first = True
for k, (refs, prompt) in JOBS.items():
    if only and k not in only: continue
    if not first: time.sleep(15)
    first = False
    parts = [{"inlineData": {"mimeType": "image/png", "data": b64(r)}} for r in refs] + [{"text": prompt + ' ' + STYLE}]
    body = {"contents": [{"role": "user", "parts": parts}], "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    st = None
    for attempt in range(4):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, json.dumps(r, ensure_ascii=False)[:200], flush=True); time.sleep(40)
    if st != 200: continue
    imgs, _ = vx.inline_parts(r)
    if not imgs: print(k, 'no image', flush=True); continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((1920, 1080), Image.LANCZOS).save(f'ai/{k}.png'); print(k, 'ok', flush=True)
