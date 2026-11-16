"""사피엔스 편 1막 샘플: voice + BGM(commute·savanna, 덕킹) + 게임 감각 효과음(zw/gf_sfx.py) -> /dev/shm/sp/mix.wav (loudnorm -14)
효과음 시각은 spgf.js의 화면 반응과 같은 식(낱말 시각 또는 장면 시작 + 초). 낱말 위의 소리는 짧고 작게, 가락은 말이 끝난 뒤에."""
import json, subprocess, sys, os, numpy as np, soundfile as sf
os.chdir(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, '../../zw')
import gf_sfx as S
SR = 44100
TL = json.load(open('timeline_sp.json')); L = {l['id']: l for l in TL['lines']}; DUR = TL['duration']; N = int(DUR * SR)
voice, _ = sf.read('/dev/shm/sp/voice_sp.wav', dtype='float32')
if voice.ndim > 1: voice = voice.mean(1)
voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
A = lambda k: L[k]['t0'] - 0.15                       # 장면 시작(lt = 0)
E1 = lambda k: L[k]['t1']
def W(lid, key, fb, n=0):                             # spW와 같은 규칙(fb는 장면 시작 기준)
    m = [w for w in L[lid].get('words', []) if key in w['w'].replace(' ', '')]
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
B = '/dev/shm/sp/bgm/'
def bg(name): return B + name + ('.mp3' if os.path.exists(B + name + '.mp3') else '.opus')
SEG = [('commute', 0, A('k0') + 0.25, 0.30, 0.0),
       ('savanna', A('r1') - 0.3, A('m1') + 0.3, 0.28, 0.0),
       ('papercity', A('m1') - 0.3, A('p1') + 0.2, 0.28, 0.0),
       ('savanna', A('w1') - 0.3, A('w4') + 0.2, 0.24, 30.0),
       ('boss', A('w4') - 0.2, A('b1') + 0.3, 0.28, 0.0),
       ('meadow', A('b1') - 0.3, A('e1') + 0.4, 0.26, 0.0),
       ('ending', A('e1') - 0.5, DUR, 0.30, 0.0)]
for name, t0, t1, g, off in SEG: place(bg(name), t0, t1, g, fin=0.8 if t0 > 0.1 else 0.3, fout=1.0 if t1 < DUR - 0.1 else 1.6, off=off)
def trail_sum(x, k): c = np.concatenate([[0.0], np.cumsum(x)]); i = np.arange(len(x)); return c[i + 1] - c[np.maximum(0, i + 1 - k)]
vad = (np.abs(voice) > 0.006).astype(float)
act = (trail_sum(vad, int(0.5 * SR)) > 0) | (trail_sum(vad[::-1], int(0.15 * SR))[::-1] > 0)
k = int(0.12 * SR); act = trail_sum(act.astype(float), k) / k
bed *= (1.0 - 0.70 * act)

sfx = np.zeros(N)
def put(t, w, g=1.0):
    i = int(t * SR)
    if i < 0 or i >= N: return
    w = w[:N - i]; sfx[i:i + len(w)] += w * g
def steps(t0, t1, iv=0.38, g=0.16):
    k = 0
    while t0 + k * iv < t1: put(t0 + k * iv, S.step(), g); k += 1
def iris(lid, g1=0.45, g2=0.4): c = A(lid); put(c - 0.26, S.iris_close(), g1); put(c + 0.02, S.iris_open(), g2)
STOP = 0.85

# ----- s1a: 횡단보도 — 급한 발소리 → 빨간불에 끽 → 버스 휙 → 헉헉 -----
tR = W('s1a', '끊긴', 0.69); tL = W('s1a', '신호', 1.05); tBus = tL - 0.05; tMs = tBus + 0.28; tSl = tBus + 0.95
put(0.05, S.stage(), 0.2); steps(0.1, tR, 0.2, 0.13)
for i in range(3): put(tR - 0.95 + i * 0.32, S.blip(990), 0.05)          # 초록불 깜빡
put(tR, S.whoosh(0.35, 2500, 8000), 0.12); put(tR + 0.02, S.blip(440), 0.1)   # 미끄러짐 + 빨간불
put(tBus - 0.15, S.whoosh(1.1, 90, 1200), 0.34); put(tMs, S.hurt(), 0.2)   # 버스가 코앞을 휙
put(tSl + 0.1, S.whoosh(0.7, 150, 1800), 0.16)                             # 승용차
put(E1('s1a') + 0.05, S.breath(0.45), 0.45); put(E1('s1a') + 0.45, S.breath(0.45), 0.4)   # 헉헉(말 끝난 뒤)
put(A('s1a') + tSl - A('s1a') + 0.35, S.tick(1600), 0.1)                  # 시계 08:21
# ----- s1b: 만원 지하철 — 밀려듦 → 끼이익 쏠림 → 숨 게이지 바닥 -----
c = A('s1b'); tSq = W('s1b', '막히', 0.41); tLu = W('s1b', '만원', 0.93); tJ = W('s1b', '지하철', 1.29); tMs = tJ + 0.32
put(c - 0.26, S.bands(), 0.4); put(c, S.whoosh(2.6, 70, 500), 0.14)        # 차 안 웅웅
put(tSq, S.boing(600, 220, 0.25), 0.1); put(tSq + 0.1, S.whoosh(0.3, 300, 2000), 0.08)
put(tLu, S.whistle(0.45), 0.05); put(tMs, S.hurt(), 0.2)
put(E1('s1b') + 0.08, S.blip(523), 0.12); put(E1('s1b') + 0.24, S.blip(523), 0.1)   # 숨 게이지 경고
# ----- s1c: 엘리베이터 — 문이 코앞에서 쿵 → 폰 부르르 → 말풍선 비 → "이거 다시 해와"에 깔림 -----
c = A('s1c'); tC0 = W('s1c', '자리', 0.37); tC1 = W('s1c', '기도', 0.83) + 0.06; tPh = W('s1c', '날아', 1.33); tBo = W('s1c', '상사', 1.69); tI = W('s1c', '이거', 2.15); tH = W('s1c', '해와', 2.99); tSlam = tH + 0.34
put(c - 0.26, S.bands(), 0.4); steps(c + 0.1, tC0, 0.2, 0.12); put(tC0, S.whoosh(0.5, 300, 1500), 0.08)
put(tC1, S.land(), 0.34); put(tC1 + 0.1, S.sparkle(3, 0.3), 0.06)
for i in range(5): put(tC1 + 0.3 + i * 0.32, S.tick(1800), 0.05)             # 층수 올라감
put(tPh, S.hum(0.5), 0.45)                                                   # 폰 진동
for i in range(4): put(tBo + i * 0.26, S.pop(700 + i * 80), 0.07); put(tBo + i * 0.26 + 0.5, S.pop(420), 0.07)
put(tI, S.boing(200, 500, 0.3), 0.08); put(tSlam, S.stamp(), 0.3); put(tSlam + 0.02, S.hurt(), 0.2)
tHb = max(tSlam + 0.4, E1('s1c') + 0.05); put(tHb, S.blip(523), 0.12); put(tHb + 0.16, S.blip(523), 0.1)   # 마지막 하트 두근
# ----- s2: 문 앞에 털썩, 영혼이 털림 -----
c = A('s2'); put(c + 0.05, S.letters(3, 0.08, 900), 0.12); put(c + 0.02, S.land(), 0.16)
put(W('s2', '영혼', 0.71), S.ghost(0.9), 0.16); put(W('s2', '아시죠', 2.25), S.pop(500), 0.1)
# ----- s3: 상상 게임 (도트 세계로) -----
tF = W('s3', '기를', 2.8); put(tF, S.boing(300, 700, 0.22), 0.12)
for key, fb, f in (('돈', 3.6, 700), ('회사', 4.0, 820), ('직급', 4.4, 940)): put(W('s3', key, fb), S.pop(f), 0.14)
put(W('s3', '7만', 6.4), S.tick(1500), 0.14)
tG = W('s3', '게임', 7.6)
for i in range(4): put(tG + i * 0.07, S.blip([523, 659, 784, 1046][i]), 0.1)   # 도트로 바뀌는 소리
put(tG + 0.35, S.pop(640), 0.12)                                     # 점선 상자 + '상상 게임'
# ----- s4: 다시 벡터 → 퀘스트 → 가벼워짐 -----
c = A('s4'); put(c + 0.15, S.whoosh(0.35, 800, 4000), 0.1)
tR = W('s4', '규칙', 1.0); put(tR - 0.1, S.flip(), 0.14)
tL = W('s4', '가벼워', 4.2); put(tL, S.boing(300, 760, 0.3), 0.14); put(tL + 0.2, S.tick(2000), 0.1); put(tL + 0.1, S.sparkle(5, 0.4), 0.1)
put(E1('s4') + 0.05, S.clear(), 0.26)
# ----- 제목 카드 -----
c = A('k0'); put(c - 0.26, S.iris_close(), 0.6); put(c + 0.02, S.iris_open(), 0.5); put(c + 0.1, S.hum(1.6), 1.0)
# ----- r1: 원시인 제로와 네안데르탈인 친구 -----
iris('r1'); c = A('r1'); put(c + 0.25, S.pop(600), 0.14); put(c + 0.4, S.pop(760), 0.14)
put(W('r1', '하라리', 0.6), S.pop(820), 0.12); put(W('r1', '호모', 3.2), S.pop(700), 0.12); put(W('r1', '비결', 5.0), S.question(), 0.16)
# ----- r2: 인지 혁명 아이템 카드 -----
tI = W('r2', '능력', 1.6); put(tI - 0.3, S.pop(700), 0.14); put(tI, S.sparkle(5, 0.4), 0.1)
put(E1('r2') + 0.05, S.item(), 0.26)
# ----- r3: 150명의 한계 -----
c = A('r3'); t150 = W('r3', '150', 2.6); tC = W('r3', '협력', 4.0)
for i in range(10): put(c + 0.1 + i * 0.22, S.blip(600 + i * 25), 0.05)   # 무리가 늘어남
put(t150, S.gauge(0.4, 1.0), 0.12)
tCr = t150 + (1 - 0.4) / (1.12 - 0.4) * (tC + 0.4 - t150); put(tCr, S.strike(), 0.12)   # 막대 금
put(tC + 0.3, S.hurt(), 0.1); put(tC + 0.4, S.whoosh(1.0, 400, 3000), 0.1)          # 흩어짐
# ----- r4: 보이지 않는 이야기 -----
for i, (key, fb) in enumerate((('국가', 0.6), ('법인', 1.2), ('종교', 1.8), ('돈이라는', 2.6))): put(W('r4', key, fb), S.pop(640 + i * 110), 0.14)
put(W('r4', '보이지', 3.4), S.sparkle(5, 0.5), 0.12)
# ----- r5: 다리 짓기 — 줄 서기 → 통나무 건네기 → 널 깔기(톡톡) → 완성 → 건너는 발소리 -----
c = A('r5'); tGo = W('r5', '생판', 0.91); tA = W('r5', '수백만', 2.23) - 0.25; tT = W('r5', '팀', 3.71); stp = (tT - 0.08 - tA) / 6
put(tGo, S.whoosh(1.0, 400, 3000), 0.08); steps(tGo, tGo + 1.0, 0.1, 0.05)
for k in range(7): put(tA + k * stp, S.pop(480 + k * 45), 0.09)
for k in range(6): put(tA + stp * 0.5 + k * stp, S.pop(520 + k * 45), 0.08)
put(tT, S.sparkle(6, 0.5), 0.1); put(E1('r5') + 0.05, S.clear(), 0.28)
steps(E1('r5') + 1.1, DUR - 0.6, 0.24, 0.05)

# ======== 2막: 종이 도시 ========
c = A('m1'); put(W('m1', '지갑', 0.6), S.rustle(0.25), 0.2); tB = W('m1', '지폐', 1.6); put(tB, S.flip(), 0.16); put(W('m1', '숫자', 2.9), S.sparkle(4, 0.3), 0.08)
put(W('m1', '색칠', 3.5), S.whoosh(0.5, 2000, 6000), 0.06); put(W('m1', '종이', 3.9), S.rustle(0.3), 0.16); put(W('m1', '뿐이', 4.6), S.whoosh(0.9, 300, 1800), 0.08)
c = A('m2'); put(c - 0.26, S.bands(), 0.35)
for i in range(8): put(c + 0.2 + i * 0.06, S.blip(700 + i * 40), 0.04)
put(W('m2', '믿으', 1.6), S.sparkle(5, 0.4), 0.08); tS = W('m2', '편의점', 2.6); steps(tS - 0.3, W('m2', '밥과', 3.4) - 0.1, 0.24, 0.1); tX = W('m2', '바꿀', 3.8); put(tX, S.coin(), 0.12); put(tX + 0.05, S.flip(), 0.1); put(tX + 0.35, S.pop(760), 0.1)
put(W('m3', '회사', 0.2), S.ding(), 0.08); put(W('m3', '직급', 0.9), S.equip(), 0.14); put(W('m3', '직급', 0.9) + 0.05, S.pop(820), 0.08)
tT = W('m4', '만질', 0.9); put(tT, S.whoosh(0.3, 900, 4000), 0.06); put(W('m4', '약속', 3.4), S.sparkle(5, 0.4), 0.06); tOff = W('m4', '게임', 4.6) + 0.15
put(tOff, S.pop(980), 0.14); put(tOff + 0.2, S.rustle(0.6), 0.12); put(tOff + 0.25, S.whoosh(0.6, 300, 1500), 0.1); put(tOff + 0.9, S.land(), 0.2)
for i in range(8): put(tOff + 0.3 + i * 0.02, S.pop(500 + i * 30), 0.03)
# ======== 제4의 벽 ========
c = A('p1'); put(c + 0.02, S.blip(880), 0.16); put(c + 0.14, S.blip(660), 0.16); put(c, S.low(110, 3.0), 0.14); steps(c + 0.05, c + 0.9, 0.3, 0.1)
put(W('p1', '출근', 1.7), S.pop(700), 0.08); put(W('p1', '돈도', 2.5), S.pop(820), 0.08); put(W('p1', '소리', 3.6), S.question(), 0.12)
c = A('p2'); put(c + 0.12, S.stamp(), 0.24); put(c + 0.15, S.pop(500), 0.08); put(c + 0.2, S.pop(560), 0.08)
c = A('p3'); put(c, S.low(98, 4.0), 0.12); put(W('p3', '허구', 1.6), S.pop(640), 0.08); put(W('p3', '잊어', 2.2), S.whoosh(0.6, 300, 1500), 0.08); tSl = W('p3', '노예', 4.2); put(tSl, S.whoosh(0.5, 600, 3000), 0.1); put(tSl + 0.1, S.low(147, 1.2), 0.18)
# ======== 밀 대왕 ========
c = A('w1'); put(c - 0.26, S.bands(), 0.35); tF = W('w1', '농업', 2.6); put(tF - 0.05, S.boing(300, 800, 0.3), 0.1); put(tF, S.sparkle(5, 0.4), 0.08); put(W('w1', '최대', 4.4), S.stamp(), 0.24)
tF = W('w2', '다양', 3.3)
for i in range(5): put(tF + i * 0.12, S.pop(700 + i * 70), 0.07)
put(W('w2', '몇', 1.8), S.gauge(0.0, 0.25), 0.06)
tP = W('w3', '인구', 1.6); put(tP, S.letters(8, 0.12, 700), 0.05); put(W('w3', '개인', 3.0), S.hurt(), 0.1); tD = W('w3', '종일', 3.8); put(tD, S.whoosh(1.6, 300, 2500), 0.06)
put(W('w3', '영양', 5.6), S.hurt(), 0.1); tSk = W('w3', '전염병', 6.6); put(tSk, S.hurt(), 0.12); put(tSk + 0.1, S.low(150, 1.0), 0.12)
tK = W('w4', '밀이', 1.7); put(tK - 0.2, S.low(70, 1.6), 0.5); put(tK - 0.2, S.whoosh(1.2, 60, 700), 0.3); put(tK + 0.3, S.bang(), 0.12)
put(tK + 0.45, S.boing(400, 900, 0.25), 0.1)
for i in range(3): put(tK + 0.7 + i * 0.11, S.blip(700 - i * 90), 0.05)
tTm = W('w4', '길들', 2.2); put(tTm, S.strike(), 0.12); tR = W('w4', '번식', 3.3)
for i in range(8): put(tR + i * 0.06, S.pop(600 + i * 50), 0.05)
c = A('w5'); put(c, S.whoosh(0.7, 200, 1500), 0.12); put(c + 0.1, S.low(130, 1.2), 0.12)
put(W('w6', '기술', 0.9), S.pop(760), 0.08)
tSp = W('w6', '스펙', 1.6)
for i in range(4): put(tSp + i * 0.12, S.pop(600 + i * 80), 0.06)
put(W('w6', '연봉', 4.6), S.pop(880), 0.08); put(W('w6', '타이틀', 5.4), S.pop(940), 0.08)
tFd = W('w6', '먹이', 6.4)
for i in range(5): put(tFd + 0.26 + i * 0.52, S.pop(220), 0.12)
put(tFd + 0.6, S.hurt(), 0.08); put(tFd + 1.6, S.hurt(), 0.08)
put(W('w6', '야근', 7.2), S.tick(1500), 0.1)
# ======== 상상의 질서 · 상자 탈출 ========
c = A('b1'); put(c - 0.26, S.bands(), 0.35); put(W('b1', '함무', 1.4) - 0.3, S.pop(560), 0.12)
for i in range(9): put(W('b1', '함무', 1.4) - 0.1 + i * 0.13, S.tick(1100 + (i % 3) * 120), 0.04)
put(W('b1', '독립', 5.8) - 0.1, S.rustle(0.5), 0.12); put(W('b1', '불평등', 2.8), S.blip(440), 0.06); put(W('b1', '독립', 5.8) - 0.3, S.pop(700), 0.12); put(W('b1', '자유', 6.8), S.sparkle(4, 0.4), 0.08)
tS2 = W('b2', '상상', 2.4); put(tS2 + 0.1, S.stamp(), 0.22); put(tS2 + 0.35, S.stamp(), 0.2)
c = A('b3'); put(c, S.whoosh(0.6, 200, 1200), 0.1); put(c + 0.3, S.pop(600), 0.1)
for i in range(4): put(c + 0.8 + i * 0.3, S.blip(500 + i * 60), 0.05)
put(W('b3', '30', 1.45), S.hurt(), 0.06); put(W('b3', '남들처럼', 3.79), S.hurt(), 0.06); put(W('b3', '30', 1.45) + 0.3, S.pop(900), 0.06); put(W('b3', '남들처럼', 3.79) + 0.3, S.pop(900), 0.06); put(W('b3', '자연', 7.6) + 0.1, S.stamp(), 0.24)
tR4 = W('b4', '깨닫', 0.57); tO = W('b4', '필요', 5.47); put(tR4, S.ding(), 0.12); put(tR4 + 0.2, S.whoosh(1.4, 300, 3000), 0.08); put(tR4 + 0.9, S.whoosh(0.4, 500, 2500), 0.08)
put(tR4 + 1.3, S.flip(), 0.12); put(W('b4', '피터지', 4.47) - 0.1, S.pop(900), 0.08); put(tR4 + 2.3, S.blip(1320), 0.1); steps(tO - 0.3, tO + 1.0, 0.3, 0.1)
for i in range(7): put(tO + 0.2 + i * 0.04, S.pop(600 + i * 60), 0.05)
put(E1('b4') + 0.1, S.item(), 0.24)
put(W('b5', '필요', 0.73), S.pop(760), 0.1); put(W('b5', '행복', 3.05), S.heart(), 0.16)
# ======== AI · 진짜 질문 · 국밥 ========
tAI = W('a1', 'AI', 2.6); put(tAI - 0.3, S.whoosh(0.5, 1500, 6000), 0.08); put(tAI + 0.2, S.land(), 0.12); put(tAI + 0.25, S.blip(1320), 0.08); put(tAI + 0.35, S.blip(1760), 0.08)
tH = W('a1', '인간', 4.23)
for i in range(4): put(tH + i * 0.1, S.pop(640 + i * 70), 0.06)
tR = W('a1', '대체', 5.41)
for i in range(4): put(tR + i * 0.18, S.flip(), 0.08)
put(tR + 0.1, S.whoosh(1.0, 1200, 5000), 0.06); put(tR + 0.6, S.ding(), 0.1)
tP = W('a2', '힘을', 1.57); tG = W('a2', '천재', 2.41)
for i in range(8): put(tP + i * 0.14, S.coin(), 0.04)
put(tG, S.gauge(0.0, 1.0), 0.06); tHa = W('a2', '행복', 4.27); put(tHa, S.hum(1.4), 0.3); put(tHa + 0.6, S.tick(900), 0.05); put(tHa + 0.9, S.blip(1400), 0.06)
put(W('a2', '부족', 6.33), S.low(196, 0.8), 0.1)
put(W('a3', '책', 0.65), S.flip(), 0.12); put(W('a3', '문장', 3.2), S.sparkle(6, 0.5), 0.08)
c = A('a4'); put(c + 0.2, S.flip(), 0.1); put(W('a4', '아니라', 4.75), S.strike(), 0.08); put(W('a4', '무엇', 6.13), S.ding(), 0.08)
tTi = W('a5', '타이틀', 2.05); put(tTi - 0.1, S.pop(880), 0.1); put(W('a5', '말고', 2.49) + 0.1, S.pop(400), 0.12); tWa = W('a5', '작고', 5.05); steps(tWa - 0.9, tWa - 0.1, 0.25, 0.08)
put(tWa, S.pop(700), 0.08); put(tWa + 0.15, S.pop(760), 0.08); put(W('a5', '따뜻', 5.69), S.heart(), 0.16); put(E1('a5') + 0.05, S.clear(), 0.26)
# ======== 엔딩 ========
c = A('e1'); steps(c + 0.2, A('e4') + 2.0, 0.55, 0.035)
for k, fb in (('돈도', 0.15), ('직급', 0.67), ('평가', 2.47)): put(W('e1', k, fb), S.pop(700), 0.07)
tBr = W('e1', '빌려', 5.19)
for i in range(3): put(tBr + i * 0.15, S.whoosh(1.0, 800, 3500), 0.05)
put(W('e1', '가치', 8.23), S.heart(), 0.14)
put(W('e2', '조급', 1.37) - 0.2, S.flip(), 0.1); put(W('e3', '내일', 0.37), S.pop(760), 0.08); put(W('e3', '댓글', 5.17), S.pop(860), 0.08)
put(W('e4', '하루', 2.83), S.sparkle(4, 0.4), 0.06); tEnd = W('e4', '세계', 4.17) + 0.7; put(tEnd + 0.2, S.flip(), 0.1); put(tEnd + 0.6, S.pop(860), 0.08); put(tEnd + 0.3, S.sparkle(8, 1.2), 0.07)

mixd = voice * 1.0 + bed + sfx * 0.6
if os.environ.get('SP_STEMS'): np.savez('/dev/shm/sp/stems.npz', voice=voice, bed=bed, sfx=sfx)
sf.write('/dev/shm/sp/mix_raw.wav', mixd, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/dev/shm/sp/mix_raw.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), '/dev/shm/sp/mix.wav'], check=True)
print('dur', round(DUR, 2), 'peak raw', round(float(np.abs(mixd).max()), 2))
