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

# ---- section-aware score (ep.007 palette: baroque harpsichord, a different piece for every part) ----
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "shorts"))
import music as M
Dm = 146.83
MOODS = {
 'tense':   dict(root=110.0, mode='harmonic', bpm=104, prog=[0, 3, 4, 0], lead='harpsi', pattern='pulse', oct=0, leadGain=.42, drone=.16, perc='tick'),
 'intro':   dict(root=Dm, mode='aeolian', bpm=78, prog=[0, 3, 6, 4], lead='harpsi', pattern='arp', oct=1, leadGain=.45, pad=.14),
 'epic':    dict(root=Dm, mode='dorian', bpm=74, prog=[0, 6, 3, 4], lead='harpsi', pattern='arp', oct=1, leadGain=.45, pad=.22, drone=.12, perc='drum', gliss=.2, glissInst='harpsi'),
 'playful': dict(root=196.0, mode='ionian', bpm=114, prog=[0, 4, 5, 3], lead='pizz', pattern='melody', oct=1, leadGain=.45, perc='shaker', density=.7),
 'obvious': dict(root=174.61, mode='ionian', bpm=92, prog=[0, 3, 4, 0], lead='harpsi', pattern='melody', oct=1, leadGain=.4, pad=.1, density=.6),
 'fast':    dict(root=164.81, mode='aeolian', bpm=122, prog=[0, 5, 3, 4], lead='pizz', pattern='pulse', oct=0, leadGain=.42, perc='tick'),
 'split':   dict(root=261.63, mode='ionian', bpm=100, prog=[0, 5, 3, 4], lead='marimba', pattern='arp', oct=1, leadGain=.42, perc='shaker'),
 'demon':   dict(root=123.47, mode='phrygian', bpm=64, prog=[0, 1, 0, 5], lead='bell', pattern='sparse', oct=1, leadGain=.34, drone=.24, pad=.12, warm=.4),
 'cogito':  dict(root=Dm, mode='lydian', bpm=58, prog=[0, 1, 4, 0], lead='celesta', pattern='swell', oct=1, leadGain=.32, pad=.3, warm=.6),
 'forest':  dict(root=196.0, mode='mixolydian', bpm=96, prog=[0, 6, 3, 0], lead='flute', pattern='melody', oct=1, leadGain=.34, pad=.12, perc='shaker', density=.55),
 'sweden':  dict(root=220.0, mode='aeolian', bpm=84, prog=[0, 5, 3, 4], lead='musicbox', pattern='waltz', meter=3, oct=1, leadGain=.36, pad=.12),
 'result':  dict(root=Dm, mode='ionian', bpm=108, prog=[0, 4, 5, 3], lead='harpsi', pattern='arp', oct=1, leadGain=.4, perc='drumshaker'),
 'ending':  dict(root=Dm, mode='ionian', bpm=72, prog=[0, 5, 3, 4], lead='harp', pattern='arp', oct=1, leadGain=.45, pad=.24, gliss=.18),
 'thanks':  dict(root=196.0, mode='ionian', bpm=76, prog=[3, 4, 0, 0], lead='kalimba', pattern='melody', oct=1, leadGain=.4, pad=.26, density=.6),
 'news':    dict(root=Dm, mode='dorian', bpm=96, prog=[0, 3, 0, 4], lead='harpsi', pattern='pulse', oct=0, leadGain=.36, pad=.1, perc='tick'),
 'faces':   dict(root=164.81, mode='dorian', bpm=92, prog=[0, 3, 6, 4], lead='marimba', pattern='melody', oct=1, leadGain=.4, perc='tick', density=.55),
 'grads':   dict(root=261.63, mode='ionian', bpm=104, prog=[0, 3, 4, 4], lead='pizz', pattern='melody', oct=1, leadGain=.42, perc='shaker', density=.65),
}
CHM = {1: 'obvious', 2: 'fast', 3: 'split', 4: 'demon', 5: 'forest'}
cur = {}; c = 1
for l in L:
    if l["scene"] == "chapter": c = l["args"]["n"]
    cur[l["i"]] = c
def mood_of(l):
    sc = l["scene"]
    if sc == "hook": return "tense"
    if sc == "dc": return "intro"
    if sc == "title": return "epic"
    if sc == "myth": return "playful"
    if sc == "cogito": return "cogito"
    if sc == "sweden": return "sweden"
    if sc == "recap": return "result"
    if sc == "lamp": return "ending"
    if sc == "thanks": return "thanks"
    if sc in ("news", "faces", "grads"): return sc
    if sc == "stat": return prevm[l["i"]]
    return CHM[cur[l["i"]]]
prevm = {}; _last = 'tense'
for l in L:
    if l['scene'] != 'stat': _last = mood_of(l)
    prevm[l['i']] = _last
secs = M.sections_from(L, mood_of, DUR)
for s0 in secs: print("  music %6.1f-%6.1f %s" % s0)
music = M.score(secs, DUR, MOODS)
vr = np.sqrt(np.mean(voice[np.abs(voice) > 0.02] ** 2)); mr = np.sqrt(np.mean(music ** 2))
music *= vr * 10 ** (-13 / 20) / (mr + 1e-9)
sf.write("music_only.wav", music, SR)
# ---- sound effects tied to the timeline ----
def ding(at, f=1568, g=0.10):
    add(sfx, (tone(f, f, 0.35) + 0.5 * tone(f * 1.5, f * 1.5, 0.35)) * np.exp(-np.linspace(0, 7, int(0.35 * SR))), at, g)
def plink(at, f=900, g=0.08):
    add(sfx, tone(f, f * 1.3, 0.07) * env(int(0.07 * SR), 0.002, 0.05), at, g)
def buzz(at, g=0.06):
    add(sfx, tone(140, 120, 0.35, "square") * env(int(0.35 * SR), 0.005, 0.08), at, g)
def whoosh(at, d=0.35, g=0.06):
    n = int(d * SR); add(sfx, lp_noise(d, 0.3) * np.sin(np.linspace(0, np.pi, n)), at, g)
def chirp(at, g=0.05):
    for k in range(3): add(sfx, tone(2600, 3400, 0.06) * env(int(0.06 * SR), 0.003, 0.03), at + k * 0.09, g)
for idx, l in enumerate(L):
    t0, sc = l["t0"], l["scene"]; args = l["args"]; D = l["t1"] - l["t0"]; L0 = t0 - 0.15
    prev = L[idx - 1]["scene"] if idx else None
    if sc == "chapter":
        n = int(0.9 * SR); add(sfx, lp_noise(0.9, 0.12) * np.sin(np.linspace(0, np.pi, n)), t0 - 0.35, 0.22)
        for k, f in enumerate([660, 990]): add(sfx, tone(f, f, 1.2) * np.exp(-np.linspace(0, 5, int(1.2 * SR))), t0 + 0.1 + k * 0.12, 0.12)
    if sc == "stat":
        add(sfx, tone(500, 1400, 0.09) * env(int(0.09 * SR), 0.002, 0.06), t0 - 0.1, 0.22)
        add(sfx, tone(1200, 1200, 0.6) * np.exp(-np.linspace(0, 6, int(0.6 * SR))), t0 + 1.1, 0.08)
    if sc == "title" and not args.get("list"):
        add(sfx, tone(400, 1200, 0.5) * env(int(0.5 * SR), 0.02, 0.2), L0 + 1.0, 0.05)
        add(sfx, lp_noise(0.12, 0.35) * np.exp(-np.linspace(0, 9, int(0.12 * SR))), L0 + 1.55, 0.35); ding(L0 + 1.6, 1568, 0.08)
    if sc == "title" and args.get("list"):
        for k in range(5): plink(L0 + 0.2 + k * 0.4, 800 + k * 90, 0.07)
    if sc == "recap":
        n0 = {0: 0, 3: 3, 5: 2}.get(args.get("k", 0), 0)
        for k in range(n0): plink(L0 + (k * 1.3 if args.get("k") == 3 else k * 1.6), 900 + k * 80, 0.07)
    if sc == "thanks":
        for k, f in enumerate([784, 988, 1175, 1568]): ding(L0 + 0.2 + k * 0.22, f, 0.07)
    if sc != prev and sc not in ("chapter",) and idx:
        whoosh(t0 - 0.25)
    if sc == "hook" and not args:
        for f in (0.04, 0.3, 0.55): ding(L0 + f * D, 1760, 0.07)
        for k in range(3): plink(L0 + 0.78 * D + k * 0.15, 600, 0.09)
    if sc == "dc" and args.get("k") == 1: plink(L0 + 0.5 * D, 1400, 0.08)
    if sc == "dc" and args.get("k") == 3: ding(L0 + 0.3 * D, 1319, 0.08)
    if sc == "zipper" and args.get("explain"): buzz(L0 + 0.65 * D, 0.05)
    if sc == "zipper" and args.get("zero"):
        for k in range(4): add(sfx, lp_noise(0.06, 0.6) * np.exp(-np.linspace(0, 8, int(0.06 * SR))), L0 + 0.62 * D + k * 0.12, 0.12)
    if sc == "bat" and args.get("q"): ding(L0 + 0.86 * D, 1760, 0.07)
    if sc == "bat" and args.get("ans"):
        buzz(L0 + 0.18 * D, 0.06); ding(L0 + 0.3 * D, 1568, 0.09); ding(L0 + 0.3 * D + 0.12, 2093, 0.08)
    if sc == "news" and args.get("pause"):
        add(sfx, tone(1800, 700, 0.4) * env(int(0.4 * SR), 0.01, 0.2), L0 + 0.45 * D, 0.05)
    if sc == "news" and not args.get("pause"):
        for k in range(4): plink(L0 + 0.45 * D + k * 0.25, 1200, 0.06)
    if sc == "split" and not args:
        add(sfx, lp_noise(0.25, 0.4) * np.exp(-np.linspace(0, 6, int(0.25 * SR))), L0 + 0.4 * D, 0.3)
    if sc == "split" and args.get("room"):
        for k in range(6): ding(L0 + 0.9 * D + k * 0.08, 1800 + k * 120, 0.03)
    if sc == "demon" and not args.get("dream"):
        add(sfx, tone(110, 55, 1.4) * env(int(1.4 * SR), 0.1, 0.6), L0 + 0.3 * D, 0.09)
    if sc == "faces" and not args:
        for k in range(6): add(sfx, lp_noise(0.08, 0.5) * np.exp(-np.linspace(0, 8, int(0.08 * SR))), L0 + 0.75 * D + k * 0.05, 0.15)
    if sc == "cogito" and not args.get("k"):
        for k, f in enumerate([1047, 1319, 1568, 2093]): ding(L0 + 0.45 * D + k * 0.2, f, 0.04)
    if sc == "forest" and args.get("out"): chirp(L0 + 0.3 * D); chirp(L0 + 0.7 * D)
    if sc == "grads" and not args.get("res") and not args.get("menu"):
        for k in range(8): plink(L0 + 0.2 * D + k * 0.35, 700, 0.05)
    if sc == "grads" and args.get("menu"): ding(L0 + 0.55 * D, 1568, 0.08)
    if sc == "sweden" and args.get("queen"):
        n = int(2.5 * SR); add(sfx, lp_noise(2.5, 0.02) * np.sin(np.linspace(0, np.pi, n)), L0 + 0.2, 0.2)
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
