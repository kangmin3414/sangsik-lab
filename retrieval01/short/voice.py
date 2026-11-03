"""Retrieval Shorts voice (Gemini 3.8 Flash TTS, Schedar), Whisper-checked. usage: python3 voice.py"""
import json, os, re, sys, time
import numpy as np, requests, soundfile as sf
from scipy.signal import resample_poly
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(ROOT, 'gtts')); import vx
os.chdir(HERE); os.makedirs('takes', exist_ok=True)
URL = f'https://aiplatform.googleapis.com/v1beta1/projects/{vx.PROJECT}/locations/global/publishers/google/models/gemini-3.8-flash-tts:generateContent'
HOOK = '자연스러운 한국어 다큐멘터리 내레이터. 궁금증을 불러일으키듯 또렷하고 힘 있게, 보통 속도로.'
NORM = '자연스러운 한국어 내레이터. 이야기하듯 또렷하게, 보통 속도로, 문장 사이에 짧은 쉼.'
TEASE = '자연스러운 한국어 내레이터. 슬쩍 호기심을 건드리듯 또렷하게, 마지막 문장은 짧게 끊어서.'
LINES = [  # (id, written, spoken, style)
 ('l1', '책을 네 번 읽은 반이, 한 번 읽은 반한테 졌다.', None, HOOK),
 ('l2', '미국 대학생 실험이다. 같은 글을, 같은 시간 동안 공부했다.', None, NORM),
 ('l3', '노란 반은 네 번 읽었다. 백지 반은 한 번 읽고, 책을 덮고, 기억나는 걸 적었다.', None, NORM),
 ('l4', '5분 뒤 시험. 이긴 건 노란 반. 83 대 71.', '오 분 뒤 시험. 이긴 건 노란 반. 팔십삼 대 칠십일.', NORM),
 ('l5', '그런데, 일주일 뒤.', None, HOOK),
 ('l6', '노란 반은 40퍼센트. 백지 반은 61퍼센트.', '노란 반은 사십 퍼센트. 백지 반은 육십일 퍼센트.', HOOK),
 ('l7', '읽을수록 술술 읽히니까, 뇌가 "이거 안다"고 착각한 거다.', '읽을수록 술술 읽히니까, 뇌가 이거 안다고 착각한 거다.', NORM),
 ('l8', '그럼 어떻게 공부해야 할까. 책을 덮고, 딱 이것만 하면 된다. 본편에서.', None, TEASE),
]
def synth(text, style, path):
    body = {"contents": [{"role": "user", "parts": [{"text": text, "speechMetadata": {"style": style}}]}],
            "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": "Schedar"}}, "languageCode": "ko-KR"}}}
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
asr = WhisperModel('small', device='cpu', compute_type='int8', cpu_threads=2)
vx.token()
rep = json.load(open('takes.json')) if os.path.exists('takes.json') else {}
for lid, txt, sp, st in LINES:
    if lid in rep: continue
    sp = sp or txt; best = None
    for k in range(3):
        path = f'takes/{lid}_{k}.wav'
        if not os.path.exists(path): synth(sp, st, path)
        w, sr = sf.read(path, dtype='float32')
        seg, _ = asr.transcribe(resample_poly(w, 2, 3).astype(np.float32), language='ko', beam_size=5, condition_on_previous_text=False)
        hyp = ''.join(s.text for s in seg).strip(); c = cer(hyp, sp)
        print(lid, k, round(c, 3), hyp, flush=True)
        if best is None or c < best[0]: best = (c, path, hyp)
        if c < 0.06: break
    rep[lid] = {'take': best[1], 'cer': round(best[0], 3), 'hyp': best[2], 'text': txt}
    json.dump(rep, open('takes.json', 'w'), ensure_ascii=False, indent=1)
print('done')
