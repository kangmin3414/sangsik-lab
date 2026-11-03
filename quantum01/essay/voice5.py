"""v5(5분판) 목소리: SCRIPT_v5_5min.md 전체를 문장별로 녹음 + Whisper 검사. 문장 텍스트로 저장해 v4에서 같은 문장은 다시 쓴다."""
import json, os, re, sys, time
import numpy as np, requests, soundfile as sf
from scipy.signal import resample_poly
ROOT = '/home/claude/sangsik-lab'; sys.path.insert(0, os.path.join(ROOT, 'gtts')); import vx
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); os.makedirs('takes', exist_ok=True)
URL = f'https://aiplatform.googleapis.com/v1beta1/projects/{vx.PROJECT}/locations/global/publishers/google/models/gemini-3.8-flash-tts:generateContent'
STYLE = ('제로의 1인칭 독백. 삼십 대 남자, 낮고 담담하게, 과학 다큐의 에세이를 소리 내어 읽듯. '
         '감정을 누르되 문장 끝은 조용히 내려놓는다. 보통보다 조금 빠르게, 쉼표에서 짧게 쉰다.')
SPOKEN = {'1945년': '천구백사십오 년', '8월 6일': '팔월 육 일', '8월 9일': '팔월 구 일', '3킬로미터': '삼 킬로미터',
          '2009년': '이천구 년', '1957년': '천구백오십칠 년', '2008년': '이천팔 년', '122세': '백이십이 세'}
SECS = ('## ',)
SCRIPT = os.environ.get('SCRIPT', '../SCRIPT_v5_5min.md')

def parse():
    t = open(SCRIPT).read().split('\n---\n')[1]
    out, sec = [], None
    for l in t.splitlines():
        if l.startswith('## '): sec = l if l.startswith(SECS) else None

        if l.startswith('## ') and sec: out.append(('SEC', l[3:], '')); continue
        if sec and l.startswith('> '):
            s = l[2:].strip()
            m = re.match(r'\*\(정적 ([\d.]+)초\)\*', s)
            if m: out.append(('PAUSE', float(m.group(1)), '')); continue
            out.append(('L', re.sub(r'^\*\(속삭이듯\)\*\s*', '', s), 'whisper' if '속삭이듯' in s else ''))
    return out
ITEMS = parse()

def spoken(t):
    for k, v in SPOKEN.items(): t = t.replace(k, v)
    return t
WHISPER = '제로가 아주 작게, 속삭이듯. 숨이 섞인 낮은 목소리로 천천히.'
def synth(text, path, style=None):
    body = {"contents": [{"role": "user", "parts": [{"text": text, "speechMetadata": {"style": style or STYLE}}]}],
            "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": "Schedar"}}, "languageCode": "ko-KR"}}}
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
if __name__ == '__main__':
    from faster_whisper import WhisperModel
    asr = WhisperModel('small', device='cpu', compute_type='int8', cpu_threads=4)
    old = json.load(open('takes.json')) if os.path.exists('takes.json') else {}
    rep = json.load(open('takes5.json')) if os.path.exists('takes5.json') else {}
    for v in old.values(): rep.setdefault(v['text'], v)          # v4에서 녹음한 같은 문장은 그대로 씀
    RETAKE = set(os.environ.get('RETAKE', '').split('|'))
    for i, (k, txt, mode) in enumerate(ITEMS):
        if k != 'L' or (txt in rep and txt not in RETAKE): continue
        sp = spoken(txt); best = None; start = len([f for f in os.listdir('takes') if f.startswith(f'{i:03d}_')])
        for n in range(start, start + 4):
            path = f'takes/{i:03d}_{n}.wav'
            if not os.path.exists(path): synth(sp, path, WHISPER if mode == 'whisper' else None)
            w, sr = sf.read(path, dtype='float32')
            seg, _ = asr.transcribe(resample_poly(w, 2, 3).astype(np.float32), language='ko', beam_size=5, condition_on_previous_text=False)
            hyp = ''.join(s.text for s in seg).strip(); c = cer(hyp, sp)
            if best is None or c < best[0]: best = (c, path, hyp)
            if c <= 0.08: break
        rep[txt] = {'text': txt, 'take': best[1], 'cer': round(best[0], 3), 'asr': best[2]}
        print(i, best[1], round(best[0], 3), best[2], flush=True)
        json.dump(rep, open('takes5.json', 'w'), ensure_ascii=False, indent=1)
