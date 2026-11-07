"""Mouth-open variants for talking shots -> art/patch/<img>_<V>.png (feathered crop) + patches.json (1920x1080 coords).
step 1 (gen): python3 patches.py gen   step 2 (cut): python3 patches.py cut"""
import json, os, sys, subprocess
import numpy as np
from PIL import Image, ImageFilter
os.chdir(os.path.dirname(os.path.abspath(__file__)))
FOC = json.load(open('../focus.json'))
WHO = {('P1', 'H'): ('han', 'the cheerful man on the right in the light-blue striped shirt (Han)'),
       ('P1', 'Z'): ('zero', 'the man on the left in the burnt-orange sweater holding a paper cup (Zero)'),
       ('O2', 'Z'): ('zero', 'the man (Zero)'),
       ('C1', 'O'): ('mom', 'the older woman with curly hair in the passenger seat on the left side of the image (Mom)'),
       ('C1', 'Z'): ('zero', 'the young man driving on the right side of the image (Zero)'),
       ('W1b', 'O'): ('mom', 'the older woman with curly hair in the light-blue gown (Mom)'),
       ('R1', 'O'): ('mom', 'the older woman lying in the hospital bed (Mom)'),
       ('R1', 'Z'): ('zero', 'the young man sitting on the stool beside the bed (Zero)')}
if sys.argv[1] == 'gen':
    jobs = {}
    for (img, v), (_, who) in WHO.items():
        if not os.path.exists(img + '.png'): continue
        jobs[f'mouth/{img}_{v}'] = {'refs': [img + '.png'], 'ar': '16:9', 'prompt':
            f'Edit the reference image. Reproduce it EXACTLY — identical composition, framing, characters, poses, colors, line art, lighting and background — '
            f'and change ONLY the mouth of {who}: the mouth is now open mid-speech in a natural talking shape (lips parted, a little of the teeth or tongue visible). '
            'Every other pixel stays the same; do not move the head, eyes or hands.'}
    os.makedirs('mouth', exist_ok=True); json.dump(jobs, open('mouth_jobs.json', 'w'), ensure_ascii=False, indent=1)
    subprocess.run([sys.executable, 'gen.py', 'mouth_jobs.json'])
else:
    os.makedirs('patch', exist_ok=True); out = json.load(open('../patches.json')) if os.path.exists('../patches.json') else {}
    for (img, v), (fk, _) in WHO.items():
        mp = f'mouth/{img}_{v}.png'
        if not os.path.exists(mp) or not os.path.exists(img + '.png'): continue
        a = np.asarray(Image.open(img + '.png').convert('RGB')).astype(np.int16); b = np.asarray(Image.open(mp).convert('RGB').resize((a.shape[1], a.shape[0]))).astype(np.int16)
        Hh, Ww = a.shape[:2]; fx, fy = FOC[img][fk]
        x0, x1 = int(max(0, (fx - 0.09) * Ww)), int(min(Ww, (fx + 0.09) * Ww)); y0, y1 = int(max(0, (fy - 0.06) * Hh)), int(min(Hh, (fy + 0.16) * Hh))
        d = np.abs(a - b).sum(2)[y0:y1, x0:x1]
        ys, xs = np.where(d > 90)
        if len(xs) < 40: print(img, v, 'no mouth change found'); continue
        cx, cy = int(np.median(xs)) + x0, int(np.median(ys)) + y0
        sx = max(60, int(np.percentile(xs, 90) - np.percentile(xs, 10))); sy = max(45, int(np.percentile(ys, 90) - np.percentile(ys, 10)))
        bw, bh = int(min(sx * 1.9, Ww * 0.08)) + 30, int(min(sy * 1.9, Hh * 0.08)) + 24
        L, T = cx - bw // 2, cy - bh // 2
        crop = Image.open(mp).convert('RGB').resize((Ww, Hh)).crop((L, T, L + bw, T + bh))
        m = Image.new('L', (bw, bh), 0); yy, xx = np.mgrid[0:bh, 0:bw]
        r = ((xx - bw / 2) / (bw / 2)) ** 2 + ((yy - bh / 2) / (bh / 2)) ** 2
        alpha = np.clip((1 - r) * 2.2, 0, 1) * 255; m = Image.fromarray(alpha.astype(np.uint8)).filter(ImageFilter.GaussianBlur(3))
        crop.putalpha(m); fn = f'patch/{img}_{v}.png'; crop.save(fn)
        s = 1920 / Ww; out.setdefault(img, {})[v] = {'src': 'art/' + fn, 'x': round(L * s, 1), 'y': round(T * s, 1), 'w': round(bw * s, 1), 'h': round(bh * s, 1)}
        print(img, v, 'patch', out[img][v], 'changed px', len(xs))
    json.dump(out, open('../patches.json', 'w'), indent=1)
