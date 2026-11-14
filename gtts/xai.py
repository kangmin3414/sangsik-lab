"""xAI API 도우미(그림·목소리). 키는 저장소에 넣지 않는다: 환경변수 XAI_API_KEY 또는 ~/.xai_key 에서 읽는다.
   그림: grok-imagine-image-2.0 (1k low 0.04달러, 2k low 0.06달러, 2k medium 0.08달러 — 2026-11-14 /v1/image-generation-models 기준)
   목소리: POST /v1/tts (language='ko', 표정은 글 안의 태그로: [pause] [sigh] <soft>…</soft> <slow>…</slow>)"""
import base64, json, os, time, requests
BASE = 'https://api.x.ai/v1'
def key():
    k = os.environ.get('XAI_API_KEY')
    if not k:
        p = os.path.expanduser('~/.xai_key')
        if not os.path.exists(p): p = '/home/claude/.xai_key'
        k = open(p).read().strip()
    return k
def _post(path, body, timeout=300):
    for a in range(5):
        r = requests.post(BASE + path, headers={'Authorization': 'Bearer ' + key(), 'Content-Type': 'application/json'}, data=json.dumps(body), timeout=timeout)
        if r.status_code == 200: return r
        print('xai', path, r.status_code, r.text[:200], flush=True)
        if r.status_code in (400, 401, 403, 404, 422): break
        time.sleep(8 * (a + 1))
    raise RuntimeError(f'xai {path} failed')
def image(prompt, path, aspect='16:9', resolution='2k', quality='low', model='grok-imagine-image-2.0', n=1):
    """그림 n장을 만들어 path(여러 장이면 path_1, path_2 …)에 저장. 반환: 저장한 경로 목록"""
    r = _post('/images/generations', {'model': model, 'prompt': prompt, 'n': n, 'aspect_ratio': aspect, 'resolution': resolution, 'quality': quality, 'response_format': 'b64_json'})
    out = []
    for i, d in enumerate(r.json()['data']):
        p = path if n == 1 else path.replace('.', f'_{i + 1}.', 1) if '.' in os.path.basename(path) else f'{path}_{i + 1}'
        open(p, 'wb').write(base64.b64decode(d['b64_json'])); out.append(p)
    return out
def tts(text, voice, path, language='ko', speed=1.0, codec='wav', sample_rate=24000):
    """글을 읽어 path에 저장(기본 wav 24kHz)."""
    r = _post('/tts', {'text': text, 'voice_id': voice, 'language': language, 'speed': speed, 'output_format': {'codec': codec, 'sample_rate': sample_rate}})
    open(path, 'wb').write(r.content); return path
