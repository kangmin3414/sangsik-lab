"""Google Cloud Text-to-Speech helper (key read from ~/.config/gtts/key, never printed).
synth(text, voice, path, rate=None) -> path of a 24 kHz mono WAV (cached)."""
import base64, json, os, subprocess

KEY_FILE = os.path.expanduser('~/.config/gtts/key')
URL = 'https://texttospeech.googleapis.com/v1/text:synthesize'


def synth(text, voice, path, rate=None, pitch=None, markup=False):
    if os.path.exists(path) and os.path.getsize(path) > 1000:
        return path
    cfg = {'audioEncoding': 'LINEAR16', 'sampleRateHertz': 24000}
    if rate: cfg['speakingRate'] = rate
    if pitch is not None: cfg['pitch'] = pitch
    body = {'input': {('markup' if markup else 'text'): text}, 'voice': {'languageCode': voice[:5], 'name': voice}, 'audioConfig': cfg}
    key = open(KEY_FILE).read().strip()
    # curl goes through the workspace proxy with the right CA bundle; the key travels in a header, not the URL
    r = subprocess.run(['curl', '-sS', '-m', '90', '-H', 'Content-Type: application/json', '-H', 'X-Goog-Api-Key: ' + key,
                        '--data-binary', '@-', URL], input=json.dumps(body).encode(), capture_output=True)
    try:
        d = json.loads(r.stdout)
    except Exception:
        raise RuntimeError('TTS call failed: ' + r.stderr.decode()[:300])
    if 'audioContent' not in d:
        raise RuntimeError('TTS error: ' + json.dumps(d.get('error', d), ensure_ascii=False)[:400])
    open(path, 'wb').write(base64.b64decode(d['audioContent']))
    return path
