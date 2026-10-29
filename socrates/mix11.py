# ep.009 mix: one continuous theme (A dorian, soft lyre pluck + quiet celesta top), steady bed under the narration
# usage: python3 mix11.py [lead] [top] [mode]   -> writes mix.wav, prints masking + level report
import json, sys, numpy as np, soundfile as sf
sys.path.insert(0, '../shorts')
import music as M, theme as T, safemix as SM
SR = 44100
LEAD = sys.argv[1] if len(sys.argv) > 1 else 'lyre'
TOP = sys.argv[2] if len(sys.argv) > 2 else 'celesta'
MODE = sys.argv[3] if len(sys.argv) > 3 else 'dorian'
tl = json.load(open('timeline.json')); L = tl['lines']; DUR = tl['duration']; N = int(DUR * SR)
voice, _ = sf.read('voice.wav'); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]; voice = voice / (np.abs(voice).max() + 1e-9) * 0.9
first = lambda sc, **kw: next(l['t0'] for l in L if l['scene'] == sc and all(l['args'].get(k) == v for k, v in kw.items())) - 1.0
ROOT = float(sys.argv[4]) if len(sys.argv) > 4 else 110.0   # A root: lyre sits below the speech band (D root masked more)
THEME = dict(root=ROOT, mode=MODE, bpm=68, prog=(0, 3, 0, 6, 0, 3, 4, 0), lead=LEAD, top=TOP, seed=9)
pts = [(0, 0.9), (first('qagora'), 1.1), (first('title'), 1.6), (first('chapter', n=1), 1.0), (first('qtrial'), 0.6), (first('qnote'), 1.4), (first('thanks'), 2.0)]
I = T.smooth_steps(pts, DUR, ramp=6.0)
music = T.bed(voice, DUR, I, rel_db=-16.5, **THEME)
sfx = np.zeros(N)
def put(sig, t0, g):
    i = int(t0 * SR); j = min(N, i + len(sig))
    if 0 <= i < N: sfx[i:j] += sig[: j - i] * g
for l in L:
    if l['scene'] == 'chapter':   # chapter chime in the theme's key
        for k, deg in enumerate((2, 4)): put(M.inst('bell', M.note_freq(ROOT, MODE, deg, 2), 1.4, 0.8), l['t0'] - 0.55 + k * 0.16, 0.035)
mix = voice + music + sfx
fade = np.ones(N); fade[:int(0.5 * SR)] = np.linspace(0, 1, int(0.5 * SR)); fade[-int(1.5 * SR):] = np.linspace(1, 0, int(1.5 * SR)); mix *= fade
pk = np.abs(mix).max() + 1e-9; mix = mix / pk * 0.95
sf.write('mix.wav', np.stack([mix, mix], 1), SR)
print(LEAD, TOP, MODE)
print(json.dumps(SM.masking_report(voice, (music + sfx) * fade, L), ensure_ascii=False))
hop = SR // 10
def rms(x): k = len(x) // hop; return np.sqrt(np.mean(x[:k * hop].reshape(k, hop) ** 2, axis=1) + 1e-12)
def mov(x, k): c = np.cumsum(np.insert(x, 0, 0.0)); y = (c[k:] - c[:-k]) / k; return np.pad(y, (k // 2, len(x) - len(y) - k // 2), mode='edge')
vr, mr = rms(voice), rms(music * fade); sp = vr > 0.02
gap = mov((~sp).astype(float), 8) > 0.99; spk = mov(sp.astype(float), 8) > 0.99
db = lambda x: 20 * np.log10(np.median(x))
print('music under speech %.1f dB vs voice | pauses %.1f dB louder' % (db(mr[spk]) - db(vr[spk]), db(mr[gap]) - db(mr[spk])))
