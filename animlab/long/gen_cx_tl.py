# 복잡한 감정 갤러리 타임라인(소리 없음)
import json, os
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
SEG = [(4.2, '① 웃음(가면) + 슬픔'), (3.6, '② 웃음 + 아쉬움'), (4.4, '③ 축하 + 분함'), (4.0, '④ 토라짐 + 봐 줬으면'), (4.4, '⑤ 하고 싶음 + 두려움'),
       (4.0, '⑥ 긴장 → 풀림'), (4.0, '⑦ 실망 + 받아들임'), (4.2, '⑧ 눈물 + 웃음'), (4.0, '⑨ 행복한 기억 + 아픔'), (3.8, '⑩ 놀람 + 짜증 + 웃음')]
t, lines = 0.4, []
for i, (d, sub) in enumerate(SEG, 1): lines.append({'id': f'cx{i}', 'scene': f'cx{i}', 'args': {}, 't0': round(t, 3), 't1': round(t + d, 3), 'sub': None}); t += d + 0.3
json.dump({'duration': round(t, 3), 'lines': lines}, open('timeline_cx.json', 'w'), ensure_ascii=False, indent=1)
print(round(t, 3), [(l['id'], l['t0']) for l in lines])
