"""마커 샘플 타임라인. 고른 테이크를 이어 붙이며 줄 안의 긴 쉼을 줄인다(빠른 템포).
쓰기: /dev/shm/op/ms_voice.wav(24 kHz), /dev/shm/op/web/ms_tl.json {dur, lines:[{id,t0,t1,sub,who,words:[{w,t}]}]}.
단어 시각 t는 줄 시작에서 잰 값(쉼을 줄인 뒤의 시각으로 옮김)."""
import json, os, subprocess, numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__))
TK = json.load(open(os.path.join(HERE, 'takes_ms.json')))
SHEETS = [['m8', 'm9'], ['m11', 'm12a', 'm12b'], ['m15', 'm17', 'm18'], ['m18b', 'm18c', 'm19', 'm20', 'm21'], ['m22', 'm24', 'm25', 'm26'], ['m32', 'm33']]
LEAD, GAP, SHEET_GAP, TAIL, SR = 0.45, 0.15, 1.15, 2.2, 24000
FR = int(0.01 * SR)
SPEED = {'C': 1.0, 'N': 1.0, 'Z': 1.0}   # 늘이기·당기기 없음: rubberband로 당긴 소리가 기계음처럼 들렸다(운영자 2026-11-15). 빠르기는 녹음 말투 + 긴 쉼 줄이기로만

def faster(path, k):
    if k == 1.0: return sf.read(path, dtype='float32')[0]
    out = f'/dev/shm/op/tmp/fast_{os.path.basename(path)}'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', path, '-af', f'rubberband=tempo={k}:pitch=1:formant=preserved', '-ar', str(SR), '-ac', '1', out], check=True)
    return sf.read(out, dtype='float32')[0]

def squeeze(w):
    """앞뒤 쉼을 0.03초로, 줄 안의 0.3초 넘는 쉼은 0.22 + 0.35×(남는 길이)로 줄인다. (새 소리, 옛 시각→새 시각 함수)"""
    rms = np.sqrt(np.convolve(w ** 2, np.ones(FR) / FR, 'same'))
    loud = rms > max(0.004, np.abs(w).max() * 10 ** (-38 / 20))
    idx = np.flatnonzero(loud); a, b = max(0, idx[0] - int(0.03 * SR)), min(len(w), idx[-1] + int(0.03 * SR))
    keep = []; i = a; segs = []          # segs: (옛 시작, 옛 끝, 새 시작)
    while i < b:
        if not loud[i]:
            j = i
            while j < b and not loud[j]: j += 1
            L = (j - i) / SR
            if L > 0.3:
                nl = 0.22 + 0.35 * (L - 0.22); half = int(nl * SR / 2)
                keep.append((i, i + half)); keep.append((j - half, j)); i = j; continue
            keep.append((i, j)); i = j
        else:
            j = i
            while j < b and loud[j]: j += 1
            keep.append((i, j)); i = j
    out = []; pos = 0
    for s, e in keep:
        segs.append((s, e, pos)); out.append(w[s:e]); pos += e - s
    y = np.concatenate(out)
    def mapt(t):
        k = int(t * SR)
        for s, e, p in segs:
            if k < s: return p / SR
            if k < e: return (p + k - s) / SR
        return pos / SR
    return y, mapt

voice = [np.zeros(int(LEAD * SR), np.float32)]; t = LEAD; lines = []
for si, sh in enumerate(SHEETS):
    if si: voice.append(np.zeros(int(SHEET_GAP * SR), np.float32)); t += SHEET_GAP
    for li, lid in enumerate(sh):
        if li: voice.append(np.zeros(int(GAP * SR), np.float32)); t += GAP
        r = TK[lid]; k = SPEED[r['who']]; w = faster(r['take'], k)
        y, mapt = squeeze(w); d = len(y) / SR
        words = [{'w': x['w'], 't': round(mapt(x['t'] / k), 2)} for x in r['words']]
        lines.append({'id': lid, 't0': round(t, 3), 't1': round(t + d, 3), 'sub': r['sub'], 'who': r['who'], 'words': words})
        print(f"{lid:5s} x{k} {len(w)/SR:5.2f}s -> {d:5.2f}s  {len([c for c in r['sub'] if '가' <= c <= '힣'])/d:4.1f} 글자/초")
        voice.append(y); t += d
voice.append(np.zeros(int(TAIL * SR), np.float32)); t += TAIL
v = np.concatenate(voice); sf.write('/dev/shm/op/ms_voice.wav', v, SR)
# 입 모양용 목소리 크기(24fps, 0~1): 엔진의 env(t)와 같은 꼴
hop = SR // 24; rms = np.array([np.sqrt(np.mean(v[i:i + hop] ** 2)) for i in range(0, len(v) - hop + 1, hop)])
env = np.clip(rms / (np.percentile(rms[rms > 1e-4], 95) + 1e-9), 0, 1)
json.dump({'dur': round(t, 3), 'lines': lines, 'env': [round(float(x), 3) for x in env]}, open('/dev/shm/op/web/ms_tl.json', 'w'), ensure_ascii=False)
print('dur', round(t, 2))
