#!/bin/bash
# Replace the fade-from-black opening (first 6 frames) with the first full frame; audio untouched. Usage: fix_head.sh in.mp4 out.mp4
in="$1"; out="$2"
ffmpeg -v error -y -i "$in" -filter_complex "[0:v]trim=start_frame=6:end_frame=7,setpts=PTS-STARTPTS,loop=loop=5:size=1:start=0[head];[0:v]trim=start_frame=6,setpts=PTS-STARTPTS[tail];[head][tail]concat=n=2:v=1:a=0,format=yuv420p[v]" \
  -map "[v]" -map 0:a -c:v libx264 -preset slow -crf 20 -maxrate 1500k -bufsize 3000k -r 24 -c:a copy -movflags +faststart "$out"
