import json, sys, os, numpy as np, soundfile as sf
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "shorts"))
import music as M, safemix as SM
SR = 44100
tl = json.load(open("timeline.json")); L = tl["lines"]; DUR = tl["duration"]
N = int(DUR * SR)
voice, vsr = sf.read("voice.wav"); assert vsr == SR
voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
voice = voice / (np.abs(voice).max() + 1e-9) * 0.9
rng = np.random.default_rng(3)

# ---- ep.007 v2 palette: soft piano / harp / celesta, low register, no harpsichord, no percussion ----
A2, D3, E3, F3, G3, C3, B2 = 110.0, 146.83, 164.81, 174.61, 196.0, 130.81, 123.47
MOODS = {
 'mystery':  dict(root=A2, mode='aeolian', bpm=66, prog=[0, 5, 3, 4], lead='piano', pattern='sparse', oct=1, leadGain=.5, pad=.22, warm=.5, drone=.1),
 'reveal':   dict(root=D3, mode='ionian', bpm=78, prog=[0, 4, 5, 3], lead='harp', pattern='arp', oct=0, leadGain=.45, pad=.18, warm=.6),
 'build':    dict(root=G3, mode='mixolydian', bpm=90, prog=[0, 3, 4, 0], lead='pizz', pattern='melody', oct=0, leadGain=.45, pad=.12, density=.5),
 'day1':     dict(root=F3, mode='ionian', bpm=86, prog=[0, 3, 4, 0], lead='piano', pattern='melody', oct=0, leadGain=.45, pad=.14, density=.5),
 'day2':     dict(root=E3, mode='dorian', bpm=94, prog=[0, 3, 0, 4], lead='pizz', pattern='melody', oct=0, leadGain=.45, pad=.12, density=.55),
 'day3':     dict(root=C3, mode='ionian', bpm=96, prog=[0, 5, 3, 4], lead='harp', pattern='arp', oct=1, leadGain=.4, pad=.14),
 'demon':    dict(root=B2, mode='phrygian', bpm=60, prog=[0, 1, 0, 5], lead='bell', pattern='sparse', oct=0, leadGain=.36, drone=.22, pad=.14, warm=.4),
 'cogito':   dict(root=D3, mode='lydian', bpm=56, prog=[0, 1, 4, 0], lead='celesta', pattern='swell', oct=0, leadGain=.34, pad=.3, warm=.6),
 'day5':     dict(root=G3, mode='mixolydian', bpm=90, prog=[0, 6, 3, 0], lead='flute', pattern='melody', oct=0, leadGain=.36, pad=.14, density=.4),
 'recap':    dict(root=D3, mode='ionian', bpm=100, prog=[0, 4, 5, 3], lead='harp', pattern='arp', oct=1, leadGain=.4, pad=.14),
 'francine': dict(root=A2, mode='aeolian', bpm=58, prog=[0, 3, 5, 4], lead='piano', pattern='sparse', oct=1, leadGain=.55, pad=.12, warm=.4),
 'ending':   dict(root=D3, mode='ionian', bpm=70, prog=[0, 5, 3, 4], lead='piano', pattern='arp', oct=0, leadGain=.42, pad=.24),
 'thanks':   dict(root=G3, mode='ionian', bpm=76, prog=[3, 4, 0, 0], lead='musicbox', pattern='melody', oct=0, leadGain=.36, pad=.24, density=.5),
}
DAY = {1: 'day1', 2: 'day2', 3: 'day3', 4: 'demon', 5: 'day5'}
SC = {'hook': 'mystery', 'youth': 'mystery', 'dc': 'mystery', 'reveal': 'reveal', 'title': 'reveal', 'myth': 'build',
      'zipper': 'day1', 'bat': 'day2', 'news': 'day2', 'split': 'day3', 'demon': 'demon', 'faces': 'demon', 'stat': 'demon', 'night': 'demon',
      'cogito': 'cogito', 'forest': 'day5', 'grads': 'day5', 'recap': 'recap', 'francine': 'francine', 'lamp': 'ending', 'thanks': 'thanks'}
def mood_of(l):
    if l["scene"] == "chapter": return DAY[l["args"]["n"]]
    return SC[l["scene"]]
secs = M.sections_from(L, mood_of, DUR)
for s0 in secs: print("  music %6.1f-%6.1f %s" % s0)

# countdown: the music stops for the 3 seconds
mutes = []
for l in L:
    if l["scene"] == "bat" and l["args"].get("count"): mutes.append((l["t1"] + 0.05, l["t1"] + 3.0))
music, sp = SM.build(voice, secs, DUR, MOODS, mutes=mutes, rel_db=-15.0)

# ---- a few gentle sound effects (no whoosh on every cut) ----
sfx = np.zeros(N)
def add(sig, t0, g=1.0):
    i = int(t0 * SR); j = min(N, i + len(sig))
    if 0 <= i < N: sfx[i:j] += sig[: j - i] * g
def tone(f0, f1, dur):
    n = int(dur * SR); f = np.linspace(f0, f1, n); return np.sin(2 * np.pi * np.cumsum(f) / SR)
def bell(at, f=1568, g=0.06, d=0.5):
    n = int(d * SR); add((tone(f, f, d) + 0.4 * tone(f * 2.01, f * 2.01, d)) * np.exp(-np.linspace(0, 7, n)), at, g)
def soft(at, f=880, g=0.05):
    n = int(0.12 * SR); add(tone(f, f, 0.12) * np.exp(-np.linspace(0, 9, n)), at, g)
def noise_swell(at, d=0.8, g=0.06):
    n = int(d * SR); x = rng.standard_normal(n); y = SM.movavg(x, 40); y /= np.abs(y).max() + 1e-9
    add(y * np.sin(np.linspace(0, np.pi, n)), at, g)
for idx, l in enumerate(L):
    t0, sc, a = l["t0"], l["scene"], l["args"]; D = l["t1"] - l["t0"]; L0 = t0 - 0.15
    if sc == "chapter":
        noise_swell(t0 - 1.0, 0.7, 0.05)
        for k, f in enumerate([523, 784]): bell(t0 - 0.5 + k * 0.14, f, 0.05, 0.8)
    if sc == "stat": bell(t0 + 0.9, 1047, 0.05)
    if sc == "title" and not a.get("list"): bell(L0 + 1.2, 1175, 0.05); bell(L0 + 1.35, 1568, 0.04)
    if sc == "reveal": bell(L0 + 0.9, 784, 0.05, 1.2); bell(L0 + 1.05, 1175, 0.04, 1.2)
    if sc == "bat" and a.get("count"):
        for k in range(3): soft(l["t1"] + 0.05 + k * 1.0, 1320 if k < 2 else 1760, 0.09)
    if sc == "bat" and a.get("ans"): bell(L0 + 0.3 * D, 1568, 0.05)
    if sc == "news" and a.get("pause"): soft(L0 + 0.2 * D, 520, 0.08); bell(L0 + 0.72 * D, 660, 0.05)
    if sc == "split" and a.get("room") and not a.get("intro"):
        for k in range(5): bell(l["t1"] + 0.1 + k * 0.08, 1600 + k * 140, 0.025, 0.3)
    if sc == "demon": noise_swell(L0 + 0.3 * D, 1.2, 0.04)
    if sc == "cogito" and not a.get("k"):
        for k, f in enumerate([784, 988, 1175]): bell(L0 + 0.55 * D + k * 0.22, f, 0.03, 1.2)
    if sc == "recap" and a.get("k") in (3, 5):
        starts = [0.2 + i * 1.4 for i in range(3)] if a["k"] == 3 else [0.2, 2.0]
        for k, s in enumerate(starts): soft(L0 + s, 880 + k * 110, 0.05)
    if sc == "thanks":
        for k, f in enumerate([784, 988, 1175, 1568]): bell(l["t1"] + 0.2 + k * 0.22, f, 0.04)
sfx *= (1 - 0.5 * sp)
mix = voice + music + sfx
fade = np.ones(N); fi = int(0.5 * SR); fo = int(1.5 * SR); fade[:fi] = np.linspace(0, 1, fi); fade[-fo:] = np.linspace(1, 0, fo)
mix *= fade
pk = np.abs(mix).max() + 1e-9
mix = mix / pk * 0.95
sf.write("mix.wav", np.stack([mix, mix], 1), SR)
sf.write("music_only.wav", music / pk * 0.95, SR)
rest = (music + sfx) * fade
print(json.dumps(SM.masking_report(voice, rest, L), ensure_ascii=False))
print("ok", DUR)
