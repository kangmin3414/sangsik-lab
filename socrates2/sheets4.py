# contact sheets from the final mp4: one frame every 4 s, 4x4 per sheet
# usage: python3 sheets4.py video.mp4 [start_s end_s]
import subprocess, os, sys, json
from PIL import Image, ImageDraw, ImageFont
f = ImageFont.truetype("/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc", 22)
mp4 = sys.argv[1]; out = "sheets4"; os.makedirs(out + "/fr", exist_ok=True)
dur = json.load(open("timeline.json"))["duration"]
a = float(sys.argv[2]) if len(sys.argv) > 2 else 0.0; b = float(sys.argv[3]) if len(sys.argv) > 3 else dur
ts = []; t = a + 1.0
while t < b: ts.append(t); t += 4.0
paths = []
for t in ts:
    p = "%s/fr/%06.1f.jpg" % (out, t)
    subprocess.run(["nice", "-n", "10", "ffmpeg", "-loglevel", "error", "-y", "-ss", "%.2f" % t, "-i", mp4, "-frames:v", "1", "-vf", "scale=480:270", "-q:v", "3", p], check=True)
    paths.append((p, t))
per = 16
for s in range(0, len(paths), per):
    chunk = paths[s:s + per]; sh = Image.new("RGB", (1920, 1080), "white"); dr = ImageDraw.Draw(sh)
    for k, (p, t) in enumerate(chunk):
        x, y = (k % 4) * 480, (k // 4) * 270
        sh.paste(Image.open(p), (x, y))
        dr.text((x + 6, y + 4), "%d:%04.1f" % (t // 60, t % 60), font=f, fill="yellow", stroke_width=2, stroke_fill="black")
    sh.save("%s/s4_%02d.jpg" % (out, s // per), quality=85)
print(len(paths), "frames")
