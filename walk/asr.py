import json, soundfile as sf
from faster_whisper import WhisperModel
tl=json.load(open("timeline.json"))["lines"]
x,sr=sf.read("voice.wav")
m=WhisperModel("small", device="cpu", compute_type="int8")
for i in [0,4,13,17,19,24,30,34,35,43]:
    L=tl[i]; seg=x[int(L["t0"]*sr):int(L["t1"]*sr)]
    sf.write("/tmp/claude-0/-home-claude/8ea42618-92c7-5880-934a-1a398f438784/scratchpad/walk/_s.wav", seg, sr)
    out=" ".join(s.text for s in m.transcribe("_s.wav", language="ko", beam_size=1)[0])
    print(i, "| 원문:", L["sub"]); print("   | 인식:", out.strip())
