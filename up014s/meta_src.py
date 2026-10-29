import json, os, hashlib
SP = '/tmp/claude-0/-home-claude/8ea42618-92c7-5880-934a-1a398f438784/scratchpad'
C = '📌 혼자가 편한데 외로운 이유, 전체 실험은 채널에서!'
S = [
 ('014-1_고슴도치', '2026. 12. 1.', '오후 12:00', '가까우면 찔리고, 멀면 추운 고슴도치 🦔 #상식실험실',
  '추운 겨울날, 고슴도치들은 얼지 않으려고 바짝 붙었다가 가시에 찔려 다시 떨어졌어요.\n그렇게 오가다 찾은 견딜 만한 거리. 쇼펜하우어는 그 거리를 \'예의\'라고 불렀습니다.',
  '💬 나에게 딱 좋은 사람 사이의 거리는? 👇', '📖 쇼펜하우어 『소품과 부록』(1851)', '#상식실험실 #쇼펜하우어 #고슴도치딜레마 #인간관계 #철학 #shorts'),
 ('014-2_낯선사람', '2026. 12. 1.', '오후 7:00', '낯선 사람에게 말을 걸면? 예상과 정반대 🚆 #상식실험실',
  '시카고 출근 기차에서, 옆자리 낯선 사람과 이야기하며 가기 vs 혼자 조용히 가기.\n사람들은 혼자가 더 편할 거라 예상했지만, 이야기한 쪽의 출근길이 더 즐거웠어요. 그리고 말을 건 사람 중 거절당한 사람은 한 명도 없었습니다.',
  '💬 매일 스치기만 하던 사람, 누가 떠오르나요? 👇', '📚 Epley & Schroeder (2014) Journal of Experimental Psychology: General', '#상식실험실 #외로움 #인간관계 #심리학 #실험 #shorts'),
 ('014-3_먼저연락', '2026. 12. 2.', '오후 12:00', '3년 만에 먼저 보낸 한 줄 📱 #상식실험실',
  '3년째 연락이 끊긴 대학 동기에게 "잘 지내? 갑자기 생각나서." 숫자 1은 금방 사라졌는데, 답이 없습니다.\n그런데 연구에 따르면, 받는 사람은 보낸 사람이 짐작한 것보다 훨씬 반가워한대요. 답장은 왔을까요?',
  '💬 먼저 연락하고 싶은 한 사람, 관계만 남겨 주세요 👇', '📚 Liu, Rim, Min & Min (2022) Journal of Personality and Social Psychology', '#상식실험실 #외로움 #연락 #인간관계 #심리학 #shorts'),
]
out = {}
for name, date, time, title, body, q, src, tags in S:
    f = f'{SP}/replace/out_new6/쇼츠_{name}.mp4'
    th = f'{SP}/replace/out_new6/썸네일_{name}.png'
    h = hashlib.sha256(open(f, 'rb').read()).hexdigest()
    out[name] = {'title': title, 'desc': '\n'.join([body, C, q, src, '※ 제로의 이야기는 이해를 돕기 위한 연출입니다' if name != '014-1_고슴도치' else '', tags]).replace('\n\n', '\n'), 'date': date, 'time': time, 'ep': '014',
                 'file': f, 'thumb': th, 'size': os.path.getsize(f), 'sha': h, 'vname': os.path.basename(f), 'parts': []}
    assert len(title) <= 100 and len(out[name]['desc']) < 4900
    print(name, date, time, len(title), os.path.getsize(f), os.path.getsize(th))
json.dump(out, open('meta_s6.json', 'w'), ensure_ascii=False)
