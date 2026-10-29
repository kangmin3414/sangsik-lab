import json, subprocess, os, glob
from PIL import Image, ImageDraw, ImageFont
FONT = None
c = glob.glob("/usr/share/fonts/**/*CJK*", recursive=True) + glob.glob("/usr/share/fonts/**/*Nanum*", recursive=True) + glob.glob("/usr/share/fonts/**/*Noto*KR*", recursive=True)
FONT = c[0] if c else None
f = ImageFont.truetype(FONT, 22) if FONT else ImageFont.load_default()
EP = {"descartes": "만약에연구소_실험007_데카르트처럼모든걸의심하기.mp4", "zhuangzi": "만약에연구소_실험008_장자처럼쓸모없음즐기기.mp4"}
for ep, mp4 in EP.items():
    b = "../%s/" % ep; out = "sheets_%s" % ep; os.makedirs(out + "/fr", exist_ok=True)
    L = json.load(open(b + "timeline.json"))["lines"]
    rows = []
    for l in L:
        d = l["t1"] - l["t0"]; ims = []
        for k, fr in enumerate([0.15, 0.55, 0.92]):
            t = l["t0"] + fr * d; p = "%s/fr/%02d_%d.jpg" % (out, l["i"], k)
            if not os.path.exists(p):
                subprocess.run(["ffmpeg", "-loglevel", "error", "-ss", "%.2f" % t, "-i", b + mp4, "-frames:v", "1", "-vf", "scale=480:270", "-q:v", "3", p], check=True)
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
    print(ep, len(rows), "lines", "font", FONT)
