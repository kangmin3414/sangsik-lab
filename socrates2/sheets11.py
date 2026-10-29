# contact sheets from the final mp4: 3 frames per line, 5 lines per sheet
import json, subprocess, os, sys
from PIL import Image, ImageDraw, ImageFont
f = ImageFont.truetype("/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc", 22)
mp4 = sys.argv[1]; out = "sheets"; os.makedirs(out + "/fr", exist_ok=True)
L = json.load(open("timeline.json"))["lines"]
only = set(int(x) for x in sys.argv[2].split(",")) if len(sys.argv) > 2 else None
rows = []
for l in L:
    if only and l["i"] not in only: continue
    d = l["t1"] - l["t0"]; ims = []
    for k, fr in enumerate([0.15, 0.55, 0.92]):
        t = l["t0"] + fr * d; p = "%s/fr/%02d_%d.jpg" % (out, l["i"], k)
        subprocess.run(["nice", "-n", "10", "ffmpeg", "-loglevel", "error", "-y", "-ss", "%.2f" % t, "-i", mp4, "-frames:v", "1", "-vf", "scale=480:270", "-q:v", "3", p], check=True)
        ims.append((p, t))
    rows.append((l, ims))
per = 5
for s in range(0, len(rows), per):
    chunk = rows[s:s + per]; W = 1440; H = len(chunk) * 334
    sh = Image.new("RGB", (W, H), "white"); dr = ImageDraw.Draw(sh)
    for r, (l, ims) in enumerate(chunk):
        y = r * 334
        for k, (p, t) in enumerate(ims):
            sh.paste(Image.open(p), (k * 480, y))
            dr.text((k * 480 + 6, y + 4), "%d:%04.1f" % (t // 60, t % 60), font=f, fill="yellow", stroke_width=2, stroke_fill="black")
        txt = "#%d [%s] %s" % (l["i"], l["scene"], l["sub"])
        dr.text((6, y + 272), txt[:62], font=f, fill="black"); dr.text((6, y + 300), txt[62:124], font=f, fill="black")
    sh.save("%s/sheet_%02d.jpg" % (out, s // per), quality=85)
print(len(rows), "lines")
