"""Build compilation #1: intro card + (chapter card + episode) x4 -> one 1080p24 mp4, plus merged SRT and chapter list."""
import os, subprocess, json
HERE = os.path.dirname(os.path.abspath(__file__)); SP = os.path.dirname(HERE)
EPS = [
 ('stoic3/상식실험실_실험006_스토아철학자처럼일주일_v5.mp4', 'stoic3/상식실험실_실험006_자막_v4.srt'),
 ('descartes4/상식실험실_실험007_데카르트처럼모든걸의심하기_v9.mp4', 'descartes4/상식실험실_실험007_자막_v7.srt'),
 ('zhuangzi5/상식실험실_실험008_장자처럼남의잣대내려놓기_v9.mp4', 'zhuangzi5/상식실험실_실험008_자막_v7.srt'),
 ('socrates3/상식실험실_실험009_소크라테스처럼질문하며살기_v6.mp4', 'socrates3/상식실험실_실험009_자막_v4.srt'),
]
INTRO, CARD = 6.0, 3.0
BGM = f'{SP}/bgm/cand_1_piano_a.mp3'
OUT = f'{HERE}/상식실험실_몰아보기01_흔들리는마음_철학실험4편_v2.mp4'


def dur(f):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).decode())


cmd = ['ffmpeg', '-v', 'error', '-y',
       '-loop', '1', '-framerate', '24', '-t', str(INTRO), '-i', f'{HERE}/intro.png']
for i in range(4):
    cmd += ['-loop', '1', '-framerate', '24', '-t', str(CARD), '-i', f'{HERE}/ch{i + 1}.png']
for v, _ in EPS:
    cmd += ['-i', f'{SP}/{v}']
cmd += ['-i', BGM]
fc = []
fc.append(f'[0:v]scale=1920:1080,setsar=1,format=yuv420p,fade=in:st=0:d=0.5,fade=out:st={INTRO - 0.4}:d=0.4[c0]')
for i in range(4):
    fc.append(f'[{i + 1}:v]scale=1920:1080,setsar=1,format=yuv420p,fade=in:st=0:d=0.25,fade=out:st={CARD - 0.35}:d=0.35[c{i + 1}]')
for i in range(4):
    fc.append(f'[{5 + i}:v]scale=1920:1080,setsar=1,fps=24,format=yuv420p[e{i}]')
    fc.append(f'[{5 + i}:a]aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo[ea{i}]')
fc.append('[9:a]aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo,asplit=5[b0][b1][b2][b3][b4]')
offs = [0, 20, 45, 70, 95]
for i in range(5):
    d = INTRO if i == 0 else CARD
    fc.append(f'[b{i}]atrim=start={offs[i]}:duration={d},asetpts=PTS-STARTPTS,volume=-8dB,afade=t=in:st=0:d=0.4,afade=t=out:st={d - 0.8}:d=0.8[ba{i}]')
order = '[c0][ba0]' + ''.join(f'[c{i + 1}][ba{i + 1}][e{i}][ea{i}]' for i in range(4))
fc.append(f'{order}concat=n=9:v=1:a=1[vout][aout]')
cmd += ['-filter_complex', ';'.join(fc), '-map', '[vout]', '-map', '[aout]',
        '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '25', '-pix_fmt', 'yuv420p', '-r', '24', '-g', '48',
        '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-movflags', '+faststart', OUT]

# chapters + merged SRT (computed before encoding)
def ts(t):
    t = int(round(t)); return f'{t // 60:02d}:{t % 60:02d}'

def srt_t(x):
    ms = int(round(x * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f'{h:02d}:{m:02d}:{s:02d},{ms:03d}'

def parse_t(s):
    h, m, rest = s.split(':'); sec, ms = rest.split(','); return int(h) * 3600 + int(m) * 60 + int(sec) + int(ms) / 1000

t = INTRO; chapters = [('00:00', '오프닝 · 이 영상에 담긴 4가지 실험')]
titles = ['#006 스토아 · 작은 일에 자꾸 흔들릴 때', '#007 데카르트 · 가짜 뉴스에 자꾸 속을 때',
          '#008 장자 · 나만 뒤처진 것 같을 때', '#009 소크라테스 · 모르면서 아는 척할 때']
srt_out = []; n = 1
for i, (v, s) in enumerate(EPS):
    chapters.append((ts(t), titles[i]))
    off = t + CARD
    for block in open(f'{SP}/{s}', encoding='utf-8-sig').read().strip().split('\n\n'):
        lines = block.strip().split('\n')
        if len(lines) < 3 or '-->' not in lines[1]: continue
        a, b = [parse_t(x.strip()) for x in lines[1].split('-->')]
        srt_out.append(f'{n}\n{srt_t(a + off)} --> {srt_t(b + off)}\n' + '\n'.join(lines[2:])); n += 1
    t = off + dur(f'{SP}/{v}')
json.dump({'chapters': chapters, 'total': t}, open(f'{HERE}/chapters.json', 'w'), ensure_ascii=False, indent=1)
open(f'{HERE}/subs_compile01.srt', 'w', encoding='utf-8').write('\n\n'.join(srt_out) + '\n')
print('total', round(t, 2), 'subs', n - 1)
for c in chapters: print(*c)
if os.environ.get('NOENC') != '1':
    subprocess.run(cmd, check=True)
    print('done', OUT, round(dur(OUT), 2))
