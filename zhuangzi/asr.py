import json, soundfile as sf, numpy as np
from faster_whisper import WhisperModel
from scipy.signal import resample_poly
tl=json.load(open("timeline.json"))["lines"]
x,sr=sf.read("voice.wav")
m=WhisperModel("small", device="cpu", compute_type="int8")
import sys
for i in [int(v) for v in sys.argv[1].split(",")]:
    L=tl[i]; seg=x[int(L["t0"]*sr):int(L["t1"]*sr)].astype(np.float32)
    seg=resample_poly(seg,160,441).astype(np.float32)
    out=" ".join(s.text for s in m.transcribe(seg, language="ko", beam_size=1)[0])
    print(i, "| 원문:", L["sub"]); print("   | 인식:", out.strip(), flush=True)
