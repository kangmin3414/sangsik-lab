"""Gemini 3.8 Flash TTS (Google Cloud, billed to the project's credits), voice Schedar.
Each passage is ONE request; every beat is its own part with a spoken-direction style, so intonation flows while pace/tone change."""
import json, subprocess, numpy as np, soundfile as sf, requests, vx
BASE = '차분하고 따뜻한 한국어 다큐멘터리 내레이터. 과장 없이 자연스럽게, 듣는 사람에게 이야기하듯. '
D = {
 '1_데카르트': [
  ('단톡방에 올라온 충격 뉴스, 모두가 아는 상식, 그리고 확실하다고 믿는 내 기억.', '시청자에게 말을 건네듯 친근하게, 나열은 리듬감 있게.'),
  ('<short pause> 이 중 정말 확실한 건, 몇 개나 될까?', '질문은 천천히, 궁금증이 남도록 여운 있게.'),
  ('<long pause> 약 400년 전, 스물세 살의 한 청년이 바로 이 질문 앞에서 길을 잃습니다. 유럽에서 손꼽히는 학교를 마쳤지만, 남은 건 의심뿐. 배울수록, 내가 얼마나 모르는지만 알게 됐다고 그는 돌아봅니다.', '옛이야기를 들려주듯 담담하고 차분하게.'),
  ('그래서 책을 덮고, 세상이라는 큰 책을 읽으러 떠납니다. 여러 나라를 떠돌고, 군대에도 들어가죠.', '이야기가 앞으로 나아가듯 조금 가볍고 경쾌하게.'),
  ('<long pause> 1619년 겨울, 독일의 한 마을. <short pause> 난로가 있는 작은 방에 틀어박혀, 그는 하루 종일 생각에 잠깁니다.', '장면을 그리듯 느리고 낮게, 조용히 몰입시키듯.')],
 '2_장자': [
  ('심리학에도 비슷한 실험이 있습니다.', '흥미로운 이야기를 꺼내듯.'),
  ('초 하나, 성냥, 압정 한 상자. <short pause> 이걸로 초를 벽에 붙여 보라는 문제.', '물건을 하나씩 짚어 주듯 또박또박, 문제는 퀴즈를 내듯.'),
  ('<long pause> 정답은, <short pause> 상자를 비워 벽에 압정으로 박고, 그 위에 초를 세우는 것.', '비밀을 알려 주듯 살짝 천천히.'),
  ('그런데 압정이 담긴 상자를 받은 사람보다, 빈 상자를 받은 사람이 정답을 두 배 더 많이 찾았습니다.', '놀라운 결과를 전하듯, 두 배라는 말에 힘을 주어.'),
  ('<short pause> 상자를 통으로만 보면, 받침대가 안 보이는 거죠.', '깨달음을 정리하듯 부드럽고 천천히.')],
 '3_붓다': [
  ('오늘 점심, 무슨 맛이었는지 기억나세요?', '시청자에게 다정하게 묻듯, 천천히.'),
  ('<short pause> 제로는 모릅니다. 숟가락은 입으로, 눈은 영상으로. 맛볼 틈이 없었죠.', '살짝 웃음기 있게, 가볍게.'),
  ('걸을 땐 메시지. 누우면 내일 걱정. <short pause> 몸은 여기 있는데, 마음은 늘 다른 곳에 가 있습니다.', '공감하듯, 마지막 문장은 차분하게 내려앉게.'),
  ('<long pause> 약 2,500년 전, 이 문제를 평생 붙잡고 산 사람이 있었습니다. 히말라야 아래 작은 나라의 왕자. <short pause> 싯다르타.', '옛이야기를 시작하듯 담담하게, 이름은 천천히.'),
  ('아버지는 아들 눈에 슬픈 건 하나도 보이지 않게 했습니다. 궁 안엔 꽃과 음악, 맛있는 음식뿐.', '화사한 궁을 그리듯 부드럽게.'),
  ('<short pause> 그런데 성 밖으로 나간 날, 왕자는 처음으로 봅니다. <short pause> 늙은 사람. <short pause> 병든 사람. <short pause> 그리고, 장례 행렬.', '긴장감 있게 점점 느려지며, 장면 하나하나를 무겁게.'),
  ('<long pause> 마지막으로, 한 수행자. 가진 건 아무것도 없는데, 얼굴이 이상할 만큼 평온했죠.', '고요하고 신비롭게, 평온한 여운을 남기며.')],
}
VOICE = {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": "Schedar"}}, "languageCode": "ko-KR"}
URL = f'https://aiplatform.googleapis.com/v1beta1/projects/{vx.PROJECT}/locations/global/publishers/google/models/gemini-3.8-flash-tts:generateContent'
POLISH = 'highpass=f=70,bass=g=1:f=160:w=0.7,loudnorm=I=-16:TP=-1.5:LRA=11'
usage = {}
for name, beats in D.items():
    raw = f'g38_{name}.wav'
    import os
    if os.path.exists(raw):
        w, sr = sf.read(raw)
    else:
        w = None
    parts = [{"text": t, "speechMetadata": {"style": BASE + s}} for t, s in beats]
    body = {"contents": [{"role": "user", "parts": parts}], "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": VOICE}}
    if w is None:
     r = requests.post(URL, headers={'Authorization': 'Bearer ' + vx.token(), 'Content-Type': 'application/json'}, data=json.dumps(body), timeout=300)
     r.raise_for_status(); js = r.json(); usage[name] = js.get('usageMetadata', {})
     audio, _ = vx.inline_parts(js)
     open(raw, 'wb').write(audio[0][1])
     w, sr = sf.read(raw)
    mp3 = f'나레이션샘플_최신TTS_{name}.mp3'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', 'adelay=400|400,apad=pad_dur=0.8,' + POLISH,
                    '-ar', '44100', '-c:a', 'libmp3lame', '-b:a', '160k', mp3], check=True)
    print(mp3, '%.1fs' % (len(w) / sr))
json.dump(usage, open('g38_usage.json', 'w'), ensure_ascii=False, indent=1)
print(json.dumps(usage, ensure_ascii=False)[:600])
