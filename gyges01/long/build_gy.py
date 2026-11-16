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
B = '/dev/shm/gy/bgm/'
SEG = [('exam', 0, A('k0') + 0.2, 0.30, 0.0), ('myth', A('g1') - 0.3, DUR, 0.24, 0.0)]
for name, t0, t1, g, off in SEG: place(B + name + '.mp3', t0, t1, g, fin=0.8 if t0 > 0.1 else 0.3, fout=0.6 if t1 < DUR - 0.1 else 1.6, off=off)
def trail_sum(x, k): c = np.concatenate([[0.0], np.cumsum(x)]); i = np.arange(len(x)); return c[i + 1] - c[np.maximum(0, i + 1 - k)]
vad = (np.abs(voice) > 0.006).astype(float)
act = (trail_sum(vad, int(0.5 * SR)) > 0) | (trail_sum(vad[::-1], int(0.15 * SR))[::-1] > 0)
k = int(0.12 * SR); act = trail_sum(act.astype(float), k) / k
bed *= (1.0 - 0.74 * act)

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
tA = W('o3', '정답', 3.4); put(tA, S.letters(26, 0.07, 900), 0.05)
c = A('o4'); steps(c + 0.1, E1('o4') + 0.2, 0.45, 0.07); put(W('o4', '눈치', 0.75) + 0.1, S.letters(3, 0.18, 600), 0.05)
tP = W('o4', '0', 2.75); put(tP - 0.2, S.pop(900), 0.08); put(tP + 0.4, S.ding(), 0.08)
c = A('o5'); put(c, S.blip(523), 0.12); put(c + 0.08, S.blip(392), 0.12); put(W('o5', '상상', 1.3), S.question(), 0.1)
tN = W('o6', '아무도', 0.15)
for i in range(6): put(tN + 0.3 + i * 0.1, S.pop(900 - i * 60), 0.05)
put(W('o6', '100', 1.15) - 0.1, S.gauge(0.0, 1.0), 0.06); put(W('o6', '여러분', 2.85), S.flip(), 0.1)
tQ = W('o6', '쓰시겠', 5.1)
for i in range(4): put(tQ + i * 0.455, S.blip(990), 0.06)
# ======== 제목 카드 ========
iris('k0'); put(A('k0') + 0.15, S.hum(1.5), 0.6); put(A('k0') + 0.25, S.blip(660), 0.06); iris('g1')
# ======== 1단계: 뉴스 → 그리스 ========
for k2, fb in (('AI', 0.3), ('시험', 1.65), ('부정', 2.1)): put(W('g1', k2, fb) - 0.05, S.land(), 0.14)
put(W('g1', '논란', 2.8), S.stamp(), 0.22)
c = A('g2'); put(c + 0.25, S.whoosh(0.5, 400, 3000), 0.1); put(W('g2', '질문', 1.45) - 0.2, S.pop(700), 0.08)
tY = W('g2', '2400', 1.99) - 0.1; put(tY, S.whoosh(1.6, 200, 2500), 0.12); put(tY, S.letters(14, 0.1, 1600)[::-1].copy(), 0.04)
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
tNn = W('g5', '나라를', 5.55); put(tNn + 0.1, S.stamp(), 0.2); put(E1('g5') + 0.1, S.clear(), 0.18)
iris('g6'); tS = W('g6', '섬뜩', 1.5); put(tS - 0.3, S.low(98, 1.4), 0.3); put(tS, S.hum(1.6), 0.5); put(W('g6', '질문', 2.3) - 0.1, S.question(), 0.08)
put(W('g7', '진짜', 1.6) - 0.3, S.pop(760), 0.08); put(W('g7', '아니면', 3.95), S.bang(), 0.08); put(W('g7', '보고', 5.4) - 0.2, S.pop(880), 0.08)
bands('g8'); put(A('g8') + 0.05, S.pop(700), 0.07); put(W('g8', 'AI', 0.7) - 0.1, S.pop(880), 0.07); tB = W('g8', '바로', 1.45); put(tB, S.ding(), 0.12); put(tB + 0.05, S.sparkle(5, 0.4), 0.07)
put(E1('g8') + 0.05, S.pop(900), 0.06)
iris('g9'); tVv = W('g9', '사라진', 1.07)
for i in range(5): put(tVv + 0.3 + i * 0.12, S.pop(820 - i * 70), 0.06)
tM = W('g9', '나만', 2.75); put(tM - 0.1, S.pop(640), 0.08); put(tM + 0.3, S.blip(1760), 0.05); put(tM + 0.45, S.blip(1760), 0.05)
tTe = W('g9', '유혹', 5.4) - 0.1; put(tTe, S.boing(160, 420, 0.3), 0.1); tHh = W('g9', '고개', 6.15); put(tHh - 0.2, S.ghost(0.8), 0.08); put(tHh + 0.3, S.low(130, 1.2), 0.15)

mixd = voice * 1.0 + bed + sfx * 0.6
if os.environ.get('GY_STEMS'): np.savez('/dev/shm/gy/stems.npz', voice=voice, bed=bed, sfx=sfx)
sf.write('/dev/shm/gy/mix_raw.wav', mixd, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/dev/shm/gy/mix_raw.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), '/dev/shm/gy/mix.wav'], check=True)
print('dur', round(DUR, 2), 'peak raw', round(float(np.abs(mixd).max()), 2))
