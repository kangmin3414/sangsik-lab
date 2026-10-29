"""One continuous theme per episode (proposal for v3).

- a single key, tempo and 8-bar chord progression for the whole video, so the music never "changes song"
- intensity 0..2 only adds/removes layers, with slow ramps:
    0 = soft pad + low piano bass, 1 = + gentle piano broken chords, 2 = + a quiet high motif
- mixed as one bed: constant level, a fixed (static) dip around 1.5-4 kHz and only a light, slow side-chain,
  so the music does not jump up in every pause
"""
import numpy as np
from scipy.signal import stft, istft
import music as M

SR = M.SR

def note(root, mode, deg, octv=0):
    return M.note_freq(root, mode, deg, octv)

def render_theme(total, intensity, root=146.83, mode='aeolian', bpm=72, prog=(0, 5, 3, 4, 0, 5, 6, 4),
                 motif=((0, 4), (2, 2), (1, 2), (4, 4), (2, 2), (0, 2)), lead='piano', top='celesta', seed=5):
    """intensity: function t -> 0..2 (already smooth)."""
    rng = np.random.default_rng(seed)
    beat = 60 / bpm; bar = beat * 4; n = int(total * SR) + SR * 4
    lay = {k: np.zeros(n) for k in ('pad', 'bass', 'arp', 'top')}
    def add(k, sig, t0, g):
        i = int(t0 * SR); j = min(n, i + len(sig))
        if 0 <= i < n: lay[k][i:j] += sig[: j - i] * g
    nb = int(np.ceil(total / bar)) + 1
    for b in range(nb):
        t0 = b * bar; deg = prog[b % len(prog)]; ch = [deg, deg + 2, deg + 4]
        add('pad', M.pad([note(root, mode, c, 0) for c in ch], bar + 1.5, 0.5), t0, 0.5)
        add('bass', M.inst('piano', note(root, mode, deg, -1), bar * 0.95, 0.9, rng), t0, 0.55)
        # broken chord: one note per beat, low register, soft
        for k, c in enumerate([ch[0], ch[1], ch[2], ch[1]]):
            add('arp', M.inst(lead, note(root, mode, c, 1 if k != 2 else 1), 1.8, 0.55 + 0.1 * (k == 0), rng), t0 + k * beat + rng.uniform(0, 0.015), 0.42)
        # the same quiet motif every two bars (recognisable, not busy)
        if b % 2 == 0:
            tt = t0
            for dg, ln in motif:
                add('top', M.inst(top, note(root, mode, deg + dg, 2), ln * beat * 0.5 + 1.0, 0.5, rng), tt, 0.28)
                tt += ln * beat * 0.5
    t = np.arange(n) / SR
    I = np.array([intensity(x) for x in np.arange(0, n / SR, 0.05)])
    I = np.interp(t, np.arange(len(I)) * 0.05, I)
    g_arp = np.clip(I, 0, 1); g_top = np.clip(I - 1, 0, 1)
    mus = lay['pad'] * 1.0 + lay['bass'] * 0.9 + lay['arp'] * g_arp + lay['top'] * g_top
    mus = M.reverb(mus[: int(total * SR)], secs=2.6, wet=0.32)
    return mus / (np.abs(mus).max() + 1e-9)

def smooth_steps(points, total, ramp=6.0):
    """points: [(time, level)] -> smooth function with `ramp`-second cosine transitions."""
    pts = sorted(points)
    def f(x):
        lv = pts[0][1]
        for (t0, v0), (t1, v1) in zip(pts, pts[1:]):
            if x >= t1: lv = v1; continue
            if x >= t1 - ramp:
                k = (x - (t1 - ramp)) / ramp; return v0 + (v1 - v0) * (0.5 - 0.5 * np.cos(np.pi * k))
            return v0 if x >= t0 else lv
        return lv
    return f

def static_dip(x, lo=1500, hi=4000, db=-5.0):
    f, t, X = stft(x, SR, nperseg=2048, noverlap=1536)
    g = np.ones_like(f); sel = (f >= lo) & (f < hi); g[sel] = 10 ** (db / 20)
    X *= g[:, None]
    _, y = istft(X, SR, nperseg=2048, noverlap=1536); y = y[: len(x)]
    return np.pad(y, (0, len(x) - len(y)))

def gentle_sidechain(voice, depth_db=2.5, attack=0.3, release=1.5):
    v = np.abs(voice); hop = 441; k = len(v) // hop
    e = np.sqrt(np.mean(v[: k * hop].reshape(k, hop) ** 2, axis=1)); on = (e > 0.02).astype(float)
    out = np.zeros(k); a = 1 - np.exp(-0.01 / attack); r = 1 - np.exp(-0.01 / release); s = 0
    for i in range(k):
        s += (a if on[i] > s else r) * (on[i] - s); out[i] = s
    g = 10 ** (-depth_db * out / 20)
    g = np.interp(np.arange(len(voice)), np.arange(k) * hop, g)
    return g

def bed(voice, total, intensity, rel_db=-19.0, **kw):
    mus = render_theme(total, intensity, **kw)
    mus = static_dip(mus)
    vr = np.sqrt(np.mean(voice[np.abs(voice) > 0.02] ** 2)); mr = np.sqrt(np.mean(mus ** 2)) + 1e-9
    mus = mus * vr * 10 ** (rel_db / 20) / mr
    return mus * gentle_sidechain(voice)
