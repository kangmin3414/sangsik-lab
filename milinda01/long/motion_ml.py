"""렌더된 프레임으로 '움직임 지도'를 만든다: 프레임 사이 차이(움직임 양), 컷(급변), 샷 길이, 2초 넘게 거의 멈춘 구간.
   python3 motion_ml.py            # 표를 출력하고 /dev/shm/ml/motion.json에 저장
움직임이 죽은 구간과 너무 긴 샷을 찾아 손볼 곳을 정하는 데 쓴다(자막 상자 영역은 빼고 잰다)."""
import json, os, sys, numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
FR = os.environ.get('ML_FR') or os.path.join(HERE, 'fr'); TL = json.load(open('timeline_ml.json')); FPS = 24; N = len([f for f in os.listdir(FR) if f.endswith('.jpg')])
def im(i): return np.asarray(Image.open(f'{FR}/f{i:05d}.jpg').convert('L').resize((320, 180), Image.BILINEAR), dtype=np.float32)[:150]      # 아래 자막 띠 제외
prev = im(0); d = [0.0]
for i in range(1, N):
    cur = im(i); d.append(float(np.abs(cur - prev).mean())); prev = cur
d = np.array(d); cuts = [i for i in range(1, N) if d[i] > 14 and d[i] > 4 * (np.median(d[max(0, i - 12):i]) + 0.3)]
cuts = [c for k, c in enumerate(cuts) if k == 0 or c - cuts[k - 1] > 6]
def line_at(t):
    cur = None
    for l in TL['lines']:
        if t >= l['t0'] - 0.15: cur = l['id']
    return cur
shots = []; b = [0] + cuts + [N]
for a, e in zip(b[:-1], b[1:]): shots.append({'t0': round(a / FPS, 2), 't1': round(e / FPS, 2), 'len': round((e - a) / FPS, 2), 'line': line_at(a / FPS + 0.2), 'motion': round(float(d[a + 1:e].mean()) if e - a > 1 else 0, 2)})
# 거의 멈춘 구간: 1초 이동 평균이 낮은 곳이 2초 넘게 이어짐
w = np.convolve(d, np.ones(24) / 24, mode='same'); still = []; s0 = None
for i in range(N):
    if w[i] < 0.42:
        if s0 is None: s0 = i
    else:
        if s0 is not None and i - s0 > 48: still.append((round(s0 / FPS, 1), round(i / FPS, 1), line_at(s0 / FPS + 0.5), round(float(w[s0:i].mean()), 2)))
        s0 = None
json.dump({'d': [round(float(x), 2) for x in d], 'shots': shots, 'still': still}, open('/dev/shm/ml/motion.json', 'w'))
print('frames', N, 'shots', len(shots), 'median shot', round(float(np.median([s['len'] for s in shots])), 1), 'mean motion', round(float(d.mean()), 2))
print('긴 샷(6초 넘음):'); [print('  ', s) for s in shots if s['len'] > 6]
print('거의 멈춘 구간(2초 넘음):'); [print('  ', s) for s in still]
