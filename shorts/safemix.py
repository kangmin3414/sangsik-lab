"""Narration-safe music bed (v2 episodes).

- every section is rendered twice: a BED (pad/drone only) and a LEAD (melody only, no percussion)
- the lead is gated by the narration: full only in the gaps between sentences
- while someone speaks, the 0.9-5 kHz band of the music is cut further (spectral ducking)
- whole music bus sits ~-17 dB under the voice and ducks again under speech
"""
import numpy as np
from scipy.signal import stft, istft
import music as M

SR = M.SR

def movavg(x, k):
    k = max(1, int(k)); c = np.cumsum(np.insert(x, 0, 0.0)); y = (c[k:] - c[:-k]) / k
    return np.pad(y, (k // 2, len(x) - len(y) - k // 2), mode="edge")

def speech_env(voice, thr=0.02):
    """0..1 envelope: 1 while the narrator speaks (fast attack, slow release)."""
    v = movavg(np.abs(voice), 0.08 * SR)
    on = (v > thr).astype(float)
    on = np.maximum(on, np.roll(on, -int(0.12 * SR)))          # open a little before the word
    on = movavg(on, 0.18 * SR)
    # slow release: hold for 0.35 s after speech stops
    hold = int(0.35 * SR); out = on.copy()
    run = 0.0
    step = 1.0 / hold
    for i in range(0, len(on), 256):
        blk = on[i:i + 256].max()
        run = max(blk, run - step * 256)
        out[i:i + 256] = np.maximum(out[i:i + 256], run)
    return np.clip(out, 0, 1)

def layer(moods, sections, total, which, seed=11, xfade=1.6):
    N = int(total * SR); mus = np.zeros(N)
    for i, (t0, t1, name) in enumerate(sections):
        m = dict(moods[name])
        if which == "bed":
            m["leadGain"] = 0.0; m.pop("gliss", None); m["perc"] = None
            if not m.get("pad") and not m.get("drone"): m["pad"] = 0.12
        else:
            m["pad"] = 0; m["drone"] = 0; m["perc"] = None
        a = max(0, t0 - xfade / 2); b = min(total, t1 + xfade / 2)
        seg = M.render_mood(m, b - a, seed + i * 7)
        r = np.sqrt(np.mean(seg ** 2)) + 1e-9; seg = seg * (0.1 * moods[name].get("gain", 1.0) / r)
        n = len(seg); e = np.ones(n); f = int(xfade * SR)
        if i > 0: e[:f] = np.linspace(0, 1, min(f, n))[: min(f, n)]
        if i < len(sections) - 1: e[-f:] *= np.linspace(1, 0, f)
        ia = int(a * SR); mus[ia: ia + n] += (seg * e)[: N - ia]
    return mus

def band_duck(x, sp, lo=900, hi=5000, depth=0.6):
    f, t, X = stft(x, SR, nperseg=2048, noverlap=1536)
    idx = np.clip((t * SR).astype(int), 0, len(sp) - 1)
    g = 1 - depth * sp[idx]
    sel = (f >= lo) & (f < hi)
    X[sel] *= g[None, :]
    # soften the edge bands a little too
    X[(f >= 500) & (f < lo)] *= (1 - 0.35 * sp[idx])[None, :]
    _, y = istft(X, SR, nperseg=2048, noverlap=1536)
    y = y[: len(x)]
    return np.pad(y, (0, len(x) - len(y)))

def build(voice, sections, total, moods, mutes=(), bed_gain=0.8, lead_floor=0.28, rel_db=-17.0, duck=0.4):
    sp = speech_env(voice)
    bed = layer(moods, sections, total, "bed")
    lead = layer(moods, sections, total, "lead")
    gate = lead_floor + (1 - lead_floor) * (1 - sp)
    mus = bed * bed_gain + lead * gate
    mus = M.reverb(mus, secs=2.4, wet=0.3)
    mus = band_duck(mus, sp)
    for (a, b) in mutes:  # silence windows (e.g. a countdown), 0.4 s fades
        N = len(mus); i0, i1 = int(a * SR), int(b * SR); fd = int(0.4 * SR)
        g = np.ones(N); g[i0:i1] = 0
        g[max(0, i0 - fd):i0] = np.linspace(1, 0, i0 - max(0, i0 - fd)); g[i1:min(N, i1 + fd)] = np.linspace(0, 1, min(N, i1 + fd) - i1)
        mus *= g
    vr = np.sqrt(np.mean(voice[np.abs(voice) > 0.02] ** 2)); mr = np.sqrt(np.mean(mus ** 2)) + 1e-9
    mus *= vr * 10 ** (rel_db / 20) / mr
    mus *= (1 - (1 - duck) * sp)
    return mus, sp

def masking_report(voice, rest, timeline_lines=None):
    f, t, V = stft(voice, SR, nperseg=2048, noverlap=1024); _, _, R = stft(rest, SR, nperseg=2048, noverlap=1024)
    PV = np.abs(V) ** 2; PR = np.abs(R) ** 2
    vr = np.sqrt(PV.sum(0)); speech = vr > np.percentile(vr, 60) * 0.3
    def band(P, lo, hi): return P[(f >= lo) & (f < hi)].sum(0) + 1e-12
    out = {}
    for lo, hi in [(150, 500), (500, 1000), (1000, 2000), (2000, 4000), (4000, 8000)]:
        r = 10 * np.log10(band(PV, lo, hi)[speech] / band(PR, lo, hi)[speech])
        out["%d-%d" % (lo, hi)] = [round(float(np.median(r)), 1), round(float(np.percentile(r, 10)), 1)]
    hb = np.log(band(PR, 1000, 8000)); flux = np.maximum(0, np.diff(hb)); thr = np.percentile(flux, 90)
    onsets = (flux > max(thr, 1.0)) & speech[1:]
    out["bg_onsets_per_sec_in_speech"] = round(float(onsets.sum() / (speech.sum() * (t[1] - t[0]))), 2)
    cen = (f[:, None] * PR).sum(0) / PR.sum(0)
    out["bg_centroid_hz"] = int(np.median(cen[speech]))
    if timeline_lines:
        per = []
        for L in timeline_lines:
            sel = (t >= L["t0"]) & (t <= L["t1"]) & speech
            if sel.sum() < 3: continue
            r = 10 * np.log10(band(PV, 1000, 4000)[sel] / band(PR, 1000, 4000)[sel])
            per.append((round(float(np.percentile(r, 10)), 1), L["i"], L["scene"]))
        per.sort(); out["worst_lines"] = per[:6]
    return out
