"""죽음의 수용소에서 편 1막 샘플: voice + BGM(night·story, 덕킹) + 게임 감각 효과음(zw/gf_sfx.py) -> /dev/shm/fk/mix.wav (loudnorm -14)
효과음 시각은 fkgf.js의 화면 반응과 같은 식(낱말 시각 또는 장면 시작 + 초). 낱말 위의 소리는 짧고 작게, 가락은 말이 끝난 뒤에."""
import json, subprocess, sys, os, numpy as np, soundfile as sf
os.chdir(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, '../../zw')
import gf_sfx as S
SR = 44100
TL = json.load(open('timeline_fk.json')); L = {l['id']: l for l in TL['lines']}; DUR = TL['duration']; N = int(DUR * SR)
voice, _ = sf.read('/dev/shm/fk/voice_fk.wav', dtype='float32')
if voice.ndim > 1: voice = voice.mean(1)
voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
A = lambda k: L[k]['t0'] - 0.15                       # 장면 시작(lt = 0)
E1 = lambda k: L[k]['t1']
D = lambda k: L[k]['t1'] - L[k]['t0'] + 0.15
def W(lid, key, fb, n=0):                             # fkW와 같은 규칙(fb는 장면 시작 기준)
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
B = '/dev/shm/fk/bgm/'
def bg(name): return B + name + ('.mp3' if os.path.exists(B + name + '.mp3') else '.opus')
SEG = [('night', 0, A('o3') + 0.4, 0.32, 0.0),
       ('story', A('o3') - 0.3, A('o5') + 0.5, 0.30, 0.0),
       ('night', A('o5') - 0.3, A('k0') + 0.25, 0.32, 24),
       ('story', A('f1') - 0.1, A('f4') + 0.5, 0.24, 14),
       ('night', A('f4') - 0.3, A('a1') + 0.4, 0.34, 44),
       ('office', A('a1') - 0.3, A('a5') + 0.4, 0.28, 0.0),
       ('story', A('a5') - 0.3, A('a6') + 0.4, 0.24, 30),
       ('office', A('a6') - 0.3, A('b2') + 0.3, 0.28, 26),
       ('night', A('b2') - 0.2, A('c1') + 0.4, 0.18, 10),
       ('warm', A('c1') - 0.3, A('c4') + 0.4, 0.30, 0.0),
       ('story', A('c4') - 0.3, A('c5') + 0.4, 0.24, 50),
       ('warm', A('c5') - 0.3, A('d1') + 0.4, 0.30, 40),
       ('meadow', A('d1') - 0.3, A('e1') + 0.4, 0.28, 0.0),
       ('story', A('e1') - 0.3, A('e3') + 0.4, 0.24, 62),
       ('ending', A('e3') - 0.3, DUR, 0.28, 0.0)]
for name, t0, t1, g, off in SEG: place(bg(name), t0, t1, g, fin=0.8 if t0 > 0.1 else 0.3, fout=1.2 if t1 < DUR - 0.1 else 2.4, off=off)
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
def beat2(t, g=0.16): put(t, S.blip(523), g); put(t + 0.16, S.blip(523), g * 0.8)   # 두근두근(마지막 하트)
def iris(lid, g1=0.45, g2=0.4): c = A(lid); put(c - 0.26, S.iris_close(), g1); put(c + 0.02, S.iris_open(), g2)

# ----- o1: 퇴근길 -----
c = A('o1'); tV = W('o1', '버티', 5.7); tStop = min(c + D('o1') - 0.6, tV + 0.25)
steps(c + 0.2, tStop); put(c, S.rain(D('o1') + 0.3), 0.5)
for key, fb in (('눈치', 1.6), ('처리', 2.7)):
    t0 = W('o1', key, fb); put(t0, S.pop(760), 0.2); put(t0 + 0.32, S.whoosh(0.3, 900, 5000), 0.14); put(t0 + 0.64, S.hurt(), 0.2)
tB = W('o1', '바닥', 4.6); beat2(tB, 0.14); beat2(tB + 0.6, 0.1)
put(tStop + 0.1, S.breath(0.8), 0.5); put(tStop + 0.6, S.letters(3, 0.2, 900), 0.1)
# ----- o2: 카드 두 장 -----
c = A('o2'); put(c - 0.26, S.bands(), 0.4); put(c + 0.08, S.pop(600), 0.22); put(c + 0.22, S.pop(760), 0.22)
put(W('o2', '똑같이', 0.4), S.pop(900), 0.16); tH = W('o2', '힘든', 1.0); put(tH - 0.25, S.pop(500), 0.14); put(tH + 0.02, S.hurt(), 0.18)
put(W('o2', '그날', 3.0), S.pop(700), 0.16); tX = W('o2', '무너지', 4.0); put(tX, S.gauge(0.33, 0.0), 0.16)
put(W('o2', '다음', 5.4), S.sparkle(4, 0.5), 0.14); tU = W('o2', '일어납', 6.8); put(tU, S.boing(300, 700, 0.3), 0.16); put(tU + 0.36, S.land(), 0.16); put(tU + 0.05, S.whoosh(0.35, 1500, 6000), 0.12)
put(E1('o2') + 0.05, S.heart(), 0.24)
# ----- o3: 80년 전 -----
iris('o3'); c = A('o3')
for i in range(10): put(c + 0.12 + i * 0.09, S.tick(1500 - i * 60), 0.1)
put(W('o3', '80', 0.4) + 0.1, S.whoosh(1.1, 300, 3000), 0.14)
put(W('o3', '빼앗긴', 2.2), S.whoosh(0.8, 400, 3000), 0.14); put(W('o3', '지옥', 3.7), S.whoosh(1.6, 200, 1800), 0.14)
tE = W('o3', '불씨', 5.6)
for i in range(5): put(tE + i * 0.16, S.blip(1046 + i * 130), 0.11)
put(E1('o3') + 0.05, S.sparkle(5, 0.5), 0.14)
# ----- o4: 거창한 각오? 아님 -----
tG = W('o4', '거창', 0.9); put(tG, S.pop(520), 0.22); put(tG + 0.05, S.sparkle(5, 0.4), 0.14)
tN = W('o4', '아니었', 1.8); put(tN, S.stamp(), 0.24)
# ----- o5: 작은 비밀 다섯 -----
iris('o5'); put(W('o5', '잠들기', 0.9), S.pop(700), 0.16)
put(W('o5', '가벼워', 3.6), S.whoosh(0.6, 1500, 6000), 0.12)
tF = W('o5', '다섯', 5.0); put(tF - 0.1, S.pop(640), 0.2)
for i in range(5): put(tF + i * 0.13, S.blip(800 + i * 90), 0.12)
put(W('o5', '이야기', 6.6), S.sparkle(5, 0.4), 0.16)
# ----- 제목 카드 -----
c = A('k0'); put(c - 0.26, S.iris_close(), 0.6); put(c + 0.02, S.iris_open(), 0.5); put(c + 0.1, S.hum(1.6), 1.0)
# ----- f1: 빅터 프랭클 -----
iris('f1'); tV = W('f1', '빅터', 2.4); put(tV, S.pop(700), 0.16); put(tV + 0.5, S.pop(820), 0.12)
put(W('f1', '1942', 4.6), S.pop(760), 0.15); put(W('f1', '3년', 6.8), S.pop(760), 0.15)
tC = W('f1', '끌려', 6.0); put(tC, S.pop(560), 0.18)
for i in range(3): put(tC + 0.15 + i * 0.13, S.blip(900 + i * 100), 0.1)
for key, fb in (('이름', 8.0), ('가족', 8.9), ('원고', 10.6)):
    t0 = W('f1', key, fb); put(t0, S.whoosh(0.35, 800, 4000), 0.14); put(t0 + 0.05, S.blip(440), 0.1)
put(W('f1', '잃었', 11.8) + 0.25, S.low(147, 1.4), 0.22)
# ----- f2: 춥고 어두운 곳 → 뜻밖의 장면 -----
put(W('f2', '어두운', 2.0) + 0.1, S.whoosh(1.2, 250, 2200), 0.14); put(W('f2', '뜻밖', 3.0), S.bang(), 0.18)
# ----- f3: 건장한 겉모습 / 작은 이유 하나 -----
c = A('f3'); put(c - 0.26, S.bands(), 0.4)
put(A('f3') + 0.05, S.pop(600), 0.14); put(W('f3', '건장', 0.7) + 0.35, S.pop(820), 0.08); tR = W('f3', '작은', 2.6); put(tR - 0.1, S.pop(800), 0.2); put(tR + 0.2, S.sparkle(4, 0.3), 0.14)
tE = W('f3', '끝까지', 5.0); put(tE, S.sparkle(6, 0.5), 0.14); put(tE + 0.05, S.gauge(0.5, 0.0), 0.1)
put(W('f3', '않았', 5.9), S.stamp(), 0.22); put(E1('f3') + 0.08, S.coin(), 0.22)
# ----- f4: 제로의 평범한 하루로 -----
iris('f4'); tA = W('f4', '이야기를', 0.3); put(tA, S.whoosh(1.4, 1500, 6000), 0.12); put(tA + 1.4, S.sparkle(4, 0.4), 0.14)
put(W('f4', '제로의', 2.2), S.pop(760), 0.18); beat2(W('f4', '지친', 4.4), 0.14); put(W('f4', '회복', 5.5), S.question(), 0.2)
put(A('f4'), S.rain(D('f4') + 1.0), 0.35)

# ======== 2막 이후 ========
def gain(lid, n, last=False):
    t1 = E1(lid); put(t1 + 0.05, S.clear() if last else S.item(), 0.3 if last else 0.28); put(t1 - 0.15 + 1.75, S.coin(), 0.2)
# a1~a4, a7: 회의실
c = A('a1'); put(c - 0.26, S.bands(), 0.4); put(W('a1', '회의', 0.25), S.pop(700), 0.14)
th = W('a1', '억울', 2.0) + 0.2; put(th - 0.45, S.whoosh(0.4, 900, 4000), 0.12); put(th, S.hurt(), 0.2)
put(A('a2') + 0.15, S.whoosh(0.5, 500, 4000), 0.12); tS = W('a2', '뾰족', 1.4)
for i in range(7): put(tS + i * 0.5, S.whoosh(0.35, 900, 4000), 0.07); put(tS + 0.45 + i * 0.5, S.hurt() if i < 3 else S.pop(420), 0.16 if i < 3 else 0.09)
tH = W('a3', '하지만', 0.2) + 0.1; put(tH, S.whoosh(0.5, 900, 4000), 0.1); tP = W('a3', '일시정지', 1.6); put(tP, S.blip(880), 0.16); put(tP + 0.12, S.blip(660), 0.16); put(tP + 0.05, S.low(330, 0.6), 0.1)
put(W('a3', '눌러', 2.7), S.tick(1800), 0.18)
put(W('a4', '자극', 0.3), S.pop(900), 0.12); put(W('a4', '반응', 0.9), S.pop(700), 0.12); t3 = W('a4', '3초', 1.6)
for i in range(3): put(t3 + i * 0.8, S.tick(1200), 0.12)
put(t3 + 2.4, S.ding(), 0.14); tBr = W('a4', '숨을', 2.4); put(tBr, S.breath(1.4), 0.45); put(tBr + 0.5, S.sparkle(5, 0.4), 0.1)
c = A('a7'); put(c - 0.26, S.iris_close(), 0.4); put(c + 0.02, S.iris_open(), 0.36); put(c + 0.3, S.blip(660), 0.14); put(c + 0.42, S.blip(880), 0.14)
put(c + 0.55, S.boing(500, 900, 0.22), 0.14); put(W('a7', '망치지', 2.4), S.boing(500, 900, 0.22), 0.14)
put(W('a7', '문을', 4.4), S.pop(500), 0.18); tC = W('a7', '닫아', 4.9); put(tC + 0.42, S.land(), 0.2); put(tC + 0.95, S.pop(400), 0.1)
gain('a7', 1)
# a5: 마지막 자유
c = A('a5'); put(c - 0.26, S.iris_close(), 0.4); put(c + 0.02, S.iris_open(), 0.36)
put(W('a5', '뺏어', 2.4), S.whoosh(0.7, 600, 4000), 0.12); put(W('a5', '태도', 4.4), S.sparkle(4, 0.4), 0.12); put(W('a5', '마지막', 6.0), S.pop(520), 0.18)
tG = W('a5', '건드리지', 7.6); put(tG, S.whoosh(1.1, 250, 2000), 0.14); put(tG + 0.2, S.tick(2400), 0.12)
# a6: 연구
c = A('a6'); put(c - 0.26, S.bands(), 0.4); put(W('a6', '273', 0.9), S.pop(760), 0.16); put(W('a6', '의미감', 3.4), S.sparkle(4, 0.3), 0.12)
put(W('a6', '힘든', 4.6) - 0.2, S.pop(500), 0.1); put(W('a6', '힘든', 4.6) + 0.02, S.hurt(), 0.12); put(W('a6', '곱씹', 6.6), S.whoosh(1.4, 300, 1500), 0.08); put(W('a6', '짧았', 8.4), S.pop(900), 0.14)
# b1~b4
c = A('b1'); put(c - 0.26, S.bands(), 0.4); tH = W('b1', '초인', 1.0); put(tH, S.boing(300, 800, 0.38), 0.16); put(tH + 0.1, S.sparkle(5, 0.4), 0.12); tN = W('b1', '않아요', 2.6); put(tN, S.pop(400), 0.16); put(tN + 0.05, S.stamp(), 0.16)
c = A('b2'); put(c - 0.26, S.iris_close(), 0.4); put(c + 0.02, S.iris_open(), 0.36); put(c, S.rain(E1('b3') - c + 0.5), 0.35)
put(W('b3', '문득', 0.7), S.ding(), 0.14)
c = A('b4'); put(c - 0.26, S.bands(), 0.4); tB = W('b4', '나쁜', 0.8)
for i in range(4): put(tB + i * 0.22, S.pop(800 + i * 60), 0.1)
put(W('b4', '방까지', 1.9), S.whoosh(0.6, 400, 2000), 0.08); put(W('b4', '있구나', 3.4), S.bang(), 0.16)
# c1~c3
c = A('c1'); put(c - 0.26, S.iris_close(), 0.4); put(c + 0.02, S.iris_open(), 0.36); put(c + 0.2, S.whoosh(1.4, 300, 2000), 0.12); put(c + 0.6, S.pop(760), 0.1)
put(W('c2', '내가', 2.0), S.pop(600), 0.12); put(W('c2', '아니라', 3.6), S.strike(), 0.1); tW = W('c2', '수고가', 4.8); put(tW, S.whoosh(1.6, 1200, 5000), 0.1); tE = W('c2', '편하게', 6.8); put(tE, S.sparkle(6, 0.5), 0.14); put(tE + 0.2, S.pop(900), 0.12)
c = A('c3'); put(c - 0.26, S.bands(), 0.4); put(W('c3', '청소', 2.4), S.pop(700), 0.12); put(W('c3', '돕는', 5.4), S.pop(860), 0.14); put(W('c3', '일깨워', 6.6), S.sparkle(5, 0.4), 0.12); put(W('c3', '만족도', 7.6), S.gauge(0.35, 0.9), 0.14)
gain('c3', 2)
# c4~c6
c = A('c4'); put(c - 0.26, S.iris_close(), 0.4); put(c + 0.02, S.iris_open(), 0.36); tF = W('c4', '미래의', 3.0)
for i in range(3): put(tF - 0.5 + i * 0.1, S.blip(700 + i * 200), 0.1)
put(W('c4', '상상', 4.0), S.sparkle(6, 0.5), 0.14)
c = A('c5'); put(c - 0.26, S.bands(), 0.4); put(W('c5', '1년', 0.3), S.sparkle(5, 0.4), 0.14)
put(W('c6', '영원', 3.2), S.whoosh(1.4, 500, 3500), 0.08); tW = W('c6', '다시', 5.4); steps(tW, tW + 2.4, 0.4, 0.14); put(tW + 0.1, S.heart(), 0.16)
gain('c6', 3)
# d1~d6
c = A('d1'); put(c - 0.26, S.iris_close(), 0.4); put(c + 0.02, S.iris_open(), 0.36); steps(c + 0.2, E1('d2'), 0.28, 0.12)
put(W('d1', '행복해야', 0.9), S.pop(760), 0.12); put(W('d1', '남들처럼', 2.2), S.pop(820), 0.12); put(W('d1', '공허', 4.8), S.hurt(), 0.12)
put(W('d2', '쫓아', 1.2), S.boing(300, 760, 0.4), 0.16); put(W('d2', '달아', 2.2), S.whoosh(0.7, 1500, 6000), 0.14); put(W('d2', '달아', 2.2) + 0.3, S.pop(700), 0.1)
tG = W('d3', '목표', 0.6); put(tG, S.pop(600), 0.12); put(tG + 0.5, S.stamp(), 0.14); put(W('d3', '좋아하는', 2.6), S.land(), 0.12); put(W('d3', '몰입', 4.0), S.sparkle(4, 0.4), 0.08)
tQ = W('d3', '따라오는', 5.4); put(tQ, S.whoosh(0.9, 1500, 5000), 0.08); put(tQ + 0.9, S.blip(2200), 0.1); put(tQ + 1.0, S.blip(2600), 0.1); put(tQ + 0.95, S.heart(), 0.14); put(W('d3', '부산물', 6.6), S.pop(860), 0.14)
c = A('d4'); put(c - 0.26, S.bands(), 0.4); tJ = W('d4', '자극', 2.6); put(tJ, S.sparkle(8, 0.3), 0.14); put(tJ + 0.4, S.gauge(0.95, 0.1), 0.08); put(W('d4', '몰입', 3.8), S.gauge(0.05, 0.8), 0.12); put(W('d4', '오래', 5.8), S.sparkle(5, 0.5), 0.12)
c = A('d5'); put(c - 0.26, S.bands(), 0.4); put(W('d5', '억지로', 0.3) + 0.2, S.blip(500), 0.1); put(W('d5', '괜찮아', 2.0), S.heart(), 0.16)
put(W('d6', '하나면', 3.0), S.pop(760), 0.14); put(W('d6', '충분', 3.6), S.heart(), 0.16)
gain('d6', 4)
# e1~e5
c = A('e1'); put(c - 0.26, S.iris_close(), 0.4); put(c + 0.02, S.iris_open(), 0.36); put(W('e1', '비밀', 3.2), S.sparkle(5, 0.4), 0.14)
put(W('e2', '빵', 5.2), S.pop(560), 0.12); tN = W('e2', '나누었', 6.6); put(tN, S.pop(700), 0.12); put(tN + 0.55, S.sparkle(5, 0.4), 0.14)
c = A('e3'); put(c - 0.26, S.iris_close(), 0.4); put(c + 0.02, S.iris_open(), 0.36); steps(c + 0.15, E1('e3') - 0.2, 0.38, 0.14); put(c, S.rain(E1('e5') - c), 0.3)
put(W('e4', '누군가', 3.0), S.land(), 0.12); put(W('e4', '고생', 4.0), S.pop(820), 0.12); tG = W('e4', '건넨', 5.4); put(tG, S.whoosh(1.0, 1500, 6000), 0.1); put(tG + 1.0, S.sparkle(5, 0.4), 0.14)
put(W('e5', '온기가', 0.6), S.sparkle(4, 0.4), 0.12); tC = W('e5', '먹구름', 2.0); put(tC, S.whoosh(0.4, 1500, 6000), 0.12); put(tC + 0.45, S.whoosh(0.4, 1500, 6000), 0.12)
tR = W('e5', '걷어', 2.9); put(tR, S.gauge(0.2, 1.0), 0.12); put(tR + 0.25, S.heart(), 0.14); put(W('e5', '기적', 4.4), S.sparkle(8, 0.8), 0.14)
gain('e5', 5, last=True); put(E1('e5') + 1.7, S.stamp(), 0.16)
# z1~z7
c = A('z1'); put(c - 0.26, S.iris_close(), 0.4); put(c + 0.02, S.iris_open(), 0.36); steps(c + 0.2, E1('z2'), 0.5, 0.08)
put(W('z2', '92', 1.4), S.pop(700), 0.12); tQ = W('z2', '질문', 3.6); put(tQ, S.whoosh(1.2, 1500, 5000), 0.08); put(tQ + 1.3, S.sparkle(4, 0.3), 0.12)
c = A('z3'); put(c - 0.26, S.bands(), 0.4); put(c + 0.2, S.pop(640), 0.14)
c = A('z4'); put(c - 0.26, S.bands(), 0.4); put(c + 0.2, S.pop(700), 0.14)
tCm = W('z5', '댓글', 0.3); put(tCm, S.pop(860), 0.14); put(tCm + 0.3, S.letters(3, 0.18, 900), 0.08)
c = A('z6'); put(c - 0.26, S.bands(), 0.4)
put(A('z7') + 0.3, S.sparkle(6, 0.8), 0.1)

mixd = voice * 1.0 + bed + sfx * 0.6
sf.write('/dev/shm/fk/mix_raw.wav', mixd, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/dev/shm/fk/mix_raw.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), '/dev/shm/fk/mix.wav'], check=True)
print('dur', round(DUR, 2), 'peak raw', round(float(np.abs(mixd).max()), 2))
