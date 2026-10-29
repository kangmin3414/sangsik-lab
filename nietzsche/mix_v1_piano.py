import json, numpy as np, soundfile as sf
SR = 44100
tl = json.load(open("timeline.json")); L = tl["lines"]; DUR = tl["duration"]
N = int(DUR * SR)
voice, vsr = sf.read("voice.wav"); assert vsr == SR
voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
voice = voice / (np.abs(voice).max() + 1e-9) * 0.9
rng = np.random.default_rng(3)

def env(n, a=0.005, r=None):
    e = np.ones(n); ai = max(1, int(a * SR)); e[:ai] = np.linspace(0, 1, ai)
    if r: ri = min(n, int(r * SR)); e[-ri:] *= np.linspace(1, 0, ri)
    return e
def tone(f0, f1, dur, kind="sine"):
    n = int(dur * SR); f = np.linspace(f0, f1, n); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sign(np.sin(ph)) * 0.5 if kind == "square" else np.sin(ph)
def lp_noise(dur, a=0.1):
    n = int(dur * SR); x = rng.standard_normal(n); y = np.zeros(n); acc = 0.0
    for k in range(n): acc += a * (x[k] - acc); y[k] = acc
    return y / (np.abs(y).max() + 1e-9)
music = np.zeros(N); sfx = np.zeros(N)
def add(buf, sig, t0, g=1.0):
    i = int(t0 * SR); j = min(N, i + len(sig))
    if 0 <= i < N: buf[i:j] += sig[: j - i] * g

# ---- calm background music: soft piano-ish arpeggio + pad, 80 bpm ----
def piano(f, dur=1.6):
    n = int(dur * SR); tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(2 * np.pi * 2 * f * tt) + 0.12 * np.sin(2 * np.pi * 3 * f * tt)
    return s * np.exp(-tt * 3.2) * env(n, 0.004)
prog = [[220.0, 261.6, 329.6, 392.0], [174.6, 220.0, 261.6, 349.2], [261.6, 329.6, 392.0, 493.9], [196.0, 246.9, 293.7, 392.0]]
beat = 60 / 84 / 2
t = 0.0; step = 0
while t < DUR - 1.5:
    ch = prog[(step // 8) % 4]
    add(music, piano(ch[[0, 2, 1, 3, 2, 1, 3, 2][step % 8]]), t, 0.16)
    if step % 8 == 0:
        add(music, piano(ch[0] / 2, 3.0), t, 0.2)
        n = int(beat * 8 * SR); tt = np.arange(n) / SR
        pad = sum(np.sin(2 * np.pi * f / 2 * tt) for f in ch[:3]) / 3
        add(music, pad * env(n, 0.6, 0.6), t, 0.05)
    t += beat; step += 1

# ---- sound effects tied to the timeline ----
for idx, l in enumerate(L):
    t0, sc = l["t0"], l["scene"]
    prev = L[idx - 1]["scene"] if idx else None
    if sc == "chapter":
        n = int(0.9 * SR); add(sfx, lp_noise(0.9, 0.12) * np.sin(np.linspace(0, np.pi, n)), t0 - 0.35, 0.22)
        for k, f in enumerate([660, 990]): add(sfx, tone(f, f, 1.2) * np.exp(-np.linspace(0, 5, int(1.2 * SR))), t0 + 0.1 + k * 0.12, 0.12)
    if sc in ("stat", "stat2"):
        add(sfx, tone(500, 1400, 0.09) * env(int(0.09 * SR), 0.002, 0.06), t0 - 0.1, 0.22)
        add(sfx, tone(1200, 1200, 0.6) * np.exp(-np.linspace(0, 6, int(0.6 * SR))), t0 + 1.1, 0.08)
    if sc == "city":
        for dt in (0.15, 1.8):
            add(sfx, (tone(392, 392, 0.35, "square") + tone(494, 494, 0.35, "square")) * env(int(0.35 * SR), 0.01, 0.05), t0 + dt, 0.07)
        for dt in (0.7, 1.25):
            add(sfx, tone(1318, 1318, 0.25) * np.exp(-np.linspace(0, 8, int(0.25 * SR))), t0 + dt, 0.12)
    if sc == "idea":
        for k in range(1, 7):
            f = [880, 988, 1175, 1319, 1480, 1760][k - 1]
            add(sfx, tone(f, f, 0.3) * np.exp(-np.linspace(0, 7, int(0.3 * SR))), t0 - 0.15 + k / 1.6, 0.07)

    L0 = t0 - 0.15
    args = l["args"]
    def ding(at, f=1568, g=0.10):
        add(sfx, (tone(f, f, 0.35) + 0.5 * tone(f * 1.5, f * 1.5, 0.35)) * np.exp(-np.linspace(0, 7, int(0.35 * SR))), at, g)
    def plink(at, f=900, g=0.08):
        add(sfx, tone(f, f * 1.3, 0.07) * env(int(0.07 * SR), 0.002, 0.05), at, g)
    if sc == "cafe" and args.get("sweets"):
        ding(L0 + 0.3, 1319, 0.08); ding(L0 + 0.7, 1568, 0.08); ding(L0 + 1.2, 2093, 0.1)
    if sc == "cubes":
        if args.get("k") == 1:
            for i in range(6): plink(L0 + 0.3 + i * 0.25, 800 + i * 60)
        else:
            add(sfx, lp_noise(0.25, 0.3) * np.exp(-np.linspace(0, 6, int(0.25 * SR))), L0 + 0.2, 0.2)
            for i in range(10): plink(L0 + 0.6 + i * 0.18, 700 + i * 50, 0.07)
    if sc == "sugarbox":
        add(sfx, lp_noise(0.18, 0.25) * np.exp(-np.linspace(0, 9, int(0.18 * SR))), L0 + 1.3, 0.35)
        add(sfx, lp_noise(0.22, 0.2) * np.exp(-np.linspace(0, 8, int(0.22 * SR))), L0 + 1.9, 0.4)
        add(sfx, tone(2400, 2400, 0.05) * env(int(0.05 * SR), 0.001, 0.04), L0 + 2.05, 0.12)
        ding(L0 + 2.35, 1319, 0.08)
    if sc == "coaster" and not args.get("flat"):
        add(sfx, tone(300, 900, 0.9) * env(int(0.9 * SR), 0.05, 0.3), L0 + 1.0, 0.05)
        add(sfx, tone(900, 200, 1.0) * env(int(1.0 * SR), 0.05, 0.4), L0 + 2.2, 0.05)
    if sc == "kids":
        for k in range(9): add(sfx, tone(1000 + k * 40, 1000 + k * 40, 0.05) * np.exp(-np.linspace(0, 8, int(0.05 * SR))), L0 + 2.2 + (k + 1) / 2.4, 0.06)
    if sc == "taste" and args.get("sweet"):
        for k, f in enumerate([1047, 1319, 1568, 2093]): ding(L0 + 0.4 + k * 0.15, f, 0.06)
    D = l["t1"] - l["t0"]
    if sc == "title" and not args.get("list"):
        add(sfx, tone(400, 1200, 0.5) * env(int(0.5 * SR), 0.02, 0.2), L0 + 1.0, 0.05)
        add(sfx, lp_noise(0.12, 0.35) * np.exp(-np.linspace(0, 9, int(0.12 * SR))), L0 + 1.55, 0.35); ding(L0 + 1.6, 1568, 0.08)
    if sc == "asch":
        if args.get("ally"):
            ding(L0 + 0.15 * D, 1319, 0.08); ding(L0 + 0.35 * D, 1760, 0.09)
        else:
            for k in range(5): plink(L0 + (0.48 + 0.07 * k) * D, 700, 0.07)
    if sc == "demon" and not args.get("choice"):
        add(sfx, tone(140, 60, 1.2) * env(int(1.2 * SR), 0.05, 0.6), L0 + 0.32 * D, 0.10)
        add(sfx, lp_noise(0.8, 0.05) * np.sin(np.linspace(0, np.pi, int(0.8 * SR))), L0 + 0.32 * D, 0.25)
    if sc == "loop" and args.get("change"):
        ding(L0 + 0.5 * D, 1319, 0.08); ding(L0 + 0.5 * D + 0.15, 1760, 0.08)
    if sc == "storm" and args.get("books"):
        for k in range(6): plink(L0 + (0.45 + 0.07 * k) * D, 600 + k * 70, 0.07)
    if sc == "amor" and args.get("rain"):
        n = int(1.6 * SR); add(sfx, (lp_noise(1.6, 0.02) + 0.3 * tone(70, 90, 1.6)) * np.sin(np.linspace(0, np.pi, n)), L0 + 0.5 * D, 0.18)
    if sc == "become" and args.get("off"):
        add(sfx, tone(500, 1500, 0.2) * env(int(0.2 * SR), 0.002, 0.1), L0 + 0.12 * D, 0.08)
        for k, f in enumerate([1047, 1319, 1568]): ding(L0 + 0.12 * D + 0.3 + k * 0.14, f, 0.06)
    if sc == "thanks":
        for k, f in enumerate([784, 988, 1175, 1568]): ding(L0 + 0.2 + k * 0.22, f, 0.07)
    if sc != prev and sc not in ("chapter",) and idx:
        n = int(0.35 * SR); add(sfx, lp_noise(0.35, 0.3) * np.sin(np.linspace(0, np.pi, n)), t0 - 0.25, 0.06)

# ---- duck music under the narration ----
venv = np.abs(voice)
def movavg(x, k):
    c = np.cumsum(np.insert(x, 0, 0.0)); y = (c[k:] - c[:-k]) / k
    return np.pad(y, (k // 2, len(x) - len(y) - k // 2), mode="edge")
venv = movavg(venv, int(0.25 * SR))
duck = np.where(venv > 0.02, 0.45, 1.0)
duck = movavg(duck, int(0.3 * SR))
mix = voice * 1.0 + music * duck + sfx
fade = np.ones(N); fi = int(0.5 * SR); fo = int(1.5 * SR); fade[:fi] = np.linspace(0, 1, fi); fade[-fo:] = np.linspace(1, 0, fo)
mix *= fade
mix = mix / (np.abs(mix).max() + 1e-9) * 0.95
sf.write("mix.wav", np.stack([mix, mix], 1), SR)
print("ok", DUR)
