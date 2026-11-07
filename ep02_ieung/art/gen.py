"""Ep.02 webtoon-style art (Gemini image model on the project's GCP credits).
usage: python3 gen.py <job.json> [keys...]   job.json = {key: {"refs": [...], "prompt": "...", "ar": "16:9"}}
Output art/<key>.png. Skips keys whose png exists (delete to redo)."""
import base64, io, json, os, sys, time
from PIL import Image
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
STYLE = ('Art style: original Korean webtoon illustration — clean thin dark-brown line art, soft cel shading with gentle gradients, warm natural '
         'colors, realistic adult proportions (about seven heads tall), expressive faces; small comic emotion marks (sweat drop, blush lines, '
         'shock lines) only where the prompt asks; detailed but uncluttered Korean everyday backgrounds; soft cinematic lighting. '
         'Absolutely no text, letters, numbers, speech bubbles, logos or watermarks anywhere in the image.')
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
jobs = json.load(open(sys.argv[1], encoding='utf-8')); only = sys.argv[2:]; first = True
for k, j in jobs.items():
    if only and k not in only: continue
    out = f'{k}.png'
    if os.path.exists(out): continue
    if not first: time.sleep(8)
    first = False
    parts = [{"inlineData": {"mimeType": "image/png" if r.endswith('png') else "image/jpeg", "data": b64(r)}} for r in j.get('refs', [])]
    parts.append({"text": j['prompt'] + ' ' + STYLE})
    body = {"contents": [{"role": "user", "parts": parts}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": j.get('ar', '16:9'), "imageSize": "2K"}}}
    for attempt in range(4):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, json.dumps(r, ensure_ascii=False)[:200], flush=True); time.sleep(30)
    imgs, txt = vx.inline_parts(r)
    if not imgs: print(k, 'NO IMAGE', txt[:200], flush=True); continue
    Image.open(io.BytesIO(imgs[0][1])).convert('RGB').save(out); print(k, 'ok', flush=True)
