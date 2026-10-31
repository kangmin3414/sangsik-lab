"""019 릴스: 4계단 버리는 용기(15만 대의 불꽃 → 매몰 비용 → 결정 ⑥)."""
import subprocess, os
from PIL import Image, ImageDraw, ImageFont
F = lambda s: ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc', s, index=1)
SRC = '../leekunhee019/상식실험실_실험019_이건희_15만대_v1.mp4'
T0, T1 = 301.2, 354.4
W, H, VY = 1080, 1920, 560            # video zoomed to 1080x780 (centre crop) at y=560
im = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
def center(y, txt, font, fill, stroke=0, sc=None):
    w = d.textlength(txt, font=font); d.text(((W - w) / 2, y), txt, font=font, fill=fill, stroke_width=stroke, stroke_fill=sc)
d.rounded_rectangle((60, 150, W - 60, 520), 40, fill=(255, 247, 236, 245), outline=(20, 30, 50, 255), width=6)
center(190, '휴대폰 15만 대를', F(74), (20, 30, 50))
center(290, '왜 불태웠을까?', F(96), (232, 74, 60))
center(430, '실험 019 · 이건희 일대기', F(40), (110, 98, 85))
d.rounded_rectangle((90, 1400, W - 90, 1630), 36, fill=(66, 211, 160, 240), outline=(20, 30, 50, 255), width=6)
center(1435, '외톨이 소년에서 세계 1등까지', F(54), (20, 30, 50))
center(1520, '전체 실험 ▶ 유튜브 「상식실험실」', F(46), (20, 30, 50))
im.save('019/_reel_overlay.png')
vf = (f"[0:v]split[a][b];[a]scale=-2:{H},boxblur=30:2,crop={W}:{H},eq=brightness=0.06:saturation=0.9[bg];"
      f"[b]scale=-2:780,crop={W}:780[fg];[bg][fg]overlay=0:{VY}[v1];[v1][1:v]overlay=0:0,format=yuv420p[v]")
cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', str(T0), '-to', str(T1), '-i', SRC, '-i', '019/_reel_overlay.png', '-filter_complex', vf,
       '-map', '[v]', '-map', '0:a', '-af', 'afade=t=in:d=0.3,afade=t=out:st=%.2f:d=0.6,loudnorm=I=-14:TP=-1.5' % (T1 - T0 - 0.6),
       '-c:v', 'libx264', '-crf', '20', '-preset', 'medium', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '019/상식실험실_019_릴스_15만대의불꽃.mp4']
subprocess.run(cmd, check=True); os.remove('019/_reel_overlay.png'); print('ok')
