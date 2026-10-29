"""Nano Banana 2.1 (Google Cloud, billed to the project's credits): three scene samples in the channel's own drawing style,
using two frames from the published animation as style/character references."""
import base64, json, requests, vx
from PIL import Image
import io
def b64(p): return base64.b64encode(open(p, 'rb').read()).decode()
REF_Z, REF_S = 'img/ref_zero.png', 'img/ref_style.png'
STYLE = ("Match the drawing style of the reference images exactly: hand-drawn flat 2D cartoon on warm beige paper, thick slightly wobbly black outlines, "
         "simple shapes, soft flat colors, gentle vignette, cozy educational-documentary mood. Wide 16:9 scene. Do not write any text, letters or numbers in the image.")
JOBS = {
 '1_데카르트_난로방': ([REF_S, REF_Z], "Winter of 1619 in a small German village. Inside a small wooden room warmed by a big tiled stove with a soft orange glow, "
     "the young philosopher from the second reference image (the character with purple curly hair, drawn in the same simple way) sits at a desk with a candle and a few books, "
     "chin on hand, deep in thought. Snow falls outside the window. Quiet, contemplative atmosphere."),
 '2_장자_촛불실험': ([REF_S, REF_Z], "Duncker's candle problem shown as two side-by-side panels on one wall. Left panel: on a table next to a wall lie a candle, a box of matches, "
     "and a small cardboard box full of thumbtacks. Right panel (the solution): the emptied box is pinned to the wall with a thumbtack like a little shelf, "
     "and the lit candle stands on it. Clear, friendly, explanatory composition."),
 '3_붓다_제로_마음챙김': ([REF_Z, REF_S], "The character from the first reference image (Zero: round white head, simple black eyes and eyebrows, orange shirt) sits on a park bench under a tree "
     "in soft morning light. The phone is put away face-down beside him. Eyes gently closed, he is slowly tasting a slice of apple, calm and present. "
     "A few leaves drift down. Peaceful, mindful mood."),
}
for name, (refs, prompt) in JOBS.items():
    parts = [{"inlineData": {"mimeType": "image/png", "data": b64(p)}} for p in refs] + [{"text": prompt + ' ' + STYLE}]
    body = {"contents": [{"role": "user", "parts": parts}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    st, r = vx.generate('gemini-nano-banana-2.1', body)
    if st != 200: print(name, st, json.dumps(r, ensure_ascii=False)[:400]); continue
    imgs, _ = vx.inline_parts(r)
    im = Image.open(io.BytesIO(imgs[-1][1])).convert('RGB')
    out = f'img/이미지샘플_나노바나나2.1_{name}.png'; im.save(out)
    print(name, im.size, r.get('usageMetadata', {}).get('candidatesTokenCount'))
