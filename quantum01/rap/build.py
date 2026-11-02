"""양자 불멸 랩 플로우 샘플(A+B): 100 BPM, 한 줄 = 한 마디, 모든 줄이 마디 첫 박에 꽂힌다.
마디보다 긴 녹음은 rubberband로 마디의 94% 안에 들어가게 압축(최대 1.35배). usage: python3 build.py"""
import json, math, os, subprocess, tempfile
import numpy as np, soundfile as sf, librosa
from PIL import Image, ImageDraw, ImageFont
from lyrics import BARS, BPM
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
SR = 48000; BEAT = 60 / BPM; FPS = 30; W, Hh = 1280, 720
takes = json.load(open('takes.json'))
T = lambda b: int(round(b * BEAT * SR))

def trim(w):
    e = np.convolve(np.abs(w), np.ones(480) / 480, 'same'); idx = np.where(e > 0.008)[0]
    return w[max(0, idx[0] - int(0.012 * SR)):min(len(w), idx[-1] + int(0.06 * SR))]
def load_voice(path, slot):
    w, sr = sf.read(path, dtype='float32'); w = w.mean(1) if w.ndim > 1 else w
    if sr != SR: w = librosa.resample(w, orig_sr=sr, target_sr=SR)
    w = trim(w); limit = slot * 0.94; r = len(w) / SR / limit
    if r > 1:
        r = min(r, 1.35)
        with tempfile.TemporaryDirectory() as d:
            sf.write(f'{d}/i.wav', w, SR)
            subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f'{d}/i.wav', '-af', f'rubberband=tempo={r:.4f}:transients=crisp', f'{d}/o.wav'], check=True)
            w, _ = sf.read(f'{d}/o.wav', dtype='float32')
    f1, f2 = int(0.006 * SR), int(0.03 * SR); w[:f1] *= np.linspace(0, 1, f1); w[-f2:] *= np.linspace(1, 0, f2)
    return w, r

# ---- 배치 ----
plan = []; t = 0; sec_start = {}
for i, b in enumerate(BARS):
    if b[0] == 'SEC': sec_start[b[1]] = t; continue
    if b[0] == 'X': plan.append(dict(kind='x', beat=t, beats=b[1] * 4, sfx=b[2]['sfx'], vis=b[2]['vis'])); t += b[1] * 4; continue
    o = b[2]; slot = o['bars'] * 4
    w, r = load_voice(takes[str(i)]['take'], slot * BEAT)
    plan.append(dict(kind='v', beat=t, beats=slot, text=b[1], sfx=o['sfx'], vis=o['vis'], wav=w, stretch=round(r, 2))); t += slot
END = t; N = T(END) + SR
print('length %.1fs, %d bars' % (END * BEAT, END // 4), {k: round(v * BEAT, 1) for k, v in sec_start.items()})
print('compressed lines:', [(p['text'][:10], p['stretch']) for p in plan if p['kind'] == 'v' and p['stretch'] > 1])

# ---- 효과음 ----
rng = np.random.default_rng(7); tt = lambda d: np.arange(int(d * SR)) / SR
def kick():
    x = tt(0.35); f = 45 + 80 * np.exp(-x * 30); return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 8)).astype(np.float32)
def whoosh(p=1.0):
    x = tt(0.5); n = rng.normal(0, 1, len(x)); S = np.fft.rfft(n); fr = np.fft.rfftfreq(len(n), 1 / SR)
    S *= np.exp(-((np.log(fr + 1) - np.log(2500 * p)) ** 2) / 1.2); n = np.fft.irfft(S, len(n)); n /= np.abs(n).max()
    return (n * np.minimum(1, x / 0.015) * np.exp(-x * 8) * 0.6 + np.sin(2 * np.pi * 80 * p * x) * np.exp(-x * 25) * 0.5).astype(np.float32)
def horn():
    x = tt(0.9); s = sum(np.sign(np.sin(2 * np.pi * f * x)) * 0.5 + np.sin(2 * np.pi * f * x) for f in (277, 349))
    s = np.convolve(s * np.minimum(1, x / 0.03) * np.minimum(1, (0.9 - x) / 0.12), np.ones(12) / 12, 'same'); return (s / np.abs(s).max() * 0.7).astype(np.float32)
def boom(d=3.0):
    x = tt(d); f = 32 + 40 * np.exp(-x * 4); return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 1.4) * 0.9).astype(np.float32)
def put(buf, b, x, g=1.0):
    a = T(b)
    if a < 0: x = x[-a:]; a = 0
    if a < len(buf): x = x[:len(buf) - a]; buf[a:a + len(x)] += x * g

vox = np.zeros(N, np.float32); sfx = np.zeros(N, np.float32); mute = []; tick_end = None; drop = None
for p in plan:
    b, s = p['beat'], p['sfx']
    if p['kind'] == 'v':
        put(vox, b - 0.02, p['wav'])          # 자음이 박에 정확히 닿도록 0.02박(12ms) 당김
        if s == '촤악': put(sfx, b, whoosh(), 0.8)
        if s == '촤악x3':
            for k in range(3): put(sfx, b + k, whoosh(1 + 0.15 * k), 0.8)
        if s == '째깍 멈춤': tick_end = b + 4
        if s == '드롭': drop = b; put(sfx, b, kick(), 1.0); put(sfx, b, boom(1.5), 0.9); mute.append((b + 0.3, b + 8))
    else:
        if '경적' in s: put(sfx, b, horn(), 0.9); mute.append((b, b + 4))
        if '붐' in s: put(sfx, b, boom(), 1.0)
        if '매 박' in s:
            for k in range(p['beats']): put(sfx, b + k, whoosh(1 + 0.1 * k), 0.75)

# ---- 음악: 4분음표 위상 + 다운비트(저역이 센 박)를 찾아 격자에 맞춤 ----
def bed(path, b0, b1, downbeat=True):
    y, _ = librosa.load(path, sr=SR, mono=True)
    yl = librosa.resample(y, orig_sr=SR, target_sr=22050); hop = 64; fr = 22050 / hop
    o = librosa.onset.onset_strength(y=yl, sr=22050, hop_length=hop); per = BEAT * fr; idx = np.arange(0, len(o) - per, per)
    off = max((o[(idx + ph).astype(int)].mean(), ph / fr) for ph in np.linspace(0, per, 64, endpoint=False))[1]
    if downbeat:
        low = librosa.onset.onset_strength(S=librosa.feature.melspectrogram(y=yl, sr=22050, hop_length=hop, fmax=150, n_mels=16), sr=22050, hop_length=hop)
        bi = (off * fr + np.arange(0, len(low) - per, per)).astype(int); bi = bi[bi < len(low)]
        rot = int(np.argmax([low[bi[k::4]].mean() for k in range(4)])); off += rot * BEAT
    y = y[int(off * SR):]; L = T(b1) - T(b0); y = np.pad(y, (0, max(0, L - len(y))))[:L]
    fi, fo = int(0.3 * SR), int(1.0 * SR); y[:fi] *= np.linspace(0, 1, fi); y[-fo:] *= np.linspace(1, 0, fo)
    print(os.path.basename(path), 'offset %.3fs' % off); return y
mus = np.zeros(N, np.float32); bB = sec_start['B. 갈라지는 우주']
a = bed('bgm/A_intro.mp3', 0, bB + 1); mus[:len(a)] += a * 0.9
bb = bed('bgm/B_beat.mp3', bB, END + 1); mus[T(bB):T(bB) + len(bb)] += bb
gate = np.ones(N, np.float32)
for a0, a1 in mute: gate[T(a0):T(a1)] = 0
gate = np.convolve(gate, np.ones(600) / 600, 'same')
if tick_end is not None:
    x = tt(0.04); tk = (np.sin(2 * np.pi * 2600 * x) * np.exp(-x * 140) * 0.3).astype(np.float32)
    for k in range(0, tick_end): put(sfx, k, tk, 0.7 * (0 if any(a0 <= k < a1 for a0, a1 in mute) else 1))
# 목소리: 압축해서 앞으로, 음악은 살짝만 덕킹(랩은 비트 위에 얹힌다)
sf.write('vox_raw.wav', vox, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'vox_raw.wav', '-af', 'highpass=f=90,acompressor=threshold=-22dB:ratio=4:attack=4:release=80:makeup=4,equalizer=f=3000:t=q:w=1:g=2.5', 'vox_c.wav'], check=True)
voxc, _ = sf.read('vox_c.wav', dtype='float32'); voxc = np.pad(voxc, (0, max(0, N - len(voxc))))[:N]
env = np.convolve(np.abs(voxc), np.ones(1200) / 1200, 'same'); duck = np.convolve(1 - 0.35 * np.clip(env / 0.04, 0, 1), np.ones(2400) / 2400, 'same')
mix = voxc + sfx * 0.55 + mus * 0.42 * duck * gate
sf.write('mix_raw.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'mix_raw.wav', '-af', 'loudnorm=I=-13.5:TP=-1.5:LRA=8,alimiter=limit=0.8,volume=-1dB', '-ar', '48000', 'mix.wav'], check=True)

# ---- 확인용 영상 ----
F = '/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'; FR = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
fBig = ImageFont.truetype(F, 52, index=1); fSm = ImageFont.truetype(FR, 22, index=1); fCnt = ImageFont.truetype(F, 34, index=1)
marks = []
for p in plan:
    for k, v in (('둘로 갈라진다', '1/2'), ('화분', '1/4'), ('비행기', '1/8'), ('심장', '1/16')):
        if p['kind'] == 'v' and k in p['text']: marks.append((p['beat'], v))
    if p['kind'] == 'x' and '매 박' in p['sfx']:
        for k, v in enumerate(['1/32', '1/256', '1/4,096', '1/65,536', '1/1,048,576', '0.0001%', '0.00003%', '0.00001%']): marks.append((p['beat'] + k, v))
proc = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{Hh}', '-r', str(FPS), '-i', '-', '-i', 'mix.wav',
                         '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', 'sample_rap_AB.mp4'], stdin=subprocess.PIPE)
for f in range(int((END + 1) * BEAT * FPS)):
    fb = f / FPS / BEAT; bi = int(fb); ph = fb - bi
    im = Image.new('RGB', (W, Hh), (10, 12, 18)); d = ImageDraw.Draw(im)
    cur = [p for p in plan if p['beat'] <= fb]; p = cur[-1] if cur else None
    if p and p['kind'] == 'v' and fb < p['beat'] + p['beats']:
        sc = 1 + 0.06 * max(0, 1 - (fb - p['beat']) * 4)       # 마디 첫 박에 글자가 살짝 튐
        fnt = ImageFont.truetype(F, int(52 * sc), index=1)
        d.text((W // 2, 430), p['text'], font=fnt, fill=(255, 255, 255), anchor='mm')
    if p and '제목' in (p.get('vis') or '') and p['kind'] == 'x':
        d.text((W // 2, 330), '나는 결코 죽을 수 없다', font=fBig, fill=(240, 240, 240), anchor='mm')
        d.text((W // 2, 395), '상상 실험입니다. 증명되지 않은 가설이에요', font=fSm, fill=(150, 150, 160), anchor='mm')
    if p and p.get('vis'): d.text((40, 90), '화면: ' + p['vis'], font=fSm, fill=(120, 130, 150))
    c = [v for b0, v in marks if b0 <= fb]
    if c: d.text((W - 40, 40), '살아남은 나  ' + c[-1], font=fCnt, fill=(255, 200, 80), anchor='ra')
    d.text((40, 40), [k for k, v in sec_start.items() if v <= fb][-1], font=fSm, fill=(160, 160, 170))
    for k in range(4):
        on = (bi % 4) == k; r = 9 + (6 * max(0, 1 - ph * 3) if on else 0)
        col = (255, 90, 90) if (on and k == 0) else ((240, 240, 240) if on else (60, 62, 70))
        cx, cy = W // 2 - 60 + k * 40, Hh - 50; d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=col)
    d.text((W // 2 + 110, Hh - 50), f'{bi // 4 + 1}.{bi % 4 + 1}', font=fSm, fill=(120, 120, 130), anchor='lm')
    proc.stdin.write(im.tobytes())
proc.stdin.close(); proc.wait()
json.dump([{k: v for k, v in p.items() if k != 'wav'} for p in plan], open('plan_used.json', 'w'), ensure_ascii=False, indent=1)
print('done sample_rap_AB.mp4')
