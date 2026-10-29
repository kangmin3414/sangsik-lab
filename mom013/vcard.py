import os, subprocess, numpy as np, soundfile as sf
from PIL import Image, ImageDraw, ImageFont
from scipy.signal import resample_poly
F = '/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'
items = [('M', 'Sulafat', '엄마 후보 1', '따뜻한 목소리'), ('M', 'Gacrux', '엄마 후보 2', '성숙하고 차분한 목소리'), ('M', 'Vindemiatrix', '엄마 후보 3', '부드럽고 다정한 목소리'),
         ('F', 'Algenib', '아빠 후보 1', '낮고 거친 목소리'), ('F', 'Charon', '아빠 후보 2', '묵직하고 담담한 목소리'), ('F', 'Alnilam', '아빠 후보 3', '단단하고 무뚝뚝한 목소리')]
os.makedirs('vsample/seg', exist_ok=True); lst = []
for n, (who, v, title, sub) in enumerate(items, 1):
    im = Image.new('RGB', (1280, 720), '#1F2A44' if who == 'M' else '#2C2A26'); d = ImageDraw.Draw(im)
    d.text((640, 300), title, font=ImageFont.truetype(F, 110), fill='#F7E733', anchor='mm')
    d.text((640, 430), sub, font=ImageFont.truetype(F, 52), fill='#FFFFFF', anchor='mm')
    d.text((640, 640), v, font=ImageFont.truetype(F, 34), fill='#8C95A8', anchor='mm')
    im.save(f'vsample/seg/c{n}.png')
    w, sr = sf.read(f'vsample/{who}_{v}.wav'); w = w.mean(1) if w.ndim > 1 else w
    w = np.concatenate([np.zeros(int(0.6 * sr)), w / (np.abs(w).max() + 1e-9) * 0.85, np.zeros(int(1.0 * sr))])
    sf.write(f'vsample/seg/a{n}.wav', w, sr)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-loop', '1', '-i', f'vsample/seg/c{n}.png', '-i', f'vsample/seg/a{n}.wav', '-c:v', 'libx264', '-tune', 'stillimage', '-pix_fmt', 'yuv420p', '-r', '24',
                    '-c:a', 'aac', '-ar', '48000', '-b:a', '160k', '-shortest', f'vsample/seg/s{n}.mp4'], check=True)
    lst.append(f"file 's{n}.mp4'")
open('vsample/seg/list.txt', 'w').write('\n'.join(lst) + '\n')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', 'vsample/seg/list.txt', '-c', 'copy', 'vsample/엄마아빠_목소리_후보6.mp4'], check=True)
print(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', 'vsample/엄마아빠_목소리_후보6.mp4'], capture_output=True, text=True).stdout)
