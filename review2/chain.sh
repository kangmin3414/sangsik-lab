#!/bin/bash
# Descartes v4 render -> keep only Shorts thumbnail frames -> Zhuangzi v4 render
R=/tmp/claude-0/-home-claude/8ea42618-92c7-5880-934a-1a398f438784/scratchpad
cd $R/descartes3 && rm -rf frames && bash render_all.sh > render.log 2>&1 || { echo DESC_FAIL; exit 1; }
nice -n 5 python3 ../zhuangzi/qa.py > qa.log 2>&1
cd $R && python3 - <<'PY'
import json, os
L = json.load(open("descartes3/timeline.json"))["lines"]
keep = {"f%05d.jpg" % int((L[i]['t0'] + 0.75 * (L[i]['t1'] - L[i]['t0'])) * 24) for i in [6, 14, 19, 22, 27, 30, 36, 40, 47]}
# keep every 96th frame too, for the contact-sheet check
N = len(os.listdir("descartes3/frames")); keep |= {"f%05d.jpg" % i for i in range(48, N, 96)}
for f in os.listdir("descartes3/frames"):
    if f not in keep: os.remove("descartes3/frames/" + f)
print("pruned descartes frames, kept", len(keep))
PY
cd $R/zhuangzi4 && rm -rf frames && bash render_all.sh > render.log 2>&1 || { echo ZH_FAIL; exit 1; }
nice -n 5 python3 ../zhuangzi/qa.py > qa.log 2>&1
echo CHAIN_DONE
