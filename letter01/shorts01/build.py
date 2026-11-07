"""Zero's letter — Shorts 01 (vertical 1080x1920, ~52 s, seamless loop).
usage: python3 build.py [preview]   -> shorts01.mp4 (+ timeline.json, shorts01.srt)
Needs art/*.png (art.py), takes.json + takes/*.wav (voice.py), ../test/bgm/piano_b.mp3."""
import json, os, subprocess, sys
import numpy as np, soundfile as sf
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from scipy import ndimage
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
PREVIEW = 'preview' in sys.argv
W, H, FPS, SR = 1080, 1920, 30, 24000
TEMPO = 1.14
NOTO_B = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 60, index=1)
NOTO_M = '/usr/share/fonts/opentype/noto/NotoSansCJK-Medium.ttc'
PEN = 'fonts/package/files/nanum-pen-script-korean-400-normal.woff'
f = lambda path, size, idx=1: ImageFont.truetype(path, size, index=idx) if path.endswith('.ttc') else ImageFont.truetype(path, size)

CAP = ['오늘 하루, 잘했다는 말, 누구에게서 들은 적 있나요?', '3초 드릴게요.', '없었죠. 저도 그랬어요.', '그래서, 편지를 써 봤어요.',
       '혼자 아픈 날, 혼자 약을 사 와서 먹은 적 있나요?', '“아쉽지만”을 또 읽고도, 다음 지원서를 열어 본 적 있나요?',
       '고맙다는 말 한마디 없이, 당연한 사람이 되어 버린 적 있나요?', '귀찮아할까 봐, 써 둔 안부를 지운 적 있나요?',
       '아마 다들, 바라는 건 비슷할 거예요.', '누가 한 번만, 알아봐 주는 거요.', '사실 이 편지, 처음엔 저한테 쓰던 거였어요.',
       '아무도 몰라줘도, 없던 일이 되지는 않아요.', '그래서 이 말은, 제가 먼저 할게요.', '오늘 하루, 잘했어요.']
SILENT = {1}             # '3초 드릴게요' dropped with the countdown (operator, 11/1: it breaks the mood); every other line is voiced

# ---------------------------------------------------------------- voice
os.makedirs('tempo', exist_ok=True)
takes = json.load(open('takes.json'))
def clip(i):
    src = takes[str(i)]['take']; dst = f'tempo/{i:02d}.wav'
    if not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(src):
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', src, '-af', f'atempo={TEMPO}', '-ar', str(SR), '-ac', '1', dst], check=True)
    w, _ = sf.read(dst, dtype='float32'); a = np.abs(w); thr = a.max() * 0.02; idx = np.where(a > thr)[0]
    w = w[max(0, idx[0] - 480): idx[-1] + 1440].copy(); fi, fo = 240, 960
    w[:fi] *= np.linspace(0, 1, fi); w[-fo:] *= np.linspace(1, 0, fo)
    return w
VO = {i: clip(i) for i in range(len(CAP)) if i not in SILENT}
dur = lambda i: len(VO[i]) / SR

# ---------------------------------------------------------------- art
def autocrop(im):
    """cut the white watercolour-paper margin some generations add, then cover-fit to 9:16."""
    g = np.asarray(im.convert('L')).astype(np.float32); h, w = g.shape
    def edge(lines):
        k = 0
        while k < len(lines) // 6 and (lines[k] > 200).mean() > 0.35: k += 1
        return k + (6 if k else 0)
    top = edge([g[i] for i in range(h)]); bot = edge([g[h - 1 - i] for i in range(h)])
    lef = edge([g[:, i] for i in range(w)]); rig = edge([g[:, w - 1 - i] for i in range(w)])
    im = im.crop((lef, top, w - rig, h - bot)); w, h = im.size
    if w / h > 9 / 16: nw = int(h * 9 / 16); im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else: nh = int(w * 16 / 9); im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    return im
def load(k, scale=1.25):
    im = autocrop(Image.open(f'art/{k}.png').convert('RGB'))
    return im.resize((int(W * scale), int(H * scale)), Image.LANCZOS)
ART = {k: load(k) for k in ['corridor', 'envelope', 'room1', 'room2', 'room3', 'room4', 'zeroroom']}
navy = Image.new('RGB', ART['corridor'].size, (10, 14, 30))
ART['corridor_dark'] = Image.blend(Image.eval(ART['corridor'], lambda v: int(v * 0.26)), navy, 0.3)
BD = Image.open('art/building_dark.png').convert('RGB'); BL = Image.open('art/building_lit.png').convert('RGB').resize(BD.size)
bd, bl = np.asarray(BD).astype(np.float32), np.asarray(BL).astype(np.float32)

# windows that light up: bright, warm pixels that are much brighter in the lit plate
lum = lambda a: a @ np.array([0.3, 0.59, 0.11], np.float32)
diff = lum(bl) - lum(bd); warm = (bl[..., 0] - bl[..., 2]) > 25
mask = ndimage.binary_opening((diff > 45) & warm, iterations=2)
lab, n = ndimage.label(ndimage.binary_closing(mask, iterations=3))
wins = []
for k, sl in enumerate(ndimage.find_objects(lab), 1):
    ys, xs = sl; area = (lab[sl] == k).sum()
    if area < 0.00015 * mask.size: continue
    wins.append(dict(x0=xs.start, x1=xs.stop, y0=ys.start, y1=ys.stop, cx=(xs.start + xs.stop) / 2 / BD.width, cy=(ys.start + ys.stop) / 2 / BD.height, area=area))
assert len(wins) >= 6, f'only {len(wins)} lit windows found'
# Zero's window: lowest, nearest the centre; the four story windows: spread over the building, top to bottom
zero = max(wins, key=lambda w: w['cy'] - abs(w['cx'] - 0.5) * 0.6)
rest = sorted([w for w in wins if w is not zero], key=lambda w: w['cy'])
pick = [rest[int(round(j * (len(rest) - 1) / 3))] for j in range(4)] if len(rest) >= 4 else rest
others = [w for w in rest if w not in pick]
H_, W_ = bd.shape[:2]
def wmask(w, feather=6):
    m = np.zeros((H_, W_), np.float32); pad = 4
    m[max(0, w['y0'] - pad):w['y1'] + pad, max(0, w['x0'] - pad):w['x1'] + pad] = 1
    return ndimage.gaussian_filter(m, feather)[..., None]
WM = {id(w): wmask(w) for w in wins}
def building(on):           # on: {id(window): 0..1}
    a = bd.copy()
    for wid, k in on.items():
        if k > 0: a += (bl - bd) * WM[wid] * k
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))

# ---------------------------------------------------------------- helpers
def ease(x): x = min(max(x, 0.0), 1.0); return x * x * (3 - 2 * x)
def view(im, z, cx=0.5, cy=0.5):
    w, h = im.size; cw, ch = w / z, h / z
    x0 = min(max(cx * w - cw / 2, 0), w - cw); y0 = min(max(cy * h - ch / 2, 0), h - ch)
    return im.resize((W, H), Image.BILINEAR, box=(x0, y0, x0 + cw, y0 + ch))
def wrap(txt, font, maxw, d):
    words = txt.split(' '); lines = ['']
    for wd in words:
        t = (lines[-1] + ' ' + wd).strip()
        if d.textlength(t, font=font) <= maxw: lines[-1] = t
        else: lines.append(wd)
    return lines
_D = ImageDraw.Draw(Image.new('RGB', (10, 10)))
def caption(fr, txt, a):
    if not txt or a <= 0: return fr
    ov = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    lines = wrap(txt, NOTO_B, 800, d); lh = 84; y = 1395 - lh * len(lines)
    for ln in lines:
        tw = d.textlength(ln, font=NOTO_B)
        d.text(((W - tw) / 2, y), ln, font=NOTO_B, fill=(255, 247, 232, int(255 * a)), stroke_width=7, stroke_fill=(12, 16, 34, int(215 * a)))
        y += lh
    return Image.alpha_composite(fr.convert('RGBA'), ov).convert('RGB')
def card(fr, draw_fn, a, y=250, h=300):
    if a <= 0: return fr
    ov = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    sh = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(sh).rounded_rectangle((110, y + 10, 970, y + h + 10), 36, fill=(0, 0, 0, int(90 * a)))
    ov = Image.alpha_composite(ov, sh.filter(ImageFilter.GaussianBlur(14))); d = ImageDraw.Draw(ov)
    d.rounded_rectangle((100, y, 960, y + h), 34, fill=(250, 248, 244, int(242 * a)))
    draw_fn(d, a, y)
    return Image.alpha_composite(fr.convert('RGBA'), ov).convert('RGB')

F_SM, F_MD, F_BIG = f(NOTO_M, 34), f(NOTO_M, 42), f(NOTO_M, 76)
def mail(stage, a, t):
    def fn(d, a, y):
        if stage == 0:
            d.text((150, y + 40), '채용 결과 안내', font=F_SM, fill=(120, 120, 128, int(255 * a)))
            for j, ln in enumerate(['아쉽지만, 이번 채용에서는', '함께하지 못하게 되었습니다.']):
                d.text((150, y + 100 + j * 62), ln, font=F_MD, fill=(30, 30, 40, int(255 * a)))
        else:
            d.text((150, y + 40), '새 지원서', font=F_SM, fill=(120, 120, 128, int(255 * a)))
            d.text((150, y + 110), '지원 동기', font=F_MD, fill=(30, 30, 40, int(255 * a)))
            if int(t * 2) % 2 == 0: d.rectangle((150, y + 190, 154, y + 240), fill=(40, 90, 220, int(255 * a)))
    return fn
def hello(txt, a, t):
    def fn(d, a, y):
        d.rounded_rectangle((140, y + 60, 820, y + 200), 28, fill=(255, 255, 255, int(255 * a)), outline=(200, 200, 205, int(255 * a)), width=3)
        tw = d.textlength(txt, font=F_BIG); d.text((180, y + 82), txt, font=F_BIG, fill=(25, 25, 30, int(255 * a)))
        if int(t * 2.2) % 2 == 0: d.rectangle((186 + tw, y + 92, 191 + tw, y + 172), fill=(40, 90, 220, int(255 * a)))
        d.rounded_rectangle((840, y + 80, 930, y + 180), 24, fill=(225, 225, 228, int(255 * a)))
        d.text((858, y + 105), '전송', font=F_SM, fill=(150, 150, 155, int(255 * a)))
    return fn

# the letter close-up (handwriting)
FINAL = '오늘 하루, 잘했어요.'; FX0, FY0, FY1 = 150, 1075, 1235      # last handwritten line (unscaled letter coords)
def letter_img(final=False):
    rng = np.random.default_rng(3)
    paper = np.ones((H, W, 3), np.float32) * np.array([243, 234, 214], np.float32)
    paper += ndimage.gaussian_filter(rng.normal(0, 9, (H, W)), 2)[..., None]
    im = Image.fromarray(np.clip(paper, 0, 255).astype(np.uint8)); d = ImageDraw.Draw(im)
    for yy in range(560, 1500, 92): d.line((110, yy, 970, yy), fill=(205, 192, 168), width=2)
    pen = ImageFont.truetype(PEN, 120); pen2 = ImageFont.truetype(PEN, 108)
    d.text((150, 360), '당신에게', font=pen, fill=(48, 44, 52))
    d.text((165, 470), '제로에게', font=pen2, fill=(120, 116, 118))
    tw = d.textlength('제로에게', font=pen2)
    for off, jit in [(522, 4), (540, -3)]:
        d.line((150, off + jit, 175 + tw, off - jit), fill=(70, 66, 72), width=7)
    if final: d.text((FX0, FY0), FINAL, font=ImageFont.truetype(PEN, 116), fill=(40, 36, 46))
    for yy in range(640, 1060, 92):                       # pencil scribbles = the letter body (unreadable)
        x = 150; end = rng.integers(620, 900)
        pts = []
        while x < end:
            pts.append((x, yy - 28 + rng.normal(0, 6))); x += rng.integers(14, 26)
        d.line(pts, fill=(150, 144, 140), width=4, joint='curve')
    eraser = Image.new('RGBA', (W, H), (0, 0, 0, 0)); de = ImageDraw.Draw(eraser)
    for _ in range(26):
        x, y = rng.normal(760, 60), rng.normal(560, 40); r = rng.uniform(3, 7)
        de.ellipse((x - r, y - r * 0.7, x + r, y + r * 0.7), fill=(225, 215, 205, 255))
    im = Image.alpha_composite(im.convert('RGBA'), eraser).convert('RGB')
    vign = np.asarray(im).astype(np.float32); yy, xx = np.mgrid[0:H, 0:W]
    v = 1 - 0.35 * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
    return Image.fromarray(np.clip(vign * v[..., None], 0, 255).astype(np.uint8)).resize((int(W * 1.15), int(H * 1.15)), Image.LANCZOS)
ART['letter'] = letter_img(); ART['letter_full'] = letter_img(True)
FTW = ImageDraw.Draw(Image.new('RGB', (9, 9))).textlength(FINAL, font=ImageFont.truetype(PEN, 116))

# ---------------------------------------------------------------- timeline
T = {}; t = 0.15
def say(i, gap_after):
    global t
    T[i] = (t, t + dur(i)); t += dur(i) + gap_after
say(0, 0.0)
CD0 = t; OFF = CD0 + 1.1; CDL = 0.0; t = OFF + 1.0      # no countdown: a quiet beat after the question, the sensor light goes out on its own
say(2, 0.25)
ENV0 = t - 0.15; say(3, 0.35)
B0 = t                                          # building appears (dark)
WIN = []                                        # per story window: (light_on, room_in, line)
for j, i in enumerate([4, 5, 6, 7]):
    lit = t + 0.25; rin = t + 0.8; t = rin + 0.3
    say(i, 0.3)
    WIN.append((lit, rin, T[i][1]))
PB0 = t                                          # pull back: the whole building, others light, captions 8 & 9
t = PB0 + 0.35; say(8, 0.2); say(9, 0.0); PBE = T[9][1]; t = PBE - 0.9
ZL = t                                          # Zero's window lights last
ZIN = t + 0.9; t = ZIN + 0.35
say(10, 0.3)
LET0 = T[10][0] + 1.1
say(11, 0.3)                                    # on the letter
WR0 = t; say(12, 0.25); WR1 = WR0 + 2.6         # the pencil writes the last line while line 12 is read
C0 = max(t, WR1 + 0.3)                          # back in the dark corridor
t = C0 + 0.55; say(13, 0.0)                      # '오늘 하루, 잘했어요.'
ON = T[13][0] + 0.35                            # ...and the sensor light comes on with it
END = T[13][1] + 1.9
print('length %.1f s' % END)

# camera on the building: wide -> each window -> wide
def bcam(s):
    if s < WIN[0][0] - 0.25: return 1.0, 0.5, 0.5
    for j, (lit, rin, lend) in enumerate(WIN):
        w = pick[j]; zt = 2.6
        if lit - 0.25 <= s < rin + 0.6:
            k = ease((s - (lit - 0.25)) / 0.95); return 1.0 + (zt - 1.0) * k, 0.5 + (w['cx'] - 0.5) * k, 0.5 + (w['cy'] - 0.5) * k
        nxt = WIN[j + 1][0] - 0.25 if j < 3 else PB0
        if rin + 0.6 <= s < nxt: return 1.0, 0.5, 0.5
    if s < ZL: return 1.0 + 0.04 * ease((s - PB0) / 4.0), 0.5, 0.5
    k = ease((s - ZL) / 1.15); return 1.04 + (2.6 - 1.04) * k, 0.5 + (zero['cx'] - 0.5) * k, 0.5 + (zero['cy'] - 0.5) * k

def lights(s):
    on = {}
    for j, (lit, rin, lend) in enumerate(WIN):
        if s >= lit: on[id(pick[j])] = ease((s - lit) / 0.35)
    for q, w in enumerate(others):
        st = PB0 + 0.1 + (PBE - PB0 - 1.2) * q / max(1, len(others))
        if s >= st: on[id(w)] = ease((s - st) / 0.5)
    if s >= ZL + 0.3: on[id(zero)] = ease((s - ZL - 0.3) / 0.4)
    return on

# shots: (start, crossfade-in, renderer)
def sh_corridor_open(s): return view(ART['corridor'], 1.06 + 0.05 * ease(s / CD0), 0.5, 0.5)
def sh_corridor_cd(s):
    z = 1.11; a = view(ART['corridor'], z); b = view(ART['corridor_dark'], z)
    return Image.blend(a, b, ease((s - OFF) / 0.12)) if s >= OFF else a
def sh_corridor_dark(s): return view(ART['corridor_dark'], 1.11 + 0.02 * ease((s - OFF) / 5))
def sh_envelope(s): return view(ART['envelope'], 1.06 + 0.07 * ease((s - ENV0) / 4))
def sh_building(s):
    z, cx, cy = bcam(s); return view(building(lights(s)), z, cx, cy)
def sh_room(k):
    def r(s):
        t0 = WIN[k][1]; return view(ART[f'room{k + 1}'], 1.08 + 0.08 * ease((s - t0) / 6), 0.5, 0.48)
    return r
def sh_zero(s): return view(ART['zeroroom'], 1.07 + 0.06 * ease((s - ZIN) / 5), 0.5, 0.5)
def sh_letter(s):
    im = ART['letter']
    if s >= WR0:                                 # pencil reveal, left to right
        k = ease((s - WR0) / (WR1 - WR0)); sc = 1.15
        x0, y0, y1 = int(FX0 * sc), int((FY0 - 10) * sc), int(FY1 * sc); xr = int((FX0 + 10 + FTW * k) * sc)
        if xr > x0:
            im = im.copy(); im.paste(ART['letter_full'].crop((x0, y0, xr, y1)), (x0, y0))
    pan = ease((s - (WR0 - 0.8)) / 1.6)
    return view(im, 1.0 + 0.10 * ease((s - LET0) / 4) + 0.06 * pan, 0.40, 0.30 + 0.20 * pan)
def sh_corridor_end(s):
    z = 1.13 - 0.07 * ease((s - C0) / (END - C0))          # lands exactly on the opening frame (z = 1.06)
    a = view(ART['corridor_dark'], z); b = view(ART['corridor'], z)
    return Image.blend(a, b, ease((s - ON) / 0.15)) if s >= ON else a

SHOTS = [(0, 0, sh_corridor_open), (CD0, 0.0, sh_corridor_cd), (OFF + 0.3, 0.0, sh_corridor_dark), (ENV0, 0.45, sh_envelope), (B0, 0.6, sh_building)]
for k, (lit, rin, lend) in enumerate(WIN):
    SHOTS.append((rin, 0.4, sh_room(k)))
    SHOTS.append((lend + 0.1, 0.35, sh_building))
SHOTS += [(ZIN, 0.55, sh_zero), (LET0, 0.6, sh_letter), (C0, 0.5, sh_corridor_end)]
SHOTS.sort(key=lambda x: x[0])

def frame(s):
    j = max(i for i, sh in enumerate(SHOTS) if sh[0] <= s)
    st, xf, fn = SHOTS[j]; fr = fn(s)
    if xf > 0 and s < st + xf and j > 0:
        fr = Image.blend(SHOTS[j - 1][2](s), fr, ease((s - st) / xf))
    # countdown
    if CD0 <= s < CD0 + CDL:
        n = 3 - int(s - CD0); ph = (s - CD0) % 1
        ov = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(ov); BIG = f(NOTO_M, 260)
        tw = d.textlength(str(n), font=BIG); al = int(235 * (1 - ph) ** 0.6)
        d.text(((W - tw) / 2, 330), str(n), font=BIG, fill=(255, 236, 205, al), stroke_width=8, stroke_fill=(10, 14, 30, int(al * 0.7)))
        fr = Image.alpha_composite(fr.convert('RGBA'), ov).convert('RGB')
    # cards
    if WIN[1][1] <= s < T[5][1] + 0.3:
        t0 = WIN[1][1] + 0.3; sw = T[5][0] + 2.9
        if s < sw: fr = card(fr, mail(0, 1, s), ease((s - t0) / 0.3) * (1 - ease((s - sw + 0.25) / 0.25)))
        else: fr = card(fr, mail(1, 1, s), ease((s - sw) / 0.3) * (1 - ease((s - T[5][1]) / 0.3)))
    if WIN[3][1] + 0.2 <= s < T[7][1] + 0.3:
        t0 = WIN[3][1] + 0.4; full = '잘 지내니'; tt = s - t0
        typed = min(len(full), max(0, int(tt / 0.28)))
        hold = len(full) * 0.28 + 0.9
        if tt > hold: typed = max(0, len(full) - int((tt - hold) / 0.16))
        a = ease((s - (WIN[3][1] + 0.2)) / 0.3) * (1 - ease((s - T[7][1]) / 0.3))
        fr = card(fr, hello(full[:typed], 1, s), a, y=230, h=260)
    # captions
    for i, (a0, a1) in T.items():
        if a0 - 0.12 <= s <= a1 + 0.25:
            fr = caption(fr, CAP[i], min(1, (s - a0 + 0.12) / 0.15, (a1 + 0.25 - s) / 0.2)); break
    return fr

# ---------------------------------------------------------------- render video
if PREVIEW:
    for name, s in [('p_hook', 2.0), ('p_cd', OFF + 0.5), ('p_env', T[3][0] + 1), ('p_b1', WIN[0][0] + 0.6), ('p_r1', T[4][0] + 1.5),
                    ('p_r2a', T[5][0] + 1.0), ('p_r2b', T[5][1] - 0.5), ('p_r3', T[6][0] + 2), ('p_r4', T[7][0] + 1.4), ('p_pb', T[9][0] + 0.8),
                    ('p_zero', T[10][0] + 0.5), ('p_let', T[10][1] - 0.3), ('p_wr', WR0 + 1.5), ('p_wr2', WR1 + 0.2), ('p_on', ON + 0.5), ('p_end', END - 0.05), ('p_start', 0.0)]:
        frame(s).resize((360, 640)).save(f'{name}.jpg', quality=85)
    sys.exit()
os.makedirs('frames', exist_ok=True)
nF = int(round(END * FPS))
import time as _t; _t0 = _t.time()
for k in range(nF):
    fn = f'frames/{k:05d}.jpg'
    if os.path.exists(fn): continue
    frame(k / FPS).save(fn + '.tmp.jpg', quality=92); os.replace(fn + '.tmp.jpg', fn)
    if k % 100 == 0: print('frame', k, '/', nF, '%.0fs' % (_t.time() - _t0), flush=True)
    if 'chunk' in sys.argv and _t.time() - _t0 > 520: print('chunk done at', k, flush=True); sys.exit(3)

# ---------------------------------------------------------------- audio
n = int(END * SR) + SR; voice = np.zeros(n, np.float32)
for i, w in VO.items():
    a = int(T[i][0] * SR); voice[a:a + len(w)] += w
voice = voice / (np.abs(voice).max() + 1e-9) * 0.85
sfx = np.zeros(n, np.float32)
def put(at, x, g):
    a = int(at * SR); sfx[a:a + len(x)] += x[:max(0, n - a)] * g
tt = np.arange(int(0.04 * SR)) / SR
tick = (np.sin(2 * np.pi * 2100 * tt) * np.exp(-tt / 0.003) + 0.6 * np.sin(2 * np.pi * 950 * tt) * np.exp(-tt / 0.006)).astype(np.float32)
relay = (np.sin(2 * np.pi * 1700 * tt) * np.exp(-tt / 0.004) * 0.9 + np.sin(2 * np.pi * 180 * tt) * np.exp(-tt / 0.01) * 0.7).astype(np.float32)
tok = (np.sin(2 * np.pi * 420 * tt) * np.exp(-tt / 0.012)).astype(np.float32)
put(OFF, relay, 0.22); put(ON, relay, 0.22)
for lit, _, _ in WIN: put(lit, tok, 0.10)
put(ZL + 0.3, tok, 0.12)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '../test/bgm/piano_b.mp3', '-ac', '1', '-ar', str(SR), '-t', str(END + 1), 'bed.wav'], check=True)
bed, _ = sf.read('bed.wav', dtype='float32'); bed = np.pad(bed, (0, max(0, n - len(bed))))[:n]
tax = np.arange(n) / SR
env = np.full(n, 0.20, np.float32)
env *= np.clip(tax / 1.2, 0, 1)                                   # fade in
env *= 1 - 0.35 * np.clip(np.convolve((np.abs(voice) > 0.02).astype(np.float32), np.ones(SR // 5) / (SR // 5), 'same'), 0, 1)   # duck under voice
# music never stops (operator, 11/1): only a gentle, smooth dip under the reveal, back to full when the light comes on
dip = np.interp(tax, [T[10][0] - 1.0, T[10][0], ON - 0.5, ON + 1.0], [1.0, 0.75, 0.75, 1.0])
env *= dip.astype(np.float32)
env *= np.clip((END - tax) / 0.8, 0, 1)                           # fade out into the loop
mix = voice + sfx + bed * env
mix = mix[:int(END * SR)]; mix = mix / (np.abs(mix).max() + 1e-9) * 0.9
sf.write('mix.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', 'frames/%05d.jpg', '-i', 'mix.wav',
                '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '19', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k',
                '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-shortest', '-movflags', '+faststart', 'shorts01.mp4'], check=True)
json.dump({'end': END, 'lines': {i: [round(a, 2), round(b, 2)] for i, (a, b) in T.items()}}, open('timeline.json', 'w'), ensure_ascii=False, indent=1)
def ts(x): h = int(x // 3600); m = int(x % 3600 // 60); return '%02d:%02d:%06.3f' % (h, m, x % 60)
with open('shorts01.srt', 'w') as fo:
    for k, i in enumerate(sorted(T, key=lambda i: T[i][0]), 1):
        fo.write(f'{k}\n{ts(T[i][0]).replace(".", ",")} --> {ts(T[i][1] + 0.25).replace(".", ",")}\n{CAP[i]}\n\n')
subprocess.run('rm -rf frames bed.wav', shell=True)
print('ok shorts01.mp4 %.1f s' % END)
