"""후렴용 오토튠: WORLD 보코더로 음높이를 멜로디 음표에 고정(로봇 같은 오토튠 느낌) + 더블링.
melody = MIDI 음표 리스트(음절 수만큼). 유성음 구간을 시간 순서대로 음절 수만큼 나눠 음을 배정한다."""
import numpy as np, pyworld as pw, librosa
def midi2hz(m): return 440.0 * 2 ** ((m - 69) / 12)
def sing(w, sr, melody, glide_ms=25, vib_cents=18, vib_hz=5.5):
    x = w.astype(np.float64)
    f0, t = pw.harvest(x, sr, f0_floor=60, f0_ceil=500, frame_period=5.0)
    sp = pw.cheaptrick(x, f0, t, sr); ap = pw.d4c(x, f0, t, sr)
    voiced = f0 > 0; idx = np.where(voiced)[0]
    if len(idx) == 0: return w
    # 유성음 프레임을 음절 수만큼 시간 순서대로 균등 분할
    seg = np.array_split(idx, len(melody))
    tgt = np.zeros_like(f0)
    for notes, s in zip(melody, seg):
        if len(s): tgt[s] = midi2hz(notes)
    # 무성음 구간은 직전 음 유지(곡선 연결용), 글라이드 스무딩
    last = tgt[idx[0]]
    for k in range(len(tgt)):
        if tgt[k] > 0: last = tgt[k]
        else: tgt[k] = last
    n = max(1, int(glide_ms / 5)); tgt = np.convolve(np.log(tgt), np.ones(n) / n, 'same'); tgt = np.exp(tgt)
    vib = 2 ** (vib_cents / 1200 * np.sin(2 * np.pi * vib_hz * t) * np.clip((t - t[0]) / 0.3, 0, 1))
    newf0 = np.where(voiced, tgt * vib, 0.0)
    y = pw.synthesize(newf0, sp, ap, sr, 5.0)
    # 더블링: +8센트, 18ms 늦게, 조금 작게
    y2 = pw.synthesize(np.where(voiced, tgt * 2 ** (8 / 1200), 0.0), sp, ap, sr, 5.0)
    d = int(0.018 * sr); y2 = np.concatenate([np.zeros(d), y2])[:len(y)]
    out = y * 0.8 + y2 * 0.45
    return (out / (np.abs(out).max() + 1e-9) * np.abs(w).max()).astype(np.float32)
# 후렴 멜로디(D단조). 음절: 나 는 절 대 죽 을 수 없 다
D = {'D2': 38, 'A2': 45, 'Bb2': 46, 'C3': 48, 'D3': 50, 'E3': 52, 'F3': 53, 'G3': 55, 'A3': 57, 'Bb3': 58, 'C4': 60, 'D4': 62}
HOOK1 = [D[n] for n in ['A3', 'A3', 'D4', 'C4', 'A3', 'G3', 'F3', 'E3', 'D3']]      # 당당하게, 위에서 내려와 으뜸음
HOOK2 = [D[n] for n in ['D3', 'D3', 'F3', 'E3', 'D3', 'C3', 'Bb2', 'A2', 'A2']]     # 단조, 낮게, 딸림음에서 멈춰 불안하게
