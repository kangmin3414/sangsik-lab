"""v5(5분판) 전체 샘플 조립: 문장별 녹음을 1.1배 빠르게, 문장 사이 0.35초·단락 사이 1.0초.
음악: 앞부분 piano_bed → '끝이 없다는 건' 뒤 완전 정적 → 반전부터 warm_bed. usage: python3 build5.py"""
import json, os, subprocess, tempfile
import numpy as np, soundfile as sf, librosa
from PIL import Image, ImageDraw, ImageFont
from voice5 import ITEMS
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
SR = 48000; FPS = 30; W, Hh = 1280, 720
SPEED, GAP, SECGAP, TITLE, ENDCARD = float(os.environ.get('SPEED', 1.0)), 0.40, 1.1, 3.6, 6.0
takes = json.load(open('takes5.json'))

def load(path):
    w, sr = sf.read(path, dtype='float32'); w = w.mean(1) if w.ndim > 1 else w
    if sr != SR: w = librosa.resample(w, orig_sr=sr, target_sr=SR)
    e = np.convolve(np.abs(w), np.ones(480) / 480, 'same'); idx = np.where(e > 0.008)[0]
    w = w[max(0, idx[0] - 480):min(len(w), idx[-1] + 2400)]
    with tempfile.TemporaryDirectory() as d:
        if SPEED == 1.0: pass
        else: sf.write(f'{d}/i.wav', w, SR)
        if SPEED != 1.0: subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f'{d}/i.wav', '-af', f'rubberband=tempo={SPEED}', f'{d}/o.wav'], check=True)
        if SPEED != 1.0: w = sf.read(f'{d}/o.wav', dtype='float32')[0]
    f1, f2 = 480, 1920; w[:f1] *= np.linspace(0, 1, f1); w[-f2:] *= np.linspace(1, 0, f2)
    return w

plan = []; t = 0.8; first = True; title_at = crash_at = warm_at = silence_from = None; mute = []
for i, (k, x, mode) in enumerate(ITEMS):
    if k == 'SEC':
        if not first: t += SECGAP
        if x.startswith('0:35'): title_at = t; t += TITLE + 0.4
        if x.startswith('3:20'): warm_at = t - 0.6
        first = False; plan.append(dict(kind='sec', t=t, text=x)); continue
    if k == 'PAUSE': mute.append((t - 0.1, t + x)); t += x; continue
    w = load(takes[x]['take'])
    if mode == 'whisper': t += 0.8
    plan.append(dict(kind='line', t=t, dur=len(w) / SR, text=x, wav=w))
    if x.startswith('내 발끝'): crash_at = t + len(w) / SR - 0.12
    if x.startswith('끝이 없다는 건'): silence_from = t + len(w) / SR + 0.2
    t += len(w) / SR + GAP
end_at = t + 0.6; END = end_at + ENDCARD; N = int(END * SR)
print('length %.1fs (%d:%04.1f)' % (END, END // 60, END % 60))

vox = np.zeros(N, np.float32); sfx = np.zeros(N, np.float32)
for p in plan:
    if p['kind'] == 'line': a = int(p['t'] * SR); vox[a:a + len(p['wav'])] += p['wav']
rng = np.random.default_rng(3); tt = lambda d: np.arange(int(d * SR)) / SR
def crash():
    x = tt(0.9); thud = np.sin(2 * np.pi * (70 + 60 * np.exp(-x * 25)) * x) * np.exp(-x * 14)
    n = rng.normal(0, 1, len(x)) * np.exp(-x * 9); grains = np.zeros(len(x))
    for _ in range(40):
        s = int(rng.uniform(0.0, 0.5) * SR); L = int(0.012 * SR); grains[s:s + L] += rng.normal(0, 1, L) * np.exp(-np.arange(L) / (0.003 * SR)) * rng.uniform(0.3, 1)
    out = thud * 0.9 + n * 0.25 + grains * 0.5; return (out / np.abs(out).max() * 0.85).astype(np.float32)
def boom():
    x = tt(3.0); return (np.sin(2 * np.pi * np.cumsum(32 + 40 * np.exp(-x * 4)) / SR) * np.exp(-x * 1.4) * 0.8).astype(np.float32)
def beep():   # 기계 불빛의 작은 삐 소리(정적 구간)
    x = tt(0.12); return (np.sin(2 * np.pi * 1000 * x) * np.minimum(1, (0.12 - x) / 0.02) * 0.12).astype(np.float32)
def put(buf, t0, x, g=1.0):
    a = int(t0 * SR); x = x[:max(0, len(buf) - a)]; buf[a:a + len(x)] += x * g
put(sfx, crash_at, crash()); mute.append((crash_at + 0.05, crash_at + 1.6))
put(sfx, title_at, boom(), 0.9)
for k in range(int((warm_at - silence_from) / 1.2)): put(sfx, silence_from + 0.4 + k * 1.2, beep())

def bed(path, skip, length, fin=2.0, fout=3.0):
    y, _ = librosa.load(path, sr=SR, mono=True); y = y[int(skip * SR):]
    while len(y) < length: y = np.concatenate([y, y])
    y = y[:length].copy(); y[:int(fin * SR)] *= np.linspace(0, 1, int(fin * SR)); y[-int(fout * SR):] *= np.linspace(1, 0, int(fout * SR)); return y
mus = np.zeros(N, np.float32)
a = bed('bgm/piano_bed.mp3', 4.0, int(silence_from * SR), fout=2.5); mus[:len(a)] += a
b = bed('bgm/warm_bed.mp3', 0.0, N - int(warm_at * SR), fin=3.0, fout=4.0); mus[int(warm_at * SR):] += b
gate = np.ones(N, np.float32)
for a0, a1 in mute: gate[int(a0 * SR):int(a1 * SR)] = 0
gate = np.convolve(gate, np.ones(4800) / 4800, 'same')
env = np.convolve(np.abs(vox), np.ones(2400) / 2400, 'same'); duck = np.convolve(1 - 0.5 * np.clip(env / 0.04, 0, 1), np.ones(9600) / 9600, 'same')
sf.write('vox5_raw.wav', vox, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'vox5_raw.wav', '-af', 'highpass=f=80,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=2', 'vox5_c.wav'], check=True)
voxc = sf.read('vox5_c.wav', dtype='float32')[0]; voxc = np.pad(voxc, (0, max(0, N - len(voxc))))[:N]
mix = voxc + sfx * 0.6 + mus * 0.35 * duck * gate
sf.write('mix5_raw.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'mix5_raw.wav', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=9,alimiter=limit=0.8,volume=-1dB', '-ar', '48000', 'mix5.wav'], check=True)

F = '/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'; FR = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
fT = ImageFont.truetype(F, 64, index=1); fL = ImageFont.truetype(F, 40, index=1); fS = ImageFont.truetype(FR, 22, index=1); fE = ImageFont.truetype(F, 34, index=1)
def wrap(s, n=24):
    out, line = [], ''
    for w in s.split(' '):
        if len(line) + len(w) + 1 > n and line: out.append(line); line = w
        else: line = (line + ' ' + w).strip()
    return out + [line]
lines = [p for p in plan if p['kind'] == 'line']; secs = [p for p in plan if p['kind'] == 'sec']
proc = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{Hh}', '-r', str(FPS), '-i', '-', '-i', 'mix5.wav',
                         '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', 'sample_v5_full.mp4'], stdin=subprocess.PIPE)
for f in range(int(END * FPS)):
    s = f / FPS; im = Image.new('RGB', (W, Hh), (0, 0, 0)); d = ImageDraw.Draw(im)
    if title_at <= s < title_at + TITLE:
        a = min(1, (s - title_at) / 0.5, (title_at + TITLE - s) / 0.5); c = int(255 * a)
        d.text((W // 2, Hh // 2 - 10), '나는 죽을 수 없다.', font=fT, fill=(c, c, c), anchor='mm')
        d.text((W // 2, Hh // 2 + 60), '상상 실험입니다. 증명되지 않은 가설이에요.', font=fS, fill=(int(c * .55),) * 3, anchor='mm')
    elif s >= end_at:
        a = min(1, (s - end_at) / 0.8); c = int(230 * a)
        d.text((W // 2, Hh // 2), "오늘, '하필 이 세계라서 다행이다' 싶었던 순간 하나, 댓글로.", font=fE, fill=(c, c, c), anchor='mm')
    else:
        cur = [p for p in lines if p['t'] - 0.15 <= s < p['t'] + p['dur'] + 0.3]
        if cur:
            p = cur[-1]; a = min(1, (s - p['t'] + 0.15) / 0.2, (p['t'] + p['dur'] + 0.3 - s) / 0.2); c = int(255 * max(0, a))
            ls = wrap(p['text'])
            for k, ln in enumerate(ls): d.text((W // 2, Hh // 2 - (len(ls) - 1) * 28 + k * 56), ln, font=fL, fill=(c, c, c), anchor='mm')
        if silence_from <= s < warm_at:
            g = int(160 * (0.5 + 0.5 * np.sin(2 * np.pi * s / 1.2)))
            d.ellipse((W // 2 - 6, Hh - 120, W // 2 + 6, Hh - 108), fill=(0, g, 40))
        sc = [p for p in secs if p['t'] <= s]
        if sc: d.text((40, 36), sc[-1]['text'], font=fS, fill=(90, 90, 100))
    proc.stdin.write(im.tobytes())
proc.stdin.close(); proc.wait()
json.dump([{k: v for k, v in p.items() if k != 'wav'} for p in plan], open('plan5.json', 'w'), ensure_ascii=False, indent=1)
print('done sample_v5_full.mp4')
