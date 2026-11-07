#!/bin/bash
# re-run a render part (of 5) until all its frames exist
cd "$(dirname "$0")"
for k in 1 2 3 4 5 6; do timeout 2400 python3 render_s.py $1 5 >> r5_$1.log 2>&1 && break; done
echo "loop done $1" >> r5_$1.log
