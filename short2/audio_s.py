import numpy as np, soundfile as sf
SR = 44100
mix, sr = sf.read("../walk/mix.wav"); assert sr == SR
if mix.ndim == 1: mix = np.stack([mix, mix], 1)
def seg(t0, d):
    x = mix[int(t0 * SR):int(t0 * SR) + int(d * SR)].copy(); n = int(0.06 * SR)
    x[:n] *= np.linspace(0, 1, n)[:, None]; x[-n:] *= np.linspace(1, 0, n)[:, None]; return x
import json, sys
cfg = {c["name"]: c for c in json.load(open("shorts.json"))}[sys.argv[1]]
parts = [seg(a, d) for a, d in cfg["seg"]]
B = parts[-1]
# outro: narration + soft piano bed
o, osr = sf.read("outro.wav"); assert osr == SR
Cd = 5.44; nC = int(Cd * SR); C = np.zeros(nC)
C[int(0.35 * SR):int(0.35 * SR) + len(o)] += o / (np.abs(o).max() + 1e-9) * 0.9
def piano(f, dur=1.6):
    n = int(dur * SR); tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(2 * np.pi * 2 * f * tt) + 0.12 * np.sin(2 * np.pi * 3 * f * tt)
    return s * np.exp(-tt * 3.2)
bed = np.zeros(nC); notes = [261.6, 392.0, 329.6, 493.9, 392.0, 329.6, 493.9, 392.0]; beat = 60 / 80 / 2
for k in range(int(Cd / beat)):
    i = int(k * beat * SR); p = piano(notes[k % 8]); j = min(nC, i + len(p)); bed[i:j] += p[:j - i] * 0.07
C = C + bed; fo = int(1.0 * SR); C[-fo:] *= np.linspace(1, 0, fo)
# match level of the outro to the long-video mix
ref = np.sqrt(np.mean(B[:, 0] ** 2)); cur = np.sqrt(np.mean(C ** 2)); C = C * (ref / (cur + 1e-9)) * 0.95
C = np.stack([C, C], 1)
out = np.concatenate(parts + [C]); out = out / (np.abs(out).max() + 1e-9) * 0.95
sf.write("au_" + cfg["name"] + ".wav", out, SR); print(round(len(out) / SR, 2))
