# Shorts narration: sentence-level Supertonic takes (2 per sentence), Whisper picks the clearest, designed pauses.
# usage: python3 tts_s.py synth|asr|build|all   -> <short>/voice.wav, <short>/timeline.json, outro.wav, take_report.txt
import json, os, re, sys, hashlib, numpy as np, soundfile as sf
from script import SH, OUTRO
SR = 44100; VOICE = "M2"; SPEED = 0.98; NT = 2
os.makedirs("segs", exist_ok=True)

def sents(sub, spk):
    a = re.split(r'(?<=[.?!])\s+', sub.strip()); b = re.split(r'(?<=[.?!])\s+', (spk or sub).strip())
    if len(a) != len(b): a = b
    return list(zip(a, b))

def all_segs():
    out = []
    for name, sh in SH.items():
        for i, (sc, args, sub, spk) in enumerate(sh["lines"]):
            for j, (txt, sp) in enumerate(sents(sub, spk)): out.append((name, i, j, txt, sp))
    for j, (txt, sp) in enumerate(sents(*OUTRO)): out.append(("outro", 0, j, txt, sp))
    return out

def key(sp, k): return "%d_%s" % (k, hashlib.md5((VOICE + sp + str(SPEED)).encode()).hexdigest()[:10])
def trim(w):
    thr = 0.01 * np.abs(w).max(); idx = np.where(np.abs(w) > thr)[0]
    return w[max(0, idx[0] - int(0.02 * SR)):idx[-1] + int(0.06 * SR)]

def synth():
    import supertonic as s
    tts = s.TTS(model='supertonic-3'); st = tts.get_voice_style(VOICE)
    for name, i, j, txt, sp in all_segs():
        for k in range(NT):
            p = "segs/%s.wav" % key(sp, k)
            if os.path.exists(p): continue
            t = sp.replace("'", "").replace("…", ",")
            if t.endswith(","): t = t[:-1] + "."
            w, _ = tts.synthesize(t, voice_style=st, lang='ko', total_steps=24, speed=SPEED + (0, -0.02)[k], silence_duration=0.2)
            sf.write(p, trim(np.asarray(w).reshape(-1)), SR)
        print("synth", name, i, j, flush=True)

def norm(t): return re.sub(r"[^0-9A-Za-z가-힣%]", "", t)
def cer(a, b):
    a, b = norm(a), norm(b)
    if not b: return 1.0
    d = list(range(len(b) + 1))
    for x in a:
        prev, d[0] = d[0], d[0] + 1
        for j, y in enumerate(b, 1): prev, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, prev + (x != y))
    return d[len(b)] / len(b)

def asr():
    from faster_whisper import WhisperModel
    from scipy.signal import resample_poly
    m = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=2)
    res = json.load(open("asr.json")) if os.path.exists("asr.json") else {}
    for name, i, j, txt, sp in all_segs():
        for k in range(NT):
            kk = key(sp, k)
            if kk in res: continue
            w, _ = sf.read("segs/%s.wav" % kk)
            w16 = resample_poly(np.pad(w, (int(0.2 * SR), int(0.2 * SR))), 160, 441).astype(np.float32)
            sg, _ = m.transcribe(w16, language="ko", beam_size=1, word_timestamps=True, condition_on_previous_text=False, vad_filter=False)
            words = []; out = ""
            for x in sg: out += x.text; words += [wd.probability for wd in (x.words or [])]
            probs = sorted(words) or [0]
            res[kk] = {"txt": out.strip(), "cer": round(min(cer(out, sp), cer(out, txt)), 3), "low3": round(float(np.mean(probs[:3])), 3)}
        json.dump(res, open("asr.json", "w"), ensure_ascii=False, indent=1)
    print("asr done")

def pick(sp, res, force, tag):
    c = [key(sp, k) for k in range(NT)]
    b = force.get(tag)
    if b is not None: return c[b] if isinstance(b, int) else b
    return min(c, key=lambda x: res[x]["cer"] + 0.12 * (1 - res[x]["low3"]))

def gap(t):
    t = t.strip(); g = 0.38 if t.endswith('?') else (0.18 if t.endswith(',') else 0.3)
    return g - (0.05 if len(norm(t)) <= 6 and not t.endswith('?') else 0)

def build():
    res = json.load(open("asr.json")); force = json.load(open("force.json")) if os.path.exists("force.json") else {}
    rep = []
    for name, sh in SH.items():
        os.makedirs(name, exist_ok=True)
        t = 0.3; chunks = [np.zeros(int(0.3 * SR))]; tl = []
        for i, (sc, args, sub, spk) in enumerate(sh["lines"]):
            ss = sents(sub, spk); t0 = t; st = []
            for j, (txt, sp) in enumerate(ss):
                kk = pick(sp, res, force, "%s_%d_%d" % (name, i, j)); w, _ = sf.read("segs/%s.wav" % kk); r = res[kk]
                rep.append("%s %d.%d cer=%.3f low=%.2f | %s" % (name, i, j, r["cer"], r["low3"], r["txt"]))
                st.append({"v": "N", "text": txt, "t0": round(t, 3), "t1": round(t + len(w) / SR, 3)}); chunks.append(w); t += len(w) / SR
                if j + 1 < len(ss): g = gap(txt); chunks.append(np.zeros(int(g * SR))); t += g
            tl.append({"i": i, "scene": sc, "args": args, "sub": sub, "t0": round(t0, 3), "t1": round(t, 3), "segs": st})
            g = (0.42 + (0.1 if i + 1 < len(sh["lines"]) and sh["lines"][i + 1][0] != sc else 0)) if i + 1 < len(sh["lines"]) else 0.45
            g += args.get("pause", 0); chunks.append(np.zeros(int(g * SR))); t += g
        v = np.concatenate(chunks); sf.write(name + "/voice.wav", v, SR)
        json.dump({"duration": round(t, 3), "lines": tl}, open(name + "/timeline.json", "w"), ensure_ascii=False, indent=1)
        print(name, "%.2fs" % t)
    parts = []
    for j, (txt, sp) in enumerate(sents(*OUTRO)):
        kk = pick(sp, res, force, "outro_0_%d" % j); w, _ = sf.read("segs/%s.wav" % kk); r = res[kk]
        rep.append("outro 0.%d cer=%.3f low=%.2f | %s" % (j, r["cer"], r["low3"], r["txt"]))
        parts += [w, np.zeros(int(0.3 * SR))]
    o = np.concatenate(parts[:-1]); sf.write("outro.wav", o, SR); print("outro %.2fs" % (len(o) / SR))
    open("take_report.txt", "w").write("\n".join(rep))

if __name__ == "__main__":
    c = sys.argv[1]
    if c in ("synth", "all"): synth()
    if c in ("asr", "all"): asr()
    if c in ("build", "all"): build()
