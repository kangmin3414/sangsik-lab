import json, numpy as np, soundfile as sf, sys
sys.path.insert(0, '../shorts')
SR = 44100
def mov(x, k):
    c = np.cumsum(np.insert(x, 0, 0.0)); y = (c[k:] - c[:-k]) / k
    return np.pad(y, (k // 2, len(x) - len(y) - k // 2), mode='edge')
for ep in ['nietzsche', 'descartes2', 'zhuangzi2']:
    v, _ = sf.read('../%s/voice.wav' % ep); m, _ = sf.read('../%s/mix.wav' % ep)
    if m.ndim > 1: m = m.mean(1)
    n = min(len(v), len(m)); v = v[:n] / (np.abs(v[:n]).max() + 1e-9) * 0.9; m = m[:n]
    mid = slice(5 * SR, n - 5 * SR); g = np.dot(m[mid], v[mid]) / np.dot(v[mid], v[mid])
    rest = m / g - v
    hop = SR // 10
    def rms(x): k = len(x) // hop; return np.sqrt(np.mean(x[:k * hop].reshape(k, hop) ** 2, axis=1) + 1e-12)
    vr, rr = rms(v), rms(rest)
    sp = vr > 0.02
    gap = mov((~sp).astype(float), 8) > 0.99      # inside a pause of >= ~0.8 s
    spk = mov(sp.astype(float), 8) > 0.99
    db = lambda x: 20 * np.log10(np.median(x))
    swing = db(rr[gap]) - db(rr[spk])
    rel = db(rr[spk]) - db(vr[spk])
    L = json.load(open('../%s/timeline.json' % ep))['lines']
    print('%-11s music under speech %5.1f dB vs voice | music in pauses is %4.1f dB louder than under speech' % (ep, rel, swing))
