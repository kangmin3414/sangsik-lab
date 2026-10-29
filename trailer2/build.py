"""Assemble trailer v2: clip/card segments -> base, subtitle band + episode tags + subtitles, BGM #2 bed + voice (+shutter click).
usage: python3 build.py [cards]   ('cards' re-renders the card frames)"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); sys.path.insert(0, HERE)
SP = os.path.abspath('..')
from script import S
SRC = {"walk": f"{SP}/walk/만약에연구소_실험002_매일30분걷는다면_v2.mp4", "phone": f"{SP}/phone/만약에연구소_실험003_일주일스마트폰끊기_v3.mp4",
       "sugar": f"{SP}/sugar/상식실험실_실험004_한달설탕끊기_v4.mp4", "nie": f"{SP}/nietzsche3/상식실험실_실험005_현대에서니체처럼살기_v4.mp4",
       "sto": f"{SP}/stoic3/상식실험실_실험006_스토아철학자처럼일주일_v5.mp4", "des": f"{SP}/descartes4/상식실험실_실험007_데카르트처럼모든걸의심하기_v7.mp4",
       "zhu": f"{SP}/zhuangzi5/상식실험실_실험008_장자처럼남의잣대내려놓기_v7.mp4", "soc": f"{SP}/socrates3/상식실험실_실험009_소크라테스처럼질문하며살기_v5.mp4",
       "bud": f"{SP}/buddha3/상식실험실_실험010_붓다처럼지금여기에살기_v5.mp4", "tim": f"{SP}/time011/상식실험실_실험011_1년이빨라진게아니었다_v2.mp4"}
TAG = {"walk": "매일 30분 걷기", "phone": "일주일 스마트폰 끊기", "sugar": "한 달 설탕 끊기", "tim": "1년이 빨라진 이유",
       "nie": "니체처럼 살아 보기", "sto": "스토아 철학자처럼 일주일", "des": "데카르트처럼 의심하기", "zhu": "장자처럼 잣대 내려놓기",
       "soc": "소크라테스처럼 질문하기", "bud": "붓다처럼 지금 여기에"}
FPS = 24
TL = json.load(open('timeline.json')); L = TL['lines']; DUR = TL['duration']
W = json.load(open('words.json'))
def run(cmd): subprocess.run(cmd, check=True)
def fr(t): return int(round(t * FPS))
def wstart(word, line):
    for w in W:
        if w[3] == line and w[0].startswith(word): return w[1]
    raise SystemExit(f'word not found: {word} in line {line}')

# ---- timeline of visual segments: (t0, kind, payload, tag, subtitle-part) ----
cuts = [0.0] + [round(l['t0'] - 0.12, 3) for l in L[1:]] + [DUR]
segs = []   # (t0, t1, kind, src/kind, ss, tag)
parts = []  # (t0, t1, text)
for i, (scene, args, sub, spk) in enumerate(S):
    a, b = cuts[i], cuts[i + 1]
    if scene == 'card':
        segs.append([a, b, 'card', args['kind'], 0, None]); parts.append([a, b, sub]); continue
    if scene == 'stats':
        fl = args['flash']; step = (b - a) / len(fl)
        for k, (src, ss) in enumerate(fl): segs.append([a + k * step, a + (k + 1) * step, 'clip', src, ss, None])
        parts.append([a, b, sub]); continue
    pts = [(a, args['src'], args['ss'])] + [(round(wstart(c[0], i) - 0.06, 3), c[1], c[2]) for c in args.get('cuts', [])]
    for k, (t0, src, ss) in enumerate(pts):
        t1 = pts[k + 1][0] if k + 1 < len(pts) else b
        tag = TAG.get(src) if i != 8 else None
        segs.append([t0, t1, 'clip', src, ss, tag])
    if args.get('cuts'):
        # subtitle pieces follow the clip cuts, text split at the cut words
        bounds = [p[0] for p in pts] + [b]; words = [c[0] for c in args['cuts']]
        txt = sub; pieces = []
        for wd in words:
            j = txt.index(wd); pieces.append(txt[:j].strip()); txt = txt[j:]
        pieces.append(txt.strip())
        for k, p in enumerate(pieces): parts.append([bounds[k], bounds[k + 1], p])
    else:
        parts.append([a, b, sub])

os.makedirs('build', exist_ok=True)
# ---- cards ----
if 'cards' in sys.argv[1:] or not os.path.exists('frames/sub_0000.jpg'):
    for s in segs:
        if s[2] == 'card':
            n = fr(s[1]) - fr(s[0]); tc = (wstart('구독', 9) - s[0] + 0.05) if s[3] == 'sub' else 1.4
            run(['python3', 'cards2.py', s[3], str(n), f'{tc:.3f}'])
# ---- render segments ----
files = []
for k, (t0, t1, kind, what, ss, tag) in enumerate(segs):
    n = fr(t1) - fr(t0); out = f'build/seg{k:02d}.mp4'; files.append(out)
    if kind == 'clip':
        run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{ss:.3f}', '-i', SRC[what], '-frames:v', str(n), '-an',
             '-vf', 'scale=1920:1080,fps=24,format=yuv420p', '-c:v', 'libx264', '-crf', '15', '-preset', 'medium', '-r', '24', out])
    else:
        run(['ffmpeg', '-v', 'error', '-y', '-framerate', '24', '-i', f'frames/{what}_%04d.jpg', '-frames:v', str(n),
             '-vf', 'format=yuv420p', '-c:v', 'libx264', '-crf', '15', '-preset', 'medium', '-r', '24', out])
open('build/list.txt', 'w').write(''.join(f"file '{os.path.abspath(s)}'\n" for s in files))
run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', 'build/list.txt', '-c', 'copy', 'build/base.mp4'])

# ---- overlays: band, tags, subtitles ----
FONT = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
f = ImageFont.truetype(FONT, 54); fw = ImageFont.truetype(FONT, 22); ft = ImageFont.truetype(FONT, 26)
band = Image.new('RGBA', (1920, 1080), (0, 0, 0, 0)); d = ImageDraw.Draw(band)
d.rectangle([0, 874, 1920, 1080], fill=(17, 24, 36, 255)); d.rectangle([0, 874, 1920, 878], fill=(61, 242, 176, 255))
tw = d.textlength('상식실험실', font=fw); d.text((1900 - tw, 1046), '상식실험실', font=fw, fill=(120, 136, 158, 255))
band.save('build/band.png')

def wrap(t):
    if d.textlength(t, font=f) < 1640: return [t]
    cs = [k for k, c in enumerate(t) if c == ',']
    k = min(cs, key=lambda k: abs(k - len(t) / 2)); return [t[:k + 1].strip(), t[k + 1:].strip()]

ovs = []  # (t0, t1, png)
for k, (a, b, t) in enumerate(parts):
    im = Image.new('RGBA', (1920, 1080), (0, 0, 0, 0)); dd = ImageDraw.Draw(im); rows = wrap(t)
    lh = 70; y0 = 982 - lh * len(rows) / 2
    for j, r in enumerate(rows):
        w = dd.textlength(r, font=f); assert w < 1800, r
        dd.text(((1920 - w) / 2, y0 + j * lh - 6), r, font=f, fill=(255, 255, 255, 255), stroke_width=6, stroke_fill=(20, 20, 20, 255))
    p = f'build/sub{k:02d}.png'; im.save(p); ovs.append((a, b, p))
# episode tags: small pill inside the band, top-left
merged = []
for (t0, t1, kind, what, ss, tag) in segs:
    if not tag: continue
    if merged and merged[-1][2] == tag and abs(merged[-1][1] - t0) < 1e-3: merged[-1][1] = t1
    else: merged.append([t0, t1, tag])
for k, (a, b, tag) in enumerate(merged):
    im = Image.new('RGBA', (1920, 1080), (0, 0, 0, 0)); dd = ImageDraw.Draw(im)
    lab = '지난 실험'; w1 = dd.textlength(lab, font=ft); w2 = dd.textlength(tag, font=ft)
    x, y = 28, 892
    dd.rounded_rectangle([x, y, x + w1 + 28, y + 40], 20, fill=(61, 242, 176, 255))
    dd.text((x + 14, y + 2), lab, font=ft, fill=(11, 22, 38, 255))
    dd.text((x + w1 + 42, y + 2), tag, font=ft, fill=(201, 211, 223, 255))
    p = f'build/tag{k:02d}.png'; im.save(p); ovs.append((a, b, p))
json.dump({'segs': segs, 'parts': parts, 'tags': merged}, open('build/plan.json', 'w'), ensure_ascii=False, indent=1)

# ---- audio: BGM #2 (song's own ending lands at the end) + voice + shutter click ----
sys.path.insert(0, f'{SP}/bgm')
from mixer import mix, SR
import librosa
song, _ = librosa.load(f'{SP}/bgm/cand_2_strings_b.mp3', sr=SR, mono=False); song = song.T
N = int(DUR * SR); off = int((171.0 - (L[9]['t1'] - 0.1)) * SR)   # the song's last note (171.0 s) rings out over the end card, right after the last word
music = song[off:off + N]
voice, sr = sf.read('voice.wav'); assert sr == SR
voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]; voice = voice / (np.abs(voice).max() + 1e-9) * 0.9
m = mix(voice, music, bed_db=-9.5, duck_db=-7.0, fade_in=0.6, fade_out=0.3)
rng = np.random.default_rng(11)
def click(at, g):
    n = int(0.09 * SR); x = rng.standard_normal(n) * np.exp(-np.linspace(0, 9, n))
    x2 = np.zeros(n); kk = int(0.035 * SR); x2[kk:] = x[:n - kk] * 0.7
    i = int(at * SR); m[i:i + n] += ((x + x2) * g)[:, None]
s8 = [s for s in segs if s[3] == 'tim' and s[4] > 300][0]
click(s8[0] + (310.938 - 0.05) - s8[4], 0.14)                      # the studio flash in ep. 011
tc = wstart('구독', 9) + 0.05                                        # subscribe-button click
n = int(0.025 * SR); c = rng.normal(0, 1, n) * np.exp(-np.linspace(0, 9, n)); i = int(tc * SR); m[i:i + n] += (c * 0.12)[:, None]
m = m / (np.abs(m).max() + 1e-9) * 0.92
sf.write('build/mix.wav', m, SR)
# loudness: two-pass loudnorm to -14 LUFS
r = subprocess.run(['ffmpeg', '-hide_banner', '-i', 'build/mix.wav', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'],
                   capture_output=True, text=True).stderr
js = json.loads(r[r.rindex('{'):r.rindex('}') + 1])
ln = (f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={js['input_i']}:measured_TP={js['input_tp']}:measured_LRA={js['input_lra']}"
      f":measured_thresh={js['input_thresh']}:offset={js['target_offset']}:linear=true")
run(['ffmpeg', '-v', 'error', '-y', '-i', 'build/mix.wav', '-af', ln + ',aresample=48000', 'build/mix_ln.wav'])

# ---- composite ----
inputs = ['-i', 'build/base.mp4', '-i', 'build/band.png'] + sum([['-i', p] for _, _, p in ovs], []) + ['-i', 'build/mix_ln.wav']
fc = '[0:v][1:v]overlay=0:0[v0]'
for k, (a, b, p) in enumerate(ovs):
    fc += f";[v{k}][{k + 2}:v]overlay=0:0:enable='between(t,{a:.3f},{b - 0.001:.3f})'[v{k + 1}]"
out = '상식실험실_채널트레일러_v2.mp4'
run(['ffmpeg', '-v', 'error', '-y'] + inputs + ['-filter_complex', fc, '-map', f'[v{len(ovs)}]', '-map', f'{len(ovs) + 2}:a',
     '-c:v', 'libx264', '-crf', '17', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-r', '24', '-c:a', 'aac', '-b:a', '192k',
     '-shortest', '-movflags', '+faststart', out])
print('done', out, round(DUR, 2), 's')
