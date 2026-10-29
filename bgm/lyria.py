import sys, json, base64, time, requests
sys.path.insert(0, '../gtts')
import vx
def gen(model, prompt, out, seed=None, neg=None, loc='us-central1'):
    url = f'https://{loc}-aiplatform.googleapis.com/v1/projects/{vx.PROJECT}/locations/{loc}/publishers/google/models/{model}:predict'
    inst = {'prompt': prompt}
    if neg: inst['negative_prompt'] = neg
    if seed is not None: inst['seed'] = seed
    r = requests.post(url, headers={'Authorization': 'Bearer ' + vx.token(), 'Content-Type': 'application/json'},
                      data=json.dumps({'instances': [inst], 'parameters': {}}), timeout=300)
    if r.status_code != 200:
        print(out, r.status_code, r.text[:600]); return False
    preds = r.json().get('predictions', [])
    for k, p in enumerate(preds):
        b = p.get('bytesBase64Encoded') or p.get('audioContent')
        if b:
            open(out, 'wb').write(base64.b64decode(b)); print('wrote', out, p.get('mimeType')); return True
    print(out, 'no audio', str(r.json())[:400]); return False
if __name__ == '__main__':
    gen(sys.argv[1], sys.argv[2], sys.argv[3])
