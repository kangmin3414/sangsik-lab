"""Build the v9 timeline + voice: L0, NEW-A (split into 2 visual lines), NEW-B, L7, L1..L6, L8, L9.. (tail shifted by an
integer number of frames so old frames can be reused). Writes timeline_v9.json and voice_v9.wav (originals untouched)."""
import json, numpy as np, soundfile as sf, math
tl = json.load(open('timeline.json')); L = tl['lines']; v, SR = sf.read('voice.wav'); FPS = 24; HOP = SR // FPS
A, _ = sf.read('v9/A.wav'); B, _ = sf.read('v9/B.wav'); NL = json.load(open('v9/new_lines.json'))
SPLIT_A = 3.655                      # pause after "3초 문제," (3.48-3.83 s in the take)
GAP = 0.7                            # scene-change gap of the pipeline (0.5 + 0.2)
R = lambda x: round(x, 3)
def seg(text, t0, t1): return [{"v": "N", "text": text, "t0": R(t0), "t1": R(t1)}]
def shifted(l, d):
    m = json.loads(json.dumps(l)); m['t0'] = R(l['t0'] + d); m['t1'] = R(l['t1'] + d)
    for s in m.get('segs', []): s['t0'] = R(s['t0'] + d); s['t1'] = R(s['t1'] + d)
    return m
place = []                           # (new_t0, samples)
new = [L[0]]; place.append((0.0, v[:int((L[0]['t1'] + 0.05) * SR)]))
t = L[0]['t1'] + GAP
ta, tb = NL['A']['text'].split(', 동전'); ta += ','; tb = '동전' + tb
a1_end = 3.50; a2_0 = 3.80
new.append({"i": 100, "scene": "bat", "args": {"elite": 1, "teaser": "절반 넘게 틀린 3초 문제"}, "sub": ta, "t0": R(t), "t1": R(t + a1_end), "segs": seg(ta, t, t + a1_end)})
new.append({"i": 101, "scene": "faces", "args": {}, "sub": tb, "t0": R(t + a2_0), "t1": R(t + len(A) / SR), "segs": seg(tb, t + a2_0, t + len(A) / SR)})
place.append((t, A)); t += len(A) / SR + GAP
new.append({"i": 102, "scene": "news", "args": {"pause": 1}, "sub": NL['B']['text'], "t0": R(t), "t1": R(t + len(B) / SR), "segs": seg(NL['B']['text'], t, t + len(B) / SR)})
place.append((t, B)); t += len(B) / SR + GAP
def move(idx_from, idx_to, t_new):   # move a block of consecutive old lines, keeping internal gaps
    d = t_new - L[idx_from]['t0']
    for k in range(idx_from, idx_to + 1): new.append(shifted(L[k], d))
    a, b = L[idx_from]['t0'], L[idx_to]['t1']
    place.append((t_new, v[int(a * SR):int(b * SR)]))
    return L[idx_to]['t1'] + d
t = move(7, 7, t) + GAP                       # title -> youth: scene change
t = move(1, 6, t) + GAP + L[6]['args'].get('pause', 0)   # reveal (pause 0.3) -> title
t = move(8, 8, t)
gap_orig = L[9]['t0'] - L[8]['t1']
D_raw = (t + gap_orig) - L[9]['t0']
NSH = 2 * math.ceil(D_raw * FPS / 2)          # even frame count -> integer sample shift
D = NSH / FPS
print('L9 shift raw %.4f s -> %d frames = %.5f s (gap L8->L9 %.3f)' % (D_raw, NSH, D, L[9]['t0'] + D - t))
for k in range(9, len(L)): new.append(shifted(L[k], D))
cut_old = L[9]['t0'] - 0.3                    # inside the silent gap before L9
dur = R(tl['duration'] + D); N = int(round(dur * SR)) + 10
voice = np.zeros(N)
for t0, w in place:
    i = int(round(t0 * SR)); voice[i:i + len(w)] += w
i_old = int(round(cut_old * SR)); i_new = i_old + int(round(D * SR)); tail = v[i_old:]
voice[i_new:i_new + len(tail)] = tail; voice = voice[:i_new + len(tail)]
assert abs(int(round(D * SR)) - D * SR) < 1e-6
sf.write('voice_v9.wav', voice, SR, subtype='PCM_16')
# lip-sync env: same formula as tts38mv.py, normalised with the ORIGINAL constant; tail = old env shifted
def rms(x, nfr): x = np.pad(x, (0, max(0, nfr * HOP - len(x)))); return np.sqrt(np.mean(x[:nfr * HOP].reshape(nfr, HOP) ** 2, axis=1))
nf_old = len(tl['env']); r_old = rms(v, nf_old); ref = np.percentile(r_old[r_old > 1e-4], 90)
chk = np.clip(r_old / (ref + 1e-9), 0, 1); print('env recompute max err', float(np.abs(np.round(chk, 2) - np.array(tl['env'])).max()))
FC = math.ceil((L[9]['t0'] + D - 0.15) * FPS)  # first frame that belongs to L9 (reused from the old video)
nf_new = nf_old + NSH
envn = list(np.round(np.clip(rms(voice, nf_new) / (ref + 1e-9), 0, 1), 2)[:FC]) + tl['env'][FC - NSH:]
envn = envn[:nf_new]
for k, l in enumerate(new): assert k == 0 or l['t0'] > new[k - 1]['t1'], (k, l['i'])
json.dump({"duration": dur, "lines": new, "env": [float(x) for x in envn]}, open('timeline_v9.json', 'w'), ensure_ascii=False, indent=1)
json.dump({"shift_frames": NSH, "shift_s": D, "FC": FC, "cut_old_s": cut_old, "dur": dur}, open('v9/shift.json', 'w'), indent=1)
for l in new[:14]: print(l['i'], l['scene'], l['t0'], l['t1'], l['sub'][:40])
print('dur', dur, 'FC', FC, 'old FC', FC - NSH)
