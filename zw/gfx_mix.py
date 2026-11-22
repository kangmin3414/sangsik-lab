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
import json, os, subprocess, numpy as np, soundfile as sf
from scipy.signal import fftconvolve, butter, lfilter, sosfilt
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
        self.dur = duration; self.n = int(duration * SR); self.v = np.zeros((self.n, 2)); self.s = np.zeros((self.n, 2)); self.b = np.zeros((self.n, 2)); self.vmono = np.zeros(self.n); self.bgain = np.ones(self.n); self.vclips = []; self.margin_log = []
    def _add(self, buf, w, t):
        i = int(t * SR)
        if i >= self.n or i + len(w) <= 0: return
        if i < 0: w = w[-i:]; i = 0
        w = w[:self.n - i]; buf[i:i + len(w)] += w
    def voice(self, mono, t, x=960, room=None, wet=0.12, g=1.0, width=0.5):
        mono = np.asarray(mono, np.float64) * g; self._add(self.v, pan(mono, x, width), t); i = int(t * SR); w = mono[:max(0, self.n - i)]; self.vmono[i:i + len(w)] += w; self.vclips.append((t, len(mono) / SR))
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
    def amb(self, kind, t0, t1, rel_db=-13.0, fin=1.2, fout=1.6, seed=5):
        """공기 소리를 t0~t1에 깐다. 크기는 그 구간 배경음(이미 깔아 둔 bed)보다 rel_db만큼 작게(배경음이 없으면 -46 dBFS). 배경음과 함께 목소리에 덕킹된다."""
        t0 = max(0.0, t0); t1 = min(self.dur, t1); i0, i1 = int(t0 * SR), int(t1 * SR); seg = self.b[i0:i1]; r = float(np.sqrt(np.mean(seg ** 2))) if len(seg) else 0.0
        g = (r if r > 1e-4 else 10 ** (-33 / 20)) * 10 ** (rel_db / 20); self._add(self.b, fade(air(kind, t1 - t0, seed) * g, fin, fout), t0); return g
    def sfx2(self, st, t, g=1.0):
        """이미 스테레오인 효과음(바람처럼 좌우로 움직이는 것)"""
        self._add(self.s, np.asarray(st, np.float64) * g, t)
    def duck(self, depth=0.6, thresh=0.006, hold=0.6, pre=0.25, smooth=0.25):
        """목소리가 있는 동안(앞 pre초 ~ 뒤 hold초) 배경음을 (1 - depth)배로"""
        def trail(x, k): c = np.concatenate([[0.0], np.cumsum(x)]); i = np.arange(len(x)); return c[i + 1] - c[np.maximum(0, i + 1 - k)]
        vad = (np.abs(self.vmono) > thresh).astype(float); act = (trail(vad, int(hold * SR)) > 0) | (trail(vad[::-1], int(pre * SR))[::-1] > 0)
        k = int(smooth * SR); act = trail(act.astype(float), k) / k; return 1.0 - depth * act
    def margin(self, base, target=11.0, max_cut=5.0, ramp=0.3, band=(300, 4000)):
        """말 여유 지키기: 대사 한 줄마다 말소리 띠(300~4000Hz)에서 '목소리 - 배경음'이 target dB에 못 미치면, 그 줄 동안만 배경음을 모자란 만큼(최대 max_cut dB) 더 낮춘다.
        덕킹은 깊이가 고정이라 음악이 부풀어 오르는 대목에서는 말이 묻힌다(밀린다 편 17번 줄: 여유 6.3dB, 다른 줄은 10~20dB → 음성 인식이 '스님'을 '선생님'으로 들었다).
        base: 이미 정해진 배경음 이득(시간축, bgain * duck). 돌려주는 값: 덧곱할 이득(시간축), 줄별 기록 [(시작 초, 원래 여유 dB, 더 낮춘 dB)]."""
        sos = butter(4, [band[0] / (SR / 2), band[1] / (SR / 2)], 'band', output='sos'); v = sosfilt(sos, self.v.mean(axis=1)); b = sosfilt(sos, (self.b * base[:, None]).mean(axis=1))
        db = lambda x: 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9); cutdb = np.zeros(self.n); log = []
        for t, d in sorted(self.vclips):
            i0, i1 = max(0, int(t * SR)), min(self.n, int((t + d) * SR)); act = np.abs(v[i0:i1]) > 10 ** (-50 / 20)
            if act.sum() < SR * 0.1: continue
            m = db(v[i0:i1][act]) - db(b[i0:i1][act]); cut = float(np.clip(target - m, 0, max_cut)); log.append((round(t, 2), round(float(m), 1), round(cut, 1)))
            if cut > 0.05: a, e = max(0, i0 - int(0.25 * SR)), min(self.n, i1 + int(0.35 * SR)); cutdb[a:e] = np.maximum(cutdb[a:e], cut)
        k = max(2, int(ramp * SR)); c = np.concatenate([[0.0], np.cumsum(cutdb)]); i = np.arange(self.n); sm = (c[np.minimum(self.n, i + k // 2)] - c[np.maximum(0, i - k // 2)]) / k      # 이동 평균으로 모서리를 둥글게(툭 꺼지지 않게)
        return 10 ** (-sm / 20), log
    def render(self, path, sfx_gain=0.6, duck=0.6, target=-14, stems=None, margin=None, max_cut=5.0):
        """margin: 숫자(dB)를 주면 '말 여유 지키기'를 켠다(위 margin). 기록은 self.margin_log."""
        bg = self.bgain * self.duck(duck)
        if margin: mg, self.margin_log = self.margin(bg, margin, max_cut); bg = bg * mg
        mixd = self.v + self.b * bg[:, None] + self.s * sfx_gain
        if stems: np.savez(stems, voice=self.v, bed=self.b, sfx=self.s, bedmix=self.b * bg[:, None], sfxmix=self.s * sfx_gain)      # bedmix · sfxmix: 믹스에 실제로 들어간 크기(말 가림 계산용 → mask_*.py)
        raw = path.replace('.wav', '_raw.wav'); sf.write(raw, mixd, SR)
        af = f'lowpass=f=11000,alimiter=limit=0.32:level=false,loudnorm=I={target}:TP=-1.0:LRA=11'
        r = subprocess.run(['ffmpeg', '-nostdin', '-hide_banner', '-i', raw, '-af', af + ':print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
        m = json.loads(r[r.rindex('{'):r.rindex('}') + 1])
        af2 = af + f":measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,aresample=176400,alimiter=limit=0.84:level=false,aresample={SR}"
        subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-i', raw, '-af', af2, '-ar', str(SR), path], check=True)
        return float(np.abs(mixd).max())

# ---------- 공기 소리(장면에 깔리는 아주 작은 바탕. 직접 합성, 스테레오) ----------
def _lfo(n, f, depth, seed):
    """느린 흔들림 0~1: 낮은 주파수 사인 두 개를 섞는다"""
    r = np.random.default_rng(seed); t = np.arange(n) / SR; a = 0.5 + 0.5 * np.sin(2 * np.pi * f * t + r.random() * 6.28); b = 0.5 + 0.5 * np.sin(2 * np.pi * f * 2.7 * t + r.random() * 6.28)
    return 1 - depth + depth * (0.65 * a + 0.35 * b)
def air(kind, d, seed=5):
    """공기 소리 d초(스테레오, RMS 1로 맞춤). night: 조용한 방(낮은 웅웅 + 아주 옅은 쉬), office: 환기 소리(낮은 바람 + 옅은 전기 웅), yard: 마당 바람(느리게 부풀고 잦아듦 + 나뭇잎)."""
    n = int(d * SR); out = np.zeros((n, 2)); t = np.arange(n) / SR
    for ch in range(2):
        r = np.random.default_rng(seed * 10 + ch); w = r.standard_normal(n)
        if kind == 'night': x = _bp(w, 40, 190) * 1.0 + _bp(r.standard_normal(n), 3000, 7000) * 0.035; x *= _lfo(n, 0.07, 0.25, seed + ch)
        elif kind == 'office': x = _bp(w, 70, 420) * 1.0 + _bp(r.standard_normal(n), 1800, 5200) * 0.05 + np.sin(2 * np.pi * 120 * t + ch) * 0.02; x *= _lfo(n, 0.05, 0.12, seed + ch)
        else: x = _bp(w, 90, 480) * _lfo(n, 0.11, 0.6, seed + ch) + _bp(r.standard_normal(n), 3200, 7000) * float(os.environ.get('GFX_LEAF', 0)) * _lfo(n, 0.19, 0.8, seed + 7 + ch) ** 2
        out[:, ch] = x
    return out / (np.sqrt(np.mean(out ** 2)) + 1e-9)
def gust(d=1.8, to_left=True):
    """휘이잉: 한 줄기 바람이 지나간다(스테레오, 오른쪽 → 왼쪽). 어색한 침묵에 쓴다."""
    n = int(d * SR); t = np.arange(n) / SR; k = t / d; env = np.sin(np.pi * k) ** 1.6; lo = _bp(_rng.standard_normal(n), 250, 900); hi = _bp(_rng.standard_normal(n), 700, 2600)
    x = (lo * (1 - k) + hi * k * 0.8) * env * (0.8 + 0.2 * np.sin(2 * np.pi * 5.5 * t)); p = (k if to_left else 1 - k) * np.pi / 2
    return np.stack([x * np.sin(p) * 1.2, x * np.cos(p) * 1.2], axis=1) * 0.5
def creak(d=0.3, f0=190):
    """끼익: 나무가 눌렸다 풀리는 소리(수레에서 사람이 내릴 때)"""
    t = _t(d); f = f0 * (1 - 0.22 * t / d) + 9 * np.sin(2 * np.pi * 31 * t); saw = 2 * ((np.cumsum(f) / SR) % 1) - 1
    return _bp(saw, 420, 2600) * (0.55 + 0.45 * np.sin(2 * np.pi * 37 * t)) * np.sin(np.pi * t / d) ** 0.8 * 0.4
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
