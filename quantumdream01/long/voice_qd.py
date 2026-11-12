import json, os, re, sys, time
import numpy as np, requests, soundfile as sf
from scipy.signal import resample_poly
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); sys.path.insert(0, HERE); import vx
from lines_qd import LINES, VOICES, STYLES, LINE_STYLE
os.chdir(HERE); os.makedirs('takes', exist_ok=True)
URL = f'https://aiplatform.googleapis.com/v1beta1/projects/{vx.PROJECT}/locations/global/publishers/google/models/gemini-3.8-flash-tts:generateContent'
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
asr = WhisperModel('small', device='cpu', compute_type='int8', cpu_threads=2)
vx.token()
rep = json.load(open('takes.json')) if os.path.exists('takes.json') else {}
only = sys.argv[1:]
for lid, scene, v, txt, sp, args in LINES:
    if txt is None or (lid in rep and lid not in only) or (only and lid not in only): continue
    sp = sp or txt; best = None; style = STYLES[v] + (' ' + LINE_STYLE[lid] if lid in LINE_STYLE else '')
    for k in range(3):
        path = f'takes/{lid}_{k}.wav'
        if not os.path.exists(path) or lid in only: synth(sp, VOICES[v], style, path)
        w, sr = sf.read(path, dtype='float32')
        seg, _ = asr.transcribe(resample_poly(w, 2, 3).astype(np.float32), language='ko', beam_size=5, condition_on_previous_text=False)
        hyp = ''.join(s.text for s in seg).strip(); c = cer(hyp, sp)
        print(lid, k, round(c, 3), hyp[:70], flush=True)
        if best is None or c < best[0]: best = (c, path, hyp)
        if c < 0.06: break
    rep[lid] = {'take': best[1], 'cer': round(best[0], 3), 'hyp': best[2], 'text': txt}
    json.dump(rep, open('takes.json', 'w'), ensure_ascii=False, indent=1)
print('done')
