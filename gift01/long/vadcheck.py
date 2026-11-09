import sys, subprocess, numpy as np
from faster_whisper import WhisperModel
m = WhisperModel('small', device='cpu', compute_type='int8', cpu_threads=4)
for f in sys.argv[1:]:
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', f, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], capture_output=True).stdout
    a = np.frombuffer(raw, np.float32).copy()
    seg, info = m.transcribe(a, vad_filter=True, beam_size=1)
    segs = list(seg); print(f, 'speech segments:', len(segs), [s.text[:30] for s in segs][:5], flush=True)
