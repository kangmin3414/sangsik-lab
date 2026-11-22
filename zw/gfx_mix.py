"""제로의 세계 — 몰입 층의 소리 쪽(zw/gfx.js와 짝). 스테레오 믹스 도우미.
운영자(2026-11-22): "몰입감 있게". 지금까지의 믹스는 모노였다. 여기서는
  - 화면 위치 x(0~1920)에 따라 소리를 좌우로 놓고(등전력 팬, 폭 제한),
  - 장면의 공간(방·회의실·마당)에 맞는 얕은 울림을 붙이고,
  - 목소리가 있을 때 배경음을 낮추고,
  - 마지막에 11kHz 저역통과 → 2패스 loudnorm(-14 LUFS) → 4배 오버샘플 리미터로 맞춘다(AAC로 바꿔도 넘치지 않게).
쓰는 법:
    import gfx_mix as GM
    M = GM.Mix(duration)
    M.voice(wave, t, x=960, room='yard', wet=0.14)      # 대사 한 줄(44.1kHz 모노)
    M.sfx(wave, t, g=0.5, x=700, room='yard')            # 효과음
    M.bed('night.mp3', t0, t1, g=0.3, off=0.0)           # 배경음(스테레오 그대로)
    M.render('/dev/shm/ep/mix.wav')                      # → 스테레오 wav
남의 소리는 쓰지 않는다. 울림은 직접 만든 충격 응답(감쇠하는 잡음 + 이른 반사 몇 개)이다."""
import json, subprocess, numpy as np, soundfile as sf
from scipy.signal import fftconvolve, butter, lfilter
SR = 44100

def pan(mono, x=960, width=0.6):
    """모노 → 스테레오. x는 화면 좌표(0 왼쪽 ~ 1920 오른쪽). width 1이면 끝까지 벌어진다(대사는 0.5 안팎이 듣기 편하다)."""
    p = float(np.clip((x - 960) / 960, -1, 1)) * width; a = (p + 1) * np.pi / 4
    return np.stack([mono * np.cos(a) * 1.4142, mono * np.sin(a) * 1.4142], axis=1)

_IR = {}
def ir(kind):
    """공간의 충격 응답(스테레오). room: 작은 방 · hall: 회의실 · yard: 기둥이 선 마당(짧은 메아리 + 열린 꼬리)"""
    if kind in _IR: return _IR[kind]
    P = {'room': (0.16, 0.008, [(0.011, 0.5), (0.019, 0.35)]), 'hall': (0.26, 0.012, [(0.017, 0.5), (0.031, 0.35), (0.047, 0.2)]), 'yard': (0.38, 0.02, [(0.034, 0.55), (0.071, 0.34), (0.113, 0.2)])}[kind]
    tau, pre, taps = P; n = int(tau * 4.2 * SR); rng = np.random.default_rng({'room': 11, 'hall': 12, 'yard': 13}[kind]); t = np.arange(n) / SR; out = np.zeros((n, 2))
    for ch in range(2):
        tail = rng.standard_normal(n) * np.exp(-t / tau); b, a = butter(2, [300 / (SR / 2), 5200 / (SR / 2)], 'band'); tail = lfilter(b, a, tail); tail[:int(pre * SR)] = 0
        for d, g in taps: tail[int((d + ch * 0.0023) * SR)] += g * 6
        out[:, ch] = tail / (np.sqrt(np.sum(tail ** 2)) + 1e-9)
    _IR[kind] = out; return out
def reverb(mono, kind='room'):
    """울림만(젖은 소리) 스테레오로 돌려준다. 길이는 원음 + 꼬리."""
    h = ir(kind); return np.stack([fftconvolve(mono, h[:, 0]), fftconvolve(mono, h[:, 1])], axis=1)

def load(fn, start=0.0, dur=None, loop_from=8.0):
    """소리 파일 → 44.1kHz 스테레오 (n, 2). dur보다 짧으면 loop_from초부터 이어 붙인다."""
    raw = subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-i', fn, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    a = np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)[int(start * SR):]
    if dur is not None:
        n = int(dur * SR)
        while len(a) < n: a = np.concatenate([a, a[int(loop_from * SR):]])
        a = a[:n]
    return a
def fade(a, fin=0.0, fout=0.0):
    a = a.copy(); k = min(len(a), int(fin * SR))
    if k > 0: a[:k] *= (np.linspace(0, 1, k) ** 1.5)[:, None] if a.ndim == 2 else np.linspace(0, 1, k) ** 1.5
    k = min(len(a), int(fout * SR))
    if k > 0: a[-k:] *= (np.linspace(1, 0, k) ** 1.5)[:, None] if a.ndim == 2 else np.linspace(1, 0, k) ** 1.5
    return a

class Mix:
    def __init__(self, duration):
        self.dur = duration; self.n = int(duration * SR); self.v = np.zeros((self.n, 2)); self.s = np.zeros((self.n, 2)); self.b = np.zeros((self.n, 2)); self.vmono = np.zeros(self.n); self.bgain = np.ones(self.n)
    def _add(self, buf, w, t):
        i = int(t * SR)
        if i >= self.n or i + len(w) <= 0: return
        if i < 0: w = w[-i:]; i = 0
        w = w[:self.n - i]; buf[i:i + len(w)] += w
    def voice(self, mono, t, x=960, room=None, wet=0.12, g=1.0, width=0.5):
        mono = np.asarray(mono, np.float64) * g; self._add(self.v, pan(mono, x, width), t); i = int(t * SR); w = mono[:max(0, self.n - i)]; self.vmono[i:i + len(w)] += w
        if room: self._add(self.v, reverb(mono, room) * wet, t)
    def sfx(self, w, t, g=1.0, x=960, room=None, wet=0.18, width=0.85):
        w = np.asarray(w, np.float64) * g; self._add(self.s, pan(w, x, width), t)
        if room: self._add(self.s, reverb(w, room) * wet, t)
    def bed(self, fn, t0, t1, g=0.3, fin=1.5, fout=2.5, off=0.0):
        t0 = max(0.0, t0); t1 = min(self.dur, t1); self._add(self.b, fade(load(fn, off, t1 - t0) * g, fin, fout), t0)
    def bed_gain(self, t0, t1, g, ramp=1.0):
        """t0~t1 사이 배경음을 g배로(양 끝 ramp초에 걸쳐 바뀜)"""
        i0, i1, r = int(t0 * SR), int(min(self.dur, t1) * SR), int(ramp * SR); k = np.ones(self.n); k[i0:i1] = g
        a = max(0, i0 - r); k[a:i0] = np.linspace(1, g, i0 - a); e = min(self.n, i1 + r); k[i1:e] = np.linspace(g, 1, e - i1); self.bgain *= k
    def duck(self, depth=0.6, thresh=0.006, hold=0.6, pre=0.25, smooth=0.25):
        """목소리가 있는 동안(앞 pre초 ~ 뒤 hold초) 배경음을 (1 - depth)배로"""
        def trail(x, k): c = np.concatenate([[0.0], np.cumsum(x)]); i = np.arange(len(x)); return c[i + 1] - c[np.maximum(0, i + 1 - k)]
        vad = (np.abs(self.vmono) > thresh).astype(float); act = (trail(vad, int(hold * SR)) > 0) | (trail(vad[::-1], int(pre * SR))[::-1] > 0)
        k = int(smooth * SR); act = trail(act.astype(float), k) / k; return 1.0 - depth * act
    def render(self, path, sfx_gain=0.6, duck=0.6, target=-14, stems=None):
        mixd = self.v + self.b * (self.bgain * self.duck(duck))[:, None] + self.s * sfx_gain
        if stems: np.savez(stems, voice=self.v, bed=self.b, sfx=self.s)
        raw = path.replace('.wav', '_raw.wav'); sf.write(raw, mixd, SR)
        af = f'lowpass=f=11000,alimiter=limit=0.32:level=false,loudnorm=I={target}:TP=-1.0:LRA=11'
        r = subprocess.run(['ffmpeg', '-nostdin', '-hide_banner', '-i', raw, '-af', af + ':print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
        m = json.loads(r[r.rindex('{'):r.rindex('}') + 1])
        af2 = af + f":measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,aresample=176400,alimiter=limit=0.84:level=false,aresample={SR}"
        subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-i', raw, '-af', af2, '-ar', str(SR), path], check=True)
        return float(np.abs(mixd).max())

# ---------- 이 층에서 새로 만든 효과음(직접 합성) ----------
_rng = np.random.default_rng(7)
def _t(d): return np.arange(int(d * SR)) / SR
def _bp(x, lo, hi): b, a = butter(2, [lo / (SR / 2), min(0.99, hi / (SR / 2))], 'band'); return lfilter(b, a, x)
def printer(d=0.45):
    """찌익: 작은 라벨 프린터(톱니 모터 + 종이 스침). 끝으로 갈수록 음이 살짝 오른다."""
    t = _t(d); f = 150 + 70 * t / d; saw = 2 * ((np.cumsum(f) / SR) % 1) - 1; gate = (np.sin(2 * np.pi * 34 * t) > -0.2).astype(float)
    return (_bp(saw, 300, 3200) * 0.5 * gate + _bp(_rng.standard_normal(len(t)), 2500, 8000) * 0.16) * np.minimum(1, t / 0.02) * np.minimum(1, (d - t) / 0.04) * 0.5
def slap():
    """탁: 스티커가 붙는 소리(짧은 손뼉 + 낮은 쿵)"""
    n = int(0.09 * SR); t = np.arange(n) / SR; clap = _bp(_rng.standard_normal(n), 900, 6000) * np.exp(-t / 0.012); thud = np.sin(2 * np.pi * 95 * t * (1 - t * 2.5)) * np.exp(-t / 0.035)
    return clap * 0.75 + thud * 0.7
def clack(f=520):
    """철컥: 나무 부품이 맞물리는 소리(나무 두드림 + 짧은 금속음)"""
    n = int(0.16 * SR); t = np.arange(n) / SR; wood = (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.76 * t)) * np.exp(-t / 0.03); click = _bp(_rng.standard_normal(n), 1800, 7000) * np.exp(-t / 0.006)
    return wood * 0.5 + click * 0.5
def chirp(f0=3200, f1=4300, d=0.11):
    """새 한 번(멀리서)"""
    t = _t(d); f = f0 + (f1 - f0) * np.sin(np.pi * t / d); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) ** 2 * 0.25
def rumble(d, lo=40, hi=260):
    """굴러오는 바퀴·무거운 것(저역 잡음)"""
    n = int(d * SR); return _bp(_rng.standard_normal(n), lo, hi) * np.sin(np.linspace(0, np.pi, n)) ** 0.7 * 0.6
def flutter(d=0.9):
    """팔랑팔랑: 종이가 떨어지며 내는 소리"""
    t = _t(d); return _bp(_rng.standard_normal(len(t)), 1800, 7000) * (0.5 + 0.5 * np.sin(2 * np.pi * 7 * t)) ** 2 * np.exp(-t / (d * 0.6)) * 0.3
