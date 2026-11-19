#!/bin/bash
# /dev/shm/ls가 비워졌을 때(대화가 멈추면 사라짐) 저장소의 백업에서 되살린다: 테이크(opus→wav 24k), 배경음.
cd "$(dirname "$0")"
mkdir -p /dev/shm/ls/takes /dev/shm/ls/bgm /dev/shm/ls/tmp /dev/shm/ls/fr /dev/shm/ls/chk
for f in takes_opus/*.opus; do b=$(basename "$f" .opus); [ -f /dev/shm/ls/takes/$b.wav ] || ffmpeg -nostdin -y -loglevel error -i "$f" -ar 24000 -ac 1 /dev/shm/ls/takes/$b.wav; done
for f in bgm_opus/*.opus; do b=$(basename "$f" .opus); [ -f /dev/shm/ls/bgm/$b.mp3 ] || ffmpeg -nostdin -y -loglevel error -i "$f" -b:a 192k /dev/shm/ls/bgm/$b.mp3; done
echo restored $(ls /dev/shm/ls/takes | wc -l) takes, $(ls /dev/shm/ls/bgm | wc -l) bgm
