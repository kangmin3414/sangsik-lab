"""Ep.01 mix. Music map (one bed, ducked under speech by bgm/mixer.mix):
  hook (hroom)            ambient pad, quiet and ominous
  title → hgogi → hsecond light guitar; cut to silence for the 1.6 s freeze after "2차 가야지?"; guitar back for the walk
  karaoke room            synthetic party beat (low-passed, as if under the talking); outside the room the same beat
                          heard through walls (heavy low-pass, quieter): washroom, store, stairwell
  climax                  beat stops dead on the music_stop cue → silence → warm piano enters with "사실 나도야"
                          and runs to the end.
SFX are synthesised from the line's args['sfx'] at the start of that line."""
import sys, os, json, numpy as np, soundfile as sf, librosa, scipy.signal as ss
sys.path.insert(0, '../bgm')
from mixer import mix, SR
tl = json.load(open('timeline.json')); L = tl['lines']; DUR = tl['duration']; N = int(DUR * SR)
voice, sr = sf.read('voice.wav'); assert sr == SR
if voice.ndim > 1: voice = voice.mean(1)
voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]; voice = voice / (np.abs(voice).max() + 1e-9) * 0.9
load = lambda f: librosa.load(f, sr=SR, mono=False)[0].T
AMB = load('../bgm/cand_5_ambient_a.mp3'); GTR = load('../bgm/cand_3_guitar_a.mp3'); PNO = load('../bgm/cand_1_piano_a.mp3')
rng = np.random.default_rng(1)

def first(scene, k=0):
    for l in L:
        if l['scene'] == scene and (l['args'].get('k', 0) == k): return l
    raise KeyError(scene, k)
st = lambda l: l['t0'] - 0.15

# ---------- the synthetic karaoke beat ----------
def beat(n, bpm=118):
    out = np.zeros(n); spb = 60 / bpm; tt = np.arange(int(0.4 * SR)) / SR
    kick = np.sin(2 * np.pi * (50 + 90 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 9)
    sn = rng.standard_normal(int(0.2 * SR)) * np.exp(-np.arange(int(0.2 * SR)) / SR * 22)
    hat = rng.standard_normal(int(0.05 * SR)) * np.exp(-np.arange(int(0.05 * SR)) / SR * 90)
    b, a = ss.butter(2, 6000 / (SR / 2), 'high'); hat = ss.lfilter(b, a, hat)
    bass_notes = [55.0, 55.0, 73.4, 65.4]; chords = [[220, 277, 330], [220, 277, 330], [294, 370, 440], [262, 330, 392]]
    nb = int(n / (spb * SR)) + 2
    for k in range(nb):
        i = int(k * spb * SR)
        if i >= n: break
        def put(x, at, g):
            j = min(n, at + len(x)); out[at:j] += x[:j - at] * g
        put(kick, i, 0.9)
        if k % 2 == 1: put(sn, i, 0.35)
        put(hat, i + int(spb * SR / 2), 0.25); put(hat, i, 0.15)
        bar = (k // 4) % 4; f = bass_notes[bar]; m = int(spb * SR * 0.9); tb = np.arange(m) / SR
        put(ss.sawtooth(2 * np.pi * f * tb) * np.exp(-tb * 3) * 0.5, i, 0.35)
        if k % 4 == 0:
            m2 = int(spb * 4 * SR); tc = np.arange(m2) / SR; c = sum(ss.sawtooth(2 * np.pi * fr * tc, 0.5) for fr in chords[bar]) / 3
            put(c * np.minimum(1, tc * 8) * np.exp(-tc * 0.4), i, 0.18)
    return np.stack([out, out], 1)
def lowpass(x, fc):
    b, a = ss.butter(4, fc / (SR / 2), 'low'); return ss.lfilter(b, a, x, axis=0)

music = np.zeros((N, 2))
def place(src, t0, t1, fin=1.0, fout=1.0, gain=1.0, off=0.0):
    i0, i1 = int(t0 * SR), min(N, int(t1 * SR)); n = i1 - i0
    if n <= 0: return
    s0 = int(off * SR); seg = src[s0:s0 + n]
    if len(seg) < n:  # loop
        reps = int(np.ceil((n + s0) / len(src))) + 1; seg = np.concatenate([src] * reps)[s0:s0 + n]
    seg = seg.copy() * gain
    a, b = int(fin * SR), int(fout * SR)
    if a: seg[:a] *= np.linspace(0, 1, a)[:, None]
    if b: seg[-b:] *= np.linspace(1, 0, b)[:, None]
    music[i0:i1] += seg
rms = lambda m: np.sqrt(np.mean(m[np.abs(m).max(1) > 1e-4] ** 2))
norm = lambda m, r=0.1: m * r / (rms(m) + 1e-9)
AMB, GTR, PNO = norm(AMB), norm(GTR), norm(PNO)
BEAT = norm(lowpass(beat(int(240 * SR)), 2400), 0.1)
WALL = norm(lowpass(beat(int(240 * SR)), 380), 0.1)

t_title = st(first('ctitle')); t_sec = first('hsecond', 2); t_sing = st(first('hsing'))
place(AMB, 0, t_title + 0.6, fin=0.5, fout=1.2, gain=0.8)
place(GTR, t_title - 0.2, st(t_sec), fin=1.5, fout=0.15, gain=0.9)                                    # dinner
place(GTR, t_sec['t1'] + 0.1, t_sing + 0.3, fin=0.8, fout=0.8, gain=0.75, off=60)                   # walk to the room
segs = [('hsing', BEAT, 1.0), ('hwash', WALL, 0.75), ('hstore', WALL, 0.55), ('hmin', BEAT, 0.9), ('hstair', WALL, 0.6), ('hlouder', BEAT, 1.0), ('hclimax', BEAT, 1.0)]
order = [s for s, _, _ in segs]
t_stop = st(first('hclimax', 3))
for n_, (sc, src, g) in enumerate(segs):
    a = st(first(sc)); b = st(first(order[n_ + 1])) if n_ + 1 < len(order) else t_stop
    place(src, a, b + (0.05 if n_ + 1 < len(order) else 0.0), fin=0.25, fout=0.05 if sc == 'hclimax' else 0.25, gain=g, off=a - t_sing)
t_pno = st(first('hclimax', 12))
place(PNO, t_pno, DUR, fin=3.0, fout=2.5, gain=0.95, off=2.0)

m = mix(voice, music, fade_in=0.3, fade_out=2.0)

# ---------- SFX ----------
def add(at, x, g):
    i = int(at * SR)
    if x.ndim == 1: x = np.stack([x, x], 1)
    if 0 <= i < N - len(x): m[i:i + len(x)] += x * g
def env_t(n, k): tt = np.arange(n) / SR; return tt, np.exp(-tt * k)
def tick(g=0.06): tt, e = env_t(int(0.12 * SR), 40); return np.sin(2 * np.pi * 2400 * tt) * e
def ding(): tt = np.arange(int(0.6 * SR)) / SR; return (np.sin(2 * np.pi * 1318.5 * tt) * np.exp(-tt * 8) + 0.7 * np.sin(2 * np.pi * 1760 * tt) * np.exp(-np.clip(tt - 0.1, 0, None) * 8) * (tt > 0.1))
def whoosh(): n = int(0.45 * SR); x = rng.standard_normal(n); x = np.convolve(x, np.ones(16) / 16, 'same') * np.sin(np.linspace(0, np.pi, n)) ** 2; return x * 2.5
def heartbeat():
    out = np.zeros(int(1.2 * SR))
    for at in (0.0, 0.22, 0.75, 0.97):
        tt, e = env_t(int(0.15 * SR), 28); x = np.sin(2 * np.pi * 52 * tt) * e; i = int(at * SR); out[i:i + len(x)] += x * (1 if at in (0.0, 0.75) else 0.7)
    return out * 1.6
def door():
    tt, e = env_t(int(0.25 * SR), 25); x = np.sin(2 * np.pi * 140 * tt) * e + 0.4 * rng.standard_normal(len(tt)) * np.exp(-tt * 60); return x
def mic_fb(): tt = np.arange(int(0.7 * SR)) / SR; return np.sin(2 * np.pi * (2900 + 300 * tt) * tt) * np.minimum(1, tt * 20) * np.exp(-tt * 4) * 0.5
def music_stop(): tt = np.arange(int(0.35 * SR)) / SR; return np.sin(2 * np.pi * 180 * (1 - tt * 1.5) * tt) * np.exp(-tt * 9) * 0.8
def tamb():
    n = int(0.5 * SR); tt = np.arange(n) / SR; x = rng.standard_normal(n); b, a = ss.butter(2, [5000 / (SR / 2), 12000 / (SR / 2)], 'band'); x = ss.lfilter(b, a, x)
    e = np.zeros(n)
    for at in (0.0, 0.11, 0.2):
        i = int(at * SR); e[i:] += np.exp(-np.arange(n - i) / SR * 18)
    return x * e * 2.2
def subway(): n = int(1.6 * SR); x = rng.standard_normal(n); b, a = ss.butter(2, 220 / (SR / 2), 'low'); x = ss.lfilter(b, a, x); return x * np.sin(np.linspace(0, np.pi, n)) * 6
def page(): n = int(0.3 * SR); x = rng.standard_normal(n); b, a = ss.butter(2, [1500 / (SR / 2), 6000 / (SR / 2)], 'band'); return ss.lfilter(b, a, x) * np.sin(np.linspace(0, np.pi, n)) * 1.5
def send(): return whoosh() * 0.6
FX = {'tick': (tick, 0.05), 'ding': (ding, 0.07), 'whoosh': (whoosh, 0.03), 'heartbeat': (heartbeat, 0.18), 'door': (door, 0.08), 'mic_feedback': (mic_fb, 0.03),
      'music_stop': (music_stop, 0.12), 'tambourine': (tamb, 0.08), 'subway': (subway, 0.05), 'page': (page, 0.05), 'send': (send, 0.05), 'crowd_laugh': (None, 0)}
for l in L:
    fx = l['args'].get('sfx')
    if not fx or not FX.get(fx, (None,))[0]: continue
    f, g = FX[fx]; at = st(l) + 0.05
    if fx == 'tambourine': at = st(l) + 1.2 + (l['t1'] - l['t0']) * 0.15
    if fx == 'music_stop': at = st(l)
    add(at, f(), g)
# counter pops: a soft tick when the number goes up
for l in L:
    if l['args'].get('count'): add(st(l) + 0.1, tick(), 0.035)
m = m / (np.abs(m).max() + 1e-9) * 0.92
sf.write('mix.wav', m, SR); print('mix ok %.1fs  beat %.1f-%.1f  piano-in %.1f' % (DUR, t_sing, t_stop, t_pno))
