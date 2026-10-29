"""Narration-first BGM mixer: one track, carved EQ, smooth sidechain ducking, no SFX."""
import numpy as np, soundfile as sf, librosa, scipy.signal as ss
SR = 44100

def biquad_peak(f0, gain_db, q):
    A = 10 ** (gain_db / 40); w = 2 * np.pi * f0 / SR; al = np.sin(w) / (2 * q)
    b = [1 + al * A, -2 * np.cos(w), 1 - al * A]; a = [1 + al / A, -2 * np.cos(w), 1 - al / A]
    return np.array(b) / a[0], np.array(a) / a[0]

def carve(m):
    b, a = ss.butter(2, 70 / (SR / 2), 'high'); m = ss.lfilter(b, a, m, axis=0)
    for f0, g, q in ((2800, -4.0, 0.8), (1200, -2.0, 1.0)):
        b, a = biquad_peak(f0, g, q); m = ss.lfilter(b, a, m, axis=0)
    return m

def smooth_gain(target, att=0.25, rel=0.9):
    """one-pole follower: falls (ducks) with `att`, recovers with `rel` seconds."""
    ka, kr = np.exp(-1 / (att * SR)), np.exp(-1 / (rel * SR))
    out = np.empty_like(target); g = target[0]
    for i, t in enumerate(target):
        k = ka if t < g else kr
        g = k * g + (1 - k) * t; out[i] = g
    return out

def mix(voice, music, bed_db=-11.0, duck_db=-8.0, fade_in=2.0, fade_out=3.0):
    N = len(voice)
    if len(music) < N:  # loop with 4 s crossfade if needed
        xf = int(4 * SR); out = music.copy()
        while len(out) < N:
            r = np.linspace(0, 1, xf)[:, None]
            out = np.concatenate([out[:-xf], out[-xf:] * (1 - r) + music[:xf] * r, music[xf:]])
        music = out
    m = carve(music[:N])
    act = voice[np.abs(voice) > 0.02]
    vr = np.sqrt(np.mean(act ** 2)); mr = np.sqrt(np.mean(m ** 2))
    m *= vr * 10 ** (bed_db / 20) / (mr + 1e-9)
    # voice activity -> duck target (lookahead 0.15 s so the dip starts just before speech)
    env = np.convolve(np.abs(voice), np.ones(int(0.12 * SR)) / int(0.12 * SR), 'same')
    speech = (env > 0.015).astype(float)
    la = int(0.15 * SR); speech = np.maximum(speech, np.concatenate([speech[la:], np.zeros(la)]))
    # 1/4-rate follower for speed
    tgt = np.where(speech > 0, 10 ** (duck_db / 20), 1.0)[::4]
    g = np.repeat(smooth_gain(tgt, 0.25 * 1, 0.9 * 1)[:, None], 4, 0)[:N, 0]
    g = np.pad(g, (0, N - len(g)), mode='edge')
    fade = np.ones(N); fi, fo = int(fade_in * SR), int(fade_out * SR)
    fade[:fi] = np.linspace(0, 1, fi) ** 2; fade[-fo:] = np.linspace(1, 0, fo) ** 2
    out = voice[:, None] + m * (g * fade)[:, None]
    return out / (np.abs(out).max() + 1e-9) * 0.9

def load_music(fn, offset=0.0):
    y, _ = librosa.load(fn, sr=SR, mono=False, offset=offset)
    y = y.T if y.ndim == 2 else np.stack([y, y], 1)
    return y
