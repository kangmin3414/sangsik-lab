"""One warm piano-and-strings song (BGM #2) under the narration, carved + ducked, plus a soft camera click at each photo."""
import sys, os, json, numpy as np, soundfile as sf
sys.path.insert(0, '../bgm')
from mixer import mix, SR
_src = open('../bgm/remix_all.py').read(); _src = _src[:_src.index('EP = ')]
_ns = {'__file__': os.path.abspath('../bgm/remix_all.py')}; exec(_src, _ns)   # bed(): loops the song with crossfades, natural ending at the end
tl = json.load(open('timeline.json')); L = tl['lines']; DUR = tl['duration']
voice, sr = sf.read('voice.wav'); assert sr == SR
N = int(DUR * SR); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]; voice = voice / (np.abs(voice).max() + 1e-9) * 0.9
m = mix(voice, _ns['bed'](DUR), fade_in=1.5, fade_out=0.3)
rng = np.random.default_rng(11)
def click(at, g=0.10):
    n = int(0.09 * SR); x = rng.standard_normal(n) * np.exp(-np.linspace(0, 9, n))
    x2 = np.zeros(n); k = int(0.035 * SR); x2[k:] = x[:n - k] * 0.7
    s = (x + x2) * g; i = int(at * SR)
    if 0 <= i < N - n: m[i:i + n] += s[:, None]
for l in L:
    a, D = l['args'], l['t1'] - l['t0']
    if l['scene'] == 'tday' and a.get('k') in (1, 2) and not (a.get('d') == 4 and a.get('k') == 1): click(l['t0'] - 0.15 + 0.7 * D)
    if l['scene'] == 'tstudio' and a.get('k') == 2: click(l['t0'] - 0.15 + 0.1, 0.16)
m = m / (np.abs(m).max() + 1e-9) * 0.92
sf.write('mix.wav', m, SR); print('mix ok %.1fs' % DUR)
