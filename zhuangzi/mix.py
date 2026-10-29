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

# ---- section-aware score (ep.008 palette: pentatonic zheng, dizi, woodblock - a different piece for every part) ----
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "shorts"))
import music as M
Dn = 146.83; G3 = 196.0; A3 = 220.0; E3 = 164.81; C4 = 261.63
MOODS = {
 'tense':   dict(root=E3, mode='penta_min', bpm=108, prog=[0, 3, 1, 4], lead='pizz', pattern='pulse', oct=0, leadGain=.42, perc='tick'),
 'intro':   dict(root=Dn, mode='penta', bpm=70, prog=[0, 3, 1, 0], lead='zheng', pattern='arp', oct=1, leadGain=.5, pad=.16, drone=.1),
 'epic':    dict(root=Dn, mode='penta', bpm=76, prog=[0, 3, 4, 1], lead='zheng', pattern='arp', oct=1, leadGain=.5, pad=.22, drone=.12, perc='drum', gliss=.22, glissInst='zheng'),
 'playful': dict(root=G3, mode='penta', bpm=112, prog=[0, 3, 1, 4], lead='marimba', pattern='melody', oct=1, leadGain=.45, perc='wood', density=.7),
 'tree':    dict(root=Dn, mode='penta', bpm=66, prog=[0, 3, 1, 0], lead='dizi', pattern='melody', oct=1, leadGain=.34, pad=.16, density=.45),
 'gourd':   dict(root=G3, mode='penta', bpm=98, prog=[0, 2, 3, 1], lead='zheng', pattern='melody', oct=1, leadGain=.45, perc='wood', density=.6),
 'sit':     dict(root=A3, mode='penta_min', bpm=52, prog=[0, 3, 0, 2], lead='bell', pattern='sparse', oct=1, leadGain=.3, pad=.26, drone=.18, warm=.5),
 'cook':    dict(root=C4, mode='penta', bpm=104, prog=[0, 3, 4, 2], lead='zheng', pattern='arp', oct=0, leadGain=.45, perc='wooddrum'),
 'turtle':  dict(root=Dn, mode='penta_min', bpm=72, prog=[0, 2, 3, 0], lead='dizi', pattern='melody', oct=1, leadGain=.34, pad=.14, perc='wood', density=.5),
 'result':  dict(root=G3, mode='penta', bpm=108, prog=[0, 3, 4, 1], lead='marimba', pattern='arp', oct=1, leadGain=.42, perc='wooddrum'),
 'dream':   dict(root=Dn, mode='penta', bpm=60, prog=[0, 1, 3, 0], lead='celesta', pattern='swell', oct=1, leadGain=.3, pad=.3, warm=.6, gliss=.15, glissInst='zheng'),
 'ending':  dict(root=G3, mode='penta', bpm=70, prog=[0, 3, 4, 0], lead='zheng', pattern='arp', oct=1, leadGain=.45, pad=.24),
 'thanks':  dict(root=G3, mode='penta', bpm=76, prog=[3, 4, 0, 0], lead='kalimba', pattern='melody', oct=1, leadGain=.4, pad=.26, density=.6),
 'leisure': dict(root=174.61, mode='penta', bpm=90, prog=[0, 3, 1, 4], lead='marimba', pattern='melody', oct=1, leadGain=.42, perc='wood', density=.6),
 'candle':  dict(root=A3, mode='penta_min', bpm=96, prog=[0, 2, 3, 1], lead='pizz', pattern='pulse', oct=0, leadGain=.4, perc='tick', pad=.08),
 'shock':   dict(root=E3, mode='penta_min', bpm=100, prog=[0, 1, 3, 0], lead='pizz', pattern='pulse', oct=0, leadGain=.4, drone=.16, perc='tick'),
 'idea':    dict(root=Dn, mode='penta', bpm=84, prog=[0, 3, 4, 1], lead='celesta', pattern='arp', oct=1, leadGain=.36, pad=.18),
 'hours':   dict(root=C4, mode='penta_min', bpm=92, prog=[0, 3, 2, 4], lead='marimba', pattern='pulse', oct=0, leadGain=.4, perc='drum'),
 'goals':   dict(root=G3, mode='penta', bpm=96, prog=[0, 3, 4, 1], lead='kalimba', pattern='melody', oct=1, leadGain=.42, perc='wood', density=.6),
}
CHM = {1: 'tree', 2: 'gourd', 3: 'sit', 4: 'cook', 5: 'turtle'}
cur = {}; c = 1
for l in L:
    if l["scene"] == "chapter": c = l["args"]["n"]
    cur[l["i"]] = c
def mood_of(l):
    sc = l["scene"]
    if sc == "hook": return "tense"
    if sc == "zh": return "intro"
    if sc == "title": return "epic"
    if sc == "myth": return "playful"
    if sc == "recap": return "result"
    if sc == "butterfly": return "dream"
    if sc == "meadow": return "ending"
    if sc == "thanks": return "thanks"
    MAP = {'leisure': 'leisure', 'candle': 'candle', 'shock': 'shock', 'incub': 'idea', 'hours': 'hours', 'goals': 'goals'}
    if sc in MAP: return MAP[sc]
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
    if sc == "hook":
        for f in (0.02, 0.18, 0.42, 0.55): ding(L0 + f * D, 1760, 0.06)
    if sc == "tree" and not args.get("k"): pass
    if sc == "tree" and args.get("k"): add(sfx, lp_noise(1.6, 0.02) * np.sin(np.linspace(0, np.pi, int(1.6 * SR))), L0 + 0.3, 0.12)
    if sc == "gourd" and not args: 
        for k in range(5): plink(L0 + 0.4 * D + k * 0.2, 500 + k * 120, 0.07)
    if sc == "gourd" and args.get("smash"):
        add(sfx, lp_noise(0.3, 0.5) * np.exp(-np.linspace(0, 6, int(0.3 * SR))), L0 + 0.78 * D, 0.4)
    if sc == "gourd" and args.get("boat"): add(sfx, lp_noise(2.0, 0.03) * np.sin(np.linspace(0, np.pi, int(2.0 * SR))), L0 + 0.3, 0.12)
    if sc == "candle" and args.get("ans"):
        for k in range(6): plink(L0 + 0.12 * D + k * 0.06, 1500, 0.05)
        add(sfx, lp_noise(0.4, 0.4) * np.exp(-np.linspace(0, 5, int(0.4 * SR))), L0 + 0.62 * D, 0.15); ding(L0 + 0.64 * D, 1319, 0.06)
    if sc == "shock" and args.get("btn"):
        add(sfx, tone(3000, 2600, 0.15, "square") * env(int(0.15 * SR), 0.002, 0.05), L0 + 0.55 * D, 0.03)
    if sc == "shock" and args.get("many"):
        for k in range(8): add(sfx, tone(2800, 2600, 0.06, "square") * env(int(0.06 * SR), 0.002, 0.03), L0 + 0.1 * D + k * 0.33, 0.025)
    if sc == "incub" and args.get("res"): ding(L0 + 0.7 * D, 1568, 0.08)
    if sc == "cook" and not args.get("k"):
        for k in range(6): add(sfx, tone(3200, 3000, 0.08) * env(int(0.08 * SR), 0.002, 0.06), L0 + 0.5 + k * 0.7, 0.03)
    if sc == "cook" and args.get("k") == 2:
        for k, f in enumerate([2093, 2637, 3136]): ding(L0 + 0.15 + k * 0.1, f, 0.04)
    if sc == "turtle" and args.get("k") == 3: whoosh(L0 + 0.45 * D, 0.4, 0.05)
    if sc == "butterfly":
        for k in range(4): ding(L0 + 0.3 + k * 0.5, [1568, 1760, 2093, 2349][k], 0.03)
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
