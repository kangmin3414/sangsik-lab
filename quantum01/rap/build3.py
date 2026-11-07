"""양자 불멸 v3 샘플 조립: 콜드 오픈~B2(후렴 2까지). usage: python3 build3.py"""
import json, os, subprocess, tempfile
import numpy as np, soundfile as sf, librosa
from PIL import Image, ImageDraw, ImageFont
from lyrics_full import S, BPM
from autotune import sing, HOOK1, HOOK2
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
SR = 48000; BEAT = 60 / BPM; FPS = 30; W, Hh = 1280, 720; T = lambda b: int(round(b * BEAT * SR))
takes = json.load(open('takes3.json')); SAMPLE = ('0.', 'A.', 'B.', 'B2.')

def rd(path):
    w, sr = sf.read(path, dtype='float32'); w = w.mean(1) if w.ndim > 1 else w
    return w, sr
def trim(w, sr):
    e = np.convolve(np.abs(w), np.ones(int(sr / 100)) / (sr / 100), 'same'); idx = np.where(e > 0.008)[0]
    return w[max(0, idx[0] - int(0.012 * sr)):min(len(w), idx[-1] + int(0.06 * sr))]
def stretch(w, r):
    with tempfile.TemporaryDirectory() as d:
        sf.write(f'{d}/i.wav', w, SR)
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f'{d}/i.wav', '-af', f'rubberband=tempo={r:.4f}:transients=crisp', f'{d}/o.wav'], check=True)
        return sf.read(f'{d}/o.wav', dtype='float32')[0]
def fade(w):
    f1, f2 = int(0.006 * SR), int(0.03 * SR); w[:f1] *= np.linspace(0, 1, f1); w[-f2:] *= np.linspace(1, 0, f2); return w
def voice_line(i, slot_beats):
    w, sr = rd(takes[str(i)]['take']); w = trim(w, sr)
    if sr != SR: w = librosa.resample(w, orig_sr=sr, target_sr=SR)
    r = len(w) / SR / (slot_beats * BEAT * 0.94)
    if r > 1: w = stretch(w, min(r, 1.35))
    return fade(w), r
def chorus_line(i, slot_beats, hook):
    w, sr = rd(takes[str(i)]['take']); w = trim(w, sr)
    if sr != SR: w = librosa.resample(w, orig_sr=sr, target_sr=SR)
    target = slot_beats * BEAT * 0.92; r = len(w) / SR / target      # 노래는 두 마디를 꽉 채운다
    w = stretch(w, float(np.clip(r, 0.7, 1.4)))
    return fade(sing(w, SR, hook))
def onsets(w):   # 쉼표로 끊긴 단어 시작점(초)
    e = np.convolve(np.abs(w), np.ones(int(0.02 * SR)) / (0.02 * SR), 'same'); on = e > 0.02; out = []; gap = 0
    for k in range(0, len(on), int(0.005 * SR)):
        if on[k] and (not out or gap > 0.06): out.append(k / SR)
        gap = 0 if on[k] else gap + 0.005
    return out

# ---- 배치 ----
plan = []; t = 0; sec_start = {}; cur = None; hooks = iter([HOOK1, HOOK2])
for i, (k, txt, bars, sfx, vis) in enumerate(S):
    if k == 'SEC':
        cur = txt
        if not cur.startswith(SAMPLE): break
        sec_start[cur] = t; continue
    beats = bars * 4
    if k == 'X': plan.append(dict(kind='x', beat=t, beats=beats, sfx=sfx, vis=vis))
    elif k == 'V': w, r = voice_line(i, beats); plan.append(dict(kind='v', beat=t, beats=beats, text=txt, sfx=sfx, vis=vis, wav=w, r=round(r, 2)))
    else: w = chorus_line(i, beats, next(hooks)); plan.append(dict(kind='c', beat=t, beats=beats, text=txt, sfx=sfx, vis=vis, wav=w))
    t += beats
END = t; N = T(END) + SR * 2
print('length %.1fs, %d bars' % (END * BEAT, END // 4), {k: round(v * BEAT, 1) for k, v in sec_start.items()})

# ---- 효과음 ----
rng = np.random.default_rng(7); tt = lambda d: np.arange(int(d * SR)) / SR
def kick(g=1):
    x = tt(0.35); f = 45 + 80 * np.exp(-x * 30); return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 8) * g).astype(np.float32)
def whoosh(p=1.0):
    x = tt(0.5); n = rng.normal(0, 1, len(x)); Sx = np.fft.rfft(n); fr = np.fft.rfftfreq(len(n), 1 / SR)
    Sx *= np.exp(-((np.log(fr + 1) - np.log(2500 * p)) ** 2) / 1.2); n = np.fft.irfft(Sx, len(n)); n /= np.abs(n).max()
    return (n * np.minimum(1, x / 0.015) * np.exp(-x * 8) * 0.6 + np.sin(2 * np.pi * 80 * p * x) * np.exp(-x * 25) * 0.5).astype(np.float32)
def horn():
    x = tt(0.9); s = sum(np.sign(np.sin(2 * np.pi * f * x)) * 0.5 + np.sin(2 * np.pi * f * x) for f in (277, 349))
    s = np.convolve(s * np.minimum(1, x / 0.03) * np.minimum(1, (0.9 - x) / 0.12), np.ones(12) / 12, 'same'); return (s / np.abs(s).max() * 0.7).astype(np.float32)
def boom(d=3.0):
    x = tt(d); f = 32 + 40 * np.exp(-x * 4); return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 1.4) * 0.9).astype(np.float32)
def scratch():   # 레코드 긁는 소리: 앞뒤로 휘는 필터 잡음 + 음높이 급강하
    x = tt(0.45); ph = np.sin(2 * np.pi * 3.2 * x) * 0.5 + 0.5; n = rng.normal(0, 1, len(x))
    tone = np.sin(2 * np.pi * np.cumsum(300 + 900 * ph) / SR); out = (n * 0.35 + tone * 0.6) * ph * np.exp(-x * 3)
    return (out / np.abs(out).max() * 0.7).astype(np.float32)
def chime():
    x = tt(0.5); return ((np.sin(2 * np.pi * 1318.5 * x) * np.exp(-x * 9) + np.sin(2 * np.pi * 1975.5 * np.maximum(0, x - 0.09)) * np.exp(-np.maximum(0, x - 0.09) * 7) * (x > 0.09)) * 0.35).astype(np.float32)
def lid():
    x = tt(0.3); return ((rng.normal(0, 1, len(x)) * np.exp(-x * 60) * 0.4 + np.sin(2 * np.pi * 180 * x) * np.exp(-x * 20) * 0.5)).astype(np.float32)
def put(buf, b, x, g=1.0, sec=False):
    a = int(b * SR) if sec else T(b)
    if a < 0: x = x[-a:]; a = 0
    if a < len(buf): x = x[:len(buf) - a]; buf[a:a + len(x)] += x * g

vox = np.zeros(N, np.float32); sfx = np.zeros(N, np.float32); mute = []; tick_end = None; drops = []
for p in plan:
    b, s = p['beat'], p['sfx']
    if p['kind'] in ('v', 'c'):
        put(vox, b - 0.02, p['wav'])
        t0 = b * BEAT
        if '단어마다' in s:
            for o in onsets(p['wav']): put(sfx, t0 + o, whoosh(1.1) if '촤악' in s else kick(0.9), 0.75, sec=True)
        elif s.startswith('촤악'): put(sfx, b, whoosh(), 0.8)
        if s == '쿵': put(sfx, b, kick(1.0), 0.9)
        if '레코드' in s: put(sfx, b - 0.5, scratch(), 0.8); mute.append((b - 0.3, b + 1))
        if s in ('띠링', '게임 효과음'): put(sfx, b, chime(), 1.0)
        if '뚜껑' in s: put(sfx, b + 2, lid(), 0.9)
        if s == '째깍 멈춤': tick_end = b + 4
        if s == '드롭': put(sfx, b, kick(), 1.0); put(sfx, b, boom(1.5), 0.9); mute.append((b + 0.3, b + 4)); drops.append(b)
        if p['kind'] == 'c': put(sfx, b, boom(2.0), 0.5)
    else:
        if '경적' in s: put(sfx, b, horn(), 0.9); mute.append((b, b + 4))
        if '붐' in s: put(sfx, b, kick(), 1.0); put(sfx, b, boom(), 1.0)
        if '매 박' in s:
            for k in range(p['beats']): put(sfx, b + k, whoosh(1 + 0.1 * k), 0.75)
        if '완전 정적' in s: mute.append((b, b + 4))

# ---- 음악(박 격자 정렬) ----
def bed(path, b0, b1, downbeat=True):
    y, _ = librosa.load(path, sr=SR, mono=True)
    yl = librosa.resample(y, orig_sr=SR, target_sr=22050); hop = 64; fr = 22050 / hop
    o = librosa.onset.onset_strength(y=yl, sr=22050, hop_length=hop); per = BEAT * fr; idx = np.arange(0, len(o) - per, per)
    off = max((o[(idx + ph).astype(int)].mean(), ph / fr) for ph in np.linspace(0, per, 64, endpoint=False))[1]
    if downbeat:
        low = librosa.onset.onset_strength(S=librosa.feature.melspectrogram(y=yl, sr=22050, hop_length=hop, fmax=150, n_mels=16), sr=22050, hop_length=hop)
        bi = (off * fr + np.arange(0, len(low) - per, per)).astype(int); bi = bi[bi < len(low)]
        off += int(np.argmax([low[bi[k::4]].mean() for k in range(4)])) * BEAT
    y = y[int(off * SR):]
    L = T(b1) - T(b0)
    while len(y) < L: y = np.concatenate([y, y[T(16):]])       # 모자라면 4마디 건너 이어 붙임(격자 유지)
    y = y[:L].copy(); fi, fo = int(0.3 * SR), int(1.0 * SR); y[:fi] *= np.linspace(0, 1, fi); y[-fo:] *= np.linspace(1, 0, fo)
    return y
mus = np.zeros(N, np.float32); bB = sec_start['B. 자동 저장']
a = bed('bgm/A_intro.mp3', 0, bB + 1); mus[:len(a)] += a * 0.9
bb = bed('bgm/B_beat.mp3', bB, END + 2); mus[T(bB):T(bB) + len(bb)] += bb
gate = np.ones(N, np.float32)
for a0, a1 in mute: gate[max(0, T(a0)):T(a1)] = 0
gate = np.convolve(gate, np.ones(600) / 600, 'same')
x = tt(0.04); tk = (np.sin(2 * np.pi * 2600 * x) * np.exp(-x * 140) * 0.3).astype(np.float32)
for k in range(0, tick_end or 0): put(sfx, k, tk, 0.6 * (0 if any(a0 <= k < a1 for a0, a1 in mute) else 1))
sf.write('vox_raw.wav', vox, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'vox_raw.wav', '-af', 'highpass=f=90,acompressor=threshold=-22dB:ratio=4:attack=4:release=80:makeup=4,equalizer=f=3000:t=q:w=1:g=2.5', 'vox_c.wav'], check=True)
voxc = sf.read('vox_c.wav', dtype='float32')[0]; voxc = np.pad(voxc, (0, max(0, N - len(voxc))))[:N]
env = np.convolve(np.abs(voxc), np.ones(1200) / 1200, 'same'); duck = np.convolve(1 - 0.35 * np.clip(env / 0.04, 0, 1), np.ones(2400) / 2400, 'same')
mix = voxc + sfx * 0.55 + mus * 0.42 * duck * gate
sf.write('mix_raw.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'mix_raw.wav', '-af', 'loudnorm=I=-13.5:TP=-1.5:LRA=8,alimiter=limit=0.8,volume=-1dB', '-ar', '48000', 'mix3.wav'], check=True)

# ---- 확인용 영상 ----
F = '/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'; FR = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
fSm = ImageFont.truetype(FR, 22, index=1); fCnt = ImageFont.truetype(F, 34, index=1); fDoc = ImageFont.truetype(F, 30, index=1)
marks = []; seen = set()
for p in plan:
    if p['beat'] < sec_start['B. 자동 저장']: continue
    for k, v in (('스쳐 간 나', '1/2'), ('화분이', '1/4'), ('비행기가', '1/8'), ('심장이', '1/16')):
        if p['kind'] == 'v' and k in p['text'] and k not in seen: seen.add(k); marks.append((p['beat'], v, k))
    if p['kind'] == 'x' and '매 박' in p['sfx']:
        for k, v in enumerate(['1/32', '1/256', '1/4,096', '1/65,536', '1/1,048,576', '0.0001%', '0.00003%', '0.00001%']): marks.append((p['beat'] + k, v, '#'))
marks.sort()
proc = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{Hh}', '-r', str(FPS), '-i', '-', '-i', 'mix3.wav',
                         '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', 'sample_v3.mp4'], stdin=subprocess.PIPE)
for f in range(int((END + 2) * BEAT * FPS)):
    fb = f / FPS / BEAT; bi = int(fb); ph = fb - bi
    im = Image.new('RGB', (W, Hh), (10, 12, 18)); d = ImageDraw.Draw(im)
    cur = [p for p in plan if p['beat'] <= fb]; p = cur[-1] if cur else None
    if p and p['kind'] in ('v', 'c') and fb < p['beat'] + p['beats']:
        sc = 1 + 0.06 * max(0, 1 - (fb - p['beat']) * 4); col = (255, 215, 90) if p['kind'] == 'c' else (255, 255, 255)
        txt = ('♪ ' + p['text'] + ' ♪') if p['kind'] == 'c' else p['text']
        d.text((W // 2, 430), txt, font=ImageFont.truetype(F, int((58 if p['kind'] == 'c' else 50) * sc), index=1), fill=col, anchor='mm')
    if p and p['kind'] == 'x' and '제목' in (p.get('vis') or ''):
        d.text((W // 2, 330), '나는 절대 죽을 수 없다', font=ImageFont.truetype(F, 56, index=1), fill=(240, 240, 240), anchor='mm')
        d.text((W // 2, 395), '상상 실험입니다', font=fSm, fill=(150, 150, 160), anchor='mm')
    if p and p.get('vis'):
        vis = p['vis']
        if '다큐 자막' in vis:
            cap = vis.split('다큐 자막')[1].split('"')[1] if '"' in vis else vis
            d.rectangle((60, 560, 60 + 26 * len(cap) + 40, 610), fill=(250, 210, 0)); d.text((80, 585), cap, font=fDoc, fill=(20, 20, 20), anchor='lm')
        d.text((40, 90), '화면: ' + vis[:70], font=fSm, fill=(120, 130, 150))
    c = [v for b0, v, _ in marks if b0 <= fb]
    if c: d.text((W - 40, 40), '살아남은 나  ' + c[-1], font=fCnt, fill=(255, 200, 80), anchor='ra')
    d.text((40, 40), [k for k, v in sec_start.items() if v <= fb][-1], font=fSm, fill=(160, 160, 170))
    for k in range(4):
        on = (bi % 4) == k; r = 9 + (6 * max(0, 1 - ph * 3) if on else 0)
        col = (255, 90, 90) if (on and k == 0) else ((240, 240, 240) if on else (60, 62, 70))
        cx, cy = W // 2 - 60 + k * 40, Hh - 50; d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=col)
    d.text((W // 2 + 110, Hh - 50), f'{bi // 4 + 1}.{bi % 4 + 1}', font=fSm, fill=(120, 120, 130), anchor='lm')
    proc.stdin.write(im.tobytes())
proc.stdin.close(); proc.wait()
json.dump([{k: v for k, v in p.items() if k != 'wav'} for p in plan], open('plan_v3.json', 'w'), ensure_ascii=False, indent=1)
print('done sample_v3.mp4')
