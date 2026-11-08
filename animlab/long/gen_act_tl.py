# 연기·표정 실험실 타임라인 + 소리(act1에 수능 편 제로 대사 z1을 얹는다)
import json, os, numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
SEG = [('act1', 6.4, '① 말하기'),
       ('act2', 6.0, '② 눈 연기'),
       ('act3', 5.6, '③ 표정 전환'),
       ('act4', 6.0, '④ 깜짝 리액션'),
       ('act5', 7.2, '⑤ 감정 몸짓')]
t, lines = 0.4, []
for sid, d, sub in SEG: lines.append({'id': sid, 'scene': sid, 'args': {}, 't0': round(t, 3), 't1': round(t + d, 3), 'sub': sub}); t += d + 0.3
DUR = round(t, 3); SR = 24000
src = '../../suneung01/long/takes/z1_0.wav'; a, sr = sf.read(src); assert sr == SR
W = json.load(open('../../suneung01/long/words.json'))['z1']
A0 = lines[0]['t0'] - 0.15 + 1.0  # act1의 lt 1.0초에 대사 시작
mix = np.zeros(int((DUR + 0.5) * SR)); i0 = int(A0 * SR); mix[i0:i0 + len(a)] += a
sf.write('act_audio.wav', mix, SR)
# 소리 크기: 10ms마다 RMS(정규화), 24fps env
hop = SR // 100; rms = np.array([np.sqrt(np.mean(mix[i:i + hop] ** 2)) for i in range(0, len(mix) - hop, hop)])
ref = np.percentile(rms[rms > 1e-4], 92) if (rms > 1e-4).any() else 1; amp = np.clip(rms / ref, 0, 1)
amp = np.convolve(amp, np.ones(3) / 3, mode='same')
env = [round(float(amp[int(f / 24 * 100)]) if int(f / 24 * 100) < len(amp) else 0, 2) for f in range(int(DUR * 24) + 2)]
TL = {'duration': DUR, 'lines': lines, 'env': env, 'amp': {'t0': 0, 'dt': 0.01, 'v': [round(float(x), 2) for x in amp]},
      'say': {'text': '서윤아? 내일 시험 아니야? 안 자고 뭐해?', 'words': W['words'], 't0': round(A0, 3), 't1': round(A0 + len(a) / SR, 3)}}
json.dump(TL, open('timeline_act.json', 'w'), ensure_ascii=False)
print(DUR, A0, len(a) / SR, [(l['id'], l['t0'], l['t1']) for l in lines])
