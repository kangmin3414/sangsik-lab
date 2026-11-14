"""자소서 편 v4 — 목소리 + 배경음 + 합성 효과음 -> /dev/shm/v4/mix.wav (loudnorm -14).
효과음 합성 함수는 ../long/build_rs.py의 것을 그대로 가져다 쓴다(함수 정의만 읽어 온다). 남의 효과음 원본은 쓰지 않는다."""
import ast, json, os, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, lfilter
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
SR = 44100; rng = np.random.default_rng(7)
TL = json.load(open('timeline_v4.json')); L = {l['id']: l for l in TL['lines']}; DUR = TL['duration']; N = int(DUR * SR)
voice, _ = sf.read('/dev/shm/v4/voice_v4.wav', dtype='float32'); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
bed = np.zeros(N); sfx = np.zeros(N)
_tree = ast.parse(open('../long/build_rs.py').read())
_keep = [n for n in _tree.body if isinstance(n, ast.FunctionDef) or (isinstance(n, ast.Assign) and getattr(n.targets[0], 'id', '') == 'line_motif')]
exec(compile(ast.Module(_keep, []), 'build_rs_defs', 'exec'), globals())
def creak2(d=0.6, f0=300): t = np.arange(int(d * SR)) / SR; f = f0 + 0.38 * f0 * np.sin(2 * np.pi * 1.3 * t) + 0.1 * f0 * np.sin(2 * np.pi * 11 * t); return np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.08 * np.sin(np.linspace(0, np.pi, len(t)))
def room(t0, t1, g=0.5):   # 방의 소리(에어컨)
    d = t1 - t0; h = hum(d) * g + lp(noise(d), 900)[:int(d * SR)] * 0.008; k = int(0.5 * SR); h[:k] *= np.linspace(0, 1, k); h[-k:] *= np.linspace(1, 0, k); i = int(t0 * SR); sfx[i:i + len(h)] += h[:N - i]
A = lambda k: L[k]['t0'] - 0.15           # 그 줄의 장면이 시작하는 때
D = lambda k: L[k]['t1'] - L[k]['t0']
BR, BM = '../long/bgm/', '../meet/bgm/'   # Lyria로 만든 곡(노래 목소리 검사 통과: VAD 구간 0)
# ---------- 배경음 ----------
STOPH = A('h2') + 0.9                                                                   # 훅: 한 줄이 입을 덮는 순간 음악이 끊긴다
place(BM + 'tense.mp3', 0, STOPH + 2.0, 0.5, fin=0.5, fout=0.05, off=41.0 - STOPH)
place(BR + 'night.mp3', A('a1') - 0.3, A('a6') + 1.05, 0.32, fin=1.2, fout=0.25, off=0)      # 1막: 새벽의 책상. 멈춤에서 음악이 멎는다
place(BR + 'night.mp3', A('a7') + 0.5, A('b1') + 0.4, 0.22, fin=1.5, fout=1.0, off=44)       # 다세계 해석
place(BR + 'first.mp3', A('b1') - 0.1, A('b6') + 1.2, 0.3, fin=1.0, fout=1.0, off=0)         # 2막: 합격 → 사무실. 혼자 남으면 멎는다
place(BR + 'night.mp3', A('b7') - 0.2, A('m0') + 0.4, 0.24, fin=1.0, fout=0.8, off=8)        # 밤마다 검색창
STOP = A('m5') + 0.95                                                                  # 회의: 한 줄이 입을 덮는 순간 음악이 끊긴다
place(BM + 'tense.mp3', A('m0'), STOP + 2.0, 0.5, fin=0.8, fout=0.05, off=41.0 - (STOP - A('m0')))
place(BR + 'first.mp3', A('c5') - 0.2, A('c7') + 1.05, 0.26, fin=1.5, fout=0.2, off=56)      # 반납 → 면접. 두 번째로 입이 막히면 멎는다
place(BR + 'night.mp3', A('c8') - 0.1, A('c9') + 0.7, 0.26, fin=1.2, fout=0.6, off=8)        # 지울 수 없는 한 줄
place(BR + 'second.mp3', A('d1') - 0.2, A('d4') + 0.1, 0.3, fin=1.5, fout=1.5, off=0)        # 3막: 두 번째 세계
place(BR + 'night.mp3', A('d4') - 0.4, A('d6') + 0.6, 0.2, fin=1.0, fout=1.2, off=8)         # 불합격 뒤의 밤
place(BR + 'second.mp3', A('d6') - 0.3, A('e1') + 0.9, 0.3, fin=1.5, fout=2.0, off=24)       # 네 번째 지원서 → 면접 → 작은 회사
place(BR + 'seven.mp3', A('e1') - 0.2, A('e3') + 0.5, 0.3, fin=1.5, fout=0.6, off=0)         # 4막: 7년 뒤. 그 줄이 화면에 뜨면 멎는다
place(BR + 'seven.mp3', A('e6') - 0.3, DUR, 0.28, fin=2.5, fout=2.2, off=46)                 # 논어 → 그 밤을 아는 사람 → 커서
vad = (np.abs(voice) > 0.006).astype(float)
act = (trail_sum(vad, int(0.5 * SR)) > 0) | (trail_sum(vad[::-1], int(0.15 * SR))[::-1] > 0)
k = int(0.12 * SR); act = trail_sum(act.astype(float), k) / k
bed *= (1.0 - 0.72 * act)
# ---------- 효과음(모두 작게) ----------
# 훅
room(0, STOPH + 2.6, 0.5)
put(W('h1', '이', 0.96) + 0.15, tick_(900, 0.9), 0.4)                                    # 펜을 내려놓는다
put(A('h2') + 0.3, breath(0.45, True), 0.6); put(A('h2') + 0.75, whoosh(0.5), 0.2); put(STOPH + 0.33, flap(), 0.7); put(STOPH + 0.35, thud(0.12, 150), 0.6)   # 입을 덮는다 '착'
for k in range(2): put(STOPH + 0.95 + k * 0.62, tick_(900, 0.7), 0.3)
put(A('k0') + 0.05, zap(), 0.12)
# 1막
for k in range(4): put(A('a1') + 0.35 + k * 0.6, tick_(900, 0.7), 0.26)                 # 새벽의 시계
tS = W('a1', '새벽', 0.9); put(tS, pop_(700), 0.2); put(tS + 0.62, pop_(760), 0.22)
tC = W('a1', '2시', 2.02) + 1.15; put(tC - 0.05, whoosh(0.3), 0.1)
keys(tC + 0.35, tC + 0.8, 0.22, 0.26); keys(tC + 1.25, tC + 1.55, 0.14, 0.16); keys(tC + 1.95, tC + 2.6, 0.22, 0.26); keys(tC + 2.85, tC + 3.3, 0.14, 0.16)
put(W('a1', '한', 4.6), soft(392, 1.4), 0.28)
put(A('a2') + 0.02, buzz(0.5), 0.55); put(A('a2') + 0.38, pop_(820), 0.28); put(W('a2', 'AI', 2.42), pop_(820), 0.28); put(W('a2', '서류', 4.61), pop_(820), 0.28)
a3 = A('a3'); put(a3 + 0.05, whoosh(0.35), 0.1); keys(a3 + 0.45, a3 + 1.5, 0.07, 0.2); put(a3 + 1.52, ding(), 0.16); put(a3 + 1.6, pop_(600), 0.22); put(a3 + 2.1, click(), 0.3)
keys(a3 + 2.45, a3 + 3.2, 0.1, 0.24); put(a3 + 3.25, line_motif(), 0.42)                # 그 한 줄
put(A('a4') + 0.0, whoosh(0.5), 0.1); tW = W('a4', '창고', 2.7); put(tW, pop_(700), 0.22)
for k in range(6): put(tW + 0.3 + k * 0.3, tick_(1200, 0.7), 0.2)                       # 상자를 센다
put(A('a5') + 0.0, breath(0.4, True), 0.4); put(W('a5', '되잖아', 0.64) + 1.05, breath(0.55, False), 0.4)
put(A('a6') + 0.95, tape_stop(0.6), 0.5); put(A('a6') + 1.55, soft(1760, 1.6), 0.1)     # 멈춤
a7 = A('a7'); put(a7 + 0.5, whoosh(0.8), 0.1); put(a7 + 0.75, pop_(700), 0.22); put(W('a7', '갈림길', 3.5), pop_(560), 0.2); put(W('a7', '갈라져', 4.88) + 0.25, whoosh(1.0), 0.08)
tU = W('a7', '두', 6.0); put(tU, pop_(740), 0.26); put(tU + 0.35, pop_(660), 0.26); put(W('a7', '일어난', 7.5), sparkle(), 0.14)
tN = W('a7', '여러', 9.7); put(tN, pop_(700), 0.24); put(tN + 0.9, scribble(0.8), 0.5); put(tN + 1.0, pop_(700), 0.2); put(a7 + D('a7') - 2.3 + 0.4, whoosh(2.0), 0.16)
# 2막: 합격 → 사무실
b1 = A('b1'); put(b1 + 0.2, click(), 0.4); put(b1 + 0.58, ding(), 0.3); put(b1 + 1.2, whoosh(0.4), 0.12); put(b1 + 1.55, pop_(820), 0.28); put(b1 + 1.6, ding(), 0.22); put(b1 + 1.75, sparkle(), 0.14)
put(b1 + 2.75, whoosh(0.35), 0.16); put(b1 + 2.86, pop_(900), 0.24); put(b1 + 3.5, thud(0.2, 110), 0.3)                                 # 벌떡
put(W('b2', '붙었어', 1.14), pop_(880), 0.2)
room(A('b3'), A('b7'), 0.35)
stepsg(A('b3') - 0.3, A('b3') + 0.5, 0.26, 0.3); put(W('b3', '자소서', 0.94) + 0.05, rustle(0.3), 0.4); put(W('b3', '직접', 5.24) + 0.4, soft(196, 2.2), 0.3)
put(W('b4', '네', 0.88), pop_(880), 0.22); put(A('b5') + 0.1, pop_(940), 0.22)
b6 = A('b6'); stepsg(b6 + 0.05, b6 + 1.5, 0.3, 0.26); put(b6 + 0.75, whoosh(0.5), 0.12); put(b6 + 1.25, thud(0.28, 70), 0.7); put(b6 + 1.27, creak2(0.5, 240), 0.4); put(b6 + 1.3, line_motif(), 0.34); put(b6 + 1.6, pop_(700), 0.24)   # 어깨에 앉는다
for k in range(3): keys(A('b7') + 0.15 + k * 1.3, A('b7') + 0.1 + k * 1.3 + 0.73, 0.07, 0.18)
# 회의(m0~m7)
room(A('m0'), A('c5'), 0.55)
put(A('m0') + 1.2, click(), 0.4)
t30 = W('m1', '30', 2.06); put(t30 - 0.15, click(), 0.45); put(t30 - 0.1, whoosh(0.3), 0.12); put(t30, pop_(700), 0.3); put(t30 + 0.05, ding(), 0.2)
tHd = t30 + 1.3
for k in range(26): put(tHd + 0.05 + k * 0.055, tick_(2400 + rng.random() * 600, 0.5), 0.1)                                             # 손이 떨린다
put(A('m2') + 0.05, creak2(0.45, 380), 0.5); put(A('m2') + 0.15, tick_(1500, 0.8), 0.35)
tA = W('m2', '뭐죠', 3.74) + 0.75; put(tA + 0.25, thud(0.28, 62), 0.9); put(tA + 0.27, creak2(0.5, 240), 0.45)                          # 한 줄이 무거워진다
put(W('m2', '전분기', 5.92) - 0.1, whoosh(0.25), 0.1)
for k in range(9): put(A('m3') + 0.2 + k * 0.52, heartbeat(), 0.55)
for k in range(8): put(A('m3') + 0.4 + k * 0.42, tick_(1300, 0.7), 0.16)
tG = W('m3', '종합', 2.72) - 0.25; put(tG, whoosh(0.3), 0.1); put(tG + 0.6, creak2(0.8, 200), 0.5); put(tG + 1.3, thud(0.28, 62), 0.8); put(tG + 1.8, creak2(0.7, 180), 0.5)
put(A('m4') + 0.45, tick_(900, 0.9), 0.4)
put(A('m5') + 0.25, breath(0.45, True), 0.6); put(A('m5') + 0.75, whoosh(0.5), 0.2); put(A('m5') + 1.28, flap(), 0.7); put(A('m5') + 1.3, thud(0.12, 150), 0.6)
for k in range(4): put(A('m5') + 1.9 + k * 0.62, tick_(900, 0.7), 0.3)
put(A('m5') + 2.9, flap(), 0.45)
put(A('m6') + 0.15, creak2(0.6, 300), 0.6); put(A('m6') + 0.2, whoosh(0.5), 0.1)
put(A('m7') + 0.25, step(), 0.3); put(A('m7') + 0.7, step(), 0.25)
# 인사팀(c1~c4): 음악 없이, 방의 소리와 시계
put(A('c1') + 0.25, rustle(0.3), 0.4); tK = W('c1', '경력', 1.42); put(tK, scribble(0.9), 0.6); put(tK + 0.1, thud(0.25, 66), 0.6)
for k in range(5): put(A('c2') - 1.6 + k * 0.62, tick_(900, 0.7), 0.26)
for k in range(3): put(A('c4') + 0.75 + k * 0.62, tick_(900, 0.7), 0.24)
tEnd = A('c4') + D('c4'); put(A('c4') + W('c4', '제가', 1.02) - L['c4']['t0'] - 0.25, breath(0.4, True), 0.5); put(tEnd + 0.2, thud(0.28, 62), 0.8); put(tEnd + 0.22, creak2(0.5, 220), 0.4); put(tEnd + 0.35, soft(147, 3.0), 0.36)
# 반납(c5) → 면접(c6~c8)
c5 = A('c5'); put(c5 + 1.2, rip(0.2), 0.1); put(c5 + 1.72, clank(), 0.42)
for k in range(5): put(c5 + 2.4 + k * 0.2, whoosh(0.16), 0.14)                          # 손을 털어도
put(c5 + 3.4, line_motif(), 0.34)
room(A('c6'), A('c8') + 2.0, 0.4)
put(A('c6') + 0.3, rustle(0.3), 0.35); put(W('c6', '석', 0.78) + 0.25, pop_(640), 0.2)
c7 = A('c7'); put(c7 + 0.4, breath(0.45, True), 0.6); put(c7 + 0.95, whoosh(0.5), 0.2); put(c7 + 1.33, flap(), 0.7); put(c7 + 1.35, thud(0.12, 150), 0.6)
for k in range(2): put(c7 + 1.95 + k * 0.62, tick_(900, 0.7), 0.3)
put(W('c8', '지어낸', 0.74), pop_(640), 0.22); put(W('c8', '값으로', 1.28), whoosh(0.4), 0.08)
tGr = W('c8', '지울', 1.78); put(tGr + 0.22, thud(0.28, 80), 0.6)
for k in range(11): put(tGr + 1.0 + k * 0.17, scribble(0.14), 0.5)                      # 지우개로 문지른다
put(W('c8', '세계는', 6.46) - 0.45, tape_stop(0.6), 0.45)
c9 = A('c9'); put(c9 + 0.7, rewind(1.3), 0.9); put(c9 + 2.1, whoosh(0.8), 0.1); put(c9 + 2.9, pop_(760), 0.26); put(c9 + 2.95, sparkle(), 0.12)
# 3막: 두 번째 세계
put(W('d1', '지운', 2.2) - 0.5, whoosh(2.0), 0.14)
put(W('d2', '쓰자', 1.82), pop_(760), 0.22)
d3 = A('d3'); keys(d3 + 0.1, d3 + 0.75, 0.045, 0.14); keys(d3 + 0.85, d3 + 1.75, 0.07, 0.2); put(d3 + 1.95, click(), 0.38); put(d3 + 2.32, ding(), 0.28); put(d3 + 3.0, whoosh(0.4), 0.12)
for tt in (0.25, 0.7, 1.15): put(d3 + 3.05 + tt, pop_(520), 0.26)
put(d3 + 4.6, soft(294, 2.2), 0.26)
put(A('d4') + 0.02, buzz(0.5), 0.5); put(A('d4') + 0.3, pop_(820), 0.26); put(W('d4', '내가', 0.94), pop_(820), 0.26)
put(W('d5', '둘', 2.04), soft(277, 2.0), 0.22); put(W('d5', '둘', 2.04) + 1.15, breath(0.55, False), 0.4)
put(A('d6') + 0.3, pop_(760), 0.24); tJ = W('d6', '제로는', 1.58); keys(tJ, A('d6') + D('d6') + 0.55, 0.12, 0.15)
tB = W('d6', '창고', 3.06); put(tB, pop_(700), 0.22)
for k in range(5): put(tB + 0.4 + k * 0.3, tick_(1200, 0.7), 0.2)
room(A('d7'), A('d12'), 0.4)
put(A('d7') + 0.3, rustle(0.3), 0.35); tKa = W('d8', '칸에', 1.66); put(tKa - 0.15, pop_(640), 0.22)
tDw = W('d8', '뒤로', 3.4); put(tDw - 0.25, whoosh(0.8), 0.1); put(tDw + 0.3, pop_(760), 0.22); put(tDw + 0.45, pop_(860), 0.22)
tNa = W('d8', '날짜', 4.46); put(tNa + 0.05, tick_(1500, 0.8), 0.3); put(tNa + 0.4, tick_(1500, 0.8), 0.3)
e10 = A('d10') + D('d10'); put(e10 + 0.6, ding(), 0.24); put(A('d11') + 0.35, pop_(640), 0.22); put(A('d11') + 0.4, soft(220, 2.0), 0.2)
room(A('d12'), A('e3'), 0.35)
keys(A('d12') + 0.3, W('d12', '월급', 2.68) + 0.1, 0.13, 0.12); put(A('d13') - 0.1, whoosh(0.3), 0.1)
put(A('d14') + 0.75, creak2(0.5, 300), 0.5); stepsg(A('d14') + 1.1, A('d14') + 2.1, 0.26, 0.28); put(A('d14') + 2.2, ding(), 0.2)
# 4막: 7년 뒤
e1 = A('e1'); put(e1 + 0.1, whoosh(0.4), 0.12); put(e1 + 0.5, pop_(700), 0.24); stepsg(e1 + 0.6, e1 + 1.8, 0.28, 0.3)
put(A('e2') - 0.55, rustle(0.3), 0.4); put(W('e2', '30', 4.66) + 0.35, pop_(700), 0.2)
e3 = A('e3'); put(e3 + 0.05, rustle(0.5), 0.25); put(e3 + 0.9, whoosh(0.6), 0.08); put(e3 + 1.75, pop_(600), 0.24); put(e3 + 1.8, line_motif(), 0.42)
for k in range(6): put(A('e4') + 0.2 + k * 0.62, tick_(900, 0.7), 0.3)                  # 음악이 멎고 시계 소리만
put(A('e5') - 0.3, breath(0.4, True), 0.4)
e6 = L['e6']['t0']; put(A('e6') + 0.3, pop_(640), 0.2); put(W('e6', '아는', 5.72), soft(392, 2.2), 0.2); put(W('e6', '모르는', 7.94), soft(440, 2.2), 0.2); put(W('e6', '그것이', 10.52), mx(soft(523, 3.0), soft(659, 3.0)), 0.2)
put(W('e7', '줄을', 1.88), whoosh(0.5), 0.08); tN = W('e7', '밤이', 2.82) - 0.3; put(tN, pop_(640), 0.22); put(tN + 0.05, soft(330, 2.6), 0.24)
for k in range(5): put(A('e8') + 0.3 + k * 0.62, tick_(900, 0.7), 0.26)
for k in range(4): put(A('e9') + 0.5 + k * 1.0, tick_(900, 0.7), 0.2)
mix = voice * 1.0 + bed + sfx * 0.55
sf.write('/dev/shm/v4/mix_raw.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/dev/shm/v4/mix_raw.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), '/dev/shm/v4/mix.wav'], check=True)
print('dur', round(DUR, 2), 'peak raw', round(float(np.abs(mix).max()), 2), 'stops', round(STOPH, 2), round(STOP, 2))
