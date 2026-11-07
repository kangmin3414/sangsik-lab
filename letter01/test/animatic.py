"""Opening + letter 1 animatic (~55 s) to judge look and voice together.
usage: python3 animatic.py <Voice>  -> preview_<Voice>.mp4 (1280x720)"""
import os, subprocess, sys
import numpy as np, soundfile as sf
from PIL import Image, ImageDraw, ImageFont, ImageFilter
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
V = sys.argv[1] if len(sys.argv) > 1 else 'Puck'
W, H, FPS, SR = 1280, 720, 30, 24000
FONT = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 34, index=1)  # KR
SUB = ['오늘 하루, 잘했다는 말을 누구한테 들었어요?', '3초 드릴게요.', '못 떠올리셨죠. 저도 오늘은 못 들었어요.',
       '제가 온 걸 알아준 건, 현관 앞 센서등 하나였어요.', '그것도 가만히 서 있으니까, 꺼지더라고요.', '당신에게.',
       '오늘 당신이 한 일들은, 아마 아무도 적어 두지 않았을 거예요.', '알람을 세 번 끄고도, 결국 일어난 것.',
       '"확인 부탁드립니다"에, 답장을 썼다 지웠다 하다가,\n숨 한 번 고르고 보낸 것.', '회의에서 하고 싶은 말을 삼키고,\n책상 밑에서 주먹만 쥐었다 푼 것.']
GAPS = [0.6, 3.0, 0.5, 0.4, 1.5, 1.0, 0.8, 0.7, 0.7, 0.8]


def load(path):
    """takes are WAV files (with a trailing metadata chunk): read with soundfile, trim edge silence, 10 ms fade-in / 40 ms fade-out."""
    w, sr = sf.read(path, dtype='float32')
    if w.ndim > 1: w = w.mean(1)
    a = np.abs(w); thr = max(a.max() * 0.02, 1e-4); idx = np.where(a > thr)[0]
    w = w[max(0, idx[0] - 1200): idx[-1] + 2400].copy()
    fi, fo = int(0.01 * SR), int(0.04 * SR)
    w[:fi] *= np.linspace(0, 1, fi); w[-fo:] *= np.linspace(1, 0, fo)
    return w


# timeline (same assembly as make_voice.py)
t = 0.4; spans = []; chunks = [np.zeros(int(0.4 * SR), np.float32)]
for i, g in enumerate(GAPS):
    w = load(f'voice/takes/{V}_{i:02d}.pcm'); spans.append((t, t + len(w) / SR)); t += len(w) / SR + g
    chunks += [w, np.zeros(int(g * SR), np.float32)]
voice = np.concatenate(chunks); voice = voice / (np.abs(voice).max() + 1e-9) * 0.9
END = t + 1.0
cd0 = spans[1][1]                       # countdown starts after "3초 드릴게요."
OFF = cd0 + 1.6                         # sensor light clicks off during the countdown
XF0 = spans[4][1] + 0.4                 # corridor -> desk crossfade
XF1 = XF0 + 1.2


def prep(p, z):
    im = Image.open(p).convert('RGB'); return im


corr = Image.open('art/corridor.png').convert('RGB')
navy = Image.new('RGB', corr.size, (14, 20, 40))
corr_dark = Image.blend(Image.eval(corr, lambda v: int(v * 0.30)), navy, 0.25)
desk = Image.open('art/desk.png').convert('RGB')


def view(im, z, cx, cy):
    """crop a zoomed window (z >= 1) centred at (cx, cy) in 0..1, resize to output."""
    w, h = im.size; cw, ch = w / z, h / z
    x0 = min(max(cx * w - cw / 2, 0), w - cw); y0 = min(max(cy * h - ch / 2, 0), h - ch)
    return im.resize((W, H), Image.BILINEAR, box=(x0, y0, x0 + cw, y0 + ch))


def ease(x): x = min(max(x, 0), 1); return x * x * (3 - 2 * x)


def subtitle(fr, txt, alpha):
    if not txt or alpha <= 0: return fr
    ov = Image.new('RGBA', fr.size, (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    lines = txt.split('\n'); lh = 46; y = H - 40 - lh * len(lines)
    for ln in lines:
        tw = d.textlength(ln, font=FONT); x = (W - tw) / 2
        for dx, dy in [(-2, 0), (2, 0), (0, -2), (0, 2), (-2, -2), (2, 2), (-2, 2), (2, -2)]:
            d.text((x + dx, y + dy), ln, font=FONT, fill=(0, 0, 0, int(170 * alpha)))
        d.text((x, y), ln, font=FONT, fill=(255, 250, 240, int(255 * alpha))); y += lh
    return Image.alpha_composite(fr.convert('RGBA'), ov).convert('RGB')


BIG = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 150, index=1)
os.makedirs('frames', exist_ok=True)
for f in range(int(END * FPS)):
    s = f / FPS
    if s < XF1:
        z = 1.08 + 0.10 * ease(s / XF1)
        a = view(corr, z, 0.52, 0.52); b = view(corr_dark, z, 0.52, 0.52)
        k = ease((s - OFF) / 0.12) if s >= OFF else 0
        fr = Image.blend(a, b, k)
        if s >= XF0:
            dz = 1.12 + 0.05 * ease((s - XF0) / (END - XF0))
            fr = Image.blend(fr, view(desk, dz, 0.42, 0.52), ease((s - XF0) / (XF1 - XF0)))
    else:
        dz = 1.12 + 0.05 * ease((s - XF0) / (END - XF0))
        fr = view(desk, dz, 0.42, 0.52)
    if cd0 <= s < cd0 + 3.0:              # 3, 2, 1
        n = 3 - int(s - cd0); ph = (s - cd0) % 1
        ov = Image.new('RGBA', fr.size, (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
        txt = str(n); tw = d.textlength(txt, font=BIG)
        x, y = W * 0.26 - tw / 2, H * 0.22 - 100; al = int(220 * (1 - ph) ** 0.5)
        for dx, dy in [(-3, 0), (3, 0), (0, -3), (0, 3), (4, 4)]:
            d.text((x + dx, y + dy), txt, font=BIG, fill=(10, 14, 30, int(al * 0.6)))
        d.text((x, y), txt, font=BIG, fill=(255, 236, 200, al))
        fr = Image.alpha_composite(fr.convert('RGBA'), ov).convert('RGB')
    cur = None; al = 0
    for i, (a0, a1) in enumerate(spans):
        if a0 - 0.15 <= s <= a1 + min(GAPS[i], 0.6):
            cur = SUB[i]; al = min(1, (s - a0 + 0.15) / 0.2, (a1 + min(GAPS[i], 0.6) - s) / 0.2); break
    fr = subtitle(fr, cur, al)
    fr.save(f'frames/{f:05d}.jpg', quality=90)

# audio: voice + soft piano bed + sensor-light click
n = int(END * SR); mix = np.zeros(n, np.float32); mix[:len(voice)] += voice[:n]
cl = int(OFF * SR); tt = np.arange(int(0.03 * SR)) / SR   # soft relay 'tick' for the sensor light (no noise burst)
click = (np.sin(2 * np.pi * 1700 * tt) * np.exp(-tt / 0.004) * 0.18 + np.sin(2 * np.pi * 180 * tt) * np.exp(-tt / 0.01) * 0.12).astype(np.float32)
mix[cl:cl + len(click)] += click
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'bgm/piano_b.mp3', '-ac', '1', '-ar', str(SR), '-t', str(END), 'bed.wav'], check=True)
bed, _ = sf.read('bed.wav', dtype='float32'); bed = bed[:n]
env = np.ones(n, np.float32) * 0.10; fade = int(1.5 * SR); env[:fade] *= np.linspace(0, 1, fade); env[-fade:] *= np.linspace(1, 0, fade)
mix[:len(bed)] += bed * env[:len(bed)]
mix = mix / (np.abs(mix).max() + 1e-9) * 0.9
sf.write('mix_tmp.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', 'frames/%05d.jpg', '-i', 'mix_tmp.wav',
                '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k',
                '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-shortest', f'preview_{V}.mp4'], check=True)
subprocess.run('rm -rf frames bed.wav mix_tmp.wav', shell=True)
print('ok', f'preview_{V}.mp4', round(END, 1), 's')
