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
       ('savanna', A('r1') - 0.3, DUR, 0.28, 0.0)]
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

# ----- s1: 출근 스테이지 (신호등 · 지하철 · 엘리베이터 + 상사 말풍선) -----
c = A('s1')
t1 = W('s1', '신호등', 1.0) + 0.25; t2 = W('s1', '지하철', 2.6) + 0.25; t3 = W('s1', '앉기도', 4.6) + 0.1
tB = W('s1', '상사', 5.6); tK = W('s1', '카톡', 7.2) + 0.1; tkHit = tB + 3 * 0.32 + 0.55
put(c + 0.1, S.stage(), 0.2)                                         # 출근 스테이지 카드
for a0, b0 in ((c + 0.2, t1), (t1 + STOP, t2), (t2 + STOP, t3), (t3 + STOP, tK)): steps(a0, b0, 0.26, 0.12)
put(t1 - 0.25, S.blip(440), 0.1); put(t1, S.hurt(), 0.2)            # 빨간불 → MISS
put(t2 - 0.35, S.whoosh(0.4, 300, 2500), 0.16); put(t2, S.hurt(), 0.2); put(t2 + 0.05, S.whistle(0.3), 0.06)   # 지하철 칸이 와서 찌부(끼익)
put(t3 - 0.1, S.land(), 0.2); put(t3, S.hurt(), 0.2)                # 문 닫힘
for i in range(4): put(tB + i * 0.32 + 0.1, S.whoosh(0.3, 900, 4000), 0.05); put(tB + i * 0.32 + 0.55, S.pop(420), 0.05 if i < 3 else 0.0)
tHb = max(tkHit + 0.05, E1('s1') + 0.05); put(tHb, S.blip(523), 0.12); put(tHb + 0.16, S.blip(523), 0.1)   # 마지막 하트 두근(말 끝난 뒤)
# ----- s2: 영혼이 털리는 기분 -----
c = A('s2'); put(c + 0.05, S.letters(3, 0.08, 900), 0.12)          # 콤보 ×3
put(W('s2', '영혼', 1.2), S.ghost(0.9), 0.16); put(W('s2', '아시죠', 2.6), S.pop(500), 0.1)
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
# ----- r5: 수백만 명이 한 팀처럼 (다리) -----
tM = W('r5', '수백만', 1.6); tT = W('r5', '팀', 3.2)
put(tM, S.whoosh(1.2, 400, 3000), 0.1); steps(tM, tM + 1.8, 0.11, 0.06)
put(tT, S.land(), 0.12); put(tT + 0.05, S.sparkle(6, 0.5), 0.1)
put(E1('r5') + 0.05, S.clear(), 0.28)

mixd = voice * 1.0 + bed + sfx * 0.6
if os.environ.get('SP_STEMS'): np.savez('/dev/shm/sp/stems.npz', voice=voice, bed=bed, sfx=sfx)
sf.write('/dev/shm/sp/mix_raw.wav', mixd, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/dev/shm/sp/mix_raw.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), '/dev/shm/sp/mix.wav'], check=True)
print('dur', round(DUR, 2), 'peak raw', round(float(np.abs(mixd).max()), 2))
