# Re-point episodes 007/008 at the v2 rebuilds and re-cut their Shorts (old v1 Shorts stay in out/ untouched)
import json, shutil, os
HERE = os.path.dirname(os.path.abspath(__file__))
p = json.load(open(os.path.join(HERE, 'plan.json')))
shutil.copy(os.path.join(HERE, 'plan.json'), os.path.join(HERE, 'plan_v1_backup.json'))
p['eps']['007'].update(dir='descartes2', video='만약에연구소_실험007_데카르트처럼모든걸의심하기_v2.mp4', outro_line=53)
p['eps']['008'].update(dir='zhuangzi2', video='만약에연구소_실험008_장자처럼쓸모없음즐기기_v2.mp4', outro_line=56)
S7 = [([1, 6], ['400년 전, 길을 잃은', '스물세 살 청년'], 6),
      ([12, 15], ['지퍼 작동 원리,', '설명할 수 있나요?'], 14),
      ([17, 20], ['명문대생 절반이', '틀린 문제'], 19),
      ([21, 22], ['공유 버튼 누르기 전', '딱 10초'], 22),
      ([24, 27], ['시작이 어려운', '진짜 이유'], 27),
      ([29, 31], ['진짜 얼굴 vs AI 얼굴', '구별할 수 있을까?'], 30),
      ([32, 36], ['나는 생각한다,', '그러므로 존재한다'], 36),
      ([38, 41], ['최고만 고르면', '덜 행복하다?'], 40),
      ([45, 49], ['모든 걸 의심한', '철학자의 눈물'], 47)]
S8 = [([0, 4], ['쉬는 날에도', '쓸모 있어야 할까?'], 4),
      ([13, 15], ['쉬는 게', '시간 낭비라고요?'], 13),
      ([17, 21], ['쓸모없다고', '깨 버린 박'], 20),
      ([24, 26], ['가만히 있느니', '전기 충격?'], 25),
      ([27, 28], ['멍때리기의', '진짜 쓸모'], 27),
      ([30, 31], ['19년 쓴 칼이', '새것 같은 이유'], 30),
      ([32, 33], ['밤새우는 대신', '먼저 자 봤더니'], 32),
      ([35, 39], ['왕의 제안을', '거절한 철학자'], 38),
      ([43, 45], ['물고기의 즐거움을', '어떻게 아나?'], 43),
      ([46, 51], ['평생 말다툼한 친구가', '떠난 뒤'], 49),
      ([52, 53], ['장자의', '나비 꿈'], 52)]
keep = [s for s in p['shorts'] if s['ep'] not in ('007', '008')]
new = []
for ep, S in (('007', S7), ('008', S8)):
    tag = '데카르트' if ep == '007' else '장자'
    for k, (lines, title, thumb) in enumerate(S, 1):
        new.append({'ep': ep, 'name': f'{ep}v2-{k}_{tag}', 'lines': lines, 'title': title, 'thumb': thumb})
p['shorts'] = keep + new
json.dump(p, open(os.path.join(HERE, 'plan.json'), 'w'), ensure_ascii=False, indent=1)
print(len(new), 'v2 shorts')
