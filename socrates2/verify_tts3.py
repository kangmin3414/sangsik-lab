# second opinion with a larger Whisper model on every synthesized take of the selected segments
import json, sys, glob, numpy as np, soundfile as sf
from scipy.signal import resample_poly
from faster_whisper import WhisperModel
SR = 44100
pairs = [tuple(map(int, p.split('.'))) for p in sys.argv[1].split(',')]
m = WhisperModel(sys.argv[2] if len(sys.argv) > 2 else "medium", device="cpu", compute_type="int8", cpu_threads=2)
out = json.load(open("verify_asr.json")) if len(glob.glob("verify_asr.json")) else {}
for i, j in pairs:
    for f in sorted(glob.glob("segs/%02d_%02d_*.wav" % (i, j))):
        kk = f[5:-4]
        if kk in out: print(kk, "=>", out[kk]); continue
        w, _ = sf.read(f)
        w16 = resample_poly(np.pad(w, (int(0.2 * SR), int(0.2 * SR))), 160, 441).astype(np.float32)
        sg, _ = m.transcribe(w16, language="ko", beam_size=5, condition_on_previous_text=False, vad_filter=False)
        out[kk] = "".join(x.text for x in sg).strip(); print(kk, "=>", out[kk], flush=True)
json.dump(out, open("verify_asr.json", "w"), ensure_ascii=False, indent=1)
