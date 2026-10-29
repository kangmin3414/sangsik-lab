import sys, os, json, time, requests
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, '../gtts'); import vx
URL = f'https://aiplatform.googleapis.com/v1beta1/projects/{vx.PROJECT}/locations/global/publishers/google/models/gemini-3.8-flash-tts:generateContent'
STYLE = "칠십 대 후반의 할아버지. 느리고 따뜻하게, 살짝 쉰 목소리로, 손주에게 말하듯 다정하게."
TXT = "허허. 요즘은 일 년이 꼭 한 달 같구나. … 너랑 둘이 사진을 찍는 건, 처음이구나. … 올해 중에… 오늘이 제일 길었다."
def run(v):
    body = {"contents": [{"role": "user", "parts": [{"text": TXT, "speechMetadata": {"style": STYLE}}]}],
            "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": v}}, "languageCode": "ko-KR"}}}
    for k in range(4):
        r = requests.post(URL, headers={'Authorization': 'Bearer ' + vx.token(), 'Content-Type': 'application/json'}, data=json.dumps(body), timeout=300)
        if r.status_code == 200:
            parts, _ = vx.inline_parts(r.json())
            if parts:
                open(f'vsample/{v}.wav', 'wb').write(parts[0][1]); return v, 'ok', r.json().get('usageMetadata', {}).get('totalTokenCount')
        time.sleep(5 * (k + 1))
    return v, r.status_code, r.text[:200]
vx.token()
with ThreadPoolExecutor(5) as ex:
    for res in ex.map(run, ['Algieba', 'Sadaltager', 'Iapetus']): print(res)
