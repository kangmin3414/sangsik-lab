#!/bin/bash
set -e
cd "$(dirname "$0")"
N=$(python3 -c "import json;print(int(json.load(open('timeline.json'))['duration']*24))")
H=$((N/2)); rm -rf frames; mkdir -p frames
nice -n 5 python3 render9b.py 0 $H > r1.log 2>&1 &
nice -n 5 python3 render9b.py $H $((N+1)) > r2.log 2>&1 &
wait
ls frames | wc -l
nice -n 5 ffmpeg -v error -y -framerate 24 -i frames/f%05d.jpg -i mix.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 44100 -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "상식실험실_실험008_장자처럼남의잣대내려놓기_v6.mp4"
ffprobe -v error -show_entries format=duration -of csv=p=0 "상식실험실_실험008_장자처럼남의잣대내려놓기_v6.mp4"
echo RENDER_DONE $N
