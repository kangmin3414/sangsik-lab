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
EXT = 'mp3' if os.path.exists(B + 'town.mp3') else 'opus'
place(B + 'town.' + EXT, 0, A('k0') + 0.8, 0.30, fin=0.5, fout=1.0, off=1.2)           # 훅: 회사. town 첫 0.9초는 음성 검사(VAD)에 걸려서 쓰지 않는다
place(B + 'oldtale.' + EXT, A('k0') + 0.5, E1('w6') + 1.2, 0.34, fin=1.2, fout=1.6)     # 신라 이야기
place(B + 'town.' + EXT, A('t1') - 0.3, DUR, 0.30, fin=0.8, fout=2.2, off=14)           # 현대로
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

mixd = voice * 1.0 + bed + sfx * 0.6
sf.write('/dev/shm/wh/mix2_raw.wav', mixd, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/dev/shm/wh/mix2_raw.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), '/dev/shm/wh/mix2.wav'], check=True)
print('dur', round(DUR, 2), 'peak raw', round(float(np.abs(mixd).max()), 2))
