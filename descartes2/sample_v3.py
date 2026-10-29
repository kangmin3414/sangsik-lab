import json, sys, os, numpy as np, soundfile as sf, subprocess
sys.path.insert(0, '../shorts')
import music as M, theme as T
SR = 44100
tl = json.load(open('timeline.json')); L = tl['lines']; DUR = tl['duration']; N = int(DUR * SR)
voice, _ = sf.read('voice.wav'); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]; voice = voice / (np.abs(voice).max() + 1e-9) * 0.9
first = lambda sc: next(l['t0'] for l in L if l['scene'] == sc) - 1.0
pts = [(0, 0.8), (first('reveal'), 1.6), (first('myth'), 1.0), (first('demon'), 0.6), (first('cogito'), 1.3),
       (next(l['t0'] for l in L if l['scene'] == 'chapter' and l['args']['n'] == 5) - 1, 1.0), (first('recap'), 1.6),
       (first('francine'), 0.7), (first('lamp'), 1.4), (first('thanks'), 2.0)]
I = T.smooth_steps(pts, DUR, ramp=6.0)
music = T.bed(voice, DUR, I, rel_db=-16.5, root=146.83, mode='aeolian', bpm=72)
sfx = np.zeros(N)
for l in L:
    if l['scene'] == 'chapter':
        for k, f in enumerate([M.note_freq(146.83, 'aeolian', 4, 2), M.note_freq(146.83, 'aeolian', 7, 2)]):
            s = M.inst('bell', f, 1.4, 0.8); i = int((l['t0'] - 0.55 + k * 0.16) * SR); sfx[i:i + len(s)] += s * 0.035
mix = voice + music + sfx
fade = np.ones(N); fade[:int(0.5 * SR)] = np.linspace(0, 1, int(0.5 * SR)); fade[-int(1.5 * SR):] = np.linspace(1, 0, int(1.5 * SR)); mix *= fade
mix = mix / (np.abs(mix).max() + 1e-9) * 0.95
sf.write('mix_v3.wav', np.stack([mix, mix], 1), SR)
old, _ = sf.read('mix.wav')
def cut(x, a, b, name):
    seg = x[int(a * SR):int(b * SR)].copy(); f = int(0.6 * SR)
    seg[:f] *= np.linspace(0, 1, f)[:, None] if seg.ndim > 1 else np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)[:, None] if seg.ndim > 1 else np.linspace(1, 0, f)
    sf.write('sample/tmp.wav', seg, SR)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', 'sample/tmp.wav', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '44100', '-b:a', '192k', 'sample/' + name], check=True)
A = (first('myth') + 0.6, first('myth') + 0.6 + 90); B = (first('francine') + 0.6, first('thanks') + 0.6)
for nm, rng in (('A', A), ('B', B)):
    cut(np.stack([mix, mix], 1), *rng, f'샘플{nm}_개선안2.mp3')
print('A %.1f-%.1f  B %.1f-%.1f' % (A + B))
