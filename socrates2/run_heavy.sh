#!/bin/bash
# wait until no other heavy job (TTS / frame render / ffmpeg) runs on the machine, then run one of ours
# usage: bash run_heavy.sh tts|ttsrest|render|encode [a b]
cd "$(dirname "$0")"
# count only real heavy processes (not shell wrappers whose command line merely mentions them)
busy() { pgrep -f "^(python3 \S*(tts3|render2)\.py|\S*ffmpeg )" > /dev/null; }
while true; do if ! busy; then sleep 25; busy || break; fi; sleep 60; done  # two empty checks in a row (render -> encode hand-off)
echo "START $1 $(date +%T)"
case "$1" in
  tts) nice -n 5 python3 tts3.py all > tts.log 2>&1 ;;
  ttsrest) nice -n 5 python3 tts3.py synth > tts.log 2>&1 && nice -n 5 python3 tts3.py asr >> tts.log 2>&1 && python3 tts3.py build >> tts.log 2>&1 ;;
  render)
    N=$(python3 -c "import json;print(int(json.load(open('timeline.json'))['duration']*24))")
    A=${2:-0}; B=${3:-$((N+1))}; H=$(( (A+B)/2 ))
    mkdir -p frames
    nice -n 5 python3 render2.py $A $H > r1.log 2>&1 &
    nice -n 5 python3 render2.py $H $B > r2.log 2>&1 &
    wait ;;
  cmd) shift; nice -n 5 "$@" ;;
  encode)
    nice -n 5 ffmpeg -v error -y -framerate 24 -i frames/f%05d.jpg -i mix.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 44100 -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "만약에연구소_실험009_소크라테스처럼질문하며살기_v2.mp4" ;;
esac
echo "DONE $1 $(date +%T)"
