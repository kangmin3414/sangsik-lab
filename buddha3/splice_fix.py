"""Splice frames_fix/f%05d.jpg into the old final mp4 without dumping frames: ffmpeg decode pipe -> substitute -> ffmpeg encode pipe (audio copied)."""
import os, subprocess, sys
import numpy as np
from PIL import Image
here = os.path.dirname(os.path.abspath(__file__))
OLD = os.path.join(here, "상식실험실_실험010_붓다처럼지금여기에살기_v5.mp4")
NEW = os.path.join(here, "상식실험실_실험010_붓다처럼지금여기에살기_v6.mp4")
FX = os.path.join(here, "frames_fix")
W, H = 1920, 1080; FS = W * H * 3
dec = subprocess.Popen(["nice", "-n", "10", "ffmpeg", "-v", "error", "-i", OLD, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE, bufsize=FS * 2)
enc = subprocess.Popen(["nice", "-n", "10", "ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", "24", "-i", "-", "-i", OLD,
                        "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "veryfast", "-crf", "19", "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart", NEW], stdin=subprocess.PIPE)
f = sub = 0
while True:
    buf = dec.stdout.read(FS)
    if not buf or len(buf) < FS: break
    p = os.path.join(FX, f"f{f:05d}.jpg")
    if os.path.exists(p):
        buf = np.asarray(Image.open(p).convert("RGB"), dtype=np.uint8).tobytes(); sub += 1
    enc.stdin.write(buf); f += 1
    if f % 2000 == 0: print(f, sub, flush=True)
enc.stdin.close(); enc.wait(); dec.wait()
print("frames", f, "substituted", sub, "enc rc", enc.returncode)
