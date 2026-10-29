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

# ---- section-aware score: every part of the story gets its own music ----
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "shorts"))
import music as M
SEED = 37
MOODS = {
 'cafe':   dict(root=174.61, mode='mixolydian', bpm=92, prog=[0, 3, 6, 4], lead='piano', pattern='arp', oct=1, leadGain=.42, pad=.12, perc='shaker'),
 'title':  dict(root=196.0, mode='ionian', bpm=88, prog=[0, 3, 4, 0], lead='bell', pattern='melody', oct=1, leadGain=.36, pad=.16, density=.5),
 'crave':  dict(root=110.0, mode='aeolian', bpm=108, prog=[0, 5, 2, 6], lead='pizz', pattern='pulse', oct=0, leadGain=.42, drone=.16, perc='tick'),
 'crash':  dict(root=164.81, mode='dorian', bpm=100, prog=[0, 3, 6, 4], lead='marimba', pattern='arp', oct=1, leadGain=.4, perc='shaker'),
 'blood':  dict(root=146.83, mode='aeolian', bpm=64, prog=[0, 5, 3, 4], lead='piano', pattern='sparse', oct=1, leadGain=.5, drone=.2, pad=.12, warm=.4),
 'liver':  dict(root=130.81, mode='ionian', bpm=90, prog=[0, 4, 5, 3], lead='kalimba', pattern='melody', oct=1, leadGain=.4, pad=.14, density=.55),
 'taste':  dict(root=220.0, mode='ionian', bpm=84, prog=[0, 5, 3, 4], lead='musicbox', pattern='melody', oct=1, leadGain=.36, pad=.12, density=.55),
 'recap':  dict(root=196.0, mode='ionian', bpm=108, prog=[0, 4, 5, 3], lead='marimba', pattern='arp', oct=1, leadGain=.42, perc='drumshaker'),
 'ending': dict(root=116.54, mode='ionian', bpm=72, prog=[0, 5, 3, 4], lead='harp', pattern='arp', oct=1, leadGain=.44, pad=.26),
 'thanks': dict(root=116.54, mode='ionian', bpm=72, prog=[3, 4, 0, 0], lead='bell', pattern='melody', oct=2, leadGain=.32, pad=.26, density=.5),
}
CH = {1: 'crave', 2: 'crash', 3: 'blood', 4: 'liver', 5: 'taste'}
def mood_of(l):
    sc = l["scene"]
    if sc == "title": return "title"
    if sc == "recap": return "recap"
    if sc in ("comfort", "moments", "tea"): return "ending"
    if sc == "thanks": return "thanks"
    if cur_ch[l["i"]] == 0: return "cafe"
    return CH[cur_ch[l["i"]]]
cur_ch = {}; cc = 0
for l in L:
    if l["scene"] == "chapter": cc = l["args"]["n"]
    cur_ch[l["i"]] = cc
secs = M.sections_from(L, mood_of, DUR)
for s0 in secs: print("  music %6.1f-%6.1f %s" % s0)
music = M.score(secs, DUR, MOODS, seed=SEED)
vr = np.sqrt(np.mean(voice[np.abs(voice) > 0.02] ** 2)); mr = np.sqrt(np.mean(music ** 2))
music *= vr * 10 ** (-13 / 20) / (mr + 1e-9)
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
