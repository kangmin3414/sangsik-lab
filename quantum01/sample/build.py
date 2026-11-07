"""양자 불멸 샘플(A+B) 조립: 실제 목소리 길이로 박자 재배치 → 90 BPM 격자 위에 목소리·효과음·음악 → 1280x720 확인용 영상.
usage: python3 build.py"""
import json, math, os, re, subprocess
import numpy as np, soundfile as sf, librosa
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
SR = 48000; BPM = 90; BEAT = 60 / BPM; BAR = 4 * BEAT; FPS = 30; W, Hh = 1280, 720
tl = json.load(open('../timeline.json')); takes = json.load(open('takes.json'))
EV = [(i, e) for i, e in enumerate(tl['events']) if e['type'] != 'sec' and e.get('sec', '').startswith(('A.', 'B.'))]

def load(path, gain=1.0):
    w, sr = sf.read(path, dtype='float32')
    if w.ndim > 1: w = w.mean(1)
    if sr != SR: w = librosa.resample(w, orig_sr=sr, target_sr=SR)
    e = np.convolve(np.abs(w), np.ones(480) / 480, 'same'); idx = np.where(e > 0.008)[0]
    a, b = max(0, idx[0] - int(0.02 * SR)), min(len(w), idx[-1] + int(0.08 * SR))
    w = w[a:b].copy(); f1, f2 = int(0.01 * SR), int(0.04 * SR)
    w[:f1] *= np.linspace(0, 1, f1); w[-f2:] *= np.linspace(1, 0, f2)
    return w * gain

# ---- 1) 실제 목소리 길이로 박 재배치 ----
plan = []; t = 0; sec_start = {}
for i, e in EV:
    if e['sec'] not in sec_start:
        t = math.ceil(t / 4) * 4; sec_start[e['sec']] = t
    if e['type'] == 'rest': t += e['beats']; continue
    if e['type'] == 'sfx':
        t = math.ceil(t / 4) * 4; plan.append(dict(kind='sfx', beat=t, beats=e['beats'], sfx=e['sfx'], vis=e['vis'], i=i)); t += e['beats']; continue
    if e['on'] == 'down': t = math.ceil(t / 4) * 4
    v = load(takes[str(i)]['take']); nb = math.ceil(len(v) / SR / BEAT + 0.35)   # 끝에 최소 0.35박 숨
    plan.append(dict(kind='line', beat=t, beats=nb, text=e['text'], sfx=e['sfx'], vis=e['vis'], i=i, wav=v)); t += nb
END = math.ceil(t / 4) * 4 + 8                  # 다음 섹션 경계 + 1마디 꼬리
N = int(END * BEAT * SR); T = lambda b: int(round(b * BEAT * SR))
print('sample length %.1fs, %d bars' % (END * BEAT, END // 4), {k: round(v * BEAT, 1) for k, v in sec_start.items()})

# ---- 2) 효과음(합성, 박 위에 정확히) ----
rng = np.random.default_rng(7); tt = lambda d: np.arange(int(d * SR)) / SR
def tick():
    x = tt(0.05); return (np.sin(2 * np.pi * 2600 * x) * np.exp(-x * 120) * 0.35 + rng.normal(0, 1, len(x)) * np.exp(-x * 300) * 0.08).astype(np.float32)
def kick():
    x = tt(0.35); f = 45 + 75 * np.exp(-x * 30); ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) * np.exp(-x * 9) * 0.9).astype(np.float32)
def whoosh(pitch=1.0):
    x = tt(0.55); n = rng.normal(0, 1, len(x)).astype(np.float32)
    S = np.fft.rfft(n); fr = np.fft.rfftfreq(len(n), 1 / SR)
    S *= np.exp(-((np.log(fr + 1) - np.log(2500 * pitch)) ** 2) / 1.2); n = np.fft.irfft(S, len(n)).astype(np.float32)
    n /= np.abs(n).max() + 1e-9; env = np.minimum(1, x / 0.02) * np.exp(-x * 7)
    crack = np.sin(2 * np.pi * 80 * pitch * x) * np.exp(-x * 25)
    return ((n * env * 0.55 + crack * 0.5)).astype(np.float32)
def horn():
    x = tt(0.9); s = sum(np.sign(np.sin(2 * np.pi * f * x)) * 0.5 + np.sin(2 * np.pi * f * x) for f in (277, 349))
    env = np.minimum(1, x / 0.03) * np.minimum(1, (0.9 - x) / 0.12)
    s = np.convolve(s * env, np.ones(12) / 12, 'same'); return (s / np.abs(s).max() * 0.7).astype(np.float32)
def boom():
    x = tt(3.0); f = 32 + 40 * np.exp(-x * 4); ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) * np.exp(-x * 1.4) * 0.9 + rng.normal(0, 1, len(x)) * np.exp(-x * 6) * 0.05).astype(np.float32)
def put(buf, at, x, g=1.0):
    a = T(at) if not isinstance(at, int) or True else at; a = int(a)
    if a >= len(buf): return
    x = x[:len(buf) - a]; buf[a:a + len(x)] += x * g

sfx = np.zeros(N, np.float32); vox = np.zeros(N, np.float32)
music_mute = []                                    # (시작박, 끝박) 음악·킥을 끄는 구간
tick_on = (0, None); kick_from = sec_start['B. 갈라지는 우주']; title_beat = None; drop = None
for p in plan:
    b = p['beat']; s = p['sfx']
    if p['kind'] == 'line':
        put(vox, b, p['wav'])
        if '째깍 멈춤' in s: tick_on = (0, b)
        if s.startswith('촤악'):
            n = 3 if '3번' in s else 1
            for k in range(n): put(sfx, b + k, whoosh(1 + 0.15 * k), 0.8)
        if '드롭' in s: drop = b
    else:
        if '트럭' in s: put(sfx, b, horn(), 0.9); music_mute.append((b, b + 4))
        if '제목' in s: put(sfx, b, boom(), 1.0); title_beat = b
        if '매 박마다' in s:
            for k in range(p['beats']): put(sfx, b + k, whoosh(1 + 0.12 * k), 0.75)
for k in range(tick_on[0], tick_on[1]):
    if not any(a <= k < c for a, c in music_mute): put(sfx, k, tick(), 0.9)
for k in range(kick_from, END - 4):
    if drop is not None and drop + 1 <= k < drop + 5: continue
    put(sfx, k, kick(), 0.55 if k % 4 else 0.7)
if drop is not None:
    put(sfx, drop, kick(), 1.0); put(sfx, drop, boom()[:int(1.2 * SR)], 0.8); music_mute.append((drop + 0.25, drop + 5))

# ---- 3) 음악: Lyria(90 BPM)를 박 격자에 맞춤 ----
def bed(path, start_beat, end_beat, align=True):
    y, sr = librosa.load(path, sr=SR, mono=True)
    if align:   # Lyria가 정확히 90 BPM으로 만든다 → 늘리지 않고, 4분음표 격자에 가장 잘 맞는 위상만 찾아 자른다
        hop = 64; o = librosa.onset.onset_strength(y=librosa.resample(y, orig_sr=SR, target_sr=22050), sr=22050, hop_length=hop); fr = 22050 / hop
        per = BEAT * fr; idx = np.arange(0, len(o) - per, per)
        sc = [(o[(idx + ph).astype(int)].mean(), ph / fr) for ph in np.linspace(0, per, 64, endpoint=False)]
        off = max(sc)[1]; y = y[int(off * SR):]
        print(os.path.basename(path), 'beat phase %.3fs' % off)
    L = T(end_beat) - T(start_beat); y = np.pad(y, (0, max(0, L - len(y))))[:L]
    fi, fo = int(0.5 * SR), int(1.5 * SR); y[:fi] *= np.linspace(0, 1, fi); y[-fo:] *= np.linspace(1, 0, fo)
    return y
mus = np.zeros(N, np.float32)
bB = sec_start['B. 갈라지는 우주']
a = bed('bgm/A_pad.mp3', 0, bB + 2, align=False); mus[:len(a)] += a * 0.9
b = bed('bgm/B_pulse.mp3', bB, END); mus[T(bB):T(bB) + len(b)] += b * 0.8
gate = np.ones(N, np.float32)
for a0, a1 in music_mute: gate[T(a0):T(a1)] = 0
gate = np.convolve(gate, np.ones(960) / 960, 'same')
env = np.convolve(np.abs(vox), np.ones(2400) / 2400, 'same'); duck = 1 - 0.55 * np.clip(env / 0.05, 0, 1)
duck = np.convolve(duck, np.ones(4800) / 4800, 'same')
mix = vox * 1.0 + sfx * 0.6 * np.maximum(gate, 0.0 if True else 1) + mus * 0.32 * duck * gate
for a0, a1 in music_mute:  # 정적 구간에도 경적 자체는 살림
    pass
sf.write('mix_raw.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'mix_raw.wav', '-af',
                'loudnorm=I=-13.5:TP=-1.5:LRA=9,alimiter=limit=0.84', '-ar', '48000', 'mix.wav'], check=True)

# ---- 4) 확인용 영상: 자막 + 박 표시 + 화면 메모 + 카운터 ----
F = '/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'; FR = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
fBig = ImageFont.truetype(F, 46, index=1); fSm = ImageFont.truetype(FR, 22, index=1); fCnt = ImageFont.truetype(F, 34, index=1)
COUNTER = [('둘로 갈라진다', '1/2'), ('화분', '1/4'), ('비행기', '1/8'), ('심장', '1/16')]
BURST = ['1/32', '1/256', '1/4,096', '1/65,536', '1/1,048,576', '0.0001%', '0.00003%', '0.00001%']
def at_beat(fb):
    cur = None
    for p in plan:
        if p['beat'] <= fb: cur = p
    return cur
cnt_marks = []
for p in plan:
    if p['kind'] == 'line':
        for k, v in COUNTER:
            if k in p['text']: cnt_marks.append((p['beat'], v))
    elif '매 박마다' in p['sfx']:
        for k, v in enumerate(BURST): cnt_marks.append((p['beat'] + k, v))
def wrap(s, n=22):
    out, line = [], ''
    for w in s.split(' '):
        if len(line) + len(w) + 1 > n and line: out.append(line); line = w
        else: line = (line + ' ' + w).strip()
    return out + [line]
proc = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{Hh}', '-r', str(FPS), '-i', '-',
                         '-i', 'mix.wav', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', 'sample_AB.mp4'], stdin=subprocess.PIPE)
nfr = int(END * BEAT * FPS)
for f in range(nfr):
    sec = f / FPS; fb = sec / BEAT; bi = int(fb); ph = fb - bi
    im = Image.new('RGB', (W, Hh), (10, 12, 18)); d = ImageDraw.Draw(im)
    if title_beat is not None and title_beat <= fb < title_beat + 8:
        d.text((W // 2, Hh // 2 - 20), '나는 결코 죽을 수 없다', font=fBig, fill=(240, 240, 240), anchor='mm')
        d.text((W // 2, Hh // 2 + 40), '상상 실험입니다. 증명되지 않은 가설이에요', font=fSm, fill=(150, 150, 160), anchor='mm')
    p = at_beat(fb)
    if p is not None:
        if p['kind'] == 'line' and fb < p['beat'] + p['beats']:
            for k, ln in enumerate(wrap(p['text'])):
                d.text((W // 2, 470 + k * 60), ln, font=fBig, fill=(255, 255, 255), anchor='mm')
        for k, ln in enumerate(wrap('화면: ' + p['vis'], 48)[:3] if p['vis'] else []):
            d.text((40, 90 + k * 30), ln, font=fSm, fill=(120, 130, 150))
    c = [v for b0, v in cnt_marks if b0 <= fb]
    if c:
        d.text((W - 40, 40), '살아남은 나  ' + c[-1], font=fCnt, fill=(255, 200, 80), anchor='ra')
    secname = [k for k, v in sec_start.items() if v <= fb][-1]
    d.text((40, 40), secname, font=fSm, fill=(160, 160, 170))
    # 박 표시: 4개 점, 현재 박 밝게(박 시작에 번쩍)
    for k in range(4):
        on = (bi % 4) == k; r = 9 + (6 * max(0, 1 - ph * 3) if on else 0)
        col = (255, 90, 90) if (on and k == 0) else ((240, 240, 240) if on else (60, 62, 70))
        cx, cy = W // 2 - 60 + k * 40, Hh - 50; d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=col)
    d.text((W // 2 + 110, Hh - 50), f'{bi // 4 + 1}.{bi % 4 + 1}', font=fSm, fill=(120, 120, 130), anchor='lm')
    proc.stdin.write(im.tobytes())
proc.stdin.close(); proc.wait()
json.dump([{k: v for k, v in p.items() if k != 'wav'} for p in plan], open('plan_used.json', 'w'), ensure_ascii=False, indent=1)
print('done sample_AB.mp4')
