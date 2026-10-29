import os, subprocess, sys
import numpy as np
from PIL import Image
EP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OLD = os.path.join(EP, "상식실험실_실험008_장자처럼남의잣대내려놓기_v7.mp4")
NEW = os.path.join(EP, "상식실험실_실험008_장자처럼남의잣대내려놓기_v8.mp4")
FX = os.path.join(EP, "frames_fix")
W, H = 1920, 1080; FS = W * H * 3
dec = subprocess.Popen(["nice", "-n", "10", "ffmpeg", "-v", "error", "-i", OLD, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE, bufsize=FS * 2)
enc = subprocess.Popen(["nice", "-n", "10", "ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", "24", "-i", "-", "-i", OLD,
                        "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "veryfast", "-crf", "19", "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart", NEW], stdin=subprocess.PIPE)
f = sub = 0
while True:
    buf = dec.stdout.read(FS)
    if len(buf) < FS: break
    p = os.path.join(FX, f"f{f:05d}.jpg")
    if os.path.exists(p):
        buf = np.asarray(Image.open(p).convert("RGB"), dtype=np.uint8).tobytes(); sub += 1
    enc.stdin.write(buf); f += 1
    if f % 2000 == 0: print(f, sub, flush=True)
enc.stdin.close(); enc.wait(); dec.wait()
print("frames", f, "substituted", sub, "enc rc", enc.returncode)
