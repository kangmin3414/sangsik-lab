#!/bin/bash
# render all frames in two halves (two processes), then encode with the mix
set -e
cd "$(dirname "$0")"
while pgrep -f "^(python3 \S*(tts3|tts_s|render2|render7|render_s)\.py|ffmpeg)" > /dev/null; do sleep 30; done
N=$(python3 -c "import json;print(int(json.load(open('timeline.json'))['duration']*24))")
H=$((N/2))
mkdir -p frames
nice -n 5 python3 render2.py 0 $H > r1.log 2>&1 &
nice -n 5 python3 render2.py $H $((N+1)) > r2.log 2>&1 &
wait
nice -n 5 ffmpeg -v error -y -framerate 24 -i frames/f%05d.jpg -i mix.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 44100 -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "만약에연구소_실험007_데카르트처럼모든걸의심하기_v4.mp4"
echo RENDER_DONE $N
