import sys, numpy as np, subprocess, soundfile as sf
from faster_whisper import WhisperModel
m = WhisperModel('small', device='cpu', compute_type='int8', cpu_threads=2)
for f in sys.argv[1:]:
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',f,'-ar','16000','-ac','1','/tmp/claude-0/asr_tmp.wav'],check=True)
    w,_ = sf.read('/tmp/claude-0/asr_tmp.wav', dtype='float32')
    seg,_ = m.transcribe(w, beam_size=5, vad_filter=False, condition_on_previous_text=False)
    out = [(round(s.start,1), round(s.end,1), s.text.strip(), round(s.no_speech_prob,2)) for s in seg]
    print(f, [o for o in out if o[3] < 0.6])
