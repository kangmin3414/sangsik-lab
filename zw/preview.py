"""움직임 미리보기: 저해상도(960x540)로 빨리 찍어 ① 미리보기 영상 ② 연속 프레임 시트 ③ 움직임 양 그래프를 만든다.
정지 화면 시트만으로는 뻣뻣함이 보이지 않아서 만들었다(2026-11-14 엔진 점검).
  python3 zw/preview.py <anim.html> <timeline.json> t0 t1 [--fps 12] [--out /dev/shm/pv] [--name pv] [--audio mix.wav] [--step 2]
TMPDIR은 /dev/shm 아래로 잡을 것(디스크가 차면 크롬이 멈춘다)."""
import sys, os, json, time, subprocess, argparse
import numpy as np
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw
ap = argparse.ArgumentParser(); ap.add_argument('html'); ap.add_argument('tl'); ap.add_argument('t0', type=float); ap.add_argument('t1', type=float)
ap.add_argument('--fps', type=int, default=12); ap.add_argument('--out', default='/dev/shm/pv'); ap.add_argument('--name', default='pv'); ap.add_argument('--audio'); ap.add_argument('--step', type=int, default=2)
A = ap.parse_args(); html = os.path.abspath(A.html); TL = json.load(open(A.tl)); d = f'{A.out}/{A.name}'; os.makedirs(d, exist_ok=True)
ts = [A.t0 + i / A.fps for i in range(int((A.t1 - A.t0) * A.fps))]; t_start = time.time()
with sync_playwright() as p:
    br = p.chromium.launch(args=['--disable-gpu']); cx = br.new_context(viewport={'width': 1920, 'height': 1080}, device_scale_factor=0.5); pg = cx.new_page()
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + html); pg.evaluate('(tl) => { window.TL = tl; window.PV = true; }', TL); pg.evaluate('window.AI_READY')
    for i, t in enumerate(ts):
        pg.evaluate(f'render({t})'); pg.evaluate('new Promise(r=>requestAnimationFrame(r))'); pg.screenshot(path=f'{d}/p{i:05d}.jpg', type='jpeg', quality=70)
    br.close()
el = time.time() - t_start; print(f'{len(ts)} frames in {el:.1f}s = {el / len(ts) * 1000:.0f} ms/frame', 'errors', errs[:3])
cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(A.fps), '-i', f'{d}/p%05d.jpg']
if A.audio: cmd += ['-ss', str(A.t0), '-t', str(A.t1 - A.t0), '-i', A.audio]
cmd += ['-c:v', 'libx264', '-preset', 'veryfast', '-crf', '24', '-pix_fmt', 'yuv420p', '-r', '24'] + (['-c:a', 'aac', '-b:a', '128k', '-shortest'] if A.audio else []) + [f'{A.out}/{A.name}.mp4']
subprocess.run(cmd, check=True)
# 움직임 양: 이웃 프레임의 밝기 차이 평균(작게 줄여서). 낮은 구간이 길면 화면이 굳어 있다는 뜻
sm = [np.asarray(Image.open(f'{d}/p{i:05d}.jpg').convert('L').resize((192, 108)), dtype=np.float32) for i in range(len(ts))]
mv = [float(np.abs(sm[i] - sm[i - 1]).mean()) for i in range(1, len(sm))]
json.dump({'t0': A.t0, 'fps': A.fps, 'motion': mv}, open(f'{A.out}/{A.name}_motion.json', 'w'))
half = A.fps // 2; rows = [np.mean(mv[i:i + half]) for i in range(0, len(mv), half)]
print('motion per 0.5s:', ' '.join(f'{x:.1f}' for x in rows)); print('median', round(float(np.median(mv)), 2), 'still share(<60% of median)', round(float(np.mean(np.array(mv) < 0.6 * np.median(mv))), 2))
# 연속 프레임 시트(step 프레임마다 한 장)
idx = list(range(0, len(ts), A.step)); cols = 6; w, h = 320, 180; rowsN = (len(idx) + cols - 1) // cols
for part in range(0, rowsN, 8):
    sub = idx[part * cols:(part + 8) * cols]; sh = Image.new('RGB', (w * cols, h * ((len(sub) + cols - 1) // cols)), 'white')
    for k, i in enumerate(sub):
        im = Image.open(f'{d}/p{i:05d}.jpg').resize((w, h)); ImageDraw.Draw(im).text((6, 4), f'{ts[i]:.2f}', fill=(255, 0, 0)); sh.paste(im, ((k % cols) * w, (k // cols) * h))
    sh.save(f'{A.out}/{A.name}_sheet{part // 8}.jpg', quality=78)
print('saved', f'{A.out}/{A.name}.mp4')
