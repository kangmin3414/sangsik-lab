import numpy as np, soundfile as sf, sys
def f0med(path):
    w, sr = sf.read(path)
    if w.ndim > 1: w = w.mean(1)
    n = int(0.04 * sr); hop = int(0.01 * sr); out = []
    for i in range(0, len(w) - n, hop):
        x = w[i:i + n] * np.hanning(n)
        if np.sqrt(np.mean(x ** 2)) < 0.02: continue
        ac = np.correlate(x, x, 'full')[n - 1:]
        lo, hi = int(sr / 350), int(sr / 70)
        k = lo + np.argmax(ac[lo:hi])
        if ac[k] > 0.45 * ac[0]: out.append(sr / k)
    return np.median(out) if out else 0, len(out)
for p in sys.argv[1:]: print(p.split('/')[-1][:34], '%.0f Hz (%d)' % f0med(p))
