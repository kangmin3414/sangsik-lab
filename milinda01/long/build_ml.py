"""불교 편(수레 문답) 1막 샘플: 목소리(줄마다 화면 위치·공간 울림) + 배경음(밤 → 회의실 → 사갈라, 덕킹) + 효과음 → /dev/shm/ml/mix.wav (스테레오, -14 LUFS).
몰입 층의 소리 쪽(zw/gfx_mix.py)을 쓴다. 사건 시각은 장면 코드(mlgf.js·mlgf2.js)의 mlAt과 같은 규칙으로 구한다(낱말 시각 + 0.05초, 못 찾으면 줄 길이의 비율).
office.mp3는 맨 앞 1.3초에 목소리처럼 들리는 구간이 있어 3초부터 쓴다(그 뒤 VAD 0)."""
import json, os, sys, numpy as np, soundfile as sf
from scipy.signal import resample_poly
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); sys.path.insert(0, '../../zw')
import gf_sfx as S, gfx_mix as GM
SR = 44100; O = '/dev/shm/ml/'; B = O + 'bgm/'
TL = json.load(open('timeline_ml.json')); L = {l['id']: l for l in TL['lines']}; DUR = TL['duration']
T0 = lambda k: L[k]['t0']; T1 = lambda k: L[k]['t1']
def At(lid, key, fb=0.5):
    l = L[lid]; k = key.replace(' ', ''); m = [w for w in l.get('words', []) if k in w['w'].replace(' ', '')]
    return l['t0'] + m[0]['t'] + 0.05 if m else l['t0'] + fb * (l['t1'] - l['t0'])
M = GM.Mix(DUR)
# ---------- 목소리: 줄마다 자리와 공간 ----------
SCENE = {'mlnight': ('room', 0.06, {'Z': 1090, 'T': 1120}), 'mloffice': ('hall', 0.07, {'B': 640, 'Z': 1290, 'T': 1320}), 'mlsagala': ('yard', 0.13, {'K': 800, 'M': 1330, 'Z': 560, 'T': 600}),
         'mlphoto': ('room', 0.06, {'T': 1600}), 'mllamp': ('yard', 0.12, {'K': 520, 'M': 1420, 'Z': 960}), 'mltue': ('hall', 0.07, {'T': 1000, 'Z': 1060}), 'mleve': ('room', 0.05, {'B': 960}),
         'mlend': ('hall', 0.07, {'S': 1340, 'T': 640, 'Z': 600}), 'mlstudy': (None, 0, {}), 'mlday': (None, 0, {}), 'mlroll': (None, 0, {}), 'mlcard': (None, 0, {})}
def norm(w, target=0.085):
    a = np.abs(w); act = w[a > a.max() * 0.05]; r = float(np.sqrt(np.mean(act ** 2))) if len(act) else 0; return w * float(np.clip(target / (r + 1e-9), 0.5, 2.6))
for l in TL['lines']:
    if not l.get('v'): continue
    c = l['clip']; w, sr = sf.read(c['take'], dtype='float32'); w = (w.mean(1) if w.ndim > 1 else w)[c['a0']:c['a1']]; w = resample_poly(w, 441, 240) if sr == 24000 else w
    w = norm(w.astype(np.float64)); room, wet, pos = SCENE[l['scene']]
    if l['v'] == 'N' or room is None: M.voice(w, l['t0'])
    else: M.voice(w, l['t0'], x=pos.get(l['v'], 960), room=room, wet=wet, g=0.95 if l['v'] == 'T' else 1.0)
# ---------- 배경음 ----------
M.bed(B + 'night.mp3', 0, T0('k0') - 0.25, g=0.30, fin=1.0, fout=1.4)
M.bed(B + 'office.mp3', T0('o7') - 0.6, T0('s14') - 0.25, g=0.25, fin=0.8, fout=1.2, off=3.0)
M.bed(B + 'sagala.mp3', T0('s14') - 0.5, T0('p33') - 0.2, g=0.27, fin=1.0, fout=1.5)
# 33번부터: 밤(사진첩) → 등불 → 연구 → 끝까지 이어지는 한 곡(스티커를 떼는 화요일부터 빈칸 카드까지)
M.bed(B + 'night.mp3', T0('p33') - 0.6, T0('l36') - 0.25, g=0.28, fin=1.0, fout=1.2)
M.bed(B + 'lamp.mp3', T0('l36') - 0.5, T0('r40') - 0.25, g=0.27, fin=0.9, fout=1.2)
M.bed(B + 'study.mp3', T0('r40') - 0.5, T0('t43') - 0.3, g=0.24, fin=0.8, fout=1.4)
M.bed(B + 'hope.mp3', T0('t43') - 0.4, DUR, g=0.27, fin=1.2, fout=3.6)
# 공기 소리: 배경음 아래에 아주 작게(밤 방의 낮은 웅웅, 회의실 환기, 마당 바람과 나뭇잎). 장면이 '어딘가에 있다'는 느낌을 준다
M.amb('night', 0.3, T0('k0') - 0.3, rel_db=-13, seed=5); M.amb('office', T0('o7') - 0.4, T0('s14') - 0.3, rel_db=-13, seed=6); M.amb('yard', T0('s14') - 0.3, T0('p33') - 0.3, rel_db=float(os.environ.get('ML_YARD_DB', -14)), seed=7)
M.amb('night', T0('p33') - 0.3, T0('l36') - 0.3, rel_db=-13, seed=8); M.amb('yard', T0('l36') - 0.3, T0('r40') - 0.3, rel_db=-15, seed=9); M.amb('office', T0('t43') - 0.3, T0('e48') - 0.3, rel_db=-13, seed=10); M.amb('night', T0('e48') - 0.3, T0('d51') - 0.3, rel_db=-13, seed=11); M.amb('office', T0('f52') - 0.3, T0('f55') - 0.3, rel_db=-13, seed=12)
M.bed_gain(T1('s27') + 0.25, T1('s28') + 0.2, 0.22, ramp=0.45)          # "그럼 전 뭘 타고 온 거죠?" 앞뒤는 조용히
def fx(t, w, g=1.0, x=960, room=None): M.sfx(w, t, g, x, room)
def sticker(t0, x_from, x_to, fly=0.26, pr=0.5, g=1.0, room=None, line=None):      # 인쇄 → 던짐 → 탁. line(딱지의 대사 줄)이 있으면 말하기 직전에 짧게 '찌익', 말하는 동안은 아주 작게
    if line: fx(L[line]['t0'] - 0.34, GM.printer(0.26), 0.42 * g, x_from, room); fx(L[line]['t0'], GM.printer(L[line]['t1'] - L[line]['t0'] - 0.1), 0.09 * g, x_from, room)
    else: fx(t0 - fly - pr, GM.printer(pr * 0.74), 0.5 * g, x_from, room)
    fx(t0 - fly, S.whoosh(fly, 1200, 6000), 0.3 * g, (x_from + x_to) / 2, room); fx(t0, GM.slap(), 0.95 * g, x_to, room); fx(t0, S.pop(520), 0.3 * g, x_to, room)
# ---------- [훅] 밤 ----------
q = '나는 어떤 사람이야?'; n1 = L['n1']
for i, ch in enumerate(q):
    if ch != ' ': fx(n1['t0'] + 0.05 + (n1['t1'] - 0.25 - n1['t0'] - 0.05) * i / len(q), S.tick(1250 + (i * 137) % 400), 0.22, 960)
tSend = n1['t1'] + 0.12; fx(tSend, S.pop(880), 0.45, 1200); fx(tSend + 0.02, S.whoosh(0.18, 1500, 6000), 0.18, 1200)
for i in range(1, int(T0('k0') - 4)): fx(3.0 + i, S.tick(900 if i % 2 else 760), 0.05, 1500)       # 벽시계
fx(T1('n2') + 0.08, S.ding(), 0.26, 1100)                                  # 답이 왔다: 폰 불빛이 번쩍(말이 끝난 뒤)
for i, (k, fb) in enumerate([('신중', 0.05), ('내향', 0.38), ('무대', 0.66)]): fx(At('n3', k, fb), S.pop(700 + i * 120), 0.34, 800)
fx(At('n4', '맞아', 0.35), S.sparkle(3, 0.2), 0.22, 1100)
fx(T0('n5') - 0.12, S.boing(), 0.38, 1120, 'room')
tS = T1('n5') + 0.34; sticker(tS, 1120, 1100, fly=0.2, room='room', line='n5')
tG = At('n6', '모든', 0.42); fx(At('n6', '딱지', 0.2) + 0.05, S.pop(760), 0.26, 900, 'room')      # 딱지 이름표 톡
for dt, x in ((0.25, 675), (0.8, 985), (1.35, 400)): sticker(tG + dt, 1120, x, g=0.3, room='room')
# ---------- 제목 카드 ----------
k0 = T0('k0'); fx(k0 - 0.65, S.whoosh(0.55, 500, 3500), 0.36); fx(k0 - 0.6, S.rustle(0.4), 0.2)
fx(k0 + 0.28, GM.slap(), 1.0); fx(k0 + 0.28, S.stamp(), 0.6); fx(k0 + 0.42, S.stage(), 0.42); fx(T0('o7') - 0.15, S.whoosh(0.55, 500, 3500), 0.3); fx(T0('o7') - 0.1, S.rustle(0.4), 0.18)
# ---------- [월요일] 회의실 ----------
tR1 = At('o7', '리모', 0.62) + 0.1; fx(tR1, S.whoosh(0.72, 300, 1800), 0.24, 980, 'hall'); fx(tR1 + 0.74, S.tick(520), 0.3, 1140, 'hall'); fx(tR1 + 0.7, S.bang(), 0.26, 1340)
tR2 = At('o9', '아니라', 0.72) + 0.25; fx(tR2, S.whoosh(0.86, 300, 1800), 0.26, 980, 'hall'); fx(tR2 + 0.88, S.tick(470), 0.3, 780, 'hall')
for i in range(3): fx(T0('o10') + 1.5 + 0.12 + i * 0.22, S.blip(520), 0.16, 590)
tB = T1('o11') + 0.42; sticker(tB, 1340, 650, fly=0.36, room='hall', line='o11')
tG2 = At('o12', '편한', 0.14) + 0.2
for dt, x in ((0.3, 866), (0.85, 1780), (1.4, 1440)): sticker(tG2 + dt, 1340, x, g=0.3, room='hall')
tPe = At('o13', '뜯어', 0.68); fx(tPe, S.rustle(0.3), 0.3, 1340); fx(tPe + 0.3, S.question(), 0.22, 1400)
s14 = T0('s14'); fx(s14 - 0.65, S.whoosh(0.55, 500, 3500), 0.36); fx(s14 - 0.6, S.rustle(0.4), 0.2); fx(s14 - 0.15, S.whoosh(0.4, 500, 3500), 0.2)
# ---------- [옛이야기] 사갈라 ----------
Y = 'yard'; CX = 560
# 수레는 처음부터 서 있다(굴러오는 소리 없음. 2026-11-22 점검: 말 없이 혼자 굴러오면 이상하다)
tKH = At('s14', '밀린다', 0.62) - 0.1; fx(tKH - 0.04, GM.creak(), 0.3, 520, Y); fx(tKH, S.boing(), 0.26, 600, Y); fx(tKH + 0.55, S.land(), 0.6, 1170, Y)      # 내릴 때 수레가 끼익
rng = np.random.default_rng(3); tb = s14 + 1.5
while tb < T0('p33') - 1.5:                                                                                                      # 멀리서 새
    for j in range(int(rng.integers(1, 4))): fx(tb + j * 0.17, GM.chirp(3000 + rng.random() * 900, 3900 + rng.random() * 900, 0.09 + rng.random() * 0.05), 0.1, float(rng.choice([200, 1700, 1500, 400])), Y)
    tb += 3.2 + rng.random() * 3.8
fx(At('s15', '제로', 0.75) + 0.1, S.question(), 0.24, 700)
for tq, xq in ((At('s19', '없다', 0.12), 1170), (At('s20', '수레', 0.62) - 0.15, 1700), (At('s29', '모였', 0.42), 1170)): fx(tq, S.rustle(0.24), 0.09, xq, Y)      # 큰 손짓의 옷 스침(말 위라 아주 작게)
tSt1 = T1('s16') + 0.1; sticker(tSt1, 600, 520, fly=0.22, room=Y, line='s16')
tTagA = At('s18', '나가', 0.02) + 0.3; fx(tTagA, S.pop(), 0.3, 1500); tTagH = At('s18', '알맹이', 0.82) + 0.2; fx(tTagH, S.whoosh(0.3, 1500, 7000), 0.22, 1500); fx(tTagH, S.pop(380), 0.25, 1500)
for i, (k, fb) in enumerate([('옷', 0.38), ('밥', 0.5), ('수행', 0.72)]): fx(At('s19', k, fb), S.pop(600 + i * 90), 0.3, 1300)
fx(T1('s20') + 0.02, S.whoosh(0.36, 400, 5000), 0.42)
tP = At('s22', '끌채', 0.72) + 0.1; fx(tP, S.pop(500), 0.45, 900, Y); fx(tP, S.boing(260, 620, 0.22), 0.32, 900, Y); fx(tP + 0.15, S.bang(), 0.22, 700)
tX1 = T1('s23') + 0.1; fx(tX1, S.stamp(), 0.75, 1100, Y)
tA = At('s24', '굴대', 0.02) + 0.15; fx(tA, S.whoosh(0.35, 500, 3000), 0.3, 500, Y); fx(tA, S.pop(430), 0.3, 500, Y)
tW = At('s24', '바퀴', 0.56) + 0.15; fx(tW, S.boing(280, 700, 0.24), 0.22, 400, Y); fx(tW + 0.06, S.boing(320, 760, 0.24), 0.19, 1050, Y); fx(tW + 0.27, S.land(), 0.55, 620, Y); fx(tW + 0.27, S.low(98, 0.5), 0.34, 620)      # '바퀴가' 위에 떨어지는 소리들: 말소리 띠에서는 작게, 쿵의 무게는 낮은 음(98Hz)으로
tSt2 = T1('s25') + 0.36; sticker(tSt2, 620, 300, fly=0.3, g=0.85, room=Y, line='s25')
tX2 = T1('s26') + 0.1
for dt, x in ((0, 400), (0.12, 250), (0.2, 1050)): fx(tX2 + dt, S.stamp(), 0.7, x, Y)
fx(tX2 + 0.15, GM.flutter(1.0), 0.34, 300); fx(tX2 + 0.22, GM.flutter(1.1), 0.3, 620); fx(tX2 + 0.34, S.stamp(), 0.34, 620, Y); fx(tX2 + 0.36, S.pop(300), 0.2, 620)      # 틀린 딱지 이마에도 작은 ✕
fx(At('s27', '어디', 0.36), S.question(), 0.28, 900)
for i in range(3): fx(T0('s28') - 0.75 + 0.12 + i * 0.22, S.blip(520), 0.16, 800)
M.sfx2(GM.gust(1.55), T1('s27') + 0.05, 0.5)                                 # 어색한 침묵: 바람 한 줄기(나뭇잎이 굴러간다)
SN = 0.26
for i, (k, fb, x, f) in enumerate([('끌채', 0.02, 1050, 440), ('굴대', 0.19, 620, 520), ('바퀴', 0.32, 640, 620)]):
    r = At('s29', k, fb) + 0.1; fx(r, S.whoosh(SN, 600, 4000), 0.22, x, Y); fx(r + SN, GM.clack(f), 0.5, x, Y); fx(r + SN, S.note(660 * 2 ** (i * 3 / 12), 0.25, 0.14, 'sin'), 0.22, x)      # 낱말 위에 떨어지는 소리라 작게(0.75일 때 음성 인식이 '바퀴'를 '박귀'로 적었다)
tName = At('s29', '수레라고', 0.7) + 0.2; fx(tName, S.pop(880), 0.3, 1100); fx(tName + 0.05, S.equip(), 0.3, 1100); fx(tName + 0.2, S.ding(), 0.22, 1500)
tTagF = At('s30', '나가', 0.42) + 0.3; fx(tTagF, S.sparkle(4, 0.25), 0.28, 1500)
tHop = T0('s31') - 0.55; fx(tHop, S.boing(), 0.3, 500, Y); fx(tHop + 0.5, S.land(), 0.5, 300, Y)
for i, (k, fb) in enumerate([('몸', 0.01), ('기분', 0.08), ('기억', 0.19), ('버릇', 0.3), ('생각', 0.4)]): fx(At('s31', k, fb), S.blip(523.3 * 2 ** ([0, 2, 4, 7, 9][i] / 12)), 0.3, 700 + i * 120)
tMe = max(At('s31', '나도', 0.92), T1('s31') - 0.12); fx(tMe - 0.1, S.whoosh(0.3, 800, 5000), 0.16, 900); fx(tMe + 0.1, S.coin(), 0.32, 1000); fx(tMe + 0.25, S.pop(980), 0.28, 1700)
tAsk = At('s32', '원래', 0.71); fx(tAsk, S.blip(700), 0.11, 1700); fx(tAsk + 0.7, S.stamp(), 0.2, 1700)      # 구석 카드의 '원래?' → ✕(말 위라 작게)
tPe2 = At('s32', '어디에도', 0.84); fx(tPe2, S.rustle(0.3), 0.2, 980); tPress = max(tPe2 + 0.75, T1('s32') + 0.35); fx(tPress - 0.25, S.boing(360, 700, 0.2), 0.26, 1050); fx(tPress, S.pop(420), 0.3, 1050)
tPop = tPress + 0.7; fx(tPop, S.boing(400, 900, 0.2), 0.4, 1000); fx(tPop + 0.3, S.question(), 0.26, 1050)
# ================= 33~57번 (대본 v2) =================
R = 'room'; H = 'hall'
def trans(t, kind='peel'):      # 장면 넘김: peel(스티커 종이) · dip(어둡게) · flash(환하게)
    if kind == 'peel': fx(t - 0.65, S.whoosh(0.55, 500, 3500), 0.34); fx(t - 0.6, S.rustle(0.4), 0.2); fx(t - 0.15, S.whoosh(0.4, 500, 3500), 0.2)
    elif kind == 'dip': fx(t - 0.55, S.whoosh(0.6, 250, 1800), 0.22)
    else: fx(t - 0.55, S.whoosh(0.55, 900, 6000), 0.26); fx(t - 0.12, S.sparkle(3, 0.25), 0.14)
# ---------- [월요일 밤] 사진첩 → 10년 전 사진 ----------
p33 = T0('p33'); trans(p33, 'dip')
for i in range(13): fx(p33 - 0.1 + 4.5 * (1 - (1 - i / 13) ** 2.2), S.tick(1100 + (i * 97) % 300), 0.1, 960)      # 사진첩이 흘러간다(점점 느려짐)
p34 = T0('p34'); fx(p34 - 0.17, S.pop(520), 0.34, 960); fx(p34 - 0.15, S.whoosh(0.3, 500, 4000), 0.2)
tSh = At('p34', '떨리는', 0.62)
for i in range(4): fx(tSh + 0.25 + i * 0.07, S.tick(1900 - i * 90), 0.07, 1000)                                    # 떨리는 손(말 위라 아주 작게)
p35 = T0('p35'); fx(p35 - 0.5, S.boing(), 0.3, 1600, R); fx(p35 - 0.34, GM.printer(0.26), 0.4, 1600, R)
tA = p35 + 1.04; fx(tA - 0.3, S.whoosh(0.3, 1200, 6000), 0.26, 1300, R); fx(tA, GM.slap(), 0.7, 960, R); fx(tA + 0.2, GM.flutter(0.8), 0.24, 940)
tB = At('p35', '어?', 0.56) + 0.62; fx(tB - 0.72, GM.printer(0.3), 0.3, 1600, R); fx(tB - 0.3, S.whoosh(0.3, 1200, 6000), 0.26, 1300, R); fx(tB, S.boing(420, 940, 0.2), 0.34, 990, R); fx(tB + 0.06, GM.flutter(0.9), 0.24, 1200); fx(tB + 0.38, S.question(), 0.22, 1600)
# ---------- [옛이야기 2] 등불 ----------
l36 = T0('l36'); trans(l36)
rng2 = np.random.default_rng(11); tb = l36 + 0.8
while tb < T0('r40') - 1.5:                                                                                           # 밤벌레(멀리, 아주 작게)
    for j in range(3): fx(tb + j * 0.09, GM.chirp(4300 + rng2.random() * 300, 4400 + rng2.random() * 300, 0.045), 0.05, float(rng2.choice([150, 1800, 400])), Y)
    tb += 1.7 + rng2.random() * 1.8
tC1 = At('l37', '초저녁', 0.42); tC2 = At('l37', '새벽', 0.6); tEq = At('l37', '같은', 0.77)
fx(tC1, S.pop(660), 0.26, 760); fx(tC2, S.pop(780), 0.26, 1160); fx(tC2 + 0.3, S.boing(380, 820, 0.18), 0.13, 960, Y); fx(tEq, S.blip(600), 0.12, 960)
tX = T0('l38') + 0.4; fx(tX, S.stamp(), 0.3, 960, Y); tTh = At('l38', '밤새', 0.72); fx(tTh, S.sparkle(4, 0.3), 0.16, 960); fx(T1('l38') + 0.1, S.ding(), 0.2, 960)
tNe = At('l39', '같지도', 0.38); tSa = At('l39', '다르지도', 0.64); fx(tNe, S.pop(700), 0.18, 1500); fx(T1('l39') + 0.12, S.sparkle(4, 0.3), 0.22, 1500)
# ---------- [2026년] 연구 ----------
r40 = T0('r40'); trans(r40, 'flash'); fx(r40 + 0.1, S.whoosh(1.5, 300, 2500), 0.1); fx(r40 + 1.7, S.pop(880), 0.2, 1490)
tPp = At('r40', '천여', 0.31); tIv = At('r40', '시간', 0.41); tRec = At('r40', '기록', 0.57); tAI = At('r40', 'AI', 0.84)
for i in range(11): fx(tPp - 0.5 + i * 0.09, S.tick(1200 + i * 60), 0.06, 300 + i * 130)
fx(tIv, S.pop(640), 0.18, 480)
for i in range(6): fx(tIv + 0.3 + i * 0.45, S.blip(700 + (i % 3) * 90), 0.07, 620 + i * 50)
fx(tAI, S.sparkle(4, 0.25), 0.16, 1450)
tL1 = At('r41', '10개', 0.57); tE1 = At('r41', '7개', 0.74) + 0.35; fx(At('r41', '설문', 0.06), S.pop(600), 0.18, 400); fx(At('r41', 'ai', 0.25), S.pop(680), 0.18, 400)
for i in range(7): fx(tL1 + (tE1 - tL1) * i / 6, S.blip(523.3 * 2 ** ([0, 2, 4, 5, 7, 9, 11][i] / 12)), 0.17, 620 + i * 100)
fx(T1('r41') + 0.12, S.ding(), 0.2, 1700)
tL2 = At('r42', '10개', 0.49); tE2 = At('r42', '8개', 0.58) + 0.45; fx(At('r42', '본인이', 0.06), S.pop(720), 0.18, 400)
for i in range(8): fx(tL2 + (tE2 - tL2) * i / 7, S.blip(523.3 * 2 ** ([0, 2, 4, 5, 7, 9, 11, 12][i] / 12)), 0.17, 620 + i * 100)
tCd = T1('r42') + 0.25; tSl = tCd + 0.62; fx(tCd, S.whoosh(0.4, 400, 3000), 0.3); fx(tSl, GM.slap(), 0.95, 1056); fx(tSl, S.stamp(), 0.5, 1056); fx(tSl + 0.14, S.ding(), 0.22, 1056)
# ---------- [화요일] 스티커를 떼다 ----------
t43 = T0('t43'); trans(t43); tGrab = t43 + 0.55; fx(tGrab, S.rustle(0.2), 0.22, 900, H); fx(tGrab + 0.1, S.boing(), 0.26, 930, H); fx(tGrab + 0.5, S.breath(0.9) if hasattr(S, 'breath') else S.whoosh(0.9, 400, 2500), 0.2, 900)
t44 = T0('t44'); fx(t44 - 0.24, S.boing(340, 700, 0.2), 0.26, 930, H); fx(t44 + 0.1, S.pop(420), 0.2, 1000, H)
t46 = T0('t46'); tPl = t46 + 0.2; tOff = tPl + 1.2; fx(t46 - 0.3, S.boing(360, 760, 0.2), 0.22, 840, H)
fx(tPl, S.scribble(1.15) if hasattr(S, 'scribble') else S.rustle(1.1), 0.2, 900, H); fx(tPl + 0.5, S.rustle(0.6), 0.22, 900, H)
fx(tOff, S.pop(900), 0.42, 900, H); fx(tOff + 0.04, S.sparkle(4, 0.3), 0.26, 900); fx(tOff + 0.3, S.rustle(0.3), 0.2, 780, H); fx(tOff + 0.85, S.rustle(0.22), 0.14, 820, H)
t47 = T0('t47'); fx(t47 - 0.3, GM.clack(300), 0.34, 1500, H); fx(t47 - 0.2, GM.creak(0.25), 0.16, 1500, H)
tSl2 = T1('t47') - 0.2; fx(tSl2, S.whoosh(0.72, 300, 1800), 0.24, 980, H); fx(tSl2 + 0.74, S.tick(520), 0.3, 1140, H); fx(tSl2 + 0.85, S.sparkle(4, 0.3), 0.22, 1340)
# ---------- [발표 전날] 밤 ----------
e48 = T0('e48'); trans(e48, 'dip'); tBz = e48 + 1.25
def buzz(d=0.3): t_ = np.arange(int(d * SR)) / SR; return (np.sign(np.sin(2 * np.pi * 155 * t_)) * 0.25 + np.sin(2 * np.pi * 155 * t_) * 0.5) * (0.5 + 0.5 * np.sin(2 * np.pi * 24 * t_)) * np.sin(np.linspace(0, np.pi, len(t_))) ** 0.5 * 0.5
fx(tBz, buzz(), 0.5, 700, R); fx(tBz + 0.45, buzz(), 0.5, 700, R)
e49 = T0('e49'); fx(e49 + 0.05, S.pop(880), 0.3, 900); fx(At('e49', '나도', 0.44), S.pop(880), 0.22, 900); fx(T1('e49') + 0.1, S.bang(), 0.2, 1100)
M.bed_gain(T0('e50') - 0.2, T0('e50') + 1.75, 0.4, ramp=0.5)                              # 50번: 스티커가 소리 없이 떨어진다(효과음 없음, 음악만 낮게)
# ---------- [발표 날] ----------
d51 = T0('d51'); trans(d51, 'flash'); fx(T1('d51') + 0.15, S.sparkle(3, 0.3), 0.18, 900)
# ---------- [엔딩] 석 달 뒤 ----------
f52 = T0('f52'); trans(f52); tPu = At('f52', '아니라', 0.76) + 0.2; fx(tPu, S.whoosh(0.86, 300, 1800), 0.24, 980, H); fx(tPu + 0.88, S.tick(470), 0.3, 800, H)
f53 = T0('f53'); tNo = At('f53', '아니', 0.22); tAj = At('f53', '아직', 0.61); tHit = T1('f53') + 0.42
fx(f53 - 0.34, GM.printer(0.26), 0.36, 640, H); fx(tNo, S.whoosh(0.14, 900, 3000), 0.16, 640, H); fx(tAj - 0.22, GM.printer(0.5), 0.1, 640, H)
fx(tHit - 0.36, S.whoosh(0.36, 1200, 6000), 0.3, 1000, H); fx(tHit, GM.slap(), 0.95, 1280, H); fx(tHit, S.pop(520), 0.3, 1280, H); fx(tHit + 0.08, S.coin(), 0.34, 1280); fx(tHit + 0.3, S.sparkle(5, 0.4), 0.24, 1280)
f54 = T0('f54'); tGv = f54 + 0.25; fx(tGv, S.whoosh(0.9, 300, 1800), 0.24, 980, H); fx(tGv + 0.9, S.tick(520), 0.3, 1140, H); fx(tGv + 1.6, S.sparkle(4, 0.3), 0.22, 1340)
f55 = T0('f55'); trans(f55, 'flash'); tGo = At('f55', '굴러', 0.28); M.sfx(GM.rumble(T1('f55') + 1.2 - tGo), tGo, 0.2, 960); tNew = At('f55', '다른', 0.75); fx(tNew, S.pop(880), 0.16, 1100); fx(T1('f55') + 0.1, S.equip(), 0.26, 1100)
f56 = T0('f56'); tA2 = f56 + 0.3; fx(tA2, GM.slap(), 1.0); fx(tA2, S.stamp(), 0.55); fx(tA2 + 1.05, S.rustle(0.3), 0.24, 1100); tB2 = tA2 + 1.7; fx(tB2, GM.slap(), 1.0); fx(tB2, S.stamp(), 0.55); fx(tB2 + 0.14, S.stage(), 0.4); fx(tB2 + 0.5, S.sparkle(5, 0.4), 0.2)
MARGIN = float(os.environ.get('ML_MARGIN', 12)) or None      # 말 여유 지키기: 줄마다 말소리 띠에서 목소리가 배경음보다 12dB는 크게(모자란 줄만 최대 8dB 더 낮춤). 0이면 끔
pk = M.render(O + 'mix.wav', sfx_gain=0.6, duck=0.6, stems=O + 'stems.npz' if os.environ.get('ML_STEMS') else None, margin=MARGIN, max_cut=float(os.environ.get('ML_MAXCUT', 8)))
cut = [(t, m, c) for t, m, c in M.margin_log if c > 0.05]
print('dur', round(DUR, 2), 'peak raw', round(pk, 2), '| 말 여유 지키기: 배경음을 더 낮춘 줄', len(cut), [(next((l['id'] for l in TL['lines'] if abs(l['t0'] - t) < 0.3), t), m, -c) for t, m, c in cut])
