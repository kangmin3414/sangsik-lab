import json, sys
from PIL import Image
T = json.load(open('timeline.json'))['lines']; FPS = 24
def sheet(picks, out, cols=4):
    ims = []
    for i, f in picks:
        l = T[i]; t = (l['t0'] + f * (l['t1'] - l['t0'])) if f >= 0 else l['t0'] + f
        ims.append(Image.open(f'frames/f{int(t * FPS):05d}.jpg').resize((480, 270)))
    rows = (len(ims) + cols - 1) // cols
    S = Image.new('RGB', (cols * 490, rows * 280), 'white')
    for k, im in enumerate(ims): S.paste(im, ((k % cols) * 490, (k // cols) * 280))
    S.save(out, quality=82)
AI = [int(x) for x in sys.argv[1].split(',')]; TR = [int(x) for x in sys.argv[2].split(',')]; AN = [int(x) for x in sys.argv[3].split(',')]
sheet([(i, f) for i in AI for f in (0.3, 0.9)], 'qa_ai_final.jpg')
sheet([(i, f) for i in TR for f in (-0.1, 0.0)] , 'qa_ai_trans.jpg')   # t0-0.1 and t0: the 0.6 s cross-fade / cut
sheet([(i, 0.85) for i in AN], 'qa_anim.jpg')
