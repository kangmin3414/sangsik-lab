#!/bin/bash
set -e
cd "$(dirname "$0")"
N=$(python3 -c "import json;print(int(json.load(open('timeline.json'))['duration']*24))")
H=$((N/2)); rm -rf frames; mkdir -p frames
nice -n 5 python3 render016.py 0 $H > r1.log 2>&1 &
nice -n 5 python3 render016.py $H $((N+1)) > r2.log 2>&1 &
wait
ls frames | wc -l
echo FRAMES_DONE $N
