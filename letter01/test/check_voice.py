import re, numpy as np
from scipy.signal import resample_poly
from faster_whisper import WhisperModel
T = ['오늘 하루, 잘했다는 말을 누구한테 들었어요?','삼초 드릴게요.','못 떠올리셨죠. 저도 오늘은 못 들었어요.','제가 온 걸 알아준 건, 현관 앞 센서등 하나였어요.',
     '그것도 가만히 서 있으니까, 꺼지더라고요.','당신에게.','오늘 당신이 한 일들은, 아마 아무도 적어 두지 않았을 거예요.','알람을 세 번 끄고도, 결국 일어난 것.',
     '확인 부탁드립니다에, 답장을 썼다 지웠다 하다가, 숨 한 번 고르고 보낸 것.','회의에서 하고 싶은 말을 삼키고, 책상 밑에서 주먹만 쥐었다 푼 것.']
H = lambda s: re.sub(r'[^가-힣]', '', s)
def cer(a, b):
    a, b = H(a), H(b); d = list(range(len(b) + 1))
    for x in a:
        p, d[0] = d[0], d[0] + 1
        for j, y in enumerate(b, 1): p, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, p + (x != y))
    return d[len(b)] / max(1, len(b))
m = WhisperModel('small', device='cpu', compute_type='int8', cpu_threads=4)
import sys
for v in sys.argv[1:] or ['Puck', 'Enceladus', 'Algieba']:
    bad = []
    for i, t in enumerate(T):
        w = np.frombuffer(open(f'voice/takes/{v}_{i:02d}.pcm', 'rb').read(), dtype='<i2').astype(np.float32) / 32768
        seg, _ = m.transcribe(resample_poly(w, 2, 3).astype(np.float32), language='ko', beam_size=1, condition_on_previous_text=False)
        h = ''.join(x.text for x in seg).strip(); c = cer(h, t)
        if c > 0.12 and not (i == 1 and '3초' in h): bad.append((i, round(c, 2), h))
    print(v, 'flags:', bad, flush=True)
