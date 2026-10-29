"""Splice re-rendered frames (frames_fix/f%05d.jpg) into the old final video; audio stream copied."""
import subprocess, os, sys
from PIL import Image
here = os.path.dirname(os.path.abspath(__file__))
OLD = os.path.join(here, "상식실험실_실험009_소크라테스처럼질문하며살기_v5.mp4")
NEW = os.path.join(here, "상식실험실_실험009_소크라테스처럼질문하며살기_v6.mp4")
W, H = 1920, 1080; FS = W * H * 3
fix = {int(n[1:6]) for n in os.listdir(os.path.join(here, "frames_fix")) if n.endswith(".jpg")}
dec = subprocess.Popen(["nice", "-n", "10", "ffmpeg", "-v", "error", "-i", OLD, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
enc = subprocess.Popen(["nice", "-n", "10", "ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", "24", "-i", "-",
                        "-i", OLD, "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "veryfast", "-crf", "19", "-pix_fmt", "yuv420p",
                        "-c:a", "copy", "-movflags", "+faststart", NEW], stdin=subprocess.PIPE)
f = rep = 0
while True:
    buf = dec.stdout.read(FS)
    if len(buf) < FS: break
    if f in fix:
        im = Image.open(os.path.join(here, "frames_fix", f"f{f:05d}.jpg")).convert("RGB")
        assert im.size == (W, H); buf = im.tobytes(); rep += 1
    enc.stdin.write(buf); f += 1
    if f % 2000 == 0: print(f, rep, flush=True)
enc.stdin.close(); enc.wait(); dec.wait()
print("frames", f, "replaced", rep, "of", len(fix), "rc", enc.returncode, dec.returncode)
