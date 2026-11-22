#!/bin/bash
# /dev/shm/ml가 비워졌을 때(대화가 멈추면 사라짐) 저장소의 백업에서 되살린다: 테이크(opus→wav 24k), 배경음.
cd "$(dirname "$0")"
mkdir -p /dev/shm/ml/takes /dev/shm/ml/bgm /dev/shm/ml/tmp /dev/shm/ml/fr /dev/shm/ml/chk
for f in takes_opus/*.opus; do b=$(basename "$f" .opus); [ -f /dev/shm/ml/takes/$b.wav ] || { ffmpeg -nostdin -y -loglevel error -i "$f" -ar 24000 -ac 1 /dev/shm/ml/takes/$b.wav && touch -r "$f" /dev/shm/ml/takes/$b.wav; }; done   # 시각을 백업과 같게(backup_takes.py가 되살린 것을 새 녹음으로 보고 다시 인코딩하지 않게)
for f in bgm_opus/*.opus; do b=$(basename "$f" .opus); [ -f /dev/shm/ml/bgm/$b.mp3 ] || ffmpeg -nostdin -y -loglevel error -i "$f" -b:a 192k /dev/shm/ml/bgm/$b.mp3; done
echo restored $(ls /dev/shm/ml/takes | wc -l) takes, $(ls /dev/shm/ml/bgm | wc -l) bgm
