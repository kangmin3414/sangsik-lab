import numpy as np, json, os, sys
from PIL import Image
from concurrent.futures import ProcessPoolExecutor
N = len(os.listdir('frames'))
def load(i):
    im = Image.open(f'frames/f{i:05d}.jpg').convert('L').resize((240, 135), Image.BILINEAR)
    return np.asarray(im, np.float32)
def chunk(r):
    a, b = r; out = []
    prev = load(a)
    for i in range(a + 1, b):
        cur = load(i)
        # ignore subtitle band (bottom 22%) where text changes legitimately
        d = np.abs(cur[:105] - prev[:105])
        out.append((i, float(d.mean()), float((d > 40).mean())))
        prev = cur
    return out
if __name__ == '__main__':
    K = 2; step = N // K + 1; rs = [(k * step, min(N, (k + 1) * step + 1)) for k in range(K)]
    with ProcessPoolExecutor(K) as ex: res = [x for r in ex.map(chunk, rs) for x in r]
    res = sorted(set(res)); json.dump(res, open('qa/diffs.json', 'w'))
    print(len(res))
