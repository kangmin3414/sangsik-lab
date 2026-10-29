#!/bin/bash
cd "$(dirname "$0")"
OUT="상식실험실_실험014_혼자가편한데외로운이유_v1.mp4"
nice -n 5 ffmpeg -v error -y -framerate 24 -i frames/f%05d.jpg -i mix.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 48000 -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "$OUT"
ffprobe -v error -show_entries format=duration:stream=codec_type,width,height -of compact "$OUT"
ls -la "$OUT"
echo MUX_DONE
