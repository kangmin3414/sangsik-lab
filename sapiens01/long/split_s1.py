"""s1 테이크를 쉼표의 쉼(신호등, / 지하철,)에서 셋으로 나눈다 → s1a·s1b·s1c (대본 글자는 그대로, 컷마다 한 박자 쉬게)."""
import soundfile as sf, numpy as np, json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
w, sr = sf.read('/dev/shm/sp/takes/s1_1.wav', dtype='float32')
a = np.abs(w); a0 = max(0, np.where(a > a.max() * 0.02)[0][0] - int(0.03 * sr))
c1, c2 = a0 + int(1.526 * sr), a0 + int(3.552 * sr)          # 쉼 1.406~1.646, 3.431~3.672 의 가운데
T = json.load(open('takes.json'))
for k, (i, j) in {'s1a': (a0, c1), 's1b': (c1, c2), 's1c': (c2, len(w))}.items():
    fn = f'/dev/shm/sp/takes/{k}.wav'; sf.write(fn, w[i:j], sr)
    T[k] = {'take': fn, 'cer': T['s1']['cer'], 'from': 's1_1', 'hyp': '', 'text': ''}
json.dump(T, open('takes.json', 'w'), ensure_ascii=False, indent=1)
print('split', round((c1 - a0) / sr, 2), round((c2 - a0) / sr, 2), round(len(w) / sr, 2))
