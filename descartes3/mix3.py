# v3 mix: one continuous theme for the whole episode, steady bed under the narration
import json, sys, numpy as np, soundfile as sf
sys.path.insert(0, '../shorts')
import music as M, theme as T, safemix as SM
SR = 44100
tl = json.load(open('timeline.json')); L = tl['lines']; DUR = tl['duration']; N = int(DUR * SR)
voice, _ = sf.read('voice.wav'); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]; voice = voice / (np.abs(voice).max() + 1e-9) * 0.9
first = lambda sc: next(l['t0'] for l in L if l['scene'] == sc) - 1.0
THEME = dict(root=146.83, mode='aeolian', bpm=72)
# only five gentle turns: intro -> title -> body -> Francine (piano) -> ending
pts = [(0, 0.9), (first('reveal'), 1.6), (first('myth'), 1.0), (first('francine'), 0.7), (first('lamp'), 1.15), (first('thanks'), 2.0)]
I = T.smooth_steps(pts, DUR, ramp=6.0)
music = T.bed(voice, DUR, I, rel_db=-16.5, **THEME)
sfx = np.zeros(N)
def put(sig, t0, g):
    i = int(t0 * SR); j = min(N, i + len(sig))
    if 0 <= i < N: sfx[i:j] += sig[: j - i] * g
for l in L:
    if l['scene'] == 'chapter':   # chapter chime in the theme's key
        for k, deg in enumerate((4, 7)): put(M.inst('bell', M.note_freq(146.83, 'aeolian', deg, 2), 1.4, 0.8), l['t0'] - 0.55 + k * 0.16, 0.035)
    if l['scene'] == 'bat' and l['args'].get('count'):   # 3-2-1 ticks for the quiz
        for k in range(3): put(M.inst('marimba', M.note_freq(146.83, 'aeolian', 4 if k < 2 else 7, 2), 0.4, 1.0), l['t1'] + 0.05 + k * 1.0, 0.08)
mix = voice + music + sfx
fade = np.ones(N); fade[:int(0.5 * SR)] = np.linspace(0, 1, int(0.5 * SR)); fade[-int(1.5 * SR):] = np.linspace(1, 0, int(1.5 * SR)); mix *= fade
pk = np.abs(mix).max() + 1e-9; mix = mix / pk * 0.95
sf.write('mix.wav', np.stack([mix, mix], 1), SR)
print(json.dumps(SM.masking_report(voice, (music + sfx) * fade, L), ensure_ascii=False))
