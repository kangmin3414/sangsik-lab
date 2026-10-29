import json, sys, re, importlib.util, numpy as np, soundfile as sf
from faster_whisper import WhisperModel
from scipy.signal import resample_poly
model = sys.argv[1]
m = WhisperModel(model, device="cpu", compute_type="int8", cpu_threads=2)
def norm(s): return re.sub(r"[^가-힣0-9a-zA-Z]", "", s)
def cer(a, b):
    a, b = norm(a), norm(b)
    d = list(range(len(b)+1))
    for i, ca in enumerate(a, 1):
        p, d[0] = d[0], i
        for j, cb in enumerate(b, 1):
            p, d[j] = d[j], min(d[j]+1, d[j-1]+1, p+(ca != cb))
    return d[len(b)] / max(1, len(a))
out = {}
for ep in ["descartes", "zhuangzi"]:
    base = "../" + ep + "/"
    spec = importlib.util.spec_from_file_location("s_"+ep, base+"script.py"); mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
    tl = json.load(open(base+"timeline.json"))["lines"]
    x, sr = sf.read(base+"voice.wav")
    res = []
    for L, (sc, args, sub, spk) in zip(tl, mod.S):
        seg = x[int(L["t0"]*sr):int(L["t1"]*sr)].astype(np.float32)
        seg = resample_poly(seg, 160, 441).astype(np.float32)
        segs, _ = m.transcribe(seg, language="ko", beam_size=5, word_timestamps=False, condition_on_previous_text=False)
        txt = " ".join(s.text for s in segs).strip()
        c = min(cer(sub, txt), cer(spk or sub, txt))
        res.append({"i": L["i"], "scene": sc, "sub": sub, "spk": spk, "asr": txt, "cer": round(c, 3), "dur": round(L["t1"]-L["t0"], 2)})
        print(ep, L["i"], round(c, 3), flush=True)
    out[ep] = res
json.dump(out, open("asr_%s.json" % model, "w"), ensure_ascii=False, indent=1)
print("done")
