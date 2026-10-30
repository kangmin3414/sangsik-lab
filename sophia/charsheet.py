"""Character sheets and expression sprites for the new channel (Nano Banana 2.1, billed to the project's free-trial credits).
  python3 charsheet.py sheet [char [count]] -> img/sheet_<char>_<n>.png (next free n), two candidates per character by default; save the chosen one as img/ref_<char>.png
  python3 charsheet.py expr sophia      -> img/sophia/<expr>_closed.png, _open.png (+ _blink.png for neutral/smile), plus *_cut.png with alpha (magenta keyed out)
Characters are adults in modest everyday clothes; never name an existing anime, artist or studio in a prompt (see PLAN.md §4)."""
import base64, io, json, os, sys
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'gtts'))
import vx

MODEL = 'gemini-nano-banana-2.1'
STYLE = ("Original character design in a clean modern Korean-webtoon / anime illustration style, soft cel shading, warm muted palette, "
         "not resembling any existing character or franchise. Adult proportions. Modest everyday clothing, no school uniform, non-sexualized. "
         "Flat solid pure magenta (#FF00FF) background with no shadows on it. Do not write any text, letters or numbers in the image.")
CHARS = {
 'sophia': "a 19-year-old young adult woman, a university freshman working the night shift at a cozy book café, adult proportions (not childlike). "
           "Beautiful anime-heroine face: large sparkling amber eyes with bright highlights, soft rosy cheeks, gentle shy smile, fresh youthful look. "
           "Long glossy dark navy hair with soft wispy bangs and a loose side braid tied with a small cream ribbon, a small owl-feather hair pin, "
           "thin round gold-rimmed glasses. Outfit: white blouse with a soft frilled round collar and a thin brown ribbon bow at the neck, "
           "oversized pale-cream cable-knit cardigan with sleeves slightly covering her hands, long flowy dark-olive midi skirt with a tiny floral print, "
           "short brown café apron with an owl embroidery, brown Mary Jane shoes with white ankle socks",
 'haru':   "a 23-year-old woman, bright cheerful face, orange-brown hair in a high ponytail, large expressive green eyes, light-blue office blouse "
           "with a company ID card on a lanyard, beige slacks, white sneakers, a canvas tote bag",
 'minerva': "a small round grey-brown owl mascot with big golden eyes and tiny round reading glasses, cute but slightly grumpy look",
}
EXPR = {  # sprite key -> expression
 'neutral': "calm, gentle neutral expression", 'smile': "soft warm smile", 'laugh': "laughing happily, eyes curved",
 'surprised': "surprised, eyes wide", 'thinking': "thinking, finger on chin, eyes looking up", 'serious': "serious and focused",
 'flustered': "flustered, light blush, sweat drop", 'playful': "playful, one eye winking", 'sad': "a little sad, eyebrows lowered",
 'pouting': "mildly annoyed pout, cute not angry", 'moved': "moved, eyes slightly teary, small smile", 'excited': "excited, sparkling eyes, leaning forward",
}
OWL_EXPR = ['neutral', 'surprised', 'serious', 'pouting', 'laugh', 'sad']
BLINK = {'neutral', 'smile'}


def b64(p): return base64.b64encode(open(p, 'rb').read()).decode()


def gen(prompt, refs=(), aspect='16:9'):
    parts = [{"inlineData": {"mimeType": "image/png", "data": b64(p)}} for p in refs] + [{"text": prompt}]
    body = {"contents": [{"role": "user", "parts": parts}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": aspect, "imageSize": "2K"}}}
    st, r = vx.generate(MODEL, body)
    if st != 200: print(st, json.dumps(r, ensure_ascii=False)[:400]); return None
    imgs, _ = vx.inline_parts(r)
    return Image.open(io.BytesIO(imgs[-1][1])).convert('RGB') if imgs else None


def cut(im):
    """Magenta screen to alpha (no character uses magenta), with despill only on a 2-px rim around the cut-out."""
    a = np.asarray(im).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    key = (r > 120) & (b > 120) & (g < np.minimum(r, b) * 0.6)
    rim = np.zeros_like(key)
    for dy in (-2, -1, 0, 1, 2):
        for dx in (-2, -1, 0, 1, 2):
            rim |= np.roll(np.roll(key, dy, 0), dx, 1)
    rim &= ~key & (r > g) & (b > g)
    out = a.copy()  # on the rim, pull the magenta cast (r and b) halfway toward g
    out[..., 0] = np.where(rim, (r + g) / 2, r)
    out[..., 2] = np.where(rim, (b + g) / 2, b)
    return Image.fromarray(np.dstack([out, np.where(key, 0, 255)]).astype(np.uint8), 'RGBA')


def save(im, path):
    im.save(path); cut(im).save(path.replace('.png', '_cut.png')); print(path, im.size)


def sheet(names=None, count=2):
    os.makedirs('img', exist_ok=True)
    for name in names or CHARS:
        what = ("Character reference sheet of " + CHARS[name] + ": full-body front view, three-quarter view and back view standing side by side, "
                "plus one head close-up, same outfit in every view. ")
        n = 1
        for _ in range(count):
            while os.path.exists(f'img/sheet_{name}_{n}.png'): n += 1
            im = gen(what + STYLE)
            if im: im.save(f'img/sheet_{name}_{n}.png'); print(name, n, im.size)


def expr(name):
    ref = f'img/ref_{name}.png'
    if not os.path.exists(ref): sys.exit(f'{ref} 없음: sheet 결과 중 하나를 골라 이 이름으로 저장하세요')
    os.makedirs(f'img/{name}', exist_ok=True)
    keys = OWL_EXPR if name == 'minerva' else list(EXPR)
    frame = "Full body, centered" if name == 'minerva' else "Waist-up bust portrait, body turned slightly toward the viewer, centered"
    for k in keys:
        base = f'img/{name}/{k}_closed.png'
        if not os.path.exists(base):
            im = gen(f"The exact same character as the reference sheet ({CHARS[name]}). {frame}. Expression: {EXPR[k]}. Mouth closed. " + STYLE, [ref], '3:4')
            if not im: continue
            save(im, base)
        if name == 'minerva': continue
        edits = {'open': "mouth slightly open as if mid-sentence"}
        if k in BLINK: edits['blink'] = "eyes gently closed as in a blink"
        for tag, change in edits.items():
            p = f'img/{name}/{k}_{tag}.png'
            if os.path.exists(p): continue
            im = gen(f"Keep this image exactly identical — same character, pose, outfit, framing, lighting and background — and change only one thing: {change}.",
                     [base], '3:4')
            if im: save(im, p)


if __name__ == '__main__':
    if sys.argv[1:2] == ['sheet']: sheet(sys.argv[2:3] or None, int(sys.argv[3]) if len(sys.argv) > 3 else 2)
    elif sys.argv[1:2] == ['expr'] and len(sys.argv) > 2: expr(sys.argv[2])
    else: print(__doc__)
