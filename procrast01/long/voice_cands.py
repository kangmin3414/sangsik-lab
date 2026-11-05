import json, os, sys, time, requests, subprocess
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
from lines_p import STYLES
URL = f'https://aiplatform.googleapis.com/v1beta1/projects/{vx.PROJECT}/locations/global/publishers/google/models/gemini-3.8-flash-tts:generateContent'
T = '솔직히 양심에 손을 얹고 고백해 봅시다. 지금 이 영상 침대에 누워서 목에 투턱 잡힌 채로 보고 계시죠?'
os.makedirs('cands', exist_ok=True); outs = []
for v in ['Sadachbia', 'Zubenelgenubi', 'Fenrir']:
    body = {"contents": [{"role": "user", "parts": [{"text": T, "speechMetadata": {"style": STYLES['N']}}]}],
            "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": v}}, "languageCode": "ko-KR"}}}
    for k in range(5):
        r = requests.post(URL, headers={'Authorization': 'Bearer ' + vx.token(), 'Content-Type': 'application/json'}, data=json.dumps(body), timeout=300)
        if r.status_code == 200: break
        time.sleep(8)
    parts, _ = vx.inline_parts(r.json()); p = f'cands/{v}.wav'; open(p, 'wb').write(parts[0][1]); outs.append(p); print(v, 'ok', flush=True)
