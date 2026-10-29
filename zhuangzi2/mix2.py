import json, sys, os, numpy as np, soundfile as sf
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "shorts"))
import music as M, safemix as SM
SR = 44100
tl = json.load(open("timeline.json")); L = tl["lines"]; DUR = tl["duration"]
N = int(DUR * SR)
voice, vsr = sf.read("voice.wav"); assert vsr == SR
voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
voice = voice / (np.abs(voice).max() + 1e-9) * 0.9
rng = np.random.default_rng(8)

# ---- ep.008 v2 palette: soft low qin pluck, harp, flute only in the gaps, no woodblock, no bends ----
D3, E3, G3, A2, C3, F3, B2 = 146.83, 164.81, 196.0, 110.0, 130.81, 174.61, 123.47
MOODS = {
 'busy':     dict(root=E3, mode='penta_min', bpm=96, prog=[0, 3, 1, 4], lead='pizz', pattern='melody', oct=0, leadGain=.42, pad=.12, density=.55),
 'ancient':  dict(root=D3, mode='penta', bpm=64, prog=[0, 3, 2, 0], lead='qin', pattern='sparse', oct=1, leadGain=.5, pad=.2, warm=.5, drone=.1),
 'palace':   dict(root=A2, mode='penta', bpm=70, prog=[0, 2, 3, 0], lead='qin', pattern='arp', oct=1, leadGain=.42, pad=.16),
 'friends':  dict(root=G3, mode='penta', bpm=88, prog=[0, 3, 4, 0], lead='harp', pattern='melody', oct=0, leadGain=.42, pad=.14, density=.5),
 'title':    dict(root=D3, mode='penta', bpm=80, prog=[0, 4, 3, 2], lead='harp', pattern='arp', oct=0, leadGain=.42, pad=.18),
 'tree':     dict(root=C3, mode='penta', bpm=72, prog=[0, 3, 4, 0], lead='flute', pattern='melody', oct=0, leadGain=.36, pad=.18, density=.4),
 'gourd':    dict(root=F3, mode='penta', bpm=92, prog=[0, 2, 3, 4], lead='qin', pattern='melody', oct=0, leadGain=.42, pad=.12, density=.55),
 'still':    dict(root=D3, mode='lydian', bpm=54, prog=[0, 1, 4, 0], lead='celesta', pattern='swell', oct=0, leadGain=.32, pad=.3, warm=.6),
 'flow':     dict(root=E3, mode='penta', bpm=84, prog=[0, 3, 2, 4], lead='harp', pattern='arp', oct=0, leadGain=.4, pad=.14),
 'turtle':   dict(root=G3, mode='penta', bpm=76, prog=[0, 4, 3, 0], lead='qin', pattern='melody', oct=0, leadGain=.42, pad=.16, density=.45),
 'recap':    dict(root=D3, mode='penta', bpm=96, prog=[0, 3, 4, 2], lead='harp', pattern='arp', oct=1, leadGain=.38, pad=.14),
 'bridge':   dict(root=G3, mode='penta', bpm=70, prog=[0, 2, 3, 0], lead='flute', pattern='melody', oct=0, leadGain=.36, pad=.18, density=.4),
 'grief':    dict(root=A2, mode='aeolian', bpm=56, prog=[0, 3, 5, 4], lead='piano', pattern='sparse', oct=1, leadGain=.5, pad=.14, warm=.4),
 'dream':    dict(root=D3, mode='lydian', bpm=60, prog=[0, 4, 1, 0], lead='celesta', pattern='swell', oct=0, leadGain=.34, pad=.28, warm=.6),
 'ending':   dict(root=G3, mode='ionian', bpm=70, prog=[0, 5, 3, 4], lead='harp', pattern='arp', oct=0, leadGain=.42, pad=.24),
 'thanks':   dict(root=G3, mode='penta', bpm=76, prog=[3, 4, 0, 0], lead='musicbox', pattern='melody', oct=0, leadGain=.36, pad=.24, density=.5),
}
DAY = {1: 'tree', 2: 'gourd', 3: 'still', 4: 'flow', 5: 'turtle'}
SC = {'hook': 'busy', 'plan': 'busy', 'zh': 'ancient', 'king': 'palace', 'hz': 'friends', 'title': 'title', 'myth': 'title',
      'tree': 'tree', 'park': 'tree', 'leisure': 'tree', 'gourd': 'gourd', 'reuse': 'gourd', 'sit': 'still', 'shock': 'still', 'stat': 'still',
      'timer': 'still', 'incub': 'still', 'cook': 'flow', 'sleep': 'flow', 'hours': 'flow', 'turtle': 'turtle', 'useless': 'turtle',
      'recap': 'recap', 'bridge': 'bridge', 'grave': 'grief', 'axe': 'grief', 'butterfly': 'dream', 'meadow': 'ending', 'thanks': 'thanks'}
def mood_of(l):
    if l["scene"] == "chapter": return DAY[l["args"]["n"]]
    if l["scene"] == "grave" and l["args"].get("k") == 3: return 'bridge'
    return SC[l["scene"]]
secs = M.sections_from(L, mood_of, DUR)
for s0 in secs: print("  music %6.1f-%6.1f %s" % s0)
music, sp = SM.build(voice, secs, DUR, MOODS, rel_db=-15.0)

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
        for k, f in enumerate([587, 880]): bell(t0 - 0.5 + k * 0.14, f, 0.05, 0.8)
    if sc == "stat": bell(t0 - 0.3, 1047, 0.05)
    if sc == "title" and not a.get("list"): bell(L0 + 1.2, 1175, 0.05); bell(L0 + 1.35, 1568, 0.04)
    if sc == "gourd" and a.get("smash"): noise_swell(l["t1"] - 0.2, 0.4, 0.08)
    if sc == "shock" and a.get("btn"): soft(L0 + 0.62 * D, 2400, 0.05)
    if sc == "reuse" and not a.get("k"): bell(l["t1"] + 0.1, 1319, 0.04)
    if sc == "recap" and a.get("k") in (3, 5):
        starts = [0.2 + i * 1.3 for i in range(3)] if a["k"] == 3 else [0.2, 2.0]
        for k, s in enumerate(starts): soft(L0 + s, 880 + k * 110, 0.025)
    if sc == "axe" and not a.get("k"): noise_swell(L0 + 0.58 * D, 0.5, 0.07)
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
print(json.dumps(SM.masking_report(voice, (music + sfx) * fade, L), ensure_ascii=False))
print("ok", DUR)
