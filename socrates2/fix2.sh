#!/bin/bash
cd "$(dirname "$0")"
python3 tts3.py synth > tts_fix2.log 2>&1
python3 tts3.py asr >> tts_fix2.log 2>&1
python3 tts3.py build >> tts_fix2.log 2>&1
python3 verify_tts3.py 3.0,3.1,44.1,52.1,2.3 medium > verify2.log 2>&1
echo FIX2_DONE >> tts_fix2.log
