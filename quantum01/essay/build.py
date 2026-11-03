"""v4 에세이 샘플 조립(박자 없음): 문장 사이 0.45초, 단락 사이 1.4초, 정적 표시는 그대로. 피아노 배경, 벽돌 깨짐 효과음.
usage: python3 build.py"""
import json, os, subprocess
import numpy as np, soundfile as sf, librosa
from PIL import Image, ImageDraw, ImageFont
from voice import ITEMS
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
SR = 48000; FPS = 30; W, Hh = 1280, 720
takes = json.load(open('takes.json'))
GAP, SECGAP, TITLE = 0.45, 1.4, 4.0

def load(path):
    w, sr = sf.read(path, dtype='float32'); w = w.mean(1) if w.ndim > 1 else w
    if sr != SR: w = librosa.resample(w, orig_sr=sr, target_sr=SR)
    e = np.convolve(np.abs(w), np.ones(480) / 480, 'same'); idx = np.where(e > 0.008)[0]
    w = w[max(0, idx[0] - 480):min(len(w), idx[-1] + 2400)].copy()
    f1, f2 = 480, 1920; w[:f1] *= np.linspace(0, 1, f1); w[-f2:] *= np.linspace(1, 0, f2)
    return w

# ---- 배치 ----
plan = []; t = 1.0; first = True; title_at = None; crash_at = None; mute = []
for i, (k, x, _) in enumerate(ITEMS):
    if k == 'SEC':
        if not first: t += SECGAP
        if x.startswith('0:45'):            # 첫 단락 뒤 제목 화면
            title_at = t; t += TITLE + 0.6
        first = False; plan.append(dict(kind='sec', t=t, text=x)); continue
    if k == 'PAUSE':
        mute.append((t - 0.1, t + x)); t += x; continue
    w = load(takes[str(i)]['take'])
    plan.append(dict(kind='line', t=t, dur=len(w) / SR, text=x, wav=w))
    if x.startswith('내 발끝'): crash_at = t + len(w) / SR - 0.15
    t += len(w) / SR + GAP
END = t + 3.0; N = int(END * SR)
print('length %.1fs' % END)

vox = np.zeros(N, np.float32); sfx = np.zeros(N, np.float32)
for p in plan:
    if p['kind'] == 'line': a = int(p['t'] * SR); vox[a:a + len(p['wav'])] += p['wav']
rng = np.random.default_rng(3); tt = lambda d: np.arange(int(d * SR)) / SR
def crash():   # 벽돌이 깨지는 소리: 짧은 저음 충격 + 부서지는 잡음 알갱이들
    x = tt(0.9); thud = np.sin(2 * np.pi * (70 + 60 * np.exp(-x * 25)) * x) * np.exp(-x * 14)
    n = rng.normal(0, 1, len(x)) * np.exp(-x * 9); grains = np.zeros(len(x))
    for _ in range(40):
        s = int(rng.uniform(0.0, 0.5) * SR); L = int(0.012 * SR); grains[s:s + L] += rng.normal(0, 1, L) * np.exp(-np.arange(L) / (0.003 * SR)) * rng.uniform(0.3, 1)
    out = thud * 0.9 + n * 0.25 + grains * 0.5; return (out / np.abs(out).max() * 0.85).astype(np.float32)
def boom():
    x = tt(3.0); return (np.sin(2 * np.pi * np.cumsum(32 + 40 * np.exp(-x * 4)) / SR) * np.exp(-x * 1.4) * 0.8).astype(np.float32)
def put(buf, t0, x, g=1.0):
    a = int(t0 * SR); x = x[:max(0, len(buf) - a)]; buf[a:a + len(x)] += x * g
if crash_at: put(sfx, crash_at, crash(), 1.0); mute.append((crash_at + 0.05, crash_at + 1.6))
if title_at: put(sfx, title_at, boom(), 0.9)

y, _ = librosa.load('bgm/piano_bed.mp3', sr=SR, mono=True); y = y[int(4.0 * SR):]   # 첫 4초는 건너뜀(Whisper 오탐 구간)
while len(y) < N: y = np.concatenate([y, y])
mus = y[:N].copy(); fi = int(2.0 * SR); mus[:fi] *= np.linspace(0, 1, fi); mus[-int(3 * SR):] *= np.linspace(1, 0, int(3 * SR))
gate = np.ones(N, np.float32)
for a0, a1 in mute: gate[int(a0 * SR):int(a1 * SR)] = 0
gate = np.convolve(gate, np.ones(4800) / 4800, 'same')     # 0.1초로 부드럽게 끊고, 다시 들어올 때 서서히
env = np.convolve(np.abs(vox), np.ones(2400) / 2400, 'same'); duck = np.convolve(1 - 0.5 * np.clip(env / 0.04, 0, 1), np.ones(9600) / 9600, 'same')
sf.write('vox_raw.wav', vox, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'vox_raw.wav', '-af', 'highpass=f=80,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=2', 'vox_c.wav'], check=True)
voxc = sf.read('vox_c.wav', dtype='float32')[0]; voxc = np.pad(voxc, (0, max(0, N - len(voxc))))[:N]
mix = voxc + sfx * 0.6 + mus * 0.35 * duck * gate
sf.write('mix_raw.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'mix_raw.wav', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=9,alimiter=limit=0.8,volume=-1dB', '-ar', '48000', 'mix.wav'], check=True)

# ---- 확인용 영상: 1분과학식 검은 바탕 흰 글씨 ----
F = '/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'; FR = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
fT = ImageFont.truetype(F, 64, index=1); fL = ImageFont.truetype(F, 40, index=1); fS = ImageFont.truetype(FR, 22, index=1)
def wrap(s, n=24):
    out, line = [], ''
    for w in s.split(' '):
        if len(line) + len(w) + 1 > n and line: out.append(line); line = w
        else: line = (line + ' ' + w).strip()
    return out + [line]
lines = [p for p in plan if p['kind'] == 'line']; secs = [p for p in plan if p['kind'] == 'sec']
proc = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{Hh}', '-r', str(FPS), '-i', '-', '-i', 'mix.wav',
                         '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', 'sample_essay.mp4'], stdin=subprocess.PIPE)
for f in range(int(END * FPS)):
    s = f / FPS; im = Image.new('RGB', (W, Hh), (0, 0, 0)); d = ImageDraw.Draw(im)
    if title_at and title_at <= s < title_at + TITLE:
        a = min(1, (s - title_at) / 0.6, (title_at + TITLE - s) / 0.6); c = int(255 * a)
        d.text((W // 2, Hh // 2 - 10), '나는 죽을 수 없다.', font=fT, fill=(c, c, c), anchor='mm')
        d.text((W // 2, Hh // 2 + 60), '상상 실험입니다. 증명되지 않은 가설이에요.', font=fS, fill=(int(c * .55),) * 3, anchor='mm')
    else:
        cur = [p for p in lines if p['t'] - 0.15 <= s < p['t'] + p['dur'] + 0.35]
        if cur:
            p = cur[-1]; a = min(1, (s - p['t'] + 0.15) / 0.25, (p['t'] + p['dur'] + 0.35 - s) / 0.25); c = int(255 * max(0, a))
            ls = wrap(p['text'])
            for k, ln in enumerate(ls): d.text((W // 2, Hh // 2 - (len(ls) - 1) * 28 + k * 56), ln, font=fL, fill=(c, c, c), anchor='mm')
        sc = [p for p in secs if p['t'] <= s]
        if sc: d.text((40, 36), sc[-1]['text'], font=fS, fill=(90, 90, 100))
    proc.stdin.write(im.tobytes())
proc.stdin.close(); proc.wait()
json.dump([{k: v for k, v in p.items() if k != 'wav'} for p in plan], open('plan_used.json', 'w'), ensure_ascii=False, indent=1)
print('done sample_essay.mp4')
