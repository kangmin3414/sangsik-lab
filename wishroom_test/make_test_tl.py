"""④ test: lines 0-5 (반지하 아침 + 제목) and 13-21 (밤, 문, 첫날 식탁) cut from ../wishroom voice/timeline."""
import json, numpy as np, soundfile as sf
T = json.load(open('../wishroom/timeline.json')); L = T['lines']; v, SR = sf.read('../wishroom/voice.wav')
parts = [(0.0, L[6]['t0'] - 0.45, range(0, 6)), (L[13]['t0'] - 0.6, L[21]['t1'] + 2.2, range(13, 22))]
out, lines, cur = [], [], 0.0
for a, b, idx in parts:
    out.append(v[int(a * SR):int(b * SR)])
    for i in idx:
        l = json.loads(json.dumps(L[i])); d = cur - a
        l['t0'] = round(l['t0'] + d, 3); l['t1'] = round(l['t1'] + d, 3)
        for s in l['segs']: s['t0'] = round(s['t0'] + d, 3); s['t1'] = round(s['t1'] + d, 3)
        if i >= 19: l['args']['shot'] = 'A9'
        lines.append(l)
    cur += b - a
voice = np.concatenate(out); sf.write('voice.wav', voice, SR)
FPS = 24; hop = SR // FPS; n = int(cur * FPS) + 1; pad = np.pad(voice, (0, max(0, n * hop - len(voice))))
rms = np.sqrt(np.mean(pad[:n * hop].reshape(n, hop) ** 2, axis=1)); env = np.clip(rms / (np.percentile(rms[rms > 1e-4], 90) + 1e-9), 0, 1)
json.dump({'duration': round(cur, 3), 'lines': lines, 'env': [round(float(x), 2) for x in env]}, open('timeline.json', 'w'), ensure_ascii=False, indent=1)
print(round(cur, 2), [(l['scene'], l['t0'], l['t1']) for l in lines])
