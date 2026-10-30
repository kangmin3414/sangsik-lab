"""Voice audition for the new channel: same lines in 3-4 Gemini 3.8 Flash TTS voices per character (GCP free-trial credits),
then one comparison video per character (portrait card with the candidate number + the take).
  python3 vsample.py  ->  vsample/<char>_<voice>.wav, vsample/<char>_목소리_후보.mp4"""
import json, os, subprocess, sys, time
from concurrent.futures import ThreadPoolExecutor
import numpy as np
import requests
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'gtts'))
import vx
from charsheet import cut

URL = f'https://aiplatform.googleapis.com/v1beta1/projects/{vx.PROJECT}/locations/global/publishers/google/models/gemini-3.8-flash-tts:generateContent'
SETS = {
 'sophia': ("열아홉 살 여자 대학생. 차분하고 다정하게, 또래보다 어른스러운 말투. 철학자 얘기가 나오면 눈을 반짝이며 살짝 들떠서 말이 빨라지고, "
            "마지막에는 수줍게 웃으며 사과한다. 새벽 카페라 목소리는 너무 크지 않게.",
            "동굴이요? … 언니, 생각 실험 하나 해 볼까요? 태어날 때부터 동굴 벽만 보고 산 사람들이 있어요. "
            "그 사람들한테는, 벽에 비친 그림자가 세상 전부예요. … 아, 죄송해요. 플라톤 얘기만 나오면 제가 좀 신나서요.",
            ['Leda', 'Kore', 'Despina', 'Achernar'], 'img/grok_sheet_sophia_1.png', '소피'),
 'haru': ("스물세 살 신입 직장인 여자. 밝고 솔직한 성격인데 오늘은 지쳐서 투덜거린다. 친한 동생에게 반말로 하소연하다가, 마지막엔 장난스럽게 따진다.",
          "소피 씨… 나 오늘 인스타 세 시간 봤어. 다들 해외여행 가고, 승진하고, 연애하고… 나만 동굴에 갇혀 사는 것 같아. "
          "아니 근데, 그래서 나보고 어쩌라는 건데?",
          ['Zephyr', 'Aoede', 'Laomedeia', 'Autonoe'], 'img/grok_sheet_haru_1.png', '하루'),
 'minerva': ("카페에 사는 늙은 부엉이. 시큰둥하고 무뚝뚝한 낮은 목소리. 귀찮은 듯 한숨을 쉬다가, 마지막 한 줄은 의외로 따뜻하게.",
             "또 시작이네. … 정리하자면, 남의 피드는 그림자고, 네 하루는 진짜라는 거다. 이제 가서 자.",
             ['Algenib', 'Charon', 'Rasalgethi'], 'img/sheet_minerva_1.png', '미네르바'),
}
FONT = next((p for p in ('/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc', '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc') if os.path.exists(p)), None)


def synth(job):
    who, v = job; style, txt = SETS[who][:2]
    path = f'vsample/{who}_{v}.wav'
    if os.path.exists(path): return who, v, 'cached'
    body = {"contents": [{"role": "user", "parts": [{"text": txt, "speechMetadata": {"style": style}}]}],
            "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": v}}, "languageCode": "ko-KR"}}}
    r = None
    for k in range(5):
        r = requests.post(URL, headers={'Authorization': 'Bearer ' + vx.token(), 'Content-Type': 'application/json'}, data=json.dumps(body), timeout=300)
        if r.status_code == 200:
            parts, _ = vx.inline_parts(r.json())
            if parts:
                open(path, 'wb').write(parts[0][1]); return who, v, 'ok'
        time.sleep(6 * (k + 1))
    return who, v, r.status_code


def card(who, n, v):
    src = Image.open(SETS[who][3]).convert('RGB')
    W, H = 1280, 720
    im = Image.new('RGB', (W, H), (28, 24, 36))
    face = src.crop((int(src.width * 0.66), 0, src.width, src.height))  # the head close-up sits on the right of every sheet
    face = cut(face)
    cols = (np.asarray(face)[..., 3] > 0).sum(0) > 20  # keep the widest figure (the close-up), not a sliver of the next view or edge noise
    runs, x = [], 0
    while x < len(cols):
        if cols[x]:
            x0 = x
            while x < len(cols) and cols[x]: x += 1
            runs.append((x - x0, x0, x))
        x += 1
    _, x0, x1 = max(runs)
    face = face.crop((x0, 0, x1, face.height)); face = face.crop(face.getbbox())
    face.thumbnail((W // 2 - 60, H - 80)); im.paste(face, (W - face.width - 60, (H - face.height) // 2), face)
    d = ImageDraw.Draw(im)
    d.text((70, 230), f'{SETS[who][4]} 목소리 후보', font=ImageFont.truetype(FONT, 44), fill=(240, 220, 190))
    d.text((70, 300), f'{n}번', font=ImageFont.truetype(FONT, 150), fill=(255, 255, 255))
    d.text((70, 490), v, font=ImageFont.truetype(FONT, 40), fill=(170, 160, 190))
    p = f'vsample/{who}_{n}.png'; im.save(p); return p


def video(who):
    segs = []
    for n, v in enumerate(SETS[who][2], 1):
        wav = f'vsample/{who}_{v}.wav'
        if not os.path.exists(wav): continue
        seg = f'vsample/{who}_{n}.mp4'
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-loop', '1', '-i', card(who, n, v), '-i', wav,
                        '-af', 'adelay=600|600,apad=pad_dur=1.2', '-c:v', 'libx264', '-tune', 'stillimage', '-pix_fmt', 'yuv420p',
                        '-r', '30', '-c:a', 'aac', '-ar', '44100', '-ac', '2', '-b:a', '160k', '-shortest', seg], check=True)
        segs.append(seg)
    lst = f'vsample/{who}_list.txt'
    open(lst, 'w').write(''.join(f"file '{os.path.basename(s)}'\n" for s in segs))
    out = f'vsample/{SETS[who][4]}_목소리_후보.mp4'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', out], check=True)
    print(out)


if __name__ == '__main__':
    os.makedirs('vsample', exist_ok=True)
    vx.token()
    jobs = [(w, v) for w, s in SETS.items() for v in s[2]]
    with ThreadPoolExecutor(4) as ex:
        for res in ex.map(synth, jobs): print(res, flush=True)
    for w in SETS: video(w)
