"""건강 편 11~12번 시험 녹음(Opuscar 화풍 시험용). 테이크는 /dev/shm/op/takes, 고른 것은 takes_op.json."""
import json, os, re, sys, time
import numpy as np, requests, soundfile as sf
from scipy.signal import resample_poly
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = '/dev/shm/op/takes'
URL = f'https://aiplatform.googleapis.com/v1beta1/projects/{vx.PROJECT}/locations/global/publishers/google/models/gemini-3.8-flash-tts:generateContent'
LINES = [  # id, 목소리, 자막, 읽을 문장, 연기 지시
 ('n11', 'Schedar', '2019년, 평균 일흔두 살 여성 만 육천여 명의 걸음을 4년 남짓 지켜봤습니다. 하루 4,400보쯤 걷는 사람은 2,700보쯤 걷는 사람보다 사망률이 41퍼센트 낮았습니다.',
  '이천십구 년, 평균 일흔두 살 여성 만 육천여 명의 걸음을, 사 년 남짓 지켜봤습니다. 하루 사천사백 보쯤 걷는 사람은, 이천칠백 보쯤 걷는 사람보다 사망률이 사십일 퍼센트 낮았습니다.',
  '차분하고 따뜻한 다큐멘터리 내레이션. 숫자는 또박또박, 서두르지 않게.'),
 ('c12', 'Laomedeia', '7,500보쯤부터는… 더 안 낮아졌대.', '칠천오백 보쯤부터는... 더 안 낮아졌대.',
  '엄지만 한 꼬마 캐릭터. 또박또박한 아이 같은 말투. 자기 기준표를 읽다가 김이 샌 듯 살짝 시무룩하게.'),
 ('z12', 'Puck', '나 오늘 9,400인데.', '나 오늘 구천사백인데.', '서른 살 직장인. 피곤한 밤, 손목을 보며 혼잣말처럼 피식.'),
]
def synth(text, voice, style, path):
    body = {"contents": [{"role": "user", "parts": [{"text": text, "speechMetadata": {"style": style}}]}],
            "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}, "languageCode": "ko-KR"}}}
    for k in range(6):
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
asr = WhisperModel('small', device='cpu', compute_type='int8', cpu_threads=2)
rep = {}
for lid, voice, sub, sp, style in LINES:
    best = None
    for k in range(3):
        path = f'{OUT}/{lid}_{k}.wav'; synth(sp, voice, style, path)
        w, sr = sf.read(path, dtype='float32')
        seg, _ = asr.transcribe(resample_poly(w, 2, 3).astype(np.float32), language='ko', beam_size=5, word_timestamps=True, condition_on_previous_text=False)
        seg = list(seg); hyp = ''.join(s.text for s in seg).strip(); c = cer(hyp, sp)
        words = [{'w': x.word.strip(), 't': round(x.start, 2)} for s in seg for x in s.words]
        print(lid, k, round(c, 3), hyp[:80], flush=True)
        if best is None or c < best[0]: best = (c, path, hyp, words, len(w) / sr)
        if c < 0.06: break
    rep[lid] = {'take': best[1], 'cer': round(best[0], 3), 'hyp': best[2], 'words': best[3], 'dur': round(best[4], 2), 'sub': sub, 'voice': voice}
json.dump(rep, open(os.path.join(HERE, 'takes_op.json'), 'w'), ensure_ascii=False, indent=1)
print('done')
