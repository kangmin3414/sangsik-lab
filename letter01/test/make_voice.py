"""Letter ep.1 voice audition: opening hook + first lines of letter 1, read by 3 Gemini 3.8 Flash TTS voices.
usage: python3 make_voice.py  -> voice/<Voice>.wav (+ .mp3)"""
import json, os, subprocess, sys, time
from concurrent.futures import ThreadPoolExecutor
import numpy as np, requests, soundfile as sf
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(ROOT, 'gtts'))
import vx
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); os.makedirs('voice/takes', exist_ok=True)
URL = f'https://aiplatform.googleapis.com/v1beta1/projects/{vx.PROJECT}/locations/global/publishers/google/models/gemini-3.8-flash-tts:generateContent'
VOICES = sys.argv[1:] or ['Puck', 'Enceladus', 'Algieba']
TALK = '삼십 대 남자가 늦은 밤 책상 앞에서 시청자에게 조용히 말을 거는 말투. 담담하고 낮게, 살짝 건조한 유머가 묻어나게. 과장하지 말 것.'
LETTER = '편지를 소리 내어 읽어 주듯, 낮고 따뜻하고 담담하게. 평소보다 조금 느리게, 문장 끝을 부드럽게 내려놓듯. 슬프게 꾸미거나 울먹이지 말 것.'
# (text, style, pause_after_sec)
LINES = [
 ('오늘 하루, 잘했다는 말을 누구한테 들었어요?', TALK, 0.6),
 ('3초 드릴게요.', TALK, 3.0),
 ('못 떠올리셨죠. 저도 오늘은 못 들었어요.', TALK, 0.5),
 ('제가 온 걸 알아준 건, 현관 앞 센서등 하나였어요.', TALK, 0.4),
 ('그것도 가만히 서 있으니까, 꺼지더라고요.', TALK, 1.5),
 ('당신에게.', LETTER, 1.0),
 ('오늘 당신이 한 일들은, 아마 아무도 적어 두지 않았을 거예요.', LETTER, 0.8),
 ('알람을 세 번 끄고도, 결국 일어난 것.', LETTER, 0.7),
 ('"확인 부탁드립니다"에, 답장을 썼다 지웠다 하다가, 숨 한 번 고르고 보낸 것.', LETTER, 0.7),
 ('회의에서 하고 싶은 말을 삼키고, 책상 밑에서 주먹만 쥐었다 푼 것.', LETTER, 0.8),
]
SR = 24000


def synth(text, voice, style, path):
    if os.path.exists(path): return path
    body = {"contents": [{"role": "user", "parts": [{"text": text, "speechMetadata": {"style": style}}]}],
            "generationConfig": {"responseModalities": ["AUDIO"],
                                 "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}, "languageCode": "ko-KR"}}}
    r = None
    for k in range(7):
        try:
            r = requests.post(URL, headers={'Authorization': 'Bearer ' + vx.token(), 'Content-Type': 'application/json'},
                              data=json.dumps(body), timeout=300)
            if r.status_code == 200:
                parts, _ = vx.inline_parts(r.json())
                if parts:
                    open(path, 'wb').write(parts[0][1]); return path
        except Exception as e:
            print('req err', e, flush=True)
        time.sleep(6 * (k + 1))
    raise RuntimeError(f'TTS failed {r.status_code if r is not None else "-"}: {r.text[:300] if r is not None else ""}')


def load(path):
    """inline audio is raw 24 kHz 16-bit mono PCM (or a wav); return float32 trimmed of edge silence."""
    raw = open(path, 'rb').read()
    if raw[:4] == b'RIFF':
        w, sr = sf.read(path, dtype='float32')
        if w.ndim > 1: w = w.mean(1)
    else:
        w = np.frombuffer(raw, dtype='<i2').astype(np.float32) / 32768
    a = np.abs(w); thr = max(a.max() * 0.02, 1e-4); idx = np.where(a > thr)[0]
    if len(idx): w = w[max(0, idx[0] - 1200): idx[-1] + 2400]
    return w


jobs = [(v, i, t, s) for v in VOICES for i, (t, s, _) in enumerate(LINES)]
vx.token()
with ThreadPoolExecutor(4) as ex:
    list(ex.map(lambda j: synth(j[2], j[0], j[3], f'voice/takes/{j[0]}_{j[1]:02d}.pcm'), jobs))
for v in VOICES:
    chunks = [np.zeros(int(0.4 * SR), np.float32)]
    for i, (t, s, gap) in enumerate(LINES):
        chunks += [load(f'voice/takes/{v}_{i:02d}.pcm'), np.zeros(int(gap * SR), np.float32)]
    w = np.concatenate(chunks); w = w / (np.abs(w).max() + 1e-9) * 0.9
    sf.write(f'voice/{v}.wav', w, SR)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f'voice/{v}.wav', '-b:a', '160k', f'voice/{v}.mp3'], check=True)
    print(v, round(len(w) / SR, 1), 's', flush=True)
