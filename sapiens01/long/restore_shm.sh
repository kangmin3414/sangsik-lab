#!/bin/bash
# /dev/shm/sp가 비워졌을 때(대화가 멈추면 사라짐) 저장소의 백업에서 되살린다: 테이크(opus→wav 24k), s1 나누기, 배경음.
cd "$(dirname "$0")"
mkdir -p /dev/shm/sp/takes /dev/shm/sp/bgm /dev/shm/sp/tmp /dev/shm/sp/fr /dev/shm/sp/chk /dev/shm/sp/ai
for f in takes_opus/*.opus; do b=$(basename "$f" .opus); [ -f /dev/shm/sp/takes/$b.wav ] || ffmpeg -y -loglevel error -i "$f" -ar 24000 -ac 1 /dev/shm/sp/takes/$b.wav; done
[ -f /dev/shm/sp/takes/s1a.wav ] || python3 split_s1.py
cp -n bgm_opus/*.opus /dev/shm/sp/bgm/ 2>/dev/null
echo restored $(ls /dev/shm/sp/takes | wc -l) takes, $(ls /dev/shm/sp/bgm | wc -l) bgm
