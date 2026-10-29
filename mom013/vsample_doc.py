import sys, os, json, time, requests, subprocess
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, '../gtts'); import vx
import numpy as np, soundfile as sf
from PIL import Image, ImageDraw, ImageFont
URL = f'https://aiplatform.googleapis.com/v1beta1/projects/{vx.PROJECT}/locations/global/publishers/google/models/gemini-3.8-flash-tts:generateContent'
STYLE = "박사. 칠십 대의 다정한 할아버지 과학자. 차분하고 지혜롭게, 아끼는 제자에게 말하듯 따뜻하고 또렷하게."
TXT = "제로야, 행복할 일을 기다리지 말고, 이미 있는 걸 세어 보자. 매일 밤, 딱 세 개만. … 아니. 슬픈 건 슬픈 거야. 별을 찾는다고, 구름이 사라지진 않아."
VO = [('Sadaltager', '박사 후보 1', '지적이고 차분한 목소리'), ('Charon', '박사 후보 2', '낮고 묵직한 목소리'), ('Algenib', '박사 후보 3', '살짝 거칠고 푸근한 목소리')]
os.makedirs('vsample/doc', exist_ok=True)
def run(v):
    body = {"contents": [{"role": "user", "parts": [{"text": TXT, "speechMetadata": {"style": STYLE}}]}],
            "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": v}}, "languageCode": "ko-KR"}}}
    for k in range(4):
        r = requests.post(URL, headers={'Authorization': 'Bearer ' + vx.token(), 'Content-Type': 'application/json'}, data=json.dumps(body), timeout=300)
        if r.status_code == 200:
            parts, _ = vx.inline_parts(r.json())
            if parts: open(f'vsample/doc/D_{v}.wav', 'wb').write(parts[0][1]); return v, 'ok'
        time.sleep(5 * (k + 1))
    return v, r.status_code
vx.token()
with ThreadPoolExecutor(3) as ex:
    for res in ex.map(run, [v for v, _, _ in VO]): print(res, flush=True)
F = '/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'; lst = []
for n, (v, title, sub) in enumerate(VO, 1):
    im = Image.new('RGB', (1280, 720), '#1B2A3A'); d = ImageDraw.Draw(im)
    d.text((640, 300), title, font=ImageFont.truetype(F, 110), fill='#3DF2B0', anchor='mm')
    d.text((640, 430), sub, font=ImageFont.truetype(F, 52), fill='#FFFFFF', anchor='mm')
    d.text((640, 640), v, font=ImageFont.truetype(F, 34), fill='#8C95A8', anchor='mm'); im.save(f'vsample/doc/c{n}.png')
    w, sr = sf.read(f'vsample/doc/D_{v}.wav'); w = w.mean(1) if w.ndim > 1 else w
    sf.write(f'vsample/doc/a{n}.wav', np.concatenate([np.zeros(int(0.6 * sr)), w / (np.abs(w).max() + 1e-9) * 0.85, np.zeros(int(1.0 * sr))]), sr)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-loop', '1', '-i', f'vsample/doc/c{n}.png', '-i', f'vsample/doc/a{n}.wav', '-c:v', 'libx264', '-tune', 'stillimage', '-pix_fmt', 'yuv420p', '-r', '24', '-c:a', 'aac', '-ar', '48000', '-b:a', '160k', '-shortest', f'vsample/doc/s{n}.mp4'], check=True)
    lst.append(f"file 's{n}.mp4'")
open('vsample/doc/list.txt', 'w').write('\n'.join(lst) + '\n')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', 'vsample/doc/list.txt', '-c', 'copy', 'vsample/박사_할아버지목소리_후보3.mp4'], check=True)
print('done')
