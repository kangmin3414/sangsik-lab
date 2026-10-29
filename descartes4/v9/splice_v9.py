"""v9 assembly without disk dumps: old final decoded as raw rgb24; new frame f = old f (f < A), fresh frames_v9 (A <= f < FC),
old f - SHIFT (f >= FC). Audio = new mix with the measured 2-pass linear loudnorm (as remix_all.py). Encode like splice_fix.py.
usage: splice_v9.py OLD NEW A mix.wav"""
import subprocess, os, sys, json
from PIL import Image
here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OLD, NEW, A, MIX = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4]
sh = json.load(open(os.path.join(here, 'v9/shift.json'))); SH, FC = sh['shift_frames'], sh['FC']
N_OLD = int(subprocess.check_output(['ffprobe', '-v', 'error', '-count_packets', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_packets', '-of', 'csv=p=0', OLD]))
N_NEW = N_OLD + SH; dur = N_NEW / 24; af = open(MIX + '.af').read().strip()
W, H = 1920, 1080; FS = W * H * 3
dec = subprocess.Popen(['nice', '-n', '10', 'ffmpeg', '-v', 'error', '-i', OLD, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
enc = subprocess.Popen(['nice', '-n', '10', 'ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', '24', '-i', '-', '-i', MIX,
                        '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '19', '-pix_fmt', 'yuv420p',
                        '-af', af, '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', '-t', f'{dur:.4f}', '-movflags', '+faststart', NEW], stdin=subprocess.PIPE)
io = 0; fresh = reused = 0
def old_frame(k):
    global io
    while io <= k:
        buf = dec.stdout.read(FS); assert len(buf) == FS, ('short read', io); io += 1
    return buf
for f in range(N_NEW):
    if f < A: buf = old_frame(f); reused += 1
    elif f < FC: buf = Image.open(os.path.join(here, 'frames_v9', f'f{f:05d}.jpg')).convert('RGB').tobytes(); fresh += 1
    else: buf = old_frame(f - SH); reused += 1
    enc.stdin.write(buf)
    if f % 2000 == 0: print(f, flush=True)
enc.stdin.close(); enc.wait(); dec.stdout.close(); dec.wait()
print('frames', N_NEW, 'fresh', fresh, 'reused', reused, 'old read', io, 'of', N_OLD, 'enc rc', enc.returncode, flush=True)
