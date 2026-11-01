"""Build shots.json (one shot per script line) for anim_ep02.html: picture, camera move, phone/card overlays, counter.
Pictures: art/<key>.jpg (converted from the generated pngs). FOCUS holds each picture's points of interest (0..1)."""
import json, html, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from script import S, STORY_DATE

FOCUS = json.load(open('focus.json')) if os.path.exists('focus.json') else {}
def F(key, name='c'): return FOCUS.get(key, {}).get(name, [0.5, 0.45])
E = html.escape

# ---------- phone builders ----------
def bubble(side, text, time='', unread=False, name=None, ava='', hl=None):
    t = E(text)
    for w in (hl or []): t = t.replace(E(w), f'<span class="hl">{E(w)}</span>')
    meta = f'<div class="meta">{"<span class=un>1</span>" if unread else ""}<span>{E(time)}</span></div>'
    if side == 'me':
        return f'<div class="row me">{meta}<div class="bub">{t}</div></div>'
    nm = f'<div class="who2">{E(name)}</div>' if name else ''
    av = f'<div class="ava">{E(ava)}</div>' if ava else '<div class="ava"></div>'
    return f'{nm}<div class="row them">{av}<div class="bub">{t}</div>{meta}</div>'
def div(text): return f'<div class="divd">{E(text)}</div>'
def phone(header, items, inp='', caret=False, big=False, x=None, y=70, scale=0.92, clock='9:13', typing_big=False, top=False):
    w = 520 * scale; x = (1920 - w) / 2 if x is None else x
    inbox = (f'<div class="inbox{" big" if typing_big else ""}">{inp}{"<span class=caret></span>" if caret else ""}</div>')
    bar = f'<div class="inbar">{inbox if not typing_big else ""}<div class="send">➤</div></div>' if not typing_big else inbox
    jc = 'flex-start' if top else 'flex-end'
    return (f'<div class="phone{" big" if big else ""}" style="left:{x:.0f}px;top:{y}px;transform:scale({scale});transform-origin:0 0">'
            f'<div class="screen"><div class="sbar"><span>{E(clock)}</span><span>▮▮▮ 🔋</span></div>'
            f'<div class="chead"><span class="back">‹</span>{E(header)}</div>'
            f'<div class="clist" style="justify-content:{jc}">{"".join(items)}</div>{bar}</div></div>')
def card(htm, x, y, w=None, cls='card', extra=''):
    ws = f'width:{w}px;' if w else ''
    return f'<div class="{cls}" style="left:{x}px;top:{y}px;{ws}{extra}">{htm}</div>'
def keyframes(fr_html): return [{'f': f, 'html': h} for f, h in fr_html]
def typer(full, n=22, a=0.0, b=0.92, **kw):
    out = []
    for s in range(n + 1):
        k = round(len(full) * s / n); out.append((a + (b - a) * s / n, kw['make'](full[:k], s < n)))
    return out

# ---------- the chats ----------
DRAFT = S[12][1]['segs'][0][1]
def boss_chat(stage, clock='9:13'):
    it = [div(STORY_DATE)]
    if stage >= 1: it.append(bubble('me', DRAFT, '오전 9:12', unread=(stage == 1)))
    if stage >= 2: it.append(bubble('them', 'ㅇㅇ', '오전 9:13', name='오 팀장', ava='오', hl=['ㅇㅇ']))
    return phone('오 팀장', it, clock=clock)
GROUP = [('them', '오늘 보고 완료했습니다!', '한 주임', '한'), ('them', '오~ 수고했어요~ 👍', '오 팀장', '오'),
         ('them', '자료 공유드립니다 📎', '박 과장', '박'), ('them', '넵 감사해요~', '오 팀장', '오'),
         ('me', '주간보고 올렸습니다.', '', ''), ('them', 'ㅇㅇ', '오 팀장', '오')]
def group_chat(upto, hl_last=False):
    it = []
    for n, (side, txt, nm, av) in enumerate(GROUP[:upto]):
        it.append(bubble(side, txt, '오후 5:5%d' % n, name=nm or None, ava=av, hl=['ㅇㅇ'] if (hl_last and n == upto - 1) else None))
    return phone('영업2팀 (6)', it, clock='9:52')
OO = ['2026년 10월 28일', '10월 21일', '10월 14일', '9월 30일', '9월 2일', '7월 15일', '5월 20일', '2025년 3월 11일']
def oo_list():
    it = []
    for d in OO[::-1][:5]: it += [div(d), bubble('them', 'ㅇㅇ', '오후 6:0' + str(len(it) % 10), name='오 팀장', ava='오', hl=['ㅇㅇ'])]
    return phone('오 팀장', it, clock='9:58') + card('ㅇㅇ <b style="color:#e8432f;font-size:64px">14</b>개', 1290, 380, cls='tag')
MOM_MSG = S[56][1]['segs'][0][1]
def mom_chat(stage, clock='10:12'):
    it = [div(STORY_DATE), bubble('them', MOM_MSG, '오후 6:31', name='엄마', ava='엄')]
    if stage >= 1: it.append(bubble('me', 'ㅇㅇ', '오후 10:12', unread=(stage == 1), hl=['ㅇㅇ']))
    return phone('엄마', it, clock=clock)
SIS_NIGHT = [('me', '오빠가 ㅇㅇ 보냈다', '오후 10:16'), ('me', '많이 힘든가보다 전화 안할란다', '오후 10:16'),
             ('them', 'ㅋㅋㅋ 엄마 오빠는 원래 ㅇㅇ야', '오후 10:20'), ('me', '그래도 내일 끝나면 갈비탕 사줘야겟다', '오후 10:21'),
             ('me', '엄마는 죽 먹어야 된대', '오후 10:21')]
def sis_chat(n, morning=False, hl=None):
    it = [div(STORY_DATE)]
    for k, (side, txt, tm) in enumerate(SIS_NIGHT[:n]):
        it.append(bubble(side, txt, tm, name='작은딸' if side == 'them' else None, ava='딸' if side == 'them' else '', hl=(hl if k == 1 and hl else None)))
    if morning:
        it += [div('2026년 11월 5일 목요일'), bubble('me', '오빠 패딩 입고 왔다 ㅎㅎ 춥다니까 말을 듣네', '오전 7:52')]
    return phone('작은딸 💕', it, big=True, clock='8:14')
SIS_OLD = [('2025년 3월', [('me', '오빠가 ㅇ 하나 보냈다 많이 바쁜가봐')]),
           ('2025년 8월', [('them', '킹받네는 엄청 화났다는 뜻'), ('me', '왕이 화가 났다는거니'), ('them', '왕 아님')]),
           ('2026년 5월', [('them', 'ㄱㅊ은 괜찮다는 뜻'), ('me', 'ㄱㅊ ㄱㅊ ㄱㅊ')]),
           ('2026년 9월', [('me', '오빠가 답이 없다 회의중인가보다')]),
           ('2026년 10월', [('me', '오빠가 이모티콘 보냈다!! 올해 처음이다')])]
def sis_old(k):
    d, msgs = SIS_OLD[k]; it = [div(d)]
    for side, txt in msgs: it.append(bubble(side, txt, '', name='작은딸' if side == 'them' else None, ava='딸' if side == 'them' else ''))
    return phone('작은딸 💕', it, big=True, clock='8:21', top=True)
BACK = '복귀했습니다. 어머니 검사 잘 끝났습니다.'
def boss_chat2(stage):
    it = [div('2026년 11월 5일 목요일'), bubble('me', BACK, '오후 12:52', unread=(stage == 1))]
    if stage >= 2: it.append(bubble('them', 'ㅇㅇ', '오후 12:53', name='오 팀장', ava='오', hl=['ㅇㅇ']))
    return phone('오 팀장', it, clock='12:53')
NIGHT = S[117][2]
def mom_chat2(stage):
    it = [div('2026년 11월 5일 목요일'), bubble('me', NIGHT, '오후 9:40')]
    if stage >= 1: it.append(bubble('them', 'ㅇㅇ❤️', '오후 9:40', name='엄마', ava='엄', hl=['ㅇㅇ']))
    if stage >= 2: it.append(bubble('them', '이거 맞게 쓴 거니?', '오후 9:41', name='엄마', ava='엄'))
    if stage >= 3: it.append(bubble('me', '응. 완벽해', '오후 9:41'))
    return phone('엄마', it, clock='9:41')

# ---------- shots ----------
def shot(img, z0=1.0, z1=1.06, f0=None, f1=None, **kw):
    f0 = f0 or F(img); f1 = f1 or f0
    d = {'key': img, 'img': f'art/{img}.jpg', 'z0': z0, 'z1': z1, 'fx0': f0[0], 'fy0': f0[1], 'fx1': f1[0], 'fy1': f1[1]}
    d.update(kw); return d
def ui_bg(img, ui, **kw): return shot(img, 1.02, 1.05, blur=7, dim=0.45, ui=ui, **kw)
draft_box = lambda txt, caret: phone('오 팀장', [div(STORY_DATE)], typing_big=True, inp=E(txt).replace(E('죄송합니다'), '죄송합니다'), caret=caret, clock='8:43')

SH = {}
SH[0] = shot('D1', 1.0, 1.04, ui=keyframes([(0, card(boss_chat(1), 0, 0, cls='', extra='')), (0.35, card(boss_chat(2), 0, 0, cls=''))]))
for i in (0,): SH[i]['ui'] = keyframes([(0, phone('오 팀장', [div(STORY_DATE), bubble('me', DRAFT, '오전 9:12')], x=1230, y=110, scale=0.86, clock='9:13')),
                                       (0.38, phone('오 팀장', [div(STORY_DATE), bubble('me', DRAFT, '오전 9:12'), bubble('them', 'ㅇㅇ', '오전 9:13', name='오 팀장', ava='오', hl=['ㅇㅇ'])], x=1230, y=110, scale=0.86, clock='9:13'))])
SH[1] = ui_bg('D1', keyframes([(0, boss_chat(2)), (0.1, boss_chat(2) + card('ㅇㅇ', 1330, 420, cls='think', extra='font-size:96px;color:#e8432f'))]))
SH[2] = ui_bg('D1', keyframes([(0, boss_chat(2) + card('ㅇㅇ', 1330, 420, cls='think', extra='font-size:96px;color:#e8432f'))]))
SH[3] = shot('D1', 1.06, 1.22, F('D1', 'zero'), F('D1', 'zero'))
SH[4] = shot('W2', 1.0, 1.08, F('W2', 'zero'), sepia=True, dim=0.15)
SH[5] = shot('T1', 1.0, 1.04, dim=0.2, ui=[{'f': 0, 'html': '<div class="title">팀장님 답장이<br><span class="q">\'ㅇㅇ\'</span><br>두 글자였다</div>'}], nosub=True)
SH[6] = shot('B1', 1.0, 1.05, [0.5, 0.5], F('B1', 'zero'))
SH[7] = shot('B1', 1.05, 1.16, F('B1', 'zero'))
SH[8] = shot('B2', 1.0, 1.05)
SH[9] = shot('B2', 1.05, 1.09)
SH[10] = shot('B2', 1.09, 1.12, ui=keyframes([(0.08, card('<div style="font-size:24px;color:#777;font-weight:600">전자결재 · 휴가신청서</div>반차(오전) · 11월 5일(목)<div style="font-size:28px;color:#d98c00;margin-top:8px">⏳ 결재 대기</div>', 1240, 150, 560))]))
SH[11] = shot('B2', 1.12, 1.22, F('B2', 'zero'))
DSTEP = typer(DRAFT, 24, 0.0, 0.92, make=lambda s, c: draft_box(s, c))
SH[12] = ui_bg('B2', keyframes(DSTEP))
def draft_hl(extra=''):
    t = E(DRAFT).replace('죄송합니다', '<span class="hl">죄송합니다</span>')
    return phone('오 팀장', [div(STORY_DATE)], typing_big=True, inp=t + extra, clock='8:44')
SH[13] = ui_bg('B2', keyframes([(0, draft_box(DRAFT, False)), (0.25, draft_hl())]))
nop = E(DRAFT.replace(' 🙏', ''))
SH[14] = ui_bg('B2', keyframes([(k / 10, phone('오 팀장', [div(STORY_DATE)], typing_big=True, inp=(nop if k % 2 else E(DRAFT)), clock='8:45')) for k in range(10)]))
SH[15] = ui_bg('B2', keyframes([(0, draft_box(DRAFT, False)), (0.3, draft_box(DRAFT, False) + card('고쳐 쓴 횟수 <b style="color:#e8432f">11</b>', 1330, 300, cls='tag'))]))
SH[16] = ui_bg('B2', keyframes([(0, boss_chat(1, '9:12'))]))
SH[17] = ui_bg('B2', keyframes([(0, boss_chat(1, '9:12')), (0.22, boss_chat(1.5, '9:12')), (0.7, boss_chat(2))]))
SH[17]['ui'][1]['html'] = phone('오 팀장', [div(STORY_DATE), bubble('me', DRAFT, '오전 9:12')], clock='9:12')
SH[18] = shot('D1', 1.0, 1.06, F('D1', 'zero'), counter=3)
TH = lambda txt, x, y: card(E(txt).replace('ㅇㅇ', '<span class="hl">ㅇㅇ</span>'), x, y, cls='think')
SH[19] = shot('D1', 1.06, 1.08, F('D1', 'zero'), ui=keyframes([(0.02, TH('허락의 ㅇㅇ', 1080, 150)), (0.33, TH('허락의 ㅇㅇ', 1080, 150) + TH('"하필 마감 주에?"의 ㅇㅇ', 980, 330)),
                                                         (0.62, TH('허락의 ㅇㅇ', 1080, 150) + TH('"하필 마감 주에?"의 ㅇㅇ', 980, 330) + TH('손가락이 바빴던 ㅇㅇ', 1060, 510))]))
SH[20] = shot('D1', 1.08, 1.1, F('D1', 'zero'), ui=keyframes([(0.02, TH('어, 그래~ 🙂', 1060, 200)), (0.25, TH('어, 그래~ 🙂', 1060, 200) + TH('어. 그래. 😐', 1060, 400)),
                                                         (0.62, TH('ㅇㅇ', 1060, 200) + TH('ㅇㅇ', 1060, 400))]))
SH[21] = ui_bg('D1', keyframes([(0, group_chat(6))]))
SH[22] = ui_bg('D1', keyframes([(0, group_chat(2))])); SH[23] = ui_bg('D1', keyframes([(0, group_chat(2, True))]))
SH[24] = ui_bg('D1', keyframes([(0, group_chat(4))])); SH[25] = ui_bg('D1', keyframes([(0, group_chat(4, True))]))
SH[26] = ui_bg('D1', keyframes([(0, group_chat(6))])); SH[27] = ui_bg('D1', keyframes([(0, group_chat(6, True))]))
SH[28] = ui_bg('D1', keyframes([(0, oo_list())]), counter=7)
SH[29] = shot('P1', 1.0, 1.04)
SH[30] = shot('P1', 1.04, 1.07); SH[31] = shot('P1', 1.07, 1.09); SH[32] = shot('P1', 1.09, 1.11)
bear = phone('오 팀장', [bubble('me', '팀장님 금요일 연차 쓰겠습니다!', '오후 4:10'), bubble('them', '그래~ 푹 쉬고 와~', '오후 4:11', name='오 팀장', ava='오'),
                       '<div class="row them"><div class="ava"></div><div style="font-size:120px;line-height:1">🐻❤️</div></div>'], x=1250, y=120, scale=0.72, clock='4:11')
SH[33] = shot('P1', 1.11, 1.13, ui=keyframes([(0.3, bear)]))
SH[34] = shot('P1', 1.15, 1.45, F('P1', 'zero'), F('P1', 'zero'))
SH[35] = shot('P2', 1.0, 1.08, counter=12)
SH[36] = shot('P1', 1.0, 1.03)
SH[37] = shot('L1', 1.0, 1.05)
SH[38] = shot('L1', 1.05, 1.18, F('L1', 'phone'), counter=19)
Q = '혹시 제가 마감 주에 무리한 부탁을 드린 거면, 말씀해 주세요.'
qbox = lambda s, c: phone('오 팀장', [div(STORY_DATE), bubble('me', DRAFT, '오전 9:12'), bubble('them', 'ㅇㅇ', '오전 9:13', name='오 팀장', ava='오', hl=['ㅇㅇ'])], inp=E(s), caret=c, clock='3:40')
SH[39] = ui_bg('D1', keyframes([(0, qbox('', True))]))
SH[40] = ui_bg('D1', keyframes(typer(Q, 16, 0.0, 0.9, make=qbox)))
SH[41] = ui_bg('D1', keyframes([(f, h) for f, h in [(0.05 + 0.6 * s / 16, qbox(Q[:round(len(Q) * (16 - s) / 16)], True)) for s in range(17)]]), counter=26)
SH[42] = shot('O1', 1.0, 1.05)
SH[43] = shot('O1', 1.05, 1.12, F('O1', 'zero'))
SH[44] = shot('O1', 1.04, 1.08, F('O1', 'boss'))
SH[45] = shot('O2', 1.0, 1.05, cut=True)
SH[46] = shot('O1', 1.06, 1.09, F('O1', 'boss'), cut=True)
SH[47] = shot('O2', 1.03, 1.07, cut=True)
SH[48] = shot('O1', 1.08, 1.14, F('O1', 'boss'), cut=True)
SH[49] = shot('O1', 1.1, 1.12, F('O1', 'boss'), ui=keyframes([(0.1, card('그래요. = <span class="hl">ㅇㅇ</span> <span style="font-size:28px;color:#777">(높임말)</span>', 1180, 200, cls='think'))]))
SH[50] = shot('O1', 1.12, 1.25, F('O1', 'boss'), counter=33)
SH[51] = shot('N1', 1.0, 1.06)
SH[52] = shot('N1', 1.06, 1.1, ui=keyframes([(0.15, phone('오 팀장', [div(STORY_DATE), bubble('me', DRAFT, '오전 9:12'), bubble('them', 'ㅇㅇ', '오전 9:13', name='오 팀장', ava='오', hl=['ㅇㅇ'])], x=1260, y=120, scale=0.72, clock='9:41'))]), counter=46)
SH[53] = shot('H1', 1.0, 1.05, counter=None)
lab = FOCUS.get('H1', {}).get('label', [0.5, 0.6]); lw = FOCUS.get('H1', {}).get('labelw', 0.12)
SH[54] = shot('H1', 1.05, 1.18, lab, lab, ui=keyframes([(0.3, '<div class="label" style="left:%dpx;top:%dpx">아들 거</div>' % (lab[0] * 1920 - 110, lab[1] * 1080 - 40))]), labelfix=True)
SH[55] = shot('H2', 1.0, 1.05, counter=47)
SH[56] = ui_bg('H2', keyframes([(0, mom_chat(0))]))
SH[57] = shot('H2', 1.05, 1.14, F('H2', 'zero'))
SH[58] = ui_bg('H2', keyframes([(0, mom_chat(1))]))
SH[59] = ui_bg('H2', keyframes([(0, mom_chat(1)), (0.18, mom_chat(2))]))
SH[60] = ui_bg('H2', keyframes([(0, mom_chat(2, '10:13'))]))
SH[61] = ui_bg('H2', keyframes([(0, mom_chat(2, '10:14')), (0.3, mom_chat(2, '10:19')), (0.6, mom_chat(2, '10:26')), (0.85, mom_chat(2, '10:31'))]))
SH[62] = shot('H3', 1.0, 1.05)
SH[63] = shot('H3', 1.05, 1.12, dim=0.2)
SH[64] = shot('C1', 1.0, 1.04, counter=None)
nav = card('<div style="font-size:24px;color:#9ab;font-weight:600">★ 즐겨찾기</div><div>1&nbsp; 아들네</div><div>2&nbsp; 시장</div>', 760, 610, 330, extra='background:#1c2633;color:#fff')
SH[65] = shot('C1', 1.04, 1.08, ui=keyframes([(0.15, nav)]))
for n, i in enumerate(range(66, 73)): SH[i] = shot('C1', 1.08 + 0.015 * n, 1.095 + 0.015 * n, F('C1', 'mom' if S[i][1]['segs'][0][0] == 'O' else 'zero'))
spam = phone('엄마', [bubble('them', '[Web발신]\n(광고) 고객님만을 위한 특별 혜택! 지금 바로 확인하세요 ▶', '오후 2:03', name='1588-○○○○', ava='✉'), bubble('me', '네 감사합니다^^', '오후 2:05')], x=1250, y=120, scale=0.72, big=True, clock='2:05')
SH[73] = shot('C1', 1.0, 1.04, F('C1', 'mom'), ui=keyframes([(0.2, spam)]))
SH[74] = shot('W1', 1.0, 1.05)
SH[75] = shot('W1', 1.05, 1.2, F('W1', 'mom'))
SH[76] = shot('W1b', 1.0, 1.06, F('W1b', 'mom'))
SH[77] = shot('W2', 1.0, 1.03, ui=keyframes([(0, card('<span class="st">● 검사 중</span>김*숙 님', 620, 70, cls='board'))]))
SH[78] = shot('W2', 1.03, 1.08)
SH[79] = shot('W2', 1.08, 1.16, F('W2', 'phone'))
for k, i in enumerate(range(80, 86)): SH[i] = ui_bg('W2', keyframes([(0, sis_chat(min(k + 1, 5), morning=(k == 5)))]))
SH[86] = ui_bg('W2', keyframes([(0, sis_chat(5, True))]))
SH[87] = ui_bg('W2', keyframes([(0, sis_chat(5, True)), (0.4, sis_old(0))]))
for k, i in enumerate(range(88, 93)): SH[i] = ui_bg('W2', keyframes([(0, sis_old(k))]))
SH[93] = ui_bg('W2', keyframes([(0, sis_old(4))]))
SH[94] = ui_bg('W2', keyframes([(0, sis_chat(5, True, hl=['많이 힘든가보다 전화 안할란다']))]))
SH[95] = shot('W3', 1.0, 1.1, F('W3', 'eyes'))
SH[96] = shot('R1', 1.0, 1.03, ui=keyframes([(0, card('<span class="st">● 회복실</span>김*숙 님 보호자', 600, 70, cls='board'))]), cut=True)
SH[97] = shot('R1', 1.03, 1.06)
TAG = lambda s: keyframes([(0.05, card(s, 120, 120, cls='tag'))])
seq = {98: 'mom', 99: 'zero', 100: None, 101: 'mom', 102: 'zero', 103: None, 104: 'mom', 105: 'zero', 106: None, 107: 'mom'}
for n, i in enumerate(range(98, 108)):
    who = seq[i]; f = F('R1', who) if who else F('R1')
    SH[i] = shot('R1', 1.06 + 0.012 * n, 1.075 + 0.012 * n, f)
SH[100]['ui'] = TAG('1분 뒤'); SH[103]['ui'] = TAG('또 1분 뒤')
SH[105]['z1'] = SH[105]['z0'] + 0.08
SH[108] = shot('R2', 1.0, 1.05)
SH[109] = shot('R2', 1.05, 1.16, F('R2', 'zero'))
SH[110] = shot('O3', 1.0, 1.05)
SH[111] = ui_bg('O3', keyframes([(0, boss_chat2(1))]))
SH[112] = ui_bg('O3', keyframes([(0, boss_chat2(1)), (0.3, boss_chat2(2))]))
SH[113] = shot('O3', 1.05, 1.1, F('O3', 'zero'), counter=1)
SH[114] = shot('O3', 1.1, 1.14, F('O3', 'zero'), counter=1)
SH[115] = shot('H4', 1.0, 1.04, counter=1)
SH[116] = shot('H4', 1.04, 1.08, F('H4', 'zero'), counter=1)
for k, i in enumerate(range(117, 121)): SH[i] = ui_bg('H4', keyframes([(0, mom_chat2(k))]), counter=1)
SH[121] = shot('H4', 1.06, 1.16, F('H4', 'zero'), counter=1, counterOut=True)
SH[122] = shot('H4', 1.16, 1.2, F('H4', 'zero'), blur=8, dim=0.55, nosub=True,
               ui=[{'f': 0, 'html': '<div class="endcard">여러분 부모님은<br><span style="color:#ff6a3d">\'ㅇㅇ\'</span>를 뭐라고 읽으세요?</div>'}])
SH[123] = shot('H4', 1.2, 1.22, F('H4', 'zero'), blur=10, dim=0.7, nosub=True,
               ui=[{'f': 0, 'html': '<div class="endcard" style="font-size:54px">끝까지 봐 주셔서 고맙습니다.<br>다음 이야기에서 만나요.</div>'}])

for i in (12, 23, 25, 27, 56, 112): SH[i]['nosub'] = True
# counter: hidden unless set; carry forward inside visible ranges
VIS = list(range(0, 4)) + list(range(18, 64)) + list(range(113, 122))
cur = None
for i in range(len(S)):
    sh = SH[i]; c = S[i][1].get('count')
    if i in (0,): cur = 1
    if c: cur = c
    if i in (113,): cur = 1
    sh['counter'] = (cur if i in VIS else None)
    sh.setdefault('uiFade', True)
assert len(SH) == len(S), (len(SH), len(S))
json.dump([SH[i] for i in range(len(S))], open('shots.json', 'w'), ensure_ascii=False)
print('shots', len(SH))
