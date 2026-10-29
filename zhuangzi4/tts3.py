# v3 narration: sentence-level synthesis, character voices, designed breathing.
# Each line = segments (voice, text). 2 takes per segment, Whisper picks the clearest; pauses follow the punctuation.
# usage: python3 tts3.py synth|asr|build|all
import json, os, re, sys, hashlib, numpy as np, soundfile as sf
from script import S
SR = 44100
VOICE = {"N": "M2", "J": "M5", "H": "M3", "K": "M4", "E": "M4", "C": "M4", "T": "M5", "Z": "M1", "F": "F2"}
SPEED = {"N": 0.94, "J": 0.92, "H": 0.98, "K": 0.92, "E": 1.0, "C": 1.0, "T": 0.82, "Z": 1.0, "F": 1.0}
SLOW = {"grave", "axe", "ending", "meadow", "thanks"}
NT = 2
os.makedirs("segs", exist_ok=True)

def segments(i):
    scene, args, sub, spk = S[i]
    if "segs" in args:
        out = []
        for s in args["segs"]:
            v, txt = s[0], s[1]; sp = s[2] if len(s) > 2 else txt
            out.append((v, txt, sp))
        return out
    text, spoken = sub, spk or sub
    a = re.split(r'(?<=[.?!])\s+', text.strip()); b = re.split(r'(?<=[.?!])\s+', spoken.strip())
    if len(a) != len(b): a = b
    return [("N", x, y) for x, y in zip(a, b)]

def speed(i, v):
    scene = S[i][0]; base = SPEED.get(v, 0.97)
    if v == "N" and scene in SLOW: base -= 0.04
    if v == "N" and scene == "lesson": base -= 0.02
    return base

def key(i, j, v, sp, k):
    return "%02d_%02d_%d_%s" % (i, j, k, hashlib.md5((VOICE[v] + sp + str(speed(i, v))).encode()).hexdigest()[:6])

def trim(w):
    thr = 0.01 * np.abs(w).max(); idx = np.where(np.abs(w) > thr)[0]
    return w[max(0, idx[0] - int(0.02 * SR)):idx[-1] + int(0.06 * SR)]

def synth():
    import supertonic as s
    tts = s.TTS(model='supertonic-3'); styles = {}
    for i in range(len(S)):
        for j, (v, txt, sp) in enumerate(segments(i)):
            st = styles.setdefault(v, tts.get_voice_style(VOICE[v]))
            for k in range(NT):
                p = "segs/%s.wav" % key(i, j, v, sp, k)
                if os.path.exists(p): continue
                t = sp.replace("'", "").replace("…", ",")
                if t.endswith(","): t = t[:-1] + "."
                w, _ = tts.synthesize(t, voice_style=st, lang='ko', total_steps=24, speed=speed(i, v) + (0, -0.02)[k], silence_duration=0.2)
                sf.write(p, trim(np.asarray(w).reshape(-1)), SR)
        print("synth", i, flush=True)

def norm(t): return re.sub(r"[^0-9A-Za-z가-힣%]", "", t)
def cer(a, b):
    a, b = norm(a), norm(b)
    if not b: return 1.0
    d = list(range(len(b) + 1))
    for x in a:
        prev, d[0] = d[0], d[0] + 1
        for j, y in enumerate(b, 1):
            prev, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, prev + (x != y))
    return d[len(b)] / len(b)

def asr():
    from faster_whisper import WhisperModel
    from scipy.signal import resample_poly
    m = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=2)
    res = json.load(open("asr.json")) if os.path.exists("asr.json") else {}
    for i in range(len(S)):
        for j, (v, txt, sp) in enumerate(segments(i)):
            for k in range(NT):
                kk = key(i, j, v, sp, k)
                if kk in res: continue
                w, _ = sf.read("segs/%s.wav" % kk)
                w16 = resample_poly(np.pad(w, (int(0.2 * SR), int(0.2 * SR))), 160, 441).astype(np.float32)
                sg, _ = m.transcribe(w16, language="ko", beam_size=1, word_timestamps=True, condition_on_previous_text=False, vad_filter=False)
                words = []; out = ""
                for x in sg: out += x.text; words += [(wd.word.strip(), round(wd.probability, 3)) for wd in (x.words or [])]
                probs = sorted(p for _, p in words) or [0]
                res[kk] = {"txt": out.strip(), "cer": round(min(cer(out, sp), cer(out, txt)), 3), "low3": round(float(np.mean(probs[:3])), 3), "dur": round(len(w) / SR, 2)}
        print("asr", i, flush=True)
        json.dump(res, open("asr.json", "w"), ensure_ascii=False, indent=1)

def gap_after(txt, nxt_v, v):
    t = txt.strip()
    g = 0.42 if t.endswith('?') else (0.4 if t.endswith('…') else (0.18 if t.endswith(',') else 0.34))
    if len(norm(t)) <= 6 and not t.endswith('?'): g -= 0.06
    if nxt_v is not None and nxt_v != v: g += 0.1
    return g

def build():
    res = json.load(open("asr.json")); force = json.load(open("force.json")) if os.path.exists("force.json") else {}
    chunks = [np.zeros(int(0.8 * SR))]; tl = []; t = 0.8; rep = []
    for i, (scene, args, sub, spk) in enumerate(S):
        segs = segments(i); parts = []; t0 = t; st = []; tt = t
        for j, (v, txt, sp) in enumerate(segs):
            cands = [key(i, j, v, sp, k) for k in range(NT)]
            best = force.get("%d_%d" % (i, j)) or min(cands, key=lambda c: res[c]["cer"] + 0.12 * (1 - res[c]["low3"]))
            if isinstance(best, int): best = cands[best]
            w, _ = sf.read("segs/%s.wav" % best); r = res[best]
            lv = 20 * np.log10(np.sqrt(np.mean(w[np.abs(w) > 0.01] ** 2)) + 1e-9); w = w * float(np.clip(10 ** ((-21.0 - lv) / 20), 0.7, 1.6))  # even out voices
            rep.append("%2d.%d %-2s cer=%.3f low=%.2f | %s" % (i, j, v, r["cer"], r["low3"], r["txt"]))
            parts.append(w); st.append({"v": v, "text": txt, "t0": round(tt, 3), "t1": round(tt + len(w) / SR, 3)}); tt += len(w) / SR
            if j + 1 < len(segs): g = int(gap_after(txt, segs[j + 1][0], v) * SR); parts.append(np.zeros(g)); tt += g / SR
        w = np.concatenate(parts); d = len(w) / SR
        tl.append({"i": i, "scene": scene, "args": args, "sub": sub, "t0": round(t, 3), "t1": round(t + d, 3), "segs": st})
        chunks.append(w); t += d
        gap = 0.95 if scene == "chapter" or (i + 1 < len(S) and S[i + 1][0] == "chapter") else 0.5
        if i + 1 < len(S) and S[i + 1][0] != scene: gap += 0.2
        gap += args.get("pause", 0)
        chunks.append(np.zeros(int(gap * SR))); t += gap
    chunks.append(np.zeros(int(2.0 * SR))); t += 2.0
    voice = np.concatenate(chunks); sf.write("voice.wav", voice, SR)
    FPS = 24; hop = SR // FPS; nfr = int(t * FPS) + 1
    pad = np.pad(voice, (0, max(0, nfr * hop - len(voice))))
    rms = np.sqrt(np.mean(pad[:nfr * hop].reshape(nfr, hop) ** 2, axis=1))
    envv = np.clip(rms / (np.percentile(rms[rms > 1e-4], 90) + 1e-9), 0, 1)
    json.dump({"duration": round(t, 3), "lines": tl, "env": [round(float(x), 2) for x in envv]}, open("timeline.json", "w"), ensure_ascii=False, indent=1)
    open("take_report.txt", "w").write("\n".join(rep))
    print("total %.1fs (%d:%02d), lines %d, segments %d" % (t, t // 60, t % 60, len(tl), len(rep)))

if __name__ == "__main__":
    cmd = sys.argv[1]
    if cmd in ("synth", "all"): synth()
    if cmd in ("asr", "all"): asr()
    if cmd in ("build", "all"): build()
