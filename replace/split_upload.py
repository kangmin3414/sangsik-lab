"""Split a large video into <10 MB parts so it can be handed to the browser piece by piece
(the browser file tool takes at most 10 MB per call); the page re-joins the parts into one File.
usage: python3 split_upload.py <video.mp4>  -> replace/chunks/<stem>/part_00.bin ..."""
import hashlib, os, sys
SP = os.path.dirname(os.path.abspath(__file__))
src = sys.argv[1]
stem = os.path.splitext(os.path.basename(src))[0]
out = os.path.join(SP, 'chunks', stem); os.makedirs(out, exist_ok=True)
for f in os.listdir(out): os.remove(os.path.join(out, f))
CH = 9_400_000
h = hashlib.sha256(); n = 0
with open(src, 'rb') as fh:
    while True:
        b = fh.read(CH)
        if not b: break
        h.update(b)
        open(os.path.join(out, f'part_{n:02d}.bin'), 'wb').write(b); n += 1
print(out, n, 'parts', os.path.getsize(src), 'bytes', 'sha256', h.hexdigest())
