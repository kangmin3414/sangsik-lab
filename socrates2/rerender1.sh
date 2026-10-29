#!/bin/bash
cd "$(dirname "$0")"
python3 render2.py 3120 3284 > rr1.log 2>&1 &
python3 render2.py 4875 5088 > rr2.log 2>&1 &
wait
python3 render2.py 9417 9552 >> rr1.log 2>&1
