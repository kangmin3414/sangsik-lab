import sys
from PIL import Image
# usage: crop.py out.jpg t x0 y0 x1 y1 [t x0 y0 x1 y1 ...]  (coords in 1920x1080, scaled to width ~ 960 each, stacked vertically)
base='/tmp/claude-0/-home-claude/8ea42618-92c7-5880-934a-1a398f438784/scratchpad/descartes2/frames/f%05d.jpg'
out=sys.argv[1]; a=sys.argv[2:]
tiles=[]
for k in range(0,len(a),5):
    t=float(a[k]); box=tuple(int(v) for v in a[k+1:k+5])
    im=Image.open(base%round(t*24)).crop(box)
    w=box[2]-box[0]; s=min(1400/w, 3.0)
    im=im.resize((int(w*s), int((box[3]-box[1])*s)))
    tiles.append(im)
W=max(t.size[0] for t in tiles); H=sum(t.size[1] for t in tiles)+6*len(tiles)
c=Image.new('RGB',(W,H),'white'); y=0
for t in tiles: c.paste(t,(0,y)); y+=t.size[1]+6
c.save(out, quality=90)
