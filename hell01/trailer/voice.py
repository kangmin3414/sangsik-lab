"""Hell trailer voices (Gemini 3.8 Flash TTS), Whisper-checked. usage: python3 voice.py   (RETAKE=r3,z2 forces new takes)"""
import json, os, re, sys, time
import numpy as np, requests, soundfile as sf
from scipy.signal import resample_poly
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(ROOT, 'gtts'))
import vx
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); os.makedirs('takes', exist_ok=True)
URL = f'https://aiplatform.googleapis.com/v1beta1/projects/{vx.PROJECT}/locations/global/publishers/google/models/gemini-3.8-flash-tts:generateContent'
VOICE = {'Z': 'Schedar', 'R': 'Charon', 'K': 'Algenib', 'Y': 'Rasalgethi'}
RF = '저승사자. 빠르고 사무적인 말투, 공무원처럼 담담하고 정중하게, 서두르는 느낌으로 빠르게.'
RQ = '저승사자. 낮고 조용하게, 잠시 머뭇거리다가 천천히. 더 이상 서두르지 않는다.'
ZP = '제로. 삼십 대 남자, 놀라고 당황해서 다급하게, 숨이 조금 찬 듯 빠르게.'
KG = '저승의 대왕. 아주 낮고 근엄하게, 한 단어를 짧고 무겁게 내뱉듯.'
YM = '염라대왕. 아주 깊고 느리고 위엄 있게, 낮게 울리듯.'
LINES = [  # (id, voice, written, spoken, style)
 ('zi', 'Z', '죽으면 49일 동안 저승 재판을 받는대요. 제가 먼저 받아 봤습니다.', '죽으면 사십구 일 동안 저승 재판을 받는대요. 제가 먼저 받아 봤습니다.', '제로. 낮고 긴장감 있게, 무서운 이야기를 시작하듯 또렷하게. 보통보다 조금 빠르게, 문장 사이 쉼은 아주 짧게.'),
 ('r0', 'R', '제로 씨? 내리시죠. 시간 없습니다.', None, RF),
 ('z0', 'Z', '네? 여, 여기가 어디—', '네? 여, 여기가 어디', ZP),
 ('r1', 'R', '49일 안에, 일곱 분의 대왕을 다 뵈셔야 합니다.', '사십구 일 안에, 일곱 분의 대왕을 다 뵈셔야 합니다.', RF),
 ('z1', 'Z', '49일이요?', '사십구 일이요?', ZP),
 ('r2', 'R', '49재, 들어 보셨죠? 그게 이 일정입니다.', '사십구재, 들어 보셨죠? 그게 이 일정입니다.', RF),
 ('k1', 'K', '살생.', None, KG),
 ('r3', 'R', '모기, 312마리.', '모기, 삼백열두 마리.', RF),
 ('z2', 'Z', '정당방위예요!', None, ZP),
 ('k2', 'K', '도둑질.', None, KG),
 ('r4', 'R', '회사 볼펜, 17자루.', '회사 볼펜, 열일곱 자루.', RF),
 ('z3', 'Z', '그건 제 가방이 알아서—', '그건 제 가방이 알아서', ZP),
 ('k3', 'K', '배신.', None, KG),
 ('r5', 'R', '다이어트 결심, 142번.', '다이어트 결심, 백사십두 번.', RF),
 ('z4', 'Z', '그건 제가 저를—', '그건 제가 저를', ZP),
 ('k4', 'K', '거짓말.', None, KG),
 ('r6', 'R', '…"괜찮아요." 41,200번.', '괜찮아요. 사만 천이백 번.', RQ),
 ('r7', 'R', '마지막 분입니다.', None, RQ),
 ('y1', 'Y', '비춰 보아라.', None, YM),
 ('r8', 'R', '살아온 모든 게, 그대로 비치는 거울입니다.', None, RQ),
 ('z5', 'Z', '잠깐만요, 아직 마음의 준비가—', '잠깐만요, 아직 마음의 준비가', ZP),
]
RETAKE = set(x for x in os.environ.get('RETAKE', '').split(',') if x)


def synth(text, voice, style, path):
    body = {"contents": [{"role": "user", "parts": [{"text": text, "speechMetadata": {"style": style}}]}],
            "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}, "languageCode": "ko-KR"}}}
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
vx.token()
report = json.load(open('takes.json')) if os.path.exists('takes.json') else {}
for lid, v, txt, sp, st in LINES:
    if lid in report and lid not in RETAKE: continue
    sp = sp or txt; best = None
    start = len([f for f in os.listdir('takes') if f.startswith(lid + '_')])
    for k in range(start, start + 4):
        path = f'takes/{lid}_{k}.wav'
        if not os.path.exists(path): synth(sp, VOICE[v], st, path)
        w, sr = sf.read(path, dtype='float32')
        seg, _ = asr.transcribe(resample_poly(w, 2, 3).astype(np.float32), language='ko', beam_size=5, condition_on_previous_text=False)
        hyp = ''.join(s.text for s in seg).strip(); c = cer(hyp, sp)
        if best is None or c < best[0]: best = (c, path, hyp)
        if c <= 0.1: break
    report[lid] = {'take': best[1], 'cer': round(best[0], 3), 'asr': best[2]}
    print(lid, best[1], round(best[0], 3), best[2], flush=True)
json.dump(report, open('takes.json', 'w'), ensure_ascii=False, indent=1)
