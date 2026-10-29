#!/bin/bash
# render all frames in two halves (two processes), then encode with the mix
set -e
cd "$(dirname "$0")"
N=$(python3 -c "import json;print(int(json.load(open('timeline.json'))['duration']*24))")
H=$((N/2))
mkdir -p frames
nice -n 2 python3 render2.py 0 $H > r1.log 2>&1 &
nice -n 2 python3 render2.py $H $((N+1)) > r2.log 2>&1 &
wait
nice -n 2 ffmpeg -v error -y -framerate 24 -i frames/f%05d.jpg -i mix.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 44100 -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "만약에연구소_실험010_붓다처럼지금여기에살기.mp4"
echo RENDER_DONE $N
