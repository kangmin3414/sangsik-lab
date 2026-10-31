"""Tempo A/B: same voice (Schedar), same facts. A = current style + current writing, B = brisk style + current writing,
C = brisk style + rewritten (short sentences). Output: tempo_A/B/C.wav and chars/sec."""
import sys, os, json, numpy as np, soundfile as sf
sys.path.insert(0, '../../japan018'); os.chdir(os.path.dirname(os.path.abspath(__file__)))
import importlib.util
spec = importlib.util.spec_from_file_location('t', '../../japan018/tts38seg.py')
cwd = os.getcwd(); os.chdir('../../japan018'); t = importlib.util.module_from_spec(spec); spec.loader.exec_module(t); os.chdir(cwd)
OLD = ("1995년 3월. 한 회사가 자기가 만든 휴대폰 15만 대를 운동장에 쌓고, 불을 질렀습니다. 500억 원어치였습니다. "
       "만든 사람들이, 자기 손으로 부수고 태웠죠. 이 불을 지른 사람, 이건희. 그 결정은 40여 년 전, 어두운 영화관에 혼자 앉아 있던 한 소년에게서 시작됩니다.")
OLD_SP = ("천구백구십오 년 삼 월. 한 회사가 자기가 만든 휴대폰 십오만 대를 운동장에 쌓고, 불을 질렀습니다. 오백억 원어치였습니다. "
          "만든 사람들이, 자기 손으로 부수고 태웠죠. 이 불을 지른 사람, 이건희. 그 결정은 사십여 년 전, 어두운 영화관에 혼자 앉아 있던 한 소년에게서 시작됩니다.")
NEW_SP = ("천구백구십오 년 삼 월. 휴대폰 십오만 대가 불탑니다. 오백억 원어치. 불을 붙인 건, 그걸 만든 회사였습니다. "
          "도대체 왜? 답은 사십 년 전, 텅 빈 영화관에 혼자 앉아 있던 한 소년에게 있습니다.")
NEW = ("1995년 3월. 휴대폰 15만 대가 불탑니다. 500억 원어치. 불을 붙인 건, 그걸 만든 회사였습니다. "
       "도대체 왜? 답은 40년 전, 텅 빈 영화관에 혼자 앉아 있던 한 소년에게 있습니다.")
BASE = t.STY['base']
BRISK = ("자연스러운 한국어 이야기꾼 내레이터. 다큐 낭독이 아니라, 친구에게 흥미진진한 실화를 들려주듯 한 호흡에 이어 말한다. "
         "평소보다 조금 빠르고 경쾌하게, 문장 사이 쉼은 아주 짧게, 쉼표에서 멈추지 말고 흘러가듯. 핵심 단어와 숫자만 살짝 힘주고, 질문은 궁금하게 끝을 올린다. "
         "과장된 연기나 기계적인 빠르기는 피하고, 또렷하고 따뜻하게.")
voice = t.STY['voices']['N']
for name, txt, sp, style in (('A', OLD, OLD_SP, BASE), ('B', OLD, OLD_SP, BRISK), ('C', NEW, NEW_SP, BRISK)):
    p = f'tempo_{name}.wav'
    if not os.path.exists(p): t.synth_one(sp, voice, style, os.path.abspath(p))
    w, sr = sf.read(p); w = w if w.ndim == 1 else w.mean(1)
    a = np.abs(w) > 0.01; idx = np.where(a)[0]; d = (idx[-1] - idx[0]) / sr
    print(name, f'{d:5.1f}s', f'{len(txt.replace(" ", ""))} chars', f'{len(txt) / d:.2f} chars/s (with spaces)')
