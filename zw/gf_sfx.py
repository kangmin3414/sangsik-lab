"""제로의 세계 — 게임 감각 효과음(직접 합성, 남의 소리 없음). zw/gf.js의 화면 반응과 같은 시각에 넣는다.
쓰는 법:  import gf_sfx as S;  put(t, S.pop());  put(t, S.coin(), 0.6)
모두 44.1kHz 모노 numpy 배열. 부드러운 삼각파·사인파 위주(귀 아프지 않게), 길이는 대부분 0.1~0.6초."""
import numpy as np
from scipy.signal import butter, lfilter
SR = 44100
_rng = np.random.default_rng(5)
N = {'C4': 261.6, 'D4': 293.7, 'E4': 329.6, 'F4': 349.2, 'G4': 392.0, 'A4': 440.0, 'B4': 493.9, 'C5': 523.3, 'D5': 587.3, 'E5': 659.3, 'F5': 698.5, 'G5': 784.0, 'A5': 880.0, 'B5': 987.8, 'C6': 1046.5, 'D6': 1174.7, 'E6': 1318.5, 'G6': 1568.0, 'C7': 2093.0}
def _t(d): return np.arange(int(d * SR)) / SR
def _env(n, a=0.004, d=0.15):
    t = np.arange(n) / SR; return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
def _lp(x, f): b, a = butter(2, min(0.99, f / (SR / 2))); return lfilter(b, a, x)
def _bp(x, lo, hi): b, a = butter(2, [lo / (SR / 2), min(0.99, hi / (SR / 2))], 'band'); return lfilter(b, a, x)
def _noise(d): return _rng.standard_normal(int(d * SR))
def _sweep(f0, f1, d, shape='sin', curve=1.0):
    t = _t(d); f = f0 + (f1 - f0) * (t / d) ** curve; ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) if shape == 'sin' else 2 / np.pi * np.arcsin(np.sin(ph))
def mix(*ws):
    n = max(len(w) for w in ws); return sum(np.pad(w, (0, n - len(w))) for w in ws)
def seq(parts, gap=0.0):
    """[(지연 초, 배열), …]을 한 배열로"""
    n = max(int(d * SR) + len(w) for d, w in parts); out = np.zeros(n)
    for d, w in parts: i = int(d * SR); out[i:i + len(w)] += w
    return out
def note(f, d=0.18, dec=0.12, tone='tri'):
    """건반 한 음(삼각파 + 약한 배음)"""
    t = _t(d); w = (2 / np.pi * np.arcsin(np.sin(2 * np.pi * f * t)) if tone == 'tri' else np.sin(2 * np.pi * f * t)) + 0.25 * np.sin(2 * np.pi * 2 * f * t)
    return _lp(w, 6000) * _env(len(t), 0.004, dec) * 0.5
def arp(names, step=0.085, d=0.2, dec=0.13, last=None):
    parts = [(i * step, note(N[n], d if i < len(names) - 1 or last is None else last, dec if i < len(names) - 1 or last is None else last * 0.6)) for i, n in enumerate(names)]
    return seq(parts)
# ---------- 화면 반응 ----------
def pop(f=720): return _sweep(f, f * 1.7, 0.07) * _env(int(0.07 * SR), 0.002, 0.03) * 0.8          # 톡(꼬리표·카드가 튀어나옴)
def blip(f=880): return note(f, 0.07, 0.035) * 0.9                                                   # 삑(작은 표시)
def tick(f=1500): return np.sin(2 * np.pi * f * _t(0.03)) * _env(int(0.03 * SR), 0.001, 0.008) * 0.5  # 틱(글자·눈금)
def boing(f0=300, f1=760, d=0.26): return _sweep(f0, f1, d, 'tri', 0.7) * _env(int(d * SR), 0.006, 0.16) * 0.6   # 깡충
def land(): return mix(np.sin(2 * np.pi * 90 * _t(0.12) * (1 - _t(0.12))) * _env(int(0.12 * SR), 0.002, 0.05), _lp(_noise(0.06), 900) * _env(int(0.06 * SR), 0.001, 0.02) * 0.5) * 0.7  # 착지
def step(): return _bp(_noise(0.045), 220, 1300) * _env(int(0.045 * SR), 0.001, 0.014) * 0.9          # 발소리
def coin(): return seq([(0, note(N['B5'], 0.09, 0.05)), (0.075, note(N['E6'], 0.34, 0.16))]) * 0.8      # 띠링(얻음·맞음)
def ding(): return mix(note(N['G6'], 0.5, 0.22, 'sin'), note(N['C7'], 0.4, 0.16, 'sin') * 0.5) * 0.7   # 딩(전구)
def sparkle(n=6, d=0.5):
    out = np.zeros(int((d + 0.3) * SR))
    for i in range(n): w = note(1800 + _rng.random() * 2400, 0.25, 0.07, 'sin') * 0.35; j = int(i * d / n * SR); out[j:j + len(w)] += w
    return out
def whoosh(d=0.3, lo=500, hi=4500): n = _noise(d); return _bp(n, lo, hi) * np.sin(np.linspace(0, np.pi, len(n))) ** 2 * 0.5
def flip(): return mix(whoosh(0.22, 800, 5000) * 0.8, np.pad(pop(980), (int(0.16 * SR), 0)) * 0.7)   # 팔랑(뒤집기)
def stamp(): return mix(np.sin(2 * np.pi * 70 * _t(0.25) * (1 - _t(0.25) * 1.5)) * _env(int(0.25 * SR), 0.001, 0.07) * 1.1, _lp(_noise(0.08), 1400) * _env(int(0.08 * SR), 0.0005, 0.02) * 0.8, np.pad(tick(700), (int(0.02 * SR), 0)))  # 쾅(도장)
def strike(d=0.28): n = _noise(d); return _bp(n, 900, 5000) * np.linspace(1, 0.2, len(n)) * 0.5      # 쓱(줄 긋기)
def gauge(v0, v1, n=None):
    """게이지가 v0→v1(0~1)로 움직일 때의 또르르. 오르면 음이 오르고 내리면 내린다"""
    n = n or max(3, int(abs(v1 - v0) * 12)); fs = np.linspace(500 + 900 * v0, 500 + 900 * v1, n)
    return seq([(i * 0.045, note(f, 0.06, 0.03) * 0.7) for i, f in enumerate(fs)])
def hurt(): return seq([(0, note(N['A4'], 0.12, 0.07)), (0.1, note(N['E4'], 0.26, 0.13))]) * 0.8        # 뚜둥(아야)
def bang(): return seq([(0, blip(1320)), (0.07, blip(1760))]) * 0.9                                   # !!(놀람)
def question(): return _sweep(520, 840, 0.22, 'tri', 2.2) * _env(int(0.22 * SR), 0.01, 0.2) * 0.45     # 응?(끝이 올라감)
def heart(): return seq([(0, note(N['E5'], 0.12, 0.08, 'sin')), (0.1, note(N['A5'], 0.3, 0.15, 'sin'))]) * 0.7
def ghost(d=0.9): t = _t(d); f = 420 - 110 * t / d + 22 * np.sin(2 * np.pi * 6 * t); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) ** 1.2 * 0.35   # 우우(귀엽게)
def iris_close(d=0.26): return _sweep(900, 260, d, 'tri', 0.8) * np.sin(np.linspace(0, np.pi, int(d * SR))) * 0.35
def iris_open(d=0.3): return _sweep(260, 980, d, 'tri', 1.2) * np.sin(np.linspace(0, np.pi, int(d * SR))) * 0.35
def bands(): return mix(whoosh(0.5, 400, 3500), np.pad(sparkle(4, 0.25), (int(0.2 * SR), 0)) * 0.6)      # 색 띠 전환
def letters(n, step=0.04, f0=700): return seq([(i * step, tick(f0 + i * 45)) for i in range(n)])        # 글자가 톡톡
# ---------- 짧은 가락(우리 가락) ----------
def item(): return mix(arp(['G4', 'C5', 'E5', 'G5', 'C6'], 0.08, 0.2, 0.12, last=0.6), np.pad(sparkle(5, 0.35), (int(0.4 * SR), 0)) * 0.7)   # 얻었다!
def equip(): return seq([(0, tick(600)), (0.03, coin())])                                             # 찰칵 + 띠링(장착)
def stage(): return arp(['E5', 'G5', 'C6', 'E6'], 0.1, 0.22, 0.14, last=0.5)                           # 단계 시작
def clear(): return mix(arp(['C5', 'E5', 'G5', 'C6', 'E6', 'G6'], 0.075, 0.2, 0.12, last=0.8), np.pad(sparkle(7, 0.5), (int(0.45 * SR), 0)) * 0.6)  # 해냈다!
def morning(): return arp(['E5', 'G5', 'B5', 'E6'], 0.13, 0.5, 0.3)                                    # 아침
def low(f=196, d=1.4): return note(f, d, 0.5, 'sin') * 0.9                                             # 낮게 깔리는 한 음
# ---------- 사물 ----------
def rustle(d=0.25): n = _noise(d); return _bp(n, 2500, 9000) * (_rng.random(len(n)) > 0.6) * np.sin(np.linspace(0, np.pi, len(n))) * 0.6
def scribble(d): n = _noise(d); return _bp(n, 1800, 6000) * (0.55 + 0.45 * np.sin(np.linspace(0, d * 38, len(n)))) * 0.22
def slosh(d=0.3): n = _noise(d); return _lp(_bp(n, 200, 1600), 1200) * np.sin(np.linspace(0, np.pi, len(n))) ** 1.5 * 0.7
def pour(d=1.0): t = _t(d); f = 380 + 260 * t / d; return (_bp(_noise(d), 400, 2400)[:len(t)] * 0.5 + np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.08) * np.sin(np.pi * t / d) ** 0.8 * 0.6
def rain(d):
    n = int(d * SR); x = _bp(_noise(d), 1500, 9000)[:n] * 0.10 + _lp(_noise(d), 400)[:n] * 0.05
    for _ in range(int(d * 22)):
        i = int(_rng.random() * n); w = _bp(_noise(0.012), 2000, 8000) * _env(int(0.012 * SR), 0.0005, 0.004) * 0.6; x[i:i + len(w)] += w[:n - i]
    k = int(0.5 * SR); x[:k] *= np.linspace(0, 1, k); x[-k:] *= np.linspace(1, 0, k); return x
def whistle(d=0.28): t = _t(d); return np.sin(2 * np.pi * (2600 + 60 * np.sin(2 * np.pi * 28 * t)) * t) * _env(len(t), 0.005, 0.25) * 0.3
def hum(d): t = _t(d); return (np.sin(2 * np.pi * 120 * t) * 0.5 + np.sin(2 * np.pi * 240 * t) * 0.25) * 0.06 * np.minimum(1, t / 0.2) * np.minimum(1, (d - t) / 0.2)
def breath(d=0.6): n = _noise(d); return _bp(n, 400, 2500) * np.sin(np.linspace(0, np.pi, len(n))) ** 2 * 0.25
