"""Audio QA of a final mp4: integrated loudness / true peak (ebur128), sample clipping, voice gaps > 0.8 s in the intro,
level/discontinuity around each join (short-term RMS jump and sample-step), compared with the old mp4."""
import sys, json, subprocess, numpy as np
mp4, tlf, joins = sys.argv[1], sys.argv[2], [float(x) for x in sys.argv[3].split(',')]
def ebur(f):
    r = subprocess.run(['ffmpeg', '-v', 'info', '-i', f, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    s = r[r.rfind('Summary:'):]; g = lambda k: float(s.split(k)[1].split()[0])
    return {'I_LUFS': g('I:'), 'LRA': g('LRA:'), 'TP_dBFS': g('Peak:')}
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', mp4, '-ar', '48000', '-f', 'f32le', '-'], capture_output=True).stdout
x = np.frombuffer(raw, np.float32).reshape(-1, 2); print('stereo max |x|', round(float(np.abs(x).max()), 3)); x = x.mean(1); SR = 48000
print('ebur', mp4.split('/')[-1], ebur(mp4)); print('samples |x|>=0.999:', int((np.abs(x) >= 0.999).sum()), 'max', round(float(np.abs(x).max()), 3))
L = json.load(open(tlf))['lines']
gaps = [(round(L[k]['t1'], 2), round(L[k + 1]['t0'] - L[k]['t1'], 2), L[k]['i'], L[k + 1]['i']) for k in range(len(L) - 1) if L[k + 1]['t0'] - L[k]['t1'] > 0.8]
print('timeline voice gaps > 0.8 s:', gaps)
# whole-mix dropouts: 50 ms RMS below -50 dBFS for > 0.8 s (excluding first/last 2 s)
hop = int(0.05 * SR); n = len(x) // hop; e = 20 * np.log10(np.sqrt(np.mean(x[:n * hop].reshape(n, hop) ** 2, 1)) + 1e-9)
q = e < -50; runs = []; s = None
for i, v in enumerate(q):
    if v and s is None: s = i
    if not v and s is not None:
        if (i - s) * 0.05 > 0.8 and s * 0.05 > 2 and i * 0.05 < len(x) / SR - 2: runs.append((s * 0.05, i * 0.05))
        s = None
print('mix silences > 0.8 s:', runs)
for j in joins:
    i = int(j * SR); seg = x[i - SR: i + SR]
    st = np.abs(np.diff(x[i - 2400:i + 2400])).max()
    a = 20 * np.log10(np.sqrt(np.mean(x[i - 24000:i] ** 2)) + 1e-9); b = 20 * np.log10(np.sqrt(np.mean(x[i:i + 24000] ** 2)) + 1e-9)
    print(f'join {j:7.2f}s: rms 0.5s before {a:6.1f} dB, after {b:6.1f} dB, max sample step +-50ms {st:.3f}, peak {np.abs(seg).max():.3f}')
