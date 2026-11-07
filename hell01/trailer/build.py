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
TEXT = {'zi': '죽으면 49일 동안 저승 재판을 받는대요. 제가 먼저 받아 봤습니다.', 'r0': '제로 씨? 내리시죠. 시간 없습니다.', 'z0': '네? 여, 여기가 어디—', 'r1': '49일 안에, 일곱 분의 대왕을 다 뵈셔야 합니다.', 'z1': '49일이요?',
        'r2': '49재, 들어 보셨죠? 그게 이 일정입니다.', 'k1': '살생.', 'r3': '모기, 312마리.', 'z2': '정당방위예요!', 'k2': '도둑질.', 'r4': '회사 볼펜, 17자루.',
        'z3': '그건 제 가방이 알아서—', 'k3': '배신.', 'r5': '다이어트 결심, 142번.', 'z4': '그건 제가 저를—', 'k4': '거짓말.', 'r6': '…"괜찮아요." 41,200번.',
        'r7': '마지막 분입니다.', 'y1': '비춰 보아라.', 'r8': '살아온 모든 게, 그대로 비치는 거울입니다.', 'z5': '잠깐만요, 아직 마음의 준비가—'}
TEMPO = {'zi': 1.04, 'r0': 1.08, 'r1': 1.1, 'r2': 1.1, 'r3': 1.08, 'r4': 1.08, 'r5': 1.08, 'z0': 1.05, 'z1': 1.05, 'z2': 1.05, 'z3': 1.05, 'z4': 1.05, 'z5': 1.05}
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
       for k in ['bus', 'bridge', 'court1', 'court2', 'court3', 'court4', 'door', 'mirror', 'hell_sword', 'hell_cauldron', 'hell_ice', 'hell_tongue',
                 'x_swordtree', 'x_saw', 'x_hands', 'x_roar']}
for k in ['mirror', 'demons', 'fire', 'punish']:   # real paintings: The Met, Ten Kings of Hell (Jin Chushi, before 1195), Public Domain
    im = Image.open(f'../real/met/c_{k}.jpg').convert('RGB'); sc = H * 1.12 / im.height
    ART['real_' + k] = im.resize((int(im.width * sc), int(im.height * sc)), Image.LANCZOS)
REAL_CREDIT = '실제 그림 · 송나라 「시왕도」(1195년 이전) · The Met, Public Domain'

def ease(x): x = min(max(x, 0.0), 1.0); return x * x * (3 - 2 * x)
_BED = {}
def fit_real(k, z, dx=0, dy=0):
    im = ART[k]
    if k not in _BED:
        bed = view_real(im, 1.0, 0.5, 0.5).filter(ImageFilter.GaussianBlur(28))
        _BED[k] = Image.eval(bed, lambda v: int(v * 0.45))
    fw = int(W * 0.98 * z); fh = int(fw * im.height / im.width)
    fg = im.resize((fw, fh), Image.BILINEAR)
    can = _BED[k].copy(); can.paste(fg, (int((W - fw) / 2 + dx), int((H - fh) / 2 - 60 + dy)))
    return can
def view_real(im, z, cx, cy, dx=0, dy=0):
    w, h = im.size; ch = h / z; cw = ch * 9 / 16
    if cw > w: cw = w; ch = cw * 16 / 9
    x0 = min(max(cx * w - cw / 2 + dx, 0), w - cw); y0 = min(max(cy * h - ch / 2 + dy, 0), h - ch)
    return im.resize((W, H), Image.BILINEAR, box=(x0, y0, x0 + cw, y0 + ch))
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
say('zi', 0.25)                                 # the promise: what this Short is about, over a fast hell montage
INTRO = [(0.0 if i == 0 else T['zi'][0] + i * D('zi') / 4, hk) for i, hk in enumerate(['real_demons', 'x_saw', 'real_fire', 'x_hands'])]
for st_, hk in INTRO: SH.append((st_, hk, 1.0 if hk.startswith('real') else 1.04, 1.1 if hk.startswith('real') else 1.16, 0.5, 0.5, 'cut'))
BUS0 = t - 0.05; SH.append((BUS0, 'bus', 1.04, 1.12, 0.5, 0.5, 'cut'))
say('r0', 0.05)
BR = t - 0.1; SH.append((BR, 'bridge', 1.05, 1.22, 0.5, 0.55, 'whip'))
say('z0', 0.1); say('r1', 0.08); say('z1', 0.06); say('r2', 0.12)
SLAMS = []; COURTS = []
HELLS = []                                      # (start, image): the hell flashes on each charge
SUBS = []                                       # every fast cut inside a flash
SUBSEQ = {'hell_sword': [('hell_sword', 1.0, 1.25, 0.5, 0.5), ('x_swordtree', 1.1, 1.4, 0.5, 0.45), ('real_punish', 1.0, 1.12, 0.5, 0.5)],
          'hell_cauldron': [('hell_cauldron', 1.0, 1.25, 0.5, 0.55), ('x_hands', 1.15, 1.45, 0.4, 0.45), ('real_fire', 1.0, 1.12, 0.5, 0.5)],
          'hell_ice': [('hell_ice', 1.0, 1.2, 0.5, 0.5), ('hell_ice', 1.9, 2.3, 0.62, 0.55), ('real_demons', 1.0, 1.12, 0.5, 0.5)]}
for n, (img, kk, rr, zz, hl) in enumerate([('court1', 'k1', 'r3', 'z2', 'hell_sword'), ('court2', 'k2', 'r4', 'z3', 'hell_cauldron'), ('court3', 'k3', 'r5', 'z4', 'hell_ice')]):
    s0 = t; SLAMS.append(s0); COURTS.append(s0); SH.append((s0, img, 1.03, 1.14, 0.5, 0.55, 'whip'))
    t = s0 + 0.25; say(kk, 0.0)
    hs = T[kk][0] + 0.4; HELLS.append((hs, hl))
    for q, (sk, zz0, zz1, ccx, ccy) in enumerate(SUBSEQ[hl]):
        SH.append((hs + q * 0.39, sk, zz0, zz1, ccx, ccy, 'cut')); SUBS.append(hs + q * 0.39)
    back = max(t, hs + 1.17); SH.append((back, img, 1.08, 1.16, 0.5, 0.55, 'cut')); t = back + 0.05
    say(rr, 0.04); say(zz, 0.0 if zz in CUT else 0.12)
s4 = t; SLAMS.append(s4); COURTS.append(s4); SH.append((s4, 'court4', 1.02, 1.10, 0.5, 0.5, 'whip'))
t = s4 + 0.35; DSTOP = t; say('k4', 0.0)
hs = T['k4'][0] + 0.4; HELLS.append((hs, 'hell_tongue')); SH.append((hs, 'hell_tongue', 1.0, 1.18, 0.5, 0.45, 'cut'))
JUMP = hs + 0.55; SH.append((JUMP, 'x_roar', 1.0, 1.7, 0.5, 0.42, 'cut')); SUBS.append(JUMP)
back = JUMP + 0.5; SH.append((back, 'court4', 1.04, 1.10, 0.5, 0.5, 'cut')); t = back + 0.5
say('r6', 1.6)          # silence after the 41,200 line
DOOR = t - 0.3; SH.append((DOOR, 'door', 1.0, 1.35, 0.5, 0.55, 'fade'))
say('r7', 0.6)
MIR = t - 0.1; SH.append((MIR, 'mirror', 1.02, 1.12, 0.5, 0.58, 'fade'))
say('y1', 0.2); say('r8', 0.15)
RM = T['r8'][0] - 0.1; SH.append((RM, 'real_mirror', 1.0, 1.1, 0.5, 0.5, 'cut')); SH.append((RM + 2.0, 'mirror', 1.06, 1.12, 0.5, 0.58, 'fade'))
say('z5', 0.0)
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
    if k.startswith(('hell_', 'x_', 'real_')) and k != 'real_mirror':   # violent shake that settles
        a = 22 * np.exp(-(s - st) * 3.0); dx = a * np.sin(s * 37); dy = a * np.cos(s * 31)
    if k == 'x_roar': z = 1.0 + 0.7 * ease((s - st) / 0.35) ** 2      # the guard rushes the lens
    if k.startswith('real_'):                     # show the whole painted detail, on a blurred bed of itself
        return fit_real(k, z, dx, dy)
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
    for sc_ in SUBS:
        if sc_ <= s < sc_ + 0.08: fr = Image.blend(fr, Image.new('RGB', (W, H), (120, 0, 0)), 0.35)
    if JUMP <= s < JUMP + 0.12: fr = Image.blend(fr, Image.new('RGB', (W, H), (255, 220, 200)), 0.5 * (1 - (s - JUMP) / 0.12))
    for hs, _ in HELLS + INTRO[1:]:                 # blood-red flash as the hell cuts in (colour only, no gore)
        if hs <= s < hs + 0.2: fr = Image.blend(fr, Image.new('RGB', (W, H), (150, 10, 6)), 0.55 * (1 - (s - hs) / 0.2))
    for sl in SLAMS:                               # a 2-frame dark hit on every door slam
        if sl - 0.03 <= s < sl + 0.07: fr = Image.blend(fr, Image.new('RGB', (W, H)), 0.55)
    ov = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    if s < BUS0:                                   # opening title over the montage
        k_ = min(1, s / 0.25); f_ = F(SANS, 112); f2 = F(SANS, 70)
        for txt, ff, y, col in [('49일', F(SERIF, 230), 330, (210, 30, 24)), ('저승 재판', f_, 580, (255, 245, 232))]:
            tw = d.textlength(txt, font=ff); d.text(((W - tw) / 2, y), txt, font=ff, fill=col + (int(255 * k_),), stroke_width=12, stroke_fill=(10, 6, 6, int(235 * k_)))
    elif s < FLASH:                                # topic line stays on top for sound-off viewers
        k_ = min(1, (s - BUS0) / 0.3); f_ = F(SANS, 46); txt = '죽으면 받는 49일 저승 재판'
        tw = d.textlength(txt, font=f_); d.text(((W - tw) / 2, 255), txt, font=f_, fill=(255, 236, 200, int(235 * k_)), stroke_width=7, stroke_fill=(0, 0, 0, int(220 * k_)))
    if SH[j][1].startswith('real_'):               # credit for the real painting on screen
        lab = '800년 전 그림 속 업경대' if SH[j][1] == 'real_mirror' else '실제 옛 그림'
        tw = d.textlength(lab, font=F(SANS, 44)); d.text(((W - tw) / 2, 1440), lab, font=F(SANS, 44), fill=(255, 226, 120, 240), stroke_width=6, stroke_fill=(0, 0, 0, 220))
        tw = d.textlength(REAL_CREDIT, font=F(SANS, 26)); d.text(((W - tw) / 2, 1500), REAL_CREDIT, font=F(SANS, 26), fill=(255, 245, 230, 220), stroke_width=4, stroke_fill=(0, 0, 0, 200))
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
    pts = [('j0', JUMP + 0.2), ('rm', T['r8'][0] + 0.8), ('a', 0.8), ('h1', HELLS[0][0] + 0.5), ('h2', HELLS[1][0] + 0.5), ('h3', HELLS[2][0] + 0.5), ('h4', HELLS[3][0] + 0.5), ('b', T['r1'][0] + 0.6), ('c', COURTS[0] + 0.1), ('d', T['r3'][0] + 0.3), ('e', T['k2'][0] + 0.2), ('f', T['r5'][0]),
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
put(BUS0, hiss(0.45, 6), 0.35)                                  # bus door
x = tt(BR - BUS0); put(BUS0, (np.sin(2 * np.pi * 42 * x) * 0.05 + np.sin(2 * np.pi * 84 * x) * 0.02).astype(np.float32))   # engine hum
put(BUS0 + 0.05, drum(1.0), 0.9)
for i, s in enumerate(DRUMS): put(s, drum(0.55 + 0.45 * i / max(1, len(DRUMS) - 1)), 0.75)
for s in SLAMS: put(s - 0.02, slam(), 0.9)
def hell_sfx(kind):
    x = tt(1.3); env = np.exp(-x * 1.6)
    sub = np.sin(2 * np.pi * (38 + 20 * np.exp(-x * 8)) * x) * np.exp(-x * 2.5) * 0.9
    if kind == 'hell_sword':                     # metallic ring of blades
        y = sum(np.sin(2 * np.pi * f * x) * np.exp(-x * dcy) for f, dcy in [(1320, 3), (1873, 4), (2610, 6), (3390, 8)]) * 0.12
    elif kind == 'hell_cauldron':                # roaring fire + boiling
        y = lp(rng.normal(0, 1, len(x)), 25) * 0.5 * env + lp(rng.normal(0, 1, len(x)), 4) * (rng.random(len(x)) < 0.002) * 2
    elif kind == 'hell_ice':                     # howling wind
        y = lp(rng.normal(0, 1, len(x)), 60) * (0.6 + 0.4 * np.sin(2 * np.pi * 1.7 * x)) * 0.7
    else:                                        # dragging iron chain
        y = sum(np.sin(2 * np.pi * f * x) * np.exp(-((x - c) % 0.16) * 40) for f, c in [(2200, 0.0), (3100, 0.05), (2700, 0.1)]) * 0.07
    return ((sub + y) * np.minimum(1, x / 0.01)).astype(np.float32)
for hs, kind in HELLS: put(hs - 0.01, hell_sfx(kind), 0.85)
for st_, hk in INTRO: put(st_, hell_sfx('hell_sword' if hk.startswith('real') else 'hell_cauldron'), 0.5)
def hit():
    x = tt(0.35); return (np.sin(2 * np.pi * (60 + 60 * np.exp(-x * 30)) * x) * np.exp(-x * 9)).astype(np.float32)
for sc_ in SUBS: put(sc_, hit(), 0.6)
def roar():
    x = tt(0.9); f = 140 * np.exp(-x * 1.5) + 55
    y = np.tanh(3 * (np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.8 + lp(rng.normal(0, 1, len(x)), 5) * 0.7)) * np.exp(-x * 2.2)
    return (y * np.minimum(1, x / 0.005)).astype(np.float32)
put(JUMP, roar(), 1.3)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'bgm_horror.mp3', '-ac', '1', '-ar', str(SR), 'bed_h.wav'], check=True)
bed, _ = sf.read('bed_h.wav', dtype='float32'); bed = np.tile(bed, 3)[:n]
tax = np.arange(n) / SR
env = np.interp(tax, [0, BUS0 - 0.3, BUS0 + 0.3, DSTOP, T['k4'][0], JUMP + 0.6, JUMP + 1.4, T['r7'][0] - 0.3, FLASH - 0.05, FLASH, END],
                     [0.55, 0.55, 0.16, 0.30, 0.45, 0.45, 0.0, 0.0, 0.5, 0.0, 0.0]).astype(np.float32)
for hs, _ in HELLS: env = np.maximum(env, 0.6 * np.clip(1 - np.abs(tax - hs - 0.55) / 0.9, 0, 1))
vo_env = np.zeros(n, np.float32)
for k_, (a0, a1) in T.items(): vo_env[int(a0 * SR):int(a1 * SR)] = 1
vo_env = np.convolve(vo_env, np.ones(SR // 5) / (SR // 5), 'same')
mix += bed * env * (1 - 0.45 * vo_env)
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
