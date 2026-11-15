"""건강 편 연구 네 컷 샘플(마커 화풍, 빠른 템포) 녹음. 테이크는 /dev/shm/op/ms_takes, 고른 것과 단어 시각은 takes_ms.json."""
import json, os, re, sys, time
import numpy as np, requests, soundfile as sf
from scipy.signal import resample_poly
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = '/dev/shm/op/ms_takes2'
URL = f'https://aiplatform.googleapis.com/v1beta1/projects/{vx.PROJECT}/locations/global/publishers/google/models/gemini-3.8-flash-tts:generateContent'
VO = {'N': 'Schedar', 'Z': 'Puck', 'C': 'Sadachbia'}   # 채점이: 남자 목소리(운영자 2026-11-15 "여자 목소리인데 캐릭터가 남자")
# 운영자 2026-11-15 "AI 같은 기계음, 더 자연스럽게 템포를": 속도는 나중에 늘이지 않고(rubberband 뺌) 말투 지시로만 빠르게
ST = {'N': '유튜브 진행자가 친구에게 재밌는 얘기를 들려주듯 자연스러운 구어체. 원고를 읽는 느낌 없이 가볍고 빠르게, 문장 사이 쉼은 짧게. 숫자는 또렷하지만 끊어 읽지 않는다.',
      'Z': '서른 살 직장인 남자. 혼잣말하듯 툭 던지는 자연스러운 말투. 가볍고 빠르게.',
      'C': '엄지만 한 꼬마 남자아이. 자기가 다 안다고 믿는 깐깐한 채점관. 성격이 급해서 말이 빠르고, 쉼 없이 다다다 이어 말한다. 실제 아이가 말하듯 자연스럽게.'}
LINES = [  # id, 목소리, 자막, 읽을 문장, 줄 연기
 ('m8', 'Z', '근데 만 보는… 누가 정한 거야?', '근데 만 보는... 누가 정한 거야?', '문득 궁금해서.'),
 ('m9', 'C', '원래 그런 거야. 기준표에 다 있어. 봐, 1965년 일본, 걸음 세는 기계가 나왔고 이름이 만보계… 어? 이름에서 온 거네?', '원래 그런 거야. 기준표에 다 있어. 봐, 천구백육십오 년 일본, 걸음 세는 기계가 나왔고, 이름이 만보계... 어? 이름에서 온 거네?', '처음엔 자신만만하게 읽다가 끝에서 김이 샌다.'),
 ('m11', 'N', '2019년, 평균 일흔두 살 여성 만 육천여 명의 걸음을 4년 남짓 지켜봤습니다. 하루 4,400보쯤 걷는 사람은 2,700보쯤 걷는 사람보다 사망률이 41퍼센트 낮았습니다.', '이천십구 년, 평균 일흔두 살 여성 만 육천여 명의 걸음을, 사 년 남짓 지켜봤습니다. 하루 사천사백 보쯤 걷는 사람은, 이천칠백 보쯤 걷는 사람보다 사망률이 사십일 퍼센트 낮았습니다.', ''),
 ('m12a', 'C', '7,500보쯤부터는… 더 안 낮아졌대.', '칠천오백 보쯤부터는... 더 안 낮아졌대.', '살짝 시무룩하게.'),
 ('m12b', 'Z', '나 오늘 9,400인데.', '나 오늘 구천사백인데.', '손목을 보며 피식.'),
 ('m15', 'C', '그럼 물. 2리터 중에 900. 이건 못 빠져나가.', '그럼 물. 2리터 중에 구백. 이건 못 빠져나가.', '다시 기운을 차리고 단호하게.'),
 ('m17', 'N', '2002년, 미국의 한 생리학자가 하루 여덟 잔의 근거를 찾아봤습니다. 찾지 못했습니다.', '이천이 년, 미국의 한 생리학자가 하루 여덟 잔의 근거를 찾아봤습니다. 찾지 못했습니다.', '마지막 문장은 한 박자 쉬고 짧게.'),
 ('m18', 'C', "그럴 리가. 기준표에… 옛날 권고문, 하루 2리터 남짓. 거봐. 어, 다음 줄이 있네. '대부분은 음식에 들어 있다.'", '그럴 리가. 기준표에... 옛날 권고문, 하루 2리터 남짓. 거봐. 어, 다음 줄이 있네. 대부분은 음식에 들어 있다.', '의기양양하다가 마지막 문장은 읽으면서 목소리가 작아지며 당황.'),
 ('m22', 'C', '오늘 앉은 시간, 열 시간. 이건 진짜 큰일이야.', '오늘 앉은 시간, 열 시간. 이건 진짜 큰일이야.', '호들갑스럽게.'),
 ('m24', 'N', '2016년, 백만 명이 넘는 사람의 자료를 모았습니다. 하루 여덟 시간 넘게 앉아 있어도, 60분에서 75분쯤 움직인 사람들에게서는 그 위험이 보이지 않았습니다.', '이천십육 년, 백만 명이 넘는 사람의 자료를 모았습니다. 하루 여덟 시간 넘게 앉아 있어도, 육십 분에서 칠십오 분쯤 움직인 사람들에게서는, 그 위험이 보이지 않았습니다.', ''),
 ('m25', 'Z', '한 시간…? 그건 좀 많은데.', '한 시간...? 그건 좀 많은데.', '난감해서.'),
 ('m26', 'C', '넷 중 셋은 못 채웠대. 그래도 움직인 만큼은 줄었어. 빠르게 걷는 정도면 쳐 줘.', '넷 중 셋은 못 채웠대. 그래도 움직인 만큼은 줄었어. 빠르게 걷는 정도면 쳐 줘.', '봐주는 척 너그럽게.'),
 ('m32', 'N', '2024년, 건강한 미국 성인 39만 명을 20년 넘게 따라간 연구가 나왔습니다. 종합비타민을 매일 먹은 사람의 사망 위험은, 낮아지지 않았습니다.', '이천이십사 년, 건강한 미국 성인 삼십구만 명을, 이십 년 넘게 따라간 연구가 나왔습니다. 종합비타민을 매일 먹은 사람의 사망 위험은, 낮아지지 않았습니다.', ''),
 ('m33', 'C', '모자란 사람은 다르대. 종합비타민만 본 거고. …그래도 이 칸은, 뭘로 채점하지?', '모자란 사람은 다르대. 종합비타민만 본 거고. ...그래도 이 칸은, 뭘로 채점하지?', '앞은 빠르게 읽고, 마지막 질문은 조용히 혼잣말로.'),
]
def synth(text, voice, style, path):
    body = {"contents": [{"role": "user", "parts": [{"text": text, "speechMetadata": {"style": style}}]}],
            "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}, "languageCode": "ko-KR"}}}
    for k in range(6):
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
MUST = {'m15': '2리터|이 ?리터', 'm18': '2리터|이 ?리터'}   # 이 낱말이 들려야 통과(ASR이 '1리터'로 적은 적이 있음)
from faster_whisper import WhisperModel
asr = WhisperModel('small', device='cpu', compute_type='int8', cpu_threads=2)
rep = json.load(open(os.path.join(HERE, 'takes_ms.json'))) if os.path.exists(os.path.join(HERE, 'takes_ms.json')) else {}
only = sys.argv[1:]
for lid, v, sub, sp, ls in LINES:
    if (lid in rep and lid not in only) or (only and lid not in only): continue
    takes = []; ok = 0.25 if re.search(r'\d', sub) else 0.08
    for k in range(5 if lid in MUST else 4):
        path = f'{OUT}/{lid}_{k}.wav'; synth(sp, VO[v], ST[v] + (' ' + ls if ls else ''), path)
        w, sr = sf.read(path, dtype='float32')
        seg, _ = asr.transcribe(resample_poly(w, 2, 3).astype(np.float32), language='ko', beam_size=5, word_timestamps=True, condition_on_previous_text=False)
        seg = list(seg); hyp = ''.join(s.text for s in seg).strip(); c = cer(hyp, sp)
        if lid in MUST and not re.search(MUST[lid], hyp): c = max(c, 0.9)   # 숫자가 틀리게 들리면 다시
        words = [{'w': x.word.strip(), 't': round(float(x.start), 2)} for s in seg for x in s.words]
        print(lid, k, round(c, 3), round(len(w) / sr, 2), hyp[:90], flush=True)
        takes.append((c, path, hyp, words, len(w) / sr))
        if sum(1 for x in takes if x[0] < ok) >= 2: break   # 통과한 테이크 둘 중 더 빠른 것
    good = [x for x in takes if x[0] < ok]; best = min(good, key=lambda x: x[4]) if good else min(takes)
    rep[lid] = {'take': best[1], 'cer': round(best[0], 3), 'hyp': best[2], 'words': best[3], 'dur': round(best[4], 2), 'sub': sub, 'voice': VO[v], 'who': v}
    json.dump(rep, open(os.path.join(HERE, 'takes_ms.json'), 'w'), ensure_ascii=False, indent=1)
print('done')
