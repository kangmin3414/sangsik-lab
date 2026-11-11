"""등장인물 목소리 오디션 (운영자 2026-11-11 "목소리 만들어줘 매력적으로 감정별로").
인물 4명 × 후보 목소리 3개 × 감정 5개. 받아쓰기(CER)로 오독을 거르고, 인물별로 '1번·2번·3번 목소리'를 이어 붙인 mp3를 만든다.
사용: python3 gen_voice.py            (전체)
      python3 gen_voice.py 제로        (한 인물만)
"""
import json, os, re, subprocess, sys, time
import numpy as np, requests, soundfile as sf
from scipy.signal import resample_poly

HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
os.makedirs('takes', exist_ok=True); os.makedirs('out', exist_ok=True)
URL = f'https://aiplatform.googleapis.com/v1beta1/projects/{vx.PROJECT}/locations/global/publishers/google/models/gemini-3.8-flash-tts:generateContent'

EMOS = ['기본', '기쁨', '짜증', '놀람', '지침']
CAST = {
    '제로': dict(
        voices=['Puck', 'Achird', 'Enceladus'],
        base='31살 남자 직장인 대리. 부드럽고 따뜻한 미성, 살짝 수줍고 귀여운 매력이 있는 목소리. 자연스러운 대화체.',
        lines={
            '기본': ('아, 그 보고서요? 제가 어제 다 정리해 뒀어요.', '평소처럼 차분하고 다정하게.'),
            '기쁨': ('어, 저요? 아, 네! 같이 가요, 점심.', '수줍게 설레면서 웃음이 묻어나게.'),
            '짜증': ('아니, 왜 꼭 퇴근 오 분 전에 일을 주시는 건데요.', '작게 투덜투덜, 귀엽게 억울한 말투로.'),
            '놀람': ('잠깐만, 이거 전체 공유로 보낸 거예요?', '깜짝 놀라 당황해서 빠르고 높게.'),
            '지침': ('오늘도... 고생 많았다, 나.', '지쳐서 한숨 섞어 낮고 느리게, 혼잣말처럼.'),
        }),
    '서윤': dict(
        voices=['Leda', 'Autonoe', 'Aoede'],
        base='21살 여자 대학생 인턴. 맑고 밝고 사랑스러운 목소리, 생기 있고 또렷한 발음. 자연스러운 대화체.',
        lines={
            '기본': ('대리님, 이거 검토 부탁드려도 될까요?', '공손하고 상냥하게, 밝은 미소가 느껴지게.'),
            '기쁨': ('와, 진짜요? 대리님 최고예요!', '신나서 통통 튀게, 환하게 웃으며.'),
            '짜증': ('치, 저만 빼고 회식 날짜 정하신 거예요?', '볼을 부풀리고 삐진 듯 귀엽게.'),
            '놀람': ('헐, 이게 다 오늘까지라고요?', '깜짝 놀라 눈이 커진 듯 높고 빠르게.'),
            '지침': ('저... 오늘은 진짜 좀 힘들었어요.', '지쳐서 작고 여리게, 살짝 울먹이듯.'),
        }),
    '태호': dict(
        voices=['Algenib', 'Fenrir', 'Sadachbia'],
        base='31살 남자, 주인공의 절친. 시원하고 장난기 많은 밝은 목소리, 호탕한 매력. 자연스러운 반말.',
        lines={
            '기본': ('야, 제로. 오늘 퇴근하고 치킨 어때?', '편하고 시원하게, 친구한테 말하듯.'),
            '기쁨': ('크하하, 그치! 그게 바로 내 친구지!', '크게 웃으며 신나게, 호탕하게.'),
            '짜증': ('아 진짜, 너는 왜 맨날 읽씹이냐?', '장난 반 진심 반으로 투덜대며.'),
            '놀람': ('뭐? 인턴이 너한테 커피를 사 줬다고?', '깜짝 놀라 목소리가 커지게, 들뜬 호기심.'),
            '지침': ('괜찮아. 너 오늘 충분히 잘했어.', '장난기를 빼고 낮고 따뜻하게 위로하듯.'),
        }),
    '팀장님': dict(
        voices=['Charon', 'Alnilam', 'Orus'],
        base='48살 남자 팀장. 낮고 묵직한 중저음, 무뚝뚝하지만 품위 있고 은근히 따뜻한 매력. 자연스러운 대화체.',
        lines={
            '기본': ('제로 대리, 잠깐 회의실로 와 봐.', '담담하고 무게감 있게.'),
            '기쁨': ('음, 이번 건 꽤 괜찮네. 수고했어.', '무뚝뚝한 척하지만 흐뭇함이 살짝 묻어나게.'),
            '짜증': ('이걸 지금 보고서라고 가져온 건가?', '낮게 깔고 엄하게, 소리치지 않고 차갑게.'),
            '놀람': ('어, 어? 이게 왜 단톡방에 올라가 있지?', '근엄함이 무너지며 허둥지둥 당황해서.'),
            '지침': ('너무 무리하지 마. 일은 내일도 있으니까.', '조용하고 따뜻하게, 아버지처럼.'),
        }),
}
LABEL_VOICE = 'Schedar'


def synth(text, voice, style, path):
    body = {"contents": [{"role": "user", "parts": [{"text": text, "speechMetadata": {"style": style}}]}],
            "generationConfig": {"responseModalities": ["AUDIO"],
                                 "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}, "languageCode": "ko-KR"}}}
    for k in range(7):
        try:
            r = requests.post(URL, headers={'Authorization': 'Bearer ' + vx.token(), 'Content-Type': 'application/json'},
                              data=json.dumps(body), timeout=300)
            if r.status_code == 200:
                parts, _ = vx.inline_parts(r.json())
                if parts:
                    open(path, 'wb').write(parts[0][1]); return
            else:
                print('tts', r.status_code, r.text[:150], flush=True)
        except Exception as e:
            print('err', e, flush=True)
        time.sleep(6 * (k + 1))
    raise RuntimeError('tts failed')


Hn = lambda s: re.sub(r'[^가-힣]', '', s)
def cer(a, b):
    a, b = Hn(a), Hn(b); d = list(range(len(b) + 1))
    for x in a:
        p, d[0] = d[0], d[0] + 1
        for j, y in enumerate(b, 1):
            p, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, p + (x != y))
    return d[len(b)] / max(1, len(b))


from faster_whisper import WhisperModel
asr = WhisperModel('small', device='cpu', compute_type='int8', cpu_threads=2)
SR = 24000


def load(path):
    w, sr = sf.read(path, dtype='float32')
    if w.ndim > 1: w = w.mean(axis=1)
    if sr != SR: w = resample_poly(w, SR, sr).astype(np.float32)
    # 앞뒤 무음 정리 + 말소리 크기 맞추기(RMS -20dBFS)
    idx = np.where(np.abs(w) > 0.01)[0]
    if len(idx): w = w[max(0, idx[0] - 1200): idx[-1] + 2400]
    rms = np.sqrt(np.mean(w ** 2)) + 1e-9
    return np.clip(w * (0.1 / rms), -0.98, 0.98)


def take(text, voice, style, stem):
    best = None
    for k in range(2):
        path = f'takes/{stem}_{k}.wav'
        if not os.path.exists(path): synth(text, voice, style, path)
        w, sr = sf.read(path, dtype='float32')
        x = resample_poly(w, 16000, sr).astype(np.float32) if sr != 16000 else w
        seg, _ = asr.transcribe(x, language='ko', beam_size=5, condition_on_previous_text=False)
        hyp = ''.join(s.text for s in seg).strip(); c = cer(hyp, text)
        if best is None or c < best[0]: best = (c, path, hyp)
        if c < 0.15: break
    print(stem, round(best[0], 2), best[2][:40], flush=True)
    return best


vx.token()
only = sys.argv[1:]
labels = {}
for i in (1, 2, 3):
    p = f'takes/label_{i}.wav'
    if not os.path.exists(p): synth(f'{i}번 목소리.', LABEL_VOICE, '차분하고 또렷한 안내 방송 말투.', p)
    labels[i] = load(p) * 0.8
gap = lambda s: np.zeros(int(SR * s), np.float32)
report = json.load(open('report.json')) if os.path.exists('report.json') else {}
for who, c in CAST.items():
    if only and who not in only: continue
    seq = []
    for i, v in enumerate(c['voices'], 1):
        seq += [labels[i], gap(0.6)]
        for emo in EMOS:
            text, emo_style = c['lines'][emo]
            best = take(text, v, c['base'] + ' ' + emo_style, f'{who}_{v}_{emo}')
            report[f'{who}/{v}/{emo}'] = {'cer': round(best[0], 3), 'hyp': best[2], 'take': best[1]}
            seq += [load(best[1]), gap(0.8)]
        seq += [gap(0.8)]
    wav = f'out/{who}.wav'
    sf.write(wav, np.concatenate(seq), SR)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11',
                    '-ar', '44100', '-b:a', '192k', f'out/{who}_목소리후보.mp3'], check=True)
    json.dump(report, open('report.json', 'w'), ensure_ascii=False, indent=1)
    print('DONE', who, flush=True)
print('ALL DONE')
