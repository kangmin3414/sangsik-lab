"""style38.json for ep02 (first-person: narration lines are read by Zero's voice with a monologue style)."""
import json
from script import S
TONE = {'tense': '조금 빠르고 긴장된 목소리로.', 'playful': '장난스럽고 가볍게, 피식 웃음기 있게.', 'whisper': '낮고 조용하게, 속삭이듯.',
        'warm': '따뜻하고 조금 느리게.', 'tremble': '살짝 떨리는 목소리로, 깜짝 놀라서.', 'excited': '들뜨고 밝게, 신나서.',
        'deadpan': '무표정하게 툭 던지듯, 건조하게.', 'tired': '지치고 낮은 목소리로, 힘없이.'}
st = {
 "voices": {"N": "Puck", "Z": "Puck", "T": "Charon", "H": "Fenrir", "O": "Gacrux"},
 "base": "제로의 1인칭 독백. 삼십 대 중반의 회사원 남자가 친한 친구에게 자기가 겪은 일을 털어놓듯, 담담하고 자연스러운 대화체로. 건조한 유머가 살짝 묻어나게, 과장하지 말고 보통 빠르기로.",
 "char": {
  "Z": "제로. 삼십 대 중반의 순하고 눈치 보는 회사원 남자. 실제 대화하듯 자연스럽게.",
  "T": "오 팀장. 사십 대 후반의 남자 팀장. 낮고 짧게, 감정이 잘 드러나지 않는 사무적인 말투.",
  "H": "한 주임. 삼십 대 초반의 밝은 남자 회사원. 높고 활기차고 붙임성 있는 말투.",
  "O": "엄마. 육십 대 초반의 한국 어머니. 따뜻하고 수다스러우며 조금 느린 말투, 표준어."
 },
 "scene": {"mhome": "밤늦게 혼자 있는 사람처럼 낮고 조용하게.", "msis": "조용하고 낮게, 울컥함을 참으며.",
           "mrecov": "따뜻하고 조용하게.", "mnight": "편안하고 따뜻하게."},
 "line": {}, "seg": {}, "cap_pause": [0.75, 0.55]
}
for i, (sc, a, sub, sp) in enumerate(S):
    tn = a.get('tone')
    if not tn or a.get('silent'): continue
    if a.get('segs'):
        for j in range(len(a['segs'])): st['seg'][f'{i}_{j}'] = TONE[tn]
    else: st['line'][str(i)] = TONE[tn]
json.dump(st, open('style38.json', 'w'), ensure_ascii=False, indent=1)
print('lines', len(st['line']), 'segs', len(st['seg']))
