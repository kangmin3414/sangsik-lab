"""원효 편 샘플 v2(게임 감각): voice + BGM(town/oldtale, 덕킹) + 게임 감각 효과음(zw/gf_sfx.py) -> /dev/shm/wh/mix2.wav (loudnorm -14)
효과음 시각은 whgf.js의 화면 반응과 같은 식(낱말 시각 또는 장면 시작 + 초)으로 잡는다. 말을 덮지 않게: 낱말 위의 소리는 짧고 작게, 가락은 말이 끝난 뒤에."""
import json, subprocess, sys, os, numpy as np, soundfile as sf
os.chdir(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, '../../zw')
import gf_sfx as S
SR = 44100
TL = json.load(open('timeline_wh.json')); L = {l['id']: l for l in TL['lines']}; DUR = TL['duration']; N = int(DUR * SR)
voice, _ = sf.read('/dev/shm/wh/voice_wh.wav', dtype='float32')
if voice.ndim > 1: voice = voice.mean(1)
voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
A = lambda k: L[k]['t0'] - 0.15                       # 장면 시작(lt = 0)
E1 = lambda k: L[k]['t1']
D = lambda k: L[k]['t1'] - L[k]['t0'] + 0.15
def W(lid, key, fb, n=0):                             # whW와 같은 규칙: 낱말이 있으면 그 시각, 없으면 장면 시작 + fb
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
B = '/dev/shm/wh/bgm2/'
def bg(name): return B + name + ('.mp3' if os.path.exists(B + name + '.mp3') else '.opus')   # /dev/shm가 비워지면 bgm_opus/에서 되살린 .opus를 쓴다
FULL = 'e1' in L
# 배경음 배치: (곡, 시작, 끝, 크기, 곡 안의 시작점). 겹치는 구간은 서로 스며든다
SEG = [('town', 0, A('k0') + 0.8, 0.30, 1.2),                      # 훅: 회사. town 첫 0.9초는 음성 검사(VAD)에 걸려서 쓰지 않는다
       ('oldtale', A('k0') + 0.5, E1('w6') + 1.2, 0.34, 0)]         # 신라 이야기
if not FULL: SEG += [('town', A('t1') - 0.3, DUR, 0.30, 14)]
else: SEG += [('town', A('t1') - 0.3, A('e1') + 0.6, 0.30, 14),     # 1일 차
              ('town2', A('e1') - 0.2, A('e2') + 0.7, 0.30, 2), ('oldtale', A('e2') - 0.2, A('e3') + 0.6, 0.32, 30), ('town2', A('e3') - 0.3, A('f1') + 0.6, 0.30, 12),   # 2일 차
              ('town', A('f1') - 0.2, A('f2') + 0.7, 0.30, 40), ('oldtale', A('f2') - 0.2, A('f3') + 0.6, 0.32, 52), ('town', A('f3') - 0.3, A('g1') + 0.6, 0.30, 22),     # 3일 차
              ('town2', A('g1') - 0.2, A('g2') + 0.7, 0.30, 40), ('oldtale', A('g2') - 0.2, A('g3') + 0.6, 0.32, 12), ('town2', A('g3') - 0.3, A('m1') + 0.6, 0.28, 30),   # 4일 차
              ('oldtale', A('m1') - 0.2, A('m2') + 0.6, 0.32, 60), ('town', A('m2') - 0.3, A('z1') + 0.9, 0.28, 50),                                                    # 솔직한 대목 · 정리
              ('ending', A('z1') - 0.2, DUR, 0.40, 2.0)]             # 끝: 다음 월요일
for name, t0, t1, g, off in SEG: place(bg(name), t0, t1, g, fin=0.9, fout=1.3 if t1 < DUR - 0.1 else 2.6, off=off)
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
def steps(t0, t1, iv=0.3, g=0.25):
    k = 0
    while t0 + k * iv < t1: put(t0 + k * iv, S.step(), g); k += 1
def hop(t, g=0.28, d=0.4): put(t, S.boing(), g); put(t + d, S.land(), g + 0.1)

# ----- 1~3 문 앞 -----
c = A('h1'); put(c + 0.25, S.pop(), 0.45); put(c + 0.3, S.breath(0.7), 0.6); put(c + 0.5, S.gauge(0.5, 0.3), 0.3)
for i in range(3): put(c + 0.47 + i * 0.22, S.tick(900 + i * 120), 0.5)
for i, (kk, fb) in enumerate((('회사', 0.55), ('회의실', 1.6), ('팀장님', 2.6))): put(W('h2', kk, fb), S.pop(640 + i * 90), 0.4)
tH, tF, tO = W('h2', '지옥', 4.8), W('h2', '어떤', 5.5, 1), W('h2', '그럭저럭', 6.3)
put(tH, S.hurt(), 0.32); put(tH + 0.05, S.gauge(0.3, 0.08), 0.25); put(tF, S.flip(), 0.4)
put(tO - 0.15, S.gauge(0.08, 0.68), 0.32); hop(tO, 0.26); put(tO + 0.55, S.arp(['E5', 'G5'], 0.12, 0.3, 0.2), 0.28)
put(A('h3') + 0.15, S.tick(700), 0.4)
# ----- 제목 카드: 동그랗게 닫혔다 열린다 -----
c = A('k0'); put(c - 0.26, S.iris_close(), 0.7); put(c + 0.02, S.iris_open(), 0.6); put(c + 0.1, S.hum(1.6), 1.0)
# ----- 4 신라, 원효 -----
c = A('w1'); put(c - 0.26, S.bands(), 0.5); steps(c + 0.25, c + 2.25, 0.3, 0.26); put(c + 2.35, S.boing(280, 520, 0.2), 0.22); put(c + 2.69, S.land(), 0.36)
put(c + 0.7, S.pop(600), 0.38)
for i, dt in enumerate((1.2, 1.9, 2.6)): put(c + dt, S.blip(700 + i * 120), 0.35)
tW = W('w1', '원효', D('w1') - 0.6); put(tW, S.pop(900), 0.3); put(tW + 0.5, S.item(), 0.5); hop(tW + 0.05, 0.2)
# ----- 5 해골물 카드 -----
c = A('w2'); put(c + 0.1, S.pop(560), 0.42); put(W('w2', '그런데', 2.6), S.pop(820), 0.32)
tX = W('w2', '나오지', D('w2') - 1.2); put(tX, S.stamp(), 0.55); put(tX + 0.75, S.question(), 0.4)
# ----- 6 길 → 토굴 → 아침, 옛 무덤 -----
c = A('w3'); put(c + 0.05, S.pop(600), 0.38)
tGo, tR, tC, tM, tS, tT = W('w3', '당나라로', 1.7), W('w3', '비를', 4.5), W('w3', '토구', 5.1), W('w3', '아침', 7.1), W('w3', '해골이', 8.9), W('w3', '무덤', 10.3)
kk = 0
while c + 0.6 + kk * 0.29 < tR - 0.3: put(c + 0.6 + kk * 0.29, S.tick(520), 0.3); kk += 1
put(tGo, S.pop(880), 0.3); put(tR - 0.1, S.pop(520), 0.32); put(tR - 0.1, S.rain(tM - tR + 0.5), 0.8); put(tC, S.whoosh(0.25), 0.3)
put(tM, S.flip(), 0.32); put(tM + 0.15, S.morning(), 0.26)
put(tS, S.bang(), 0.36); hop(tS + 0.02, 0.24, 0.42); put(tS + 0.05, S.gauge(0.82, 0.35), 0.25); put(tT, S.pop(500), 0.36); put(tT + 0.05, S.low(196, 1.2), 0.3)
# ----- 7 귀신 -----
tN, tK, tSm, tG = W('w4', '밤', 0.7), W('w4', '무덤인', 1.0), W('w4', '같은', 2.5), W('w4', '귀신', 5.1)
put(tN, S.flip(), 0.28); put(tN + 0.1, S.low(220, 1.6), 0.28); put(tK + 0.2, S.tick(700), 0.35); put(tSm, S.pop(760), 0.3)
put(tG - 0.15, S.ghost(), 0.6); put(tG + 0.05, S.bang(), 0.36); hop(tG + 0.02, 0.24, 0.44); put(tG + 0.1, S.gauge(0.2, 0.04), 0.25)
# ----- 8 둘이 아니다 -----
tI, tQ1, tRr, tD, tQ3 = W('w5', '깨닫', 0.7), W('w5', '마음이', 2.4), W('w5', '온갖', 3.6), W('w5', '사라지면', 6.2), W('w5', '아니다', D('w5') - 0.5)
put(tI, S.ding(), 0.34); put(tQ1 - 0.1, S.pop(600), 0.38); put(tRr, S.pop(520), 0.38); put(tRr + 0.5, S.blip(500), 0.25)
put(tD, S.whoosh(0.42), 0.32); put(tD + 0.42, S.coin(), 0.45); put(tD + 0.5, S.sparkle(6, 0.5), 0.3); put(tQ3, S.pop(760), 0.28)
# ----- 9 바닷가 -----
c = A('w6'); steps(c + 0.35, E1('w6') - 1.3, 0.34, 0.2)
tNo, tB, tHh = W('w6', '없다며', 2.4), W('w6', '돌아갑니다', 4.9), W('w6', '해골물은', 6.1)
put(tNo, S.ding(), 0.26); hop(tB - 0.1, 0.24, 0.38); put(tB + 0.9, S.arp(['E5', 'G5', 'E5'], 0.14, 0.25, 0.15), 0.22); put(tHh, S.pop(760), 0.3)
# ----- 10 제목 -----
c = A('t1'); put(c - 0.26, S.bands(), 0.5); put(c + 0.15, S.letters(8, 0.04, 700), 0.32); put(c + 0.75, S.letters(11, 0.04, 800), 0.32)
for dt in (0.5, 1.7, 2.9): hop(c + dt, 0.22, 0.42)
put(c + 1.1, S.pop(900), 0.32); put(c + 1.4, S.pop(1000), 0.28)
# ----- 11~12 표주박 -----
c = A('t2'); put(c + 0.2, S.pop(700), 0.38); put(c + 0.3, S.sparkle(5, 0.4), 0.28)
tG2, tF2, tP2 = W('t2', '허리에', 1.7), W('t2', '가지', 3.4), W('t2', '심리학', 6.5); tOn = tG2 + 0.34
put(tG2, S.whoosh(0.3), 0.28); put(tOn, S.equip(), 0.45); put(tOn + 0.25, S.boing(280, 520, 0.2), 0.2); put(tF2, S.pop(560), 0.36)
for i in range(4): put(tF2 + 0.25 + i * 0.3, S.blip(660 + i * 110), 0.32)
put(tP2, S.pop(820), 0.3)
c = A('t3'); put(c + 0.85, S.pop(640), 0.3); tI3 = W('t3', '이거', 1.1); put(tI3 - 0.4, S.slosh(0.3), 0.4); put(E1('t3') + 0.05, S.slosh(0.3), 0.3)
# ----- 13 1일 차 -----
c = A('d1'); put(c - 0.26, S.iris_close(), 0.6); put(c + 0.02, S.iris_open(), 0.5); put(c + 0.3, S.pop(700), 0.3); put(c + 0.5, S.letters(8, 0.04, 760), 0.28); put(c + 1.35, S.coin(), 0.32)
steps(c + 0.3, c + 3.4, 0.2, 0.14)
# ----- 14 새 이름 -----
c = A('d2'); put(c + 0.25, S.whoosh(0.35), 0.32)
tN2, tP3 = W('d2', '말고', 4.2), W('d2', '연습', 5.3); tFl = tP3 - 0.3
put(tN2, S.strike(), 0.45); put(tFl, S.flip(), 0.4); put(tFl + 0.3, S.coin(), 0.4); put(tFl + 0.35, S.gauge(0.12, 0.62), 0.3); put(E1('d2') + 0.02, S.sparkle(5, 0.3), 0.3)
# ----- 15~16 회의 -----
c = A('d3'); put(c + 0.25, S.whoosh(0.5, 800, 4000), 0.26); put(c + 0.95, S.bang(), 0.3); put(c + 1.0, S.gauge(0.62, 0.42), 0.25); put(E1('d3') + 0.02, S.hurt(), 0.3)
c = A('d4'); put(c + 0.02, S.pop(700), 0.22); put(E1('d4') + 0.02, S.whistle(), 0.25)
# ----- 17~18 와인 -----
c = A('d5'); put(c - 0.26, S.bands(), 0.5); put(c + 0.2, S.pop(600), 0.36); put(c + 0.55, S.pop(760), 0.36)
tQ5, tY5, tW5 = W('d5', '달라질까요', 2.3), W('d5', '2008', 3.2), W('d5', '와인으로', 5.2)
put(tQ5 + 0.75, S.question(), 0.4); put(tY5, S.pop(820), 0.28); hop(tW5, 0.26, 0.42); put(tW5 + 0.5, S.blip(900), 0.28); put(tW5 + 0.65, S.blip(1100), 0.28)
c = A('d6'); put(c + 0.3, S.pour(0.9), 0.4); put(c + 1.35, S.pop(880), 0.3)
t5, t45, tG6, tM6, tJ6 = W('d6', '5달러', 1.8), W('d6', '45달러', 3.2), W('d6', '짜리가', 6.4), W('d6', '맛있다고', 8.1), W('d6', '즐거움을', 9.8)
put(t5, S.blip(820), 0.3); put(t45, S.coin(), 0.3); steps(c + 5.0, c + 5.9, 0.22, 0.22); put(tG6, S.pop(980), 0.22)
put(tM6, S.heart(), 0.3); put(tM6 + 0.1, S.gauge(0, 0.4), 0.22); put(tM6 + 0.3, S.gauge(0, 0.86), 0.26); put(tJ6, S.pop(1040), 0.26); put(tJ6 + 0.1, S.sparkle(4, 0.3), 0.22)
# ----- 큰 숫자 카드(말 없음) -----
c = A('s1'); put(c + 0.1, S.pop(600), 0.5); put(c + 0.35, S.whoosh(0.4), 0.4); put(c + 0.7, S.stamp(), 0.5); put(c + 0.95, S.coin(), 0.6); put(c + 1.05, S.bang(), 0.35); hop(c + 1.05, 0.26, 0.4)
# ----- 19 뇌 -----
c = A('d7'); put(c + 0.1, S.pop(600), 0.3); put(c + 0.25, S.pop(700), 0.3)
tA7, tT7, tJ7 = W('d7', '맛', 0.6), W('d7', '그대로', 3.2), W('d7', '즐거움만', D('d7') - 1.7)
put(tA7, S.blip(760), 0.26); put(tA7 + 0.3, S.gauge(0, 0.6), 0.22); put(tT7, S.coin(), 0.3); put(tJ7, S.gauge(0, 0.9), 0.3); put(tJ7 + 0.3, S.boing(400, 1100, 0.3), 0.2); put(tJ7 + 0.2, S.heart(), 0.26)
# ----- 20 끝 -----
c = A('d8'); put(c + 0.5, S.scribble(1.2), 0.55)
tL8, tE8 = W('d8', '덜', 3.1), W('d8', '아프네', 3.5) + 0.3
put(tL8, S.gauge(0.45, 0.66), 0.26); put(tL8 + 0.1, S.sparkle(4, 0.3), 0.22); put(tE8, S.stamp(), 0.65); put(tE8 + 0.08, S.clear(), 0.5)

if FULL:
    def chapter(k): c = A(k); put(c - 0.26, S.iris_close(), 0.6); put(c + 0.02, S.iris_open(), 0.5); put(c + 0.3, S.pop(700), 0.3); put(c + 0.5, S.letters(8, 0.04, 760), 0.28); put(c + 1.35, S.coin(), 0.3); steps(c + 0.3, c + 3.4, 0.2, 0.14)
    def daydone(t): put(t, S.stamp(), 0.6); put(t + 0.08, S.clear(), 0.42)
    def knock(g=0.3): return S.mix(S.tick(900), S.land() * 0.6) * g
    # ----- 2일 차 -----
    chapter('e1')
    c = A('e2'); tA, tB, tC, tD, tE = W('e2', '옳다고', 1.6), W('e2', '다툴', 2.3), W('e2', '잇는', 3.4), W('e2', '글자', 6.6), W('e2', '생긴다고', 8.6); tF = min(c + D('e2') - 0.2, tE + 0.5)
    put(tA, S.pop(620), 0.3); put(tA + 0.25, S.pop(820), 0.3); put(tB, S.bang(), 0.26); put(tB + 0.15, S.land(), 0.3); put(tC, S.pop(700), 0.3); put(tC + 0.1, S.sparkle(4, 0.3), 0.2); put(tD, S.pop(560), 0.26)
    put(tF, S.ding(), 0.34); put(tF + 0.05, S.boing(), 0.2); put(tF + 0.3, S.arp(['C5', 'E5', 'G5', 'C6'], 0.09, 0.3, 0.2), 0.3)
    c = A('e3'); put(W('e3', '제로와', 1.3), S.pop(640), 0.3); put(W('e3', '민재', 1.9), S.pop(760), 0.3); tH = W('e3', '부딪', D('e3') - 0.9); put(tH - 0.2, S.whoosh(0.22), 0.3); put(tH, S.stamp(), 0.4); put(tH + 0.05, S.gauge(0.55, 0.36), 0.22)
    c = A('e4'); put(c + 0.75, S.strike(0.2), 0.3); put(E1('e4') + 0.02, S.hurt(), 0.3)
    c = A('e5'); put(c + 0.02, S.pop(600), 0.26); put(W('e5', '이유가', 1.6), S.flip(), 0.22); put(E1('e5') + 0.02, S.question(), 0.3)
    c = A('e6'); put(c - 0.26, S.bands(), 0.5); put(c + 0.2, S.pop(820), 0.26); put(W('e6', '가지를', 3.8), S.pop(700), 0.26); put(W('e6', '공정하게', 5.4), S.pop(620), 0.3); put(W('e6', '반대', 7.6), S.pop(780), 0.3)
    put(W('e7', '기우는', 0.7), S.tick(600), 0.4); put(W('e7', '줄인', 2.2), S.gauge(0.7, 0.3, 7), 0.22); tS7 = W('e7', '반대를', 2.9); put(tS7, S.coin(), 0.3); put(tS7 + 0.1, S.sparkle(4, 0.3), 0.2)
    put(W('e8', '일정은', 1.2), S.pop(640), 0.28); put(W('e8', '점검', 3.6), S.pop(780), 0.28); tS8 = W('e8', '붙이면', D('e8') - 0.9); put(tS8, S.equip(), 0.4); put(tS8 + 0.1, S.gauge(0.3, 0.58), 0.22)
    c = A('e9'); put(c + 0.02, S.bang(), 0.22); put(E1('e9') + 0.02, S.heart(), 0.3); daydone(c + max(1.2, D('e9') - 0.35))
    # ----- 3일 차 -----
    chapter('f1')
    c = A('f2'); put(W('f2', '표주박', 2.2) - 0.2, S.pop(700), 0.3); tS2 = W('f2', '노래하고', 2.6); kk = 0
    while tS2 + kk * 0.56 < E1('f2') + 0.2: put(tS2 + kk * 0.56 + 0.26, S.tick(1700 if kk % 2 else 1300), 0.3); put(tS2 + kk * 0.56 + 0.52, S.step(), 0.22); kk += 1
    put(W('f2', '가난한', 6.0), S.heart(), 0.22); put(W('f2', '따라', 7.6), S.sparkle(5, 0.4), 0.22)
    c = A('f3'); put(c + 1.5, S.pop(760), 0.28)
    for kk, (key, fb) in enumerate((('시보드', 0.5), ('필터', 1.9), ('전월', 2.7))): tt = W('f4', key, fb); put(tt, S.whoosh(0.3, 900, 5000), 0.22); put(tt + 0.5, S.tick(500 - kk * 60), 0.5)
    put(E1('f5') + 0.08, S.question(), 0.42)
    c = A('f6'); put(c - 0.26, S.bands(), 0.5); put(c + 0.2, S.pop(820), 0.26); put(W('f6', '사람은', 2.9), S.pop(640), 0.26); put(W('f6', '사람은', 6.0, 1), S.pop(760), 0.26); tT = W('f6', '두드리고', 4.6); kk = 0
    while tT + kk * 0.36 < E1('f6') + 0.1: put(tT + kk * 0.36 + 0.18, knock(0.3), 1.0); kk += 1
    c = A('f7'); put(c + 0.05, S.pop(600), 0.3); put(c + 0.2, S.letters(18, 0.03, 500), 0.18); put(W('f7', '절반', 1.3), S.letters(24, 0.02, 700), 0.22); t3 = W('f7', '단', D('f7') - 1.6)
    for kk in range(3): put(t3 + kk * 0.14, S.blip(880 + kk * 180), 0.3)
    put(t3 + 0.5, S.coin(), 0.28)
    c = A('s2'); put(c + 0.1, S.pop(600), 0.5); put(c + 0.2, S.letters(7, 0.04, 700), 0.3); put(c + 0.9, S.coin(), 0.5); put(c + 1.05, S.bang(), 0.3); hop(c + 1.05, 0.24, 0.4)
    c = A('f8'); put(c + 0.3, S.pop(640), 0.24); tSg = W('f8', '노래가', 1.6); put(tSg, S.arp(['E5', 'G5', 'A5', 'G5', 'E5'], 0.13, 0.22, 0.12), 0.2); tDt = W('f8', '똑똑', D('f8') - 1.6)
    for kk in range(3): put(tDt + 0.25 + kk * 0.36, knock(0.34), 1.0)
    t0 = W('f9', '지난달', 1.3); put(t0, S.whoosh(0.5, 700, 3500), 0.22); put(t0 + 0.7, S.pop(880), 0.28); tU = W('f9', '표예요', D('f9') - 0.8); put(tU, S.gauge(0.26, 0.84), 0.26)
    c = A('f10'); put(c + 0.02, S.bang(), 0.24); hop(c + 0.25, 0.22, 0.4); put(E1('f10') + 0.02, S.ding(), 0.32); daydone(c + max(1.1, D('f10') - 0.3))
    # ----- 4일 차 -----
    chapter('g1')
    c = A('g2'); put(W('g2', '계율', 0.9), S.pop(560), 0.26); put(W('g2', '요석', 2.2), S.pop(700), 0.26); put(W('g2', '설총', 4.2), S.pop(820), 0.26); tC2 = W('g2', '옷을', 6.4); put(tC2, S.whoosh(0.3), 0.3); put(tC2 + 0.12, S.pop(640), 0.3)
    tN2 = W('g2', '소성', 8.2); put(tN2 - 0.2, S.flip(), 0.3); put(tN2 + 0.15, S.coin(), 0.3); tV2 = W('g2', '마을로', D('g2') - 1.4); steps(tV2, E1('g2') + 0.4, 0.3, 0.2); put(E1('g2') + 0.02, S.arp(['E5', 'G5', 'E5'], 0.14, 0.25, 0.15), 0.22)
    c = A('g3'); put(c + 0.3, S.pop(820), 0.24); put(c + 0.5, S.pop(600), 0.3); tX3 = W('g3', '틀렸습니다', D('g3') - 1.0); put(tX3, S.stamp(), 0.5); put(tX3 + 0.05, S.gauge(0.6, 0.12), 0.22); put(E1('g3') + 0.02, S.hurt(), 0.34)
    c = A('g4'); put(c + 0.15, S.rain(D('g4') + 0.6), 0.5); put(c + 0.2, S.low(175, 1.8), 0.3)
    c = A('g5'); put(c - 0.26, S.bands(), 0.5); put(c + 0.2, S.pop(820), 0.26); tL5 = W('g5', '점수가', 3.6)
    for kk in range(4): put(tL5 + kk * 0.13, S.tick(520 - kk * 30), 0.4)
    tO5 = W('g5', '한쪽에만', 5.6); put(tO5, S.whoosh(0.5, 700, 3500), 0.22); put(tO5 + 0.6, S.heart(), 0.28); put(W('g5', '자책', 6.8), S.pop(760), 0.24)
    tB6 = W('g6', '학생들은', 2.0); put(tB6 - 0.2, S.pop(640), 0.24); put(tB6, S.gauge(0, 0.5, 6), 0.2); put(tB6 + 0.5, S.gauge(0, 0.9, 11), 0.22); t15 = W('g6', '배쯤', D('g6') - 2.2); put(t15, S.coin(), 0.3); put(t15 + 0.1, S.sparkle(4, 0.3), 0.2)
    c = A('s3'); put(c + 0.1, S.pop(600), 0.5); put(c + 0.2, S.gauge(0, 1, 14), 0.3); put(c + 0.95, S.coin(), 0.5); put(c + 1.05, S.bang(), 0.3); hop(c + 1.05, 0.24, 0.4)
    c = A('g7'); tFx = W('g7', '고치자', 1.2); tOk = W('g7', '틀릴', 2.6); put(tFx, S.pop(700), 0.26); put(tFx + 0.02, S.boing(280, 560, 0.2), 0.18); put(tFx + 0.35, S.coin(), 0.28); put(tFx + 0.1, S.gauge(0.04, 0.34), 0.2); put(tOk + 0.1, S.heart(), 0.24); put(tOk + 0.2, S.gauge(0.34, 0.62), 0.2)
    daydone(c + max(tOk - c + 0.5, D('g7') - 0.3))
    # ----- 솔직한 대목 · 정리 -----
    c = A('m1'); put(c - 0.26, S.bands(), 0.5); put(c + 0.3, S.pop(700), 0.26); put(c + 1.1, S.blip(420), 0.3); tGo = W('m1', '올랐고', 4.6); put(tGo, S.whoosh(1.2, 300, 2200), 0.26); tBk = W('m1', '돌아와', 7.2); put(tBk - 0.9, S.whoosh(1.0, 300, 2200), 0.22)
    hop(tBk + 0.55, 0.18, 0.36); tT1 = W('m1', '스승', 8.6); put(tT1, S.coin(), 0.3); put(tT1 + 0.1, S.sparkle(4, 0.3), 0.2); put(W('m1', '떠난', 10.2), S.blip(880), 0.28); put(W('m1', '돌아온', 11.2), S.blip(1100), 0.28); put(E1('m1') + 0.02, S.arp(['G5', 'C6'], 0.12, 0.4, 0.25), 0.26)
    c = A('m2'); tH2 = W('m2', '버거운', 1.2); put(tH2 - 0.3, S.whoosh(0.3, 300, 2000), 0.26); put(tH2, S.stamp(), 0.5); put(tH2 + 0.05, S.gauge(0.4, 0.05), 0.2); tA2 = W('m2', '도와', D('m2') - 2.6); put(tA2, S.pop(640), 0.28); tO2 = W('m2', '괜찮습니다', D('m2') - 0.9); steps(tA2 + 0.5, tO2, 0.2, 0.22)
    put(tO2, S.boing(260, 620, 0.26), 0.24); put(tO2 + 0.1, S.gauge(0.05, 0.56), 0.22); put(E1('m2') + 0.02, S.heart(), 0.3)
    c = A('m3'); put(c + 0.1, S.pop(600), 0.3); put(c + 0.3, S.letters(4, 0.12, 640), 0.3)
    for kk, tk in enumerate((W('m3', '붙이기', 2.9) - 0.4, W('m3', '반대편', 4.0), W('m3', '누구나', 6.4), W('m3', '품어', D('m3') - 0.9))): put(tk + 0.25, S.blip(760 + kk * 130), 0.3); put(tk + 0.27, S.boing(300, 620, 0.2), 0.14)
    put(E1('m3') + 0.05, S.coin(), 0.34)
    # ----- 끝: 다음 월요일 -----
    c = A('z1'); put(c - 0.26, S.iris_close(), 0.55); put(c + 0.02, S.iris_open(), 0.45); put(c + 0.35, S.pour(1.15), 0.55); put(c + 1.95, S.slosh(0.3), 0.4)
    c = A('z2'); put(c + 0.5, S.gauge(0.2, 0.4), 0.2); put(E1('z2') + 0.05, S.arp(['E5', 'G5'], 0.12, 0.3, 0.2), 0.22)
    c = A('z3'); steps(c + 0.05, c + 0.9, 0.24, 0.24); put(c + 0.9, S.pop(560), 0.24); put(c + 0.95, S.low(196, 1.2), 0.22); put(E1('z3') + 0.05, S.bang(), 0.2)
    tSz = W('z4', '연습', 1.6); put(tSz - 0.1, S.flip(), 0.3); put(tSz + 0.15, S.coin(), 0.3); put(E1('z4') + 0.02, S.sparkle(5, 0.35), 0.24)
    c = A('z5'); put(c + 0.45, S.gauge(0.06, 0.5), 0.2); put(E1('z5') + 0.02, S.heart(), 0.3); put(E1('z5') + 0.12, S.gauge(0.42, 0.6), 0.18)
    c = A('z6'); put(c + 0.4, S.whoosh(0.8, 250, 1800), 0.24); put(c + 0.9, S.arp(['C5', 'G5', 'E6'], 0.22, 1.0, 0.7), 0.2); steps(c + 0.95, c + 3.3, 0.3, 0.14); steps(c + 2.0, c + 4.4, 0.33, 0.14); tGz = W('z6', '건넬', D('z6') - 1.4); put(tGz, S.heart(), 0.26); put(tGz + 0.2, S.sparkle(5, 0.4), 0.2)
    c = A('z7'); put(c - 0.26, S.bands(), 0.45); put(c + 0.2, S.letters(9, 0.04, 700), 0.26); put(c + 0.9, S.letters(13, 0.04, 800), 0.26); put(c + 1.6, S.pop(820), 0.28)

mixd = voice * 1.0 + bed + sfx * 0.6
sf.write('/dev/shm/wh/mix2_raw.wav', mixd, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/dev/shm/wh/mix2_raw.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), '/dev/shm/wh/mix2.wav'], check=True)
print('dur', round(DUR, 2), 'peak raw', round(float(np.abs(mixd).max()), 2))
