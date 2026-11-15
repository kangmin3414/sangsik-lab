"""하루는 작은 일생 편 전체: voice + BGM(morning·night·story, 덕킹) + 게임 감각 효과음(zw/gf_sfx.py) -> /dev/shm/od/mix.wav (loudnorm -14)
효과음 시각은 odgf.js의 화면 반응과 같은 식(낱말 시각 또는 장면 시작 + 초). 낱말 위의 소리는 짧고 작게, 가락은 말이 끝난 뒤에."""
import json, subprocess, sys, os, numpy as np, soundfile as sf
os.chdir(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, '../../zw')
import gf_sfx as S
SR = 44100
TL = json.load(open('timeline_od.json')); L = {l['id']: l for l in TL['lines']}; DUR = TL['duration']; N = int(DUR * SR)
voice, _ = sf.read('/dev/shm/od/voice_od.wav', dtype='float32')
if voice.ndim > 1: voice = voice.mean(1)
voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
A = lambda k: L[k]['t0'] - 0.15                       # 장면 시작(lt = 0)
E1 = lambda k: L[k]['t1']
D = lambda k: L[k]['t1'] - L[k]['t0'] + 0.15
def W(lid, key, fb, n=0):                             # odW와 같은 규칙
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
B = '/dev/shm/od/bgm/'
def bg(name): return B + name + ('.mp3' if os.path.exists(B + name + '.mp3') else '.opus')
SEG = [('morning', 0, A('k0') + 0.5, 0.28, 0.3),
       ('night', A('n1') - 0.3, A('p1') + 0.5, 0.34, 0.5),
       ('story', A('p1') - 0.2, A('p5') + 0.5, 0.30, 0.4),
       ('morning', A('p5') - 0.3, A('b1') + 0.6, 0.28, 22),
       ('day', A('b1') - 0.2, A('c4') + 0.5, 0.28, 0.5),
       ('story', A('c4') - 0.2, A('c7') + 0.5, 0.28, 30),
       ('day', A('c7') - 0.2, A('d0') + 0.6, 0.26, 46),
       ('night', A('d0') - 0.2, A('d2') + 0.5, 0.32, 20),
       ('story', A('d2') - 0.2, A('d5') + 0.5, 0.28, 52),
       ('night', A('d5') - 0.2, A('m1') + 0.6, 0.32, 40),
       ('morning', A('m1') - 0.2, A('z1') + 0.8, 0.26, 44),
       ('ending', A('z1') - 0.2, DUR, 0.38, 1.0)]
for name, t0, t1, g, off in SEG: place(bg(name), t0, t1, g, fin=0.8, fout=1.2 if t1 < DUR - 0.1 else 2.4, off=off)
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
def alarm(d): return S.seq([(i * 0.09, S.note(S.N['E6'] if i % 2 else S.N['C6'], 0.08, 0.05, 'sin')) for i in range(int(d / 0.09))])

# ----- 1: 알람 → [▶ 새 일생 시작] → 하루 탄생 -----
c = A('h1'); put(c + 0.25, alarm(0.7), 0.45); put(c + 0.72, S.flip(), 0.45); put(c + 0.98, S.equip(), 0.55); put(c + 1.0, S.pop(900), 0.4)
put(c + 1.12, S.boing(400, 900, 0.22), 0.35); put(c + 1.14, S.sparkle(6, 0.4), 0.35); put(c + 1.3, S.pop(700), 0.35)
# ----- 2: 다시 태어남 -----
tU = W('h2', '다시', 1.4); hop(tU, 0.3, 0.32); put(tU + 0.05, S.sparkle(5, 0.35), 0.24); put(tU + 0.2, S.blip(1320), 0.18); put(tU + 0.62, S.blip(1560), 0.16)
# ----- 3: 누운 채로 40분 -----
put(W('h3', '태어나자마자', 0.5), S.bang(), 0.16); tL = W('h3', '누운', 1.5); put(tL, S.land(), 0.32)
t40 = W('h3', '40', 2.4); put(t40, S.whoosh(1.2, 900, 5000), 0.2)
for i in range(8): put(t40 + i * 0.15, S.tick(1500 - i * 40), 0.3)
tO = W('h3', '남의', 3.3)
for i in range(10): put(tO + i * 0.22, S.pop(700 + (i % 3) * 120), 0.12)
put(E1('h3') + 0.02, S.hurt(), 0.26)
# ----- 4: 헉, 7시 40분! -----
c = A('h4'); put(c + 0.08, S.bang(), 0.22); tGo = A('h4') + D('h4') - 0.15; put(tGo, S.whoosh(0.4, 500, 4000), 0.4); steps(tGo + 0.05, tGo + 0.6, 0.11, 0.3)
# ----- 제목 카드 -----
c = A('k0'); put(c - 0.26, S.iris_close(), 0.65); put(c + 0.02, S.iris_open(), 0.5); put(c + 0.1, S.hum(1.6), 1.0)
# ----- 5~6: 월요일 밤 -----
c = A('n1'); put(c - 0.26, S.iris_close(), 0.45); put(c + 0.02, S.iris_open(), 0.4)
tN = W('n1', '10시', 1.0); put(tN, S.tick(1200), 0.3); put(tN + 0.35, S.seq([(0, S.note(S.N['G5'], 0.12, 0.08, 'sin')), (0.12, S.note(S.N['C6'], 0.2, 0.12, 'sin'))]), 0.22)
tD = W('n1', '끝났습니다', 3.8); put(tD + 0.1, S.sparkle(5, 0.4), 0.22); put(tD + 0.6, S.whoosh(0.9, 800, 5000), 0.16)
c = A('n2'); put(c + 0.08, S.pop(600), 0.45)
for i in range(4): put(c + 0.2 + i * 0.18, S.tick(1000 + i * 80), 0.35)
put(c + 0.98, S.letters(9, 0.035, 700), 0.3); put(c + 1.3, S.arp(['G5', 'E5', 'C5'], 0.14, 0.3, 0.2), 0.3); put(c + 1.6, S.stamp(), 0.45)
# ----- 7: 시계추와 쇼펜하우어 -----
c = A('p1'); put(c - 0.26, S.bands(), 0.5); put(c + 0.2, S.whoosh(0.5, 400, 3000), 0.35); put(c + 0.62, S.land(), 0.3); put(c + 0.9, S.pop(640), 0.3)
put(W('p1', '독일', 1.0), S.pop(800), 0.26); put(W('p1', '고통', 2.6), S.pop(560), 0.24); put(W('p1', '권태', 3.0), S.pop(700), 0.24)
tN7 = W('p1', '쇼펜하우어', D('p1') - 0.8); put(tN7, S.coin(), 0.3); put(tN7 + 0.1, S.sparkle(5, 0.35), 0.22)
# ----- 8: 비관주의자의 책 -----
c = A('p2'); tPes = W('p2', '비관주의자', 1.0); put(tPes, S.rain(1.6), 0.35); put(tPes + 0.05, S.low(175, 1.4), 0.2)
tBk = W('p2', '책', 3.5); put(tBk - 0.1, S.pop(620), 0.32); tK = W('p2', '다정한', 4.6); put(tK, S.flip(), 0.3); put(tK + 0.2, S.heart(), 0.26); put(E1('p2') + 0.02, S.sparkle(5, 0.4), 0.26)
# ----- 9: 하루는 작은 일생 -----
c = A('p3'); put(c + 0.15, S.pop(600), 0.35); tB9 = W('p3', '탄생', 2.4); tY9 = W('p3', '젊음', 3.8); tD9 = W('p3', '죽음', D('p3') - 0.5)
for i, tt in enumerate((tB9, tY9, tY9 + 0.55, tY9 + 1.0, tD9)): put(tt, S.blip(660 + i * 140), 0.26)
put(tD9 + 0.05, S.sparkle(6, 0.45), 0.24)
# ----- 10: 아침은 거의 신성하게 -----
c = A('p4'); put(c + 0.15, S.pop(640), 0.32)
for kk, fb in (('늦잠', 2.6), ('하찮은', 3.4), ('잡담', 4.2)): tt = W('p4', kk, fb); put(tt, S.pop(760), 0.22); put(tt + 0.35, S.strike(0.22), 0.2)
tH = W('p4', '신성하게', D('p4') - 0.9); put(tH, S.sparkle(6, 0.5), 0.24); put(E1('p4') + 0.05, S.arp(['C6', 'E6', 'G6'], 0.1, 0.4, 0.25), 0.26)
# ----- 11: 남의 출근길 -----
c = A('p5'); put(c - 0.26, S.iris_close(), 0.45); put(c + 0.02, S.iris_open(), 0.4); put(c + 0.2, S.pop(600), 0.3)
tO5 = W('p5', '출근길', 2.2); put(tO5 + 0.2, S.gauge(1, 0.66), 0.2); put(E1('p5') + 0.02, S.hurt(), 0.24)
# ----- 12~13: 만약에 -----
c = A('t1'); put(c - 0.26, S.bands(), 0.5); put(c + 0.05, S.letters(4, 0.04, 700), 0.3); put(W('t1', '하루를', 0.7), S.letters(11, 0.035, 820), 0.26); put(W('t1', '산다면', 1.9), S.letters(4, 0.04, 900), 0.26)
put(E1('t1') + 0.02, S.boing(), 0.26)
c = A('t2'); tT = W('t2', '화요일', 0.4); put(tT, S.pop(640), 0.3); hop(tT + 0.2, 0.2, 0.34)
for i in range(4): put(tT + 0.45 + i * 0.3, S.tick(900 + i * 90), 0.35)
put(W('t2', '확인해', D('t2') - 1.6), S.question(), 0.2); put(E1('t2') + 0.05, S.stage(), 0.3)
def chapter(lid, night=False):
    c = A(lid); put(c - 0.26, S.iris_close(), 0.5); put(c + 0.02, S.iris_open(), 0.45); put(c + 0.25, S.pop(700), 0.35); put(c + 0.4, S.letters(5, 0.06, 760), 0.3)
    put(c + 0.9, S.boing(), 0.2); put(E1(lid) + 0.05, S.arp(['C5', 'G5', 'C6'] if not night else ['G4', 'D5', 'G5'], 0.1, 0.4, 0.25), 0.3)
# ----- 청춘 -----
chapter('a1')
c = A('a2'); tF = W('a2', '엎어', 1.6); put(tF + 0.25, S.land(), 0.3); put(tF + 0.3, S.tick(700), 0.3); tW = W('a2', '창문', 2.6); put(tW, S.whoosh(0.5, 600, 4000), 0.24); put(tW + 0.1, S.sparkle(5, 0.4), 0.18); hop(tW + 0.3, 0.16, 0.3)
put(W('a2', '30', 4.4), S.pop(760), 0.24); tB = W('a2', '읽다', 6.0); put(tB - 0.3, S.land(), 0.24); put(tB, S.flip(), 0.22); put(E1('a2') + 0.05, S.morning(), 0.22)
c = A('a3'); put(c - 0.26, S.bands(), 0.5); put(c + 0.3, S.pop(600), 0.3); put(c + 0.4, S.boing(300, 700, 0.3), 0.24); t84 = W('a3', '84', 2.2)
for i in range(16): put(t84 + i * 0.12, S.pop(800 + (i % 4) * 90), 0.1)
put(W('a3', '240', 3.2), S.pop(900), 0.24); put(W('a3', '시간대별', D('a3') - 1.6), S.whoosh(0.9, 500, 3500), 0.22)
c = A('a4'); put(c + 0.1, S.pop(640), 0.3); tM = W('a4', '아침에', 1.0); put(tM + 0.2, S.sparkle(4, 0.3), 0.2); put(W('a4', '낮', 2.6), S.gauge(0.8, 0.3), 0.18); put(W('a4', '저녁에', 4.0), S.gauge(0.3, 0.75), 0.18)
c = A('s1'); put(c + 0.1, S.pop(600), 0.5); put(c + 0.95, S.coin(), 0.5); put(c + 1.05, S.bang(), 0.3); hop(c + 1.05, 0.24, 0.4)
put(E1('a5') + 0.05, S.arp(['E5', 'G5', 'C6'], 0.12, 0.35, 0.22), 0.26)
# ----- 한창때 -----
chapter('b1')
c = A('b2'); put(c - 0.26, S.bands(), 0.5); put(c + 0.2, S.pop(560), 0.3); put(W('b2', '한', 2.0), S.coin(), 0.24); t18 = W('b2', '2018', 3.2); put(t18 - 0.3, S.whoosh(0.3), 0.24); put(t18, S.pop(700), 0.26)
t4 = W('b2', '4주', 6.5)
for i in range(6): put(t4 + i * 0.1, S.tick(1000 + i * 40), 0.25)
tL = W('b2', '마지막', D('b2') - 2.6); put(tL, S.heart(), 0.22); hop(tL, 0.14, 0.3)
c = A('b3'); put(c + 0.1, S.pop(600), 0.3); tB3 = W('b3', '행복감이', 1.6); put(tB3, S.gauge(0, 0.6), 0.2); put(W('b3', '작았지만요', D('b3') - 1.0), S.pop(820), 0.22)
c = A('b4'); put(c - 0.26, S.bands(), 0.5); tLa = W('b4', '마지막인', 1.6); put(tLa - 0.1, S.pop(700), 0.26); put(tLa + 0.3, S.equip(), 0.3); put(tLa + 0.5, S.sparkle(6, 0.6), 0.2)
c = A('b5'); put(c + 0.3, S.whoosh(0.3, 800, 4000), 0.24); put(c + 0.8, S.land(), 0.24); put(c + 0.9, S.heart(), 0.3); put(c + 0.95, S.sparkle(4, 0.3), 0.2)
c = A('b6'); put(c + 0.1, S.bang(), 0.14); put(E1('b6') + 0.05, S.heart(), 0.26)
# ----- 노년 -----
chapter('c1')
c = A('c2'); put(E1('c2') + 0.05, S.rustle(0.4), 0.3)
c = A('c3'); put(E1('c3') + 0.05, S.hurt(), 0.24); put(E1('c3') + 0.2, S.pop(500), 0.22); put(E1('c3') + 0.3, S.low(175, 1.0), 0.16)
c = A('c4'); put(c - 0.26, S.bands(), 0.5); put(c + 0.3, S.pop(600), 0.26); put(c + 0.6, S.pop(560), 0.26); put(c + 1.0, S.pop(660), 0.26); t14 = W('c4', '14', 4.4); put(t14, S.blip(1200), 0.24)
put(t14 + 0.45, S.slosh(0.3), 0.32); tB4 = W('c4', '똑같이', 6.8); put(tB4 + 0.45, S.slosh(0.3), 0.3); put(W('c4', '덜', 8.6), S.gauge(0.1, 0.35), 0.18)
c = A('c5'); put(c + 0.1, S.letters(8, 0.03, 700), 0.16); t22 = W('c5', '22', 3.0)
for i in range(12): put(t22 + i * 0.09, S.pop(700 + (i % 3) * 120), 0.1)
put(t22 + 1.3, S.coin(), 0.24); put(W('c5', '끝이', D('c5') - 1.6), S.heart(), 0.16)
c = A('s2'); put(c + 0.1, S.pop(600), 0.5); put(c + 0.2, S.gauge(0, 0.7, 12), 0.28); put(c + 0.95, S.coin(), 0.5); put(c + 1.05, S.bang(), 0.3); hop(c + 1.05, 0.24, 0.4)
c = A('c6'); put(c + 0.1, S.pop(600), 0.28); put(W('c6', '길이', 1.0) + 0.3, S.strike(0.4), 0.2); put(W('c6', '힘든', 2.0), S.pop(420), 0.24); put(W('c6', '끝으로', 3.2), S.coin(), 0.24); put(E1('c6') + 0.05, S.sparkle(5, 0.4), 0.2)
c = A('c7'); put(c - 0.26, S.bands(), 0.5); steps(c + 0.2, E1('c7') - 0.4, 0.34, 0.16); put(W('c7', '10분', 0.9), S.pop(760), 0.24); put(W('c7', '장면', 3.6), S.pop(900), 0.24)
c = A('c9'); put(c + 0.05, S.bang(), 0.16); put(c + 0.45, S.boing(), 0.18); put(c + 0.75, S.heart(), 0.26); put(E1('c9') + 0.05, S.clear(), 0.26)
# ----- 작은 죽음 -----
chapter('d0', night=True)
c = A('d1'); tSt = W('d1', '멈춥니다', 2.4)
for i in range(int((tSt - c) / 0.07)): put(c + 0.2 + i * 0.07, S.tick(1400 + (i % 5) * 60), 0.12)
put(tSt + 0.1, S.low(196, 1.0), 0.2)
c = A('d2'); put(c - 0.26, S.bands(), 0.5); put(c + 0.4, S.pop(560), 0.26); put(W('d2', '흐려지고', 3.8), S.whoosh(1.0, 200, 1500), 0.22); put(W('d2', '침대에서', 5.0), S.pop(480), 0.24); put(W('d2', '아침이', D('d2') - 1.6) + 0.2, S.morning(), 0.2)
c = A('d3'); put(c - 0.26, S.bands(), 0.5); put(c + 0.3, S.pop(600), 0.26); t34 = W('d3', '34', 2.4)
for i in range(12): put(t34 + i * 0.06, S.pop(760 + (i % 4) * 70), 0.08)
put(W('d3', '150', 4.4), S.flip(), 0.26); t12 = W('d3', '12', 6.0); put(t12, S.pop(700), 0.24); put(t12 + 0.2, S.whoosh(1.2, 400, 3000), 0.18)
c = A('d4'); tS4 = W('d4', '잠을', 0.6); put(tS4, S.breath(0.6), 0.4); put(W('d4', '덜', 2.6), S.gauge(0.9, 0.3), 0.18); put(W('d4', '수면', 5.0), S.pop(640), 0.22); put(W('d4', '치료', D('d4') - 1.2), S.coin(), 0.24)
c = A('d5'); put(c - 0.26, S.iris_close(), 0.45); put(c + 0.02, S.iris_open(), 0.4); tB5 = W('d5', '아침의', 0.6); put(tB5 - 0.2, S.pop(700), 0.24); put(tB5 + 0.1, S.equip(), 0.26); put(tB5 + 0.9, S.sparkle(5, 0.4), 0.22); put(E1('d5') + 0.05, S.arp(['G5', 'C6'], 0.12, 0.35, 0.2), 0.24)
# ----- 솔직한 대목 -----
c = A('m1'); put(c - 0.26, S.bands(), 0.5); put(c + 0.3, S.pop(520), 0.3); put(c + 0.5, S.breath(0.8), 0.3); tT1 = W('m1', '지칩니다', D('m1') - 0.7); put(tT1, S.stamp(), 0.4); put(tT1 + 0.2, S.boing(), 0.18)
c = A('m2'); put(c + 0.1, S.pop(600), 0.26); put(W('m2', '늦게', 3.8), S.whoosh(0.8, 500, 3000), 0.22); put(W('m2', '깬', D('m2') - 1.2), S.coin(), 0.24)
c = A('m3'); put(c + 0.1, S.pop(600), 0.26)
for i in range(3): put(c + 0.8 + i * 0.4, S.blip(1100 + i * 160), 0.24)
put(W('m3', '정리할', D('m3') - 1.4), S.pop(760), 0.22)
# ----- 끝 -----
c = A('z1'); put(c - 0.26, S.iris_close(), 0.45); put(c + 0.02, S.iris_open(), 0.4)
c = A('z2'); put(c + 0.3, S.question(), 0.2); put(c + 0.6, S.pop(600), 0.2)
def buzz(d=0.9):
    n = S._noise(d); t = S._t(d); return S._lp(n, 300)[:len(t)] * (S.np.sin(2 * S.np.pi * 7 * t) > 0) * 0.5
c = A('z3'); put(c + 0.05, buzz(0.9), 0.5); put(c + 0.25, S.seq([(0, S.note(S.N['G5'], 0.12, 0.08, 'sin')), (0.12, S.note(S.N['C6'], 0.2, 0.12, 'sin'))]), 0.24)
c = A('z4'); put(c + 0.3, S.pop(900), 0.26); put(c + 0.7, S.whoosh(D('z4') - 1.2, 1500, 6000), 0.12)
c = A('z5'); put(c + 0.15, S.whoosh(0.8, 1500, 6000), 0.14); put(c + 0.4, S.pop(700), 0.22)
c = A('z6')
for i in range(17): put(c + 0.1 + i * (D('z6') - 0.6) / 17, S.tick(1500), 0.08)
c = A('z7'); put(c + 0.02, S.whoosh(0.25, 1000, 6000), 0.22); put(c + 0.05, S.pop(800), 0.22); put(c + 0.55, S.coin(), 0.26); put(c + 0.6, S.sparkle(4, 0.3), 0.18)
c = A('z8'); put(c + 0.05, S.blip(1100), 0.2); put(E1('z8') + 0.05, S.heart(), 0.24)
c = A('z9'); put(c - 0.26, S.bands(), 0.4); tM9 = W('z9', '엄마의', 5.4); put(tM9, S.sparkle(6, 0.5), 0.2); put(tM9 + 0.3, S.heart(), 0.2); tW9 = W('z9', '써', D('z9') - 1.0); put(tW9 + 0.7, S.stamp(), 0.26); put(E1('z9') + 0.05, S.clear(), 0.26)
c = A('z10'); put(c - 0.26, S.bands(), 0.4); put(c + 0.4, S.letters(12, 0.035, 700), 0.2); put(c + 0.9, S.letters(5, 0.04, 820), 0.2); put(E1('z10') + 0.3, S.sparkle(6, 0.6), 0.2)

mixd = voice * 1.0 + bed + sfx * 0.6
sf.write('/dev/shm/od/mix_raw.wav', mixd, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/dev/shm/od/mix_raw.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), '/dev/shm/od/mix.wav'], check=True)
print('dur', round(DUR, 2), 'peak raw', round(float(np.abs(mixd).max()), 2))
