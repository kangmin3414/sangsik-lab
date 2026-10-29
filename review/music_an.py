import json, numpy as np, soundfile as sf
from scipy.signal import stft
res = {}
for ep in ["nietzsche", "descartes", "zhuangzi"]:
    b = "../%s/" % ep
    v, sr = sf.read(b + "voice.wav"); m, _ = sf.read(b + "mix.wav")
    if m.ndim > 1: m = m.mean(1)
    n = min(len(v), len(m)); v = v[:n]; m = m[:n]
    v = v / (np.abs(v).max() + 1e-9) * 0.9   # as in mix.py
    mid = slice(int(5 * sr), n - int(5 * sr))
    g = np.dot(m[mid], v[mid]) / np.dot(v[mid], v[mid])
    rest = m / g - v
    f, t, V = stft(v, sr, nperseg=2048, noverlap=1024); _, _, R = stft(rest, sr, nperseg=2048, noverlap=1024)
    PV = np.abs(V) ** 2; PR = np.abs(R) ** 2
    vr = np.sqrt(PV.sum(0)); speech = vr > np.percentile(vr, 60) * 0.3
    def band(P, lo, hi): return P[(f >= lo) & (f < hi)].sum(0) + 1e-12
    out = {}
    for lo, hi in [(150, 500), (500, 1000), (1000, 2000), (2000, 4000), (4000, 8000)]:
        r = 10 * np.log10(band(PV, lo, hi)[speech] / band(PR, lo, hi)[speech])
        out["%d-%d" % (lo, hi)] = [round(float(np.median(r)), 1), round(float(np.percentile(r, 10)), 1)]
    # transient density of the background during speech: spectral flux peaks (>2-8kHz)
    hb = np.log(band(PR, 1000, 8000)); flux = np.maximum(0, np.diff(hb)); thr = np.percentile(flux, 90)
    onsets = (flux > max(thr, 1.0)) & speech[1:]
    dt = t[1] - t[0]
    out["bg_onsets_per_sec_in_speech"] = round(float(onsets.sum() / (speech.sum() * dt)), 2)
    # spectral centroid of background during speech
    cen = (f[:, None] * PR).sum(0) / PR.sum(0)
    out["bg_centroid_hz"] = int(np.median(cen[speech]))
    # per-line worst 1-4k ratio
    tl = json.load(open(b + "timeline.json"))["lines"]
    per = []
    for L in tl:
        sel = (t >= L["t0"]) & (t <= L["t1"]) & speech
        if sel.sum() < 3: continue
        r = 10 * np.log10(band(PV, 1000, 4000)[sel] / band(PR, 1000, 4000)[sel])
        per.append((round(float(np.percentile(r, 10)), 1), L["i"], L["scene"], L["sub"][:28]))
    per.sort()
    out["worst_lines_1to4k_p10"] = per[:8]
    out["gain"] = round(float(g), 3)
    res[ep] = out
print(json.dumps(res, ensure_ascii=False, indent=1))
