import json, importlib.util, numpy as np, soundfile as sf
from faster_whisper import WhisperModel
from scipy.signal import resample_poly
m = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=2)
out = {}
for ep in ["descartes", "zhuangzi"]:
    b = "../" + ep + "/"
    spec = importlib.util.spec_from_file_location("s_"+ep, b+"script.py"); mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
    tl = json.load(open(b+"timeline.json"))["lines"]; x, sr = sf.read(b+"voice.wav")
    res = []
    for L, (sc, args, sub, spk) in zip(tl, mod.S):
        seg = resample_poly(x[int(L["t0"]*sr):int(L["t1"]*sr)].astype(np.float32), 160, 441).astype(np.float32)
        segs, _ = m.transcribe(seg, language="ko", beam_size=5, word_timestamps=True, condition_on_previous_text=False)
        words = [(w.word.strip(), round(w.probability, 2), round(w.start, 2)) for s in segs for w in s.words]
        low = [w for w in words if w[1] < 0.55]
        res.append({"i": L["i"], "sub": sub, "low": low})
        print(ep, L["i"], low, flush=True)
    out[ep] = res
json.dump(out, open("asr_words.json", "w"), ensure_ascii=False, indent=1)
print("done")
