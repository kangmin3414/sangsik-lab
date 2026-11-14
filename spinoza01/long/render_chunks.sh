#!/bin/bash
# 디스크 여유가 적을 때: 구간별로 렌더 → 인코딩 → 프레임 정리. 사용: ./render_chunks.sh 시작프레임 끝프레임(포함) [구간크기]
cd "$(dirname "$0")"; A=$1; B=$2; STEP=${3:-500}; mkdir -p seg fr
a=$A
while [ $a -le $B ]; do
  b=$(( a + STEP - 1 )); [ $b -gt $B ] && b=$B
  out=seg/s_$(printf %05d $a).mp4
  for k in 1 2 3 4 5 6 7 8; do timeout 240 python3 render_range.py $a $b >> rc.log 2>&1 && break; pkill -f headless_shell; sleep 1; done
  ffmpeg -y -loglevel error -framerate 24 -start_number $a -i fr/f%05d.jpg -frames:v $(( b - a + 1 )) -c:v libx264 -preset veryfast -crf 23 -pix_fmt yuv420p $out
  n=$(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 $out)
  if [ "$n" = "$(( b - a + 1 ))" ]; then for i in $(seq $a $b); do rm -f fr/f$(printf %05d $i).jpg; done; echo "chunk $a-$b ok" >> rc.log; else echo "chunk $a-$b BAD $n" >> rc.log; fi
  a=$(( b + 1 ))
done
echo "chunks done" >> rc.log
