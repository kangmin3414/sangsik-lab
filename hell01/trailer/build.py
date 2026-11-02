"""Hell trailer Shorts (1080x1920). usage: python3 build.py [preview] -> trailer.mp4"""
import json, os, subprocess, sys, time
import numpy as np, soundfile as sf
from PIL import Image, ImageDraw, ImageFont, ImageFilter
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
PREVIEW = 'preview' in sys.argv
W, H, FPS, SR = 1080, 1920, 30, 24000
SANS = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
SERIF = '/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc'
F = lambda p, s: ImageFont.truetype(p, s, index=1)
CAPF, KINGF, SMALL = F(SANS, 58), F(SERIF, 190), F(SANS, 30)
takes = json.load(open('takes.json'))
TEXT = {'r0': '제로 씨? 내리시죠. 시간 없습니다.', 'z0': '네? 여, 여기가 어디—', 'r1': '49일 안에, 일곱 분의 대왕을 다 뵈셔야 합니다.', 'z1': '49일이요?',
        'r2': '49재, 들어 보셨죠? 그게 이 일정입니다.', 'k1': '살생.', 'r3': '모기, 312마리.', 'z2': '정당방위예요!', 'k2': '도둑질.', 'r4': '회사 볼펜, 17자루.',
        'z3': '그건 제 가방이 알아서—', 'k3': '배신.', 'r5': '다이어트 결심, 142번.', 'z4': '그건 제가 저를—', 'k4': '거짓말.', 'r6': '…"괜찮아요." 41,200번.',
        'r7': '마지막 분입니다.', 'y1': '비춰 보아라.', 'r8': '살아온 모든 게, 그대로 비치는 거울입니다.', 'z5': '잠깐만요, 아직 마음의 준비가—'}
TEMPO = {'r0': 1.08, 'r1': 1.1, 'r2': 1.1, 'r3': 1.08, 'r4': 1.08, 'r5': 1.08, 'z0': 1.05, 'z1': 1.05, 'z2': 1.05, 'z3': 1.05, 'z4': 1.05, 'z5': 1.05}
CUT = {'z3': 0.8, 'z4': 0.8, 'z5': 0.9}           # cut off by the next door / the flash

os.makedirs('tempo', exist_ok=True)
def clip(k):
    src = takes[k]['take']; dst = f'tempo/{k}.wav'; tp = TEMPO.get(k, 1.0)
    if not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(src):
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', src, '-af', f'atempo={tp}', '-ar', str(SR), '-ac', '1', dst], check=True)
    w, _ = sf.read(dst, dtype='float32'); a = np.abs(w); idx = np.where(a > a.max() * 0.02)[0]
    w = w[max(0, idx[0] - 360): idx[-1] + 1200].copy()
    if k in CUT: w = w[:int(len(w) * CUT[k])]; fo = 360
    else: fo = 720
    w[:240] *= np.linspace(0, 1, 240); w[-fo:] *= np.linspace(1, 0, fo)
    return w
VO = {k: clip(k) for k in TEXT}
D = lambda k: len(VO[k]) / SR

# ---------------------------------------------------------------- art
def autocrop(im):
    g = np.asarray(im.convert('L')).astype(np.float32); h, w = g.shape
    def edge(lines):
        k = 0
        while k < len(lines) // 6 and (lines[k] > 200).mean() > 0.35: k += 1
        return k + (6 if k else 0)
    t_ = edge([g[i] for i in range(h)]); b_ = edge([g[h - 1 - i] for i in range(h)]); l_ = edge([g[:, i] for i in range(w)]); r_ = edge([g[:, w - 1 - i] for i in range(w)])
    im = im.crop((l_, t_, w - r_, h - b_)); w, h = im.size
    if w / h > 9 / 16: nw = int(h * 9 / 16); im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else: nh = int(w * 16 / 9); im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    return im
ART = {k: autocrop(Image.open(f'art/{k}.png').convert('RGB')).resize((int(W * 1.25), int(H * 1.25)), Image.LANCZOS)
       for k in ['bus', 'bridge', 'court1', 'court2', 'court3', 'court4', 'door', 'mirror']}

def ease(x): x = min(max(x, 0.0), 1.0); return x * x * (3 - 2 * x)
def view(im, z, cx=0.5, cy=0.5, dx=0, dy=0):
    w, h = im.size; cw, ch = w / z, h / z
    x0 = min(max(cx * w - cw / 2 + dx, 0), w - cw); y0 = min(max(cy * h - ch / 2 + dy, 0), h - ch)
    return im.resize((W, H), Image.BILINEAR, box=(x0, y0, x0 + cw, y0 + ch))

# ---------------------------------------------------------------- timeline
T = {}; t = 0.2
def say(k, gap):
    global t
    T[k] = (t, t + D(k)); t += D(k) + gap
SH = []                                           # (start, image, z0, z1, cx, cy, transition)
SH.append((0.0, 'bus', 1.04, 1.12, 0.5, 0.5, None))
say('r0', 0.05)
BR = t - 0.1; SH.append((BR, 'bridge', 1.05, 1.22, 0.5, 0.55, 'whip'))
say('z0', 0.1); say('r1', 0.08); say('z1', 0.06); say('r2', 0.12)
SLAMS = []; COURTS = []
for n, (img, kk, rr, zz) in enumerate([('court1', 'k1', 'r3', 'z2'), ('court2', 'k2', 'r4', 'z3'), ('court3', 'k3', 'r5', 'z4')]):
    s0 = t; SLAMS.append(s0); COURTS.append(s0); SH.append((s0, img, 1.03, 1.14, 0.5, 0.55, 'whip'))
    t = s0 + 0.25; say(kk, 0.05); say(rr, 0.04); say(zz, 0.0 if zz in CUT else 0.12)
s4 = t; SLAMS.append(s4); COURTS.append(s4); SH.append((s4, 'court4', 1.02, 1.10, 0.5, 0.5, 'whip'))
t = s4 + 0.35; DSTOP = t; say('k4', 0.35); say('r6', 1.6)          # silence after the 41,200 line
DOOR = t - 0.3; SH.append((DOOR, 'door', 1.0, 1.35, 0.5, 0.55, 'fade'))
say('r7', 0.6)
MIR = t - 0.1; SH.append((MIR, 'mirror', 1.02, 1.12, 0.5, 0.58, 'fade'))
say('y1', 0.2); say('r8', 0.15); say('z5', 0.0)
FLASH = T['z5'][1] - 0.05
CARD = FLASH + 0.55; END = CARD + 3.4
print('length %.1f s' % END)
SH.sort(key=lambda x: x[0])

def drum_times():
    out = []; s = BR + 0.2; iv = 0.85
    while s < DSTOP - 0.05:
        out.append(s); prog = (s - BR) / (DSTOP - BR); iv = 0.85 - 0.5 * prog; s += max(0.33, iv)
    return out
DRUMS = drum_times()

# ---------------------------------------------------------------- frames
def shot_img(sh, s):
    st, k, z0, z1, cx, cy, _ = sh
    nxt = [x[0] for x in SH if x[0] > st]; en = nxt[0] if nxt else END
    z = z0 + (z1 - z0) * ease((s - st) / max(0.1, en - st + 0.3))
    # small handheld sway while walking (bridge + courts 1-3), none in the hushed court and after
    amp = 6 if k in ('bridge', 'court1', 'court2', 'court3') else 0
    dx = amp * np.sin(s * 5.3); dy = amp * 0.6 * np.sin(s * 7.1 + 1)
    return view(ART[k], z, cx, cy, dx, dy)
def frame(s):
    j = max(i for i, sh in enumerate(SH) if sh[0] <= s); st = SH[j][0]; tr = SH[j][6]
    fr = shot_img(SH[j], s)
    if j > 0 and tr == 'whip' and s < st + 0.2:
        e = ease((s - st) / 0.2); prev = shot_img(SH[j - 1], s)
        can = Image.new('RGB', (W, H)); can.paste(prev, (int(-W * e), 0)); can.paste(fr, (int(W * (1 - e)), 0))
        fr = can.filter(ImageFilter.BoxBlur(int(18 * np.sin(np.pi * e)) + 1))
    if j > 0 and tr == 'fade' and s < st + 0.6:
        fr = Image.blend(shot_img(SH[j - 1], s), fr, ease((s - st) / 0.6))
    for sl in SLAMS:                               # a 2-frame dark hit on every door slam
        if sl - 0.03 <= s < sl + 0.07: fr = Image.blend(fr, Image.new('RGB', (W, H)), 0.55)
    ov = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    if s < 2.2:                                    # credit line instead of narration
        a = int(200 * min(1, (2.2 - s) / 0.4))
        d.text((60, 120), '한국 전통 시왕 이야기를 바탕으로 한 창작', font=SMALL, fill=(255, 245, 230, a), stroke_width=3, stroke_fill=(0, 0, 0, a))
    nst = sum(1 for c in COURTS if s >= c + 0.15)  # seal stamps, one per court (no characters)
    for q in range(nst):
        x0, y0 = 860 - q * 78, 150; pop = min(1, (s - (COURTS[q] + 0.15)) / 0.12)
        sz = int(64 * (1.4 - 0.4 * pop))
        d.rounded_rectangle((x0, y0, x0 + sz, y0 + sz), 10, fill=(178, 34, 30, int(225 * pop)))
        d.rectangle((x0 + sz * 0.22, y0 + sz * 0.22, x0 + sz * 0.78, y0 + sz * 0.78), outline=(250, 235, 220, int(220 * pop)), width=4)
        d.line((x0 + sz * 0.5, y0 + sz * 0.22, x0 + sz * 0.5, y0 + sz * 0.78), fill=(250, 235, 220, int(220 * pop)), width=4)
    for k, (a0, a1) in T.items():                  # captions
        if not (a0 - 0.08 <= s <= a1 + (0.15 if k[0] != 'k' else 0.6)): continue
        al = min(1, (s - a0 + 0.08) / 0.1, (a1 + (0.15 if k[0] != 'k' else 0.6) - s) / 0.12)
        if k[0] == 'k':                            # the kings' one-word charges: big brush-like words
            tw = d.textlength(TEXT[k], font=KINGF); sc = 1 + 0.15 * (1 - min(1, (s - a0) / 0.15))
            f2 = F(SERIF, int(190 * sc)); tw = d.textlength(TEXT[k], font=f2)
            d.text(((W - tw) / 2, 820), TEXT[k], font=f2, fill=(196, 30, 26, int(255 * al)), stroke_width=10, stroke_fill=(250, 240, 225, int(235 * al)))
        else:
            words = TEXT[k].split(' '); lines = ['']
            for wd in words:
                tt = (lines[-1] + ' ' + wd).strip()
                if d.textlength(tt, font=CAPF) <= 820: lines[-1] = tt
                else: lines.append(wd)
            y = 1395 - 80 * len(lines)
            for ln in lines:
                tw = d.textlength(ln, font=CAPF); col = (255, 247, 232) if k[0] == 'r' else (255, 214, 140)
                d.text(((W - tw) / 2, y), ln, font=CAPF, fill=col + (int(255 * al),), stroke_width=7, stroke_fill=(10, 10, 16, int(220 * al))); y += 80
        break
    fr = Image.alpha_composite(fr.convert('RGBA'), ov).convert('RGB')
    if s >= FLASH:                                 # white flash, then black, then the card
        if s < FLASH + 0.18: fr = Image.blend(fr, Image.new('RGB', (W, H), (255, 250, 235)), ease((s - FLASH) / 0.12))
        else:
            fr = Image.new('RGB', (W, H), (255, 250, 235)) if s < FLASH + 0.3 else Image.new('RGB', (W, H), (6, 6, 8))
            if s >= CARD:
                al = min(1, (s - CARD) / 0.35); ov = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
                for txt, f_, y, col in [('그 거울에,', F(SANS, 84), 700, (255, 245, 230)), ('뭐가 비쳤을까요?', F(SANS, 84), 810, (255, 245, 230)),
                                        ('착하게 살면 뭐 해, 아무도 모르는데', F(SERIF, 50), 1010, (226, 70, 60)), ('본편에서', F(SANS, 38), 1100, (200, 195, 190))]:
                    tw = d.textlength(txt, font=f_); d.text(((W - tw) / 2, y), txt, font=f_, fill=col + (int(255 * al),))
                fr = Image.alpha_composite(fr.convert('RGBA'), ov).convert('RGB')
    return fr

if PREVIEW:
    pts = [('a', 0.8), ('b', T['r1'][0] + 0.6), ('c', COURTS[0] + 0.1), ('d', T['r3'][0] + 0.3), ('e', T['k2'][0] + 0.2), ('f', T['r5'][0]),
           ('g', T['r6'][0] + 1.0), ('h', T['r7'][0] + 0.5), ('i', T['r8'][0] + 1.0), ('j', FLASH + 0.08), ('k', CARD + 1.0)]
    ims = [frame(s).resize((216, 384)) for _, s in pts]
    S = Image.new('RGB', (216 * len(ims), 384))
    for i, im in enumerate(ims): S.paste(im, (216 * i, 0))
    S.save('pv_sheet.jpg', quality=85); print('preview ok'); sys.exit()

os.makedirs('frames', exist_ok=True); t0 = time.time(); nF = int(round(END * FPS))
for f in range(nF):
    fn = f'frames/{f:05d}.jpg'
    if not os.path.exists(fn): frame(f / FPS).save(fn, quality=92)
    if f % 200 == 0: print('frame', f, '/', nF, '%.0fs' % (time.time() - t0), flush=True)

# ---------------------------------------------------------------- audio
n = int((END + 0.5) * SR); mix = np.zeros(n, np.float32); rng = np.random.default_rng(7)
def put(at, x, g=1.0):
    a = int(at * SR);
    if a < n: mix[a:a + len(x)] += (x * g)[:max(0, n - a)]
tt = lambda d: np.arange(int(d * SR)) / SR
def lp(x, k=40): return np.convolve(x, np.ones(k) / k, 'same').astype(np.float32)
def drum(g):
    x = tt(0.45); f = 75 * np.exp(-x * 6) + 42
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 7)
    click = lp(rng.normal(0, 1, len(x)), 6) * np.exp(-x * 90) * 0.5
    return ((body + click) * g).astype(np.float32)
def slam():
    x = tt(0.5); body = np.sin(2 * np.pi * 48 * x) * np.exp(-x * 9)
    crack = lp(rng.normal(0, 1, len(x)), 18) * np.exp(-x * 40) * 1.6
    return (body + crack).astype(np.float32)
def bell(f0=110, d=5.0):
    x = tt(d); y = sum(a * np.sin(2 * np.pi * f0 * r * x) * np.exp(-x / dc) for r, a, dc in [(1, 1, 3.5), (2.76, 0.5, 2.0), (5.4, 0.25, 1.0), (8.9, 0.12, 0.5)])
    return (y * 0.5).astype(np.float32)
def hiss(d, k=12): x = tt(d); return (lp(rng.normal(0, 1, len(x)), k) * np.sin(np.pi * x / d) ** 0.7).astype(np.float32)
put(0.0, hiss(0.45, 6), 0.35)                                   # bus door
x = tt(BR); put(0.0, (np.sin(2 * np.pi * 42 * x) * 0.05 + np.sin(2 * np.pi * 84 * x) * 0.02).astype(np.float32))   # engine hum
put(0.05, drum(1.0), 0.9)
for i, s in enumerate(DRUMS): put(s, drum(0.55 + 0.45 * i / max(1, len(DRUMS) - 1)), 0.75)
for s in SLAMS: put(s - 0.02, slam(), 0.9)
x = tt(DSTOP - BR); put(BR, (hiss(DSTOP - BR, 120) * 0.12).astype(np.float32))            # wind under the walk
put(T['r7'][0] - 0.25, bell(98, 6.0), 0.55)                     # low bell at "마지막 분입니다"
x = tt(1.2); put(DOOR + 0.3, (np.sin(2 * np.pi * 36 * x) * np.sin(np.pi * x / 1.2) * 0.35).astype(np.float32))   # door rumble
dd = FLASH - MIR; x = tt(dd); ramp = (x / dd) ** 1.6                                         # rising drone into the flash
put(MIR, ((np.sin(2 * np.pi * 55 * x) * 0.5 + np.sin(2 * np.pi * 110.5 * x) * 0.3 + lp(rng.normal(0, 1, len(x)), 30) * 0.4) * ramp * 0.5).astype(np.float32))
put(FLASH, hiss(0.25, 3), 0.25)                                  # the flash
put(END - 0.55, hiss(0.6, 8), 0.4)                               # bus brake -> loops into the opening
for k, w in VO.items(): put(T[k][0], w, 1.6 if k[0] in 'kKyY' else 1.25)
cutoff = int(FLASH * SR) + 1; mix[cutoff:int(CARD * SR) - 200] *= 0.0 if False else 1.0
mix = mix[:int(END * SR)]; mix = mix / (np.abs(mix).max() + 1e-9) * 0.9
sf.write('mix.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', 'frames/%05d.jpg', '-i', 'mix.wav', '-c:v', 'libx264', '-preset', 'veryfast',
                '-crf', '19', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-shortest', '-movflags', '+faststart', 'trailer.mp4'], check=True)
subprocess.run('rm -rf frames', shell=True)
print('ok trailer.mp4 %.1f s' % END)
