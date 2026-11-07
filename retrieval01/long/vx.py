"""Google Cloud (Gemini Enterprise Agent Platform, ex-Vertex AI) caller that bills the project's billing account.
Credentials: service-account key at ~/.config/gcp/sa.json (never printed). Tokens are minted on the fly."""
import base64, json, os, time
os.environ.setdefault('REQUESTS_CA_BUNDLE', '/root/.ccr/ca-bundle.crt')
import requests
from google.oauth2 import service_account
from google.auth.transport.requests import Request

SA = os.path.expanduser('~/.config/gcp/sa.json')
PROJECT = 'mangyak-tts'
_creds = None


def token():
    global _creds
    if _creds is None:
        _creds = service_account.Credentials.from_service_account_file(SA, scopes=['https://www.googleapis.com/auth/cloud-platform'])
    if not _creds.valid:
        _creds.refresh(Request())
    return _creds.token


def generate(model, body, location='global', retries=3):
    host = 'aiplatform.googleapis.com' if location == 'global' else f'{location}-aiplatform.googleapis.com'
    url = f'https://{host}/v1/projects/{PROJECT}/locations/{location}/publishers/google/models/{model}:generateContent'
    for k in range(retries):
        r = requests.post(url, headers={'Authorization': 'Bearer ' + token(), 'Content-Type': 'application/json'},
                          data=json.dumps(body), timeout=300)
        if r.status_code == 429 or r.status_code >= 500:
            time.sleep(5 * (k + 1)); continue
        return r.status_code, r.json()
    return r.status_code, r.json()


def inline_parts(resp):
    """[(mimeType, bytes)] of every inline data part in the first candidate, plus any text."""
    out, text = [], []
    for c in (resp.get('candidates') or [])[:1]:
        for p in (c.get('content') or {}).get('parts', []):
            if 'inlineData' in p:
                out.append((p['inlineData'].get('mimeType', ''), base64.b64decode(p['inlineData']['data'])))
            elif 'text' in p:
                text.append(p['text'])
    return out, ' '.join(text)
