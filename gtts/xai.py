"""xAI (Grok Imagine) image caller. Key: ~/.config/xai/key or $XAI_API_KEY (never printed)."""
import base64, json, os, time
os.environ.setdefault('REQUESTS_CA_BUNDLE', '/root/.ccr/ca-bundle.crt')
import requests

KEY = os.path.expanduser('~/.config/xai/key')
MODEL = 'grok-imagine-image-2.0'


def key():
    return os.environ.get('XAI_API_KEY') or open(KEY).read().strip()


def _post(path, body, retries=3):
    for k in range(retries):
        r = requests.post('https://api.x.ai/v1/images/' + path, headers={'Authorization': 'Bearer ' + key(), 'Content-Type': 'application/json'},
                          data=json.dumps(body), timeout=300)
        if r.status_code == 429 or r.status_code >= 500:
            time.sleep(5 * (k + 1)); continue
        break
    try: return r.status_code, r.json()
    except ValueError: return r.status_code, {'text': r.text[:400]}


def images(resp):
    """[bytes] of every returned image (b64_json, or downloaded from url)."""
    out = []
    for d in resp.get('data', []):
        if d.get('b64_json'): out.append(base64.b64decode(d['b64_json']))
        elif d.get('url'): out.append(requests.get(d['url'], timeout=120).content)
    return out


def generate(prompt, aspect='16:9', **extra):
    return _post('generations', {'model': MODEL, 'prompt': prompt, 'aspect_ratio': aspect, 'response_format': 'b64_json', **extra})


def edit(prompt, refs, aspect=None, **extra):
    """refs: local image paths (up to 5), sent as base64 data URIs."""
    uris = [f"data:image/png;base64,{base64.b64encode(open(p, 'rb').read()).decode()}" for p in refs]
    body = {'model': MODEL, 'prompt': prompt, 'response_format': 'b64_json', **extra}
    if len(uris) == 1: body['image'] = {'url': uris[0], 'type': 'image_url'}
    else: body['images'] = [{'url': u, 'type': 'image_url'} for u in uris]
    if aspect: body['aspect_ratio'] = aspect
    return _post('edits', body)
