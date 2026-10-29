"""Re-voice a single-narrator long-form with Gemini 3.8 Flash TTS on Google Cloud (billed to the project's credits).
Every line is one request with a spoken-direction style chosen from its scene; each take is checked with Whisper
(Hangul CER) and retaken up to twice; the timeline / voice.wav / lip-sync envelope are rebuilt exactly like tts.py.
usage: python3 tts38.py <episode folder> <style map json>"""
import hashlib, json, os, re, sys, time
import numpy as np, requests, soundfile as sf
from scipy.signal import resample_poly
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import vx

D = os.path.abspath(sys.argv[1]); STY = json.load(open(sys.argv[2], encoding='utf-8'))
sys.path.insert(0, D); os.chdir(D)
import script
S = script.S
SR = 44100
VOICE = STY.get('voice', 'Schedar')
BASE = STY['base']
URL = f'https://aiplatform.googleapis.com/v1beta1/projects/{vx.PROJECT}/locations/global/publishers/google/models/gemini-3.8-flash-tts:generateContent'
os.makedirs('tts38', exist_ok=True)
NAME_FIX = [('만약에연구소였습니다', '상식실험실이었습니다'), ('만약에연구소', '상식실험실')]


def fix(s):
    for a, b in NAME_FIX: s = s.replace(a, b)
    return s


def style_for(i, scene, args):
    s = STY.get('line', {}).get(str(i)) or STY.get('scene', {}).get(scene) or ''
    return BASE + ' ' + s


def synth(text, style, path):
    if os.path.exists(path): return path
    body = {"contents": [{"role": "user", "parts": [{"text": text, "speechMetadata": {"style": style}}]}],
            "generationConfig": {"responseModalities": ["AUDIO"],
                                 "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": VOICE}}, "languageCode": "ko-KR"}}}
    for k in range(5):
        r = requests.post(URL, headers={'Authorization': 'Bearer ' + vx.token(), 'Content-Type': 'application/json'},
                          data=json.dumps(body), timeout=300)
        if r.status_code == 200:
            parts, _ = vx.inline_parts(r.json())
            if parts:
                open(path, 'wb').write(parts[0][1]); return path
        time.sleep(4 * (k + 1))
    raise RuntimeError(f'TTS failed {r.status_code}: {r.text[:300]}')


def load_trim(p):
    w, sr = sf.read(p)
    if w.ndim > 1: w = w.mean(1)
    if sr != SR: w = resample_poly(w, 441, 240) if sr == 24000 else resample_poly(w, SR, sr)
    thr = 0.01 * np.abs(w).max(); idx = np.where(np.abs(w) > thr)[0]
    return w[max(0, idx[0] - int(0.03 * SR)):idx[-1] + int(0.06 * SR)]


from faster_whisper import WhisperModel
ASR = WhisperModel('small', device='cpu', compute_type='int8', cpu_threads=2)
hangul = lambda t: re.sub(r'[^가-힣]', '', t)


def cer(hyp, ref):
    a, b = hangul(hyp), hangul(ref); d = list(range(len(b) + 1))
    for x in a:
        prev, d[0] = d[0], d[0] + 1
        for j, y in enumerate(b, 1): prev, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, prev + (x != y))
    return d[len(b)] / max(1, len(b))


def check(w, text):
    w16 = resample_poly(np.pad(w, (int(0.2 * SR), int(0.2 * SR))), 160, 441).astype(np.float32)
    sg, _ = ASR.transcribe(w16, language='ko', beam_size=1, condition_on_previous_text=False, vad_filter=False)
    hyp = ''.join(x.text for x in sg).strip()
    # digits are read as words by the voice but transcribed as digits: compare Hangul only, ignore number words
    ref = re.sub(r'[0-9][0-9,\.]*', '', text)
    return cer(hyp, ref), hyp


chunks = [np.zeros(int(0.8 * SR))]; tl = []; t = 0.8; report = []
for i, (scene, args, sub, spk) in enumerate(S):
    sub = fix(sub); text = fix(spk) if (spk and STY.get('use_spk')) else sub   # spoken form (numbers in Hangul) when the style map asks for it
    style = style_for(i, scene, args)
    best = None
    RET = [int(x) for x in os.environ.get('RETAKE', '').split(',') if x.strip()]   # lines to re-record with fresh takes
    for take in (range(3, 6) if i in RET else range(3)):
        h = hashlib.md5(f'{VOICE}|{style}|{text}|{take}'.encode()).hexdigest()[:12]
        w = load_trim(synth(text, style, f'tts38/{i:03d}_{h}.wav'))
        c, hyp = check(w, sub)   # compare with the subtitle form (digits dropped on both sides), also when the spoken form was used
        if best is None or c < best[0]: best = (c, w, hyp, take)
        if c <= (0.04 if i in RET else 0.12): break
    c, w, hyp, take = best
    report.append({'i': i, 'cer': round(c, 3), 'take': take, 'dur': round(len(w) / SR, 2), 'hyp': hyp[:80]})
    print(f'{i:02d} {scene:10s} cer {c:.2f} take {take} {len(w) / SR:5.1f}s', flush=True)
    d = len(w) / SR
    tl.append({"i": i, "scene": scene, "args": args, "sub": sub, "t0": round(t, 3), "t1": round(t + d, 3)})
    chunks.append(w); t += d
    gap = 0.95 if scene == "chapter" or (i + 1 < len(S) and S[i + 1][0] == "chapter") else 0.42
    chunks.append(np.zeros(int(gap * SR))); t += gap
chunks.append(np.zeros(int(2.0 * SR))); t += 2.0
voice = np.concatenate(chunks); voice = voice / (np.abs(voice).max() + 1e-9) * 0.95
sf.write("voice.wav", voice, SR)
FPS = 24; hop = SR // FPS; nfr = int(t * FPS) + 1
pad = np.pad(voice, (0, max(0, nfr * hop - len(voice))))
rms = np.sqrt(np.mean(pad[:nfr * hop].reshape(nfr, hop) ** 2, axis=1))
envv = np.clip(rms / (np.percentile(rms[rms > 1e-4], 90) + 1e-9), 0, 1)
json.dump({"duration": round(t, 3), "lines": tl, "env": [round(float(v), 2) for v in envv]}, open("timeline.json", "w"), ensure_ascii=False, indent=1)
json.dump(report, open('tts38_report.json', 'w'), ensure_ascii=False, indent=1)
bad = [r for r in report if r['cer'] > 0.2]
print(f'total {t:.1f}s, lines {len(tl)}, flagged {len(bad)}:', [(r['i'], r['cer']) for r in bad])
