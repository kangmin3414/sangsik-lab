"""ep.008 v9 timeline + voice: L0-L2, NEW-A (turtle picture of L8), NEW-B (routine + sns teaser), L14, L3..L13, L15, L16.. (tail
shifted by an even number of frames so old frames are reused). Writes timeline_v9.json, voice_v9.wav (originals untouched)."""
import json, numpy as np, soundfile as sf, math
tl = json.load(open('timeline.json')); L = tl['lines']; v, SR = sf.read('voice.wav'); FPS = 24; HOP = SR // FPS
if v.ndim > 1: v = v.mean(1)
A, _ = sf.read('v9/A.wav'); B, _ = sf.read('v9/B.wav'); NL = json.load(open('v9/new_lines.json'))
GAP = 0.7; R = lambda x: round(x, 3)
def seg(text, t0, t1): return [{"v": "N", "text": text, "t0": R(t0), "t1": R(t1)}]
def shifted(l, d):
    m = json.loads(json.dumps(l)); m['t0'] = R(l['t0'] + d); m['t1'] = R(l['t1'] + d); m['dt'] = R(d)
    for s in m.get('segs', []): s['t0'] = R(s['t0'] + d); s['t1'] = R(s['t1'] + d)
    return m
place = []; new = []
def move(i0, i1, t_new):
    d = t_new - L[i0]['t0']
    for k in range(i0, i1 + 1): new.append(shifted(L[k], d) if abs(d) > 1e-9 else L[k])
    place.append((t_new, v[int(L[i0]['t0'] * SR):int(L[i1]['t1'] * SR)])); return L[i1]['t1'] + d
t = 0.8; t = move(0, 2, t) + GAP + L[2]['args'].get('pause', 0)
new.append({"i": 103, "ai_as": 8, "scene": "turtle", "args": {}, "sub": NL['A']['text'], "t0": R(t), "t1": R(t + len(A) / SR), "segs": seg(NL['A']['text'], t, t + len(A) / SR)})
place.append((t, A)); t += len(A) / SR + GAP
b1, b2 = NL['B']['text'].split(' SNS'); b1 = b1.strip(); b2 = 'SNS' + b2
B1_END, B2_0 = 2.42, 2.92                         # sentence pause 2.39-2.95 s in the take
new.append({"i": 104, "scene": "routine", "args": {}, "sub": b1, "t0": R(t), "t1": R(t + B1_END), "segs": seg(b1, t, t + B1_END)})
new.append({"i": 105, "scene": "sns", "args": {"teaser": 1}, "sub": b2, "t0": R(t + B2_0), "t1": R(t + len(B) / SR), "segs": seg(b2, t + B2_0, t + len(B) / SR)})
place.append((t, B)); t += len(B) / SR + GAP
t = move(14, 14, t) + GAP
t = move(3, 13, t) + GAP
t = move(15, 15, t)
T0 = 16; gap_orig = L[T0]['t0'] - L[T0 - 1]['t1']
D_raw = (t + gap_orig) - L[T0]['t0']; NSH = 2 * math.ceil(D_raw * FPS / 2); D = NSH / FPS
print('tail shift raw %.4f s -> %d frames = %.5f s (gap L15->L16 %.3f, orig %.3f)' % (D_raw, NSH, D, L[T0]['t0'] + D - t, gap_orig))
for k in range(T0, len(L)): new.append(shifted(L[k], D))
cut_old = L[T0]['t0'] - 0.3
dur = R(tl['duration'] + D); N = int(round(dur * SR)) + 10; voice = np.zeros(N)
for t0, w in place: i = int(round(t0 * SR)); voice[i:i + len(w)] += w
i_old = int(round(cut_old * SR)); i_new = i_old + int(round(D * SR)); tail = v[i_old:]
assert np.abs(voice[i_new:]).max() == 0
voice[i_new:i_new + len(tail)] = tail; voice = voice[:i_new + len(tail)]
sf.write('voice_v9.wav', voice, SR, subtype='PCM_16')
def rms(x, nfr): x = np.pad(x, (0, max(0, nfr * HOP - len(x)))); return np.sqrt(np.mean(x[:nfr * HOP].reshape(nfr, HOP) ** 2, axis=1))
nf_old = len(tl['env']); r_old = rms(v, nf_old); ref = np.percentile(r_old[r_old > 1e-4], 90)
print('env recompute max err', float(np.abs(np.round(np.clip(r_old / (ref + 1e-9), 0, 1), 2) - np.array(tl['env'])).max()))
FC = math.ceil((L[T0]['t0'] + D - 0.15) * FPS); nf_new = nf_old + NSH
envn = (list(np.round(np.clip(rms(voice, nf_new) / (ref + 1e-9), 0, 1), 2)[:FC]) + tl['env'][FC - NSH:])[:nf_new]
for k, l in enumerate(new): assert k == 0 or l['t0'] > new[k - 1]['t1'], (k, l['i'])
json.dump({"duration": dur, "lines": new, "env": [float(x) for x in envn]}, open('timeline_v9.json', 'w'), ensure_ascii=False, indent=1)
json.dump({"shift_frames": NSH, "shift_s": D, "FC": FC, "cut_old_s": cut_old, "dur": dur}, open('v9/shift.json', 'w'), indent=1)
for l in new[:20]: print(l['i'], l['scene'], l['t0'], l['t1'], l['sub'][:40])
print('dur', dur, 'FC', FC, 'old FC', FC - NSH)
