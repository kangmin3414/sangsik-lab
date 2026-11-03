"""예고편 쇼츠 합성: timeline.json + voice.wav + ai/V*.png → 쇼츠_악마는뿔달린괴물이아니다_예고편_v1.mp4 (1080x1920, 24fps, -14 LUFS).
첫 프레임부터 그림(검은 화면 없음) + 450V 계기판이 15→450으로 치솟는 훅. 위: 큰 글자 카드, 아래: 화자별 색 자막.
소리: 낮은 드론 + 시계 초침 + 심장 소리(합성, 저작권 없음), 레버 철컥·전기음·도장 쿵."""
import json, os, subprocess, numpy as np, soundfile as sf
from PIL import Image, ImageDraw, ImageFont, ImageFilter
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); os.makedirs('frames', exist_ok=True)
TL = json.load(open('timeline.json')); L = TL['lines']; DUR = TL['duration'] - 1.2; FPS = 24; W, H = 1080, 1920
F = '/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'; font = lambda s: ImageFont.truetype(F, s, index=1)
from script import S
for l in L: l['args'] = S[l['i']][1]
IM = {k: Image.open(f'ai/{k}.png').convert('RGB') for k in sorted({l['args']['shot'] for l in L})}
COL = {'N': (255, 255, 255), 'Z': (255, 200, 120), 'B': (190, 200, 215), 'E': (170, 225, 255), 'L': (255, 150, 140), 'A': (230, 230, 200)}
def at(t):
    i = 0
    while i + 1 < len(L) and t >= L[i + 1]['t0'] - 0.12: i += 1
    return i
def kb(img, p, shake=0.0, t=0.0):
    z = 1.0 + 0.09 * p; w, h = int(W / z), int(H / z)
    dx = (np.sin(t * 37) * 6 + np.sin(t * 23) * 4) * shake; dy = np.cos(t * 31) * 5 * shake
    x0 = int((W - w) / 2 + dx); y0 = int((H - h) / 2 + dy)
    return img.crop((x0, y0, x0 + w, y0 + h)).resize((W, H), Image.BILINEAR)
def wrap(d, text, f, maxw):
    out, cur = [], ''
    for word in text.split(' '):
        tryw = (cur + ' ' + word).strip()
        if d.textlength(tryw, font=f) <= maxw: cur = tryw
        else: out.append(cur); cur = word
    out.append(cur); return [x for x in out if x]
def stroke_text(d, xy, s, f, fill, sw=10, anchor='mm'):
    d.text(xy, s, font=f, fill=fill, stroke_width=sw, stroke_fill=(16, 18, 30), anchor=anchor)
def meter(d, v, hot):
    x, y = W // 2, 300
    d.rounded_rectangle((x - 270, y - 110, x + 270, y + 110), 30, fill=(20, 22, 30), outline=(255, 80, 70) if hot else (120, 130, 150), width=8)
    stroke_text(d, (x, y), f'{int(v)}V', font(150), (255, 90, 80) if v >= 300 else (255, 220, 120), 0)
prev_shot = None; fade0 = 0.0
N = int(DUR * FPS)
for n in range(N):
    t = n / FPS; i = at(t); l = L[i]; a = l['args']; k = a['shot']
    j = i
    while j > 0 and L[j - 1]['args']['shot'] == k: j -= 1
    s0 = 0 if j == 0 else L[j]['t0'] - 0.12
    j2 = i
    while j2 + 1 < len(L) and L[j2 + 1]['args']['shot'] == k: j2 += 1
    s1 = L[j2 + 1]['t0'] - 0.12 if j2 + 1 < len(L) else DUR
    p = (t - s0) / max(0.5, s1 - s0)
    shake = 1.0 if k in ('V1', 'V2') and a.get('volt', 0) >= 150 else 0.0
    frame = kb(IM[k], p, shake, t)
    if j > 0 and t - s0 < 0.3:   # quick cross-fade from the previous shot
        pk = L[j - 1]['args']['shot']; frame = Image.blend(kb(IM[pk], 1.0, 0, t), frame, (t - s0) / 0.3)
    # darken top and bottom for text
    ov = Image.new('L', (W, H), 0); dd = ImageDraw.Draw(ov)
    for y in range(0, 520): dd.line((0, y, W, y), fill=int(150 * (1 - y / 520)))
    for y in range(1300, H): dd.line((0, y, W, y), fill=int(190 * (y - 1300) / (H - 1300)))
    frame = Image.composite(Image.new('RGB', (W, H), (8, 10, 18)), frame, ov)
    d = ImageDraw.Draw(frame)
    lt = t - (l['t0'] - 0.12)
    if 'volt' in a:
        v = a['volt']
        if i == 0: v = 15 + (450 - 15) * min(1, max(0, lt / 1.4)) ** 0.7     # the hook: the needle races to 450
        elif i > 0 and 'volt' in L[i - 1]['args'] and L[i - 1]['args']['volt'] != a['volt']:
            v0 = L[i - 1]['args']['volt']; v = v0 + (a['volt'] - v0) * min(1, lt / 0.6)
        meter(d, round(v / 15) * 15, v >= 300)
    if a.get('card'):
        f = font(96 if len(a['card']) <= 8 else 76); y = 560 if 'volt' in a else 330
        for m, line in enumerate(wrap(d, a['card'], f, W - 140)): stroke_text(d, (W // 2, y + m * 112), line, f, (255, 226, 122), 12)
    # subtitles (per segment, speaker colour)
    segs = l['segs'] or [{'v': 'N', 'text': l['sub'], 't0': l['t0'], 't1': l['t1']}]
    cur = None
    for sg in segs:
        if t >= sg['t0'] - 0.08 and t <= sg['t1'] + 0.35: cur = sg
    if cur:
        f = font(66); lines = wrap(d, cur['text'], f, W - 160)
        y0 = 1560 - (len(lines) - 1) * 44
        for m, line in enumerate(lines): stroke_text(d, (W // 2, y0 + m * 88), line, f, COL.get(cur['v'], (255, 255, 255)), 10)
    frame.save(f'frames/f{n:05d}.jpg', quality=90)
print('frames', N)
# ---- sound: drone + tick + heartbeat + sfx under the voice ----
SR = 48000; v, sr = sf.read('voice.wav')
if v.ndim > 1: v = v.mean(1)
v = np.interp(np.arange(int(len(v) * SR / sr)) / SR, np.arange(len(v)) / sr, v)[:int(DUR * SR)]
n = int(DUR * SR); v = np.pad(v, (0, n - len(v))); tt = np.arange(n) / SR; rng = np.random.default_rng(7)
drone = 0.05 * np.sin(2 * np.pi * 55 * tt) + 0.03 * np.sin(2 * np.pi * 82.4 * tt + 0.3 * np.sin(tt * 0.5)) + 0.02 * np.convolve(rng.standard_normal(n), np.ones(800) / 800, 'same') * 20
drone *= np.minimum(1, tt / 0.3) * np.minimum(1, (DUR - tt) / 1.2)
fx = np.zeros(n)
def add(at, x, g):
    i = int(at * SR); e = min(n, i + len(x))
    if 0 <= i < n: fx[i:e] += x[:e - i] * g
def env(d, dec): s = np.arange(int(d * SR)) / SR; return s, np.exp(-s * dec)
for k in range(int(DUR)): s, e = env(0.03, 140); add(k + 0.5, np.sin(2 * np.pi * 2400 * s) * e, 0.05)            # clock tick
def beat(at, g):
    for off in (0, 0.22): s, e = env(0.18, 18); add(at + off, np.sin(2 * np.pi * (55 + 20 * e) * s) * e, g)
for k, l in enumerate(L):
    a = l['args']
    if 'volt' in a: s, e = env(0.12, 40); add(l['t0'] - 0.1, rng.standard_normal(len(s)) * e, 0.25)               # lever clunk
    if a.get('volt', 0) >= 150: s, e = env(0.9, 2.5); add(l['t0'], np.sign(np.sin(2 * np.pi * 120 * s)) * e * 0.5, 0.07)   # electric buzz
    if a['shot'] == 'V4': s, e = env(0.3, 14); add(l['t0'] + 0.2, np.sin(2 * np.pi * (70 - 30 * s) * s) * e, 0.5)    # stamp thud
for k in np.arange(L[-2]['t0'], DUR - 0.3, 0.8): beat(k, 0.35)                                                     # heartbeat at the end
s, e = env(1.6, 1.2); add(0.0, np.sign(np.sin(2 * np.pi * 120 * s)) * e * 0.5, 0.09)                             # buzz under the hook
mix = v * 1.0 + drone + fx
sf.write('mix.wav', np.stack([mix, mix], 1).astype(np.float32), SR)
out = '쇼츠_악마는뿔달린괴물이아니다_예고편_v1.mp4'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', str(FPS), '-i', 'frames/f%05d.jpg', '-i', 'mix.wav', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=9',
                '-c:v', 'libx264', '-crf', '19', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2',
                '-shortest', '-movflags', '+faststart', out], check=True)
print('ok', out, round(DUR, 1))
