"""Ep.02 mix. Music map (one bed, ducked under speech by bgm/mixer.mix):
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
B = {k: load(f'../bgm/cand_{k}.mp3') for k in ['5_ambient_a', '5_ambient_b', '3_guitar_a', '3_guitar_b', '4_celesta_a', '4_celesta_b', '1_piano_a', '1_piano_b']}
rng = np.random.default_rng(1)

def first(scene, k=0):
    for l in L:
        if l['scene'] == scene and (l['args'].get('k', 0) == k): return l
    raise KeyError(scene, k)
st = lambda l: l['t0'] - 0.15


music = np.zeros((N, 2))
def place(src, t0, t1, fin=1.0, fout=1.0, gain=1.0, off=0.0):
    i0, i1 = int(t0 * SR), min(N, int(t1 * SR)); n = i1 - i0
    if n <= 0: return
    s0 = int(off * SR); seg = src[s0:s0 + n]
    if len(seg) < n:
        reps = int(np.ceil((n + s0) / len(src))) + 1; seg = np.concatenate([src] * reps)[s0:s0 + n]
    seg = seg.copy() * gain; a, b = int(fin * SR), int(fout * SR)
    if a: seg[:a] *= np.linspace(0, 1, a)[:, None]
    if b: seg[-b:] *= np.linspace(1, 0, b)[:, None]
    music[i0:i1] += seg
rms = lambda m: np.sqrt(np.mean(m[np.abs(m).max(1) > 1e-4] ** 2))
B = {k: v * 0.1 / (rms(v) + 1e-9) for k, v in B.items()}
T = lambda i: L[i]['t0'] - 0.15
END = lambda i: L[i]['t1']
# music map (line indices from script.py)
plan = [('5_ambient_a', 0, 6, 0.6, 1.2, 0.8),      # hook + title
        ('3_guitar_a', 6, 18, 1.0, 1.2, 0.85),     # morning commute, the draft, send
        ('4_celesta_a', 18, 51, 1.2, 1.5, 0.75),   # the day of reading ㅇㅇ
        ('5_ambient_b', 51, 61, 1.5, 0.4, 0.8),    # night, mom's message, my ㅇㅇ (stops on the silent '…')
        ('5_ambient_b', 62, 64, 1.0, 1.0, 0.55),   # 주무시나 보다 / 그날 밤
        ('3_guitar_b', 64, 74, 1.2, 1.2, 0.8),     # mom's car
        ('5_ambient_a', 74, 80, 1.0, 1.5, 0.7),    # waiting room
        ('1_piano_a', 80, 110, 3.0, 1.5, 0.9),     # sister chat -> recovery room -> lunch
        ('4_celesta_b', 110, 115, 1.0, 1.0, 0.7),  # office, ㅇㅇ read once
        ('1_piano_b', 115, len(L), 1.5, 2.5, 0.95)]
for k, a, b, fi, fo, g in plan:
    t0 = T(a); t1 = T(b) if b < len(L) else DUR
    place(B[k], t0, t1 + 0.1, fin=fi, fout=fo, gain=g, off=0)
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
sf.write('mix.wav', m, SR); print('mix ok %.1fs' % DUR)
