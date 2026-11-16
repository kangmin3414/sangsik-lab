"""기게스 편 1막 샘플: voice + BGM(exam·myth, 덕킹) + 게임 감각 효과음(zw/gf_sfx.py) -> /dev/shm/gy/mix.wav (loudnorm -14)
효과음 시각은 gygf.js·gygf2.js의 화면 반응과 같은 식(낱말 시각 또는 장면 시작 + 초). 낱말 위의 소리는 짧고 작게, 가락은 말이 끝난 뒤에."""
import json, subprocess, sys, os, numpy as np, soundfile as sf
os.chdir(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, '../../zw')
import gf_sfx as S
SR = 44100
TL = json.load(open('timeline_gy.json')); L = {l['id']: l for l in TL['lines']}; DUR = TL['duration']; N = int(DUR * SR)
voice, _ = sf.read('/dev/shm/gy/voice_gy.wav', dtype='float32')
if voice.ndim > 1: voice = voice.mean(1)
voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
A = lambda k: L[k]['t0'] - 0.15                       # 장면 시작(lt = 0)
E1 = lambda k: L[k]['t1']
def W(lid, key, fb, n=0):                             # gyW와 같은 규칙(fb는 장면 시작 기준)
    m = [w for w in L[lid].get('words', []) if key.lower() in w['w'].replace(' ', '').lower()]
    return L[lid]['t0'] + m[n]['t'] if len(m) > n else A(lid) + fb
def load(fn, start, dur):
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', fn, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    a = np.frombuffer(raw, np.float32).copy(); a = a[int(start * SR):]; n = int(dur * SR)
    while len(a) < n: a = np.concatenate([a, a[int(8 * SR):]])
    return a[:n]
bed = np.zeros(N)
def place(fn, t0, t1, g, fin=1.5, fout=2.5, off=0.0):
    i0, i1 = int(max(0, t0) * SR), min(N, int(t1 * SR)); a = load(fn, off, (i1 - i0) / SR) * g
    k = int(fin * SR); a[:k] *= np.linspace(0, 1, k)[:len(a)]; k = int(fout * SR); a[-k:] *= np.linspace(1, 0, k)
    bed[i0:i0 + len(a)] += a
B = '/dev/shm/gy/bgm/'
FULL = 'c1' in L
if FULL:   # 0:00 시험장 펄스 → 1단계·2단계 추리 비트(천만에요에서 뚝) → 가스 위기 → 2회차 펄스 → 안경을 내려놓으면 정적 1초 → 따뜻한 피아노
    SEG = [('exam', 0, A('k0') + 0.2, 0.30, 0.0, 0.6), ('myth', A('g1') - 0.3, A('c2') + 0.05, 0.24, 0.0, 0.12), ('myth', A('c3') - 0.4, A('c7') + 0.3, 0.24, 20.0, 0.6),
           ('crisis', A('c7') - 0.3, A('r0') + 0.2, 0.26, 8.0, 0.4), ('exam', A('d1') - 0.15, E1('d2') + 0.12, 0.28, 0.0, 0.12), ('warm', E1('d2') + 1.15, DUR, 0.30, 0.0, 1.6)]
else:
    SEG = [('exam', 0, A('k0') + 0.2, 0.30, 0.0, 0.6), ('myth', A('g1') - 0.3, DUR, 0.24, 0.0, 1.6)]
for name, t0, t1, g, off, fo in SEG: place(B + name + '.mp3', t0, t1, g, fin=0.8 if t0 > 0.1 else 0.3, fout=fo, off=off)
def trail_sum(x, k): c = np.concatenate([[0.0], np.cumsum(x)]); i = np.arange(len(x)); return c[i + 1] - c[np.maximum(0, i + 1 - k)]
vad = (np.abs(voice) > 0.006).astype(float)
act = (trail_sum(vad, int(0.5 * SR)) > 0) | (trail_sum(vad[::-1], int(0.15 * SR))[::-1] > 0)
k = int(0.12 * SR); act = trail_sum(act.astype(float), k) / k
bed *= (1.0 - 0.8 * act)

sfx = np.zeros(N)
def put(t, w, g=1.0):
    i = int(t * SR)
    if i < 0 or i >= N: return
    w = w[:N - i]; sfx[i:i + len(w)] += w * g
def steps(t0, t1, iv=0.38, g=0.16):
    k = 0
    while t0 + k * iv < t1: put(t0 + k * iv, S.step(), g); k += 1
def iris(lid, g1=0.45, g2=0.4): c = A(lid); put(c - 0.26, S.iris_close(), g1); put(c + 0.02, S.iris_open(), g2)
def bands(lid, g=0.32): put(A(lid) - 0.25, S.bands(), g)

# ======== 오프닝: 시험장 ========
c = A('o1'); put(c + 0.05, S.stage(), 0.12)
k = 0
while c + 0.3 + k < A('o5'): put(c + 0.3 + k, S.tick(1500), 0.05); put(c + 0.8 + k, S.tick(1200), 0.035); k += 1   # 째깍째깍
tT = W('o1', '5분', 0.9); put(tT, S.bang(), 0.12); put(tT + 0.02, S.pop(820), 0.08)
put(W('o2', '하얗게', 0.6) - 0.1, S.pop(520), 0.08)
tH = W('o2', '손은', 1.3) - 0.1; put(tH - 0.15, S.whoosh(0.3, 600, 4000), 0.1)
for i in range(6): put(tH + 0.1 + i * 0.16, S.tick(700 + (i % 2) * 120), 0.04)       # 덜덜
tK = W('o3', '톡', 1.75); put(tK, S.blip(1760), 0.14); put(tK + 0.05, S.sparkle(4, 0.35), 0.07)
tE = W('o3', '눈앞', 2.6) - 0.15; put(tE, S.whoosh(0.45, 1500, 7000), 0.12); put(tE + 0.25, S.blip(1320), 0.08); put(tE + 0.35, S.blip(1760), 0.08)
tA = W('o3', '정답', 3.4); put(tA - 0.1, S.letters(18, 0.065, 900), 0.05)
c = A('o4'); steps(c + 0.1, E1('o4') + 0.2, 0.45, 0.07); put(W('o4', '눈치', 0.75) - 0.2, S.whoosh(0.9, 180, 700), 0.1)   # 감독관 발소리 + 하품
tP = W('o4', '0', 2.75); put(tP - 0.2, S.pop(900), 0.08); put(tP + 0.4, S.ding(), 0.08)
c = A('o5'); put(c, S.blip(523), 0.12); put(c + 0.08, S.blip(392), 0.12); put(W('o5', '상상', 1.3), S.question(), 0.1)
tN = W('o6', '아무도', 0.15)
for i in range(6): put(tN + 0.3 + i * 0.1, S.pop(900 - i * 60), 0.05)
put(W('o6', '100', 1.15) - 0.1, S.gauge(0.0, 1.0), 0.06); put(W('o6', '여러분', 2.85), S.flip(), 0.1)
tQ = W('o6', '쓰시겠', 5.1)
for i in range(4): put(tQ + i * 0.455, S.blip(990), 0.06)
# ======== 제목 카드 ========
iris('k0'); put(A('k0') + 0.15, S.hum(1.5), 0.6); put(A('k0') + 0.25, S.blip(660), 0.06); put(A('k0') + 0.35, S.pop(880), 0.08); iris('g1')
# ======== 1단계: 뉴스 → 그리스 ========
for k2, fb in (('AI', 0.3), ('시험', 1.65), ('부정', 2.1)): put(W('g1', k2, fb) - 0.05, S.land(), 0.14)
put(W('g1', '논란', 2.8), S.stamp(), 0.22)
c = A('g2'); put(c + 0.25, S.whoosh(0.5, 400, 3000), 0.1); put(W('g2', '질문', 1.45) - 0.2, S.pop(700), 0.08)
tY = W('g2', '2400', 1.99) - 0.1; put(tY, S.whoosh(1.0, 200, 2500), 0.12); put(tY, S.letters(9, 0.1, 1600)[::-1].copy(), 0.04); put(tY + 0.9, S.land(), 0.14)
tG = W('g2', '고대', 3.5) - 0.1; put(tG, S.sparkle(6, 0.6), 0.08); put(tG + 0.4, S.pop(760), 0.07)
put(W('g2', '시작', 5.3), S.pop(880), 0.06)
put(W('g3', '플라톤', 0.5) - 0.1, S.pop(760), 0.08); tKk = W('g3', '국가', 1.2) - 0.1; put(tKk, S.flip(), 0.12)
tGg = W('g3', '기계스', 2.1) - 0.1; put(tGg, S.rustle(0.4), 0.12); put(tGg + 0.45, S.sparkle(5, 0.4), 0.07); put(E1('g3') + 0.05, S.pop(900), 0.06)
# ======== 기게스 ========
iris('g4'); c = A('g4'); tR = W('g4', '반지', 2.5); steps(c + 0.2, tR, 0.32, 0.08)
tC = W('g4', '우연히', 1.6) - 0.1; put(tC, S.land(), 0.2); put(tC, S.low(70, 0.7), 0.25); put(tC + 0.1, S.bang(), 0.08)
put(tR - 0.3, S.sparkle(5, 0.5), 0.08); tPk = W('g4', '줍는', 3.1); put(tPk + 0.32, S.coin(), 0.1)
tIn = W('g4', '안쪽', 4.5) - 0.2; put(tIn - 0.1, S.pop(700), 0.08)
for i in range(3): put(tIn + 0.3 + i * 0.3, S.tick(1100), 0.06)
tV = W('g4', '투명', 5.6) - 0.1; put(tV, S.whoosh(0.7, 2000, 8000), 0.1); put(tV + 0.05, S.sparkle(7, 0.6), 0.08)
put(W('g4', '능력', 6.9), S.question(), 0.06)
tKd = W('g5', '깨달은', 1.75); put(tKd - 0.2, S.ding(), 0.1); put(W('g5', '착하던', 2.4) + 0.2, S.hurt(), 0.07)
tX = W('g5', '순식간', 3.85) - 0.15; bands_t = tX; put(tX - 0.2, S.bands(), 0.24); put(tX + 0.3, S.whoosh(0.6, 800, 6000), 0.1)
put(tX + 0.35, S.question(), 0.05); put(tX + 0.55, S.question(), 0.05)
tWk = W('g5', '왕을', 4.8); put(tWk, S.boing(220, 620, 0.3), 0.14); put(tWk + 0.4, S.land(), 0.1); put(tWk + 0.55, S.coin(), 0.08)
tNn = W('g5', '나라를', 5.55); put(tNn + 0.1, S.stamp(), 0.2); put(E1('g5') + 0.1, S.hurt(), 0.12); put(E1('g5') + 0.15, S.low(87, 1.0), 0.18)   # 축하 대신 씁쓸하게
iris('g6'); tS = W('g6', '섬뜩', 1.5); put(tS - 0.3, S.low(98, 1.4), 0.3); put(tS, S.hum(1.6), 0.5); put(W('g6', '질문', 2.3) - 0.1, S.question(), 0.08)
put(W('g7', '진짜', 1.6) - 0.3, S.pop(760), 0.08); put(W('g7', '아니면', 3.95), S.bang(), 0.08); put(W('g7', '보고', 5.4) - 0.2, S.pop(880), 0.08)
bands('g8'); put(A('g8') + 0.05, S.pop(700), 0.07); put(W('g8', 'AI', 0.7) - 0.1, S.pop(880), 0.07); tB = W('g8', '바로', 1.45); put(tB, S.ding(), 0.12); put(tB + 0.05, S.sparkle(5, 0.4), 0.07)
put(E1('g8') + 0.05, S.pop(900), 0.06)
iris('g9'); tVv = W('g9', '사라진', 1.07)
for i in range(5): put(tVv + 0.3 + i * 0.12, S.pop(820 - i * 70), 0.06)
tM = W('g9', '나만', 2.75); put(tM - 0.1, S.pop(640), 0.08); put(tM + 0.3, S.blip(1760), 0.05); put(tM + 0.45, S.blip(1760), 0.05)
put(tM - 0.35, S.whoosh(0.35, 250, 1400), 0.08)                                  # 악마가 책상 뒤에서 엿봄
tTe = W('g9', '유혹', 5.4) - 0.1; put(tTe + 0.05, S.sparkle(3, 0.25), 0.05)       # 눈이 번뜩
tHh = W('g9', '고개', 6.15); put(tHh - 0.15, S.whoosh(0.6, 150, 1800), 0.16); put(tHh - 0.1, S.low(98, 1.1), 0.22)   # 펑 + 솟아오름
for i in range(5): put(tHh + 0.35 + i * 0.18, S.whoosh(0.12, 300, 1200), 0.05)   # 날갯짓
put(E1('g9') + 0.1, S.ghost(0.7), 0.06)

if FULL:
    # ======== 2단계: 가짜 해피엔딩 → 천만에요 ========
    tS = W('c1', '100', 1.0) - 0.1; put(tS + 0.2, S.stamp(), 0.16); put(tS + 0.45, S.stamp(), 0.12); put(tS + 0.1, S.coin(), 0.08)
    put(W('c1', '해피', 2.6) - 0.2, S.whoosh(0.4, 400, 2500), 0.08); put(E1('c1') + 0.02, S.stage(), 0.14)
    c = A('c2'); put(c, S.whoosh(0.18, 600, 6000), 0.22); put(c + 0.05, S.hurt(), 0.12); put(c + 0.1, S.letters(8, 0.03, 300), 0.08); put(c + 0.4, S.low(80, 0.8), 0.18)
    put(W('c3', '찰스', 1.0) - 0.1, S.pop(760), 0.08); put(E1('c3') + 0.03, S.item(), 0.2)
    c = A('c4'); put(c + 0.05, S.flip(), 0.1); tT = W('c4', '목표', 0.9); put(tT - 0.1, S.pop(880), 0.08); put(W('c4', '아니다', 4.3), S.strike(), 0.1)
    put(W('c5', '점수', 0.6) - 0.1, S.pop(700), 0.08); hitT = W('c5', '실력', 1.65) - 0.2 + 0.25; put(hitT - 0.12, S.whoosh(0.15, 800, 4000), 0.1); put(hitT, S.land(), 0.22); put(hitT + 0.1, S.letters(8, 0.07, 900), 0.05); put(hitT + 0.72, S.ding(), 0.08); put(W('c5', '위한', 2.35), S.pop(820), 0.06)   # 펀치 기계
    tA2 = W('c6', '점수', 0.55) - 0.1; put(tA2 + 0.5, S.blip(1320), 0.07); put(tA2 + 0.62, S.blip(1320), 0.07)
    tKu = W('c6', '키우는', 4.5); put(tKu - 0.1, S.land(), 0.08); put(tKu + 0.1, S.whoosh(0.3, 300, 2000), 0.06); tSt = W('c6', '훔치는', 5.9) - 0.1; put(tSt - 0.05, S.boing(300, 760, 0.4), 0.12); put(tSt + 0.35, S.pop(1100), 0.12)   # 아령 걷어참 → 폴짝 → 스티커 착
    tKk = W('c6', '꼼수', 6.3); put(tKk - 0.15, S.pop(980), 0.1); put(tKk + 0.1, S.stamp(), 0.18)
    put(tKk + 0.6, S.pop(760), 0.06)   # '샌드백은 그대로인데 999'
    # ======== 3년 뒤: 스펙 → 가스 누출 보스 → 안경 먹통 → 껍데기 ========
    c = A('c7'); put(c + 0.1, S.flip(), 0.1); tSp = W('c7', '스펙', 2.95) - 0.2
    for i in range(3): put(tSp + i * 0.12, S.pop(760 + i * 80), 0.08)
    tJ = W('c7', '정작', 4.45) - 0.1; put(tJ, S.bang(), 0.12)
    for i in range(6): put(tJ + 0.1 + i * 0.26, S.blip(880 if i % 2 else 660), 0.07)   # 경보
    put(tJ + 0.3, S.ghost(0.8), 0.08)
    tB = W('c7', '벗어', 5.5); put(W('c7', '안경을', 4.85), S.blip(1760), 0.1); put(tB - 0.1, S.hurt(), 0.14); put(tB, S.letters(5, 0.06, 1400)[::-1].copy(), 0.06)
    put(W('c7', '위기', 7.2) - 0.1, S.low(98, 1.0), 0.16); put(W('c7', '아무것도', 7.8), S.pop(700), 0.08)
    tSh = W('c7', '껍데기', 9.5) - 0.1; put(tSh, S.whoosh(0.5, 1500, 6000), 0.1); put(tSh + 0.5, S.whoosh(1.2, 200, 1500), 0.14)
    tFix = E1('c7') + 0.15 - 1.3
    for i in range(3): put(tFix + i * 0.12, S.tick(900), 0.1)
    put(tFix + 0.4, S.ding(), 0.1)
    c = A('c8'); tR = W('c8', '사실은', 1.47) - 0.1; steps(c + 0.1, tR, 0.3, 0.06)
    put(tR, S.whoosh(0.4, 300, 4000)[::-1].copy(), 0.12)
    for i in range(6): put(tR + 0.4 + i * 0.25, S.pop(1200 + i * 40), 0.04)
    tSd = W('c8', '도둑', 4.29) - 0.1; put(tSd, S.whoosh(0.9, 500, 4000), 0.12); put(tSd + 0.3, S.hurt(), 0.08)
    # ======== 다시 하기 ========
    c = A('r0'); put(c + 0.05, S.low(110, 0.6), 0.12); put(c + 0.85, S.pop(900), 0.14); put(c + 0.9, S.equip(), 0.14); put(c + 1.1, S.whoosh(0.7, 300, 3000)[::-1].copy(), 0.14)
    # ======== 3단계: 2회차 ========
    c = A('d1'); put(c + 0.05, S.stage(), 0.1)
    k2 = 0
    while c + 0.3 + k2 < E1('d2'): put(c + 0.3 + k2, S.tick(1500), 0.05); put(c + 0.8 + k2, S.tick(1200), 0.035); k2 += 1
    put(W('d2', '결국', 0.71), S.breath(0.6), 0.25); tO = W('d2', '벗어', 2.05) - 0.1; put(tO, S.tick(1100), 0.08)
    tPl = W('d2', '내려놓', 3.09) - 0.1; put(tPl + 0.05, S.land(), 0.1); put(tPl + 0.12, S.whoosh(0.5, 300, 2500), 0.12); put(tPl + 0.2, S.boing(620, 200, 0.25), 0.1)
    c = A('d3')
    for i, t0 in enumerate([0.1, 0.8, 1.5, 2.2]): put(c + t0, S.pop(700 + i * 60), 0.06); steps(c + t0 + 0.1, c + t0 + 1.4, 0.32, 0.05)
    put(c + 0.2, S.scribble(2.6), 0.06); put(W('d3', '손해', 2.37) - 0.1, S.pop(500), 0.1)
    tA4 = W('d4', 'ai', 0.43) - 0.1; put(tA4, S.boing(400, 900, 0.25), 0.08)
    for i in range(30): put(tA4 + 0.25 + i / 22, S.tick(1300 + (i % 4) * 90), 0.035)
    put(W('d4', '초', 1.85), S.blip(1760), 0.08); put(W('d4', '희소', 5.33) - 0.1, S.whoosh(0.5, 300, 2000), 0.08); put(W('d4', '아는', 7.31) - 0.3, S.pop(520), 0.08)
    tS4 = W('d4', '스스로', 7.97) - 0.1; put(tS4, S.flip(), 0.12); put(tS4 + 0.4, S.sparkle(8, 0.7), 0.08)
    tM4 = W('d4', '근육', 10.11) - 0.2; put(tM4, S.gauge(0.15, 1.0), 0.07); put(E1('d4') + 0.05, S.item(), 0.2)
    put(W('d5', '어둠', 3.69) - 0.1, S.low(130, 1.2), 0.08); put(W('d5', '스스로', 4.57), S.heart(), 0.14); put(W('d5', '기준', 6.79), S.ding(), 0.07)
    # ======== 아웃트로 ========
    c = A('e1'); put(c + 0.1, S.boing(300, 600, 0.3), 0.08)
    for i in range(5): put(c + 0.8 * (i + 1) - 0.05, S.flip(), 0.04)
    put(W('e1', '건넬', 3.19) - 0.2, S.sparkle(5, 0.5), 0.07)
    c = A('e2'); steps(c + 0.1, c + 1.4, 0.34, 0.07); put(W('e2', '낄지', 1.31) - 0.1, S.question(), 0.06)
    put(W('e2', '몫', 4.25) - 0.2, S.land(), 0.06); put(W('e2', '몫', 4.25), S.sparkle(5, 0.5), 0.07); put(W('e2', '몫', 4.25) + 0.05, S.pop(900), 0.08)   # 그녀가 내려놓은 뒤 엄지척
    tZ = W('e3', '%', 1.91) - 0.2; put(tZ, S.blip(1320), 0.1); put(tZ + 0.05, S.pop(520), 0.1); put(W('e3', '여러분', 4.07), S.flip(), 0.1)
    for i in range(5): put(W('e3', '여러분', 4.07) + 0.4 + i * 0.42, S.blip(990), 0.05)
    put(A('e4') + 0.05, S.flip(), 0.1); put(A('e4') + 0.5, S.pop(860), 0.08)
    put(A('e5') + 0.1, S.pop(880), 0.08)
    for i in range(4): put(A('e5') + 0.5 + i * 0.25, S.pop(700 + i * 80), 0.05)
    put(E1('e5') + 0.1, S.clear(), 0.2)

mixd = voice * 1.0 + bed + sfx * 0.6
if os.environ.get('GY_STEMS'): np.savez('/dev/shm/gy/stems.npz', voice=voice, bed=bed, sfx=sfx)
sf.write('/dev/shm/gy/mix_raw.wav', mixd, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/dev/shm/gy/mix_raw.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), '/dev/shm/gy/mix.wav'], check=True)
print('dur', round(DUR, 2), 'peak raw', round(float(np.abs(mixd).max()), 2))
