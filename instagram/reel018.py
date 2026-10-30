"""018 릴스: 30년 만의 서울(공항 스미마센 → 반찬 → 역문화 충격 → 폐를 끼쳐도 되는 사이)."""
import subprocess, os
from PIL import Image, ImageDraw, ImageFont
F = lambda s: ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc', s, index=1)
SRC = '../japan018/상식실험실_실험018_일본30년_v1.mp4'
T0, T1 = 383.4, 431.6
W, H, VY = 1080, 1920, 560            # video zoomed to 1080x780 (centre crop) at y=560
im = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
def center(y, txt, font, fill, stroke=0, sc=None):
    w = d.textlength(txt, font=font); d.text(((W - w) / 2, y), txt, font=font, fill=fill, stroke_width=stroke, stroke_fill=sc)
d.rounded_rectangle((60, 150, W - 60, 520), 40, fill=(255, 247, 236, 245), outline=(20, 30, 50, 255), width=6)
center(190, '일본 30년 살고 돌아오니', F(74), (20, 30, 50))
center(290, '한국이 신기해졌다', F(96), (232, 74, 60))
center(430, '실험 018 · 일본에서 30년을 산다면', F(40), (110, 98, 85))
d.rounded_rectangle((90, 1400, W - 90, 1630), 36, fill=(66, 211, 160, 240), outline=(20, 30, 50, 255), width=6)
center(1435, '1년 차부터 30년 차까지', F(54), (20, 30, 50))
center(1520, '전체 실험 ▶ 유튜브 「상식실험실」', F(46), (20, 30, 50))
im.save('018/_reel_overlay.png')
vf = (f"[0:v]split[a][b];[a]scale=-2:{H},boxblur=30:2,crop={W}:{H},eq=brightness=0.06:saturation=0.9[bg];"
      f"[b]scale=-2:780,crop={W}:780[fg];[bg][fg]overlay=0:{VY}[v1];[v1][1:v]overlay=0:0,format=yuv420p[v]")
cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', str(T0), '-to', str(T1), '-i', SRC, '-i', '018/_reel_overlay.png', '-filter_complex', vf,
       '-map', '[v]', '-map', '0:a', '-af', 'afade=t=in:d=0.3,afade=t=out:st=%.2f:d=0.6,loudnorm=I=-14:TP=-1.5' % (T1 - T0 - 0.6),
       '-c:v', 'libx264', '-crf', '20', '-preset', 'medium', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '018/상식실험실_018_릴스_30년만의서울.mp4']
subprocess.run(cmd, check=True); os.remove('018/_reel_overlay.png'); print('ok')
