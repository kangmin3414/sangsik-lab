#!/bin/bash
# re-run a render part until all its frames exist (render_qd.py skips finished frames)
cd "$(dirname "$0")"
for k in 1 2 3 4 5 6; do timeout 1500 python3 render_qd.py $1 3 >> r$1.log 2>&1 && break; done
echo "loop done $1" >> r$1.log
