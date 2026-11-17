#!/bin/bash
# /dev/shm/tb가 비워졌을 때(대화가 멈추면 사라짐) 저장소의 백업에서 되살린다: 테이크(opus→wav 24k), 배경음.
cd "$(dirname "$0")"
mkdir -p /dev/shm/tb/takes /dev/shm/tb/bgm /dev/shm/tb/tmp /dev/shm/tb/fr /dev/shm/tb/chk
for f in takes_opus/*.opus; do b=$(basename "$f" .opus); [ -f /dev/shm/tb/takes/$b.wav ] || ffmpeg -y -loglevel error -i "$f" -ar 24000 -ac 1 /dev/shm/tb/takes/$b.wav; done
for f in bgm_opus/*.opus; do b=$(basename "$f" .opus); [ -f /dev/shm/tb/bgm/$b.mp3 ] || ffmpeg -y -loglevel error -i "$f" -b:a 192k /dev/shm/tb/bgm/$b.mp3; done
echo restored $(ls /dev/shm/tb/takes | wc -l) takes, $(ls /dev/shm/tb/bgm | wc -l) bgm
