import json
P = json.load(open('../essay/plan6.json')); plan = P['plan']
lines = [p for p in plan if p['kind'] == 'line']
def at(prefix):
    for p in lines:
        if p['text'].startswith(prefix): return p['t']
    raise KeyError(prefix)
q = dict(hit=P['crash_at'], brickword=at('벽돌이었다'), ghost=at('한 걸음만'), wave=at('나는 괜찮다고'), mom=at('엄마한테는'), night=at('그런데 그날'), think=at('한 걸음 빨랐던'),
         title=P['title_at'], yama=at('1945년 8월'), y2=at('출장 중'), y3=at('화상을'), y4=at('이번에도'), y5=at('그리고 살아남았다'), y6=at('수많은'), y7=at('왜 그였을까'), y8=at('아니면, 그가'),
         h1=at('이 질문의'), h2=at('전자 같은'), h3=at('1935년'), tree=at('1957년'), dead=at('고양이가 죽은'), many=at('이른바'), q=at('그리고 여기에'),
         b1=at('고양이의 자리'), b2=at('장치가'), b3=at('끝난 쪽'), b4=at('같은 일이'), b5=at('그래도 내 눈에'), b6=at('1990년대'), b7=at('이름은, 양자'), b8=at('이걸 일상으로'), b9=at('남들이 보기에'), b10=at('나는, 절대'), b11=at('처음엔'),
         g1=at('기록상'), g2=at('이백 살'), g3=at('삼백 살'), g4=at('몸은 망가'), g5=at('천 살'), g6=at('오십억'), g7=at('끝이 없다는 건'), g8=at('끝이, 없다'),
         r1=at('그런데, 이 생각을'), r2=at('죽음은 스위치'), r3=at('상자 속 장치'), r4=at('게다가'), r5=at('이건 증명된'), r6=at('그리고 내가 놓친'), r7=at('벽돌에 맞은 그'), r8=at('엄마의 휴대폰'), r9=at('그 세계에는'),
         u1=at('어쩌면 이 영상'), u2=at('그렇다면 이렇게'), u3=at('증명할 수는'), s1=at('하지만 이 상상'), s2=at('지금까지의 영생'), s3=at('그래도 이별'), s4=at('새로운 사람을'),
         e1=at('다시, 화요일'), e2=at('아무 일'), e3=at('오늘 아침'), e4=at('그 많은'), e5=at('2008년'), e6=at('끝을 떠올리면'), e7=at('끝이 있어서'), e8=at('다음 날 점심'), e9=at('웬일이냐고'), e10=at('나는, 언제든'), e11=at('그래서 오늘이'),
         end=P['end_at'], END=P['END'], silence=P['silence_from'], warm=P['warm_at'])
def scene(t):
    if t < q['ghost'] - 0.01: return 'qbrick'
    if t < q['wave'] - 0.01: return 'qghost'
    if t < q['night'] - 0.01: return 'qwave'
    if t < q['title'] - 0.01: return 'qnight'
    if t < q['yama'] - 0.01: return 'qtitle'
    if t < q['h1'] - 0.01: return 'qyama'
    if t < q['tree'] - 0.01: return 'qquantum'
    if t < q['g1'] - 0.01: return 'qtree'
    if t < q['g8'] - 0.01: return 'qbirth'
    if t < q['r1'] - 0.01: return 'qdark'
    if t < q['u1'] - 0.01: return 'qturn'
    if t < q['s1'] - 0.01: return 'qrain'
    if t < q['e1'] - 0.01: return 'qtogether'
    if t < q['e5'] - 0.01: return 'qsite2'
    if t < q['e6'] - 0.01: return 'qkurtz'
    if t < q['e8'] - 0.01: return 'qlines'
    return 'qend'
L = []
for p in lines:
    if p['t'] >= q['title'] - 0.01 and not any(l['scene'] == 'qtitle' for l in L) and p['t'] >= q['yama'] - 0.01:
        L.append({'i': len(L), 'scene': 'qtitle', 'args': {}, 'sub': '', 't0': q['title'], 't1': q['title'] + 3.6})
    L.append({'i': len(L), 'scene': scene(p['t']), 'args': {}, 'sub': p['text'], 't0': p['t'], 't1': p['t'] + p['dur']})
L.append({'i': len(L), 'scene': 'qendcard', 'args': {}, 'sub': '', 't0': q['end'], 't1': q['END']})
# hold each scene until the next line starts (no gap pops): the engine already holds the last line
json.dump({'duration': q['END'], 'lines': L, 'env': [0, 0, 0], 'q': q}, open('timeline_q6.json', 'w'), ensure_ascii=False, indent=1)
print(len(L), {k: round(v, 1) for k, v in list(q.items())[:12]})
