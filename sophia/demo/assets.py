"""Demo-scene images with Grok Imagine (xAI). Every sprite of a character is an edit of that character's base sprite, so framing
stays (almost) the same and the renderer can patch just the mouth / eyes from the *_open / *_blink variants.
  python3 assets.py  ->  sprites/<char>_<expr>_<closed|open|blink>.png, bg_<name>.png  (cached: existing files are skipped)"""
import io, json, os, sys
from concurrent.futures import ThreadPoolExecutor
from PIL import Image
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'gtts'))
import xai

os.chdir(os.path.dirname(os.path.abspath(__file__)))
os.makedirs('sprites', exist_ok=True)
BG = "Flat solid pure magenta (#FF00FF) background. Clean anime illustration, no text."
KEEP = ("Keep this image exactly identical: same character, pose, framing, position, size, lighting, colors and magenta background. "
        "Change only one thing: ")
BASE = {  # char: (reference sheet, prompt)
 'sophia': ('../img/grok_sheet_sophia_1.png', "Waist-up bust portrait of this exact same character (same face, hair, glasses, owl hair pin, outfit and colors "
            "as the reference sheet), body facing the viewer, centered with empty space above the head. Expression: gentle smile, mouth closed. " + BG),
 'haru': ('../img/grok_sheet_haru_1.png', "Waist-up bust portrait of this exact same character (same face, hair, scrunchie, outfit, ID lanyard and colors "
          "as the reference sheet), body facing the viewer, centered with empty space above the head. Expression: tired and a little sad, "
          "eyebrows lowered, mouth closed. " + BG),
 'minerva': ('../img/sheet_minerva_1.png', "Full-body portrait of this exact same owl character (same feathers, glasses, vest and colors as the reference sheet), "
             "standing and facing the viewer, centered. Expression: grumpy half-closed eyes, beak closed. " + BG),
}
# derived from the base sprite: (char, expr) -> change
DERIVED = {
 ('sophia', 'thinking'): "her expression: thinking, eyes looking up and to the side, one finger touching her chin, mouth closed.",
 ('sophia', 'flustered'): "her expression: flustered and embarrassed, cheeks blushing more, a small sweat drop, awkward smile, mouth closed.",
 ('sophia', 'chiton'): ("her outfit: she now wears an ancient Greek white linen chiton with a gold-trimmed blue himation draped over one shoulder "
                        "and a thin laurel circlet in her hair; keep her glasses, face, hair and gentle closed-mouth smile."),
 ('haru', 'pouting'): "her expression: suspicious pout with narrowed eyes and puffed cheeks, mouth closed.",
}
BASE_EXPR = {'sophia': 'smile', 'haru': 'sad', 'minerva': 'grumpy'}
OPEN = "the mouth is slightly open as if in the middle of speaking."
OPEN_OWL = "the beak is slightly open as if in the middle of speaking."
BLINK = "the eyes are gently closed, as in the middle of a blink."
BLINKS = [('sophia', 'smile'), ('sophia', 'chiton'), ('haru', 'sad'), ('haru', 'pouting')]
BGS = {
 'cafe': ("Interior of a small cozy second-hand book café late at night, around 2 am: tall wooden bookshelves full of old books, "
          "a wooden counter with a coffee machine and warm pendant lamps, a rainy window with city lights blurred outside, a small wooden perch "
          "for an owl near the counter, soft warm lighting, lo-fi calm mood. Wide 16:9 anime background art, no people, no text."),
 'cave': ("Inside a huge dim ancient cave: a row of figures seen from behind, chained and facing a rough stone wall, a fire burning behind them, "
          "large flickering shadows of objects projected on the wall, dramatic warm firelight and deep shadows. Wide 16:9 anime background art, "
          "painterly, no text."),
}


def save(r, path, aspect_from=None):
    st, resp = r
    if st != 200: print(path, st, json.dumps(resp, ensure_ascii=False)[:300]); return False
    im = Image.open(io.BytesIO(xai.images(resp)[0])).convert('RGB')
    if aspect_from: im = im.resize(Image.open(aspect_from).size, Image.LANCZOS)
    im.save(path); print(path, im.size, resp.get('usage')); return True


def p(c, e, s): return f'sprites/{c}_{e}_{s}.png'


def base(c):
    out = p(c, BASE_EXPR[c], 'closed')
    if not os.path.exists(out): save(xai.edit(BASE[c][1], [BASE[c][0]], '3:4'), out)


def derived(ce):
    (c, e), change = ce, DERIVED[ce]
    out = p(c, e, 'closed')
    if not os.path.exists(out): save(xai.edit(KEEP + change, [p(c, BASE_EXPR[c], 'closed')]), out, p(c, BASE_EXPR[c], 'closed'))


def variant(job):
    c, e, s = job
    out, src = p(c, e, s), p(c, e, 'closed')
    if os.path.exists(out) or not os.path.exists(src): return
    change = BLINK if s == 'blink' else (OPEN_OWL if c == 'minerva' else OPEN)
    save(xai.edit(KEEP + change, [src]), out, src)


def background(name):
    out = f'bg_{name}.png'
    if not os.path.exists(out): save(xai.generate(BGS[name], '16:9'), out)


if __name__ == '__main__':
    with ThreadPoolExecutor(4) as ex:
        list(ex.map(base, BASE)); list(ex.map(background, BGS))
        list(ex.map(derived, DERIVED))
        exprs = [(c, BASE_EXPR[c]) for c in BASE] + list(DERIVED)
        list(ex.map(variant, [(c, e, 'open') for c, e in exprs] + [(c, e, 'blink') for c, e in BLINKS]))
