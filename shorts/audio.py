import numpy as np, wave, os

SR, DUR = 44100, 60.0
N = int(SR * DUR)
mix = np.zeros(N)
rng = np.random.default_rng(7)

def add(sig, t0, gain=1.0):
    i = int(t0 * SR)
    j = min(N, i + len(sig))
    if i < N:
        mix[i:j] += sig[: j - i] * gain

def env(n, a=0.005, r=None):
    e = np.ones(n)
    ai = max(1, int(a * SR))
    e[:ai] = np.linspace(0, 1, ai)
    if r:
        ri = min(n, int(r * SR))
        e[-ri:] *= np.linspace(1, 0, ri)
    return e

def tone(freqs, dur, kind="sine"):
    n = int(dur * SR)
    f = np.interp(np.arange(n), np.linspace(0, n, len(freqs)), freqs) if len(freqs) > 1 else np.full(n, freqs[0])
    ph = 2 * np.pi * np.cumsum(f) / SR
    if kind == "square":
        return np.sign(np.sin(ph)) * 0.6
    return np.sin(ph)

def noise(dur, lp=0.2):
    n = int(dur * SR)
    x = rng.standard_normal(n)
    y = np.zeros(n)
    acc = 0.0
    for k in range(n):  # one-pole low-pass
        acc += lp * (x[k] - acc)
        y[k] = acc
    return y / (np.abs(y).max() + 1e-9)

def thud(t0, g=0.8):
    d = 0.45
    s = tone([110, 45], d) * np.exp(-np.linspace(0, 8, int(d * SR)))
    add(s, t0, g)
    add(noise(0.15, 0.1) * np.exp(-np.linspace(0, 10, int(0.15 * SR))), t0, g * 0.6)

def pop(t0, g=0.25):
    d = 0.08
    add(tone([700, 1500], d) * env(int(d * SR), 0.002, 0.05), t0, g)

def boing(t0, g=0.35):
    d = 0.38
    n = int(d * SR)
    f = np.linspace(180, 520, n) + 30 * np.sin(np.linspace(0, 2 * np.pi * 9, n))
    add(np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.003, 0.2), t0, g)

def tick(t0, g=0.08):
    d = 0.018
    add(tone([2400], d) * env(int(d * SR), 0.001, 0.012), t0, g)

def pluck(freq, dur=0.5, g=0.12):
    n = int(dur * SR)
    p = max(2, int(SR / freq))
    buf = rng.uniform(-1, 1, p)
    out = np.zeros(n)
    for k in range(n):
        out[k] = buf[k % p]
        buf[k % p] = 0.5 * (buf[k % p] + buf[(k + 1) % p]) * 0.996
    return out * g

# ---- music: light plucked arpeggio 4.0 -> 46.0, tense drone after ----
bpm = 112
eighth = 60 / bpm / 2
chords = [[261.6, 329.6, 392.0, 523.3], [220.0, 261.6, 329.6, 440.0], [174.6, 220.0, 261.6, 349.2], [196.0, 246.9, 293.7, 392.0]]
t = 4.0
step = 0
while t < 45.6:
    ch = chords[(step // 8) % 4]
    pattern = [0, 2, 1, 3, 2, 1, 3, 2]
    add(pluck(ch[pattern[step % 8]], 0.5, 0.1), t)
    if step % 8 == 0:
        add(pluck(ch[0] / 2, 0.9, 0.12), t)
    t += eighth
    step += 1
# intro drone
n = int(4 * SR)
add(tone([110], 4) * 0.06 * env(n, 0.5, 0.6) * (1 + 0.3 * np.sin(np.linspace(0, 2 * np.pi * 6, n))), 0.0)
# tense drone 46 -> 57
n = int(11 * SR)
dr = (tone([110], 11) + 0.6 * tone([164.8], 11) + 0.4 * tone([116.5], 11)) * env(n, 0.8, 1.0)
add(dr * (0.6 + 0.4 * np.sin(np.linspace(0, 2 * np.pi * 22, n))) * 0.05, 46.0)

# ---- sound effects ----
n = int(2.9 * SR)
add(tone([180, 720], 2.9) * env(n, 0.3, 0.4) * (0.7 + 0.3 * np.sin(np.linspace(0, 2 * np.pi * 30, n))), 1.0, 0.1)  # 위이잉
thud(5.6, 0.9)                                                                    # 쿵
for tt in [0.25, 2.0, 6.1, 10.9, 13.4, 18.2, 26.6, 35.3, 42.8, 46.0, 57.0, 57.8]:  # caption pops
    pop(tt)
for k in range(10):                                                               # scale count
    tick(10.4 + k * 0.1, 0.12)
for tt in [17.0, 18.3, 19.6, 20.9, 22.2]:                                          # 통!
    boing(tt)
n = int(1.6 * SR)
add(noise(1.6, 0.15) * np.concatenate([np.linspace(0, 1, n // 3), np.linspace(1, 0, n - n // 3)]), 24.6, 0.25)  # 슈우웅
n = int(1.9 * SR)
add((tone([2100], 1.9) + 0.4 * noise(1.9, 0.5)) * env(n, 0.05, 0.3) * (0.8 + 0.2 * np.sin(np.linspace(0, 2 * np.pi * 40, n))), 32.5, 0.07)  # 끼이익
thud(34.5, 1.0)
add(noise(0.4, 0.4) * np.exp(-np.linspace(0, 7, int(0.4 * SR))), 34.5, 0.35)       # 쾅 crash
n = int(3.5 * SR)
add(noise(3.5, 0.05) * env(n, 0.6, 0.8), 39.0, 0.18)                               # falling wind
add(tone([300, 160], 0.2) * env(int(0.2 * SR), 0.003, 0.15), 42.5, 0.3)           # 사뿐
for t0, d in [(12.5, 1.4), (44.1, 0.9), (47.0, 1.4), (51.6, 0.8), (55.2, 1.0)]:    # typing
    k = 0
    while k * 0.055 < d:
        tick(t0 + k * 0.055, 0.05)
        k += 1
add(tone([55], 0.9) * env(int(0.9 * SR), 0.01, 0.7), 46.0, 0.5)                   # 7일차 sting
t = 54.3
k = 0
while t < 57.0:                                                                    # 삐- 삐-
    add(tone([880 if k % 2 == 0 else 660], 0.22, "square") * env(int(0.22 * SR), 0.005, 0.03), t, 0.09)
    t += 0.28
    k += 1
for f, d0 in [(660, 0.0), (990, 0.18)]:                                            # end chime
    n = int(1.6 * SR)
    add(tone([f], 1.6) * np.exp(-np.linspace(0, 4, n)), 57.0 + d0, 0.22)

mix *= env(N, 0.2, 0.8)
mix = mix / (np.abs(mix).max() + 1e-9) * 0.9
pcm = (mix * 32767).astype(np.int16)
stereo = np.repeat(pcm[:, None], 2, axis=1)
here = os.path.dirname(os.path.abspath(__file__))
with wave.open(os.path.join(here, "audio.wav"), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(stereo.tobytes())
print("ok")
