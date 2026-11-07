"""Shorts 01 narration (Schedar, Gemini 3.8 Flash TTS). Writes takes/NN.wav, checked with Whisper; RETAKE=3,5 forces new takes.
usage: python3 voice.py [Voice]"""
import json, os, re, sys, time
import numpy as np, requests, soundfile as sf
from scipy.signal import resample_poly
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(ROOT, 'gtts'))
import vx
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); os.makedirs('takes', exist_ok=True)
URL = f'https://aiplatform.googleapis.com/v1beta1/projects/{vx.PROJECT}/locations/global/publishers/google/models/gemini-3.8-flash-tts:generateContent'
VOICE = sys.argv[1] if len(sys.argv) > 1 else 'Schedar'
ASK = '늦은 밤, 조용히 한 사람에게 말을 거는 말투. 낮고 부드럽고 담담하게, 평소보다 조금 느리게. 과장하거나 슬프게 꾸미지 말 것.'
LET = '편지를 소리 내어 읽어 주듯 낮고 따뜻하고 담담하게, 평소보다 조금 느리게. 질문은 끝을 부드럽게 올리고, 울먹이거나 꾸미지 말 것.'
END = '아주 조용하고 따뜻하게, 한 단어씩 천천히. 단정하지만 다정하게.'
LINES = [  # (text, spoken, style)
 ('오늘 하루, 잘했다는 말, 누구에게서 들은 적 있나요?', None, ASK),
 ('3초 드릴게요.', '삼 초 드릴게요.', ASK),
 ('없었죠. 저도 그랬어요.', None, ASK),
 ('그래서, 편지를 써 봤어요.', None, ASK),
 ('혼자 아픈 날, 혼자 약을 사 와서 먹은 적 있나요?', None, LET),
 ('"아쉽지만"을 또 읽고도, 다음 지원서를 열어 본 적 있나요?', '아쉽지만을 또 읽고도, 다음 지원서를 열어 본 적 있나요?', LET),
 ('고맙다는 말 한마디 없이, 당연한 사람이 되어 버린 적 있나요?', None, LET),
 ('귀찮아할까 봐, 써 둔 안부를 지운 적 있나요?', None, LET),
 ('아마 다들, 바라는 건 비슷할 거예요.', None, LET),
 ('누가 한 번만, 알아봐 주는 거요.', None, LET),
 ('사실 이 편지, 처음엔 저한테 쓰던 거였어요.', None, ASK),
 ('아무도 몰라줘도, 없던 일이 되지는 않아요.', None, END),
 ('그래서 이 말은, 제가 먼저 할게요.', None, END),
 ('오늘 하루, 잘했어요.', None, '아주 조용하고 따뜻하게, 한 사람의 눈을 보며 진심으로 건네듯 천천히. 끝을 부드럽게 내려놓듯. 꾸미거나 울먹이지 말 것.'),
]
RETAKE = set(int(x) for x in os.environ.get('RETAKE', '').split(',') if x)


def synth(text, style, path):
    body = {"contents": [{"role": "user", "parts": [{"text": text, "speechMetadata": {"style": style}}]}],
            "generationConfig": {"responseModalities": ["AUDIO"],
                                 "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": VOICE}}, "languageCode": "ko-KR"}}}
    for k in range(7):
        try:
            r = requests.post(URL, headers={'Authorization': 'Bearer ' + vx.token(), 'Content-Type': 'application/json'}, data=json.dumps(body), timeout=300)
            if r.status_code == 200:
                parts, _ = vx.inline_parts(r.json())
                if parts: open(path, 'wb').write(parts[0][1]); return
            else: print('tts', r.status_code, r.text[:150], flush=True)
        except Exception as e: print('err', e, flush=True)
        time.sleep(6 * (k + 1))
    raise RuntimeError('tts failed')


H = lambda s: re.sub(r'[^가-힣]', '', s)
def cer(a, b):
    a, b = H(a), H(b); d = list(range(len(b) + 1))
    for x in a:
        p, d[0] = d[0], d[0] + 1
        for j, y in enumerate(b, 1): p, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, p + (x != y))
    return d[len(b)] / max(1, len(b))


from faster_whisper import WhisperModel
asr = WhisperModel('small', device='cpu', compute_type='int8', cpu_threads=4)
vx.token(); report = json.load(open('takes.json')) if os.path.exists('takes.json') else {}
for i, (txt, sp, st) in enumerate(LINES):
    if str(i) in report and i not in RETAKE: continue      # keep chosen takes (e.g. line 9 picked by hand)
    sp = sp or txt; best = None
    for k in range(4):
        path = f'takes/{i:02d}_{k}.wav'
        if not os.path.exists(path) or (i in RETAKE and k == 0 and not os.path.exists(f'takes/{i:02d}_1.wav')):
            if os.path.exists(path) and i in RETAKE: k += 1; path = f'takes/{i:02d}_{k}.wav'
            synth(sp, st, path)
        w, sr = sf.read(path, dtype='float32')
        seg, _ = asr.transcribe(resample_poly(w, 2, 3).astype(np.float32), language='ko', beam_size=1, condition_on_previous_text=False)
        hyp = ''.join(s.text for s in seg).strip(); c = min(cer(hyp, sp), cer(hyp, txt))
        if best is None or c < best[0]: best = (c, path, hyp)
        if c <= 0.08: break
    report[str(i)] = {'take': best[1], 'cer': round(best[0], 3), 'asr': best[2]}
    print(i, best[1], round(best[0], 3), best[2], flush=True)
json.dump(report, open('takes.json', 'w'), ensure_ascii=False, indent=1)
