"""Splice frames_fix/ into the old final mp4 without dumping frames: decode pipe -> substitute -> encode pipe (audio copied)."""
import subprocess, os, sys
from PIL import Image
here = os.path.dirname(os.path.abspath(__file__))
OLD = os.path.join(here, '상식실험실_실험007_데카르트처럼모든걸의심하기_v7.mp4')
NEW = os.path.join(here, '상식실험실_실험007_데카르트처럼모든걸의심하기_v8.mp4')
W, H = 1920, 1080; FS = W * H * 3
dec = subprocess.Popen(['nice', '-n', '10', 'ffmpeg', '-v', 'error', '-i', OLD, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
enc = subprocess.Popen(['nice', '-n', '10', 'ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', '24', '-i', '-', '-i', OLD,
                        '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '19', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-movflags', '+faststart', NEW], stdin=subprocess.PIPE)
f = sub = 0
while True:
    buf = dec.stdout.read(FS)
    if len(buf) < FS: break
    p = os.path.join(here, 'frames_fix', f'f{f:05d}.jpg')
    if os.path.exists(p):
        buf = Image.open(p).convert('RGB').tobytes(); sub += 1
    enc.stdin.write(buf); f += 1
    if f % 2000 == 0: print(f, sub, flush=True)
enc.stdin.close(); enc.wait(); dec.wait()
print('frames', f, 'substituted', sub, 'enc rc', enc.returncode, flush=True)
