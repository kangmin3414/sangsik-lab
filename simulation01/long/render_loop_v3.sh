#!/bin/bash
cd "$(dirname "$0")"
for k in 1 2 3 4 5 6; do timeout 2400 python3 render_v3.py $1 3 >> rv3_$1.log 2>&1 && break; done
echo "loop done $1" >> rv3_$1.log
