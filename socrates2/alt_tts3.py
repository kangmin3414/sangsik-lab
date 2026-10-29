# pre-synthesize alternative spoken forms for a few segments (cached under the keys tts3 would use),
# so switching script.py to an alternative later needs no new synthesis. Also adds them to asr.json.
import json, os, numpy as np, soundfile as sf
import tts3
from tts3 import segments, key, speed, trim, VOICE, SR, NT, cer
ALTS = [(2, 3, "린이가 뭐지?"), (3, 2, "린하다, 뜻."), (29, 2, "아들들에게, 갑옷을 입고 싸우는 기술을 가르쳐야 할까?"),
        (51, 1, "젊은이들을 타락시키고, 나라의 신을 믿지 않는다는 죄로 법정에 서게 됩니다."), (55, 1, "탈출 준비는 다 해 두었네.")]
import supertonic as s
tts = s.TTS(model='supertonic-3'); jobs = []
for i, j, alt in ALTS:
    v = segments(i)[j][0]; st = tts.get_voice_style(VOICE[v])
    for k in range(NT):
        p = "segs/%s.wav" % key(i, j, v, alt, k); jobs.append((i, j, v, alt, k))
        if os.path.exists(p): continue
        t = alt.replace("'", "").replace("…", ",")
        if t.endswith(","): t = t[:-1] + "."
        w, _ = tts.synthesize(t, voice_style=st, lang='ko', total_steps=24, speed=speed(i, v) + (0, -0.02)[k], silence_duration=0.2)
        sf.write(p, trim(np.asarray(w).reshape(-1)), SR)
    print("alt synth", i, j, flush=True)
from faster_whisper import WhisperModel
from scipy.signal import resample_poly
m = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=2)
res = json.load(open("asr.json"))
for i, j, v, alt, k in jobs:
    kk = key(i, j, v, alt, k)
    if kk in res: continue
    w, _ = sf.read("segs/%s.wav" % kk)
    w16 = resample_poly(np.pad(w, (int(0.2 * SR), int(0.2 * SR))), 160, 441).astype(np.float32)
    sg, _ = m.transcribe(w16, language="ko", beam_size=1, word_timestamps=True, condition_on_previous_text=False, vad_filter=False)
    words = []; out = ""
    for x in sg: out += x.text; words += [(wd.word.strip(), round(wd.probability, 3)) for wd in (x.words or [])]
    probs = sorted(p for _, p in words) or [0]
    res[kk] = {"txt": out.strip(), "cer": round(cer(out, alt), 3), "low3": round(float(np.mean(probs[:3])), 3), "dur": round(len(w) / SR, 2)}
    print("alt asr", kk, res[kk], flush=True)
json.dump(res, open("asr.json", "w"), ensure_ascii=False, indent=1)
