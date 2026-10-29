"""v3: each story beat is read in ONE request (Chirp3 keeps natural intonation across sentences), pauses come from markup
between sentences (never inside a question), one steady pace per beat (beats differ a little), no pitch shifting."""
import os, sys, hashlib, subprocess, numpy as np, soundfile as sf
from scipy.signal import resample_poly
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gtts import synth
VOICE = 'ko-KR-Chirp3-HD-Schedar'; SR = 44100
D = {
 '1_데카르트': [
  ('단톡방에 올라온 충격 뉴스, 모두가 아는 상식, 그리고 확실하다고 믿는 내 기억. [pause] 이 중 정말 확실한 건, 몇 개나 될까?', 0.93, 1.0),
  ('약 400년 전, 스물세 살의 한 청년이 바로 이 질문 앞에서 길을 잃습니다. [pause] 유럽에서 손꼽히는 학교를 마쳤지만, 남은 건 의심뿐. [pause short] 배울수록, 내가 얼마나 모르는지만 알게 됐다고 그는 돌아봅니다.', 0.92, 0.7),
  ('그래서 책을 덮고, 세상이라는 큰 책을 읽으러 떠납니다. [pause short] 여러 나라를 떠돌고, 군대에도 들어가죠.', 0.94, 0.9),
  ('1619년 겨울, 독일의 한 마을. [pause] 난로가 있는 작은 방에 틀어박혀, 그는 하루 종일 생각에 잠깁니다.', 0.9, 0.0)],
 '2_장자': [
  ('심리학에도 비슷한 실험이 있습니다. [pause short] 초 하나, 성냥, 압정 한 상자. [pause short] 이걸로 초를 벽에 붙여 보라는 문제.', 0.93, 0.9),
  ('정답은, 상자를 비워 벽에 압정으로 박고, 그 위에 초를 세우는 것.', 0.92, 0.7),
  ('그런데 압정이 담긴 상자를 받은 사람보다, 빈 상자를 받은 사람이 정답을 두 배 더 많이 찾았습니다. [pause] 상자를 통으로만 보면, 받침대가 안 보이는 거죠.', 0.92, 0.0)],
 '3_붓다': [
  ('오늘 점심, 무슨 맛이었는지 기억나세요?', 0.92, 0.8),
  ('제로는 모릅니다. [pause short] 숟가락은 입으로, 눈은 영상으로. [pause short] 맛볼 틈이 없었죠.', 0.95, 0.6),
  ('걸을 땐 메시지. [pause short] 누우면 내일 걱정. [pause] 몸은 여기 있는데, 마음은 늘 다른 곳에 가 있습니다.', 0.93, 1.0),
  ('약 2,500년 전, 이 문제를 평생 붙잡고 산 사람이 있었습니다. [pause] 히말라야 아래 작은 나라의 왕자. [pause short] 싯다르타.', 0.91, 0.8),
  ('아버지는 아들 눈에 슬픈 건 하나도 보이지 않게 했습니다. [pause short] 궁 안엔 꽃과 음악, 맛있는 음식뿐.', 0.93, 0.8),
  ('그런데 성 밖으로 나간 날, 왕자는 처음으로 봅니다. [pause] 늙은 사람. [pause short] 병든 사람. [pause short] 그리고, 장례 행렬.', 0.9, 0.8),
  ('마지막으로, 한 수행자. [pause short] 가진 건 아무것도 없는데, 얼굴이 이상할 만큼 평온했죠.', 0.9, 0.0)],
}
os.makedirs('cache7c', exist_ok=True)
def trim(w):
    a = np.abs(w); idx = np.where(a > 0.01 * a.max())[0]; return w[max(0, idx[0] - 1300):idx[-1] + 2600]
POLISH = 'highpass=f=70,bass=g=1:f=160:w=0.7,loudnorm=I=-16:TP=-1.5:LRA=11'
for name, beats in D.items():
    parts = [np.zeros(int(0.4 * SR))]
    for text, rate, gap in beats:
        h = hashlib.md5(f'{VOICE}|{rate}|{text}'.encode()).hexdigest()[:10]
        w, sr = sf.read(synth(text, VOICE, f'cache7c/{h}.wav', rate=rate, markup=True))
        parts += [trim(resample_poly(w, 441, 240)), np.zeros(int(gap * SR))]
    parts.append(np.zeros(int(0.8 * SR)))
    sig = np.concatenate(parts); sig = sig / (np.abs(sig).max() + 1e-9) * 0.8
    raw = f'sample7c_{name}.wav'; sf.write(raw, sig, SR)
    mp3 = f'나레이션샘플_7번_v3_{name}.mp3'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', POLISH, '-ar', '44100', '-c:a', 'libmp3lame', '-b:a', '160k', mp3], check=True)
    print(mp3, '%.1fs' % (len(sig) / SR))
