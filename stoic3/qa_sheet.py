"""Contact sheets from the rendered frames: AI lines (mid + late), the cuts in/out of AI runs, and a sample of the animated lines."""
import json, os
from PIL import Image
here = os.path.dirname(os.path.abspath(__file__)); os.chdir(here)
L = json.load(open('timeline.json'))['lines']; FPS = 24
fr = lambda t: f'frames/f{int(t * FPS):05d}.jpg'
def sheet(shots, out, cols=4):
    rows = (len(shots) + cols - 1) // cols
    S = Image.new('RGB', (cols * 490, rows * 280), 'white')
    for k, t in enumerate(shots):
        if os.path.exists(fr(t)): S.paste(Image.open(fr(t)).resize((480, 270)), ((k % cols) * 490, (k // cols) * 280))
    S.save(out, quality=85)
AI = [1, 9, 15, 16, 19, 20, 24, 28, 32, 36]
sheet([L[i]['t0'] + f * (L[i]['t1'] - L[i]['t0']) for i in AI for f in (0.35, 0.95)], 'qa_ai_final.jpg')
tr = []
for i in (1, 9, 15, 19, 24, 28, 32, 36):
    tr += [L[i]['t0'] - 0.3, L[i]['t0'] - 0.15 + 0.1, L[i]['t0'] - 0.15 + 0.45]
for b in (1, 9, 16, 20, 24, 28, 32, 36):
    tr += [L[b + 1]['t0'] - 0.15 + 0.1]
sheet(tr, 'qa_ai_trans.jpg')
sheet([L[i]['t0'] + 0.7 * (L[i]['t1'] - L[i]['t0']) for i in (0, 2, 4, 5, 7, 8, 10, 12, 17, 22, 26, 30, 34, 38, 39, 42, 44, 46, 47, 48)], 'qa_anim.jpg')
print('ok')
