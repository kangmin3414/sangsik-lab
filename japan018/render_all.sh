#!/bin/bash
set -e
cd "$(dirname "$0")"
N=$(python3 -c "import json;print(int(json.load(open('timeline.json'))['duration']*24))")
P=${P:-4}; C=$(( (N + P) / P )); rm -rf frames; mkdir -p frames
for k in $(seq 0 $((P-1))); do nice -n 5 python3 render018.py $((k*C)) $(((k+1)*C)) > r$k.log 2>&1 & done
wait
ls frames | wc -l
echo FRAMES_DONE $N
