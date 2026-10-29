import sys, glob, numpy as np, librosa
for fn in sorted(glob.glob('cand_*.mp3')):
    y, sr = librosa.load(fn, sr=22050, mono=True)
    d = len(y) / sr
    hop = sr * 3
    rms = np.array([np.sqrt(np.mean(y[i:i + hop] ** 2)) + 1e-9 for i in range(0, len(y) - hop, hop)])
    db = 20 * np.log10(rms)
    body = db[2:-2] if len(db) > 6 else db
    H, P = librosa.effects.hpss(y)
    perc = 10 * np.log10((np.mean(P ** 2) + 1e-12) / (np.mean(H ** 2) + 1e-12))
    S = np.abs(librosa.stft(y, n_fft=2048)) ** 2
    f = librosa.fft_frequencies(sr=sr, n_fft=2048)
    band = S[(f > 1000) & (f < 4000)].sum() / S.sum()
    cen = librosa.feature.spectral_centroid(y=y, sr=sr).mean()
    print('%-24s %5.0fs  level %5.1f dB  swing(p10-p90) %4.1f dB  perc/harm %5.1f dB  1-4kHz %4.1f%%  centroid %5.0f Hz' % (
        fn, d, np.median(body), np.percentile(body, 90) - np.percentile(body, 10), perc, band * 100, cen))
