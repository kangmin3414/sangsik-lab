import json, sys, re, numpy as np, soundfile as sf, librosa
tl = json.load(open('timeline.json')); v, SR = sf.read('voice.wav')
def stats(w, text):
    f0, vf, _ = librosa.pyin(w.astype(float), fmin=70, fmax=400, sr=SR, frame_length=2048)
    f0 = f0[vf]; act = w[np.abs(w) > 0.01]
    cen = librosa.feature.spectral_centroid(y=w.astype(float), sr=SR)[0]
    syl = len(re.sub(r'[^가-힣]', '', text)) + len(re.findall(r'\d', text))
    return dict(f0_med=round(float(np.median(f0)), 1), f0_iqr=round(float(np.percentile(f0, 75) - np.percentile(f0, 25)), 1),
                rms_db=round(20 * np.log10(np.sqrt(np.mean(act ** 2))), 1), centroid=int(np.median(cen)), syl_per_s=round(syl / (len(w) / SR), 2))
for i in [int(x) for x in sys.argv[1].split(',')]:
    l = tl['lines'][i]
    for s in l['segs']:
        if s['v'] == 'N':
            print('L%d' % i, stats(v[int(s['t0'] * SR):int(s['t1'] * SR)], s['text']))
for k in sys.argv[2:]:
    w, _ = sf.read(f'v9/{k}.wav'); txt = json.load(open('v9/new_lines.json'))[k[0]]['text']
    print(k, stats(w, txt))
