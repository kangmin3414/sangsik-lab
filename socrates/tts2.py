# v2 narration: 3 takes per line at 24 steps, pick the clearest take with Whisper.
# usage: python3 tts2.py synth|asr|build|all [line indices to redo...]
import json, os, re, sys, numpy as np, soundfile as sf
from script import S
SR = 44100
os.makedirs("takes", exist_ok=True)
SLOW = {"qcell", "qnote", "qask", "thanks"}
NT = 3

def speed_for(i, scene, args):
    if "spd" in args: return args["spd"]
    if scene in SLOW: return 0.90
    if scene == "qtrial" and args.get("k", 0) >= 2: return 0.92
    if scene == "qlesson": return 0.92
    return 0.95

def trim(w):
    thr = 0.01 * np.abs(w).max(); idx = np.where(np.abs(w) > thr)[0]
    return w[max(0, idx[0] - int(0.03 * SR)):idx[-1] + int(0.08 * SR)]

def synth(only=None):
    import supertonic as s
    tts = s.TTS(model='supertonic-3'); st = tts.get_voice_style('M2')
    for i, (scene, args, sub, spk) in enumerate(S):
        if only and i not in only: continue
        text = (spk or sub).replace("'", "").replace("…", ",")
        for k in range(NT):
            p = "takes/%02d_%d.wav" % (i, k)
            if os.path.exists(p) and not only: continue
            sp = speed_for(i, scene, args) + (0, -0.015, 0.015)[k]
            wav, _ = tts.synthesize(text, voice_style=st, lang='ko', total_steps=24, speed=sp, silence_duration=0.25)
            sf.write(p, trim(np.asarray(wav).reshape(-1)), SR)
        print("synth", i, flush=True)

def norm(t):
    return re.sub(r"[^0-9A-Za-z가-힣%]", "", t)

def cer(a, b):
    a, b = norm(a), norm(b)
    if not b: return 1.0
    d = list(range(len(b) + 1))
    for x in a:
        prev, d[0] = d[0], d[0] + 1
        for j, y in enumerate(b, 1):
            prev, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, prev + (x != y))
    return d[len(b)] / len(b)

def asr(only=None):
    from faster_whisper import WhisperModel
    from scipy.signal import resample_poly
    m = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=2)
    res = json.load(open("asr.json")) if os.path.exists("asr.json") else {}
    for i, (scene, args, sub, spk) in enumerate(S):
        for k in range(NT):
            key = "%02d_%d" % (i, k)
            if key in res and not (only and i in only): continue
            w, _ = sf.read("takes/%s.wav" % key)
            w16 = resample_poly(w, 160, 441).astype(np.float32)
            segs, _ = m.transcribe(w16, language="ko", beam_size=1, word_timestamps=True, condition_on_previous_text=False, vad_filter=False)
            words = []; txt = ""
            for sg in segs:
                txt += sg.text
                words += [(wd.word.strip(), round(wd.probability, 3)) for wd in (sg.words or [])]
            c = min(cer(txt, spk or sub), cer(txt, sub))
            probs = sorted(p for _, p in words) or [0]
            low = float(np.mean(probs[:3]))
            res[key] = {"txt": txt.strip(), "cer": round(c, 3), "low3": round(low, 3),
                        "worst": sorted(words, key=lambda x: x[1])[:3], "dur": round(len(w) / SR, 2)}
        print("asr", i, [res["%02d_%d" % (i, k)]["cer"] for k in range(NT)], flush=True)
        json.dump(res, open("asr.json", "w"), ensure_ascii=False, indent=1)

def pick(res, i):
    best = None
    for k in range(NT):
        r = res["%02d_%d" % (i, k)]
        score = r["cer"] + 0.12 * (1 - r["low3"]) + 0.2 * r["txt"].count("회자")
        if best is None or score < best[0]: best = (score, k)
    return best[1]

def build():
    res = json.load(open("asr.json"))
    force = json.load(open("force.json")) if os.path.exists("force.json") else {}
    chunks = [np.zeros(int(0.8 * SR))]; tl = []; t = 0.8; rep = []
    for i, (scene, args, sub, spk) in enumerate(S):
        k = force.get(str(i), pick(res, i))
        w, _ = sf.read("takes/%02d_%d.wav" % (i, k))
        d = len(w) / SR
        tl.append({"i": i, "scene": scene, "args": args, "sub": sub, "t0": round(t, 3), "t1": round(t + d, 3), "take": k})
        r = res.get("%02d_%d" % (i, k), {"cer": 0, "low3": 1, "worst": [], "txt": "(forced take)"})
        rep.append("%2d k%d cer=%.3f low=%.2f %s | %s" % (i, k, r["cer"], r["low3"], r["worst"], r["txt"]))
        chunks.append(w); t += d
        gap = 0.95 if scene == "chapter" or (i + 1 < len(S) and S[i + 1][0] == "chapter") else 0.45
        if i + 1 < len(S) and S[i + 1][0] != scene: gap += 0.15
        gap += args.get("pause", 0)
        chunks.append(np.zeros(int(gap * SR))); t += gap
    chunks.append(np.zeros(int(2.0 * SR))); t += 2.0
    voice = np.concatenate(chunks)
    sf.write("voice.wav", voice, SR)
    FPS = 24; hop = SR // FPS; nfr = int(t * FPS) + 1
    pad = np.pad(voice, (0, max(0, nfr * hop - len(voice))))
    rms = np.sqrt(np.mean(pad[:nfr * hop].reshape(nfr, hop) ** 2, axis=1))
    envv = np.clip(rms / (np.percentile(rms[rms > 1e-4], 90) + 1e-9), 0, 1)
    json.dump({"duration": round(t, 3), "lines": tl, "env": [round(float(v), 2) for v in envv]},
              open("timeline.json", "w"), ensure_ascii=False, indent=1)
    open("take_report.txt", "w").write("\n".join(rep))
    print("total %.1fs (%d:%02d), lines %d" % (t, t // 60, t % 60, len(tl)))

if __name__ == "__main__":
    cmd = sys.argv[1]; only = set(int(x) for x in sys.argv[2:]) or None
    if cmd in ("synth", "all"): synth(only)
    if cmd in ("asr", "all"): asr(only)
    if cmd in ("build", "all"): build()
