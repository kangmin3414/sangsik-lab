"""휴머노이드·여가·놀이 편 샘플: voice + BGM(dawn → table, 덕킹) + 작은 효과음 -> /dev/shm/ls/mix.wav (loudnorm -14)
효과음은 화면에 보이는 것만, 아주 작게: 새벽 컨베이어 웅웅 + 로봇이 상자 내려놓는 톡, 버스 저음, 제목 카드 낮은 음,
먼지 쓸기, 안내문 종이, 냉장고 웅웅(식탁), '뭘'에서 손이 떨어지는 툭, d11 형광등 지직, '마음'에서 캔 미는 소리,
마리엔탈 바람 + 공책 글자(사각). table.mp3는 앞 0.6초에 VAD 구간이 있어 3초부터 쓴다(그 뒤 VAD 0)."""
import json, subprocess, sys, os, numpy as np, soundfile as sf
os.chdir(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, '../../zw')
import gf_sfx as S
SR = 44100; O = '/dev/shm/ls/'
TL = json.load(open('timeline_ls.json')); L = {l['id']: l for l in TL['lines']}; DUR = TL['duration']; N = int(DUR * SR)
voice, _ = sf.read(O + 'voice_ls.wav', dtype='float32')
if voice.ndim > 1: voice = voice.mean(1)
voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
A = lambda k: L[k]['t0'] - 0.15
def W(lid, key, fb):                                  # lsAt와 같은 규칙(fb는 줄 길이 비율)
    m = [w for w in L[lid].get('words', []) if key in w['w'].replace(' ', '')]
    return L[lid]['t0'] + m[0]['t'] + 0.05 if m else L[lid]['t0'] + fb * (L[lid]['t1'] - L[lid]['t0'])
def load(fn, start, dur):
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', fn, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    a = np.frombuffer(raw, np.float32).copy(); a = a[int(start * SR):]; n = int(dur * SR)
    while len(a) < n: a = np.concatenate([a, a[int(8 * SR):]])
    return a[:n]
def fade(a, fin, fout):
    k = int(fin * SR); a[:k] *= np.linspace(0, 1, k)[:len(a)]; k = int(fout * SR); a[-k:] *= np.linspace(1, 0, k); return a
bed = np.zeros(N)
def place(fn, t0, t1, g, fin=1.5, fout=2.5, off=0.0):
    i0, i1 = int(max(0, t0) * SR), min(N, int(t1 * SR)); a = fade(load(fn, off, (i1 - i0) / SR) * g, fin, fout)
    bed[i0:i0 + len(a)] += a
B = O + 'bgm/'
place(B + 'dawn.mp3', 0, A('k0') + 1.0, 0.30, fin=1.0, fout=2.0)
place(B + 'table.mp3', L['k0']['t1'] - 0.6, DUR, 0.26, fin=2.5, fout=3.5, off=3.0)
# 마리엔탈(세피아)에서는 배경음을 조금 낮추고 바람을 깐다
tm0, tm1 = A('m13') - 0.4, L['m15']['t1'] + 0.5
g = np.ones(N); i0, i1 = int(tm0 * SR), int(tm1 * SR); r = int(1.2 * SR)
g[i0:i1] = 0.7; g[i0 - r:i0] = np.linspace(1, 0.7, r); g[i1:i1 + r] = np.linspace(0.7, 1, r); bed *= g
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
def lp_noise(d, lo, hi): return S._bp(S._noise(d), lo, hi)
# 새벽: 컨베이어 웅웅(낮게) + 로봇이 상자를 컨베이어에 내려놓는 톡(2.4초 주기, u=0.8)
tEnd = A('k0') + 0.3
put(0.2, fade(S.hum(tEnd - 0.2) * 0.8 + lp_noise(tEnd - 0.2, 60, 400) * 0.03, 1.5, 1.5), 1.0)
k = 0
while 1.92 + 2.4 * k < tEnd - 0.5:
    put(1.92 + 2.4 * k, S.land(), 0.05); k += 1
# o2 '잠도' 로봇 LED 클로즈업: 작은 삑
put(W('o2', '잠도', 0.55) - 0.1, S.blip(1320), 0.035)
# o4 버스: 저음 엔진(말과 겹치지 않게 저역만) — '깊은'에서 들어와 화면이 어두워질 때까지
tBus = W('o4', '깊은', 0.25); d = L['o4']['t1'] + 0.8 - tBus
eng = lp_noise(d, 40, 220) * 0.5 + np.sin(2 * np.pi * 55 * S._t(d)) * 0.08
put(tBus, fade(eng * np.minimum(1, S._t(d) / 1.5), 0.3, 1.2), 0.9)
# 제목 카드
put(L['k0']['t0'] + 0.1, S.low(131, 2.0), 0.07)
# 식탁 장면 전체: 냉장고 웅웅(아주 작게), 마리엔탈 동안은 쉰다
for t0, t1 in ((L['d5']['t0'] - 0.6, tm0 + 0.5), (A('d16') - 0.3, DUR)):
    dd = t1 - t0; put(t0, fade(np.sin(2 * np.pi * 50 * S._t(dd)) * 0.05 + np.sin(2 * np.pi * 100 * S._t(dd)) * 0.025, 1.0, 1.5), 1.0)
# d6 먼지 쓸기
for i in range(3): put(L['d6']['t0'] + 0.15 + i * 0.4, S.rustle(0.22), 0.05)
# d8 안내문(위에서 본 종이): 종이 스침
put(L['d8']['t0'] - 0.25, S.whoosh(0.35, 900, 5000), 0.07)
# d10 '뭘': 손이 식탁에 툭
put(W('d10', '뭘', 0.85) + 0.3, S.land(), 0.09)
# d11 형광등 지직(말 없는 1.5초)
t0 = L['d11']['t0'] + 0.05; dd = L['d11']['t1'] - t0
buzz = np.sign(np.sin(2 * np.pi * 120 * S._t(dd))) * 0.03 * (np.sin(S._t(dd) * 47) > 0.86)
put(t0, fade(buzz, 0.05, 0.2), 1.0)
# d12 '마음': 캔을 식탁 위로 민다(낮은 스침)
put(W('d12', '마음', 0.4), S.whoosh(0.9, 150, 1400), 0.08)
# 마리엔탈 바람
dd = tm1 - tm0; wind = lp_noise(dd, 150, 900) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.11 * S._t(dd)))
put(tm0, fade(wind * 0.08, 2.0, 2.0), 1.0)
# m15 공책 글자(사각사각)
for i, key in enumerate(['틀', '만날', '함께', '자리', '할']):
    put(W('m15', key, 0.3 + (i + 1) * 0.12), S.scribble(0.35), 0.10)

mixd = voice * 1.0 + bed + sfx * 0.6
if os.environ.get('LS_STEMS'): np.savez(O + 'stems.npz', voice=voice, bed=bed, sfx=sfx)
sf.write(O + 'mix_raw.wav', mixd, SR)
# 2패스 loudnorm(1패스는 -15.5에 멈춤): 재고 → linear로 맞춘다
# lowpass 11k: 24kHz TTS의 12kHz 끝자락 치찰음이 AAC에서 +2.5dB 넘침을 만들어서 잘라 둔다(들리는 차이 거의 없음)
AF = 'lowpass=f=11000,alimiter=limit=0.32:level=false,loudnorm=I=-14:TP=-1.0:LRA=11'
r = subprocess.run(['ffmpeg', '-hide_banner', '-i', O + 'mix_raw.wav', '-af', AF + ':print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
m = json.loads(r[r.rindex('{'):r.rindex('}') + 1])
AF2 = AF + f":measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,aresample=176400,alimiter=limit=0.84:level=false,aresample=44100"
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', O + 'mix_raw.wav', '-af', AF2, '-ar', str(SR), O + 'mix.wav'], check=True)
print('dur', round(DUR, 2), 'peak raw', round(float(np.abs(mixd).max()), 2))
