"""말 가림 재기: 믹스의 갈래(목소리 · 배경음 · 효과음)를 말소리 띠(300~4000Hz)에서 비교해 말이 묻히는 곳을 찾는다.
   ML_STEMS=1 python3 build_ml.py   # /dev/shm/ml/stems.npz를 남긴다(bedmix · sfxmix = 믹스에 실제로 들어간 크기)
   python3 mask_ml.py [기준.json]    # 결과 /dev/shm/ml/mask.json. 기준 파일(앞서 저장한 mask.json)을 주면 줄마다 달라진 만큼(dB)도 보여 준다
   1) 줄마다: 목소리 - (배경음 + 효과음). 이 편은 평균 12dB 안팎, 낮은 줄이 8~10dB.
   2) 낱말마다: 목소리 - 효과음이 6dB에 못 미치는 낱말 = 효과음이 낱말을 덮는 곳. 효과음을 낱말 뒤로 옮기거나 줄인다.
   왜 따로 재나: 음성 인식(qa_ml.py)은 짧은 줄에서 창을 0.1초만 옮겨도 한두 글자가 뒤집힌다('스님' ↔ '선생님', '바퀴' ↔ '박귀'. v1과 v2를 여섯 창으로 비교해 확인).
   '조금 나빠졌는지'는 이 숫자로 본다(믹스를 바꾼 만큼만 움직인다). 음성 인식은 통째로 틀리는 줄을 찾는 데 쓴다.
   2026-11-22에 이걸로 찾은 것: '나'도요(효과음 셋이 겹쳐 2dB), 마지막 문장의 '없었습니다'(-1dB), 바람 소리가 덮은 28번 첫머리(3.5dB), 음악이 부푼 17번 줄(배경음과 6.3dB)."""
import json, sys, os, numpy as np
from scipy.signal import butter, sosfilt
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
SR = 44100; Z = np.load('/dev/shm/ml/stems.npz'); TL = json.load(open('timeline_ml.json'))
sos = butter(4, [300 / (SR / 2), 4000 / (SR / 2)], 'band', output='sos')
v = sosfilt(sos, Z['voice'].mean(axis=1)); bd = sosfilt(sos, Z['bedmix'].mean(axis=1)); sx = sosfilt(sos, Z['sfxmix'].mean(axis=1)); nz = bd + sx
db = lambda x: 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9) if len(x) else -120.0
base = json.load(open(sys.argv[1])) if len(sys.argv) > 1 else {}; out = {}; words = []
for l in TL['lines']:
    if not l.get('v'): continue
    a, b = int(l['t0'] * SR), int(l['t1'] * SR); act = np.abs(v[a:b]) > 10 ** (-50 / 20)                 # 말하는 순간만
    out[l['id']] = round(float(db(v[a:b][act]) - db(nz[a:b][act])), 1)
    ws = l.get('words') or []
    for i, w in enumerate(ws):
        t0 = l['t0'] + w['t']; t1 = min(l['t0'] + ws[i + 1]['t'] if i + 1 < len(ws) else l['t1'], t0 + 0.6); i0, i1 = int(t0 * SR), int(t1 * SR); ac = np.abs(v[i0:i1]) > 10 ** (-50 / 20)
        if ac.sum() < SR * 0.08: continue
        words.append((round(float(db(v[i0:i1][ac]) - db(sx[i0:i1][ac])), 1), l['id'], w['w'], round(t0, 2)))
json.dump(out, open('/dev/shm/ml/mask.json', 'w'))
low = sorted(out.items(), key=lambda kv: kv[1])[:6]
print('줄: 목소리 - 나머지(dB) 평균', round(float(np.mean(list(out.values()))), 1), '| 가장 낮은 줄', low)
if base:
    d = {k: round(out[k] - base[k], 1) for k in out if k in base}; worst = sorted(d.items(), key=lambda kv: kv[1])[:6]
    print('    기준과의 차이: 평균', round(float(np.mean(list(d.values()))), 2), 'dB | 가장 많이 떨어진 줄', worst)
hit = sorted(w for w in words if w[0] < 6)
print(f'낱말: 효과음이 덮는 곳(목소리 - 효과음 < 6dB) {len(hit)}곳')
for m, lid, w, t in hit: print(f'    {lid:4s} {t:7.2f}s  {w:10s} {m:5.1f} dB')
