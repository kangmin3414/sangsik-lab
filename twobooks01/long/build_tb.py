"""성경과 불경 편 샘플: voice + BGM(dawn → essay, 덕킹) + 아주 작은 효과음 -> /dev/shm/tb/mix.wav (loudnorm -14)
진지한 에세이라 효과음은 거의 없다: 벽시계 초침(멈춤), 시대가 다른 손들의 옷자락, 책이 빛남, 원문 카드 종이 소리.
dawn.mp3는 앞 3초에 VAD 구간(음성 인식 환각)이 있어 3초부터 쓴다(그 뒤 VAD 0)."""
import json, subprocess, sys, os, numpy as np, soundfile as sf
os.chdir(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, '../../zw')
import gf_sfx as S
SR = 44100
TL = json.load(open('timeline_tb.json')); L = {l['id']: l for l in TL['lines']}; DUR = TL['duration']; N = int(DUR * SR)
voice, _ = sf.read('/dev/shm/tb/voice_tb.wav', dtype='float32')
if voice.ndim > 1: voice = voice.mean(1)
voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
A = lambda k: L[k]['t0'] - 0.15
E1 = lambda k: L[k]['t1']
def W(lid, key, fb):                                  # tbAt와 같은 규칙(fb는 줄 길이 비율)
    m = [w for w in L[lid].get('words', []) if key in w['w'].replace(' ', '')]
    return L[lid]['t0'] + m[0]['t'] + 0.05 if m else L[lid]['t0'] + fb * (L[lid]['t1'] - L[lid]['t0'])
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
B = '/dev/shm/tb/bgm/'
place(B + 'dawn.mp3', 0, A('k0') + 1.6, 0.30, fin=1.2, fout=2.2, off=3.0)
place(B + 'essay.mp3', A('k0') - 0.3, DUR, 0.26, fin=2.0, fout=3.0)
def trail_sum(x, k): c = np.concatenate([[0.0], np.cumsum(x)]); i = np.arange(len(x)); return c[i + 1] - c[np.maximum(0, i + 1 - k)]
vad = (np.abs(voice) > 0.006).astype(float)
act = (trail_sum(vad, int(0.6 * SR)) > 0) | (trail_sum(vad[::-1], int(0.25 * SR))[::-1] > 0)
k = int(0.25 * SR); act = trail_sum(act.astype(float), k) / k
bed *= (1.0 - 0.6 * act)

sfx = np.zeros(N)
def put(t, w, g=1.0):
    i = int(t * SR)
    if i < 0 or i >= N: return
    w = w[:N - i]; sfx[i:i + len(w)] += w * g
# o1 벽시계: 초침 소리 → '멈춰'에서 멈춘다
tStop = W('o1', '멈춰', 0.7); k = 0
while 0.6 + k < tStop: put(0.6 + k, S.tick(1100), 0.05); k += 1
# o2 시대가 다른 손들(옷자락)
t0 = W('o2', '수천', 0.3)
for i in range(4): put(t0 + i * 0.6, S.whoosh(0.5, 300, 1800), 0.05)
# o3 책이 빛남
put(W('o3', '성경', 0.4) - 0.15, S.sparkle(4, 0.6), 0.05); put(W('o3', '불경', 0.75) - 0.15, S.sparkle(4, 0.6), 0.05)
# o6 종이 쪽지
put(W('o6', '문구', 0.78), S.whoosh(0.6, 800, 4500), 0.05)
# 제목 카드
put(A('k0') + 0.1, S.low(147, 2.4), 0.07)
# 원문 카드(종이)
for q in ('a4', 'b3'): put(L[q]['t0'] - 0.4, S.whoosh(0.35, 900, 5000), 0.07)
# 절대자(빛) · 자유
put(W('a6', '절대자', 0.6) - 0.1, S.sparkle(5, 0.8), 0.04); put(W('b5', '자유', 0.88) - 0.1, S.sparkle(5, 0.8), 0.05)

mixd = voice * 1.0 + bed + sfx * 0.6
if os.environ.get('TB_STEMS'): np.savez('/dev/shm/tb/stems.npz', voice=voice, bed=bed, sfx=sfx)
sf.write('/dev/shm/tb/mix_raw.wav', mixd, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/dev/shm/tb/mix_raw.wav', '-af', 'alimiter=limit=0.6:level=false,loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), '/dev/shm/tb/mix.wav'], check=True)
print('dur', round(DUR, 2), 'peak raw', round(float(np.abs(mixd).max()), 2))
