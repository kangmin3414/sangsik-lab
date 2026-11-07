"""Build style38.json for a story-format episode from script.py tone fields (FORMAT.md)."""
import json
from script import S
TONE = {'tense': '조금 빠르고 긴장된 목소리로.', 'playful': '장난스럽고 가볍게.', 'whisper': '낮고 조용하게, 속삭이듯.',
        'warm': '따뜻하고 조금 느리게.', 'tremble': '살짝 떨리는 목소리로, 망설이며.', 'excited': '들뜨고 밝게, 신나서.',
        'deadpan': '무표정하게 툭 던지듯.', 'tired': '지치고 낮은 목소리로, 힘없이.'}
st = {
 "voices": {"N": "Schedar", "Z": "Puck", "D": "Sadaltager", "T": "Charon", "P": "Sulafat", "H": "Fenrir", "M": "Leda"},
 "base": "한국어 드라마 내레이터. 이야기를 들려주듯 담담하고 또렷하게, 보통 빠르기로. 과장하지 말고, 장면의 분위기를 살려서.",
 "char": {
  "Z": "제로. 삼십 대 중반의 순하고 눈치 보는 회사원 남자. 자연스러운 대화체로.",
  "D": "박사. 칠십 대의 다정한 할아버지. 차분하고 지혜롭게, 아끼는 이웃 청년에게 말하듯 따뜻하게.",
  "T": "오 팀장. 사십 대 후반의 남자 팀장. 낮고 서글서글한 목소리, 사람 좋은 말투.",
  "P": "박 과장. 사십 대 초반의 여자 회사원, 아이 둘의 엄마. 말이 빠르고 다정하며 눈치가 빠른 말투.",
  "H": "한 주임. 삼십 대 초반의 밝은 남자 회사원. 평소엔 높고 활기찬 목소리.",
  "M": "민지. 이십 대 중반의 신입 여자 사원. 조심스럽고 공손한 말투."
 },
 "scene": {"hroom": "밤의 노래방, 조용하고 의미심장하게.", "hbench": "자정의 고요함처럼 차분하고 따뜻하게.",
           "hphone": "조용한 밤처럼 낮고 차분하게.", "hclimax": "긴장감 있게, 장면에 몰입해서."},
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
