#!/bin/bash
# Re-make unreleased long-forms with the new channel name (상식실험실):
# new closing line TTS -> timeline -> music mix -> subtitles -> all frames (2 procs) -> encode -> drop frames.
# usage: bash lf_rename.sh 007 [008 ...]   (also: shorts = rebuild the 7 remaining Shorts from the new long-forms)
SP=/tmp/claude-0/-home-claude/8ea42618-92c7-5880-934a-1a398f438784/scratchpad
log() { echo "[$(date +%H:%M:%S)] $*"; }
declare -A DIR=([007]=descartes3 [008]=zhuangzi4 [009]=socrates2 [010]=buddha2)
declare -A MIX=([007]=mix3.py [008]=mix3.py [009]=mix11.py [010]=mix4.py)
declare -A SRT=([007]=srt10.py [008]=srt10.py [009]=srt11.py [010]=srt10.py)
declare -A OUT=([007]=상식실험실_실험007_데카르트처럼모든걸의심하기_v5.mp4 [008]=상식실험실_실험008_장자처럼남의잣대내려놓기_v5.mp4
                [009]=상식실험실_실험009_소크라테스처럼질문하며살기_v3.mp4 [010]=상식실험실_실험010_붓다처럼지금여기에살기_v3.mp4)

one() {
  local ep=$1 d=${DIR[$1]}
  cd "$SP/$d" || return 1
  log "$ep $d: tts"
  nice -n 5 python3 tts3.py synth > tts_rename.log 2>&1 && nice -n 5 python3 tts3.py asr >> tts_rename.log 2>&1 && python3 tts3.py build >> tts_rename.log 2>&1 || { log "$ep TTS FAILED"; tail -5 tts_rename.log; return 1; }
  tail -1 tts_rename.log; grep -n "실험실이었" take_report.txt
  log "$ep mix"; nice -n 5 python3 ${MIX[$ep]} > mix_rename.log 2>&1 || { log "$ep MIX FAILED"; tail -5 mix_rename.log; return 1; }
  log "$ep srt"; python3 ${SRT[$ep]} || return 1
  local N=$(python3 -c "import json;print(int(json.load(open('timeline.json'))['duration']*24))"); local H=$((N/2))
  rm -rf frames; mkdir -p frames
  log "$ep render $N frames"
  nice -n 5 python3 render2.py 0 $H > r1.log 2>&1 &
  nice -n 5 python3 render2.py $H $((N+1)) > r2.log 2>&1 &
  wait
  grep -q "^done" r1.log && grep -q "^done" r2.log || { log "$ep RENDER FAILED"; tail -3 r1.log r2.log; return 1; }
  log "$ep encode"
  nice -n 5 ffmpeg -v error -y -framerate 24 -i frames/f%05d.jpg -i mix.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 44100 \
    -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "${OUT[$ep]}" || { log "$ep ENCODE FAILED"; return 1; }
  rm -rf frames
  log "$ep DONE ${OUT[$ep]} $(ffprobe -v error -show_entries format=duration -of csv=p=0 "${OUT[$ep]}")s"
}

shorts() {
  cd "$SP/shorts_all" || return 1
  log "shorts: rebuild 7"
  nice -n 5 python3 build_rename.py 007v4-7 007v4-1 007v4-9 008v4-4 008v4-3 008v4-2 008v4-9 > b_rename.log 2>&1 || { log "SHORTS FAILED"; tail -5 b_rename.log; return 1; }
  cat b_rename.log; log "shorts DONE"
}

for x in "$@"; do
  if [ "$x" = shorts ]; then shorts || exit 1; else one "$x" || exit 1; fi
done
log ALL_DONE "$@"
