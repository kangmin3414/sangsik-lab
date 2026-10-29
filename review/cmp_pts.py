# compare music level under speech for the approved sample points vs the simplified points
import json, sys, numpy as np, soundfile as sf
sys.path.insert(0, '../shorts'); import theme as T
SR = 44100
tl = json.load(open('timeline.json')); L = tl['lines']; DUR = tl['duration']; N = int(DUR * SR)
voice, _ = sf.read('voice.wav'); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]; voice = voice / (np.abs(voice).max() + 1e-9) * 0.9
first = lambda sc: next(l['t0'] for l in L if l['scene'] == sc) - 1.0
c5 = next(l['t0'] for l in L if l['scene'] == 'chapter' and l['args']['n'] == 5) - 1
old = [(0, 0.8), (first('reveal'), 1.6), (first('myth'), 1.0), (first('demon'), 0.6), (first('cogito'), 1.3), (c5, 1.0), (first('recap'), 1.6), (first('francine'), 0.7), (first('lamp'), 1.4), (first('thanks'), 2.0)]
new = [(0, 0.9), (first('reveal'), 1.6), (first('myth'), 1.0), (first('francine'), 0.7), (first('lamp'), 1.4), (first('thanks'), 2.0)]
hop = SR // 10
def rms(x): k = len(x) // hop; return np.sqrt(np.mean(x[:k * hop].reshape(k, hop) ** 2, axis=1) + 1e-12)
vr = rms(voice); sp = vr > 0.02
db = lambda x: 20 * np.log10(np.median(x))
A = (first('myth') + 1.6, first('myth') + 91.6); B = (first('francine') + 1.6, first('thanks') + 1.6)
for name, pts in (('approved', old), ('simplified', new)):
    m = T.bed(voice, DUR, T.smooth_steps(pts, DUR, ramp=6.0), rel_db=-16.5, root=146.83, mode='aeolian', bpm=72)
    mr = rms(m); out = [name, 'whole %.1f' % (db(mr[sp]) - db(vr[sp]))]
    for lab, (a, b) in (('A', A), ('B', B)):
        s = slice(int(a * 10), int(b * 10)); out.append('%s %.1f' % (lab, db(mr[s][sp[s]]) - db(vr[s][sp[s]])))
    print(' | '.join(out), flush=True)
