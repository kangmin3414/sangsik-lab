"""Section-aware procedural score.

Each section gets its own mood (instrument, mode, tempo, pattern), and sections
cross-fade into each other. Episodes pick their own palette so no two videos share
the same background music.
"""
import numpy as np
from scipy.signal import oaconvolve

SR = 44100
MODES = {
    'ionian': [0, 2, 4, 5, 7, 9, 11], 'dorian': [0, 2, 3, 5, 7, 9, 10], 'aeolian': [0, 2, 3, 5, 7, 8, 10],
    'lydian': [0, 2, 4, 6, 7, 9, 11], 'mixolydian': [0, 2, 4, 5, 7, 9, 10], 'phrygian': [0, 1, 3, 5, 7, 8, 10],
    'penta': [0, 2, 4, 7, 9], 'penta_min': [0, 3, 5, 7, 10], 'harmonic': [0, 2, 3, 5, 7, 8, 11],
}

def _env(n, a, r=None):
    e = np.ones(n); ai = max(1, int(a * SR)); e[:min(n, ai)] = np.linspace(0, 1, min(n, ai))
    if r:
        ri = min(n, int(r * SR)); e[-ri:] *= np.linspace(1, 0, ri)
    return e

# ---------------- instruments (additive, fast) ----------------
def inst(name, f, dur, vel=1.0, rng=None):
    n = int(dur * SR); t = np.arange(n) / SR
    if name == 'harp':      parts = [(1, 1, 2.6), (2, .5, 3.8), (3, .28, 5.5), (4, .16, 7), (5, .09, 9)]; att = .003
    elif name == 'lyre':    parts = [(1, 1, 2.0), (2, .62, 3), (3, .35, 4.2), (4.02, .2, 6), (6, .08, 9)]; att = .004
    elif name == 'marimba': parts = [(1, 1, 4.5), (3.93, .32, 11), (9.2, .08, 20)]; att = .002
    elif name == 'bell':    parts = [(1, 1, 1.6), (2.76, .42, 2.6), (5.4, .22, 4), (8.93, .1, 6)]; att = .002
    elif name == 'musicbox':parts = [(1, 1, 2.2), (3.0, .3, 4), (6.1, .12, 7)]; att = .001
    elif name == 'pizz':    parts = [(1, 1, 7), (2, .45, 10), (3, .2, 13)]; att = .002
    elif name == 'piano':   parts = [(1, 1, 3.2), (2, .35, 4.5), (3, .12, 6)]; att = .004
    elif name == 'kalimba': parts = [(1, 1, 3.4), (5.4, .18, 9), (2.0, .1, 6)]; att = .002
    elif name == 'harpsi':  parts = [(1, 1, 3.2), (2, .75, 4.2), (3, .6, 5.4), (4, .45, 6.8), (5, .34, 8), (6, .25, 9.5), (7, .17, 11), (8, .12, 13), (10, .07, 16)]; att = .001
    elif name == 'celesta': parts = [(1, 1, 2.4), (4, .25, 6), (8, .06, 12)]; att = .002
    elif name == 'qin':     parts = [(1, 1, 2.0), (2, .32, 3.4), (3, .12, 5.0), (4, .05, 7)]; att = .006  # soft low pluck, no pitch bend
    elif name == 'zheng':
        bend = 1 + 0.03 * np.exp(-t * 18) + 0.005 * np.sin(2 * np.pi * 5.5 * t) * (1 - np.exp(-t * 3))
        ph = 2 * np.pi * f * np.cumsum(bend) / SR
        s = (np.sin(ph) + .55 * np.sin(2 * ph + .2) + .3 * np.sin(3 * ph + .4) + .12 * np.sin(4 * ph)) * np.exp(-t * 2.4)
        return s * _env(n, .002, .03) * vel
    elif name == 'dizi':
        vib = 1 + 0.006 * np.sin(2 * np.pi * 5.8 * t) * np.clip(t * 3, 0, 1)
        ph = 2 * np.pi * f * np.cumsum(vib) / SR
        s = np.sin(ph) + .18 * np.sin(2 * ph) + .06 * np.sin(3 * ph)
        if rng is not None: s += .06 * rng.standard_normal(n) * np.exp(-t * 2)
        return s * _env(n, .06, min(.3, dur * .4)) * vel
    elif name == 'flute':
        vib = 1 + 0.004 * np.sin(2 * np.pi * 5.2 * t)
        ph = 2 * np.pi * f * np.cumsum(vib) / SR
        s = np.sin(ph) + .25 * np.sin(2 * ph) + .08 * np.sin(3 * ph)
        if rng is not None: s += .03 * rng.standard_normal(n)
        return s * _env(n, .08, min(.25, dur * .4)) * vel
    else: raise ValueError(name)
    s = np.zeros(n)
    for m, a, d in parts: s += a * np.sin(2 * np.pi * f * m * t + (m - 1) * .3) * np.exp(-t * d)
    return s * _env(n, att, .02) * vel

def pad(freqs, dur, warmth=1.0):
    n = int(dur * SR); t = np.arange(n) / SR; s = np.zeros(n)
    for f in freqs:
        for det in (-0.6, 0.6):
            ff = f * (1 + det / 1200 * 8)
            s += np.sin(2 * np.pi * ff * t) + .3 * warmth * np.sin(4 * np.pi * ff * t) + .1 * warmth * np.sin(6 * np.pi * ff * t)
    s *= 1 + .08 * np.sin(2 * np.pi * .25 * t)
    return s / (len(freqs) * 2) * _env(n, min(1.2, dur * .35), min(1.2, dur * .35))

def drone(f, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + .4 * np.sin(4 * np.pi * f * t) + .15 * np.sin(2 * np.pi * 1.5 * f * t)
    return s * (1 + .1 * np.sin(2 * np.pi * .13 * t)) * _env(n, 1.5, 1.5)

def frame_drum(rng, dur=.5):
    n = int(dur * SR); t = np.arange(n) / SR
    f = 95 * np.exp(-t * 6) + 55
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7)
    s += .25 * rng.standard_normal(n) * np.exp(-t * 40)
    return s

def shaker(rng, dur=.08):
    n = int(dur * SR); x = rng.standard_normal(n); x = np.diff(np.concatenate([[0], x]))
    return x * np.exp(-np.arange(n) / SR * 60) * .5

def woodblock(dur=.12, f=820):
    n = int(dur * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) + .5 * np.sin(2 * np.pi * f * 1.52 * t)) * np.exp(-t * 55)

def tick(dur=.03):
    n = int(dur * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * 3200 * t) * np.exp(-t * 180)

# ---------------- moods ----------------
def note_freq(root, mode, deg, octave=0):
    sc = MODES[mode]; o, d = divmod(deg, len(sc))
    return root * 2 ** ((sc[d] + 12 * (o + octave)) / 12)

def render_mood(m, dur, seed):
    """m: dict(root, mode, bpm, prog=[degrees], lead, pattern, pad, drone, perc, level, meter)"""
    rng = np.random.default_rng(seed)
    n = int(dur * SR); out = np.zeros(n + SR * 4)
    def add(sig, t0, g):
        i = int(t0 * SR)
        if i < 0 or i >= n: return
        j = min(len(out), i + len(sig)); out[i:j] += sig[: j - i] * g
    beat = 60 / m['bpm']; meter = m.get('meter', 4); bar = beat * meter
    prog = m['prog']; root, mode = m['root'], m['mode']
    O = len(MODES[mode])  # degrees per octave (7, or 5 for pentatonic)
    nbars = int(np.ceil(dur / bar)) + 1
    for b in range(nbars):
        t0 = b * bar; deg = prog[b % len(prog)]
        chord = [deg, deg + 2, deg + 4]
        if m.get('pad'):
            add(pad([note_freq(root, mode, c, m.get('padOct', 0)) for c in chord], bar + 1.2, m.get('warm', 1)), t0, m['pad'])
        if m.get('drone') and b % 2 == 0:
            add(drone(note_freq(root, mode, 0, -1), bar * 2 + 1.5), t0, m['drone'])
        pat = m['pattern']; lead = m['lead']; lg = m.get('leadGain', .5)
        if pat == 'arp':
            seq = [0, 1, 2, 3, 2, 1, 0, 1] if meter == 4 else [0, 1, 2, 3, 2, 1]
            tones = [chord[0], chord[1], chord[2], chord[0] + O]
            for k, s in enumerate(seq):
                add(inst(lead, note_freq(root, mode, tones[s], m.get('oct', 1)), 1.6, .8 + .2 * (k == 0), rng), t0 + k * beat / 2, lg)
        elif pat == 'pulse':
            for k in range(meter * 2):
                deg_k = chord[0] if k % 4 != 3 else chord[2]
                add(inst(lead, note_freq(root, mode, deg_k, m.get('oct', 0)), .5, 1 if k % 2 == 0 else .6, rng), t0 + k * beat / 2, lg)
        elif pat == 'sparse':
            for k in range(0, meter, 2):
                if rng.random() < .85:
                    add(inst(lead, note_freq(root, mode, int(rng.choice(chord)) + O * int(rng.random() < .4), m.get('oct', 1)), 3.0, .9, rng), t0 + k * beat + rng.uniform(0, .05), lg)
        elif pat == 'melody':
            cur = chord[int(rng.integers(0, 3))] + O
            for k in range(meter * 2):
                if rng.random() < m.get('density', .6):
                    cur = int(np.clip(cur + rng.choice([-2, -1, 1, 2, 0]), O - 2, 2 * O))
                    if k % 4 == 0: cur = min(chord, key=lambda c: abs(c + O - cur)) + O
                    add(inst(lead, note_freq(root, mode, cur, m.get('oct', 0)), 1.4, .7 + .3 * (k % 4 == 0), rng), t0 + k * beat / 2, lg)
        elif pat == 'waltz':
            add(inst(lead, note_freq(root, mode, chord[0], m.get('oct', 0) - 1), 2.0, 1, rng), t0, lg)
            for k in (1, 2):
                for c in chord[1:]: add(inst(lead, note_freq(root, mode, c, m.get('oct', 0)), 1.2, .55, rng), t0 + k * beat, lg * .6)
            if rng.random() < .7: add(inst(m.get('lead2', lead), note_freq(root, mode, chord[2] + O, m.get('oct', 0)), 1.6, .5, rng), t0 + 2.5 * beat, lg * .6)
        elif pat == 'swell':
            if rng.random() < .6: add(inst(lead, note_freq(root, mode, chord[int(rng.integers(0, 3))] + O, m.get('oct', 0)), 3.5, .7, rng), t0 + beat * rng.integers(0, meter), lg)
        if m.get('gliss') and b % 4 == 3:
            for k in range(8): add(inst(m.get('glissInst', 'harp'), note_freq(root, mode, deg + k, 1), 1.2, .5, rng), t0 + bar - .9 + k * .06, m['gliss'])
        perc = m.get('perc')
        if perc == 'drum':
            for k in range(meter):
                if k in (0, 2) or (k == 3 and b % 2): add(frame_drum(rng), t0 + k * beat, .32 if k == 0 else .2)
        elif perc == 'shaker':
            for k in range(meter * 2): add(shaker(rng), t0 + k * beat / 2, .12 if k % 2 else .07)
        elif perc == 'tick':
            for k in range(meter * 2): add(tick(), t0 + k * beat / 2, .1 if k % 2 == 0 else .05)
        elif perc == 'wood':
            for k in range(meter):
                if k in (0, 2) or rng.random() < .3: add(woodblock(f=820 if k % 2 == 0 else 1100), t0 + k * beat, .16 if k == 0 else .1)
        elif perc == 'wooddrum':
            for k in range(meter): add(frame_drum(rng), t0 + k * beat, .2 if k == 0 else .08)
            for k in range(meter * 2):
                if k % 2 or rng.random() < .4: add(woodblock(f=1000), t0 + k * beat / 2, .07)
        elif perc == 'drumshaker':
            for k in range(meter): add(frame_drum(rng), t0 + k * beat, .22 if k % 2 == 0 else .1)
            for k in range(meter * 2): add(shaker(rng), t0 + k * beat / 2 + beat / 4, .07)
    out = out[:n] * m.get('level', 1.0)
    return out

def reverb(x, secs=2.2, wet=.28, seed=5):
    rng = np.random.default_rng(seed); n = int(secs * SR)
    ir = rng.standard_normal(n) * np.exp(-np.arange(n) / SR * 3.2); ir[0] = 0; ir /= np.sqrt(np.sum(ir ** 2))
    y = oaconvolve(x, ir)[: len(x)]
    return x * (1 - wet) + y * wet

def score(sections, total, moods, seed=11, xfade=1.4):
    """sections: [(t0, t1, mood_name)] covering the timeline. Returns mono music (peak ~1)."""
    N = int(total * SR); mus = np.zeros(N)
    for i, (t0, t1, name) in enumerate(sections):
        a = max(0, t0 - xfade / 2); b = min(total, t1 + xfade / 2)
        seg = render_mood(moods[name], b - a, seed + i * 7)
        r = np.sqrt(np.mean(seg ** 2)) + 1e-9; seg = seg * (0.1 * moods[name].get('gain', 1.0) / r)  # even loudness across moods
        n = len(seg); e = np.ones(n); f = int(xfade * SR)
        if i > 0: e[:f] = np.linspace(0, 1, min(f, n))[: min(f, n)]
        if i < len(sections) - 1: e[-f:] *= np.linspace(1, 0, f)
        ia = int(a * SR); mus[ia: ia + n] += (seg * e)[: N - ia]
    mus = reverb(mus)
    return mus / (np.abs(mus).max() + 1e-9)

def sections_from(lines, mood_of, total):
    secs = []
    for l in lines:
        name = mood_of(l); t0 = max(0.0, l['t0'] - 0.35)
        if secs and secs[-1][2] == name: continue
        if secs: secs[-1][1] = t0
        secs.append([t0, total, name])
    if secs: secs[0][0] = 0.0
    return [tuple(s) for s in secs]
