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
       ('night', A('f4') - 0.3, DUR, 0.34, 44)]
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
put(c := A('f4'), S.rain(D('f4') + 1.0), 0.35)

mixd = voice * 1.0 + bed + sfx * 0.6
sf.write('/dev/shm/fk/mix_raw.wav', mixd, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/dev/shm/fk/mix_raw.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), '/dev/shm/fk/mix.wav'], check=True)
print('dur', round(DUR, 2), 'peak raw', round(float(np.abs(mixd).max()), 2))
