import sys, glob
from PIL import Image, ImageDraw, ImageFont
keys = sys.argv[2:]; out = sys.argv[1]
fnt = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 28)
tw, th = 800, 450; cols = 2; rows = (len(keys) + 1) // 2
S = Image.new('RGB', (cols * tw, rows * th), 'black')
for n, k in enumerate(keys):
    im = Image.open(k + '.png').convert('RGB').resize((tw, th)); d = ImageDraw.Draw(im)
    for g in range(1, 10):
        d.line([(g * tw / 10, 0), (g * tw / 10, th)], fill=(255, 0, 0), width=1); d.line([(0, g * th / 10), (tw, g * th / 10)], fill=(255, 0, 0), width=1)
        d.text((g * tw / 10 + 2, 2), str(g), fill=(255, 255, 0), font=ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 16))
        d.text((2, g * th / 10 + 2), str(g), fill=(255, 255, 0), font=ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 16))
    d.text((10, th - 40), k, fill=(0, 255, 255), font=fnt)
    S.paste(im, ((n % cols) * tw, (n // cols) * th))
S.save(out, quality=85); print(out)
