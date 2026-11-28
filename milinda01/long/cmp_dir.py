"""기본 연출 전/후 비교 영상: 같은 대목을 '전(v2 프레임 fr/)' → '후(새 프레임 fr_dir/)' 순서로 이어 붙인다. 자막(sub/)과 소리(샘플 v2)는 같다.
   python3 cmp_dir.py            # → out/기본연출_전후비교.mp4
   구간은 PARTS(시작 프레임, 끝 프레임, 새 프레임이 시작되는 프레임). 새 프레임이 없는 앞부분은 전/후가 같은 그림이다."""
import os, subprocess, shutil
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); FPS = 24
PARTS = [(1747, 2129, 1808, '왕과 스님의 첫 문답'), (2976, 3516, 2976, '부품이 돌아오고 해가 드는 대목')]
TMP = os.path.join(HERE, 'fr_dir', 'cmp'); shutil.rmtree(TMP, ignore_errors=True); os.makedirs(TMP)
F = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc', 46, index=1)
def label(text, col, path):
    w = int(F.getlength(text)) + 64; im = Image.new('RGBA', (w, 84), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle([3, 3, w - 4, 80], radius=38, fill=col, outline='#1B2440', width=6); d.text((32, 10), text, font=F, fill='#fff'); im.save(path)
segs = []
for pi, (a, b, n0, name) in enumerate(PARTS):
    for kind, text, col in (('old', f'전 · {name}', '#6B7388'), ('new', f'후 · {name}', '#E0662F')):
        d = os.path.join(TMP, f'p{pi}{kind}'); os.makedirs(d)
        for j, i in enumerate(range(a, b + 1)):
            src = os.path.join(HERE, 'fr_dir' if kind == 'new' and i >= n0 else 'fr', f'f{i:05d}.jpg'); assert os.path.getsize(src) > 8000, src
            os.symlink(src, os.path.join(d, f'f{j:05d}.jpg')); os.symlink(os.path.join(HERE, 'sub', f's{i:05d}.png'), os.path.join(d, f's{j:05d}.png'))
        lab = os.path.join(d, 'label.png'); label(text, col, lab); out = os.path.join(TMP, f'p{pi}{kind}.mp4'); n = b - a + 1
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', str(FPS), '-i', os.path.join(d, 'f%05d.jpg'), '-framerate', str(FPS), '-i', os.path.join(d, 's%05d.png'), '-i', lab,
                        '-ss', f'{a / FPS:.4f}', '-t', f'{n / FPS:.4f}', '-i', 'out/sample_v2.mp4',
                        '-filter_complex', '[0:v][1:v]overlay=0:820:format=auto[a];[a][2:v]overlay=(W-w)/2:26:format=auto,format=yuv420p[v];[3:a]afade=t=in:d=0.15,afade=t=out:st=' + f'{n / FPS - 0.25:.3f}' + ':d=0.25[au]',
                        '-map', '[v]', '-map', '[au]', '-frames:v', str(n), '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-colorspace', 'bt470bg', '-color_range', 'tv', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', out], check=True)
        segs.append(out)
lst = os.path.join(TMP, 'list.txt'); open(lst, 'w').write(''.join(f"file '{s}'\n" for s in segs))
dst = os.path.join(HERE, 'out', '기본연출_전후비교.mp4')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-colorspace', 'bt470bg', '-color_range', 'tv', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', dst], check=True)
print(dst, round(os.path.getsize(dst) / 1e6, 1), 'MB')
