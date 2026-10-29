import sys, os, json, time, requests
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, '../gtts'); import vx
URL = f'https://aiplatform.googleapis.com/v1beta1/projects/{vx.PROJECT}/locations/global/publishers/google/models/gemini-3.8-flash-tts:generateContent'
SETS = {
 'M': ("오십 대 후반의 엄마. 조금 지쳤지만 따뜻하고 담담하게, 다 큰 아들에게 말하듯 다정하게.",
       "밥은 먹었니? … 그해 아빠 회사가 문을 닫았잖아. 막막해서, 매일 밤 좋은 일 세 개씩 적었어. 근데 적다 보니까… 다 네 얘기더라.",
       ['Sulafat', 'Gacrux', 'Vindemiatrix']),
 'F': ("육십 대 초반의 아빠. 무뚝뚝하지만 속정 깊은 목소리로, 수술 뒤라 조금 힘없이 낮게.",
       "뭐 하러 왔어. 회사 가 봐야지. … 밥은 먹었냐. … 오늘, 네 엄마가 웃었다.",
       ['Algenib', 'Charon', 'Alnilam']),
}
def run(job):
    who, v = job; style, txt, _ = SETS[who]
    body = {"contents": [{"role": "user", "parts": [{"text": txt, "speechMetadata": {"style": style}}]}],
            "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": v}}, "languageCode": "ko-KR"}}}
    r = None
    for k in range(4):
        r = requests.post(URL, headers={'Authorization': 'Bearer ' + vx.token(), 'Content-Type': 'application/json'}, data=json.dumps(body), timeout=300)
        if r.status_code == 200:
            parts, _ = vx.inline_parts(r.json())
            if parts:
                open(f'vsample/{who}_{v}.wav', 'wb').write(parts[0][1]); return who, v, 'ok'
        time.sleep(5 * (k + 1))
    return who, v, r.status_code
vx.token()
jobs = [(w, v) for w, s in SETS.items() for v in s[2]]
with ThreadPoolExecutor(6) as ex:
    for res in ex.map(run, jobs): print(res, flush=True)
