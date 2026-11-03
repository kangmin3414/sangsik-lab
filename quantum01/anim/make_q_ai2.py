import base64, io, json, os, sys, time
from PIL import Image
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
os.chdir(os.path.dirname(os.path.abspath(__file__))); os.makedirs('ai', exist_ok=True)
ref = base64.b64encode(open('chk/t0003.00.jpg','rb').read()).decode()
Z = ('The reference image shows the channel\'s character "Zero": a round white head, simple dot eyes and brows, a plain orange t-shirt, thin stick legs, round white hands, thick slightly wobbly black outlines. ')
STYLE = (' Draw characters exactly in that flat cartoon style, small-to-medium in the frame. Background and setting richer and more detailed than the flat cartoon: layered depth, painterly textured storybook illustration, soft atmospheric light, cinematic wide composition. '
         'Wide 16:9 frame filling the whole canvas edge to edge, no borders. The bottom fifth is plain floor or ground. No text, letters, numbers, signs, logos, watermarks or speech bubbles.')
JOBS = {
 'cat': 'No Zero in this picture. A dim science laboratory: on a wooden table in the center-left sits a closed wooden box with its front cut away, showing a small calm cartoon cat sitting inside, next to a small glass vial and a tiny glowing atom model with orbiting dots. Right beside the box floats a faint, semi-transparent ghost copy of the same box and cat, as if two states overlap. Mysterious, gentle, not scary. The upper third is a calm dark wall.',
 'zerobox': Z + 'In a dim laboratory, Zero stands calmly inside a large transparent glass cube in the left-center, looking thoughtful, hands at his sides. In front of the cube, a small measuring device with a single glowing lamp sits on a table. Another faint, semi-transparent ghost of the same cube stands beside it. Calm, mysterious, not scary, no weapons or hazards. The upper third is a calm dark wall.',
 'oldzero': Z + 'Zero is now very old: a long white beard, white hair, the same orange t-shirt, sitting alone at the end of a very long dining table in an empty hall. On the table is one birthday cake with a large crowd of tiny lit candles. Around the table are many empty chairs. Warm candle light against cool dark surroundings. Lonely and quiet, not scary. The upper third is a dark ceiling.',
 'sun': Z + 'A vast barren plain at the far future: an enormous swollen red sun fills the sky behind. In the lower left, old Zero with a long white beard and the orange t-shirt sits on a lone chair in front of a small table with one birthday cake with a single candle. No other people. Awe and loneliness, painterly, not scary.',
 'umbrella': 'No people. An empty wooden bench-like chair beside a closed umbrella leaning on it, on a quiet wet street just after rain at evening; puddles reflect warm orange and pink sky, a few shop lights in the background. Soft, melancholic, comforting. The upper third is open evening sky.',
 'momcall': Z + 'Split composition, left half: Zero sits on a park bench at dusk, holding a phone to his ear, a small gentle smile. Right half: in a warm kitchen at home, a middle-aged mother with short black hair, round white head like the character style, in a simple cardigan, holds a phone and laughs softly. A warm thin glowing line connects the two phones across the middle. Warm, tender. The upper third is dusk sky and kitchen wall.',
}
only = sys.argv[1:]
first = True
for k, prompt in JOBS.items():
    if only and k not in only: continue
    out = f'ai/{k}.png'
    if os.path.exists(out): continue
    if not first: time.sleep(15)
    first = False
    body = {"contents":[{"role":"user","parts":[{"inlineData":{"mimeType":"image/jpeg","data":ref}},{"text":prompt+STYLE}]}],
            "generationConfig":{"responseModalities":["IMAGE"],"imageConfig":{"aspectRatio":"16:9","imageSize":"2K"}}}
    for a in range(4):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, json.dumps(r, ensure_ascii=False)[:160], flush=True); time.sleep(45)
    if st != 200: continue
    imgs,_ = vx.inline_parts(r)
    if not imgs: print(k, 'no image', flush=True); continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((1920,1080), Image.LANCZOS).save(out); print(k, 'ok', flush=True)
