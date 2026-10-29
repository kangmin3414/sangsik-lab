"""Assemble the channel trailer: clip/card segments -> base video, opaque subtitle band + timed subtitles, music bed + voice."""
import json, os, subprocess, sys
import numpy as np, soundfile as sf
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
SP = os.path.abspath('..')
SRC = {"walk": f"{SP}/walk/만약에연구소_실험002_매일30분걷는다면_v2.mp4", "phone": f"{SP}/phone/만약에연구소_실험003_일주일스마트폰끊기_v3.mp4",
       "sugar": f"{SP}/sugar/만약에연구소_실험004_한달설탕끊기_v3.mp4", "zhuangzi": f"{SP}/zhuangzi4/만약에연구소_실험008_장자처럼남의잣대내려놓기_v4.mp4"}
FPS = 24
TL = json.load(open('timeline.json')); L = TL['lines']; DUR = TL['duration']
C = json.load(open('cuts.json')); cuts, nfr = C['cuts'], C['nfr']
W = json.load(open('words.json'))
def run(cmd): subprocess.run(cmd, check=True)
os.makedirs('build', exist_ok=True)

# 1) segments
segs = []
for i, l in enumerate(L):
    out = f'build/seg{i:02d}.mp4'; segs.append(out)
    if l['scene'] == 'clip':
        run(['ffmpeg', '-v', 'error', '-y', '-ss', str(l['args']['ss']), '-i', SRC[l['args']['src']], '-frames:v', str(nfr[i]), '-an',
             '-vf', 'scale=1920:1080,fps=24,format=yuv420p', '-c:v', 'libx264', '-crf', '16', '-preset', 'medium', '-r', '24', out])
    else:
        kind = l['args']['kind']
        run(['ffmpeg', '-v', 'error', '-y', '-framerate', '24', '-i', f'frames/{kind}_%04d.jpg', '-frames:v', str(nfr[i]),
             '-vf', 'format=yuv420p', '-c:v', 'libx264', '-crf', '16', '-preset', 'medium', '-r', '24', out])
open('build/list.txt', 'w').write(''.join(f"file '{os.path.abspath(s)}'\n" for s in segs))
run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', 'build/list.txt', '-c', 'copy', 'build/base.mp4'])

# 2) subtitle parts (absolute times)
def wstart(word, after):
    for w, s, e in W:
        if s >= after - 0.05 and w.startswith(word): return s
    raise SystemExit(f'word not found: {word}')
parts = []
SPLIT = {6: [("상식실험실은 습관 하나를 바꾸면", "내 몸과 마음에 무슨 일이 생기는지,"), ("직접", ("직접 해 보고, 진짜 연구로", "확인하는 채널입니다."))],
         7: [("평일에는 술, 잠, 커피 같은", "건강 상식을,"), ("주말에는", ("주말에는 니체와 장자처럼", "철학자로 살아 보는 실험을 합니다."))]}
LINES = {0: ("걷기만 했는데, 뇌가 다시 자랐습니다.",), 1: ("1년 동안 꾸준히 걸은 노인들의 해마가,", "2% 커졌거든요."),
         2: ("폰을 다른 방에 둔 사람들은,", "집중력 시험 점수가 가장 높았고요."), 3: ("단 걸 먹은 사람들은,", "한 시간 안에 오히려 더 피곤해졌습니다."),
         4: ("쉬는 걸 시간 낭비라고 믿는 사람일수록,", "쉬어도 덜 즐거웠어요."), 5: ("전부, 실제 연구에서 나온 결과예요.",),
         8: ("매일 저녁 7시, 새 실험이 올라옵니다.",), 9: ("다음 실험이 궁금하다면, 구독해 두세요.",)}
for i, l in enumerate(L):
    a, b = cuts[i], cuts[i + 1]
    if i in SPLIT:
        first, (word, second) = SPLIT[i]
        m = round(wstart(word, l['t0']) - 0.1, 3)
        parts += [(a, m, first), (m, b, second)]
    else:
        parts.append((a, b, LINES[i]))
FONT = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
f = ImageFont.truetype(FONT, 54); fw = ImageFont.truetype(FONT, 22)
band = Image.new('RGBA', (1920, 1080), (0, 0, 0, 0)); d = ImageDraw.Draw(band)
d.rectangle([0, 874, 1920, 1080], fill=(17, 24, 36, 255)); d.rectangle([0, 874, 1920, 878], fill=(61, 242, 176, 255))
tw = d.textlength('상식실험실', font=fw); d.text((1900 - tw, 1046), '상식실험실', font=fw, fill=(120, 136, 158, 255))
band.save('build/band.png')
subs = []
for k, (a, b, lines) in enumerate(parts):
    im = Image.new('RGBA', (1920, 1080), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    lh = 70; y0 = 976 - lh * len(lines) / 2
    for j, t in enumerate(lines):
        w = d.textlength(t, font=f); assert w < 1800, t
        d.text(((1920 - w) / 2, y0 + j * lh), t, font=f, fill=(255, 255, 255, 255), stroke_width=6, stroke_fill=(20, 20, 20, 255))
    p = f'build/sub{k:02d}.png'; im.save(p); subs.append((a, b, p))
json.dump([(a, b, ' / '.join(t)) for a, b, t in parts], open('build/subs.json', 'w'), ensure_ascii=False, indent=1)

# 3) music bed + light sfx
sys.path.insert(0, f'{SP}/shorts')
import music as M, theme as T
SR = 44100; N = int(DUR * SR)
voice, _ = sf.read('voice.wav'); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]; voice = voice / (np.abs(voice).max() + 1e-9) * 0.9
card0 = cuts[6]
I = T.smooth_steps([(0, 1.25), (card0 - 1.5, 1.6), (cuts[7], 2.0)], DUR, ramp=2.5)
THEME = dict(root=196.0, mode='ionian', bpm=100, prog=(0, 4, 5, 3, 0, 4, 3, 4), lead='marimba', top='celesta')
music = T.bed(voice, DUR, I, rel_db=-14.0, **THEME)
sfx = np.zeros(N); rng = np.random.default_rng(3)
def put(sig, t0, g):
    i = int(t0 * SR); j = min(N, i + len(sig))
    if 0 <= i < N: sfx[i:j] += sig[: j - i] * g
# chip pops follow the words (same times the card used)
c7 = cuts[7]
for k, wd in enumerate(['술', '잠', '커피', '건강']):
    put(M.inst('marimba', M.note_freq(196.0, 'ionian', (0, 2, 4, 7)[k], 2), 0.5, 0.8, rng), wstart(wd, c7) - 0.06, 0.05)
for k, wd in enumerate(['니체', '니체', '장자', '장자']):
    t = wstart(wd, c7 + 1.0) - 0.06 + (0, 0.22, -0.1, 0.12)[k]
    put(M.inst('marimba', M.note_freq(196.0, 'ionian', (4, 5, 7, 9)[k], 2), 0.5, 0.8, rng), t, 0.05)
put(M.inst('bell', M.note_freq(196.0, 'ionian', 4, 2), 1.6, 0.8), wstart('7시', cuts[8]) - 0.05, 0.06)
click = rng.normal(0, 1, int(0.025 * SR)) * np.exp(-np.linspace(0, 9, int(0.025 * SR))); put(click, wstart('구독', cuts[9]) + 0.05, 0.12)
mix = voice + music + sfx
fade = np.ones(N); fade[-int(1.2 * SR):] = np.linspace(1, 0, int(1.2 * SR)); mix *= fade
mix = mix / (np.abs(mix).max() + 1e-9) * 0.95
sf.write('build/mix.wav', np.stack([mix, mix], 1), SR)

# 4) overlay band + subtitles, mux audio
inputs = ['-i', 'build/base.mp4', '-i', 'build/band.png'] + sum([['-i', p] for _, _, p in subs], []) + ['-i', 'build/mix.wav']
fc = '[0:v][1:v]overlay=0:0[v0]'
for k, (a, b, p) in enumerate(subs):
    fc += f';[v{k}][{k + 2}:v]overlay=0:0:enable=\'between(t,{a:.3f},{b - 0.001:.3f})\'[v{k + 1}]'
out = '상식실험실_채널트레일러.mp4'
run(['ffmpeg', '-v', 'error', '-y'] + inputs + ['-filter_complex', fc, '-map', f'[v{len(subs)}]', '-map', f'{len(subs) + 2}:a',
     '-c:v', 'libx264', '-crf', '17', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-r', '24', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out])
print('done', out)
