"""QA contact sheets from the encoded video: AI lines (late in line), AI transitions (0.25 s into a run) and a few animation dialogue lines.
usage: python3 qa_sheet.py <video.mp4> <ai js> <dialogue line idx,...>"""
import json, os, re, subprocess, sys
from PIL import Image, ImageDraw
V, AIJS, DLG = sys.argv[1], sys.argv[2], [int(x) for x in sys.argv[3].split(',')]
L = json.load(open('timeline.json'))['lines']
m = re.search(r'const MAP = \{([^}]*)\}', open(AIJS).read(), re.S)
MAP = {int(a): b for a, b in re.findall(r"(\d+): '(\d+)'", m.group(1))}
os.makedirs('qa', exist_ok=True)
def grab(t, p):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.3f}', '-i', V, '-frames:v', '1', '-vf', 'scale=480:270', p], check=True)
    return p
def sheet(items, out):
    cols = 4; rows = (len(items) + cols - 1) // cols
    S = Image.new('RGB', (cols * 490, rows * 280), 'white')
    for k, (lab, p) in enumerate(items):
        im = Image.open(p); d = ImageDraw.Draw(im); d.rectangle([0, 0, 70, 20], fill='black'); d.text((4, 4), lab, fill='white')
        S.paste(im, ((k % cols) * 490, (k // cols) * 280))
    S.save(out, quality=82)
ai = [(str(i), grab(L[i]['t0'] + 0.85 * (L[i]['t1'] - L[i]['t0']), f'qa/ai_{i:02d}.jpg')) for i in sorted(MAP)]
sheet(ai, 'qa_ai_final.jpg')
starts = [i for i in sorted(MAP) if MAP.get(i - 1) != MAP[i]]
tr = []
for i in starts:
    tr.append((f'{i}+.25', grab(L[i]['t0'] - 0.15 + 0.25, f'qa/tr_{i:02d}.jpg')))
    j = i
    while MAP.get(j + 1) == MAP[i]: j += 1
    if j + 1 < len(L) and (j + 1) not in MAP: tr.append((f'{j + 1}+.1', grab(L[j + 1]['t0'] - 0.15 + 0.1, f'qa/to_{j + 1:02d}.jpg')))
sheet(tr, 'qa_ai_trans.jpg')
sheet([(str(i), grab(L[i]['t0'] + 0.6 * (L[i]['t1'] - L[i]['t0']), f'qa/an_{i:02d}.jpg')) for i in DLG], 'qa_anim.jpg')
print(len(ai), len(tr), len(DLG))
