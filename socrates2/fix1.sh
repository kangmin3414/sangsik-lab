#!/bin/bash
cd "$(dirname "$0")"
python3 tts3.py synth > tts_fix.log 2>&1
python3 alt_tts3.py >> tts_fix.log 2>&1
python3 tts3.py asr >> tts_fix.log 2>&1
python3 tts3.py build >> tts_fix.log 2>&1
python3 verify_tts3.py 2.3,3.2,6.0,21.1,29.2,30.0,34.1,44.1,51.0,51.1,52.0,52.1,55.0,55.1,28.1,42.1,1.1,31.1,32.0 medium > verify.log 2>&1
echo FIX1_DONE >> tts_fix.log
