"""양자 불멸 샘플(A+B) 목소리: Gemini 3.8 Flash TTS(Schedar) + Whisper 검사. usage: python3 voice.py  (RETAKE=3,7)"""
import json, os, re, sys, time
import numpy as np, requests, soundfile as sf
from scipy.signal import resample_poly
ROOT = '/home/claude/sangsik-lab'
sys.path.insert(0, os.path.join(ROOT, 'gtts')); import vx
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); os.makedirs('takes', exist_ok=True)
URL = f'https://aiplatform.googleapis.com/v1beta1/projects/{vx.PROJECT}/locations/global/publishers/google/models/gemini-3.8-flash-tts:generateContent'
STYLE = ('제로의 1인칭 독백. 삼십 대 남자, 낮고 담담하게, 일기를 소리 내어 읽듯 감정을 누르고. '
         '쉼표에서 짧게 끊고, 문장 끝은 내려서 단정하게. 연기하듯 과장하지 말 것. 보통 속도.')
SPOKEN = {'1957년': '천구백오십칠 년', '1987년': '천구백팔십칠 년'}
SECS = ('A.', 'B.')
tl = json.load(open('../timeline.json'))
LINES = [(i, e['text']) for i, e in enumerate(tl['events']) if e['type'] == 'line' and e['sec'].startswith(SECS)]
RETAKE = set(int(x) for x in os.environ.get('RETAKE', '').split(',') if x)

def spoken(t):
    for k, v in SPOKEN.items(): t = t.replace(k, v)
    return t.replace('…', ', ')

def synth(text, path):
    body = {"contents": [{"role": "user", "parts": [{"text": text, "speechMetadata": {"style": STYLE}}]}],
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

def speech_len(path):
    w, sr = sf.read(path, dtype='float32')
    if w.ndim > 1: w = w.mean(1)
    e = np.convolve(np.abs(w), np.ones(480) / 480, 'same'); idx = np.where(e > 0.01)[0]
    return (idx[-1] - idx[0]) / sr if len(idx) else 0, w, sr

from faster_whisper import WhisperModel
asr = WhisperModel('small', device='cpu', compute_type='int8', cpu_threads=4)
rep = json.load(open('takes.json')) if os.path.exists('takes.json') else {}
for i, txt in LINES:
    key = str(i)
    if key in rep and i not in RETAKE: continue
    sp = spoken(txt); best = None
    start = len([f for f in os.listdir('takes') if f.startswith(f'{i:03d}_')])
    for k in range(start, start + 4):
        path = f'takes/{i:03d}_{k}.wav'
        if not os.path.exists(path): synth(sp, path)
        dur, w, sr = speech_len(path)
        seg, _ = asr.transcribe(resample_poly(w, 2, 3).astype(np.float32) if sr == 24000 else w, language='ko', beam_size=5, condition_on_previous_text=False)
        hyp = ''.join(s.text for s in seg).strip(); c = cer(hyp, sp)
        if best is None or c < best[0]: best = (c, path, hyp, dur)
        if c <= 0.08: break
    rep[key] = {'text': txt, 'take': best[1], 'cer': round(best[0], 3), 'asr': best[2], 'dur': round(best[3], 2)}
    print(i, best[1], round(best[0], 3), round(best[3], 2), best[2], flush=True)
    json.dump(rep, open('takes.json', 'w'), ensure_ascii=False, indent=1)
